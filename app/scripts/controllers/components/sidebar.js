'use strict';

angular.module('bsis').controller('ComponentsSidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

  var routes = [
    {
      path: '/recordComponents',
      subpaths: []
    }, {
      path: '/findComponents',
      subpaths: []
    }, {
      path: '/discardComponents',
      subpaths: []
    }, {
      path: '/findDiscards',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});