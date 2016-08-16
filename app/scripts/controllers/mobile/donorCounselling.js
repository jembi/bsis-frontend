'use strict';

angular.module('bsis').controller('MobileDonorCounsellingCtrl', function($scope, $log, $filter, $location, $routeParams, $timeout, MobileService, uiGridConstants, uiGridExporterConstants, DATEFORMAT) {

  // Initialise controller variables
  var columnDefs = [
    {field: 'donorNumber'},
    {field: 'firstName'},
    {field: 'lastName'},
    {field: 'gender'},
    {field: 'birthDate', cellFilter: 'bsisDate'},
    {field: 'donationDate', cellFilter: 'bsisDate'},
    {displayName: 'DIN', field: 'donationIdentificationNumber'},
    {displayName: 'ABO', field: 'bloodAbo'},
    {displayName: 'Rh', field: 'bloodRh'}
  ];
  var masterSearch = {
    venueId: null,
    startDate: moment().subtract(30, 'days').toDate(),
    endDate: moment().toDate()
  };
  var currentSearch = null;
  var defaultValues = {};

  function init() {
    MobileService.getDonorOutcomesForm(function(res) {
      $scope.venues = res.venues;

      angular.forEach(res.bloodTestNames, function(bloodTestName) {
        // Set the default value for this blood test
        defaultValues[bloodTestName] = 0;

        // Add a column for this blood test
        columnDefs.push({
          displayName: bloodTestName,
          field: bloodTestName,
          visible: false
        });
      });

      // Notify grid of column changes if it has been initialised
      if ($scope.gridApi) {
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
      }

      // Refresh the previous search if there is one
      if ($routeParams.search) {
        $scope.search = {
          venueId: +$routeParams.venueId,
          startDate: new Date($routeParams.startDate),
          endDate: new Date($routeParams.endDate)
        };
        // Allow the form to update before doing the search
        $timeout(function() {
          $scope.getDonorOutcomes();
        });
      }
    }, function(err) {
      $log.error(err);
    });
  }

  function codeBloodTestResults(testResults) {
    var codedResults = {};
    angular.forEach(testResults, function(testResult) {
      var positiveResults = testResult.bloodTest.positiveResults.split(',');
      var negativeResults = testResult.bloodTest.negativeResults.split(',');

      if (positiveResults.indexOf(testResult.result) !== -1) {
        codedResults[testResult.bloodTest.testNameShort] = 2;
      } else if (negativeResults.indexOf(testResult.result) !== -1) {
        codedResults[testResult.bloodTest.testNameShort] = 1;
      } else {
        codedResults[testResult.bloodTest.testNameShort] = 0;
      }
    });
    return codedResults;
  }

  // Initialise scope variables
  $scope.venues = [];
  $scope.searching = false;
  $scope.search = angular.copy(masterSearch);
  $scope.dateFormat = DATEFORMAT;

  $scope.gridOptions = {
    data: null,
    columnDefs: columnDefs,
    paginationPageSize: 10,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    },

    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 500,

    // Format values for exports
    exporterFieldCallback: function(grid, row, col, value) {
      if (col.name === 'birthDate' || col.name === 'donationDate') {
        return $filter('bsisDate')(value);
      } else {
        return value;
      }

    },

    // PDF header
    exporterPdfHeader: function() {

      var venueName = '';
      angular.forEach($scope.venues, function(venue) {
        if (venue.id === currentSearch.venueId) {
          venueName = venue.name;
        }
      });
      var startDate = $filter('bsisDate')(currentSearch.startDate);
      var endDate = $filter('bsisDate')(currentSearch.endDate);

      return [
        {
          text: 'Donor Counselling',
          fontSize: 10,
          bold: true,
          margin: [30, 10, 30, 0]
        },
        {
          columns: [
            {text: 'Venue: ' + venueName, width: 'auto'},
            {text: 'Start Date: ' + startDate, width: 'auto'},
            {text: 'End Date: ' + endDate, width: 'auto'}
          ],
          columnGap: 10,
          fontSize: 6,
          margin: [30, 0]
        }
      ];
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      var columns = [
        {text: 'Total donors: ' + $scope.gridOptions.data.length, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        fontSize: 6,
        margin: [30, 0, 50, 0]
      };
    }
  };

  $scope.getDonorOutcomes = function() {

    if ($scope.donorCounsellingForm && $scope.donorCounsellingForm.$invalid) {
      // Form is invalid so don't continue
      return;
    }

    $scope.searching = true;
    currentSearch = angular.copy($scope.search);
    $location.search({
      search: true,
      venueId: currentSearch.venueId,
      startDate: currentSearch.startDate.toISOString(),
      endDate: currentSearch.endDate.toISOString()
    });

    MobileService.getDonorOutcomes($scope.search, function(res) {
      var rows = [];

      angular.forEach(res.donorOutcomes, function(donorOutcome) {
        var row = {
          donorNumber: donorOutcome.donorNumber,
          lastName: donorOutcome.lastName,
          firstName: donorOutcome.firstName,
          gender: donorOutcome.gender,
          birthDate: donorOutcome.birthDate,
          donationDate: donorOutcome.donationDate,
          donationIdentificationNumber: donorOutcome.donationIdentificationNumber,
          bloodAbo: donorOutcome.bloodAbo,
          bloodRh: donorOutcome.bloodRh
        };

        var codedResults = codeBloodTestResults(donorOutcome.bloodTestResults);
        // Merge the defualt values and coded results into the row
        angular.merge(row, defaultValues, codedResults);
        rows.push(row);
      });

      $scope.gridOptions.data = rows;
      $scope.searching = false;
    }, function(err) {
      $log.error(err);
      $scope.searching = false;
    });
  };

  $scope.clearSearch = function() {
    currentSearch = null;
    $scope.gridOptions.data = null;
    $scope.search = angular.copy(masterSearch);
    $scope.donorCounsellingForm.$setPristine();
    $location.search({});
  };

  $scope.export = function(format) {
    if (format === 'pdf') {
      $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
    } else if (format === 'csv') {
      $scope.gridApi.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
    }
  };

  // Execute initialisation logic
  init();
});
