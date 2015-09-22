'use strict';

angular.module('bsis')
  .controller('SettingsCtrl', function ($scope, $location, ICONS, PERMISSIONS, $filter) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.initialView = '/accountSettings';

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === $scope.initialView) {
        $scope.selection = $location.path();
        $location.path($scope.initialView);
        return true;
      } else if ($location.path().indexOf('/manageConfiguration') === 0 && path === "/configurations") {
        $scope.selection = '/manageConfiguration';
        return true;
      } else if ($location.path().indexOf("/manageDeferralReason") === 0 && path === "/deferralReasons") {
        $scope.selection = '/manageDeferralReason';
        return true;
      } else if ($location.path().indexOf("/manageDiscardReason") === 0 && path === "/discardReasons") {
        $scope.selection = '/manageDiscardReason';
        return true;
      } else if ($location.path().indexOf('/manageRole') === 0 && path === "/roles") {
        $scope.selection = '/manageRole';
        return true;
      } else if ($location.path().indexOf("/manageUser") === 0 && path === "/users") {
        $scope.selection = "/manageUser";
        return true;
      }else if ($location.path().indexOf( "/manageDonationType") === 0 && path === "/donationTypes") {
        $scope.selection =  "/manageDonationType";
        return true;
      }
      else if ($location.path().indexOf("/managePackType") === 0 && path === "/packTypes") {
        $scope.selection = "/managePackType";
        return true;
      } else {
        return false;
      }
    };

});
