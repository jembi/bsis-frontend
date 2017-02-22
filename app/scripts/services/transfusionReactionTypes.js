'use strict';

angular.module('bsis').factory('TransfusionReactionTypesService', function(Api) {

  return {
    getTransfusionReactionTypes: function(response) {
      Api.TransfusionReactionTypes.get({}, function(apiResponse) {
        response(apiResponse.transfusionReactionTypes);
      }, function() {
        response(false);
      });
    }
  };
});
