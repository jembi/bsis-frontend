'use strict';

angular.module('bsis')
  .controller('ConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/configurations") {
        return true;
      } else if ($location.path() === "/role" && path === "/roles") {
        return true;
      } else if ($location.path() === "/addRole" && path === "/roles") {
        return true;
      } else {
        return false;
      }
    };

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