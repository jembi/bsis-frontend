'use strict';

angular.module('bsis').controller('ManageComponentTypeCombinationCtrl', function($scope, $location, $log, $timeout, $routeParams, ComponentCombinationsService) {
  $scope.sourceComponentTypes = [];
  $scope.producedComponentTypes = [];

  $scope.componentTypeCombination = {
    combinationName: '',
    isDeleted: false
  };

  $scope.userSelection = {
    selectedSourceComponentIndex: null,
    selectedSourceComponentList: [],
    selectedProducedComponentIndex: null,
    selectedProducedComponentList: []
  };

  var mockComponentTypes = function() {
    return [
      {
        id: 6,
        componentTypeName: 'Whole Blood - CPDA',
        componentTypeCode: '1001',
        description: ''
      }, {
        id: 7,
        componentTypeName: 'Whole Blood Poor Platelets - CPDA',
        componentTypeCode: '1005',
        description: ''
      }, {
        id: 8,
        componentTypeName: 'Packed Red Cells - CPDA',
        componentTypeCode: '2001',
        description: ''
      }, {
        id: 9,
        componentTypeName: 'Packed Red Cells - SAGM',
        componentTypeCode: '2011',
        description: ''
      }, {
        id: 10,
        componentTypeName: 'Fresh Frozen Plasma - Whole Blood',
        componentTypeCode: '3001',
        description: ''
      }, {
        id: 11,
        componentTypeName: 'Frozen Plasma - Whole Blood',
        componentTypeCode: '3002',
        description: ''
      }, {
        id: 12,
        componentTypeName: 'Platelets Concentrate - Whole Blood',
        componentTypeCode: '4001',
        description: ''
      }, {
        id: 13,
        componentTypeName: 'Platelets Concentrate - Whole Blood - 24H',
        componentTypeCode: '4011',
        description: ''
      }, {
        id: 14,
        componentTypeName: 'Packed Red Cells - Paediatric - CPDA',
        componentTypeCode: '2101',
        description: ''
      }, {
        id: 15,
        componentTypeName: 'Fresh Frozen Plasma - Apheresis',
        componentTypeCode: '3011',
        description: ''
      }, {
        id: 16,
        componentTypeName: 'Platelets Concentrate - Apheresis',
        componentTypeCode: '4021',
        description: ''
      }
    ];
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
    $scope.sourceComponentTypes.push(
      $scope.sourceComponentTypesDropDown[$scope.userSelection.selectedSourceComponentIndex]
    );
    $scope.sourceComponentTypesDropDown.splice($scope.userSelection.selectedSourceComponentIndex, 1);
  };

  $scope.addUnit = function() {
    $scope.producedComponentTypes.push(
      $scope.producedComponentTypesDropDown[$scope.userSelection.selectedProducedComponentIndex]
    );
    $scope.producedComponentTypesDropDown.splice($scope.userSelection.selectedProducedComponentIndex, 1);
  };

  $scope.removeSourceComponent = function() {
    var toRemove = $scope.sourceComponentTypes.filter(function(componentType) {
      return $scope.userSelection.selectedSourceComponentList.indexOf(String(componentType.id)) > -1;
    });

    toRemove.forEach(function(componentType) {
      // Remove the component type from the list of source components
      $scope.sourceComponentTypes.splice(
        $scope.sourceComponentTypes.indexOf(componentType),
        1);

      // Add the removed component type to the list of selectable source components
      $scope.sourceComponentTypesDropDown.push(componentType);
    });

    // Reset selection
    $scope.userSelection.selectedSourceComponentList = [];
  };

  $scope.removeProducedComponent = function() {
    var toRemove = $scope.producedComponentTypes.filter(function(componentType) {
      return $scope.userSelection.selectedProducedComponentList.indexOf(String(componentType.id)) > -1;
    });

    toRemove.forEach(function(componentType) {
      // Remove the component type from the list of produced components
      $scope.producedComponentTypes.splice(
        $scope.producedComponentTypes.indexOf(componentType),
        1);

      // Add the removed component type to the list of selectable produced components
      $scope.producedComponentTypesDropDown.push(componentType);
    });

    // Reset selection
    $scope.userSelection.selectedProducedComponentList = [];
  };

  $scope.saveComponentCombination = function() {
    if ($scope.componentCombinationForm.$invalid) {
      return;
    }

    $scope.savingComponentCombination = true;

    if ($routeParams.id) {
      ComponentCombinationsService.updateComponentCombination($scope.componentTypeCombination, function() {
        $location.path('/componentCombinations');
      }, function(response) {
        onSaveError(response);
      });
    } else {
      ComponentCombinationsService.createComponentCombination($scope.componentTypeCombination, function() {
        $location.path('/componentCombinations');
      }, function(response) {
        onSaveError(response);
      });
    }
  };

  function init() {
    $scope.sourceComponentTypesDropDown = mockComponentTypes();
    $scope.producedComponentTypesDropDown = mockComponentTypes();
  }

  init();


});
