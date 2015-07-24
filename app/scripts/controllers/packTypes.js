'use strict';

angular.module('bsis')
  .controller('PackTypesCtrl', function($scope, $rootScope, $location, PackTypesService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout){

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

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

    var data = [];
    $scope.data = data;
    $scope.packTypes = {};


    $scope.clear = function () {

    };

    $scope.managePackType  = function (packType){
      $scope.packType = packType;
      PackTypesService.setPackType(packType);
      $location.path("/managePackType");
    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getPackTypes = function () {
      PackTypesService.getPackTypes(function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          $scope.packTypes = data;
          $scope.packTypesCount = $scope.data.length;
        }
        else{
          console.log('failed to get pack types');
        }
      });
    };

    $scope.getPackTypes();

    $scope.addNewPackType = function () {
      PackTypesService.setPackType("");
      $location.path('/managePackType');
    };

    $scope.packTypesTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function ($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.packTypesTableParams.reload(); });
    });

  })

  .controller('ManagePackTypesCtrl', function ($scope, $location, PackTypesService, ICONS, PERMISSIONS,ComponentTypesService) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = "/managePackType";
    $scope.packType = PackTypesService.getPackType();
    $scope.serverError = {};

    if ($scope.packType === ""){
      $scope.packType = {
        countAsDonation : false
      };
    }

    ComponentTypesService.getComponentTypes(function(response) {
      if (response !== false) {
        $scope.componentTypes = response;
      }
      else {
        console.log('failed to get component types');
      }
    });

    $scope.savePackType = function (packType, packTypeForm){

      if (packTypeForm.$valid) {
        if (typeof(packType.id) != 'undefined') {
          $scope.updatePackType(packType, packTypeForm);
        } else {
          $scope.addPackType(packType, packTypeForm);
        }
      } else {
        $scope.submitted = true;
      }
    };

    $scope.addPackType = function (packType, packTypeForm) {
      packType.isDeleted = false;
      packType.canPool = null;
      packType.canSplit = null;
      PackTypesService.addPackType(packType, function (response, err) {
        if (response !== false) {
          $scope.go('/packTypes');
        } else {
          if(err.bloodBagType){
            $scope.bloodBagTypeInvalid = "ng-invalid";
            $scope.serverError.bloodBagType = err.bloodBagType;
          }
        }
      });
    };

    $scope.updatePackType = function (packType, packTypeForm) {

      PackTypesService.updatePackType(packType, function (response, err) {
        if (response !== false) {
          $scope.go('/packTypes');
        } else {
          if(err.bloodBagType){
            $scope.bloodBagTypeInvalid = "ng-invalid";
            $scope.serverError.bloodBagType = err.bloodBagType;
          }
        }
      });
    };

    $scope.clear = function () {

    };

    $scope.go = function (path) {
      $location.path(path);
    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    // managing addition of new pack type
    if (PackTypesService.getPackType() === "") {
      $scope.managePackType = "addPackType";
    }
    // managing update of existing pack type
    else {
      $scope.packType = PackTypesService.getPackType();
      $scope.managePackType = "updatePackType";
    }

  })

;
