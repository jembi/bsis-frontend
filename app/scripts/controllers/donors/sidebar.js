angular.module('bsis').controller('DonorsSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;

  $scope.isCurrent = function(path) {
    var initialView = '';
    if ($location.path().indexOf('/viewDonor') === 0 && path === '/findDonor') {
      $scope.selection = '/viewDonor';
      return true;
    } else if ($location.path() === '/addDonor' && path === '/findDonor') {
      $scope.selection = $location.path();
      return true;
    } else if ($location.path().indexOf('/manageClinic') === 0 && path === '/manageDonationBatches') {
      $scope.selection = '/manageClinic';
      return true;
    } else if ($location.path().indexOf('/locations') === 0 && path === initialView) {
      $scope.selection = '/locations';
      return true;
    } else if ($location.path().indexOf('/donorCounselling') === 0 && path.indexOf('/donorCounselling') === 0) {
      var currentPath = $location.path();
      $scope.selection = currentPath === '/donorCounselling' ? currentPath : '/donorCounsellingDetails';
      return true;
    } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
      $location.path(path);
      $scope.selection = path;
      return true;
    } else if ($location.path() === path) {
      return true;
    } else {
      // for first time load of /donors view, determine the initial view
      if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONOR) > -1)) {
        initialView = '/findDonor';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONATION_BATCH) > -1)) {
        initialView = '/manageDonationBatches';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.EXPORT_CLINIC_DATA) > -1)) {
        initialView = '/exportDonorList';
      }

      // if first time load of /donors view , and path === initialView, return true
      if ($location.path() === '/donors' && path === initialView) {
        $location.path(initialView);
        return true;
      }

      return false;
    }
  };

});
