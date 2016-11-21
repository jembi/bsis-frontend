'use strict';

angular.module('bsis').controller('ManageBloodTestingRuleCtrl', function($scope, $location, $log, $timeout, $routeParams, BloodTestingRulesService, BloodTestsService) {

  var donationFieldValues = [];
  var donationFields = [];
  $scope.donationFields = [];
  $scope.testOutcomes = [];
  $scope.donationFieldValues = [];

  $scope.bloodTestingRule = {
    bloodTest: null,
    pattern: '',
    donationFieldChanged: '',
    newInformation: '',
    pendingTests: [],
    isDeleted: false
  };

  $scope.userSelection = {
    bloodTestToAdd: null,
    bloodTestsToRemove: []
  };

  $scope.bloodTestingRuleForm = {};

  $scope.cancel = function() {
    $location.path('/bloodTestingRules');
  };

  $scope.updateDonationAndTestOutcomeDropDowns = function() {
    if ($scope.bloodTestingRule.bloodTest) {
      BloodTestsService.getBloodTestById({id: $scope.bloodTestingRule.bloodTest.id}, function(response) {
        $scope.donationFields = donationFields[response.bloodTest.category];
        $scope.testOutcomes = response.bloodTest.validResults;
        $scope.bloodTestingRule.pendingTests = $scope.bloodTestingRule.pendingTests.filter(function(test) {
          return test.category === response.bloodTest.category;
        });
      });
    }
  };

  $scope.updateDonationFieldValuesDropdown = function() {
    $scope.donationFieldValues = donationFieldValues[$scope.bloodTestingRule.donationFieldChanged];
  };

  $scope.addPendingTest = function() {
    $scope.bloodTestingRule.pendingTests.push($scope.userSelection.bloodTestToAdd);
    $scope.userSelection.bloodTestToAdd = null;
  };

  $scope.isPendingTest = function(test) {
    return $scope.bloodTestingRule.pendingTests.indexOf(test) !== -1;
  };

  $scope.removePendingTests = function() {
    $scope.bloodTestingRule.pendingTests = $scope.bloodTestingRule.pendingTests.filter(function(test) {
      return $scope.userSelection.bloodTestsToRemove.indexOf(test) === -1;
    });
    $scope.userSelection.bloodTestsToRemove = [];
  };

  $scope.saveBloodTestingRule = function() {
    if ($scope.bloodTestingRuleForm.$invalid) {
      return;
    }

    $scope.savingBloodTestingRule = true;

    var save = $routeParams.id ? BloodTestingRulesService.updateBloodTestingRule : BloodTestingRulesService.createBloodTestingRule;
    delete $scope.bloodTestingRule.testNameShort;

    save($scope.bloodTestingRule, function() {
      $location.path('/bloodTestingRules');
    }, function(err) {
      $scope.savingBloodTestingRule = false;
      $log.error(err);
    });
  };

  function initExistingBloodTestingRule() {
    BloodTestingRulesService.getBloodTestingRuleById({id: $routeParams.id}, function(response) {
      $scope.bloodTestingRule = response.bloodTestingRule;
      $scope.bloodTestingRule.pendingTests = $scope.pendingBloodTests.filter(function(test) {
        return $scope.bloodTestingRule.pendingTests.some(function(pending) {
          return test.id === pending.id;
        });
      });
      $scope.updateDonationFieldValuesDropdown();
      $scope.updateDonationAndTestOutcomeDropDowns();
    });
  }

  function init() {
    BloodTestingRulesService.getBloodTestingRuleForm(function(response) {
      $scope.bloodTests = response.bloodTests;
      $scope.pendingBloodTests = response.bloodTests.filter(function(test) {
        return test.bloodTestType !== 'BASIC_TTI' && test.bloodTestType !== 'BASIC_BLOODTYPING';
      });
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
