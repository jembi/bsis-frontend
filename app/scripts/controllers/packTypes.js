'use strict';

angular.module('bsis')
  .controller('PackTypesCtrl', function($scope, $rootScope, $location, PackTypesService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout){
    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/packTypes") {
        return true;
      } else {
        return false;
      }
    };

    var data = {};
    $scope.data = data;
    $scope.packTypes = {};


    $scope.clear = function () {

    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getPackTypes = function () {
      PackTypesService.getPackTypes(function(response){
        if (response !== false){
          data = response;
          $scope.packTypes = data;
          console.log("packTypes: ",response);
        }
        else{

        }
      });

    };

    $scope.getPackType = function () {
      PackTypesService.getPackType(1,function(response){
        if (response !== false){
          //data = response;
          //$scope.data = data;
          console.log("packType id 1: ",response);
        }
        else{

        }
      });

    };

    $scope.getPackTypes();
    $scope.getPackType();

  })

;
