'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, Api, LocationsService, DATEFORMAT) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];

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
    $scope.search = angular.copy($scope.master);
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

    Api.Donors.query(query, function(response) {
      $scope.donors = response;
    }, function(err) {
      console.error(err);
    });
  };

  $scope.refresh();
});
