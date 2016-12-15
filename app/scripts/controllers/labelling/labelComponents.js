'use strict';

angular.module('bsis').controller('LabelComponentsCtrl', function($scope, $location, $log, $routeParams, LabellingService) {

  $scope.serverErrorMessage = null;
  $scope.searchResults = null;
  $scope.search = {
    donationIdentificationNumber: angular.isDefined($routeParams.donationIdentificationNumber) ? $routeParams.donationIdentificationNumber : null,
    componentType: angular.isDefined($routeParams.componentType) ? +$routeParams.componentType : null
  };
  $scope.componentTypes = [];
  $scope.verificationParams = {
    componentId: null,
    prePrintedDIN: null,
    packLabelDIN: null
  };
  $scope.verifyComponent = null;
  $scope.verifying = false;
  $scope.verificationStatus = '';

  $scope.getComponents = function(form) {

    if (form && form.$invalid) {
      return;
    }

    $scope.serverErrorMessage = null;
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

  $scope.verifyPackLabel = function(component, labellingVerificationForm) {
    $scope.verifying = true;
    try {
      if (labellingVerificationForm.$invalid) {
        return;
      }
      if ($scope.verificationParams.prePrintedDIN === $scope.verificationParams.packLabelDIN) {
        $scope.verificationStatus = 'sameDinScanned';
        return;
      }
      $scope.verificationParams.componentId = component.id;
      LabellingService.verifyPackLabel($scope.verificationParams, function(response) {
        if (response.labelVerified) {
          $scope.verifyComponent = null;
          component.verificationStatus = 'verified';
        } else {
          $scope.verificationStatus = 'notVerified';
        }
      }, function(err) {
        $log.error(err);
      });
    } finally {
      $scope.verifying = false;
    }
  };

  $scope.printPackLabel = function(component) {
    $scope.serverErrorMessage = null;
    LabellingService.printPackLabel(component.id, function(response) {
      $scope.labelZPL = response.labelZPL;
      $log.debug('$scope.labelZPL: ', $scope.labelZPL);
      $scope.verifyComponent = component;
    }, function(err) {
      if (err.errorCode === 'CONFLICT') {
        $scope.serverErrorMessage = 'This component cannot be labelled - please check the status of the donor and donation';
      }
      $log.error(err);
    });
  };

  $scope.printDiscardLabel = function(componentId) {
    LabellingService.printDiscardLabel(componentId, function(response) {
      $scope.labelZPL = response.labelZPL;
      $log.debug('$scope.labelZPL: ', $scope.labelZPL);
    }, function(err) {
      $log.error(err);
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
    $scope.serverErrorMessage = null;
    $scope.clearLabelVerificationForm();
  };

  $scope.clearLabelVerificationForm = function() {
    $scope.searchResults = null;
    $scope.verificationParams.prePrintedDIN = null;
    $scope.verificationParams.packLabelDIN = null;
    $scope.verifyComponent = null;
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
