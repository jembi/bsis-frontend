'use strict';

angular.module('bsis')
  .factory('ComponentBatchService', function($http, Api) {
    return {
      getComponentBatchesFormFields: function(response) {
        Api.ComponentBatchesFormFields.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
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
      }
    };
  });
