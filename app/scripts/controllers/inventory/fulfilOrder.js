'use strict';

angular.module('bsis').controller('FulfilOrderCtrl', function($scope, ComponentService, $log, BLOODGROUP, $location, $routeParams) {

  var orderItems = [];
  var orderItemMaster = {
    componentType: '',
    bloodGroup: '',
    numberOfItems: ''
  };

  function init() {
    // get the components from the /orderitems/form endpoint when it's available
    ComponentService.getComponentsFormFields(function(response) {
      if (response !== false) {
        $scope.componentTypes = response.componentTypes;
      }
    });

    $scope.orderItem = angular.copy(orderItemMaster);
    $scope.bloodGroups = BLOODGROUP.options;

    var orderFormId = $routeParams.id;
    $log.info('orderFormId: ' + orderFormId);
    $scope.orderForm = {
      // replace with orderForm from API, find by orderFormId
      orderDate: new Date(),
      type: 'TRANSFER',
      dispatchedFrom: {name: 'Central Service'},
      dispatchedTo: {name: 'Clinic ABC'},
      items: []
    };
  }

  $scope.addOrderItem = function(form) {
    if (form.$valid) {
      orderItems.push($scope.orderItem);
      $scope.gridOptions.data = orderItems;
    }
  };

  $scope.updateOrder = function() {
    $scope.savingForm = true;
    // use PUT endpoint when ready
    $log.info('Update orderForm');
    $scope.orderForm.items = orderItems;
    $scope.savingForm = false;
  };

  $scope.clearAddOrderItemForm = function(form) {
    $scope.gridOptions.data = [];
    $scope.orderItem = angular.copy(orderItemMaster);
    form.$setPristine();
  };

  $scope.cancel = function() {
    $location.path('/manageOrders');
  };

  var columnDefs = [
    {
      name: 'Component Type',
      field: 'componentType',
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