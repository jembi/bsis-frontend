'use strict';

angular.module('bsis')
  .controller('RolesCtrl', function ($scope, $location, RolesService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;


    $scope.isCurrent = function (path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/roles") {
        return true;
      } else {
        return false;
      }
    };

    var data = [];

    $scope.roles = {};
    $scope.clear = function () {

    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getRoles = function () {
      RolesService.getRoles(function (response) {
        if (response !== false) {
          data = response;
          $scope.data = response;
          $scope.rolesCount = $scope.data.length;
        }
        else {

        }
      });
    };

    $scope.addNewRole = function () {
      $location.path('/addRole');
    };


    $scope.manageRole = function (item) {

      RolesService.getAllPermissions(function (response) {
        if (response !== false) {
          $scope.permissionList = response.permissions;
          RolesService.setPermissions(response.permissions);
          $scope.role = item;
          RolesService.setRole(item);
          $location.path("/role");
        }
        else {

        }
      });
    };

    $scope.getRoles();

    $scope.removeRoleCheck = function(role){
      $scope.roleToRemove = role.id;
    };

    $scope.cancelRemoveRole = function(){
      $scope.roleToRemove = '';
    };

    $scope.removeRole = function(role){
      RolesService.removeRole(role, function(response){
        if (response !== false){
          $scope.getRoles();
        }
        else{
        }
      });
    };

    $scope.rolesTableParams = new ngTableParams({
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
      $timeout(function () {
        $scope.rolesTableParams.reload();
      });
    });
  })

  .controller('AddRoleCtrl', function($scope, $location, RolesService, ICONS, PERMISSIONS) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = "/addRole";
    $scope.loadPermissions = function (){
      RolesService.getAllPermissions(function (response) {
        if (response !== false) {
          $scope.permissionList = response.permissions;
          RolesService.setPermissions(response.permissions);
          $location.path("/addRole");
        }
        else {

        }
      });
    };

    $scope.role = {};
    $scope.addRole = function (role, roleForm) {

      if(roleForm.$valid){
        RolesService.addRole(role, function(response){
          if (response !== false){
            $scope.role = {
              name: '',
              description: ''
            };
            roleForm.$setPristine();
            $scope.submitted = '';
            $scope.go('/roles');
          }
          else{
          }
        });
      }
      else{
        $scope.submitted = true;
      }
    };

    $scope.loadPermissions();

    $scope.go = function (path) {
      $location.path(path);
    };
  })



  .controller('ViewRoleCtrl', function ($scope, $location, RolesService, ICONS, PERMISSIONS) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = "/role";

    $scope.role = RolesService.getRole();
    $scope.permissionList = RolesService.getPermissions();


    $scope.updateRole = function (role) {

      RolesService.updateRole(role, function (response) {
        $scope.go('/roles');
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

  });
