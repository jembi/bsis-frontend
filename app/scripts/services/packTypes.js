'use strict';

angular.module('bsis')
.factory('PackTypesService', function ($http, Api, $filter) {
  return {

    getPackTypes: function(response){
      Api.PackTypes.get({}, function (apiResponse) {
        response(apiResponse.allBloodBagTypes);
      }, function (){
        response(false);
      });
    },

    getPackType: function (id, response) {
      var apiResponse = Api.PackTypes.get({id: id}, function(){
        console.log("pack type response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

  };
});
