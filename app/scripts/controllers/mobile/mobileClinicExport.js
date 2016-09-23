'use strict';

angular.module('bsis')
  .controller('MobileClinicExportCtrl', function($scope, $filter, $location, $routeParams, $log, MobileService, uiGridExporterConstants) {

    $scope.venues = [];
    $scope.search = {};
    $scope.searching = false;
    $scope.submitted = false;
    $scope.error = {};

    var master = {
      venues: [],
      clinicDate: null
    };

    var columnDefs = [
      {
        field: 'venue.name',
        name: 'venue',
        displayName: 'Venue',
        width: '**'
      },
      {
        field: 'donorNumber',
        name: 'donorNumber',
        displayName: 'Donor Number',
        width: '**',
        maxWidth: '125'
      },
      {
        field: 'firstName',
        name: 'firstName',
        displayName: 'First Name',
        width: '**'
      },
      {
        field: 'lastName',
        name: 'lastName',
        displayName: 'Last Name',
        width: '**'
      },
      {
        field: 'gender',
        name: 'gender',
        displayName: 'Gender',
        width: '**',
        maxWidth: '80'
      },
      {
        field: 'birthDate',
        name: 'birthDate',
        displayName: 'Date of Birth',
        cellFilter: 'bsisDate',
        maxWidth: '150'
      },
      {
        field: 'bloodType',
        name: 'bloodType',
        displayName: 'Blood Type',
        maxWidth: '100'
      },
      {
        field: 'eligibility',
        name: 'eligibility',
        displayName: 'Eligibility',
        cellFilter: 'eligibility',
        maxWidth: '150'
      }
    ];

    function resetUIGridPage() {
      if ($scope.gridApi != null) {
        $scope.gridApi.pagination.seek(1);
      }
    }

    $scope.gridOptions = {
      data: [],
      enableSorting: false,
      paginationPageSize: 10,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,

      // Format values for exports
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'birthDate') {
          return $filter('bsisDate')(value);
        } else if (col.name === 'eligibility') {
          return $filter('eligibility')(value);
        } else {
          return value;
        }
      },

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.exportMobileClinics = function() {
      if ($scope.mobileClinicExportForm && $scope.mobileClinicExportForm.$invalid) {
        return;
      }

      resetUIGridPage();

      $location.search(angular.extend({search: true}, $scope.search));

      var search = {
        venueIds: $scope.search.venues,
        clinicDate: $filter('isoString')($scope.search.clinicDate)
      };

      $scope.searching = true;
      MobileService.mobileClinicExport(search, function(res) {
        $scope.gridOptions.data = res.donors;
        $scope.searching = false;
        $scope.submitted=true;
      }, function(err) {
        $scope.error.message = err.data.userMessage;
        $scope.searching = false;
      });
    };

    $scope.clear = function() {
      $scope.gridOptions.data = null;
      $scope.gridOptions.enableSorting = false;
      $scope.error = {};
      $scope.search = angular.copy(master);
      $scope.searching = false;
      $scope.submitted = false;
      $location.search({});
      $scope.mobileClinicExportForm.$setPristine();
    };

    $scope.clearVenues = function() {
      $scope.search.venues = [];
    };

    $scope.export = function(format) {
      if (format === 'csv') {
        $scope.gridApi.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
      }
    };

    function init() {
      MobileService.getMobileClinicLookUpFormFields(function(response) {
        $scope.venues = response.venues;

        // select clinicDate from route params (if available)
        $scope.search.clinicDate = angular.isUndefined($routeParams.clinicDate) ? master.clinicDate : new Date($routeParams.clinicDate);

        // Select venues from route params
        if ($routeParams.venues) {
          var venues = angular.isArray($routeParams.venues) ? $routeParams.venues : [$routeParams.venues];
          $scope.search.venues = venues.map(function(venueId) {
            // Cast id to number
            return +venueId;
          });
        } else {
          $scope.search.venues = master.venues;
        }

      }, function(err) {
        $log.error(err);
        if (err && err.userMessage) {
          $scope.error.message = err.userMessage;
        } else {
          $scope.error.message = 'An error occurred.';
        }
      });
    }

    init();

  });
