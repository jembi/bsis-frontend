'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, $routeParams, Api, LocationsService, DATEFORMAT) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];
  $scope.donations = [];

  $scope.searched = false;

  var master = {
    selectedDonorPanels: [],
    startDate: null,
    endDate: null
  };

  $scope.search = angular.copy(master);

  if ($routeParams.startDate) {
    $scope.search.startDate = new Date($routeParams.startDate);
  }

  if ($routeParams.endDate) {
    $scope.search.endDate = new Date($routeParams.endDate);
  }

  if ($routeParams.donorPanel) {
    var donorPanels = $routeParams.donorPanel;
    if (!angular.isArray(donorPanels)) {
      donorPanels = [donorPanels];
    }
    $scope.search.selectedDonorPanels = donorPanels;
  }

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

  function getISOString(maybeDate) {
    return angular.isDate(maybeDate) ? maybeDate.toISOString() : maybeDate;
  }

  $scope.refresh = function() {

    var queryParams = {
      search: true
    };

    var query = {
      flaggedForCounselling: true
    };

    if ($scope.search.startDate) {
      var startDate = getISOString($scope.search.startDate);
      query.startDate = startDate;
      queryParams.startDate = startDate;
    }

    if ($scope.search.endDate) {
      var endDate = getISOString($scope.search.endDate);
      query.endDate = endDate;
      queryParams.endDate = endDate;
    }

    if ($scope.search.selectedDonorPanels.length > 0) {
      query.donorPanel = $scope.search.selectedDonorPanels;
      queryParams.donorPanel = $scope.search.selectedDonorPanels;
    }

    $location.search(queryParams);

    Api.DonationSummaries.query(query, function(response) {
      $scope.searched = true;
      $scope.donations = response;
    }, function(err) {
      console.error(err);
    });
  };

  if ($routeParams.search) {
    $scope.refresh();
  }
});
