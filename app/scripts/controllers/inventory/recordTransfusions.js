'use strict';

angular.module('bsis').controller('RecordTransfusionsCtrl', function($scope, $log, DATEFORMAT, ICONS) {

  // Set up mock data
  var componentTypes = [{'id':1, 'componentTypeName':'Whole Blood Single Pack - CPDA', 'componentTypeCode':'0011', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                          {'id':2, 'componentTypeName':'Whole Blood Double Pack - CPDA', 'componentTypeCode':'0012', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                          {'id':3, 'componentTypeName':'Whole Blood Triple Pack - CPDA', 'componentTypeCode':'0013', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                          {'id':4, 'componentTypeName':'Whole Blood Quad Pack - CPDA', 'componentTypeCode':'0014', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null}];
  var locations = [{'id':1, name:'St.matome hospital'},
                    {'id':2, name:'Groote schuur'},
                    {'id':3, name:'Parakoane hospital'},
                    {'id':3, name:'TygerValley hospital'}];

  var transfusionOutcomes = ['Transfused Uneventfully', 'Transfusion Reaction Occurred', 'Not Transfused'];
  var transfusionReactionTypes = [{'id':1, 'type': 'Reacted'}, {'id':2, 'type': 'Not Reacted'}];
  var genders = ['male', 'female'];
  var bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O-', 'O+', 'AB'];
  $scope.submitted = false;
  $scope.transfusion = {
    donationIdentificationNumber: null,
    componentType: null,
    patient: null,
    transfusionOutcome: null,
    transfusionReactionType: null,
    notes: null,
    receivedFrom: null,
    bloodGroup: null,
    format: DATEFORMAT,
    ICONS: ICONS,
    startDateOpen: false,
    dateTransfused: moment().startOf('day').toDate()
  };

  function initializeRecordTransfusionForm() {
    $scope.format = DATEFORMAT;
    $scope.componentTypes = componentTypes;
    $scope.locations = locations;
    $scope.transfusionOutcomes = transfusionOutcomes;
    $scope.genders = genders;
    $scope.transfusionReactionTypes = transfusionReactionTypes;
    $scope.bloodGroups = bloodGroups;
  }

  $scope.recordTransfusion = function recordTransfusion() {
    if ($scope.recordTransfusionsForm.$invalid) {
      return;
    }
    $scope.submitted = true;
    $scope.addingTransfusionForm = true;
    $scope.transfusionRecord = $scope.transfusion;
  };

  $scope.clear = function() {
    $scope.transfusion  = {};
    $scope.addingTransfusionForm = false;
    $scope.submitted = false;
    $scope.recordTransfusionsForm.$setPristine();
  };
  initializeRecordTransfusionForm();
});