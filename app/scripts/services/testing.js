'use strict';

angular.module('bsis')
.factory('TestingService', function ($http, Api, $q) {

  var currentTestBatchId = '';
  var donationBatchesObj = [];

  return {
    getTestBatchFormFields: function(response){
      Api.TestBatchFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
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
    getTestBatch: function (id, response) {
      Api.TestBatches.get({id:id}, function (testBatch) {
        response(testBatch);
      }, function (){
        response(false);
      });
    },
    getCurrentTestBatch: function(response){
      Api.TestBatches.get({id:currentTestBatchId}, function (testBatch) {
        response(testBatch);
      }, function (){
        response(false);
      });
    },
    setCurrentTestBatch: function(testBatchId){
      currentTestBatchId = testBatchId;
    },
    getTestBatchOverview: function (id, response) {
      Api.TestBatchOverview.get({id:id}, function (testBatch) {
        response(testBatch);
      }, function (){
        response(false);
      });
    },
    getCurrentTestBatchOverview: function(response){
      Api.TestBatchOverview.get({testBatch:currentTestBatchId}, function (testBatch) {
        response(testBatch);
      }, function (){
        response(false);
      });
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
    getCurrentTestResults: function (response) {
      Api.FindTestResults.query({testBatch:currentTestBatchId}, function (testResults) {
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
    saveTestResults: function (testResults, response){
      var deferred = $q.defer();
      var saveTestResults = new Api.TestResults();

      angular.copy(testResults, saveTestResults);

      saveTestResults.$save(function(data){ 
        response(true);
        deferred.resolve();
      }, function (){
        response(false);
        deferred.reject();
      }); 
      return deferred.promise;
    },
    saveBloodGroupMatchTestResults: function (testResults, response){
      var deferred = $q.defer();

      Api.BloodGroupMatchTestResults.get({donationIdentificationNumber:testResults.donationIdentificationNumber,
        bloodAbo:testResults.bloodAbo, bloodRh:testResults.bloodRh}, function (donor) {
        response(true);
        deferred.resolve();
      }, function (){
        response(false);
        deferred.reject();
      });
      return deferred.promise;
    },
    closeTestBatch: function (testBatch, response){
      var getTestBatch = Api.TestBatches.get({id:testBatch.id}, function() {

        var updateTestBatch = {};
        updateTestBatch.id = testBatch.id;
        updateTestBatch.status = "CLOSED";

        Api.TestBatches.update({id:testBatch.id}, updateTestBatch, function(data) {
         response(data);
        }, function (){
          response(false);
        }); 

      });
    },
    getRecentTestBatches: function (response) {
      Api.RecentTestBatches.get({count:10}, function (testBatches) {
        response(testBatches);
      }, function (){
        response(false);
      });
    }
  };
});