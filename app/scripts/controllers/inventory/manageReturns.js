'use strict';

angular.module('bsis').controller('ManageReturnsCtrl', function($scope, $location, $log) {

  var columnDefs = [
    {
      name: 'Return Date',
      field: 'returnDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200',
      sort: { direction: 'asc' }
    },
    {
      name: 'Returned From',
      field: 'returnedFrom.name',
      width: '**'
    },
    {
      name: 'Returned To',
      field: 'returnedTo.name',
      width: '**'
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 6,
    paginationPageSizes: [6],
    paginationTemplate: 'views/template/pagination.html',
    rowTemplate: 'views/template/clickablerow.html',
    columnDefs: columnDefs,
    minRowsToShow: 6,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.usageSites = [];
  $scope.distributionSites = [];

  $scope.returnForm = {
    returnDate: new Date(),
    returnedFrom: null,
    returnedTo: null
  };
  $scope.addingReturnForm = false;


  function initialise() {
    // FIXME: Get current return forms
    $scope.gridOptions.data = [];

    // FIXME: Get form elements
    $scope.distributionSites = [
      {
        id: 1,
        name: 'Distribution site #1'
      },
      {
        id: 2,
        name: 'Distribution site #2'
      }
    ];
    $scope.usageSites = [
      {
        id: 3,
        name: 'Usage site #1'
      },
      {
        id: 4,
        name: 'Usage site #2'
      }
    ];
  }

  $scope.onRowClick = function(row) {
    $location.path('/viewReturn/' + row.entity.id);
  };

  $scope.clearForm = function() {
    $scope.returnForm.returnDate = new Date();
    $scope.returnForm.returnedFrom = null;
    $scope.returnForm.returnedTo = null;
    $scope.addReturnForm.$setPristine();
  };

  $scope.addReturn = function() {
    if ($scope.addReturnForm.$invalid) {
      // Don't submit if invalid
      return;
    }

    $scope.addingReturnForm = true;

    var returnForm = {
      status: 'CREATED',
      returnDate: $scope.returnForm.returnDate,
      returnedFrom: {
        id: $scope.returnForm.returnedFrom
      },
      returnedTo: {
        id: $scope.returnForm.returnedTo
      }
    };
    $log.debug(returnForm);

    // FIXME: do create and then redirect to next Return page

    $scope.addingReturnForm = false;
  };

  initialise();

});