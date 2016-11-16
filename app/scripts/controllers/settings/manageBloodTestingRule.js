'use strict';

angular.module('bsis').controller('ManageBloodTestingRuleCtrl', function($scope, $location, $log, $timeout, $routeParams, BloodTestingRulesService, BloodTestsService) {

  var donationFieldValues = [];
  var donationFields = [];
  $scope.donationFields = [];
  $scope.testOutcomes = [];
  $scope.donationFieldValues = [];
  $scope.pendingBloodTestsDropDown = [];

  $scope.bloodTestingRule = {
    bloodTest: {id:''},
    pattern: '',
    donationFieldChanged: '',
    newInformation: '',
    pendingTests: [],
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

  $scope.updateDonationAndTestOutcomeDropDowns = function() {
    if ($scope.bloodTestingRule.bloodTest.id.length) {
      BloodTestsService.getBloodTestById({id: $scope.bloodTestingRule.bloodTest.id}, function(response) {
        $scope.donationFields = donationFields[response.bloodTest.category];
        $scope.testOutcomes = response.bloodTest.validResults;
      });
    }
  };

  $scope.updateDonationFieldValuesDropdown = function() {
    $scope.donationFieldValues = donationFieldValues[$scope.bloodTestingRule.donationFieldChanged];
  };

  var validatePendingTestsList = function() {
    if ($scope.bloodTestingRule.pendingTests.length == 0) {
      $scope.bloodTestingRule.pendingTestList.$setValidity('required', false);
    } else {
      $scope.bloodTestingRuleForm.pendingTestList.$setValidity('required', true);
    }
  };

  $scope.addPendingTest = function() {
    $scope.bloodTestingRule.pendingTests.push(
      $scope.pendingBloodTestsDropDown[$scope.userSelection.selectedPendingBloodTestIndex]
    );
    $scope.pendingBloodTestsDropDown[$scope.userSelection.selectedPendingBloodTestIndex].disabled = true;
    $scope.userSelection.selectedPendingBloodTestIndex = null;
    validatePendingTestsList();
  };

  $scope.removePendingTest = function() {
    $scope.userSelection.selectedPendingBloodTestList.reverse();

    var toRemove = $scope.bloodTestingRule.pendingTests.filter(function(pendingTest, index) {
      return $scope.userSelection.selectedPendingBloodTestList.indexOf(String(index)) > -1;
    });

    toRemove.forEach(function(pendingTest) {
      $scope.bloodTestingRule.pendingTests.splice(
        $scope.bloodTestingRule.pendingTests.indexOf(pendingTest),
        1);

      pendingTest.disabled = false;
    });

    // Reset selection
    $scope.userSelection.selectedPendingBloodTestList = [];
    validatePendingTestsList();
  };

  $scope.saveBloodTestingRule = function() {
    if ($scope.bloodTestingRuleForm.$invalid) {
      return;
    }

    $scope.savingBloodTestingRule = true;

    // Remove disabled element out of pendingTests as it is not part of the request
    angular.forEach($scope.bloodTestingRule.pendingTests, function(pendingTest) {
      delete pendingTest.disabled;
    });

    BloodTestingRulesService.createBloodTestingRule($scope.bloodTestingRule, function() {
      $location.path('/bloodTestingRules');
    }, function() {
      $scope.savingBloodTestingRule = false;
    });
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
