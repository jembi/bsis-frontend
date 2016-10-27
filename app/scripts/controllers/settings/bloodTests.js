'use strict';

angular.module('bsis').controller('BloodTestsCtrl', function($scope) {

  var columnDefs = [
    {
      name: 'Name',
      field: 'testNameShort',
      width: '150'
    },
    {
      name: 'Category',
      field: 'category',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'BloodTestType',
      displayName: 'Blood Test Type',
      field: 'bloodTestType',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'IsActive',
      displayName: 'In Active Use',
      field: 'isActive',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span ng-show="row.entity.isActive"><i class="fa {{grid.appScope.icons.SQUARECHECK}}"></i></span>' +
        '<span ng-show="!row.entity.isActive"><i class="fa {{grid.appScope.icons.SQUARE}}"></i></span></div>',
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
      maxWidth: '115'
    }
  ];


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
   // To be initialised in the Hook up task
  }

  init();

});