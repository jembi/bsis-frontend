'use strict';

angular.module('bsis')
  .controller('HomeCtrl', function ($scope, ICONS) {
    $scope.icons = ICONS;
  });
