'use strict';

angular.module('bsis')
.factory('TestingService', function ($http) {

  var testBatchObj = {};
  var donationBatchesObj = [];

  return {
    getTestBatchFormFields: function () {
      return $http.get('/getTestBatchFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Find Test Batch Form Fields Unsuccessful");
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
  };
});