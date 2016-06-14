'use strict';

angular.module('bsis').controller('ViewReturnCtrl', function($scope, $location, $log, $filter, $routeParams, ReturnFormsService) {

  $scope.displayConfirmReturn = false;

  var columnDefs = [
    {
      name: 'donationIdentificationNumber',
      field: 'donationIdentificationNumber',
      displayName: 'DIN',
      width: '**',
      maxWidth: '100'
    },
    {
      name: 'componentCode',
      field: 'componentCode',
      displayName: 'Component Code',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'componentTypeName',
      field: 'componentTypeName',
      displayName: 'Component Type',
      width: '**',
      minWidth: '200'
    },
    {
      name: 'bloodGroup',
      field: 'bloodGroup',
      displayName: 'Blood Group',
      width: '**',
      maxWidth: '125'
    },
    {
      name: 'status',
      field: 'status',
      displayName: 'Status',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'createdOn',
      field: 'createdOn',
      displayName: 'Created On',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '100'
    },
    {
      name: 'expiryStatus',
      field: 'expiryStatus',
      displayName: 'Expiry Status',
      width: '**',
      maxWidth: '150'
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 10,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  function convertItem(component) {
    return {
      donationIdentificationNumber: component.donationIdentificationNumber,
      componentCode: component.componentCode,
      componentTypeName: component.componentType.componentTypeName,
      bloodGroup: component.bloodAbo + component.bloodRh,
      status: component.status,
      createdOn: component.createdOn,
      expiryStatus: component.expiryStatus
    };
  }

  function populateGrid(returnForm) {
    $scope.gridOptions.data = [];
    angular.forEach(returnForm.components, function(component) {
      $scope.gridOptions.data.push(convertItem(component));
    });
  }

  function init() {
    // Fetch the return form by its id
    ReturnFormsService.getReturnForm({id: $routeParams.id}, function(res) {
      $scope.returnForm = res.returnForm;
      populateGrid($scope.returnForm);
    }, $log.error);
  }

  $scope.exportReturnNote = function() {
    $log.info('Not implemented yet');
  };

  $scope.discardStock = function() {
    $log.info('Not implemented yet');
  };

  $scope.confirmReturn = function(condition) {
    $scope.displayConfirmReturn = condition;
  };

  $scope.return = function() {
    $scope.returnForm.status = 'RETURNED';
    ReturnFormsService.updateReturnForm({}, $scope.returnForm, function(res) {
      $scope.returnForm = res.returnForm;
      populateGrid($scope.returnForm);
      $scope.displayConfirmReturn = false;
    }, function(err) {
      $log.error(err);
    });
  };

  $scope.edit = function() {
    $location.path('/recordReturn/' + $routeParams.id);
  };

  init();

});
