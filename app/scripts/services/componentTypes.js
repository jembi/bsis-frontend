'use strict';

angular.module('bsis')
  .factory('ComponentTypesService', function ($http, Api) {
    return {

      getComponentTypes: function (response) {
        Api.ComponentTypes.get({}, function (apiResponse) {
          console.log("component types response: ", apiResponse);
          response(apiResponse.componentTypes);
        }, function () {
          response(false);
        });
      }
    };

  });