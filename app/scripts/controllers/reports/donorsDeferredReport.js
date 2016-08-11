'use strict';

angular.module('bsis').controller('DonorsDeferredReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT) {

  // Initialize variables

  var master = {
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate()
  };

  $scope.dateFormat = DATEFORMAT;
  $scope.search = angular.copy(master);

  // Report methods

  $scope.clearSearch = function(form) {
    $scope.search = angular.copy(master);
    form.$setPristine();
    form.$setUntouched();
    $scope.gridOptions.data = [];
    $scope.submitted = false;
  };

  var deferralReasons = [
    'Test Outcomes',
    'High risk behaviour',
    'Low weight',
    'Low haemoglobin',
    'Other reasons',
    'Other medical conditions',
    'Travel history'
  ];

  function createZeroValuesRow(venue, gender) {
    var row = {
      venue: venue,
      gender: gender,
      total: 0
    };

    // Initialise columns
    angular.forEach(deferralReasons, function(column) {
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
    angular.forEach(deferralReasons, function(column) {
      row[column] = femaleRow[column] + maleRow[column];
    });

    return row;
  }

  function addTotalColumn(row) {
    var total = 0;
    angular.forEach(deferralReasons, function(column) {
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

    $scope.gridOptions.data = rows;
  }

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

  // Grid ui variables and methods
  var columnDefs = [
    {name: 'Venue', field: 'venue', width: '**', minWidth: '250'},
    {name: 'Gender', field: 'gender', width: '**', maxWidth: '150'}
  ];
  // Add deferral reason columns
  angular.forEach(deferralReasons, function(column) {
    columnDefs.push({name: column, field: column, width: '**', maxWidth: '125'});
  });
  // Add total column
  columnDefs.push({name: 'Total', field: 'total', width: '**', maxWidth: '125'});

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
      return ReportsLayoutService.generatePdfPageHeader('Donors Deferred Summary Report',
        ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
    },

    // Change formatting of PDF
    exporterPdfCustomFormatter: function(docDefinition) {
      docDefinition = ReportsLayoutService.highlightTotalRows('All', 1, docDefinition);
      docDefinition = ReportsLayoutService.paginatePdf(48, docDefinition);
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

});
