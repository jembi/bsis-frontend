'use strict';

angular.module('bsis')
  .controller('BloodUnitsIssuedReportCtrl', function($scope, $log, $filter, DATEFORMAT, ReportsService, ReportGeneratorService, ReportsLayoutService) {

    // Initialize variables
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);
    var dataValues = null;

    // Report methods

    function initRow(dataValue, newLocation) {
      var row = {};
      var distributionSite = '';
      if (newLocation) {
        distributionSite = dataValue.location.name;
      }
      row.distributionSite = distributionSite;
      row.componentType = '';
      row.ordered = 0;
      row.issued = 0;
      row.issuedAndRequested = 0;
      row.requested = 0;
      row.orderedGap = 0;
      row.requestedGap = 0;
      row.orderedRate = $filter('number')(0, 2);
      row.requestedRate = $filter('number')(0, 2);
      return row;
    }

    function populateRow(row, dataValue) {
      var componentType = ReportGeneratorService.getCohort(dataValue, 'Component Type').option;
      var orderType = ReportGeneratorService.getCohort(dataValue, 'Order Type').option;

      row.componentType = componentType;

      if (dataValue.id === 'unitsOrdered') {
        row.ordered = row.ordered + dataValue.value;
      } else if (dataValue.id === 'unitsIssued') {
        row.issuedAndRequested = row.issuedAndRequested + dataValue.value;

        if (orderType === 'PATIENT_REQUEST') {
          row.requested = row.requested + dataValue.value;
        } else {
          row.issued = row.issued + dataValue.value;
        }
      }

      row.orderedGap = row.ordered - row.issuedAndRequested;
      row.orderedRate = $filter('number')(row.issuedAndRequested / row.ordered * 100, 2);
      row.requestedGap = row.requested - row.issued;
      row.requestedRate = $filter('number')(row.requested / row.issuedAndRequested * 100, 2);
    }

    function addSubtotalsRow(rows) {
      var subtotalsRow = {};
      subtotalsRow.distributionSite = '';
      subtotalsRow.componentType = 'All';
      subtotalsRow.ordered = 0;
      subtotalsRow.issued = 0;
      subtotalsRow.issuedAndRequested = 0;
      subtotalsRow.requested = 0;
      angular.forEach(rows, function(row, key) {
        subtotalsRow.ordered += rows[key].ordered;
        subtotalsRow.issued += rows[key].issued;
        subtotalsRow.issuedAndRequested += rows[key].issuedAndRequested;
        subtotalsRow.requested += rows[key].requested;
      });

      subtotalsRow.orderedGap = subtotalsRow.ordered - subtotalsRow.issuedAndRequested;
      subtotalsRow.orderedRate = $filter('number')(subtotalsRow.issuedAndRequested / subtotalsRow.ordered * 100, 2);
      subtotalsRow.requestedGap = subtotalsRow.requested - subtotalsRow.issued;
      subtotalsRow.requestedRate = $filter('number')(subtotalsRow.requested / subtotalsRow.issuedAndRequested * 100, 2);
      return subtotalsRow;
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
          dataValues = report.dataValues;
          var data = ReportGeneratorService.generateDataRowsGroupingByLocationAndCohort(dataValues, 'Component Type', initRow, populateRow, addSubtotalsRow);
          $scope.gridOptions.data = data[0];
          $scope.sitesNumber = data[1];
          $scope.gridOptions.paginationCurrentPage = 1;
        } else {
          $scope.gridOptions.data = [];
          $scope.sitesNumber = 0;
          dataValues = null;
        }
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.error(err);
      });
    };

    // Grid ui variables and methods
    var columnDefs = [
      { displayName: 'Distribution Site', field: 'distributionSite', width: '**', minWidth: 200},
      { displayName: 'Component Type', field: 'componentType', width: '**', minWidth: 200},
      { displayName: 'Ordered', field: 'ordered', width: 100 },
      { displayName: 'Issued', field: 'issuedAndRequested', width: 100 },
      { displayName: 'Gap', field: 'orderedGap', width: 100 },
      { displayName: '% Issued vs Ordered', field: 'orderedRate', width: 100 },
      { displayName: 'Patient Requests', field: 'requested', width: 100 },
      { displayName: 'Issued', field: 'issued', width: 100 },
      { displayName: 'Gap', field: 'requestedGap', width: 100 },
      { displayName: '% Issued vs Requests', field: 'requestedRate', width: 100 }
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
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        if ($scope.sitesNumber > 1) {
          var summaryRowObjects = ReportGeneratorService.generateDataRowsGroupingByCohort(dataValues, 'Component Type', initRow, populateRow, addSubtotalsRow);
          var summaryRowArrays = ReportGeneratorService.convertRowObjectsToArrays(summaryRowObjects);
          docDefinition = ReportsLayoutService.addSummaryContent(summaryRowArrays, docDefinition);
        }
        docDefinition = ReportsLayoutService.highlightTotalRows('All', 1, docDefinition);
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
        var sitesNumberLine = 'Distribution Sites: ' + $scope.sitesNumber;
        var header =  ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
          'Blood Units Issued Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)],
          sitesNumberLine);
        return header;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('sites', $scope.sitesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

  });
