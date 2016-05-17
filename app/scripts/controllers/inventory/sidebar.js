'use strict';

angular.module('bsis').controller('InventorySidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

  var routes = [
    {
      path: '/manageInventory',
      subpaths: []
    }, {
      path: '/transferComponents',
      subpaths: []
    }, {
      path: '/issueComponents',
      subpaths: []
    }, {
      path: '/componentUsage',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
