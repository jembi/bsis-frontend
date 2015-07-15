'use strict';

angular.module('bsis')
  .controller('SettingsCtrl', function ($scope, $location, ICONS, PERMISSIONS, $filter) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.initialView = '/accountSettings';

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === $scope.initialView) {
        $scope.selection = $location.path();
        $location.path($scope.initialView);
        return true;
      } else if ($location.path() === "/manageRole" && path === "/roles") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageUser" && path === "/users") {
        $scope.selection = $location.path();
        return true;
      }  else {
        return false;
      }
    };

});
