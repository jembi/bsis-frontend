'use strict';

angular.module('bsis').controller('RecordTransfusionsCtrl', function($scope, $log, $timeout, TransfusionService, BLOODGROUP, GENDER, DATEFORMAT) {

  $scope.submitted = false;
  $scope.componentTypes = null;
  $scope.locations = null;
  $scope.transfusionOutcomes = null;
  $scope.transfusionReactionTypes = null;
  $scope.genders = null;
  $scope.bloodGroups = null;
  $scope.today = moment().startOf('day').toDate();

  $scope.masterDetails = {
    donationIdentificationNumber: null,
    componentCode: null,
    componentType: {id: null},
    patient: {dateOfBirth: null},
    transfusionOutcome: null,
    transfusionReactionType: {id: null},
    notes: null,
    receivedFrom: {id: null},
    dateTransfused: $scope.today
  };

  $scope.transfusion = angular.copy($scope.masterDetails);

  function initializeRecordTransfusionForm() {
    TransfusionService.getTransfusionForm(function(response) {
      if (response !== false) {
        $scope.format = DATEFORMAT;
        $scope.componentTypes = response.componentTypes;
        $scope.locations = response.usageSites;
        $scope.transfusionOutcomes = response.transfusionOutcomes;
        $scope.genders = GENDER.options;
        $scope.transfusionReactionTypes = response.transfusionReactionTypes;
        $scope.bloodGroups = BLOODGROUP.options;
      }
    });
  }

  $scope.$watch('transfusion.donationIdentificationNumber', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.donationIdentificationNumber.$setValidity('invalid', true);
    });
  });

  $scope.$watch('transfusion.componentCode', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.componentCode.$setValidity('invalid', true);
    });
  });

  $scope.$watch('transfusion.componentType.id', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.componentType.$setValidity('invalid', true);
    });
  });

  $scope.$watch('transfusion.dateTransfused', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.dateTransfused.$setValidity('invalid', true);
    });
  });

  function onSaveError(err) {
    if (err.data && err.data.donationIdentificationNumber) {
      $scope.recordTransfusionsForm.donationIdentificationNumber.$setValidity('invalid', false);
      $scope.donationIdentificationNumberBackEndErrorMessage = err.data.donationIdentificationNumber;
    }

    if (err.data && err.data.componentCode) {
      $scope.recordTransfusionsForm.componentCode.$setValidity('invalid', false);
      $scope.componentCodeBackEndErrorMessage = err.data.componentCode;
    }

    if (err.data && err.data.componentType) {
      $scope.recordTransfusionsForm.componentType.$setValidity('invalid', false);
      $scope.componentTypeBackEndErrorMessage = err.data.componentType;
    }

    if (err.data && err.data.dateTransfused) {
      $scope.recordTransfusionsForm.dateTransfused.$setValidity('invalid', false);
      $scope.transfusedDateBackEndErrorMessage = err.data.dateTransfused;
    }
  }

  $scope.clearTransfusionReactionType = function() {
    $scope.transfusion.transfusionReactionType.id = null;
  };

  $scope.clearDonationIdentificationNumberErrorMessage = function() {
    $scope.donationIdentificationNumberBackEndErrorMessage = null;
  };

  $scope.clearComponentCodeAndTypeErrorMessage = function() {
    $scope.componentCodeBackEndErrorMessage = null;
    $scope.componentTypeBackEndErrorMessage = null;
  };

  $scope.clearTransfusedDateErrorMessage = function() {
    $scope.transfusedDateBackEndErrorMessage = null;
  };

  $scope.setComponentType = function(componentCode) {
    if (componentCode) {
      var filteredComponentTypes = $scope.componentTypes.filter(function(componentType) {
        return componentCode.indexOf(componentType.componentTypeCode) !== -1;
      });

      if (filteredComponentTypes.length > 0) {
        $scope.transfusion.componentType.id = filteredComponentTypes[0].id;
      } else {
        $scope.transfusion.componentType.id = null;
      }
    }
    $scope.clearComponentCodeAndTypeErrorMessage();
  };

  $scope.recordTransfusion = function recordTransfusion() {
    if ($scope.recordTransfusionsForm.$invalid) {
      return;
    }
    $scope.submitted = true;
    $scope.addingTransfusionForm = true;
    var transfusionRecord = angular.copy($scope.transfusion);

    if (transfusionRecord.transfusionReactionType.id === null) {
      transfusionRecord.transfusionReactionType = null;
    }

    TransfusionService.createTransfusion(transfusionRecord, function() {
      $scope.clear();
      $scope.addingTransfusionForm = false;
    }, function(response) {
      onSaveError(response);
      $scope.addingTransfusionForm = false;
    });
  };

  $scope.clear = function() {
    $scope.transfusion = angular.copy($scope.masterDetails);
    $scope.addingTransfusionForm = false;
    $scope.submitted = false;
    $scope.recordTransfusionsForm.$setPristine();
  };
  initializeRecordTransfusionForm();
});