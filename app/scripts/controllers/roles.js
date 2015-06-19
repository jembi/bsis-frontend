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
    $scope.data = data;
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
          $scope.data = data;
          console.log("roles: ", response);
        }
        else {

        }
      });

    };

    $scope.getRole = function () {
      RolesService.getRole(1, function (response) {
        if (response !== false) {
          //data = response;
          //$scope.data = data;
          console.log("role id 1: ", response);
        }
        else {

        }
      });

    };

    $scope.getRoles();
    // $scope.getRole();

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
  });
