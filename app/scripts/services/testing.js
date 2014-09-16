'use strict';

angular.module('bsis')
.factory('TestingService', function ($http) {

  var testBatchObj = {};
  var donationBatchesObj = [];

  return {
    getTestBatchFormFields: function () {
      return $http.get('/getTestBatchFormFields')
        .success(function(data, status, headers, config){
          //donationBatchesObj = data.donationBatches;
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
    }
  };
});