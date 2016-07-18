'use strict';

angular.module('bsis').controller('LocationsCtrl', function($scope, $location, $log, ICONS, LocationsService) {

  var master = {
    name: '',
    includeSimilarResults: false,
    locationType: null
  };

  var columnDefs = [
    {
      name: 'Name',
      field: 'name',
      width: '**'
    },
    {
      name: 'Enabled',
      field: 'isDeleted',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span ng-show="!row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARECHECK}}"></i></span>' +
        '<span ng-show="row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARE}}"></i></span></div>',
      width: '**',
      maxWidth: '200'
    }
  ];

  $scope.icons = ICONS;
  $scope.locationSearch = {};
  $scope.locationType = [];
  $scope.searching = false;
  $scope.submitted = false;

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 7,
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 7,
    columnDefs: columnDefs,
    rowTemplate: 'views/template/clickablerow.html',

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.onRowClick = function(row) {
    //$location.path('/viewLocation/' + row.entity.id);
    $log.info('Not implemented yet ' + row.entity.id);
  };

  $scope.init = function() {
    $scope.gridOptions.data = [];
    $scope.locationSearch = angular.copy(master);
    $scope.submitted = false;
    $scope.searching = false;
    LocationsService.getSearchForm(function(response) {
      $scope.locationType = response.locationType;
    }, $log.error);
  };

  $scope.findLocations = function() {
    if ($scope.findLocationForm.$invalid) {
      return;
    }
    $scope.submitted = false;
    $scope.searching = true;
    LocationsService.search($scope.locationSearch, function(response) {
      $scope.gridOptions.data = response.locations;
      $scope.submitted = true;
      $scope.searching = false;
    }, function(error) {
      $log.error(error);
      $scope.searching = false;
    });
  };

  $scope.init();

});
