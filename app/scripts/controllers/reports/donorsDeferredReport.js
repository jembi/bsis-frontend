'use strict';

angular.module('bsis').controller('DonorsDeferredReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT, uiGridConstants) {

  // Initialize variables

  var master = {
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate()
  };

  $scope.deferralReasons = [];

  // UI grid initial columns
  var columnDefs = [
    {displayName: 'Venue', field: 'venue', width: '**', minWidth: '250'},
    {displayName: 'Gender', field: 'gender', width: '**', maxWidth: '150'},
    {displayName: 'Total', field: 'total', width: '**', maxWidth: '125'}
  ];

  function createZeroValuesRow(venue, gender) {
    var row = {
      venue: venue,
      gender: gender,
      total: 0
    };

    // Initialise columns
    angular.forEach($scope.deferralReasons, function(column) {
      row[column] = 0;
    });

    return row;
  }

  function createAllGendersRow(femaleRow, maleRow) {
    var row = {
      venue: '',
      gender: 'All',
      total: femaleRow.total + maleRow.total
    };

    // Sum columns
    angular.forEach($scope.deferralReasons, function(column) {
      row[column] = femaleRow[column] + maleRow[column];
    });

    return row;
  }

  function addTotalColumn(row) {
    var total = 0;
    angular.forEach($scope.deferralReasons, function(column) {
      total += row[column];
    });
    row.total = total;
    return row;
  }

  function mergeData(dataValues) {

    var previousVenue = null;
    var mergedFemaleRow = {};
    var mergedMaleRow = {};
    var rows = [];

    angular.forEach(dataValues, function(dataValue) {

      var gender = dataValue.cohorts[0].option;
      var deferralReason = dataValue.cohorts[1].option;

      // New venue
      if (dataValue.venue.name !== previousVenue) {

        if (previousVenue !== null) {
          // Add female, male and all rows for previous venue
          rows.push(addTotalColumn(mergedFemaleRow));
          rows.push(addTotalColumn(mergedMaleRow));
          rows.push(createAllGendersRow(mergedFemaleRow, mergedMaleRow));
        }

        // Initialize values for the new venue
        mergedFemaleRow = createZeroValuesRow(dataValue.venue.name, 'female');
        mergedMaleRow = createZeroValuesRow('', 'male');

        // Store the previous venue name
        previousVenue = dataValue.venue.name;
      }

      // Create a row containing the value
      var row = {};
      row[deferralReason] = dataValue.value;

      // Merge gender row with new row
      if (gender === 'female') {
        mergedFemaleRow = angular.merge(mergedFemaleRow, row);
      } else if (gender === 'male') {
        mergedMaleRow = angular.merge(mergedMaleRow, row);
      }
    });

    // Add female, male and all rows for previous venue
    rows.push(addTotalColumn(mergedFemaleRow));
    rows.push(addTotalColumn(mergedMaleRow));
    rows.push(createAllGendersRow(mergedFemaleRow, mergedMaleRow));

    // Update the data
    $scope.gridOptions.data = rows;
  }

  function init() {
    ReportsService.getDonorsDeferredReportForm(function(res) {
      // Add deferral reason columns
      angular.forEach(res.deferralReasons, function(column) {
        $scope.deferralReasons.push(column.reason);
        columnDefs.splice(2, 0, {displayName: column.reason, field: column.reason, width: '**', maxWidth: '125'});
      });

      // Notify the grid of the changes if it has been initialised
      if ($scope.gridApi) {
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      }
    }, function(err) {
      $log.error(err);
    });
  }

  $scope.dateFormat = DATEFORMAT;
  $scope.search = angular.copy(master);

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

    ReportsService.generateDonorsDeferredReport(period, function(report) {
      $scope.searching = false;
      if (report.dataValues.length > 0) {
        mergeData(report.dataValues);
      }
      $scope.submitted = true;
    }, function(err) {
      $scope.searching = false;
      $log.log(err);
    });
  };

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 9,
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 9,

    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
    exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
    exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

    // PDF header
    exporterPdfHeader: function() {
      return ReportsLayoutService.generatePdfPageHeader('Donors Deferred Summary Report',
        ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
    },

    // Change formatting of PDF
    exporterPdfCustomFormatter: function(docDefinition) {
      docDefinition = ReportsLayoutService.highlightTotalRows('All', 1, docDefinition);
      docDefinition = ReportsLayoutService.paginatePdf(33, docDefinition);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      return ReportsLayoutService.generatePdfPageFooter('venues', $scope.gridOptions.data.length / 3, currentPage, pageCount);
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

  init();

});
