'use strict';

angular.module('bsis')
  .controller('MobileCtrl', function($scope, $filter, $location, $routeParams, MobileService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        return !!($location.path() === '/mobile' && path === '/lookUp');
      }
    };

    $scope.venue = '';
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
      venue: angular.isUndefined($routeParams.venue) ? master.venue : $routeParams.venue,
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
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,

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

        var columns = [
          {text: 'Venue: ' + $scope.currentSearch.venue, width: 'auto'}
        ];

        // Include Clinic Date
        if ($scope.currentSearch.clinicDate) {
          var clinicDate = $filter('bsisDate')($scope.currentSearch.clinicDate);
          columns.push({text: 'Clinic Date: ' + clinicDate, width: 'auto'});
        }

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
          margin: [30, 0]
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

      var search = angular.extend({}, $scope.currentSearch, {

      });

      $location.search(angular.extend({}, search, {search: true}));

      $scope.searching = true;
      MobileService.mobileClinicLookUp(search, function(res) {
        $scope.gridOptions.data = res;
        $scope.searching = false;
      }, function(err) {
        $scope.error.message = err.userMessage;
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

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      }
    };

  });