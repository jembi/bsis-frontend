'use strict';

angular.module('bsis').controller('ManageOrdersCtrl', function($scope, $log, OrderFormsService) {

  $scope.orderForm = {
    orderDate: new Date(),
    dispatchedFrom: null,
    transferTo: null,
    issueTo: null
  };
  $scope.distributionSites = [];
  $scope.usageSites = [];
  $scope.addingOrderForm = false;

  $scope.addOrder = function() {
    if ($scope.addOrderForm.$invalid) {
      // Don't submit if invalid
      return;
    }
    $scope.addingOrderForm = true;

    var orderType = null;
    var dispatchedToId = null;

    if ($scope.orderForm.transferTo != null) {
      orderType = 'TRANSFER';
      dispatchedToId = $scope.orderForm.transferTo;
    } else if ($scope.orderForm.issueTo != null) {
      orderType = 'ISSUE';
      dispatchedToId = $scope.orderForm.issueTo;
    }

    var orderForm = {
      status: 'CREATED',
      orderDate: $scope.orderForm.orderDate,
      type: orderType,
      dispatchedFrom: {
        id: $scope.orderForm.dispatchedFrom
      },
      dispatchedTo: {
        id: dispatchedToId
      }
    };

    OrderFormsService.addOrderForm({}, orderForm, function(res) {
      // TODO: Redirect to the order form page using the new order form's id
      console.log(res.orderForm.id); // eslint-disable-line
      $scope.addingOrderForm = false;
    }, $log.error);
  };

  $scope.clearForm = function() {
    $scope.orderForm.orderDate = new Date();
    $scope.orderForm.dispatchedFrom = null;
    $scope.orderForm.transferTo = null;
    $scope.orderForm.issueTo = null;
    $scope.addOrderForm.$setPristine();
  };

  function initialise() {
    OrderFormsService.getOrderFormsForm(function(res) {
      $scope.distributionSites = res.distributionSites;
      $scope.usageSites = res.usageSites;
    }, $log.error);
  }

  initialise();
});
