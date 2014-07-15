'use strict';

angular.module('bsis')
  .controller('LabellingCtrl', function ($scope, $location, LabellingService, ICONS) {

    $scope.icons = ICONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/labelling" && path === "/labelling") {
        return true;
      } else {
        return false;
      }
    };
  });