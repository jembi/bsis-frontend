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
      } else if ($location.path() === '/settings' && path === '/packTypes') {
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
      $location.path("/managePackType/" + packType.id);
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
      $location.path('/managePackType/new');
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

    $scope.$watch('data', function () {
      $timeout(function(){ $scope.packTypesTableParams.reload(); });
    });

  })

  .controller('ManagePackTypesCtrl', function ($scope, $location, PackTypesService, ICONS, PERMISSIONS,ComponentTypesService, $routeParams) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = '/managePackType';
    $scope.packType = PackTypesService.getPackType();
    $scope.serverError = null;

    if ($scope.packType === ''){
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

    $scope.addPackType = function (packType) {
      packType.isDeleted = false;
      packType.canPool = null;
      packType.canSplit = null;

      if(!packType.countAsDonation) {
        delete packType.componentType;
      }

      PackTypesService.addPackType(packType, function () {
        $scope.go('/packTypes');
      }, function(err) {
        $scope.serverError = {
          userMessage: err.userMessage,
          fieldErrors: {
            'type.packType': err['type.packType'],
            'type.countAsDonation': err['type.countAsDonation']
          }
        };
      });
    };

    $scope.switchCountAsDonation = function (){
      if(!$scope.packType.countAsDonation) {
        $scope.tempComponentType = $scope.packType.componentType;
        $scope.packType.componentType = '';
      }
      else {
        $scope.packType.componentType= $scope.tempComponentType;
        $scope.tempComponentType = '';
      }
    };

    $scope.handleTestSampleProducedToggle = function() {
      if (!$scope.packType.testSampleProduced) {
        $scope.packType.countAsDonation = false;
        $scope.switchCountAsDonation();
      }
    };

    $scope.updatePackType = function (packType) {

      if(!packType.countAsDonation) {
        delete packType.componentType;
      }

      PackTypesService.updatePackType(packType, function () {
        $scope.go('/packTypes');
      }, function(err) {
        $scope.serverError = {
          userMessage: err.userMessage,
          fieldErrors: {
            'type.packType': err['type.packType'],
            'type.countAsDonation': err['type.countAsDonation']
          }
        };
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

    $scope.getPackType = function () {
      PackTypesService.getPackTypeById($routeParams.id, function (packType) {
        $scope.packType = packType;
      }, function (err){
        $scope.serverError = err;
      });
    };

    // managing addition of new pack type
    if ($routeParams.id == "new") {
      $scope.managePackType = 'addPackType';
      $scope.packType = {
        testSampleProduced: true,
        countAsDonation: true
      };
    }
    // managing update of existing pack type
    else {
      $scope.getPackType();
      $scope.managePackType = "updatePackType";
    }

  })

;
