'use strict';

angular.module('bsis').controller('ManageLocationCtrl', function($scope, $location, $log, LocationsService, $timeout, $routeParams) {

  $scope.location = {};
  $scope.locationForm = {};

  $scope.$watch('location.name', function() {
    $timeout(function() {
      $scope.locationForm.name.$setValidity('duplicate', true);
    });
  });

  $scope.cancel = function() {
    $scope.location = {};
    $scope.locationForm.$setPristine();
  };

  $scope.saveLocation = function() {
    if ($scope.locationForm.$invalid) {
      return;
    }

    $scope.savingLocation = true;
    if ($routeParams.id) {
      LocationsService.updateLocation($scope.location, function(reponse) {
        $log.info('Updated location: ' + reponse.name);
        //$location.path('/manageLocations');
        $scope.savingLocation = false;
      }, function(response) {
        if (response.data && response.data.name) {
          $scope.locationForm.name.$setValidity('duplicate', false);
        }
        $scope.savingLocation = false;
      });
    } else {
      LocationsService.addLocation($scope.location, function(reponse) {
        $log.info('Saved location: ' + reponse.name);
        //$location.path('/manageLocations');
        $scope.savingLocation = false;
      }, function(response) {
        if (response.data && response.data.name) {
          $scope.locationForm.name.$setValidity('duplicate', false);
        }
        $scope.savingLocation = false;
      });
    }
  };

  $scope.validateLocationType = function() {
    return $scope.location.isVenue || $scope.location.isUsageSite || $scope.location.isProcessingSite || $scope.location.isDistributionSite || $scope.location.isTestingSite;
  };

  function init() {
    if ($routeParams.id) {
      LocationsService.getLocationById({id: $routeParams.id}, function(response) {
        $scope.location = response.location;
      }, $log.error);
    }
  }

  init();

});
