'use strict';

angular.module('bsis')
  .factory('LocationsService', function(Api) {
    return {
      getVenues: function(onSuccess, onError) {
        Api.Locations.get({}, function(response) {
          onSuccess(response.allLocations.filter(function(loc) {
            return loc.isVenue;
          }));
        }, onError);
      },

      addLocation: function(location, onSuccess, onError) {

        var addLocation = new Api.Locations();
        angular.copy(location, addLocation);

        addLocation.$save(function(data) {
          onSuccess(data);
        }, function(err) {
          onError(err.data);
        });

      },
      updateLocation: function(location, onSuccess, onError) {

        var updateLocation = Api.Locations.get({id: location.id}, function() {
          updateLocation = updateLocation.location;
          angular.copy(location, updateLocation);

          Api.Locations.update({id: location.id}, updateLocation, function(data) {
            onSuccess(data);
          }, function(err) {
            onError(err.data);
          });

        });

      }

    };
  });
