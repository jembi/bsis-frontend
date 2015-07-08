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

    var data = {};
    $scope.data = data;
    $scope.packTypes = {};


    $scope.clear = function () {

    };

    $scope.managePackType  = function (packType){
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
          $scope.packTypes = data;
          $scope.packTypesCount = $scope.packTypes.length;
        }
        else{

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
        count: 8,          // count per page
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

  .controller('ManagePackTypeCtrl', function ($scope, $location, PackTypesService, ICONS, PERMISSIONS) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = "/packType";

    $scope.packType = PackTypesService.getPackType();
    //$scope.permissionList = PackTypesService.getPermissions();
    $scope.savePackType = function (packType){
      if ($scope.managePackType == 'updatePackType'){
        $scope.updatePackType(packType);

      } else if ($scope.managePackType == 'addPackType'){
        $scope.addPackType(packType, packTypeForm);
      }
    };

    $scope.addPackType = function (packType, packTypeForm) {
      PackTypesService.addPackType(packType, function (response) {
        $scope.go('/packTypes');
      });
    };

    $scope.updatePackType = function (packType) {

      PackTypesService.updatePackType(packType, function (response) {
        $scope.go('/packTypes');
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
