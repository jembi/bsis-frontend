'use strict';

angular.module('bsis')
  .controller('UsersCtrl', function ($scope, $location, UsersService, RolesService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function (path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/users") {
        return true;
      } else {
        return false;
      }
    };

    var data = [];
    $scope.data = data;
    $scope.users = {};

    $scope.clear = function () {

    };

    $scope.clearForm = function (form) {
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getUsers = function () {
      UsersService.getUsers(function (response) {
        if (response !== false) {
          data = response;
          $scope.data = data;
          $scope.usersCount = $scope.data.length;
          console.log("users: ", response);
        }
        else {

        }
      });

    };

    $scope.getUser = function () {
      UsersService.getUser(1, function (response) {
        if (response !== false) {
          console.log("user id 1: ", response);
        }
        else {

        }
      });

    };

    $scope.getUsers();

    $scope.removeUserCheck = function(user){
      $scope.userToRemove = user.id;
    };

    $scope.cancelRemoveUser = function(){
      $scope.userToRemove = '';
    };

    $scope.removeUser = function(user){
      UsersService.removeUser(user, function(response){
        if (response !== false){
          $scope.getUsers();
        }
        else{
        }
      });
    };

    $scope.addNewUser = function () {
      $location.path('/add_user');
    };

    $scope.manageUser = function (item) {

      RolesService.getRoles(function (response) {
        if (response !== false) {
          $scope.roleList = response;
          UsersService.setRoles(response);
          $scope.user = item;
          UsersService.setUser(item);
          $location.path("/user");
        }
        else {

        }
      });
    };


    $scope.usersTableParams = new ngTableParams({
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
        $scope.usersTableParams.reload();
      });
    });
  })
  .controller('AddUserCtrl', function($scope, $rootScope, UsersService, RolesService, ICONS, PERMISSIONS, $location, ngTableParams, $timeout){
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = '/add_user';

    $scope.loadRoles = function (){
      RolesService.getRoles(function (response) {
        if (response !== false) {
          $scope.roleList = response;
          UsersService.setRoles(response);
          $location.path("/add_user");
        }
        else {

        }
      });
    };

    $scope.user = {};
    $scope.addUser = function (user, userForm) {

      if(userForm.$valid){
        UsersService.addUser(user, function(response){
          if (response !== false){
            $scope.user = {
              name: '',
              description: ''
            };
            userForm.$setPristine();
            $scope.submitted = '';
            $scope.go('/users');
          }
          else{
          }
        });
      }
      else{
        $scope.submitted = true;
      }
    };

    $scope.loadRoles();

    $scope.go = function (path) {
      $location.path(path);
    };

  })

  .controller('ViewUserCtrl', function($scope, $location, UsersService, RolesService, ICONS, PERMISSIONS){
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selection = "/user";

    $scope.user = UsersService.getUser();
    $scope.roleList = RolesService.getRoles();


    $scope.updateUser = function (role) {

      UsersService.updateUser(role, function () {
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
  })

;
