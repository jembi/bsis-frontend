'use strict';

angular.module('bsis').controller('ManageBloodTestingRuleCtrl', function($scope, $location, $log, $timeout, $routeParams, BloodTestingRulesService, BloodTestsService) {

  var donationFieldValues = [];
  var donationFields = [];
  $scope.donationFields = [];
  $scope.testOutcomes = [];
  $scope.donationFieldValues = [];
  $scope.pendingBloodTestsDropDown = [];

  $scope.bloodTestingRule = {
    bloodTest: '',
    pattern: '',
    donationFieldChanged: '',
    newInformation: '',
    pendingTestsIds: [],
    isDeleted: false
  };

  $scope.userSelection = {
    selectedPendingBloodTestIndex: null,
    selectedPendingBloodTestList: []
  };

  $scope.bloodTestingRuleForm = {};

  $scope.cancel = function() {
    $location.path('/bloodTestingRules');
  };

  $scope.$watch('bloodTestingRule.bloodTest', function() {
    if ($scope.bloodTestingRule.bloodTest.length) {
      $timeout(function() {
        BloodTestsService.getBloodTestById({id: $scope.bloodTestingRule.bloodTest}, function(response) {
          $scope.donationFields = donationFields[response.bloodTest.category];
          $scope.testOutcomes = response.bloodTest.validResults;
        });
      });
    }
  });

  $scope.$watch('bloodTestingRule.donationFieldChanged', function() {
    $timeout(function() {
      $scope.donationFieldValues = donationFieldValues[$scope.bloodTestingRule.donationFieldChanged];
    });
  });

  var validatePendingTestsList = function() {
    if ($scope.bloodTestingRule.pendingTestsIds.length == 0) {
      $scope.bloodTestingRule.pendingTestList.$setValidity('required', false);
    } else {
      $scope.bloodTestingRuleForm.pendingTestList.$setValidity('required', true);
    }
  };

  $scope.addPendingTest = function() {
    $scope.bloodTestingRule.pendingTestsIds.push(
      $scope.pendingBloodTestsDropDown[$scope.userSelection.selectedPendingBloodTestIndex]
    );
    $scope.pendingBloodTestsDropDown[$scope.userSelection.selectedPendingBloodTestIndex].disabled = true;
    $scope.userSelection.selectedPendingBloodTestIndex = null;
    validatePendingTestsList();
  };

  $scope.removePendingTest = function() {
    $scope.userSelection.selectedPendingBloodTestList.reverse();

    var toRemove = $scope.bloodTestingRule.pendingTestsIds.filter(function(pendingTest, index) {
      return $scope.userSelection.selectedPendingBloodTestList.indexOf(String(index)) > -1;
    });

    toRemove.forEach(function(pendingTest) {
      $scope.bloodTestingRule.pendingTestsIds.splice(
        $scope.bloodTestingRule.pendingTestsIds.indexOf(pendingTest),
        1);

      pendingTest.disabled = false;
    });

    // Reset selection
    $scope.userSelection.selectedPendingBloodTestList = [];
    validatePendingTestsList();
  };

  $scope.saveBloodTestingRule = function() {
    $scope.savingBloodTestingRule = true;
    if ($routeParams.id) {
      //hook up service to update
    } else {
      //hook up service to create new record
    }
  };

  function initExistingBloodTestingRule() {
    // empty hook up BloodTestingRuleService to get current BloodTestingRule
  }

  function init() {
    BloodTestingRulesService.getBloodTestingRuleForm(function(response) {
      $scope.bloodTests = response.bloodTests;
      $scope.pendingBloodTestsDropDown = response.bloodTests;
      $scope.bloodTests.forEach(function(bloodTest) {
        donationFields[bloodTest.category] = response.donationFields[bloodTest.category];
      });
      donationFieldValues = response.newInformation;
      if ($routeParams.id) {
        initExistingBloodTestingRule();
      }
    }, $log.error);
  }

  init();

});
