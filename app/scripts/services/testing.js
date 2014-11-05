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
    addTestBatch: function (donationBatches, response){
      // create $Resource object and assign donation values
      var addTestBatch = new Api.TestBatches();

      //angular.copy(donationBatches, addTestBatch);
      addTestBatch.collectionBatchIds = donationBatches;

      // save deferral (POST /deferral)
      addTestBatch.$save(function(data){ 
        response(true);
      }, function (){
        response(false);
      }); 
    }
  };
});