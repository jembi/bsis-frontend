angular.module('bsis').controller('TestingSidebarCtrl', function($scope, RoutingService, ICONS) {

  var routes = [
    {
      path: '/manageTestBatches',
      subpaths: [
        '/manageTestBatch',
        '/manageTTITesting',
        '/reEnterTTI',
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
