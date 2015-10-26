'use strict';

angular.module('bsis')
  .controller('ComponentsCtrl', function ($scope, $rootScope, $location, ComponentService, ICONS, PERMISSIONS, COMPONENTTYPE, DATEFORMAT, $filter, ngTableParams, $timeout, $routeParams) {

    function getISOString(maybeDate) {
      return angular.isDate(maybeDate) ? maybeDate.toISOString() : maybeDate;
    }
    ComponentService.getComponentsFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.componentTypes = $scope.data.componentTypes;
        $scope.returnReasons = $scope.data.returnReasons;
        $scope.discardReasons = $scope.data.discardReasons;


    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.selectedComponents = [];

    $scope.isCurrent = function(path) {
      var initialView = '';
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        // for first time load of /components view, determine the initial view
        if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.ADD_COMPONENT) > -1)){
          initialView = '/recordComponents';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_COMPONENT) > -1)){
          initialView = '/findComponents';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.DISCARD_COMPONENT) > -1)){
          initialView = '/discardComponents';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DISCARDS) > -1)){
          initialView = '/findDiscards';
        }

        // if first time load of /components view , and path === initialView, return true
        if ($location.path() === "/components" && path === initialView){
          $location.path(initialView);
          return true;
        }

        return false;
      }
    };

    var data = [{}];
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
    $scope.format = DATEFORMAT;
    $scope.initDate = new Date();
    $scope.calIcon = 'fa-calendar';

    $scope.startDateOpen = false;
    $scope.endDateOpen = false;






    $scope.getComponentCombinations = function() {
      ComponentService.getComponentCombinations(function(response){
        if (response !== false){
          $scope.data = response;
          $scope.combinations = $scope.data.combinations;
        }
        else{
        }
      });
    };

    $scope.getComponentCombinations();

    $scope.clear = function () {
      $scope.componentsSearch = {};
      $scope.discardsSearch = {};
      $scope.searchResults = '';
      $scope.selectedComponentTypes = {};
      $scope.componentSelected = '';
      $location.search({});
    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $location.search({});
      $scope.submitted = '';
    };

    $scope.clearProcessComponentForm = function () {
      $location.search({});
      $scope.component = {};
      $scope.componentSelected = '';
      $scope.submitted = '';
      $scope.selectedComponents = [];
    };

    $scope.clearDiscardComponentForm = function () {
      $location.search({});
      $scope.discard = {};
      $scope.componentSelected = '';
      $scope.submitted = '';
      $scope.selectedComponents = [];
    };

    $scope.componentsSearch = $routeParams;


    $scope.getComponentsByDIN = function () {
      $scope.componentsSearch.search = true;
      $location.search($scope.componentsSearch);

      $scope.searching = true;
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          $scope.searchResults = true;
          if ($scope.data.length === 0){
            $scope.searchResults = false;
          }
          $scope.searching = false;
        }
        else{
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });

    };

    if ($routeParams.search) {
      $scope.getComponentsByDIN();
    }

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
      componentsSearch.findComponentsSearch = true;
      $location.search(componentsSearch);

      $scope.searching = true;
      ComponentService.ComponentsSearch(componentsSearch, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          $scope.searchResults = true;
          $scope.componentsSearchCount = $scope.data.length;
          $scope.searching = false;
        }
        else{
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });
    };



    if ($routeParams.findComponentsSearch) {
      if ($scope.componentsSearch.donationDateFrom) {
        var donationDateFrom = getISOString($scope.componentsSearch.donationDateFrom);
        $scope.componentsSearch.donationDateFrom = donationDateFrom;
      }

      if ($scope.componentsSearch.donationDateTo) {
        var donationDateTo = getISOString($scope.componentsSearch.donationDateTo);
        $scope.componentsSearch.donationDateTo = donationDateTo;
      }
      $scope.findComponents($scope.componentsSearch);
    }

    if ($routeParams.componentTypes) {
      var componentTypes = $routeParams.componentTypes;
      if (!angular.isArray(componentTypes)) {
        componentTypes = [componentTypes];
      }
      $scope.componentsSearch.componentTypes = componentTypes;
    }

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

      $scope.din = din;

      ComponentService.getComponentsByDIN(din, function(response){
        if (response !== false){
          $scope.components = response.components;
          $scope.componentsView = 'viewComponents';
        }
        else{
        }
      });
      
    };

    $scope.setcomponentsView = function (view) {
      $scope.componentsView = view;
    };

    $scope.discardsSearch= $routeParams;

    $scope.findDiscards = function (discardsSearch) {
      $scope.componentsView = 'viewDonations';

      discardsSearch.findDiscardsSearch = true;
      // limit results to DISCARDED components
      $scope.status = [];
      $scope.status.push("DISCARDED");
      discardsSearch.status = $scope.status;
      $location.search(discardsSearch);

      $scope.searching = true;
      ComponentService.ComponentsSearch(discardsSearch, function(response){
        if (response !== false){
          data = response.components;
          $scope.data = data;
          $scope.searchResults = true;
          $scope.componentsSearchCount = $scope.data.length;
          $scope.searching = false;
        }
        else{
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });
    };

    if ($routeParams.findDiscardsSearch) {
      if ($scope.discardsSearch.donationDateFrom) {
        var discardDonationDateFrom = getISOString($scope.discardsSearch.donationDateFrom);
        $scope.discardsSearch.donationDateFrom = discardDonationDateFrom;
      }

      if ($scope.discardsSearch.donationDateTo) {
        var discardDonationDateTo = getISOString($scope.discardsSearch.donationDateTo);
        $scope.discardsSearch.donationDateTo = discardDonationDateTo;
      }
      $scope.findDiscards($scope.discardsSearch);
    }



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

    $scope.recordComponents = function (recordComponentsForm) {

      if(recordComponentsForm.$valid && $scope.selectedComponents.length > 0){

        $scope.recordComponent = {};

        $scope.recordComponent.parentComponentId = $scope.selectedComponents[0];
        $scope.recordComponent.componentTypeCombination = $scope.component.componentTypeCombination;

        $scope.recordingComponents = true;
        ComponentService.recordComponents($scope.recordComponent, function(response){
          if (response !== false){
            data = response.components;
            $scope.data = data;
            $scope.recordComponent = {};
            recordComponentsForm.$setPristine();
            $scope.submitted = '';
            $scope.componentSelected = '';
            $scope.component = {};
            $scope.selectedComponents = [];
            $scope.selectedComponentType = {};
            $scope.recordingComponents = false;
          }
          else{
            // TODO: handle case where response == false
            $scope.recordingComponents = false;
          }
        });
      }
      else{
        $scope.submitted = true;
        if($scope.selectedComponents.length > 0){
          $scope.componentSelected = true;
        }
        else {
          $scope.componentSelected = false;
        }
        console.log("FORM NOT VALID");
      }

    };

    $scope.discardComponents = function (discardComponentsForm) {

      if (discardComponentsForm.$valid && $scope.selectedComponents.length > 0){

        $scope.discard.selectedComponents = $scope.selectedComponents;

        angular.forEach($scope.discard.selectedComponents, function(component) {
          $scope.componentToDiscard = {};
          $scope.componentToDiscard.componentId = component;
          $scope.componentToDiscard.discardReason = $scope.discard.discardReason;
          $scope.componentToDiscard.discardReasonText = $scope.discard.discardReasonText;

          $scope.discardingComponent = true;
          ComponentService.discardComponent($scope.componentToDiscard, function(response){
            if (response !== false){
              data = response.components;
              $scope.data = data;
              $scope.discard = {};
              discardComponentsForm.$setPristine();
              $scope.submitted = '';
              $scope.componentSelected = '';
              $scope.selectedComponents = [];
              $scope.discardingComponent = false;
            }
            else{
              // TODO: handle case where response == false
              $scope.discardingComponent = false;
            }
          });
        });
      }
      else{
        $scope.submitted = true;
        if($scope.selectedComponents.length > 0){
          $scope.componentSelected = true;
        }
        else {
          $scope.componentSelected = false;
        }
        console.log("FORM NOT VALID");
      }

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

    // toggle selection util method to toggle checkboxes
    // - this is for mutual selection (radio button behaviour, rather than multiple checkbox selection)
    $scope.toggleMutualSelection = function toggleSelection(componentId, componentType) {
      var idx = $scope.selectedComponents.indexOf(componentId);
      // is currently selected
      if (idx > -1) {
        $scope.selectedComponents.splice(idx, 1);
      }
      // is newly selected
      else {
        // set selectedComponents to an empty array
        $scope.selectedComponents = [];
        $scope.selectedComponents.push(componentId);
      }
      $scope.selectedComponentType = componentType;
    };

      }
      else{
      }
    });

  })
;
