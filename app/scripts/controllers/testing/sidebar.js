angular.module('bsis').controller('TestingSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;

  $scope.isCurrent = function(path) {
    if ($location.path().indexOf('/viewTestBatch') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/manageTTITesting') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/reEnterTestOutcomes') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/managePendingTests') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/managePendingBloodTypingTests') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/manageBloodGroupTesting') === 0 && path === '/manageTestBatch') {
      return true;
    } else if ($location.path().indexOf('/manageBloodGroupMatchTesting') === 0 && path === '/manageTestBatch') {
      return true;
    } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
      $location.path(path);
      return true;
    } else if ($location.path() === path) {
      return true;
    } else {
      var initialView = '';
      // for first time load of /testing view, determine the initial view
      if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_BATCH) > -1)) {
        initialView = '/manageTestBatch';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_OUTCOME) > -1)) {
        initialView = '/viewTestSample';
      } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.ADD_TEST_OUTCOME) > -1)) {
        initialView = '/uploadTestResults';
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
