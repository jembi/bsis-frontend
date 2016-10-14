'use strict';

angular.module('bsis').controller('ComponentTypeCombinationsCtrl', function($scope, $location, $routeParams, $log, ICONS) {

  var columnDefs = [
    {
      name: 'Name',
      field: 'combinationName',
      width: '**'
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
    $log.debug('Not implemented yet. Request parameters: ');
    $scope.gridOptions.data = [
      {
        'id': 1,
        'combinationName': 'Whole Blood',
        'isDeleted': false
      },
      {
        'id': 2,
        'combinationName': 'PRC-CPDA-FFP',
        'isDeleted': false
      },
      {
        'id': 3,
        'combinationName': 'PRC-CPDA-FP',
        'isDeleted': false
      },
      {
        'id': 4,
        'combinationName': 'WB Poor Platelets-PC-24H',
        'isDeleted': false
      },
      {
        'id': 5,
        'combinationName': 'PRC-SAGM-FFP-PC',
        'isDeleted': false
      }
    ];
  }

  init();

});