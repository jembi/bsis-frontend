'use strict';

angular.module('bsis')
  .controller('MobileCtrl', function($scope, $filter, $location, $routeParams, MobileService, uiGridExporterConstants) {

    $scope.venues = [];
    $scope.error = {
      message: null
    };
    $scope.currentSearch = null;

    MobileService.getMobileClinicLookUpFormFields(function(res) {
      $scope.venues = res.venues;
    }, function(err) {
      $scope.error.message = err.userMessage;
    });

    var master = $scope.master = {
      venue: null,
      clinicDate: null
    };

    $scope.search = {
      venue: angular.isUndefined($routeParams.venueId) ? master.venue : +$routeParams.venueId,
      clinicDate: angular.isUndefined($routeParams.clinicDate) ? master.clinicDate : new Date($routeParams.clinicDate)
    };

    var columnDefs = [
      {field: 'donorNumber'},
      {field: 'firstName'},
      {field: 'lastName'},
      {field: 'gender'},
      {
        name: 'Date of Birth',
        field: 'birthDate',
        cellFilter: 'bsisDate'
      },
      {field: 'bloodType'},
      {
        name: 'Eligibility',
        field: 'eligibility',
        cellFilter: 'eligibility'
      }
    ];

    $scope.gridOptions = {
      enableSorting: false,
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      exporterPdfMaxGridWidth: 680,

      // Format values for exports
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'Date of Birth') {
          return $filter('bsisDate')(value);
        } else if (col.name === 'Eligibility') {
          return $filter('eligibility')(value);
        } else {
          return value;
        }

      },

      // PDF header
      exporterPdfHeader: function() {

        var venueName;
        angular.forEach($scope.venues, function(venue) {
          if (venue.id === $scope.currentSearch.venue) {
            venueName = venue.name;
          }
        });

        var columns = [
          {text: 'Venue: ' + venueName, width: 'auto'}
        ];

        // Include Clinic Date
        if ($scope.currentSearch.clinicDate) {
          var clinicDate = $filter('bsisDate')($scope.currentSearch.clinicDate);
          columns.push({text: 'Clinic Date: ' + clinicDate, width: 'auto'});
        }

        // Include Number and Percentage Eligible Donors
        columns.push({text: 'Eligible Donors: ' +
           $scope.numberEligibleDonor + ' out of ' +
           $scope.gridOptions.data.length +
            ' (' + $scope.percentageEligibleDonor + '%)',
          width: 'auto'});

        return [
          {
            text: 'Mobile Clinic Look Up',
            bold: true,
            margin: [30, 10, 30, 0]
          },
          {
            columns: columns,
            columnGap: 10,
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
          margin: [30, 0, 50, 0]
        };
      },

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.onSearch = function(form) {

      if (form && form.$invalid) {
        return;
      }

      $scope.currentSearch = angular.copy($scope.search);

      var search = {
        venueId: $scope.currentSearch.venue,
        clinicDate: $filter('isoString')($scope.currentSearch.clinicDate)
      };

      $location.search(angular.extend({search: true}, search));

      $scope.searching = true;
      MobileService.mobileClinicLookUp(search, function(res) {
        $scope.gridOptions.data = res.donors;
        $scope.numberEligibleDonor = calculateNumberEligibleDonors($scope.gridOptions.data);
        $scope.percentageEligibleDonor = calculatePercentageEligibleDonors($scope.numberEligibleDonor, $scope.gridOptions.data.length);
        $scope.searching = false;
      }, function(err) {
        $scope.error.message = err.data.userMessage;
        $scope.searching = false;
      });
    };

    $scope.onClear = function(form) {
      $scope.currentSearch = null;
      $scope.error.message = null;
      $scope.search = angular.copy(master);
      $location.search({});
      form.$setPristine();
    };

    if ($routeParams.search) {
      $scope.onSearch();
    }

    var calculateNumberEligibleDonors = function(data) {
      var eligibleDonorCount = 0;

      data.forEach(function(donor) {
        if (donor.eligibility) {
          eligibleDonorCount++;
        }
      });

      return eligibleDonorCount;
    };

    var calculatePercentageEligibleDonors = function(numberEligibleDonors, totalNumberDonors) {
      if (totalNumberDonors > 0) {
        return Math.round(numberEligibleDonors / totalNumberDonors * 100);
      } else {
        return 0;
      }
    };

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
      }
    };

  });
