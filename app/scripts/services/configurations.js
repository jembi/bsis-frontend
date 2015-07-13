'use strict';

angular.module('bsis')
.factory('ConfigurationsService', function ($http, Api, $filter) {

  var configurationObj = {};
  return {

    getConfigurations: function(response){
      Api.Configurations.get({}, function (apiResponse) {
        response(apiResponse.configurations);
      }, function (){
        response(false);
      });
    },

    getConfigurationById: function (id, response) {
      var apiResponse = Api.Configurations.get({id: id}, function(){
        console.log("configuration response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

    setConfiguration: function (configuration) {
      configurationObj = configuration;
    },

    getConfiguration: function () {
      return configurationObj;
    },

    addConfiguration: function (configuration,response) {
      var addConfiguration = new Api.Configurations();
      angular.copy(configuration, addConfiguration);

      addConfiguration.$save(function(data){
        response(data);
      }, function (err){
        response(false, err.data);
      });

    },

    updateConfiguration: function (configuration, response) {

      var updatedConfiguration = angular.copy(configuration);
      Api.Configurations.update({id:configuration.id}, updatedConfiguration, function(data) {
        configurationObj = data.configuration;
        response(configurationObj);
      }, function (err){
        response(false, err.data);
      });

    },

    removeConfiguration: function (configuration, response) {
      var deleteConfiguration = new Api.Configurations();
      angular.copy(configuration, deleteConfiguration);

      deleteConfiguration.$delete({id: configuration.id},function(data){
        response(data);
      }, function (err){
        response(false, err.data);
      });
    }

  };
});
