'use strict';

angular.module('bsis').controller('DonorCounsellingDetailsCtrl', function($scope, $window, $routeParams, $log, DonorService, PostDonationCounsellingService, TestingService, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.postDonationCounselling = {};
  $scope.donation = {};
  $scope.donor = {};

  $scope.counsellingStatuses = [];
  $scope.testResults = [];

  $scope.goBack = function() {
    $window.history.back();
  };

  $scope.updatePostDonationCounselling = function() {

    if (!$scope.postDonationCounselling.counsellingDate || !$scope.postDonationCounselling.counsellingStatus) {
      return;
    }

    var update = {
      id: $scope.postDonationCounselling.id,
      counsellingStatus: $scope.postDonationCounselling.counsellingStatus.id,
      counsellingDate: $scope.postDonationCounselling.counsellingDate,
      notes: $scope.postDonationCounselling.notes
    };

    $scope.updatingCounselling = true;
    PostDonationCounsellingService.updatePostDonationCounselling(update, function() {
      $scope.goBack();
      $scope.updatingCounselling = false;
    }, function(err) {
      $log.error(err);
      $scope.updatingCounselling = false;
    });
  };

  // Fetch form fields
  PostDonationCounsellingService.getPostDonationCounsellingFormFields(function(response) {
    $scope.counsellingStatuses = response.counsellingStatuses;
  }, function(err) {
    $log.error(err);
  });

  $scope.removeStatus = function() {
    $scope.updatingCounselling = true;
    PostDonationCounsellingService.updatePostDonationCounselling({
      id: $scope.postDonationCounselling.id,
      flaggedForCounselling: true
    }, function() {
      $scope.goBack();
      $scope.updatingCounselling = false;
    }, function(err) {
      $log.error(err.data);
      $scope.updatingCounselling = false;
    });
  };

  // Fetch data
  DonorService.getDonorPostDonationCounselling($routeParams.donorId, function(postDonationCounselling) {
    $scope.postDonationCounselling = postDonationCounselling;
    $scope.donation = postDonationCounselling.donation;
    $scope.donor = postDonationCounselling.donor;

    if (!$scope.postDonationCounselling.counsellingDate) {
      $scope.postDonationCounselling.counsellingDate = new Date();
    }

    TestingService.getTestResultsByDIN({donationIdentificationNumber: postDonationCounselling.donation.donationIdentificationNumber}, function(response) {
      $scope.testResults = response.testResults.recentTestResults;
    }, function(err) {
      $log.error(err);
    });
  }, function(err) {
    $log.error(err);
  });
});
