angular.module('bsis').controller('DonorsSidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

  var routes = [
    {
      path: '/findDonor',
      subpaths: [
        '/viewDonor',
        '/addDonor'
      ]
    }, {
      path: '/duplicateDonors',
      subpaths: [
        '/manageDuplicateDonors'
      ]
    }, {
      path: '/manageDonationBatches',
      subpaths: [
        '/manageClinic'
      ]
    }, {
      path: '/locations',
      subpaths: []
    }, {
      path: '/donorCounselling',
      subpaths: []
    }, {
      path: '/exportDonorList',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
