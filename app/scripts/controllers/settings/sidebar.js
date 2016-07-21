'use strict';

angular.module('bsis').controller('SettingsSidebarCtrl', function($scope, RoutingService, ICONS, PERMISSIONS) {

  var routes = [
    {
      path: '/accountSettings',
      subpaths: [
      ]
    }, {
      path: '/configurations',
      subpaths: [
        '/manageConfiguration'
      ]
    }, {
      path: '/deferralReasons',
      subpaths: [
        '/manageDeferralReason'
      ]
    }, {
      path: '/discardReasons',
      subpaths: [
        '/manageDiscardReason'
      ]
    }, {
      path: '/roles',
      subpaths: [
        '/manageRole'
      ]
    }, {
      path: '/users',
      subpaths: [
        '/manageUser'
      ]
    }, {
      path: '/donationTypes',
      subpaths: [
        '/manageDonationType'
      ]
    }, {
      path: '/packTypes',
      subpaths: [
        '/managePackType'
      ]
    }, {
      path: '/adverseEventTypes',
      subpaths: [
        '/manageAdverseEventTypes',
        '/addAdverseEventType',
        '/editAdverseEventType'
      ]
    }, {
      path: '/auditLog',
      subpaths: [
      ]
    }, {
      path: '/locations',
      subpaths: [
        '/manageLocation'
      ]
    }, {
      path: '/componentTypes',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});