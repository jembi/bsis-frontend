'use strict';

angular.module('bsis')
  .factory('TestingService', function($http, Api, $q) {

    var currentTestBatchId = '';
    var donationBatchesObj = [];

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
      getTestBatch: function(id, response) {
        Api.TestBatches.get({id: id}, function(testBatch) {
          response(testBatch);
        }, function() {
          response(false);
        });
      },
      getCurrentTestBatch: function(response) {
        Api.TestBatches.get({id: currentTestBatchId}, function(testBatch) {
          response(testBatch);
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

      setCurrentTestBatch: function(testBatchId) {
        currentTestBatchId = testBatchId;
      },
      getTestBatchOverview: function(id, response) {
        Api.TestBatchOverview.get({id: id}, function(testBatch) {
          response(testBatch);
        }, function() {
          response(false);
        });
      },
      getCurrentTestBatchOverview: function(response) {
        Api.TestBatchOverview.get({testBatch: currentTestBatchId}, function(testBatch) {
          response(testBatch);
        }, function() {
          response(false);
        });
      },

      getTestBatchOverviewById: function(testBatchId, onSuccess, onError) {
        Api.TestBatchOverview.get({testBatch: testBatchId}, function(testBatch) {
          onSuccess(testBatch);
        }, function() {
          onError(false);
        });
      },
      getDonationBatches: function() {
        return donationBatchesObj;
      },
      setDonationBatches: function(donationBatch) {
        donationBatchesObj = donationBatch;
      },
      getTestResultsByDIN: function(donationIdentificationNumber, response) {
        Api.TestResults.get({donationIdentificationNumber: donationIdentificationNumber}, function(overview) {
          response(overview);
        }, function() {
          response(false);
        });
      },
      getOpenTestBatches: function(response) {
        Api.FindTestBatches.get({status: ['OPEN', 'RELEASED']}, function(testBatches) {
          response(testBatches);
        }, function() {
          response(false);
        });
      },
      getTestResults: function(testBatch, response) {
        Api.FindTestResults.query({testBatch: testBatch}, function(testResults) {
          response(testResults);
        }, function() {
          response(false);
        });
      },
      getCurrentTestResults: function(response) {
        Api.FindTestResults.query({testBatch: currentTestBatchId}, function(testResults) {
          response(testResults);
        }, function() {
          response(false);
        });
      },

      getTestResultsById: function(id, onSuccess, onError) {
        Api.FindTestResults.query({testBatch: id}, function(testResults) {
          onSuccess(testResults);
        }, function(err) {
          onError(err);
        });
      },
      getTestOutcomesByBatchIdAndBloodTestType: function(id, bloodTestType, onSuccess, onError) {
        Api.FindTestResults.query({testBatch: id, bloodTestType: bloodTestType}, function(testResults) {
          onSuccess(testResults);
        }, function(err) {
          onError(err);
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
      saveTestResults: function(testResults, reEntry, response) {
        var result = Api.TestResults.save({reEntry: reEntry}, testResults, function() {
          response(true);
        }, function() {
          response(false);
        });
        return result.$promise;
      },
      saveBloodTypingResolution: function(resolution, response) {
        var deferred = $q.defer();

        var bloodTypingResolutionForm = {};
        bloodTypingResolutionForm.status = resolution.status;
        bloodTypingResolutionForm.bloodAbo = resolution.bloodAbo;
        bloodTypingResolutionForm.bloodRh = resolution.bloodRh;

        Api.BloodTypingResolution.update({id: resolution.id}, bloodTypingResolutionForm, function() {
          response(true);
          deferred.resolve();
        }, function() {
          response(false);
          deferred.reject();
        });
        return deferred.promise;
      },
      closeTestBatch: function(testBatch, onSuccess, onError) {
        var updateTestBatch = {};
        updateTestBatch.id = testBatch.id;
        updateTestBatch.status = 'CLOSED';

        Api.TestBatches.update({id: testBatch.id}, updateTestBatch, function(data) {
          onSuccess(data);
        }, function() {
          onError(false);
        });
      },
      reopenTestBatch: function(testBatch, onSuccess, onError) {
        var updateTestBatch = {};
        updateTestBatch.id = testBatch.id;
        updateTestBatch.status = 'RELEASED';

        Api.TestBatches.update({id: testBatch.id}, updateTestBatch, function(data) {
          onSuccess(data);
        }, function() {
          onError(false);
        });
      },
      releaseTestBatch: function(testBatch, onSuccess, onError) {

        var updateTestBatch = {
          id: testBatch.id,
          status: 'RELEASED'
        };

        Api.TestBatches.update({id: testBatch.id}, updateTestBatch, onSuccess, onError);
      },
      updateTestBatch: function(testBatch, onSuccess, onError) {
        Api.TestBatches.get({id: testBatch.id}, function(response) {

          var updateTestBatch = response;
          updateTestBatch.id = testBatch.id;
          updateTestBatch.createdDate = testBatch.createdDate;
          updateTestBatch.donationBatchIds = testBatch.donationBatchIds;

          Api.TestBatches.update({id: testBatch.id}, updateTestBatch, function(data) {
            onSuccess(data);
          }, function(err) {
            onError(err.data);
          });
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
      }
    };
  });
