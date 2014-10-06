'use strict';

angular.module('bsis')
  .controller('ReportsCtrl', function ($scope, $location, ReportsService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/reports" && path === "/reports") {
        return true;
      } else {
        return false;
      }
    };
  });