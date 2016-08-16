'use strict';

angular.module('bsis').controller('MobileSidebarCtrl', function($scope, RoutingService, ICONS) {

  var routes = [
    {
      path: '/lookUp',
      subpaths: []
    }, {
      path: '/mobileDonorCounselling',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
