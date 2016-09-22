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

      $location.search(angular.extend({search: true}, $scope.search));

      var search = {
        venueId: $scope.search.venues[0],
        clinicDate: $filter('isoString')($scope.search.clinicDate)
      };

      $scope.searching = true;

      $log.debug('Not implemented yet. Request parameters: ' + angular.toJson(search));
      $scope.gridOptions.data = [
        {
          'eligibility':true,
          'birthDate':'1977-10-20',
          'firstName':'Susy',
          'lastName':'Donor',
          'gender':'female',
          'donorNumber':'020601',
          'bloodType':'A+',
          'venue': {
            'name': 'station'
          }
        }, {
          'eligibility':true,
          'birthDate':'2011-02-03',
          'firstName':'Isabella',
          'lastName':'Donor',
          'gender':'female',
          'donorNumber':'020600',
          'bloodType':'O+',
          'venue': {
            'name': 'station'
          }
        }, {
          'eligibility':false,
          'birthDate':'1988-01-20',
          'firstName':'Bob',
          'lastName':'Donor',
          'gender':'male',
          'donorNumber':'020591',
          'bloodType':'A-',
          'venue': {
            'name': 'school'
          }
        }
      ];
      $scope.searching = false;
      $scope.submitted = true;
    };

    $scope.clear = function() {
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
