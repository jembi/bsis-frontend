angular.module('bsis').controller('TestingSidebarCtrl', function($scope, $rootScope, $location, $routeParams, ICONS, PERMISSIONS) {

  $scope.icons = ICONS;
  $scope.permissions = PERMISSIONS;
  $scope.currentPath = '';

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

  var viewTestSampleRoutes = [
    '/viewTestSample'
  ];

  var findValidRoute = function(routesArray) {
    for (var i = 0; i < routesArray.length; i++) {
      if ($location.path().indexOf(routesArray[i]) === 0) {
        return true;
      }
    }
  };

  var setCurrentPath = function() {
    var currentPath = '';
    if (findValidRoute(manageTestBatchRoutes)) {
      currentPath = '/manageTestBatch';
    } else if (findValidRoute(viewTestSampleRoutes)) {
      currentPath = '/viewTestSample';
    }
    $scope.currentPath = currentPath;
  };

  setCurrentPath();

});