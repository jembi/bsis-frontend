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
    },
    addLocation: function (location, response) {

      var addLocation = new Api.Locations();
      angular.copy(location, addLocation);

      addLocation.$save(function(data){ 
        response(data);
      }, function (){
        response(false);
      }); 

    },
    updateLocation: function (location, response){

      var updateLocation = Api.Locations.get({id:location.id}, function() {
        updateLocation = updateLocation.location;
        angular.copy(location, updateLocation);

        Api.Locations.update({id:location.id}, updateLocation, function(data) {
         response(data);
        }, function (){
          response(false);
        }); 

      });

    },

  };
});