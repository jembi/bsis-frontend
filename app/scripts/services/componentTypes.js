'use strict';

angular.module('bsis')
  .factory('ComponentTypesService', function ($http, Api) {
    return {

      getComponentTypes: function (response) {
        Api.ComponentTypes.get({}, function (apiResponse) {
          response(apiResponse.componentTypes);
        }, function () {
          response(false);
        });
      }
    };

  });