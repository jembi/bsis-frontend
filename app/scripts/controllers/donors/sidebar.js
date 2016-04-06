angular.module('bsis').controller('DonorsSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = '';

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
    }
    $scope.currentPath = currentPath;
  };

  setCurrentPath();

});
