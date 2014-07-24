'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $location, DonorService, ICONS) {

    $scope.icons = ICONS;
    
    /*$scope.donor = {
      firstName: '',
      lastName: '',
      donorNum: ''
    };
    */

    //console.log("$scope.donor: ", $scope.donor);

    $scope.donor = DonorService.getDonor();
    $scope.donorSearch = {};
    $scope.searchResults = '';

    $scope.findDonor = function () {      
      DonorService.findDonor($scope.donorSearch).then(function (response) {
          $scope.donor = response.data.donor;
          console.log('findDonor - DonorService.getDonor()',DonorService.getDonor());
          console.log('findDonor - $scope.donor',$scope.donor);
          //console.log("ReturnedDonor: ",$scope.donor);
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });

    };

    $scope.isCurrent = function(path) {
      //console.log("$location.path(): ",$location.path());
      //console.log("path: ",path);
      //console.log("$scope.selection : ",$scope.selection );
      if ($location.path() === "/viewDonor" && path === "/findDonor") {
        //$location.path(path);
        $scope.selection = $location.path();
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
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

    $scope.clear = function () {
      $scope.donorSearch = {};
      $scope.searchResults = '';
    };
  })
  
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, ICONS) {
      /*DonorService.getDonor().then(function (response) {
          $scope.donor = response.data.donor;
          console.log('ViewDonorCtrl - $scope.donor',$scope.donor);
          //console.log("ReturnedDonor: ",$scope.donor);
          //$scope.searchResults = true;
        }, function () {
          //$scope.searchResults = false;
      });
*/

     $scope.donor = DonorService.getDonor();
     console.log('ViewDonorCtrl - DonorService.getDonor()',DonorService.getDonor());
  })


;


