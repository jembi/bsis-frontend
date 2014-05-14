'use strict';

angular.module('bsis')
	.controller('DonorsCtrl', function ($scope, $location) {

	$scope.donorSection = 'views/donors/findDonor.html';

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        return false;
      }
    };
  });
