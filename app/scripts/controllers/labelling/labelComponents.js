'use strict';

angular.module('bsis').controller('LabelComponentsCtrl', function($scope, $location, $log, LabellingService, ComponentTypesService, ICONS, PERMISSIONS, $routeParams) {

  $scope.searchResults = null;
  $scope.search = {
    donationIdentificationNumber: angular.isDefined($routeParams.donationIdentificationNumber) ? $routeParams.donationIdentificationNumber : null,
    componentType: angular.isDefined($routeParams.componentType) ? +$routeParams.componentType : null
  };
  $scope.componentTypes = [];

  $scope.checkLabellingStatus = function(form) {

    if (form && form.$invalid) {
      return;
    }

    $location.search(angular.extend({search: true}, $scope.search));
    $scope.searching = true;
    LabellingService.checkLabellingStatus($scope.search, function(response) {
      if (response !== false) {
        $scope.components = response.components;
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
        $scope.labelZPL = response.labelZPL;
        $log.debug('$scope.labelZPL: ', $scope.labelZPL);
      }
    });
  };

  $scope.printDiscardLabel = function(componentId) {
    LabellingService.printDiscardLabel(componentId, function(response) {
      if (response !== false) {
        $scope.labelZPL = response.labelZPL;
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
    $scope.searchResults = null;
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
