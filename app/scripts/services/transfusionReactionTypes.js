'use strict';

angular.module('bsis').factory('TransfusionReactionTypesService', function(Api) {

  return {
    getTransfusionReactionTypeById: Api.TransfusionReactionTypes.get,

    getTransfusionReactionTypes: function(response) {
      Api.TransfusionReactionTypes.get({}, function(apiResponse) {
        response(apiResponse.transfusionReactionTypes);
      }, function() {
        response(false);
      });
    },
    createTransfusionReactionType: function(transfusionReactionType, onSuccess, onError) {
      Api.TransfusionReactionTypes.save(transfusionReactionType, function(data) {
        onSuccess(data);
      }, function(err) {
        onError(err.data);
      });
    }
  };
});
