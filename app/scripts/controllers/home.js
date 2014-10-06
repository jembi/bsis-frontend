'use strict';

angular.module('bsis')
  .controller('HomeCtrl', function ($scope, ICONS, PERMISSIONS) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
  });
