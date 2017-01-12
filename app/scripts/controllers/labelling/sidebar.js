'use strict';

angular.module('bsis').controller('LabellingSidebarCtrl', function($scope, RoutingService, ICONS) {

  var routes = [
    {
      path: '/labelComponents',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
