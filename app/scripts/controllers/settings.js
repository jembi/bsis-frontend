'use strict';

angular.module('bsis')
  .controller('SettingsCtrl', function ($scope, $location, SettingsService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/settings" && path === "/locations") {
        return true;
      } else {
        return false;
      }
    };

    var data = {};
    $scope.data = data;
    $scope.location = {};

    $scope.clear = function () {
      $scope.location = {};
    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getLocations = function () {
      SettingsService.getLocations(function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          console.log("locations: ",data);
        }
        else{

        }
      });

    };

    $scope.getLocations();

    $scope.addLocation = function (location, locationForm) {

      if(locationForm.$valid && !(!locationForm.donorPanel.$viewValue && !locationForm.mobileSite.$viewValue && !locationForm.requestSite.$viewValue)){

        SettingsService.addLocation(location, function(response){
          if (response !== false){
            $scope.location = {};
            locationForm.$setPristine();
            $scope.submitted = '';
            $scope.getLocations();
          }
          else{
          }
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };

    $scope.locationsTableParams = new ngTableParams({
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
      $timeout(function(){ $scope.locationsTableParams.reload(); });
    });

  });