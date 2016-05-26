'use strict';

angular.module('bsis').controller('ManageOrdersCtrl', function($scope, $log, $location, OrderFormsService) {

  var distributionSites = [];
  var usageSites = [];

  // Set the "dispatch to" sites based on dispatch type
  function updateDispatchToSites() {
    if ($scope.orderForm.type === 'TRANSFER') {
      $scope.dispatchToSites = distributionSites.filter(function(site) {
        // Filter the selected distribution site from the options
        return site.id !== $scope.orderForm.dispatchedFrom;
      });
    } else if ($scope.orderForm.type === 'ISSUE') {
      $scope.dispatchToSites = usageSites;
    } else {
      $scope.dispatchToSites = [];
    }
  }

  function initialise() {

    // Get current order forms
    var params = {
      orderDateFrom: null,
      orderDateTo: null,
      dispatchedFromId: null,
      dispatchedToId: null,
      status: 'CREATED'
    };
    OrderFormsService.findOrderForms(params, function(res) {
      $scope.gridOptions.data = res.orderForms;
    }, $log.error);

    // Get form elements
    OrderFormsService.getOrderFormsForm(function(res) {
      $scope.dispatchFromSites = distributionSites = res.distributionSites;
      usageSites = res.usageSites;
      updateDispatchToSites();
    }, $log.error);
  }

  $scope.orderForm = {
    orderDate: new Date(),
    type: null,
    dispatchedFrom: null,
    dispatchedTo: null
  };
  $scope.addingOrderForm = false;
  // The available sites to be dispatched from
  $scope.dispatchFromSites = [];
  // The available sites to be dispatched to
  $scope.dispatchToSites = [];

  $scope.addOrder = function() {
    if ($scope.addOrderForm.$invalid) {
      // Don't submit if invalid
      return;
    }
    $scope.addingOrderForm = true;

    var orderForm = {
      status: 'CREATED',
      orderDate: $scope.orderForm.orderDate,
      type: $scope.orderForm.type,
      dispatchedFrom: {
        id: $scope.orderForm.dispatchedFrom
      },
      dispatchedTo: {
        id: $scope.orderForm.dispatchedTo
      }
    };

    OrderFormsService.addOrderForm({}, orderForm, function(res) {
      $scope.addingOrderForm = false;
      $location.path('/fulfilOrder/' + res.orderForm.id);
    }, $log.error);
  };

  $scope.clearForm = function() {
    $scope.orderForm.orderDate = new Date();
    $scope.orderForm.type = null;
    $scope.orderForm.dispatchedFrom = null;
    $scope.orderForm.dispatchedTo = null;
    $scope.addOrderForm.$setPristine();
  };

  $scope.$watch('orderForm.type', function() {
    // Update to set available options based on type
    updateDispatchToSites();
  });
  $scope.$watch('orderForm.dispatchedFrom', function() {
    // Update to ensure that the correct site is filtered
    updateDispatchToSites();
  });

  $scope.onRowClick = function(row) {
    $location.path('/viewOrder/' + row.entity.id);
  };

  var columnDefs = [
    {
      name: 'Order Date',
      field: 'orderDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Dispatch Type',
      field: 'type',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Dispatched From',
      field: 'dispatchedFrom.name',
      width: '**'
    },
    {
      name: 'Dispatched To',
      field: 'dispatchedTo.name',
      width: '**'
    }
  ];

  $scope.gridOptions = {
    data: [],
    columnDefs: columnDefs,
    rowTemplate: 'views/template/clickablerow.html',

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  initialise();
});
