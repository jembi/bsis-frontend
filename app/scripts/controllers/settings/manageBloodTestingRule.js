'use strict';

angular.module('bsis').controller('ManageBloodTestingCtrl', function($scope, $location, $log, $timeout, $routeParams, BloodTestingRulesService, BloodTestsService) {

  var donationFieldValues = [];
  //var pendingTests = [];
  var donationFields = [];
  $scope.donationFields = [];
  $scope.testOutcomes = [];
  $scope.donationFieldValues = [];
  //$scope.pendingTests = [];

  $scope.bloodTestingRule = {
    bloodTest: '',
    pattern: '',
    donationFieldChanged: '',
    newInformation: '',
    //pendingTestsIds: [],
    isDeleted: false
  };

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

  //removed code was here

  function init() {
    BloodTestingRulesService.getBloodTestingRuleForm(function(response) {
      $scope.bloodTests = response.bloodTests;
      $scope.bloodTests.forEach(function(bloodTest) {
        donationFields[bloodTest.category] = response.donationFields[bloodTest.category];
      });
      donationFieldValues = response.newInformation;
      /*if ($routeParams.id) {
        initExistingBloodTest();
      }*/
    }, $log.error);
  }

  init();

});
