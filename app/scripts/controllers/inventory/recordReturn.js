'use strict';

angular.module('bsis').controller('RecordReturnCtrl', function($scope, $location, $uibModal, $log, $routeParams, ReturnFormsService, ComponentService) {

  var componentMaster = {
    din: null,
    componentCode: null
  };

  var columnDefs = [
    {
      name: 'donationIdentificationNumber',
      field: 'donationIdentificationNumber',
      displayName: 'DIN',
      width: '**',
      maxWidth: '100'
    },
    {
      name: 'componentCode',
      field: 'componentCode',
      displayName: 'Component Code',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'componentTypeName',
      field: 'componentTypeName',
      displayName: 'Component Type',
      width: '**',
      minWidth: '200'
    },
    {
      name: 'bloodGroup',
      field: 'bloodGroup',
      displayName: 'Blood Group',
      width: '**',
      maxWidth: '125'
    },
    {
      name: 'status',
      field: 'status',
      displayName: 'Status',
      width: '**',
      maxWidth: '150'
    },
    {
      name: 'createdOn',
      field: 'createdOn',
      displayName: 'Created On',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '100'
    },
    {
      name: 'expiryStatus',
      field: 'expiryStatus',
      displayName: 'Expiry Status',
      width: '**',
      maxWidth: '150'
    }
  ];

  function convertItem(component) {
    return {
      donationIdentificationNumber: component.donationIdentificationNumber,
      componentCode: component.componentCode,
      componentTypeName: component.componentType.componentTypeName,
      bloodGroup: component.bloodAbo + component.bloodRh,
      status: component.status,
      createdOn: component.createdOn,
      expiryStatus: component.expiryStatus
    };
  }

  function populateGrid(returnForm) {
    $scope.gridOptions.data = [];
    angular.forEach(returnForm.components, function(component) {
      $scope.gridOptions.data.push(convertItem(component));
    });
  }

  function init() {
    $scope.component = angular.copy(componentMaster);
    $scope.addingComponent = false;
    // Fetch the return form by its id
    ReturnFormsService.getReturnForm({id: $routeParams.id}, function(response) {
      $scope.returnForm = response.returnForm;
      populateGrid($scope.returnForm);
    }, $log.error);
  }

  function showErrorMessage(errorMessage) {
    $uibModal.open({
      animation: false,
      templateUrl: 'views/errorModal.html',
      controller: 'ErrorModalCtrl',
      resolve: {
        errorObject: function() {
          return {
            title: 'Invalid Component',
            button: 'OK',
            errorMessage: errorMessage
          };
        }
      }
    });
  }

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 10,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.returnForm = null;
  $scope.component = null;
  $scope.addingComponent = false;

  $scope.addComponent = function() {
    if ($scope.addComponentForm.$invalid) {
      return;
    }
    $scope.addingComponent = true;

    var searchParams = {
      donationIdentificationNumber: $scope.component.din,
      componentCode: $scope.component.componentCode
    };
    ComponentService.findComponent(searchParams, function(component) {
      if (component.status !== 'ISSUED') {
        // check if component status is ISSUED
        showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
            ') has not been issued.');
      } else {
        // check if component has already been added
        var componentAlreadyAdded = $scope.returnForm.components.some(function(e) {
          return e.id === component.id;
        });
        if (componentAlreadyAdded) {
          showErrorMessage('Component ' + $scope.component.din + ' (' + $scope.component.componentCode +
            ') has already been added to this Return Form.');
        } else {
          // add component to Return Form and reset the form
          $scope.returnForm.components.push(component);
          populateGrid($scope.returnForm);
          $scope.component = angular.copy(componentMaster);
          $scope.addComponentForm.$setPristine();
        }
      }
      $scope.addingComponent = false;
    }, function(err) {
      if (err.errorCode === 'NOT_FOUND') {
        showErrorMessage('Component with DIN ' + $scope.component.din + ' and ComponentCode ' + $scope.component.componentCode + ' not found.');
      } else {
        $log.error(err);
      }
      $scope.addingComponent = false;
    });
  };

  $scope.updateReturn = function() {
    $scope.savingForm = true;
    ReturnFormsService.updateReturnForm({}, $scope.returnForm, function(response) {
      $scope.returnForm = response.returnForm;
      populateGrid($scope.returnForm);
      $scope.savingForm = false;
      //$location.path('/viewReturn/' + $routeParams.id);
    }, function(err) {
      $log.error(err);
      $scope.savingForm = false;
    });
  };

  $scope.clearAddComponent = function(form) {
    $scope.component = angular.copy(componentMaster);
    form.$setPristine();
  };

  $scope.cancel = function() {
    //$location.path('/viewReturn/' + $routeParams.id);
  };

  init();

});