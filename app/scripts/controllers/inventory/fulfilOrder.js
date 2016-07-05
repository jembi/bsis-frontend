'use strict';

angular.module('bsis').controller('FulfilOrderCtrl', function($scope, $location, $log, $routeParams, $uibModal, OrderFormsService, ComponentService, BLOODGROUP, DATEFORMAT) {

  var orderItemMaster = {
    componentType: null,
    bloodGroup: null,
    numberOfUnits: null
  };

  var componentMaster = {
    din: null,
    componentCode: null
  };

  var distributionSites = [];
  var usageSites = [];
  var selectedItemsToDelete = null;

  // Set the "dispatch to" sites based on dispatch type
  function updateDispatchToSites() {
    if ($scope.orderDetailsForm == null) {
      // Order form is not loaded yet
      return;
    }
    if ($scope.orderDetailsForm.type === 'TRANSFER') {
      $scope.dispatchToSites = distributionSites.filter(function(site) {
        // Filter the selected distribution site from the options
        return site.id !== $scope.orderDetailsForm.dispatchedFrom;
      });
    } else if ($scope.orderDetailsForm.type === 'ISSUE') {
      $scope.dispatchToSites = usageSites;
    } else {
      $scope.dispatchToSites = [];
    }
  }

  function convertItem(item) {
    return {
      componentTypeName: item.componentType.componentTypeName,
      bloodGroup: item.bloodGroup,
      numberOfUnits: item.numberOfUnits,
      numberSupplied: 0,
      gap: item.numberOfUnits,
      itemId: item.id,
      componentIds: []
    };
  }

  function populateGrid(components, items) {
    $scope.gridOptions.data = [];
    angular.forEach(items, function(item) {
      var row = convertItem(item);
      var unmatchedComponents = [];
      angular.forEach(components, function(component) {
        var bloodGroup = component.bloodAbo + component.bloodRh;
        if (row.gap > 0 && component.componentType.id === item.componentType.id && bloodGroup === item.bloodGroup) {
          // can't over supply and component matches
          row.numberSupplied = row.numberSupplied + 1;
          row.gap = row.gap - 1;
          // save list of component ids for that item
          row.componentIds.push(component.id);
        } else {
          unmatchedComponents.push(component);
        }
      });
      components = unmatchedComponents; // ensure we don't match the component more than once
      $scope.gridOptions.data.push(row);
    });
    return components;
  }

  function init() {
    $scope.orderItem = angular.copy(orderItemMaster);
    $scope.component = angular.copy(componentMaster);
    $scope.addingComponent = false;
    $scope.bloodGroups = BLOODGROUP.options;
    $scope.orderForm = null;
    $scope.componentTypes = [];
    $scope.components = [];
    $scope.orderItems = [];

    // Fetch the order form by its id
    OrderFormsService.getOrderForm({id: $routeParams.id}, function(res) {
      $scope.orderForm = res.orderForm;
      $scope.components = angular.copy(res.orderForm.components);
      $scope.orderItems = angular.copy(res.orderForm.items);
      populateGrid($scope.components, $scope.orderItems);
    }, $log.error);

    // Fetch order form item form fields
    OrderFormsService.getOrderFormItemForm(function(res) {
      $scope.componentTypes = res.componentTypes;
    }, $log.error);

    // Get form elements
    OrderFormsService.getOrderFormsForm(function(res) {
      $scope.dispatchFromSites = distributionSites = res.distributionSites;
      usageSites = res.usageSites;
      updateDispatchToSites();
    }, $log.error);
  }

  $scope.format = DATEFORMAT;

  $scope.forms = {
    orderDetailsForm: null
  };

  // The available sites to be dispatched from
  $scope.dispatchFromSites = [];
  // The available sites to be dispatched to
  $scope.dispatchToSites = [];
  // Copy of the order form used for updating the details
  $scope.orderDetailsForm = null;
  // State variables
  $scope.editingOrderDetails = false;
  $scope.selectingDate = false;
  $scope.savingOrderDetails = false;

  $scope.$watch('orderDetailsForm.type', function() {
    // Update to set available options based on type
    updateDispatchToSites();
  });
  $scope.$watch('orderDetailsForm.dispatchedFrom', function() {
    // Update to ensure that the correct site is filtered
    updateDispatchToSites();
  });

  // Start editing the order details
  $scope.editOrderDetails = function() {
    $scope.orderDetailsForm = angular.copy($scope.orderForm);
    $scope.orderDetailsForm.orderDate = moment($scope.orderDetailsForm.orderDate).toDate();
    $scope.editingOrderDetails = true;
  };

  // Select a new order date in the popup
  $scope.selectDate = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.selectingDate = true;
  };

  // Save the updated order details
  $scope.saveOrderDetails = function() {
    if ($scope.forms.orderDetailsForm.$invalid) {
      return;
    }

    $scope.savingOrderDetails = true;
    OrderFormsService.updateOrderForm({}, $scope.orderDetailsForm, function(res) {
      $scope.orderForm = res.orderForm;
      $scope.savingOrderDetails = false;
      $scope.editingOrderDetails = false;
    }, function(err) {
      $log.error(err);
      $scope.savingOrderDetails = false;
    });
  };

  // Clear the order details form
  $scope.clearDetailsForm = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.orderDetailsForm = null;
    $scope.editingOrderDetails = false;
  };

  $scope.addOrderItem = function(form) {
    if (form.$valid) {
      $scope.orderItems.push($scope.orderItem);
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

  $scope.removeComponent = function(form) {
    form.$setSubmitted();

    if (form.$invalid) {
      // Bail if form is invalid
      return;
    }

    // Filter matching component
    var components = $scope.components.filter(function(component) {
      return component.donationIdentificationNumber !== $scope.component.din
        || component.componentType.componentTypeCode !== $scope.component.componentCode;
    });

    if (components.length === $scope.components.length) {
      showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
              ') was not found in this Order Form.');
    } else {
      $scope.components = components;
      $scope.component = angular.copy(componentMaster);
      populateGrid($scope.components, $scope.orderItems);
      form.$setPristine();
    }
  };

  $scope.addComponent = function(form) {
    if (form.$valid) {
      $scope.addingComponent = true;
      var searchParams = {
        donationIdentificationNumber: $scope.component.din,
        componentCode: $scope.component.componentCode
      };
      ComponentService.findComponent(searchParams, function(component) {
        // check if component in stock
        if (component.inventoryStatus !== 'IN_STOCK') {
          showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
            ') is not currently in stock.');
        // check if the component is in the correct location
        } else if (component.location.id !== $scope.orderForm.dispatchedFrom.id) {
          showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
            ') is not currently in stock at ' + $scope.orderForm.dispatchedFrom.name + '.');
        // check if the component is available
        } else if (component.status !== 'AVAILABLE') {
          showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
            ') is not suitable for dispatch.');
        } else {
          // check if component has already been added
          var componentAlreadyAdded = $scope.components.some(function(e) {
            return e.id === component.id;
          });
          if (componentAlreadyAdded) {
            showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
              ') has already been added to this Order Form.');
          } else {
            // update the table
            var oldData = angular.copy($scope.gridOptions.data);
            var oldComponents = angular.copy($scope.components);
            $scope.components.push(component);
            var componentsLeft = populateGrid($scope.components, $scope.orderItems);
            // check if the component was matched
            if (!componentsLeft || componentsLeft.length > 0) {
              showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
                ') does not match what was ordered.');
              // reset the data in the table
              $scope.gridOptions.data = oldData;
              $scope.components = oldComponents;
            } else {
              // was added successfully, so save in orderForm and reset the form
              $scope.component = angular.copy(componentMaster);
              form.$setPristine();
            }
          }
        }
        $scope.addingComponent = false;
      }, function(err) {
        $log.error(err);
        if (err.errorCode === 'NOT_FOUND') {
          showErrorMessage('Component with DIN ' + $scope.component.din + ' and ComponentCode ' + $scope.component.componentCode + ' not found.');
        }
        $scope.addingComponent = false;
      });
    }
  };

  $scope.deleteRow = function() {

    angular.forEach(selectedItemsToDelete, function(itemToDelete) {

      // Delete components
      angular.forEach(itemToDelete.componentIds, function(componentId) {
        angular.forEach($scope.components, function(component) {
          if (componentId === component.id) {
            var index = $scope.components.indexOf(component);
            $scope.components.splice(index, 1);
          }
        });
      });

      // Delete items
      angular.forEach($scope.orderItems, function(item) {
        if (itemToDelete.itemId === item.id) {
          var index = $scope.orderItems.indexOf(item);
          $scope.orderItems.splice(index, 1);
        }
      });
    });

    $scope.orderForm.items = $scope.orderItems;
    $scope.orderForm.components = $scope.components;
    populateGrid($scope.components, $scope.orderItems);
  };

  $scope.updateOrder = function() {
    $scope.savingForm = true;
    $scope.orderForm.components = $scope.components;
    $scope.orderForm.items = $scope.orderItems;
    OrderFormsService.updateOrderForm({}, $scope.orderForm, function(res) {
      $scope.orderForm = res.orderForm;
      $scope.components = angular.copy(res.orderForm.components);
      $scope.orderItems = angular.copy(res.orderForm.items);
      populateGrid($scope.components, $scope.orderItems);
      $scope.savingForm = false;
      $location.path('/viewOrder/' + $routeParams.id);
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
    $location.path('/viewOrder/' + $routeParams.id);
  };

  var columnDefs = [
    {
      name: 'Component Type',
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'Blood Group',
      field: 'bloodGroup',
      width: '**',
      maxWidth: '200'
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
      width: '**',
      maxWidth: '200'
    },
    {
      field: 'itemId',
      visible: false
    },
    {
      field: 'componentIds',
      visible: false
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 7,
    paginationPageSizes: [7],
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 7,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        selectedItemsToDelete = gridApi.selection.getSelectedRows();
        $scope.areItemsToDelete = selectedItemsToDelete ? selectedItemsToDelete.length > 0 : false;
      });
    }
  };

  init();

});
