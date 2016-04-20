'use strict';

angular.module('bsis')
  .controller('ReportsSidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

    var routes = [
      {
        path: '/reports',
        subpaths: ['/donationsReport']
      }
    ];

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.currentPath = RoutingService.getCurrentPath(routes);
  });