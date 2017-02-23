'use strict';

angular.module('bsis').factory('TransfusionReactionTypesService', function(Api) {

  return {
    getTransfusionReactionTypes: function(response) {
      Api.TransfusionReactionTypes.get({}, function(apiResponse) {
        response(apiResponse.transfusionReactionTypes);
      }, function() {
        response(false);
      });
    },
    createTransfusionReactionType: function(transfusionReactionType, response) {
      createTransfusionReactionType: Api.TransfusionReactionTypes.save(transfusionReactionType, function(data) {
        response(data);
      }, function() {
        response(false);
      });
    }
  };
});
