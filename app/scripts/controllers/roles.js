'use strict';

angular.module('bsis')
  .controller('RolesCtrl', function ($scope, $location, RolesService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.data = {};
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

      $scope.rolesTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: $scope.data.length, // length of data
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
    };

    $scope.addNewRole = function () {
      RolesService.setRole("");
      RolesService.setPermissions("");
      $location.path('/manageRole');
    };


    $scope.manageRole = function (role) {

      RolesService.getAllPermissions(function (response) {
        if (response !== false) {
          $scope.permissionList = response.permissions;
          RolesService.setPermissions(response.permissions);
          $scope.role = role;
          RolesService.setRole(role);
          $location.path("/manageRole");
        }
        else {

        }
      });
    };

    $scope.getRoles();

  })

.controller('ManageRolesCtrl', function ($scope, $location, RolesService, ICONS, PERMISSIONS) {
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    // managing addition of new role
    if (RolesService.getRole() === ""){
      $scope.loadPermissions();
      $scope.manageRoleType = "addRole";
    }
    // managing update of existing role
    else {
      $scope.role = RolesService.getRole();
      $scope.permissionList = RolesService.getPermissions();
      $scope.manageRoleType = "updateRole";
    }

    $scope.saveRole = function (role, roleForm) {

      if ($scope.manageRoleType === "updateRole"){
        $scope.updateRole(role);
      }
      else if($scope.manageRoleType === "addRole"){
        $scope.addRole(role,roleForm);
      }

    };

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

    $scope.updateRole = function (role) {

      RolesService.updateRole(role, function (response) {
        RolesService.setRole("");
        RolesService.setPermissions("");
        $scope.go('/roles');
      });
    };

    $scope.loadPermissions = function (){
      RolesService.getAllPermissions(function (response) {
        if (response !== false) {
          $scope.permissionList = response.permissions;
          RolesService.setPermissions(response.permissions);
          $location.path("/manageRole");
        }
        else {

        }
      });
    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.cancel = function (form) {
      $scope.clearForm(form);
      $location.path("/roles");
    };

  });
