'use strict';

angular.module('bsis')
  .controller('LabellingCtrl', function($scope, $location, $log, LabellingService, ICONS, PERMISSIONS, $routeParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = [{}];
    //$scope.data = data;
    $scope.searchResults = '';
    $scope.search = {
      'donationIdentificationNumber': ''
    };
    $scope.packDIN = '';

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        return !!($location.path() === '/labelling' && path === '/labelComponents');
      }
    };

    $scope.checkLabellingStatus = function(donationIdentificationNumber) {
      $location.search(
        {
          search: true,
          donationIdentificationNumber: donationIdentificationNumber
        }
      );
      $scope.searching = true;
      LabellingService.checkLabellingStatus(donationIdentificationNumber, function(response) {
        if (response !== false) {
          data = response;
          //$scope.data = data;
          $scope.components = data.components;
          //$scope.printPackLabelBoolean = data.printPackLabel;
          //$scope.printDiscardLabelBoolean = data.printDiscardLabel;
          $scope.searchResults = true;
          $scope.packDIN = donationIdentificationNumber;
        } else {
          $scope.searchResults = false;
        }
        $scope.searching = false;
      });
    };

    if ($routeParams.search) {
      $scope.checkLabellingStatus($routeParams.donationIdentificationNumber);
    }

    $scope.printPackLabel = function(componentId) {
      LabellingService.printPackLabel(componentId, function(response) {
        if (response !== false) {
          data = response;
          $scope.data = data;
          $scope.labelZPL = data.labelZPL;
          $log.debug('$scope.labelZPL: ', $scope.labelZPL);
        }
      });
    };

    $scope.printDiscardLabel = function(componentId) {
      LabellingService.printDiscardLabel(componentId, function(response) {
        if (response !== false) {
          data = response;
          $scope.data = data;
          $scope.labelZPL = data.labelZPL;
          $log.debug('$scope.labelZPL: ', $scope.labelZPL);
        }
      });
    };

    $scope.clear = function() {
      $location.search({});
      $scope.packDIN = '';
      $scope.search = {};
      $scope.searchResults = '';
    };

  });
