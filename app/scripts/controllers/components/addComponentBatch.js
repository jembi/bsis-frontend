'use strict';

angular.module('bsis').controller('AddComponentBatchCtrl', function($scope, $location, ComponentBatchService) {

  // Add componentBatch variables and methods

  function initFields() {
    $scope.componentBatch.donationBatch = {'id': ''};
    $scope.componentBatch.location = {'id': ''};
    $scope.componentBatch.bloodTransportBoxes = [];
    $scope.componentBatch.deliveryDate = new Date();
    $scope.temperature = null;
    $scope.emptyTemperatureSubmitted = false;
  }

  function getComponentBatchFormFields() {
    ComponentBatchService.getComponentBatchesFormFields(function(response) {
      if (response !== false) {
        $scope.processingSites = response.processingSites;
        $scope.donationBatches = response.donationBatches;
        $scope.componentBatch = response.addComponentBatchForm;
        initFields();
      }
    }, function() {});
  }

  $scope.addBox = function(temperature) {
    if ($scope.addComponentBatchForm.temperature.$valid) {
      $scope.componentBatch.bloodTransportBoxes.push(
        {temperature: temperature}
      );
      $scope.emptyTemperatureSubmitted = false;
      $scope.temperature = null;
    } else {
      $scope.emptyTemperatureSubmitted = true;
    }
  };

  $scope.clearForm = function(addComponentBatchForm) {
    initFields();
    addComponentBatchForm.$setPristine();
    $location.search({});
  };

  $scope.addComponentBatch = function(addComponentBatchForm) {
    if (addComponentBatchForm.$valid && $scope.componentBatch.bloodTransportBoxes.length > 0) {
      $scope.adding = true;
      ComponentBatchService.addComponentBatch($scope.componentBatch, function() {
        $scope.clearForm(addComponentBatchForm);
        $location.path('/viewComponentBatches');
      }, function() {});
    }
    $scope.adding = false;
  };

  getComponentBatchFormFields();

});
