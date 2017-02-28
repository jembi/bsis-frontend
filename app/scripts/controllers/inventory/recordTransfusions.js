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
      $scope.recordTransfusionsForm.componentCode.$setValidity('invalidComponentCode', true);
    });
  });

  $scope.$watch('transfusion.componentType.id', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.componentType.$setValidity('invalid', true);
      $scope.recordTransfusionsForm.componentType.$setValidity('noComponents', true);
      $scope.recordTransfusionsForm.componentType.$setValidity('multipleComponents', true);
      $scope.recordTransfusionsForm.componentType.$setValidity('invalidComponentStatus', true);
    });
  });

  $scope.$watch('transfusion.dateTransfused', function() {
    $timeout(function() {
      $scope.recordTransfusionsForm.dateTransfused.$setValidity('invalid', true);
    });
  });

  function getCodeByComponentTypeId(componentTypeId) {
    if (componentTypeId) {
      var filteredComponentTypes = $scope.componentTypes.filter(function(componentType) {
        return componentTypeId === componentType.id;
      });
      return filteredComponentTypes[0].componentTypeCode;
    }
  }

  function onSaveError(err) {
    if (err.data && err.data.donationIdentificationNumber) {
      $scope.recordTransfusionsForm.donationIdentificationNumber.$setValidity('invalid', false);
    }

    if (err.data && err.data.componentCode) {
      if (err.data.fieldErrors.componentCode[0].code === 'errors.invalid.componentStatus') {
        $scope.recordTransfusionsForm.componentCode.$setValidity('invalidComponentCode', false);
      } else if (err.data.fieldErrors.componentCode[0].code === 'errors.invalid') {
        $scope.recordTransfusionsForm.componentCode.$setValidity('invalid', false);
      }
    }

    if (err.data && err.data.componentType) {
      if (err.data.fieldErrors.componentType[0].code === 'errors.invalid.noComponents') {
        $scope.recordTransfusionsForm.componentType.$setValidity('noComponents', false);
      } else if (err.data.fieldErrors.componentType[0].code === 'errors.invalid.multipleComponents') {
        $scope.transfusion.componentCode = getCodeByComponentTypeId($scope.transfusion.componentType.id);
        $scope.recordTransfusionsForm.componentType.$setValidity('multipleComponents', false);
      } else if (err.data.fieldErrors.componentType[0].code === 'errors.invalid.componentStatus' && !$scope.transfusion.componentCode) {
        $scope.recordTransfusionsForm.componentType.$setValidity('invalidComponentStatus', false);
      } else if (err.data.fieldErrors.componentType[0].code === 'errors.invalid') {
        $scope.recordTransfusionsForm.componentType.$setValidity('invalid', false);
      }
    }

    if (err.data && err.data.dateTransfused) {
      $scope.recordTransfusionsForm.dateTransfused.$setValidity('invalid', false);
    }
  }

  $scope.setComponentType = function(componentCode) {
    if (componentCode) {
      var filteredComponentTypes = $scope.componentTypes.filter(function(componentType) {
        return componentCode.indexOf(componentType.componentTypeCode) !== -1;
      });

      if (filteredComponentTypes.length > 0) {
        $scope.transfusion.componentType.id = filteredComponentTypes[0].id;
        $scope.recordTransfusionsForm.componentType.$setValidity('multipleComponents', true);
      } else {
        $scope.transfusion.componentType.id = null;
      }
    }
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