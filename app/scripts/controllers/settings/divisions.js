'use strict';

angular.module('bsis').controller('DivisionsCtrl', function($scope, $location, $routeParams, $filter, $timeout) {

  var masterSearch = {
    name: null,
    includeSimilarResults: true,
    level: null
  };

  function init() {
    // Refresh search if route params are set
    if ($routeParams.search) {
      $scope.search = {
        name: $routeParams.name,
        includeSimilarResults: $routeParams.includeSimilarResults,
        level: $routeParams.level ? +$routeParams.level : null
      };

      $scope.findDivisions();
    }
  }

  // Initialise scope variables
  $scope.search = angular.copy(masterSearch);
  $scope.searching = false;

  $scope.divisionLevels = [1, 2, 3].map(function(value) {
    return {
      label: $filter('divisionLevel')(value),
      value: value
    };
  });

  $scope.gridOptions = {
    data: null,
    columnDefs: [
      {displayName: 'Name', field: 'name'},
      {displayName: 'Division Level', field: 'level', cellFilter: 'divisionLevel'},
      {displayName: 'Parent Division', field: 'parentDivision.name'}
    ],
    paginationPageSize: 7,
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 7,
    rowTemplate: 'views/template/clickablerow.html',
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.onRowClick = function(row) {
    $location.path('/manageDivision/' + row.entity.id).search({});
  };

  $scope.findDivisions = function() {

    if ($scope.searchForm && $scope.searchForm.$invalid) {
      // Form is invalid so don't continue
      return;
    }

    $scope.searching = true;
    $location.search(angular.extend({search: true}, $scope.search));

    // TODO: Call api
    $timeout(function() {

      $scope.gridOptions.data = [
        {
          id: 1,
          name: 'Province ABC',
          level: 1,
          parentDivision: null
        }, {
          id: 2,
          name: 'Province XYZ',
          level: 1,
          parentDivision: null
        }, {
          id: 3,
          name: 'District HIJ',
          level: 2,
          parentDivision: {
            id: 1,
            name: 'Province ABC'
          }
        }
      ];

      $scope.searching = false;
    }, 1000);
  };

  $scope.clearSearch = function() {
    $scope.gridOptions.data = null;
    $scope.search = angular.copy(masterSearch);
    $location.search({});
    $scope.searchForm.$setPristine();
  };

  init();
});
