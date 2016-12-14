'use strict';

angular.module('bsis')
  .controller('RecordComponentsCtrl', function($scope, $location, $log, $timeout, $q, $routeParams, ComponentService, ModalsService, UtilsService, $uibModal) {

    $scope.component = null;
    $scope.componentsSearch = {
      donationIdentificationNumber: $routeParams.donationIdentificationNumber || ''
    };
    $scope.preProcessing = false;
    $scope.unprocessing = false;
    $scope.sameTimeEnterd = false;
    var forms = $scope.forms = {};

    $scope.clear = function() {
      $scope.componentsSearch.donationIdentificationNumber = '';
      $location.search({});
      $scope.gridOptions.data = null;
      angular.forEach(forms, function(form) {
        if (form) {
          form.$setPristine();
        }
      });
    };

    $scope.clearComponentTypeCombination = function() {
      if ($scope.component) {
        $scope.component.componentTypeCombination = null;
      }
      if (forms.recordComponentsForm) {
        forms.recordComponentsForm.$setPristine();
      }
    };

    $scope.clearWeight = function() {
      if ($scope.component) {
        $scope.component.weight = null;
      }
      if (forms.preProcessForm) {
        forms.preProcessForm.$setPristine();
      }
    };

    var recordComponents = function() {

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

    function showComponentWeightConfirmation(component) {

      // Show confirmation if it is above max weight
      if (component.packType.maxWeight != null && component.weight > component.packType.maxWeight) {
        return ModalsService.showConfirmation({
          title: 'Overweight Pack',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is above the maximum acceptable range (' + component.packType.maxWeight + 'g). Components from this donation will be flagged as unsafe. Do you want to continue?'
        });
      }

      // Show confirmation if it is below min weight
      if (component.packType.minWeight != null && component.weight < component.packType.minWeight) {
        return ModalsService.showConfirmation({
          title: 'Underweight Pack',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is below the minimum acceptable range (' + component.packType.minWeight + 'g). Components from this donation will be flagged as unsafe. Do you want to continue?'
        });
      }

      // Show confirmation if it is below low volume weight
      if (component.packType.lowVolumeWeight != null && component.weight <= component.packType.lowVolumeWeight) {
        return ModalsService.showConfirmation({
          title: 'Low Pack Weight',
          button: 'Continue',
          message: 'The pack weight (' + component.weight + 'g) is low (below ' + component.packType.lowVolumeWeight + 'g). It is recommended that all components from this donation are discarded, with the exception of Packed Red Cells. Do you want to continue?'
        });
      }

      // Weight is within valid range

      // Show confirmation if previous weight was not within valid range
      if (component.packType.maxWeight != null && component.packType.minWeight != null) {
        var previousComponent = $scope.gridApi.selection.getSelectedRows()[0];
        if (previousComponent.weight != null && (previousComponent.weight > component.packType.maxWeight
              || previousComponent.weight < component.packType.minWeight)) {
          return ModalsService.showConfirmation({
            title: 'Pack Weight Update',
            button: 'Continue',
            message: 'The pack weight has changed from an underweight or overweight value to one within the acceptable range. Components from this donation will no longer be flagged as unsafe as a result of the pack weight. Do you want to continue?'
          });
        }
      }

      // Continue with recording weight
      return $q.resolve();
    }

    $scope.preProcessSelectedComponent = function() {

      if (forms.preProcessForm.$invalid) {
        return;
      }

      $scope.preProcessing = true;
      if ($scope.component.bleedStartTime === $scope.component.bleedEndTime) {
        $scope.sameTimeEnterd = true;
        $scope.preProcessing = false;
        return;
      }

      showComponentWeightConfirmation($scope.component).then(function() {

        ComponentService.preProcess({}, $scope.component, function(res) {
          $scope.gridOptions.data = $scope.gridOptions.data.map(function(component) {
            // Replace the component in the grid with the updated component
            if (component.id === res.component.id) {
              return res.component;
            } else {
              return component;
            }
          });

          // Clear validation on the record components form
          if (forms.recordComponentsForm) {
            forms.recordComponentsForm.$setPristine();
          }

          // Make sure that the row remains selected
          $timeout(function() {
            $scope.gridApi.selection.selectRow(res.component);
            $scope.preProcessing = false;
          });
        }, function(err) {
          $log.error(err);
          $scope.preProcessing = false;
        });
      }).catch(function() {
        // Confirmation was rejected
        $scope.preProcessing = false;
      });
    };

    $scope.unprocessSelectedComponent = function() {
      var unprocessConfirmation = {
        title: 'Unprocess Component',
        button: 'Continue',
        message: 'Unprocessing this component will cause all components that were produced from it to be deleted. Do you want to continue?'
      };

      $scope.unprocessing = true;
      ModalsService.showConfirmation(unprocessConfirmation).then(function() {
        ComponentService.unprocess({}, $scope.component, function() {
          $scope.getComponentsByDIN();
          $scope.unprocessing = false;
        }, function(err) {
          $log.error(err);
          $scope.unprocessing = false;
        });
      }).catch(function() {
        // Confirmation was rejected
        $scope.unprocessing = false;
      });
    };

    $scope.getComponentsByDIN = function() {
      if (forms.findComponentsForm && forms.findComponentsForm.$invalid) {
        return;
      }
      $scope.componentsSearch.search = true;
      $location.search($scope.componentsSearch);
      $scope.searching = true;
      ComponentService.getComponentsByDIN($scope.componentsSearch.donationIdentificationNumber, function(componentsResponse) {
        if (componentsResponse !== false) {
          $scope.gridOptions.data = componentsResponse.components;
          $scope.component = null;
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
        maxWidth: '150'
      },
      {
        name: 'Component Type',
        field: 'componentType.componentTypeName',
        width: '**',
        minWidth: '250'
      },
      {
        name: 'Status',
        field: 'status',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Created On',
        field: 'createdOn',
        cellFilter: 'bsisDate',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Expiry Status',
        field: 'expiryStatus',
        width: '**',
        maxWidth: '250',
        sortingAlgorithm: function(a, b, rowA, rowB) {
          return UtilsService.dateSort(rowA.entity.expiresOn, rowB.entity.expiresOn);
        }
      },
      {
        name: 'Weight',
        field: 'weight',
        width: '**',
        maxWidth: '120'
      }
    ];

    $scope.gridOptions = {
      data: null,
      columnDefs: columnDefs,
      multiSelect: false,
      enableRowSelection: true,
      paginationTemplate: 'views/template/pagination.html',
      paginationPageSize: 5,
      minRowsToShow: 5,
      enableSelectAll: false,

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

    $scope.confirmProcessLabledComponent = function() {
      if ($scope.component.inventoryStatus === 'IN_STOCK') {
        var messageText = '';
        messageText += 'The selected component has already been labelled. Do you want to continue?';
        var saveObject = {
          title: 'Process labelled component',
          button: 'Continue',
          message: messageText
        };
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/confirmModal.html',
          controller: 'ConfirmModalCtrl',
          resolve: {
            confirmObject: function() {
              return saveObject;
            }
          }
        });
        modalInstance.result.then(function() {
          // Then record components
          recordComponents();
        }, function() {
          // record cancelled - do nothing
        });
      } else {
        recordComponents();
      }
    };

    function init() {
      if ($routeParams.search) {
        $scope.getComponentsByDIN();
      }
    }

    init();
  });
