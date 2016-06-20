'use strict';

angular.module('bsis').controller('LabelComponentsCtrl', function($scope, $location, $log, $routeParams, LabellingService) {

  $scope.searchResults = null;
  $scope.search = {
    donationIdentificationNumber: angular.isDefined($routeParams.donationIdentificationNumber) ? $routeParams.donationIdentificationNumber : null,
    componentType: angular.isDefined($routeParams.componentType) ? +$routeParams.componentType : null
  };
  $scope.componentTypes = [];

  $scope.getComponents = function(form) {

    if (form && form.$invalid) {
      return;
    }

    $location.search(angular.extend({search: true}, $scope.search));
    $scope.searching = true;
    $scope.searchResults = false;
    LabellingService.getComponents($scope.search, function(response) {
      $scope.components = response.components;
      $scope.searchResults = true;
      $scope.searching = false;
    }, function(err) {
      $log.error(err);
      $scope.searching = false;
    });
  };

  if ($routeParams.search) {
    $scope.getComponents();
  }

  $scope.printPackLabel = function(componentId) {
    LabellingService.printPackLabel(componentId, function(response) {
      $scope.labelZPL = response.labelZPL;
      $log.debug('$scope.labelZPL: ', $scope.labelZPL);
    }, $log.error);
  };

  $scope.printDiscardLabel = function(componentId) {
    LabellingService.printDiscardLabel(componentId, function(response) {
      $scope.labelZPL = response.labelZPL;
      $log.debug('$scope.labelZPL: ', $scope.labelZPL);
    }, $log.error);
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
    LabellingService.getComponentForm({}, function(response) {
      $scope.componentTypes = response.componentTypes;
    }, $log.error);
  }

  fetchFormFields();
});
