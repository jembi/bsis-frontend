'use strict';

angular.module('bsis').controller('ManageBloodTestCtrl', function($scope, $location, $log, $timeout) {

  var types = {};

  $scope.notSelectedResults = [];

  $scope.bloodTest = {
    isDeleted: false,
    isActive: true,
    testName: '',
    testNameShort: '',
    bloodTestCategory: '',
    bloodTestType: '',
    flagComponentsForDiscard: false,
    flagComponentsContainingPlasmaForDiscard: false,
    validResults: [],
    negativeResults: [],
    positiveResults: []
  };

  $scope.cancel = function() {
    $location.path('/bloodTests');
  };

  $scope.$watch('bloodTest.bloodTestCategory', function() {
    $timeout(function() {
      if ($scope.bloodTest.bloodTestCategory === 'TTI') {
        $scope.types = types.TTI;
      } else if ($scope.bloodTest.bloodTestCategory === 'BLOOD_TYPING') {
        $scope.types = types.BLOOD_TYPING;
      }
    });
  });

  // Add outcome methods

  function addOutcome(outcome, outcomeFormField, outcomesListToAddTo) {
    if (!outcome) {
      return false;
    }
    if (outcomesListToAddTo.indexOf(outcome) !== -1) {
      outcomeFormField.$setValidity('duplicate', false);
      return false;
    }
    outcomeFormField.$setValidity('duplicate', true);
    outcomesListToAddTo.push(outcome);
    return true;
  }

  $scope.addValidOutcome = function() {
    // Add to valid results list
    var success = addOutcome($scope.validOutcome, $scope.bloodTestForm.validOutcome, $scope.bloodTest.validResults);
    // Add to notSelectedResults
    if (success) {
      $scope.bloodTestForm.validOutcome.$setValidity('required', true);
      $scope.notSelectedResults.push($scope.validOutcome);
    }
    $scope.validOutcome = null;
  };

  $scope.addNegativeOutcome = function() {
    // Add to negative results list
    var success = addOutcome($scope.negativeOutcome, $scope.bloodTestForm.negativeOutcome, $scope.bloodTest.negativeResults);
    // Remove from notSelectedResults
    if (success) {
      var index = $scope.notSelectedResults.indexOf($scope.negativeOutcome);
      $scope.notSelectedResults.splice(index, 1);
    }
    $scope.negativeOutcome = null;
  };

  $scope.addPositiveOutcome = function() {
    // Add to positive results list
    var success = addOutcome($scope.positiveOutcome, $scope.bloodTestForm.positiveOutcome, $scope.bloodTest.positiveResults);
    // Remove from notSelectedResults
    if (success) {
      var index = $scope.notSelectedResults.indexOf($scope.positiveOutcome);
      $scope.notSelectedResults.splice(index, 1);
    }
    $scope.positiveOutcome = null;
  };

  // Remove outcome methods

  function removeOutcomes(removedOutcomes, outcomesListToRemoveFrom) {
    removedOutcomes.forEach(function(removedOutcome) {
      outcomesListToRemoveFrom.forEach(function(outcome, index) {
        if (outcome === removedOutcome) {
          outcomesListToRemoveFrom.splice(index, 1);
        }
      });
    });
  }

  $scope.removeValidOutcomes = function() {
    // Check if the outcomes have been added to the negative or positive list
    var canRemove = true;
    $scope.removedValidOutcomes.forEach(function(removedValidOutcome) {
      if ($scope.bloodTest.negativeResults.indexOf(removedValidOutcome) !== -1 || $scope.bloodTest.positiveResults.indexOf(removedValidOutcome) !== -1) {
        $scope.bloodTestForm.removedValidOutcomes.$setValidity('cantremove', false);
        canRemove = false;
      }
    });

    if (canRemove) {
      $scope.bloodTestForm.removedValidOutcomes.$setValidity('cantremove', true);
      // Remove from valid results list
      removeOutcomes($scope.removedValidOutcomes, $scope.bloodTest.validResults);
      // Remove from notSelectedResults
      $scope.removedValidOutcomes.forEach(function(outcome) {
        var index = $scope.notSelectedResults.indexOf(outcome);
        $scope.notSelectedResults.splice(index, 1);
      });
    }
  };

  $scope.removeNegativeOutcomes = function() {
    // Remove from negative results list
    removeOutcomes($scope.removedNegativeOutcomes, $scope.bloodTest.negativeResults);
    // Add to notSelectedResults
    $scope.removedNegativeOutcomes.forEach(function(outcome) {
      $scope.notSelectedResults.push(outcome);
    });
  };

  $scope.removePositiveOutcomes = function() {
    // Remove from positive results list
    removeOutcomes($scope.removedPositiveOutcomes, $scope.bloodTest.positiveResults);
    // Add to notSelectedResults
    $scope.removedPositiveOutcomes.forEach(function(outcome) {
      $scope.notSelectedResults.push(outcome);
    });
  };

  $scope.saveBloodTest = function() {
    if ($scope.bloodTest.validResults.length === 0) {
      $scope.bloodTestForm.validOutcome.$setValidity('required', false);
    }

    if ($scope.bloodTestForm.$invalid) {
      return;
    }

    $scope.savingBloodTest = true;
    $log.info('Not yet implemented');
    $location.path('/bloodTests');
  };

  function init() {
    $scope.categories = ['TTI', 'BLOOD_TYPING'];
    $scope.types = [];
    types.TTI = ['BASIC_TTI', 'REPEAT_TTI', 'CONFIRMATORY_TTI'];
    types.BLOOD_TYPING = ['BASIC_BLOODTYPING', 'REPEAT_BLOODTYPING'];
  }

  init();

});
