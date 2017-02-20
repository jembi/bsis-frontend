'use strict';

angular.module('bsis').controller('TransfusionReactionTypesCtrl', function($scope, $filter, $location, $log, $timeout, ICONS, TransfusionReactionTypesService) {

  $scope.icons = ICONS;
  $scope.transfusionReactionTypes = {};

  var columnDefs = [
    {
      name: 'Name',
      field: 'name',
      width: '**',
      maxWidth: '300'
    },
    {
      name: 'Description',
      displayName: 'Description',
      field: 'description',
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

  $scope.getTransfusionReactionTypes = function() {
    TransfusionReactionTypesService.getTransfusionReactionTypes(function(response) {
      if (response !== false) {
        $scope.gridOptions.data = response;
        $scope.transfusionReactionTypes = response;
        $scope.transfusionReactionTypesCount = $scope.transfusionReactionTypes.length;
      }
    });
  };

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

  $scope.getTransfusionReactionTypes();
});
