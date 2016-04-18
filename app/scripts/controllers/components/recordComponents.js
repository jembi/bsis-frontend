'use strict';

angular.module('bsis')
  .controller('RecordComponentsCtrl', function($scope, $rootScope, $location, ComponentService, DATEFORMAT, $filter, ngTableParams, $timeout) {
  
  var data = [{}];
  $scope.searchResults = '';
  $scope.selectedComponents = [];
  $scope.component = {};

  $scope.clear = function() {
    $scope.componentsSearch = {};
    $scope.searchResults = '';
    $scope.selectedComponentTypes = {};
    $scope.componentSelected = '';
    $location.search({});
  };

  $scope.clearForm = function(form) {
    form.$setPristine();
    $location.search({});
    $scope.submitted = '';
  };

  $scope.clearProcessComponentForm = function() {
    $location.search({});
    $scope.component = {};
    $scope.componentSelected = '';
    $scope.submitted = '';
    $scope.selectedComponents = [];
  };

  $scope.recordComponents = function(recordComponentsForm) {

    if (recordComponentsForm.$valid && $scope.selectedComponents.length > 0) {

      $scope.recordComponent = {};
      $scope.recordComponent.parentComponentId = $scope.selectedComponents[0];
      $scope.recordComponent.componentTypeCombination = $scope.component.componentTypeCombination;

      $scope.recordingComponents = true;
      ComponentService.recordComponents($scope.recordComponent, function(recordResponse) {
        if (recordResponse !== false) {
          data = recordResponse.components;
          $scope.data = data;
          $scope.recordComponent = {};
          recordComponentsForm.$setPristine();
          $scope.submitted = '';
          $scope.componentSelected = '';
          $scope.component = {};
          $scope.selectedComponents = [];
          $scope.selectedComponentType = {};
          $scope.recordingComponents = false;
        } else {
          // TODO: handle case where response == false
          $scope.recordingComponents = false;
        }
      });
    } else {
      $scope.submitted = true;
      $scope.componentSelected = $scope.selectedComponents.length > 0;
    }

  };

  $scope.getComponentsByDIN = function() {
    $scope.componentsSearch.search = true;
    $location.search($scope.componentsSearch);
    $scope.searching = true;
    ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(componentsResponse) {
      if (componentsResponse !== false) {
        data = componentsResponse.components;
        $scope.data = data;
        $scope.searchResults = $scope.data.length !== 0;
        $scope.searching = false;
      } else {
        $scope.searchResults = false;
        $scope.searching = false;
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
      $scope.componentsTableParams.reload();
    });
  });

  // toggle selection util method to toggle checkboxes
  // - this is for mutual selection (radio button behaviour, rather than multiple checkbox selection)
  $scope.toggleMutualSelection = function toggleSelection(componentId, componentType) {
    var idx = $scope.selectedComponents.indexOf(componentId);
    // is currently selected
    if (idx > -1) {
      $scope.selectedComponents.splice(idx, 1);
    } else {
      // set selectedComponents to an empty array
      $scope.selectedComponents = [];
      $scope.selectedComponents.push(componentId);
    }
    $scope.selectedComponentType = componentType;
  };

});
