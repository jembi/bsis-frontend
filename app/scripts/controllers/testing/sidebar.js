angular.module('bsis').controller('TestingSidebarCtrl', function($scope, RoutingService, ICONS) {

  var routes = [
    {
      path: '/manageTestBatches',
      subpaths: [
        '/manageTestBatch',
        '/recordTTIOutcomes',
        '/reenterTTIOutcomes',
        '/reEnterBloodTyping',
        '/managePendingTests',
        '/managePendingBloodTypingTests',
        '/manageBloodGroupTesting',
        '/manageBloodGroupMatchTesting'
      ]
    }, {
      path: '/viewTestSample',
      subpaths: []
    }
  ];

  $scope.icons = ICONS;
  $scope.currentPath = RoutingService.getCurrentPath(routes);
});
