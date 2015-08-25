'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, Api, DonorService, LocationsService, DATEFORMAT) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];
  $scope.donations = [];

  $scope.searched = false;

  $scope.search = {
    anyDonorPanel: true,
    anyDate: true,
    selectedDonorPanels: [],
    startDate: null,
    endDate: null
  };

  $scope.master = angular.copy($scope.search);

  LocationsService.getDonorPanels(function(donorPanels) {
    $scope.donorPanels = donorPanels;
  });

  $scope.clearSearch = function() {
    $scope.searched = false;
    $scope.search = angular.copy($scope.master);
  };

  $scope.clearDates = function() {
    if ($scope.search.anyDate) {
      $scope.search.startDate = null;
      $scope.search.endDate = null;
    }
  };

  $scope.clearDonorPanels = function() {
    if ($scope.search.anyDonorPanel) {
      $scope.search.selectedDonorPanels = [];
    }
  };

  $scope.viewDonorCounselling = function(donation) {
    DonorService.setDonor(donation.donor);
    $location.path('/viewDonor').search({
      tab: 'donations',
      din: donation.donationIdentificationNumber
    });
  };

  $scope.refresh = function() {

    var query = {
      flaggedForCounselling: true
    };

    if (!$scope.search.anyDate && $scope.search.startDate) {
      query.startDate = $scope.search.startDate.toISOString();
    }

    if (!$scope.search.anyDate && $scope.search.endDate) {
      query.endDate = $scope.search.endDate;
    }

    if (!$scope.search.anyDonorPanel && $scope.search.selectedDonorPanels.length > 0) {
      query.donorPanel = $scope.search.selectedDonorPanels;
    }

    Api.DonationSummaries.query(query, function(response) {
      $scope.searched = true;
      $scope.donations = response;
    }, function(err) {
      console.error(err);
    });
  };
});
