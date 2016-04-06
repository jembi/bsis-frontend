angular.module('bsis').controller('DonorsSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;

  var manageDonorsRoutes = [
    '/viewDonor',
    '/addDonor',
    '/findDonor'
  ];

  var duplicateDonorsRoutes = [
    '/manageDuplicateDonors',
    '/duplicateDonors'
  ];

  var manageDonationBatchesRoutes = [
    '/manageDonationBatches'
  ];

  var manageVenuesRoutes = [
    '/locations'
  ];

  var donorCounsellingRoutes = [
    '/donorCounselling'
  ];

  var exportDonorsRoutes = [
    '/exportDonorList'
  ];

  var findValidRoute = function(routesArray) {
    for (var i = 0; i < routesArray.length; i++) {
      if ($location.path().indexOf(routesArray[i]) === 0) {
        return true;
      }
    }
  };

  var getInitialPath = function() {
    var initialPath = '';
    if ($location.path() === '/donors') {
      // for first time load of /donors view, determine the initial path
      if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONOR) > -1)) {
        initialPath = '/findDonor';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONATION_BATCH) > -1)) {
        initialPath = '/manageDonationBatches';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.EXPORT_CLINIC_DATA) > -1)) {
        initialPath = '/exportDonorList';
      }
    }
    return initialPath;
  };

  $scope.currentPath = '';

  var setCurrentPath = function() {
    var currentPath = '';
    if (findValidRoute(manageDonorsRoutes)) {
      currentPath = '/findDonor';
    } else if (findValidRoute(duplicateDonorsRoutes)) {
      currentPath = '/duplicateDonors';
    } else if (findValidRoute(manageDonationBatchesRoutes)) {
      currentPath = '/manageDonationBatches';
    } else if (findValidRoute(manageVenuesRoutes)) {
      currentPath = '/locations';
    } else if (findValidRoute(donorCounsellingRoutes)) {
      currentPath = '/donorCounselling';
    } else if (findValidRoute(exportDonorsRoutes)) {
      currentPath = '/exportDonorList';
    } else {

      currentPath = getInitialPath();
    }
    $scope.currentPath = currentPath;
  };

  setCurrentPath();

});
