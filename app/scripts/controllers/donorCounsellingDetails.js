'use strict';

angular.module('bsis').controller('DonorCounsellingDetailsCtrl', function($scope, $location, $routeParams, DonorService, PostDonationCounsellingService, TestingService) {

  $scope.postDonationCounselling = {};
  $scope.donation = {};
  $scope.donor = {};

  $scope.counsellingStatuses = [];
  $scope.testResults = [];

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

    PostDonationCounsellingService.updatePostDonationCounselling(update, function() {
      $location.path('/donorCounselling');
    }, function(err) {
      console.error(err);
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
