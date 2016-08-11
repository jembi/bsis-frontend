'use strict';

angular.module('bsis')
  .controller('ReportsSidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

    var routes = [
      {
        path: '/aboRhGroupsReport',
        subpaths: []
      },
      {
        path: '/donationTypesReport',
        subpaths: []
      },
      {
        path: '/ttiPrevalenceReport',
        subpaths: []
      },
      {
        path: '/bloodUnitsIssuedReport',
        subpaths: []
      },
      {
        path: '/donorsDeferredReport',
        subpaths: []
      }
    ];

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.currentPath = RoutingService.getCurrentPath(routes);
  });
