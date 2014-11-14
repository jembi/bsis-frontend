'use strict';

angular.module('bsis')
  .controller('ComponentsCtrl', function ($scope, $location, ComponentService, ICONS, PERMISSIONS, COMPONENTTYPE, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.componentTypes = COMPONENTTYPE.componentTypes;
    $scope.selectedComponents = [];

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
          $scope.searchResults = true;
          if ($scope.data.length === 0){
            $scope.searchResults = false;
          }
        }
        else{
          $scope.searchResults = false;
        }
      });

    };

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

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.componentsTableParams.reload(); });
    });

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
          $scope.searchResults = true;
          $scope.componentsSearchCount = $scope.data.length;
          
        }
        else{
          $scope.searchResults = false;
        }
      });

    };

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

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.componentsSummaryTableParams.reload(); });
    });

    $scope.viewComponents = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      $scope.componentsView = 'viewComponents';
    };

    $scope.setcomponentsView = function (view) {
      $scope.componentsView = view;
    };

    $scope.findDiscards = function (discardsSearch) {
      $scope.componentsView = 'viewDonations';

      $scope.selectedComponentTypes = [];
      angular.forEach(discardsSearch.componentTypes,function(value,index){
          $scope.selectedComponentTypes.push(value.id);
      });
      discardsSearch.componentTypes = $scope.selectedComponentTypes;

      // limit results to DISCARDED components
      $scope.status = [];
      $scope.status.push("DISCARDED");
      discardsSearch.status = $scope.status;

      console.log("discardsSearch: ", discardsSearch);

      ComponentService.ComponentsSearch(discardsSearch, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          $scope.searchResults = true;
          $scope.componentsSearchCount = $scope.data.length;
          
        }
        else{
          $scope.searchResults = false;
        }
      });

    };

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

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.discardsSummaryTableParams.reload(); });
    });

    $scope.recordComponents = function () {

      $scope.recordComponent = {};

      $scope.recordComponent.parentComponentId = $scope.selectedComponents[0];
      $scope.recordComponent.childComponentTypeId = $scope.component.childComponentTypeId;
      $scope.recordComponent.numUnits = $scope.component.numUnits;

      $scope.component = {};
      $scope.selectedComponents = [];

      ComponentService.recordComponents($scope.recordComponent, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          $scope.recordComponent = {};
          console.log("$scope.data: ", $scope.data);
        }
        else{
          // TODO: handle case where response == false
        }
      });

    };

    $scope.discardComponents = function () {

      $scope.discard.selectedComponents = $scope.selectedComponents;

      angular.forEach($scope.discard.selectedComponents, function(component) {
        $scope.componentToDiscard = {};
        $scope.componentToDiscard.componentId = component;
        $scope.componentToDiscard.discardReason = $scope.discard.discardReason;
        $scope.componentToDiscard.discardReasonText = $scope.discard.discardReasonText;

        ComponentService.discardComponent($scope.componentToDiscard, function(response){
          if (response !== false){
            data = response.components;
            $scope.data = data;
            $scope.discard = {};
          }
          else{
            // TODO: handle case where response == false
          }
        });
      });

    };

    // toggle selection util method to toggle checkboxes
    $scope.toggleSelection = function toggleSelection(componentId) {
      var idx = $scope.selectedComponents.indexOf(componentId);
      // is currently selected
      if (idx > -1) {
        $scope.selectedComponents.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selectedComponents.push(componentId);
      }
    };

  })
;
