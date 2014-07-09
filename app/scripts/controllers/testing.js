'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $location, TestingService) {

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/testing" && path === "/viewTestResults") {
        return true;
      } else {
        return false;
      }
    };
  });
