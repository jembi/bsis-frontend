'use strict';

angular.module('bsis')
  .factory('ComponentBatchService', function($http, Api) {
    return {
      getComponentBatchesFormFields: function(onSuccess, onError) {
        Api.ComponentBatchesFormFields.get({}, function(response) {
          onSuccess(response);
        }, function(err) {
          onError(err.data);
        });
      },
      addComponentBatch: function(componentBatch, onSuccess, onError) {

        var addComponentBatch = new Api.ComponentBatches();
        angular.copy(componentBatch, addComponentBatch);

        // save componentBatch (POST /componentBatches)
        addComponentBatch.$save(function(response) {
          onSuccess(response);
        }, function(err) {
          onError(err.data);
        });
      },
      findComponentBatches: function(period, onSuccess, onError) {
        Api.ComponentBatchesSearch.get({startCollectionDate: period.startCollectionDate, endCollectionDate: period.endCollectionDate}, function(response) {
          onSuccess(response);
        }, function(err) {
          onError(err.data);
        });
      }
    };
  });
