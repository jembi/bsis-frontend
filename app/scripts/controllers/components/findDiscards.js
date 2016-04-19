'use strict';

angular.module('bsis')
  .controller('FindDiscardsCtrl', function($scope, $rootScope, $location, ComponentService, DATEFORMAT, ngTableParams, $timeout, $routeParams, $filter) {

    // Initialize variables

    var data = [{}];
    $scope.discardsSearch = {};

    $scope.searchResults = '';
    $scope.format = DATEFORMAT;
    $scope.startDateOpen = false;
    $scope.endDateOpen = false;
    $scope.componentTypes = [];
    $scope.discardsSearch = {};

    // Find discards methods (findDiscards.html)

    $scope.clear = function() {
      $scope.discardsSearch = {};
      $scope.searchResults = '';
      $scope.status = [];
      $location.search({});
    };

    $scope.findDiscards = function(discardsSearch) {
      $scope.componentsView = 'viewDonations';

      discardsSearch.search = true;
      // limit results to DISCARDED components
      $scope.status = [];
      $scope.status.push('DISCARDED');
      discardsSearch.status = $scope.status;
      $location.search(discardsSearch);

      $scope.searching = true;
      ComponentService.ComponentsSearch(discardsSearch, function(searchResponse) {
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

    function initialiseRouteParams() {
      if ($routeParams.search) {

        if ($routeParams.donationIdentificationNumber) {
          $scope.discardsSearch.donationIdentificationNumber = $routeParams.donationIdentificationNumber;
        }
        if ($routeParams.donationDateFrom) {
          var donationDateFrom = new Date($routeParams.donationDateFrom);
          $scope.discardsSearch.donationDateFrom = donationDateFrom;
        }
        if ($routeParams.donationDateTo) {
          var donationDateTo = new Date($routeParams.donationDateTo);
          $scope.discardsSearch.donationDateTo = donationDateTo;
        }
        if ($routeParams.componentTypes) {
          var componentTypes = $routeParams.componentTypes;
          if (!angular.isArray(componentTypes)) {
            componentTypes = [componentTypes];
          }
          angular.forEach(componentTypes, function(selectedComponentType) {
            $scope.discardsSearch.componentTypes.push(parseInt(selectedComponentType));
          });
        }

        $scope.findDiscards($scope.discardsSearch);
      }
    }

    function initialiseDiscardsForm() {
      ComponentService.getComponentsFormFields(function(response) {
        if (response !== false) {
          $scope.componentTypes = response.componentTypes;
          initialiseRouteParams();
        }
      });
    }

    // View components methods (viewDonations.html)

    $scope.viewComponents = function(din) {
      $scope.din = din;
      ComponentService.getComponentsByDIN(din, function(componentsResponse) {
        if (componentsResponse !== false) {
          $scope.components = componentsResponse.components;
          $scope.componentsView = 'viewComponents';
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
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
            $filter('orderBy')(data, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.componentsSummaryTableParams.reload();
      });
    });

    // View component summary methods (viewComponents.html)

    $scope.setcomponentsView = function(view) {
      $scope.componentsView = view;
    };

    // Execute when findDiscards.html loads

    initialiseDiscardsForm();

  });
