'use strict';

angular.module('bsis').controller('BloodTestingRulesCtrl', function($scope, $location, $log, ICONS, BloodTestingRulesService) {

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

  $scope.onRowClick = function(row) {
    $location.path('/manageBloodTestingRule/' + row.entity.id);
  };

  function init() {
    BloodTestingRulesService.getBloodTestingRules(function(response) {
      $scope.gridOptions.data = response.bloodTestingRules;
    }, $log.error);
  }

  init();

});
