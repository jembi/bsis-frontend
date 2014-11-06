'use strict';

angular.module('bsis')
.factory('TestingService', function ($http, Api) {

  var testBatchObj = {};
  var donationBatchesObj = [];

  return {
    getTestBatchFormFields: function(response){
      Api.TestBatchFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    /*
    getTestBatchFormFields: function () {
      return $http.get('/getTestBatchFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Find Test Batch Form Fields Unsuccessful");
      });
    },
    */
    getTTITestingFormFields: function(response){
      Api.TTITestingFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    getBloodGroupTestingFormFields: function(response){
      Api.BloodGroupTestingFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    getTestBatch: function(){
      return testBatchObj;
    },
    setTestBatch: function(testBatch){
      testBatchObj = testBatch;
    },
    getDonationBatches: function(){
      return donationBatchesObj;
    },
    setDonationBatches: function(donationBatch){
      donationBatchesObj = donationBatch;
    },
    getTestResultsByDIN: function (donationIdentificationNumber, response) {
      Api.TestResults.get({donationIdentificationNumber:donationIdentificationNumber}, function (overview) {
        response(overview);
      }, function (){
        response(false);
      });
    },
    /*
    getTestResultsByDIN: function (donationIdentificationNumber) {
      return $http.get('/getTestResultsByDIN', {params: { din: donationIdentificationNumber }})
        .success(function(data, status, headers, config){
        if (donationIdentificationNumber.Error === undefined) {
          return data;
        }
      })
      .error(function(data){
        console.log("Find Test Results Unsuccessful");
      });
    }
    */
    getOpenTestBatches: function (response) {
      Api.FindTestBatches.query({status:'OPEN'}, function (testBatches) {
        response(testBatches);
        console.log("testBatches: ", testBatches);
      }, function (){
        response(false);
      });
    },
    getTestResults: function (testBatch, response) {
      Api.FindTestResults.query({testBatch:testBatch}, function (testResults) {
        response(testResults);
        console.log("testResults: ", testResults);
      }, function (){
        response(false);
      });
    },
    addTestBatch: function (donationBatches, response){
      var addTestBatch = new Api.TestBatches();

      addTestBatch.collectionBatchIds = donationBatches;

      addTestBatch.$save(function(data){ 
        response(true);
      }, function (){
        response(false);
      }); 
    },
    saveTTITestResults: function (ttiTestResults, response){
      var saveTestResults = new Api.TTITestResults();

      angular.copy(ttiTestResults, saveTestResults);

      saveTestResults.$save(function(data){ 
        console.log("saveTestResults response: ",data);
        response(true);
      }, function (){
        response(false);
      }); 
    }
  };
});