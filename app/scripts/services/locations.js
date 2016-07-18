'use strict';

angular.module('bsis')
  .factory('LocationsService', function($http, Api) {
    return {
      getLocations: function(response) {
        Api.Locations.get({}, function(apiResponse) {
          response(apiResponse.allLocations);
        }, function() {
          response(false);
        });
      },

      getVenues: function(onSuccess, onError) {
        Api.Locations.get({}, function(response) {
          onSuccess(response.allLocations.filter(function(loc) {
            return loc.isVenue;
          }));
        }, onError);
      },
      addLocation: Api.Locations.save,
      updateLocation: Api.Locations.update,
      getLocationById: Api.Locations.get,
      getSearchForm: Api.Locations.getSearchForm,
      search: Api.Locations.search
    };
  });
