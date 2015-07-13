'use strict';

angular.module('bsis')
.factory('ConfigurationsService', function ($http, Api, $filter) {
  return {

    getConfigurations: function(response){
      Api.Configurations.get({}, function (apiResponse) {
        response(apiResponse.configurations);
      }, function (){
        response(false);
      });
    },

    getConfiguration: function (id, response) {
      var apiResponse = Api.Configurations.get({id: id}, function(){
        console.log("configuration response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

    addConfiguration: function (configuration,response) {

    },

    updateConfiguration: function (configuration, response) {

    },

    removeConfiguration: function (id, response) {
      
    }

  };
});
