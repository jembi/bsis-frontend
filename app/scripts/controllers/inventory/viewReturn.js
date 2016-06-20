'use strict';

angular.module('bsis').controller('ViewReturnCtrl', function($scope, $location, $log, $filter, $routeParams, $uibModal, ReturnFormsService) {

  $scope.displayConfirmReturn = false;

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

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 10,

    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 400,

    exporterFieldCallback: function(grid, row, col, value) {
      if (col.field === 'createdOn') {
        return $filter('bsisDate')(value);
      }
      return value;
    },

    // PDF header
    exporterPdfHeader: function() {
      var finalArray = [
        {
          text: 'Return Note',
          fontSize: 10,
          bold: true,
          margin: [30, 20, 0, 0] // [left, top, right, bottom]
        }
      ];
      return finalArray;
    },

    exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},

    exporterPdfCustomFormatter: function(docDefinition) {
      var prefix = [];
      prefix.push(
        {
          text: 'Return Date: ',
          bold: true
        }, {
          text: $filter('bsisDate')($scope.returnForm.returnDate)
        }, {
          text: ' Return From: ',
          bold: true
        }, {
          text: $scope.returnForm.returnedFrom.name
        }, {
          text: ' Returned To: ',
          bold: true
        }, {
          text: $scope.returnForm.returnedTo.name
        }
      );

      docDefinition.content = [{text: prefix, margin: [-10, 0, 0, 0], fontSize: 7}].concat(docDefinition.content);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      var columns = [
        {text: 'Number of components: ' + $scope.gridOptions.data.length, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0],
        fontSize: 6
      };
    },

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

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
    // Fetch the return form by its id
    ReturnFormsService.getReturnForm({id: $routeParams.id}, function(res) {
      $scope.returnForm = res.returnForm;
      populateGrid($scope.returnForm);
    }, $log.error);
  }

  function showDiscardModal() {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'views/inventory/discardComponentsModal.html',
      controller: 'DiscardComponentsModalCtrl',
      resolve: {
        returnFormId: function() {
          return $routeParams.id;
        },
        componentIds: function() {
          var componentIds = [];
          angular.forEach($scope.returnForm.components, function(component) {
            componentIds.push(component.id);
          });
          return componentIds;
        }
      }
    });

    modalInstance.result.then(function() {
      // Refresh data if components were discarded
      init();
    }, function() {
      // Ignore if modal was dismissed
    });
  }

  $scope.exportReturnNote = function() {
    $scope.gridApi.exporter.pdfExport('all', 'all');
  };

  $scope.discardStock = function() {
    showDiscardModal();
  };

  $scope.confirmReturn = function(condition) {
    $scope.displayConfirmReturn = condition;
  };

  $scope.return = function() {
    $scope.returnForm.status = 'RETURNED';
    ReturnFormsService.updateReturnForm({}, $scope.returnForm, function(res) {
      $scope.returnForm = res.returnForm;
      populateGrid($scope.returnForm);
      $scope.displayConfirmReturn = false;
    }, function(err) {
      $log.error(err);
    });
  };

  $scope.edit = function() {
    $location.path('/recordReturn/' + $routeParams.id);
  };

  init();

});
