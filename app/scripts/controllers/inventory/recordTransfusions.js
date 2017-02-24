'use strict';

angular.module('bsis').controller('RecordTransfusionsCtrl', function($scope, $log, TransfusionService, DATEFORMAT) {

  $scope.submitted = false;
  $scope.componentTypes = null;
  $scope.locations = null;
  $scope.transfusionOutcomes = null;
  $scope.transfusionReactionTypes = null;
  $scope.genders = null;
  $scope.bloodGroups = null;
  $scope.today = moment().startOf('day').toDate();
  $scope.transfusion = {
    donationIdentificationNumber: null,
    componentCode: null,
    componentType: {id: null},
    patient: {dateOfBirth: null},
    transfusionOutcome: null,
    transfusionReactionType: null,
    notes: null,
    receivedFrom: null,
    bloodGroup: null,
    startDateOpen: false,
    dateTransfused: $scope.today
  };

  function initializeRecordTransfusionForm() {
    TransfusionService.getTransfusionForm(function(response) {
      if (response !== false) {
        $scope.format = DATEFORMAT;
        $scope.componentTypes = response.componentTypes;
        $scope.locations = response.usageSites;
        $scope.transfusionOutcomes = response.transfusionOutcomes;
        $scope.genders = response.genders;
        $scope.transfusionReactionTypes = response.transfusionReactionTypes;
        $scope.bloodGroups = response.bloodGroups;
      }
    });
  }

  $scope.clearTransfusionReactionType = function() {
    $scope.transfusion.transfusionReactionType = null;
  };

  $scope.setComponentType = function(componentCode) {
    if (componentCode) {
      var filteredComponentTypes = componentTypes.filter(function(componentType) {
        return componentType.componentTypeCode === componentCode;
      });

      if (filteredComponentTypes.length > 0) {
        $scope.transfusion.componentType.id = filteredComponentTypes[0].id;
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
    $scope.transfusionRecord = $scope.transfusion;

    $log.debug('Not implemented yet');
    $log.debug('Form parameters: ' + angular.toJson($scope.transfusion));
    $scope.addingTransfusionForm = false;
  };

  $scope.clear = function() {
    $scope.transfusion  = {};
    $scope.addingTransfusionForm = false;
    $scope.submitted = false;
    $scope.recordTransfusionsForm.$setPristine();
  };
  initializeRecordTransfusionForm();
});