'use strict';

angular.module('bsis')
	.controller('DonorsCtrl', function ($scope, $location, DonorService) {

    /*$scope.donor = {
      firstName: '',
      lastName: '',
      donorNum: ''
    };
    */

    $scope.donorSearch = {};
    $scope.searchResults = '';

    $scope.findDonor = function () {      
      DonorService.findDonor($scope.donorSearch).then(function (response) {
          $scope.donor = response.data.donor;
          //console.log("ReturnedDonor: ",$scope.donor);
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });

    };

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/donors" && path === "/findDonor") {
        return true;
      } else {
        return false;
      }
    };
  });
