'use strict';

angular.module('bsis')
.factory('ConfigurationsService', function ($http, Api, $filter, USERCONFIG, $window) {

  var configurationObj = {};
  return {

    getConfigurations: function(response){
      Api.Configurations.get({}, function (apiResponse) {
        USERCONFIG = apiResponse;
        response(apiResponse.configurations);
      }, function (){
        response(false);
      });
    },

    getConfigurationById: function (id, response) {
      var apiResponse = Api.Configurations.get({id: id}, function(){
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
        $window.location.reload();
      }, function (err){
        response(false, err.data);
      });

    },

    updateConfiguration: function (configuration, response) {

      var updatedConfiguration = angular.copy(configuration);
      Api.Configurations.update({id:configuration.id}, updatedConfiguration, function(data) {
        configurationObj = data.configuration;
        response(configurationObj);
        $window.location.reload();
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
    },

    getBooleanValue: function(name) {

      var configs = USERCONFIG.configurations;

      for (var i = 0; i < configs.length; i++) {
        if (configs[i].name === name) {
          var value = configs[i].value;
          return angular.isString(value) &&
             angular.lowercase(value) === 'true';
        }
      }

      return false;
    }

  };
});
