'use strict';

angular.module('bsis')
  .controller('RecordComponentsCtrl', function($scope, $rootScope, $location, $log, $timeout, ComponentService) {

    $scope.component = null;
    $scope.componentsSearch = {
      donationIdentificationNumber: ''
    };
    $scope.recordingWeight = false;
    var forms = $scope.forms = {};

    $scope.clear = function() {
      $scope.componentsSearch.donationIdentificationNumber = '';
      $location.search({});
      $scope.gridOptions.data = null;
      angular.forEach(forms, function(form) {
        form.$setPristine();
      });
    };

    $scope.clearComponentTypeCombination = function() {
      if ($scope.component) {
        $scope.component.componentTypeCombination = null;
      }
      forms.recordComponentsForm.$setPristine();
    };

    $scope.clearWeight = function() {
      if ($scope.component) {
        $scope.component.weight = null;
      }
      forms.recordWeightForm.$setPristine();
    };

    $scope.recordComponents = function() {

      if (forms.recordComponentsForm.$invalid) {
        return;
      }

      var componentToRecord = {
        parentComponentId: $scope.component.id,
        componentTypeCombination: $scope.component.componentTypeCombination
      };

      $scope.recordingComponents = true;
      ComponentService.recordComponents(componentToRecord, function(recordResponse) {
        if (recordResponse !== false) {
          $scope.gridOptions.data = recordResponse.components;
          forms.recordComponentsForm.$setPristine();
          $scope.component = null;
          $scope.recordingComponents = false;
        } else {
          // TODO: handle case where response == false
          $scope.recordingComponents = false;
        }
      });

    };

    $scope.recordWeightForSelectedComponent = function() {
      $scope.recordingWeight = true;
      ComponentService.update({}, $scope.component, function(res) {
        $scope.gridOptions.data = $scope.gridOptions.data.map(function(component) {
          // Replace the component in the grid with the updated component
          if (component.id === res.component.id) {
            return res.component;
          } else {
            return component;
          }
        });

        // Make sure that the row remains selected
        $timeout(function() {
          $scope.gridApi.selection.selectRow(res.component);
          $scope.recordingWeight = false;
        });
      }, function(err) {
        $log.error(err);
        $scope.recordingWeight = false;
      });
    };

    $scope.getComponentsByDIN = function() {
      if (forms.findComponentsForm.$invalid) {
        return;
      }
      $scope.componentsSearch.search = true;
      $location.search($scope.componentsSearch);
      $scope.searching = true;
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(componentsResponse) {
        if (componentsResponse !== false) {
          $scope.gridOptions.data = componentsResponse.components;
          $scope.searching = false;
        } else {
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
        field: 'expiryStatus',
        width: '**'
      },
      {
        name: 'Weight',
        field: 'weight',
        width: '**'
      }
    ];

    $scope.gridOptions = {
      data: null,
      columnDefs: columnDefs,
      multiSelect: false,
      enableRowSelection: true,
      paginationTemplate: 'views/template/pagination.html',
      paginationPageSize: 6,
      minRowsToShow: 5,

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function() {
          var selectedRows = gridApi.selection.getSelectedRows();
          // Clear the component if no row is selected
          if (selectedRows.length === 0) {
            $scope.component = null;
          } else {
            $scope.component = selectedRows[0];
          }
        });
      }
    };
  });
