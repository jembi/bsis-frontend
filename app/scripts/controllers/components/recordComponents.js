'use strict';

angular.module('bsis')
  .controller('RecordComponentsCtrl', function($scope, $rootScope, $location, ComponentService) {

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
            $scope.gridOptions.data = recordResponse.components;
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

    $scope.getComponentsByDIN = function(findComponentsForm) {
      if (findComponentsForm && !findComponentsForm.$valid) {
        return;
      }
      $scope.componentsSearch.search = true;
      $location.search($scope.componentsSearch);
      $scope.searching = true;
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(componentsResponse) {
        if (componentsResponse !== false) {
          $scope.gridOptions.data = componentsResponse.components;
          $scope.searchResults = $scope.gridOptions.data.length !== 0;
          $scope.searching = false;
        } else {
          $scope.searchResults = false;
          $scope.searching = false;
        }
      });
    };

    var columnDefs = [
      {
        name: 'Component Code',
        field: 'componentCode',
        width: '**',
        maxWidth: '250'
      },
      {
        name: 'Component Type',
        field: 'componentType.componentTypeName',
        width: '**',
        maxWidth: '350'
      },
      {
        name: 'Status',
        field: 'status',
        width: '**',
        maxWidth: '200'
      },
      {
        name: 'Created On',
        field: 'createdOn',
        cellFilter: 'bsisDate',
        width: '**',
        maxWidth: '200'
      },
      {
        name: 'Expiry Status',
        field: 'deliveryDate',
        width: '**'
      }
    ];

    $scope.gridOptions = {
      data: [],
      columnDefs: columnDefs,
      multiSelect: false,
      enableRowSelection: true,

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          $scope.component = row.entity;
          $scope.selectedComponents = [];
          $scope.selectedComponents.push(row.entity.id);
          $scope.selectedComponentType = row.entity.componentType;
        });
      }
    };
  });
