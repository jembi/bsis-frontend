'use strict';

angular.module('bsis')
  .controller('SettingsCtrl', function ($scope, $location, SettingsService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/locations") {
        return true;
      } else {
        return false;
      }
    };

    var data = {};
    $scope.data = data;

    $scope.getLocations = function () {   
      SettingsService.getLocations(function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          console.log("locations: ",data);
        }
        else{

        }
      });

    };

    $scope.getLocations();

  });