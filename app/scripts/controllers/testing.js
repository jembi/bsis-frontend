'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $location, TestingService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    var data = {};
    $scope.data = data;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/testing" && path === "/viewTestResults") {
        return true;
      } else {
        return false;
      }
    };

    $scope.getTestBatchFormFields = function () {
      TestingService.getTestBatchFormFields().then(function (response) {
          data = response.data.testBatches;
          $scope.data = data;
        }, function () {
      });

      $scope.testBatchTableParams = new ngTableParams({
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



  });
