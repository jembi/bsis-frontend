'use strict';

angular.module('bsis').controller('FulfilOrderCtrl', function($scope, $location, $log, $routeParams, OrderFormsService, ComponentService, BLOODGROUP) {

  var orderItemMaster = {
    componentType: null,
    bloodGroup: null,
    numberOfUnits: null
  };

  var componentMaster = {
    din: null,
    componentCode: null
  };

  function convertItem(item) {
    return {
      componentTypeName: item.componentType.componentTypeName,
      bloodGroup: item.bloodGroup,
      numberOfUnits: item.numberOfUnits,
      numberSupplied: 0,
      gap: item.numberOfUnits
    };
  }

  function addAllItemsToTable(orderForm) {
    $scope.gridOptions.data = [];
    angular.forEach(orderForm.items, function(item) {
      var row = convertItem(item);
      $scope.gridOptions.data.push(row);
    });
  }

  function init() {
    $scope.orderItem = angular.copy(orderItemMaster);
    $scope.component = angular.copy(componentMaster);
    $scope.addingComponent = false;
    $scope.bloodGroups = BLOODGROUP.options;
    $scope.orderForm = null;
    $scope.componentTypes = [];

    // Fetch the order form by its id
    OrderFormsService.getOrderForm({id: $routeParams.id}, function(res) {
      $scope.orderForm = res.orderForm;
      addAllItemsToTable($scope.orderForm);
    }, $log.error);

    // Fetch order form item form fields
    OrderFormsService.getOrderFormItemForm(function(res) {
      $scope.componentTypes = res.componentTypes;
    }, $log.error);
  }

  $scope.addOrderItem = function(form) {
    if (form.$valid) {
      $scope.orderForm.items.push($scope.orderItem);
      $scope.gridOptions.data.push(convertItem($scope.orderItem));
      $scope.orderItem = angular.copy(orderItemMaster);
      form.$setPristine();
    }
  };

  $scope.addComponent = function(form) {
    if (form.$valid) {
      $scope.addingComponent = true;
      // retrieve component from server
      var component = {
        id: 36,
        componentType: {
          id: 1,
          componentTypeName: '1001',
          componentTypeCode: 'Whole Blood - CPDA'
        },
        donation: {
          bloodAbo: 'A',
          bloodRh: '+'
        }
      };
      if (component) {
        // check if component has already been added
        var componentAlreadyAdded = $scope.orderForm.components.some(function(e) {
          return e.id == component.id;
        });
        if (!componentAlreadyAdded) {
          // add new component to the list, update the table and reset the form
          $scope.orderForm.components.push(component);
          $scope.component = angular.copy(componentMaster);
          form.$setPristine();
        }
      }
      $scope.addingComponent = false;
    }
  };

  $scope.updateOrder = function() {
    $scope.savingForm = true;
    OrderFormsService.updateOrderForm({}, $scope.orderForm, function(res) {
      $scope.orderForm = res.orderForm;
      addAllItemsToTable($scope.orderForm);
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

  $scope.clearAddComponent = function(form) {
    $scope.component = angular.copy(componentMaster);
    form.$setPristine();
  };

  $scope.cancel = function() {
    $location.path('/manageOrders');
  };

  var columnDefs = [
    {
      name: 'Component Type',
      field: 'componentTypeName',
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
      field: 'numberOfUnits',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Supplied',
      field: 'numberSupplied',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Gap',
      field: 'gap',
      width: '**'
    }
  ];

  $scope.gridOptions = {
    data: [],
    columnDefs: columnDefs,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  init();

});
