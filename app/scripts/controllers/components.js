'use strict';

angular.module('bsis')
  .controller('ComponentsCtrl', function ($scope, $location, ComponentService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/components" && path === "/recordComponents") {
        return true;
      } else {
        return false;
      }
    };

    var data = {};
    $scope.data = data;

    $scope.componentsSearch = {
      donationIdentificationNumber: ''
    };
    $scope.searchResults = '';

    $scope.clear = function () {
      $scope.componentsSearch = {};
      $scope.searchResults = '';
    };

    $scope.getComponentsByDIN = function () {   
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber).then(function (response) {
          data = response.data.components;
          $scope.data = data;
          console.log("$scope.data: ", $scope.data);
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });

      $scope.componentsTableParams = new ngTableParams({
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

    };

  })
;
