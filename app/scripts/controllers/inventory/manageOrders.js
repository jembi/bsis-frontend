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

  $scope.addOrder = function() {
    if ($scope.addOrderForm.$invalid) {
      // Don't submit if invalid
      return;
    }
    // TODO: Set type and location from transferTo or issueTo depending on which one is filled in
    console.log($scope.orderForm); // eslint-disable-line
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
