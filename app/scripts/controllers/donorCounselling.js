'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, Api, LocationsService, DATEFORMAT) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];
  $scope.donations = [];

  $scope.searched = false;

  var master = {
    selectedDonorPanels: [],
    startDate: null,
    endDate: null
  };

  $scope.search = angular.fromJson(sessionStorage.getItem('donorCounsellingSearch')) || angular.copy(master);

  LocationsService.getDonorPanels(function(donorPanels) {
    $scope.donorPanels = donorPanels;
  });

  $scope.clearSearch = function() {
    $scope.searched = false;
    $scope.search = angular.copy(master);
  };

  $scope.clearDates = function() {
    $scope.search.startDate = null;
    $scope.search.endDate = null;
  };

  $scope.clearDonorPanels = function() {
    $scope.search.selectedDonorPanels = [];
  };

  $scope.viewDonorCounselling = function(donation) {
    $location.path('/donorCounselling/' + donation.donor.id);
  };

  $scope.refresh = function() {

    sessionStorage.setItem('donorCounsellingSearch', angular.toJson($scope.search));

    var query = {
      flaggedForCounselling: true
    };

    if ($scope.search.startDate) {
      var startDate = $scope.search.startDate;
      query.startDate = angular.isDate(startDate) ? startDate.toISOString() : startDate;
    }

    if ($scope.search.endDate) {
      var endDate = $scope.search.endDate;
      query.endDate = angular.isDate(endDate) ? endDate.toISOString() : endDate;
    }

    if ($scope.search.selectedDonorPanels.length > 0) {
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
