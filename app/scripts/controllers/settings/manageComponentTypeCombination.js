'use strict';

angular.module('bsis').controller('ManageComponentTypeCombinationCtrl', function($scope, $location, $routeParams, $log, $timeout, ComponentTypeCombinationsService) {
  $scope.componentTypeCombination = {
    combinationName: '',
    sourceComponentTypes: [],
    componentTypes: [],
    isDeleted: false
  };

  $scope.userSelection = {
    selectedSourceComponentIndex: null,
    selectedSourceComponentList: [],
    selectedProducedComponentIndex: null,
    selectedProducedComponentList: []
  };

  $scope.componentCombinationForm = {};

  $scope.$watch('sourceComponentTypes.combinationName', function() {
    $timeout(function() {
      $scope.componentCombinationForm.componentCombinationName.$setValidity('duplicate', true);
    });
  });

  function onSaveError(err) {
    if (err.data && err.data.combinationName) {
      $scope.componentCombinationForm.combinationName.$setValidity('duplicate', false);
    }
    $scope.savingComponentCombination = false;
  }

  $scope.cancel = function() {
    $location.path('/componentTypeCombinations');
  };

  $scope.addSourceComponent = function() {
    $scope.componentTypeCombination.sourceComponentTypes.push(
      $scope.sourceComponentTypesDropDown[$scope.userSelection.selectedSourceComponentIndex]
    );
    $scope.sourceComponentTypesDropDown[$scope.userSelection.selectedSourceComponentIndex].disabled = true;
    $scope.userSelection.selectedSourceComponentIndex = null;
  };

  $scope.addUnit = function() {
    $scope.componentTypeCombination.componentTypes.push(
      $scope.producedComponentTypesDropDown[$scope.userSelection.selectedProducedComponentIndex]
    );
    $scope.producedComponentTypesDropDown[$scope.userSelection.selectedProducedComponentIndex].disabled = true;
    $scope.userSelection.selectedProducedComponentIndex = null;
  };

  $scope.removeSourceComponent = function() {
    var toRemove = $scope.componentTypeCombination.sourceComponentTypes.filter(function(componentType) {
      return $scope.userSelection.selectedSourceComponentList.indexOf(String(componentType.id)) > -1;
    });

    toRemove.forEach(function(componentType) {
      // Remove the component type from the list of source components
      $scope.componentTypeCombination.sourceComponentTypes.splice(
        $scope.componentTypeCombination.sourceComponentTypes.indexOf(componentType),
        1);

      // Re-enable the component in the list of selectable source components
      componentType.disabled = false;
    });

    // Reset selection
    $scope.userSelection.selectedSourceComponentList = [];
  };

  $scope.removeProducedComponent = function() {
    var toRemove = $scope.componentTypeCombination.componentTypes.filter(function(componentType) {
      return $scope.userSelection.selectedProducedComponentList.indexOf(String(componentType.id)) > -1;
    });

    toRemove.forEach(function(componentType) {
      // Remove the component type from the list of produced components
      $scope.componentTypeCombination.componentTypes.splice(
        $scope.componentTypeCombination.componentTypes.indexOf(componentType),
        1);

      // Re-enable the component in the list of selectable produced components
      componentType.disabled = false;
    });

    // Reset selection
    $scope.userSelection.selectedProducedComponentList = [];
  };

  $scope.saveComponentCombination = function() {
    if ($scope.componentCombinationForm.$invalid) {
      return;
    }
    $scope.savingComponentCombination = true;
    angular.forEach($scope.componentTypeCombination.sourceComponentTypes, function(sourceType) {
      delete sourceType.disabled;
    });
    angular.forEach($scope.componentTypeCombination.componentTypes, function(producedType) {
      delete producedType.disabled;
    });
    ComponentTypeCombinationsService.createComponentTypeCombinations($scope.componentTypeCombination, function() {
      $location.path('/componentTypeCombinations');
    }, function(response) {
      onSaveError(response);
    });
  };

  function init() {
    ComponentTypeCombinationsService.getComponentTypeCombinationsForm(function(response) {
      $scope.sourceComponentTypesDropDown = response.sourceComponentTypes;
      $scope.producedComponentTypesDropDown = response.producedComponentTypes;
    }, $log.error);
  }

  init();
});
