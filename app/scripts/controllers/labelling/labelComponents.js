'use strict';

angular.module('bsis').controller('LabelComponentsCtrl', function($scope, $location, $log, $routeParams, LabellingService, DONATION) {

  $scope.serverErrorMessage = null;
  $scope.searchResults = null;
  $scope.dinLength = DONATION.DIN_LENGTH;
  $scope.packLabelDINLength = $scope.dinLength + 2;
  $scope.search = {
    donationIdentificationNumber: angular.isDefined($routeParams.donationIdentificationNumber) ? $routeParams.donationIdentificationNumber : null,
    componentType: angular.isDefined($routeParams.componentType) ? +$routeParams.componentType : null
  };
  $scope.componentTypes = [];
  $scope.labelVerified = true;
  $scope.sameDinScanned = false;
  $scope.verificationParams = {
    componentId: null,
    prePrintedDIN: null,
    packLabelDIN: null
  };

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

  $scope.verifyPackLabel = function(componentId, labellingVerificationForm) {
    if (labellingVerificationForm.$invalid) {
      return;
    }
    if ($scope.verificationParams.prePrintedDIN === $scope.verificationParams.packLabelDIN) {
      $scope.sameDinScanned = true;
      $scope.verifying = false;
      return;
    }
    $scope.submitted = true;
    $scope.verifying = true;
    $scope.verificationParams.componentId = componentId;
    LabellingService.verifyPackLabel($scope.verificationParams, function(res) {
      $scope.labelVerified = res.labelVerified;
      $scope.verifying = false;
    }, function(err) {
      $log.error(err);
      $scope.verifying = false;
    });
  };

  $scope.printPackLabel = function(componentId) {
    $scope.serverErrorMessage = null;
    LabellingService.printPackLabel(componentId, function(response) {
      $scope.labelZPL = response.labelZPL;
      $log.debug('$scope.labelZPL: ', $scope.labelZPL);
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
