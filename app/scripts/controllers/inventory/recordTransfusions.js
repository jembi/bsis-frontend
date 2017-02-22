'use strict';

angular.module('bsis').controller('RecordTransfusionsCtrl', function($scope, DATEFORMAT, ICONS) {

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
  var gender = ['male', 'female'];
  var bloodGroup = ['A+', 'A-', 'B+', 'B-', 'O-', 'O+', 'AB'];

  $scope.today = moment().endOf('day').toDate();

  $scope.formParams = {
    donationIdentificationNumber: null,
    componentCode: null,
    componentId: null,
    transfusionOutcome: null,
    transfusionReactionType: null,
    transfusionNotes: '',
    usageSiteId: null,
    reactionTypeId: null,
    gender: null,
    patientName1: '',
    patientName2: '',
    patientNo: '',
    bloodBank: '',
    wardNo: '',
    bloodGroup: null,
    format: DATEFORMAT,
    ICONS: ICONS,
    startDateOpen: false,
    dateOfBirth: null,
    transfusionDate: moment().startOf('day').toDate()
  };

  function initializeRecordTransfusionForm() {
    $scope.format = DATEFORMAT;
    $scope.componentTypes = componentTypes;
    $scope.locations = locations;
    $scope.transfusionOutcomes = transfusionOutcomes;
    $scope.gender = gender;
    $scope.transfusionReactionTypes = transfusionReactionTypes;
    $scope.bloodGroup = bloodGroup;
  }

  $scope.clearTransfusionReactionType = function() {
    $scope.formParams.transfusionReactionType = null;
  }

  $scope.setComponentType = function(componentCode) {
    if (componentCode) {
      var filteredComponentTypes = componentTypes.filter(function(componentType) {
        return componentType.componentTypeCode === componentCode;
      });

      if (filteredComponentTypes.length > 0) {
        $scope.formParams.componentId = filteredComponentTypes[0].id+"";
      } else {
        $scope.formParams.componentId = null;
      }
    }
  }

  $scope.clear = function() {
    $scope.formParams  = {},
    $scope.recordTransfusionsForm.$setPristine();
  };
  initializeRecordTransfusionForm();
});