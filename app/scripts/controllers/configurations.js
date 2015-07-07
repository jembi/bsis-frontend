'use strict';

angular.module('bsis')
  .controller('ConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var data = {};
    $scope.data = data;
    $scope.configurations = {};


    $scope.clear = function () {

    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getConfigurations = function () {
      ConfigurationsService.getConfigurations(function(response){
        if (response !== false){
          data = response;
          $scope.configurations = data;
          console.log("configurations: ",response);
        }
        else{

        }
      });

    };

    $scope.getConfiguration = function () {
      ConfigurationsService.getConfiguration(1,function(response){
        if (response !== false){
          //data = response;
          //$scope.data = data;
          console.log("configuration id 1: ",response);
        }
        else{

        }
      });

    };

    $scope.getConfigurations();
    $scope.getConfiguration();

  });