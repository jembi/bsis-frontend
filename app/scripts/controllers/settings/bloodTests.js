'use strict';

angular.module('bsis').controller('BloodTestsCtrl', function($scope, $log, ICONS, BloodTestsService) {

  var columnDefs = [
    {
      name: 'Name',
      field: 'testName',
      width: '**'
    },
    {
      name: 'Short Name',
      field: 'testNameShort',
      width: '**'
    },
    {
      name: 'Category',
      field: 'category',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'BloodTestType',
      displayName: 'Blood Test Type',
      field: 'bloodTestType',
      width: '**',
      maxWidth: '200'
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
    BloodTestsService.getBloodTests(function(response) {
      $scope.gridOptions.data = response.bloodTests;
    }, $log.error);
  }

  init();

});