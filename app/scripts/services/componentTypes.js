'use strict';

angular.module('bsis')
  .factory('ComponentTypesService', function($http, Api) {
    return {

      getComponentTypes: function(query, onSuccess, onError) {
        return Api.ComponentTypes.get(query, function(apiResponse) {
          onSuccess(apiResponse.componentTypes);
        }, onError);
      }
    };

  });
