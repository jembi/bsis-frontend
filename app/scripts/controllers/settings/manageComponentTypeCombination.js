'use strict';

angular.module('bsis').controller('ManageComponentTypeCombinationCtrl', function($scope, $location, $log, $timeout) {
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

  $scope.$watch('sourceComponentTypes.combinationName', function() {
    $timeout(function() {
      $scope.componentCombinationForm.componentCombinationName.$setValidity('duplicate', true);
    });
  });

  // Disabled to pass 'npm run lint' (to be enabled in hook up task)
  // function onSaveError(err) {
  //   if (err.data && err.data.combinationName) {
  //     $scope.componentCombinationForm.combinationName.$setValidity('duplicate', false);
  //   }
  //   $scope.savingComponentCombination = false;
  // }

  var validateComponentLists = function() {
    // Validate source component list
    if ($scope.componentTypeCombination.sourceComponentTypes.length == 0) {
      $scope.componentCombinationForm.sourceComponentList.$setValidity('required', false);
    } else {
      $scope.componentCombinationForm.sourceComponentList.$setValidity('required', true);
    }

    // Validate produced component list
    if ($scope.componentTypeCombination.componentTypes.length == 0) {
      $scope.componentCombinationForm.producedComponentList.$setValidity('required', false);
    } else {
      $scope.componentCombinationForm.producedComponentList.$setValidity('required', true);
    }
  };

  $scope.cancel = function() {
    $location.path('/componentTypeCombinations');
  };

  $scope.addSourceComponent = function() {
    $scope.componentTypeCombination.sourceComponentTypes.push(
      $scope.sourceComponentTypesDropDown[$scope.userSelection.selectedSourceComponentIndex]
    );
    $scope.sourceComponentTypesDropDown[$scope.userSelection.selectedSourceComponentIndex].disabled = true;
    $scope.userSelection.selectedSourceComponentIndex = null;
    validateComponentLists();
  };

  $scope.addUnit = function() {
    $scope.componentTypeCombination.componentTypes.push(
      $scope.producedComponentTypesDropDown[$scope.userSelection.selectedProducedComponentIndex]
    );
    $scope.producedComponentTypesDropDown[$scope.userSelection.selectedProducedComponentIndex].disabled = true;
    $scope.userSelection.selectedProducedComponentIndex = null;
    validateComponentLists();
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
    validateComponentLists();
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
    validateComponentLists();
  };

  $scope.saveComponentCombination = function() {
    validateComponentLists();

    if ($scope.componentCombinationForm.$invalid) {
      return;
    }

    $log.debug('Todo - save component combination');
  };

  function init() {
    $scope.sourceComponentTypesDropDown = mockComponentTypes();
    $scope.producedComponentTypesDropDown = mockComponentTypes();
  }

  init();

});