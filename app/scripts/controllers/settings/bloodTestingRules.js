'use strict';

angular.module('bsis').controller('BloodTestsCtrl', function($scope, $log, ICONS) {

  var columnDefs = [
    {
      name: 'Blood Test',
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
      name: 'Donation Field',
      field: 'donationFieldChanged',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Test Outcome',
      field: 'pattern',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Donation Field Value',
      field: 'newInformation',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Enabled',
      field: 'isDeleted',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
        '<span ng-show="!row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARECHECK}}""></i></span>' +
        '<span ng-show="row.entity.isDeleted"><i class="fa {{grid.appScope.icons.SQUARE}}""></i></span></div>',
      width: '**',
      maxWidth: '120'
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

  function getMockedRules() {
    return [
      {'id':1, 'testNameShort':'ABO', 'category':'Blood Typing', 'donationFieldChanged':'Blood ABO', 'pattern':'O', 'newInformation':'O', 'isDeleted':false},
      {'id':2, 'testNameShort':'ABO', 'category':'Blood Typing', 'donationFieldChanged':'Blood ABO', 'pattern':'AB', 'newInformation':'AB', 'isDeleted':false},
      {'id':3, 'testNameShort':'ABO', 'category':'Blood Typing', 'donationFieldChanged':'Blood ABO', 'pattern':'B', 'newInformation':'B', 'isDeleted':true},
      {'id':4, 'testNameShort':'Rh', 'category':'Blood Typing', 'donationFieldChanged':'Blood Rh', 'pattern':'POS', 'newInformation':'+', 'isDeleted':false},
      {'id':5, 'testNameShort':'Rh', 'category':'Blood Typing', 'donationFieldChanged':'Blood Rh', 'pattern':'NEG', 'newInformation':'-', 'isDeleted':false}
    ];
  }

  function init() {
    $scope.gridOptions.data = getMockedRules();
  }

  init();

});