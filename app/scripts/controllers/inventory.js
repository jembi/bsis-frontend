'use strict';

angular.module('bsis')
  .controller('InventoryCtrl', function ($scope, $location, InventoryService) {

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/inventory" && path === "/manageInventory") {
        return true;
      } else {
        return false;
      }
    };
  });
