'use strict';

angular.module('bsis')
  .controller('ComponentsCtrl', function ($scope, $location, ComponentService, ICONS, PERMISSIONS, COMPONENTTYPE, $filter, ngTableParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.componentTypes = COMPONENTTYPE.componentTypes;

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
    $scope.component = {};
    $scope.discard = {};

    $scope.componentsSearch = {
      donationIdentificationNumber: '',
      startDate: '',
      endDate: ''
    };
    $scope.discardsSearch = {};
    $scope.searchResults = '';

    $scope.dateOptions = {
      'formatYear': 'yy',
      'startingDay': 1,
      'show-weeks': false
    };
    $scope.format = 'dd/MM/yyyy';
    $scope.initDate = new Date();
    $scope.calIcon = 'fa-calendar';

    $scope.startDateOpen = false;
    $scope.endDateOpen = false;

    ComponentService.getComponentsFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.componentTypes = $scope.data.componentTypes;
        $scope.returnReasons = $scope.data.returnReasons;
        $scope.discardReasons = $scope.data.discardReasons;
      }
      else{
      }
    });

    $scope.clear = function () {
      $scope.componentsSearch = {};
      $scope.discardsSearch = {};
      $scope.searchResults = '';
      $scope.selectedComponentTypes = {};
    };

    $scope.clearProcessComponentForm = function () {
      $scope.component = {};
    };

    $scope.clearDiscardComponentForm = function () {
      $scope.discard = {};
    };

    $scope.getComponentsByDIN = function () {   
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          console.log("$scope.data: ", $scope.data);
          $scope.searchResults = true;
          console.log("$scope.data.length: ", $scope.data.length);
          $scope.componentsSearchCount = $scope.data.length;

          if ($scope.componentsTableParams.data.length >= 0){
            $scope.componentsTableParams.reload();
          }
          
        }
        else{
          $scope.searchResults = false;
        }
      });
      /*
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber).then(function (response) {
          data = response.data.components;
          $scope.data = data;
          //$scope.componentTypes = response.data.componentTypes;
          //$scope.discardReasons = response.data.discardReasons;
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });
      */

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

    $scope.findComponents = function (componentsSearch) {
      $scope.componentsView = 'viewDonations';

      $scope.selectedComponentTypes = [];
      angular.forEach(componentsSearch.componentTypes,function(value,index){
          $scope.selectedComponentTypes.push(value.id);
      });
      componentsSearch.componentTypes = $scope.selectedComponentTypes;

      console.log("componentsSearch: ", componentsSearch);

      ComponentService.ComponentsSearch(componentsSearch, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          console.log("$scope.data: ", $scope.data);
          $scope.searchResults = true;
          console.log("$scope.data.length: ", $scope.data.length);
          $scope.componentsSearchCount = $scope.data.length;

          if ($scope.componentsSummaryTableParams.data.length >= 0){
            $scope.componentsSummaryTableParams.reload();
          }
          
        }
        else{
          $scope.searchResults = false;
        }
      });

      /*
      ComponentService.getComponentsSummary().then(function (response) {
          data = response.data.donations;
          $scope.data = data;
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });
      */

      $scope.componentsSummaryTableParams = new ngTableParams({
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

    $scope.viewComponents = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      $scope.componentsView = 'viewComponents';
    };

    $scope.setcomponentsView = function (view) {
      $scope.componentsView = view;
    };

    $scope.getDiscardsSummary = function () {

      ComponentService.getDiscardsSummary().then(function (response) {
          data = response.data.discards;
          $scope.data = data;
          
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });

      $scope.discardsSummaryTableParams = new ngTableParams({
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
