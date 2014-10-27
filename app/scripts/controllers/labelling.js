'use strict';

angular.module('bsis')
  .controller('LabellingCtrl', function ($scope, $location, LabellingService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = {};
    $scope.data = data;
    $scope.searchResults = '';

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/labelling" && path === "/labelComponents") {
        return true;
      } else {
        return false;
      }
    };

    $scope.checkLabellingStatus = function (donationIdentificationNumber) {   
      LabellingService.checkLabellingStatus(donationIdentificationNumber, function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          console.log("$scope.data: ", $scope.data);
          $scope.searchResults = true;

          
        }
        else{
          $scope.searchResults = false;
        }
      });
    };


  });