'use strict';

angular.module('bsis')
  .controller('MobileCtrl', function ($scope, $location, MobileService, ICONS) {

    $scope.icons = ICONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/mobile" && path === "/mobile") {
        return true;
      } else {
        return false;
      }
    };
  });