angular.module('bsis').controller('TestingSidebarCtrl', function($scope, RoutingService, ICONS) {

  var routes = [
    {
      path: '/manageTestBatch',
      subpaths: [
        '/viewTestBatch',
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
