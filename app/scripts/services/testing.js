'use strict';

angular.module('bsis')
.factory('TestingService', function ($http) {

  var testBatchObj = {};

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
      console.log("getTestBatch testBatchObj:", testBatchObj);
      return testBatchObj;
    },
    setTestBatch: function(testBatch){
      testBatchObj = testBatch;
      console.log("setTestBatch testBatchObj:", testBatchObj);
    }
  };
});