'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, Api, DonorService, LocationsService, DATEFORMAT) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];
  $scope.donations = [];

  $scope.searched = false;

  $scope.search = {
    selectedDonorPanel: null,
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

    if ($scope.search.startDate) {
      query.startDate = $scope.search.startDate.toISOString();
    }

    if ($scope.search.endDate) {
      query.endDate = $scope.search.endDate;
    }

    if ($scope.search.selectedDonorPanel) {
      query.donorPanel = $scope.search.selectedDonorPanel;
    }

    Api.DonationSummaries.query(query, function(response) {
      $scope.searched = true;
      $scope.donations = response;
    }, function(err) {
      console.error(err);
    });
  };
});
