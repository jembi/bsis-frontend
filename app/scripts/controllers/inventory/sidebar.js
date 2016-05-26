'use strict';

angular.module('bsis').controller('InventorySidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

  var routes = [
    {
      path: '/findInventory',
      subpaths: []
    }, {
      path: '/viewStockLevels',
      subpaths: []
    }, {
      path: '/manageOrders',
      subpaths: [
        '/fulfilOrder',
        '/viewOrder'
      ]
    }, {
      path: '/manageReturns',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
