'use strict';

angular.module('bsis')
  .controller('LabellingCtrl', function ($scope, $location, LabellingService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = {};
    //$scope.data = data;
    $scope.searchResults = '';
    $scope.search = {
      "donationIdentificationNumber": ''
    };
    $scope.packDIN = '';

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
          //$scope.data = data;
          $scope.components = data.components;
          //$scope.printPackLabelBoolean = data.printPackLabel;
          //$scope.printDiscardLabelBoolean = data.printDiscardLabel;
          $scope.searchResults = true;
          $scope.packDIN = donationIdentificationNumber;
        }
        else{
          $scope.searchResults = false;
        }
      });
    };

    $scope.printPackLabel = function (componentId) {   
      LabellingService.printPackLabel(componentId, function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          $scope.labelZPL = data.labelZPL;
          console.log("$scope.labelZPL: ", $scope.labelZPL);
        }
        else{
        }
      });
    };

    $scope.printDiscardLabel = function (componentId) {   
      LabellingService.printDiscardLabel(componentId, function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          $scope.labelZPL = data.labelZPL;
          console.log("$scope.labelZPL: ", $scope.labelZPL);
        }
        else{
        }
      });
    };

    $scope.clear = function () {
      $scope.packDIN = '';
      $scope.search = {};
      $scope.searchResults = '';
    };

  });