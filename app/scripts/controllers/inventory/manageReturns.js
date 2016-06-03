'use strict';

angular.module('bsis').controller('ManageReturnsCtrl', function($scope, $location, $log, ReturnFormsService) {

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

    // Get form elements
    ReturnFormsService.getReturnFormsForm(function(response) {
      $scope.distributionSites = response.distributionSites;
      $scope.usageSites = response.usageSites;
    }, $log.error);
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

    // Create the ReturnForm
    ReturnFormsService.addReturnForm({}, returnForm, function(response) {
      $scope.addingReturnForm = false;
      // FIXME: redirect to next page where you can add return form components
      $log.info('Successfully created the ReturnForm ' + response.returnForm.id);
      $scope.clearForm();
    }, function(err) {
      $log.error(err);
      $scope.addingReturnForm = false;
    });
  };

  initialise();

});