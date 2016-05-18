'use strict';

angular.module('bsis').controller('FulfilOrderCtrl', function($scope, $location, $log, $routeParams, OrderFormsService, BLOODGROUP) {

  var orderItemMaster = {
    componentType: null,
    bloodGroup: null,
    numberOfItems: null
  };

  function init() {
    $scope.orderItem = angular.copy(orderItemMaster);
    $scope.bloodGroups = BLOODGROUP.options;
    $scope.orderForm = null;
    $scope.componentTypes = [];

    // Fetch the order form by its id
    OrderFormsService.getOrderForm({id: $routeParams.id}, function(res) {
      $scope.orderForm = res.orderForm;
      $scope.gridOptions.data = $scope.orderForm.items;
    }, $log.error);

    // Fetch order form item form fields
    OrderFormsService.getOrderFormItemForm(function(res) {
      $scope.componentTypes = res.componentTypes;
    }, $log.error);
  }

  $scope.addOrderItem = function(form) {
    if (form.$valid) {
      $scope.orderForm.items.push($scope.orderItem);
      $scope.orderItem = angular.copy(orderItemMaster);
      form.$setPristine();
    }
  };

  $scope.updateOrder = function() {
    $scope.savingForm = true;
    OrderFormsService.updateOrderForm({}, $scope.orderForm, function(res) {
      $scope.orderForm = res.orderForm;
      $scope.savingForm = false;
    }, function(err) {
      $log.error(err);
      $scope.savingForm = false;
    });
  };

  $scope.clearAddOrderItemForm = function(form) {
    $scope.orderItem = angular.copy(orderItemMaster);
    form.$setPristine();
  };

  $scope.cancel = function() {
    $location.path('/manageOrders');
  };

  var columnDefs = [
    {
      name: 'Component Type',
      field: 'componentType.componentTypeName',
      width: '**',
      maxWidth: '250'
    },
    {
      name: 'Blood Group',
      field: 'bloodGroup',
      width: '**',
      maxWidth: '350'
    },
    {
      name: 'Units Ordered',
      field: 'numberOfItems',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Supplied',
      field: 'numberOfItems',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Gap',
      field: 'numberOfItems',
      width: '**'
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  init();

});
