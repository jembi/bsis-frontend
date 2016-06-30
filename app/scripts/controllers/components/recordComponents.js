'use strict';

angular.module('bsis')
  .controller('RecordComponentsCtrl', function($scope, $rootScope, $location, $log, $timeout, $q, $uibModal, ComponentService) {

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

    function showConfirmation(confirmationFields) {
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function() {
            return confirmationFields;
          }
        }
      });
      return modalInstance.result;
    }

    function showComponentWeightConfirmation(component) {

      // Show confirmation if it is above max weight
      if (component.weight > component.packType.maxWeight) {
        return showConfirmation({
          title: 'Overweight Pack',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is above the maximum acceptable range (' + component.packType.maxWeight + 'g). Components from this donation will be flagged as unsafe. Do you want to continue?'
        });
      }

      // Show confirmation if it is below min weight
      if (component.weight < component.packType.minWeight) {
        return showConfirmation({
          title: 'Underweight Pack',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is below the minimum acceptable range (' + component.packType.minWeight + 'g). Components from this donation will be flagged as unsafe. Do you want to continue?'
        });
      }

      // Show confirmation if it is below low volume weight
      if (component.weight <= component.packType.lowVolumeWeight) {
        return showConfirmation({
          title: 'Low Pack Weight',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is low (below ' + component.packType.lowVolumeWeight + 'g). It is recommended that all components from this donation are discarded, with the exception of Packed Red Cells. Do you want to continue?'
        });
      }

      // Weight is within valid range
      return $q.resolve();
    }

    $scope.recordWeightForSelectedComponent = function() {

      if (forms.recordWeightForm.$invalid) {
        return;
      }

      $scope.recordingWeight = true;

      showComponentWeightConfirmation($scope.component).then(function() {

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
      }).catch(function() {
        // Confirmation was rejected
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
        width: '120'
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
            $scope.component = angular.copy(selectedRows[0]);
          }
        });
      }
    };
  });
