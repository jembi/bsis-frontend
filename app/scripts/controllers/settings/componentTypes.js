'use strict';

angular.module('bsis').controller('ComponentTypesCtrl', function($scope, $location, $routeParams, $log, ICONS, ComponentTypesService) {

  var columnDefs = [
    {
      name: 'Name',
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'ComponentCode',
      displayName: 'Component Code',
      field: 'componentTypeCode',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'CanBeIssued',
      displayName: 'Can be Issued',
      field: 'canBeIssued',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span ng-show="row.entity.canBeIssued"><i class="fa {{grid.appScope.icons.SQUARECHECK}}"></i></span>' +
        '<span ng-show="!row.entity.canBeIssued"><i class="fa {{grid.appScope.icons.SQUARE}}"></i></span></div>',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'ExpiresAfter',
      displayName: 'Expires After',
      field: 'expiresAfter',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.expiresAfter}} {{row.entity.expiresAfterUnits | titleCase}}</div>',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'Enabled',
      field: 'isDeleted',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span ng-show="!row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARECHECK}}"></i></span>' +
        '<span ng-show="row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARE}}"></i></span></div>',
      width: '**',
      maxWidth: '100'
    }
  ];

  $scope.icons = ICONS;

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 10,
    columnDefs: columnDefs,
    rowTemplate: 'views/template/clickablerow.html',

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  function init() {
    ComponentTypesService.getComponentTypes(function(response) {
      $scope.gridOptions.data = response.componentTypes;
    }, $log.error);
  }

  $scope.onRowClick = function(row) {
    //$location.path('/manageComponentType/' + row.entity.id);
    $log.info('Not implemented yet for ' + row.entity.id);
  };

  init();

});