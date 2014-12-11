'use strict';

angular.module('bsis')
.factory('SettingsService', function ($http, Api, $filter) {
  return {
    getLocations: function(response){
      Api.Locations.get({}, function (apiResponse) {
        response(apiResponse.allLocations);
      }, function (){
        response(false);
      });
    }

  };
});