'use strict';

angular.module('bsis').controller('AddComponentBatchCtrl', function($scope, $location, ComponentBatchService) {

  // Add componentBatch variables and methods

  function initFields() {
    $scope.componentBatch.donationBatch = {'id': ''};
    $scope.componentBatch.location = {'id': ''};
    $scope.componentBatch.bloodTransportBoxes = [];
    $scope.componentBatch.deliveryDate = new Date();
    $scope.temperature = '';
    $scope.submitted = false;

  }

  function getComponentBatchFormFields() {
    ComponentBatchService.getComponentBatchesFormFields(function(response) {
      if (response !== false) {
        $scope.processingSites = response.processingSites;
        $scope.donationBatches = response.donationBatches;
        $scope.componentBatch = response.addComponentBatchForm;
        initFields();
      }
    });
  }

  $scope.addBox = function(temperature) {
    $scope.componentBatch.bloodTransportBoxes.push(
      {temperature: temperature}
    );
  };

  $scope.clearForm = function(addComponentBatchForm) {
    initFields();
    addComponentBatchForm.$setPristine();
    $location.search({});
  };

  $scope.addComponentBatch = function(addComponentBatchForm) {
    if (addComponentBatchForm.$valid) {
      $scope.adding = true;
      ComponentBatchService.addComponentBatch($scope.componentBatch, function() {
        $scope.submitted = false;
        $scope.clearForm(addComponentBatchForm);
        $scope.tabs.addDelivery = false;
        $scope.tabs.viewDelivery = true;
      }, function() {
        $scope.submitted = true;
      });
    } else {
      $scope.submitted = true;
    }
    $scope.adding = false;

  };

  getComponentBatchFormFields();

});
