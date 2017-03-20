'use strict';

angular.module('bsis')
  .controller('DonationTypesReportCtrl', function($scope, $log, $filter, ReportsService, ReportGeneratorService, ReportsLayoutService, DATEFORMAT) {

    // Initialize variables

    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    var donationTypes = null;

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);

    var dataValues = null;

    // Report methods
    function initRow(dataValue, newLocation) {
      var row = {};
      var venue = '';
      if (newLocation) {
        venue = dataValue.location.name;
      }

      row.venue = venue;
      row.gender = '';

      angular.forEach(donationTypes, function(donationType) {
        row[donationType.type] = 0;
      });
      row.total = 0;

      return row;
    }

    function populateRow(row, dataValue) {
      var gender = ReportGeneratorService.getCohort(dataValue, 'Gender').option;
      var donationType = ReportGeneratorService.getCohort(dataValue, 'Donation Type').option;

      row.gender = gender;

      row[donationType] += dataValue.value;
      row.total += dataValue.value;
    }

    function addSubtotalsRow(rows) {
      var subtotalsRow = initRow();
      subtotalsRow.gender = 'All';
      angular.forEach(rows, function(row, key) {
        angular.forEach(donationTypes, function(donationType) {
          subtotalsRow[donationType.type] += rows[key][donationType.type];
        });
        subtotalsRow.total += rows[key].total;
      });

      return subtotalsRow;
    }

    function addPercentageRow(rows) {
      var subtotalsRow = angular.copy(addSubtotalsRow(rows));
      subtotalsRow.gender = '%';

      angular.forEach(donationTypes, function(donationType) {
        subtotalsRow[donationType.type] = $filter('number')(subtotalsRow[donationType.type] / subtotalsRow.total * 100, 2) + '%';
      });

      subtotalsRow.total = $filter('number')(subtotalsRow.total / subtotalsRow.total * 100, 2) + '%';

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

      ReportsService.generateDonationsReport(period, function(report) {
        $scope.searching = false;
        $scope.venuesNumber = 0;
        if (report.dataValues.length > 0) {
          dataValues = report.dataValues;
          var data = ReportGeneratorService.generateDataRowsGroupingByLocationAndCohort(dataValues, 'Gender', initRow, populateRow, addSubtotalsRow, addPercentageRow);
          $scope.gridOptions.data = data[0];
          $scope.venuesNumber = data[1];
          $scope.gridOptions.paginationCurrentPage = 1;
        } else {
          $scope.gridOptions.data = [];
        }
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.log(err);
      });
    };

    // Grid ui variables and methods
    function initColumns() {
      var columns = [
        { name: 'Venue', field: 'venue', width: '**', minWidth: '250' },
        { name: 'Gender', field: 'gender', width: '**', maxWidth: '150' }
      ];

      angular.forEach(donationTypes, function(donationType) {
        columns.push({
          name: donationType.type,
          field: donationType.type,
          width: '**',
          maxWidth: '125'
        });
      });

      columns.push({ name: 'Total', field: 'total', width: '**', maxWidth: '125' });

      return columns;
    }

    var columnDefs = [];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 8,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: 8,

      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfPortraitMaxGridWidth,

      // PDF header
      exporterPdfHeader: function() {
        var header =  ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
          'Donations Collected By Type Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
        return header;
      },

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        if ($scope.venuesNumber > 1) {
          var summaryRows = ReportGeneratorService.generateSummaryRowsGroupingByCohort(dataValues, 'Gender', initRow, populateRow, addSubtotalsRow, addPercentageRow);
          docDefinition = ReportsLayoutService.addSummaryContent(summaryRows, docDefinition);
        }
        docDefinition = ReportsLayoutService.highlightTotalRows('All', 1, docDefinition);
        docDefinition = ReportsLayoutService.highlightPercentageRows('%', 1, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(44, docDefinition);
        return docDefinition;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('venues', $scope.venuesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

    function init() {
      ReportsService.getDonationsReportForm(function(response) {
        donationTypes = response.donationTypes;
        columnDefs = initColumns();
      }, $log.error);
    }

    init();
  });
