'use strict';

angular.module('bsis')
  .controller('FindComponentsCtrl', function($scope, $location, ComponentService, ICONS, DATEFORMAT, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.icons = ICONS;

    $scope.format = DATEFORMAT;
    $scope.startDateOpen = false;
    $scope.endDateOpen = false;

    var data = [{}];
    $scope.data = data;
    $scope.component = {};

    $scope.searchResults = '';
    $scope.search = {
      donationIdentificationNumber: '',
      startDate: '',
      endDate: '',
      componentTypes: []
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
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.componentsSummaryTableParams.reload();
      });
    });

    $scope.findComponents = function(search) {
      $scope.componentsView = 'viewDonations';
      search.findComponentsSearch = true;
      $location.search(search);

      $scope.searching = true;
      ComponentService.ComponentsSearch(search, function(searchResponse) {
        if (searchResponse !== false) {
          data = searchResponse.components;
          $scope.data = data;
          $scope.searchResults = true;
          $scope.componentsSearchCount = $scope.data.length;
          $scope.searching = false;
        } else {
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });
    };

    $scope.clear = function() {
      $scope.search = {};
      $scope.searchResults = '';
      $location.search({});
    };

    $scope.setcomponentsView = function(view) {
      $scope.componentsView = view;
    };

    $scope.viewComponents = function(din) {
      $scope.din = din;
      ComponentService.getComponentsByDIN(din, function(componentsResponse) {
        if (componentsResponse !== false) {
          $scope.components = componentsResponse.components;
          $scope.componentsView = 'viewComponents';
        }
      });
    };

    function initialiseRouteParams() {
      if ($routeParams.findComponentsSearch) {
        if ($routeParams.donationIdentificationNumber) {
          $scope.search.donationIdentificationNumber = $routeParams.donationIdentificationNumber;
        }
        if ($routeParams.donationDateFrom) {
          var donationDateFrom = new Date($routeParams.donationDateFrom);
          $scope.search.donationDateFrom = donationDateFrom;
        }
        if ($routeParams.donationDateTo) {
          var donationDateTo = new Date($routeParams.donationDateTo);
          $scope.search.donationDateTo = donationDateTo;
        }
        if ($routeParams.componentTypes) {
          var componentTypes = $routeParams.componentTypes;
          if (!angular.isArray(componentTypes)) {
            componentTypes = [componentTypes];
          }
          angular.forEach(componentTypes, function(selectedComponentType) {
            $scope.search.componentTypes.push(parseInt(selectedComponentType));
          });
        }
        $scope.findComponents($scope.search);
      }
    }

    function initialiseFindComponentForm() {
      ComponentService.getComponentsFormFields(function(response) {
        if (response !== false) {
          $scope.componentTypes = response.componentTypes;
          initialiseRouteParams();
        }
      });
    }

    initialiseFindComponentForm();
  })
;
