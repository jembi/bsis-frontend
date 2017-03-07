'use strict';

angular.module('bsis')
  .controller('BloodUnitsIssuedReportCtrl', function($scope, $log, $filter, DATEFORMAT, ReportsService, ReportGeneratorService, ReportsLayoutService) {

    // Initialize variables
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    var componentTypes = [];
    var mergedData = [];

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);

    function initialise() {
      ReportsService.getBloodUnitsIssuedReportForm(function(response) {
        componentTypes = response.componentTypes;
        $scope.distributionsSiteNumber = 0;
      }, $log.error);
    }

    // Report methods

    function createZeroValuesRow(componentType, distributionSite) {
      var zeroValuesRow = {};
      zeroValuesRow.cohorts = distributionSite;
      zeroValuesRow.cohorts = componentType;
      zeroValuesRow.ordered = 0;
      zeroValuesRow.issued = 0;
      zeroValuesRow.requested = 0;
      zeroValuesRow.orderedGap = 0;
      zeroValuesRow.requestedGap = 0;
      zeroValuesRow.orderedRate = $filter('number')(0, 2);
      zeroValuesRow.requestedRate = $filter('number')(0, 2);
      return zeroValuesRow;
    }

    function createAllComponentTypesRow(componentTypesRows) {
      var allComponentTypesRow = null;
      angular.forEach(componentTypesRows, function(row) {
        if (allComponentTypesRow == null) {
          allComponentTypesRow = createZeroValuesRow('Total Blood Units');
        }
        allComponentTypesRow.ordered = allComponentTypesRow.ordered + row.ordered;
        allComponentTypesRow.issued = allComponentTypesRow.issued + row.issued;
        allComponentTypesRow.requested = allComponentTypesRow.requested + row.requested;
        allComponentTypesRow.oderedGap = allComponentTypesRow.oderedGap + row.oderedGap;
        allComponentTypesRow.orderedRate = $filter('number')(allComponentTypesRow.issued / allComponentTypesRow.ordered * 100, 2);
        allComponentTypesRow.requestedGap = allComponentTypesRow.requestedGap + row.requestedGap;
        allComponentTypesRow.requestedRate = $filter('number')(allComponentTypesRow.issued / allComponentTypesRow.requested * 100, 2);
      });
      return allComponentTypesRow;
    }

    function initRow(types) {
      // initialise the componentTypes rows
      angular.forEach(types, function(componentType) {
        mergedData.push(createZeroValuesRow(componentType.componentTypeName));
      });
    }

    function mergeData(dataValues) {

      // merge data from report
      angular.forEach(dataValues, function(newRow) {
        var componentType = ReportGeneratorService.getCohort(newRow, 'Component Type').option;
        var distributionSite = ReportGeneratorService.getCohort(newRow, 'Distribution scope').option;
        var rowData = $filter('filter')(mergedData, { cohorts: componentType})[0];
        rowData = $filter('filter')(mergedData, { cohorts: distributionSite})[0];

        // add new ordered/issued/requested values and calculate gaps & rates
        if (newRow.id === 'unitsOrdered') {
          rowData.ordered = rowData.ordered + newRow.value;
        } else if (newRow.id === 'unitsIssued') {
          rowData.issued = rowData.issued + newRow.value;
        } else if (newRow.id === 'unitsRequested') {
          rowData.requested = rowData.requested + newRow.value;
        }
        rowData.orderedGap = rowData.ordered - rowData.issued;
        rowData.orderedRate = $filter('number')(rowData.issued / rowData.ordered * 100, 2);
        rowData.requestedGap = rowData.requested - rowData.issued;
        rowData.requestedRate = $filter('number')(rowData.issued / rowData.requested * 100, 2);
      });

      // add the Total Blood Units row
      mergedData.push(createAllComponentTypesRow(mergedData));

      $scope.gridOptions.data = mergedData;
    }

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
      $scope.submitted = false;
    };

    $scope.getReport = function(selectPeriodForm) {

      if (!selectPeriodForm.$valid) {
        return;
      }

      var period = {};
      if ($scope.search.startDate) {
        var startDate = moment($scope.search.startDate).startOf('day').toDate();
        period.startDate = startDate;
      }
      if ($scope.search.endDate) {
        var endDate = moment($scope.search.endDate).endOf('day').toDate();
        period.endDate = endDate;
      }

      $scope.searching = true;
      ReportsService.generateBloodUnitsIssuedReport(period, function(report) {
        $scope.searching = false;
        if (report.dataValues.length > 0) {
          var data = ReportGeneratorService.generateDataRowsGroupingByLocation(report.dataValues, componentTypes, initRow, mergeData);
          $scope.gridOptions.data = data[0];
          $scope.distributionSitesNumber = data[1];

          // Add summary row
          if ($scope.distributionSitesNumber > 1) {
            var summaryRow = ReportGeneratorService.generateSummaryRow(report.dataValues, componentTypes, initRow, mergeData);
            summaryRow.distributionSite = 'All Sites';
            $scope.gridOptions.data.push(summaryRow);
          }
          $scope.gridOptions.paginationCurrentPage = 1;
        } else {
          $scope.gridOptions.data = [];
          $scope.distributionSitesNumber = 0;
        }
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.error(err);
      });
    };

    // Grid ui variables and methods
    var columnDefs = [
      { displayName: 'Distribution Site', field: 'cohorts', width: '**'},
      { displayName: 'Component Type', field: 'cohorts', width: '**'},
      { displayName: 'Ordered', field: 'ordered', width: 100 },
      { displayName: 'Issued', field: 'issued', width: 100 },
      { displayName: 'Gap', field: 'orderedGap', width: 100 },
      { displayName: '% Issued vs Ordered', field: 'rate', width: 250 },
      { displayName: 'Patient Requests', field: 'requested', width: 100 },
      { displayName: 'Issued', field: 'issued', width: 100 },
      { displayName: 'Gap', field: 'requestedGap', width: 100 },
      { displayName: '% Issued vs Requests', field: 'requestedRate', width: 250 }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 12,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: 12,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfPortraitMaxGridWidth,

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = ReportsLayoutService.highlightTotalRows('Total Blood Units', 0, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(33, docDefinition);
        return docDefinition;
      },

      // Reformat column data
      exporterFieldCallback: function(grid, row, col, value) {
        value = ReportsLayoutService.addPercentages(col, value);
        return value;
      },

      // PDF header
      exporterPdfHeader: function() {
        var distributionSitesNumberLine = 'Distribution Sites: ' + $scope.distributionsSitesNumber;
        var header =  ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
          'Blood Units Issued Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)], distributionSitesNumberLine);
        return header;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('sites', $scope.distributionSitesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
      },

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    initialise();

  });
