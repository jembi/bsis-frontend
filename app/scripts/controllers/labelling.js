'use strict';

angular.module('bsis')
  .controller('LabellingCtrl', function($scope, $location, $log, LabellingService, ComponentTypesService, ICONS, PERMISSIONS, $routeParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = [{}];
    //$scope.data = data;
    $scope.searchResults = '';
    $scope.search = {
      donationIdentificationNumber: angular.isDefined($routeParams.donationIdentificationNumber) ? $routeParams.donationIdentificationNumber : null,
      componentType: angular.isDefined($routeParams.componentType) ? +$routeParams.componentType : null
    };
    $scope.componentTypes = [];

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

    $scope.checkLabellingStatus = function(form) {

      if (form.$invalid) {
        return;
      }

      $location.search(angular.extend({search: true}, $scope.search));
      $scope.searching = true;
      LabellingService.checkLabellingStatus($scope.search, function(response) {
        if (response !== false) {
          data = response;
          //$scope.data = data;
          $scope.components = data.components;
          //$scope.printPackLabelBoolean = data.printPackLabel;
          //$scope.printDiscardLabelBoolean = data.printDiscardLabel;
          $scope.searchResults = true;
        } else {
          $scope.searchResults = false;
        }
        $scope.searching = false;
      });
    };

    if ($routeParams.search) {
      $scope.checkLabellingStatus();
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

    $scope.clear = function(form) {
      if (form) {
        form.$setUntouched();
        form.$setPristine();
      }
      $location.search({});
      $scope.search = {};
      $scope.searchResults = '';
    };

    $scope.onTextClick = function($event) {
      // Select the target's text on click
      $event.target.select();
    };

    function fetchFormFields() {
      ComponentTypesService.getComponentTypes({includeDeleted: false}, function(componentTypes) {
        $scope.componentTypes = componentTypes;
      }, function(err) {
        $log.error(err);
      });
    }

    fetchFormFields();

  });
