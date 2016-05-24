'use strict';

angular.module('bsis').controller('FulfilOrderCtrl', function($scope, $location, $log, $routeParams, $uibModal, OrderFormsService, ComponentService, BLOODGROUP) {

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

  function populateGrid(orderForm) {
    $scope.gridOptions.data = [];
    var componentsToMatch = angular.copy(orderForm.components);
    angular.forEach(orderForm.items, function(item) {
      var row = convertItem(item);
      var unmatchedComponents = [];
      angular.forEach(componentsToMatch, function(component) {
        var bloodGroup = component.bloodAbo + component.bloodRh;
        if (component.componentType.id === item.componentType.id && bloodGroup === item.bloodGroup) {
          row.numberSupplied = row.numberSupplied + 1;
          row.gap = row.gap - 1;
        } else {
          unmatchedComponents.push(component);
        }
      });
      componentsToMatch = unmatchedComponents; // ensure we don't match the component more than once
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
      populateGrid($scope.orderForm);
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

  function showErrorMessage(errorMessage) {
    $uibModal.open({
      animation: false,
      templateUrl: 'views/errorModal.html',
      controller: 'ErrorModalCtrl',
      resolve: {
        errorObject: function() {
          return {
            title: 'Invalid Component',
            button: 'OK',
            errorMessage: errorMessage
          };
        }
      }
    });
  }

  $scope.addComponent = function(form) {
    if (form.$valid) {
      $scope.addingComponent = true;
      ComponentService.findComponent($scope.component.din, $scope.component.componentCode, function(component) {
        if (component) {
          // check if component has already been added
          var componentAlreadyAdded = $scope.orderForm.components.some(function(e) {
            return e.id == component.id;
          });
          if (!componentAlreadyAdded) {
            // add new component to the list, update the table and reset the form
            $scope.orderForm.components.push(component);
            populateGrid($scope.orderForm);
            $scope.component = angular.copy(componentMaster);
            form.$setPristine();
          } else {
            showErrorMessage('Component ' + $scope.component.din + ' ' + $scope.component.componentCode + ' has already been added to this Order Form.');
          }
        }
        $scope.addingComponent = false;
      }, function(err) {
        $log.error(err);
        if (err.errorCode === 'NOT_FOUND') {
          showErrorMessage('No Component with DIN ' + $scope.component.din + ' and ComponentCode ' + $scope.component.componentCode + ' found.');
        }
        $scope.addingComponent = false;
      });
    }
  };

  $scope.updateOrder = function() {
    $scope.savingForm = true;
    OrderFormsService.updateOrderForm({}, $scope.orderForm, function(res) {
      $scope.orderForm = res.orderForm;
      populateGrid($scope.orderForm);
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
