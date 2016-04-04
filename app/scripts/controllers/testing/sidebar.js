angular.module('bsis').controller('TestingSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS) {

  $scope.icons = ICONS;

  $scope.isCurrent = function(path) {
    var initialView = '';
    if ($location.path().indexOf('/viewTestBatch') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/viewTestBatch';
      return true;
    } else if ($location.path().indexOf('/manageTTITesting') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/manageTTITesting';
      return true;
    } else if ($location.path().indexOf('/reEnterTestOutcomes') === 0 && path === '/manageTestBatch') {
      if ($routeParams.bloodTestType === 'BASIC_TTI' || $routeParams.bloodTestType === 'CONFIRMATORY_TTI') {
        $scope.selection = '/reEnterTTI';
      } else if ($routeParams.bloodTestType === 'BASIC_BLOODTYPING' || $routeParams.bloodTestType === 'REPEAT_BLOODTYPING') {
        $scope.selection = '/reEnterBloodTyping';
      }
      return true;
    } else if ($location.path().indexOf('/managePendingTests') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/managePendingTests';
      return true;
    } else if ($location.path().indexOf('/managePendingBloodTypingTests') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/managePendingBloodTypingTests';
      return true;
    } else if ($location.path().indexOf('/manageBloodGroupTesting') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/manageBloodGroupTesting';
      return true;
    } else if ($location.path().indexOf('/manageBloodGroupMatchTesting') === 0 && path === '/manageTestBatch') {
      $scope.selection = '/manageBloodGroupMatchTesting';
      return true;
    } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
      $location.path(path);
      $scope.selection = path;
      return true;
    } else if ($location.path() === path) {
      return true;
    } else {
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
