angular.module('bsis').controller('TestingSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;

  var manageTestBatchRoutes = [
    '/manageTestBatch',
    '/viewTestBatch',
    '/manageTTITesting',
    '/reEnterTTI',
    '/reEnterBloodTyping',
    '/managePendingTests',
    '/managePendingBloodTypingTests',
    '/manageBloodGroupTesting',
    '/manageBloodGroupMatchTesting'
  ];

  $scope.isCurrent = function(path) {

    if (path === '/manageTestBatch') {
      // Check if any of the manage test batch routes are active
      for (var i = 0; i < manageTestBatchRoutes.length; i++) {
        if ($location.path().indexOf(manageTestBatchRoutes[i]) === 0) {
          return true;
        }
      }
    } else if ($location.path() === path) {
      return true;
    } else {
      var initialView = '';
      // for first time load of /testing view, determine the initial view
      if ($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_BATCH) > -1) {
        initialView = '/manageTestBatch';
      } else if ($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_OUTCOME) > -1) {
        initialView = '/viewTestSample';
      }

      // if first time load of /testing view , and path === initialView, return true
      if ($location.path() === '/testing' && path === initialView) {
        $location.path(initialView);
        return true;
      }

      return false;
    }
  };
});
