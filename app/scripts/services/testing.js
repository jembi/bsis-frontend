'use strict';

angular.module('bsis')
  .factory('TestingService', function($http, Api) {
    return {
      getTestBatchFormFields: function(response) {
        Api.TestBatchFormFields.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getTTITestingFormFields: function(response) {
        Api.TTITestingFormFields.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getBloodGroupTestingFormFields: function(response) {
        Api.BloodGroupTestingFormFields.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getTestBatchById: function(id, onSuccess, onError) {
        Api.TestBatches.get({id: id}, function(testBatch) {
          onSuccess(testBatch);
        }, function(err) {
          onError(err.data);
        });
      },
      getOpenTestBatches: function(response) {
        Api.FindTestBatches.get({status: ['OPEN', 'RELEASED']}, function(testBatches) {
          response(testBatches);
        }, function() {
          response(false);
        });
      },
      addTestBatch: function(donationBatches, response) {
        var addTestBatch = new Api.TestBatches();

        addTestBatch.donationBatchIds = donationBatches;

        addTestBatch.$save(function() {
          response(true);
        }, function() {
          response(false);
        });
      },
      closeTestBatch: function(testBatch, onSuccess, onError) {
        testBatch.status = 'CLOSED';

        Api.TestBatches.update({}, testBatch, function(data) {
          onSuccess(data);
        }, function() {
          onError(false);
        });
      },
      reopenTestBatch: function(testBatch, onSuccess, onError) {
        testBatch.status = 'RELEASED';

        Api.TestBatches.update({}, testBatch, function(data) {
          onSuccess(data);
        }, function() {
          onError(false);
        });
      },
      releaseTestBatch: function(testBatch, onSuccess, onError) {
        testBatch.status = 'RELEASED';
        Api.TestBatches.update({}, testBatch, onSuccess, onError);
      },
      updateTestBatch: function(testBatch, onSuccess, onError) {
        Api.TestBatches.update({}, testBatch, function(data) {
          onSuccess(data);
        }, function(err) {
          onError(err.data);
        });
      },
      deleteTestBatch: function(testBatchId, onSuccess, onError) {
        Api.TestBatches.delete({id: testBatchId}, onSuccess, onError);
      },
      getRecentTestBatches: function(options, onSuccess, onError) {
        Api.FindTestBatches.get(options, function(testBatches) {
          onSuccess(testBatches);
        }, function(err) {
          onError(err.data);
        });
      },
      getTestBatchDonations: function(id, bloodTypingMatchStatus, onSuccess, onError) {
        Api.TestBatchDonations.get({id: id, bloodTypingMatchStatus: bloodTypingMatchStatus}, function(data) {
          onSuccess(data);
        }, function(err) {
          onError(err);
        });
      },
      getTestResultsByDIN: Api.TestResults.get,
      getTestBatchOverviewById: Api.TestResults.overview,
      getTestBatchOutcomesReport: Api.TestResults.report,
      getTestOutcomesByBatchIdAndBloodTestType: Api.TestResults.search,
      saveTestResults: Api.TestResults.saveResults,
      saveBloodTypingResolutions: Api.Donations.bloodTypingResolutions
    };
  });
