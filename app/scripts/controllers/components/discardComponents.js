angular.module('bsis')
  .controller('DiscardComponentsCtrl', function($scope, $location, ComponentService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout, $routeParams, uiGridConstants, $log) {

    var selectedComponents = [];
    var forms = $scope.forms = {};
    $scope.selectedAction = null;
    $scope.componentsSearch = {
      donationIdentificationNumber: $routeParams.donationIdentificationNumber || ''
    };
    $scope.discardingComponent = false;
    $scope.discard = {};

    $scope.clearFindComponentsForm = function() {
      $scope.componentsSearch.donationIdentificationNumber = '';
      selectedComponents = [];
      $scope.gridOptions.data = null;
      $scope.selectedAction = null;
      $location.search({});
      forms.findComponentsForm.$setPristine();
      $scope.discard = {};
    };

    $scope.discardComponents = function() {

      if (forms.discardComponentsForm.$invalid) {
        return;
      }

      // Create a list of component ids to discard
      $scope.discard.componentIds = [];
      angular.forEach(selectedComponents, function(component) {
        $scope.discard.componentIds.push(component.id);
      });
      $scope.discardingComponent = true;

      // Discard components
      ComponentService.bulkDiscard({}, $scope.discard, function() {
        $scope.gridApi.selection.clearSelectedRows();
        $scope.discardingComponent = false;
        $scope.discard = {};
        $scope.gridOptions.data = $scope.getComponentsByDIN();
      }, function(err) {
        $log.error(err);
        $scope.discardingComponent = false;
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
      multiSelect: true,
      enableRowSelection: true,
      paginationTemplate: 'views/template/pagination.html',
      paginationPageSize: 5,
      minRowsToShow: 5,

      isRowSelectable: function(row) {
        var selectable = true;
        if ($scope.selectedAction === 'DISCARD') {
          if (!row.entity.permissions.canDiscard) {
            selectable = false;
          }
        }

        if ($scope.selectedAction === 'UNDISCARD') {
          if (!row.entity.permissions.canUndiscard) {
            selectable = false;
          }
        }

        if ($scope.selectedAction === 'NONE') {
          if (row.entity.permissions.canDiscard || row.entity.permissions.canUndiscard) {
            selectable = false;
          }
        }

        return selectable;
      },

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function() {
          selectedComponents = gridApi.selection.getSelectedRows();
          // If no row is selected selectedAction = null
          if (selectedComponents.length === 0) {
            $scope.selectedAction = null;
          } else if (selectedComponents.length === 1) {
            // When the first row is selected, assign value selectedAction
            var firstSelectedComponent = angular.copy(selectedComponents[0]);
            if (firstSelectedComponent.permissions.canDiscard) {
              $scope.selectedAction = 'DISCARD';
            } else if (firstSelectedComponent.permissions.canUndiscard) {
              $scope.selectedAction = 'UNDISCARD';
            } else {
              $scope.selectedAction = 'NONE';
            }
          }
          // Notify the row selection so that isRowSelectable is called
          $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        });
      }
    };

    function init() {
      if ($routeParams.search) {
        $scope.getComponentsByDIN();
      }
      ComponentService.getComponentsFormFields(function(response) {
        if (response !== false) {
          $scope.discardReasons = response.discardReasons;
        }
      });
    }

    init();
  });