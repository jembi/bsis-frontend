'use strict';

angular.module('bsis').controller('DonorCounsellingDetailsCtrl', function($scope, $window, $routeParams, DonorService, PostDonationCounsellingService, TestingService) {

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
      console.error(err);
      $scope.updatingCounselling = false;
    });
  };

  // Fetch form fields
  PostDonationCounsellingService.getPostDonationCounsellingFormFields(function(response) {
    $scope.counsellingStatuses = response.counsellingStatuses;
  }, function(err) {
    console.error(err);
  });

  // Fetch data
  DonorService.getDonorPostDonationCounselling($routeParams.donorId, function(postDonationCounselling) {
    $scope.postDonationCounselling = postDonationCounselling;
    $scope.donation = postDonationCounselling.donation;
    $scope.donor = postDonationCounselling.donor;

    if (!$scope.postDonationCounselling.counsellingDate) {
      $scope.postDonationCounselling.counsellingDate = new Date();
    }

    TestingService.getTestResultsByDIN(postDonationCounselling.donation.donationIdentificationNumber, function(response) {
      if (response !== false) {
        $scope.testResults = response.testResults.recentTestResults;
      }
    });
  }, function(err) {
    console.error(err);
  });
});
