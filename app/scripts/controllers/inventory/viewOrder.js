'use strict';

angular.module('bsis').controller('ViewOrderCtrl', function($scope, $location, $log, $filter, $routeParams, OrderFormsService) {

  $scope.displayConfirmDispatch = false;

  var unitsOrderedColumnDefs = [
    {
      name: 'Component Type',
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'Blood Group',
      field: 'bloodGroup',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Ordered',
      field: 'numberOfUnits',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Supplied',
      field: 'numberSupplied',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Gap',
      field: 'gap',
      width: '**',
      maxWidth: '200'
    }
  ];

  var unitsSuppliedColumnDefs = [
    {
      name: 'donationIdentificationNumber',
      displayName: 'DIN',
      field: 'donationIdentificationNumber',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Component Type',
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'bloodGroup',
      displayName: 'Blood Group',
      field: 'bloodGroup',
      width: '**',
      maxWidth: '200'
    }
  ];

  $scope.unitsOrderedGridOptions = {
    data: [],
    columnDefs: unitsOrderedColumnDefs,
    minRowsToShow: 7,

    onRegisterApi: function(gridApi) {
      $scope.unitsOrderedGridApi = gridApi;
    }
  };

  $scope.unitsSuppliedGridOptions = {
    data: [],
    columnDefs: unitsSuppliedColumnDefs,
    minRowsToShow: 7,

    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 400,

    // PDF header
    exporterPdfHeader: function() {
      var finalArray = [
        {
          text: 'Dispatch Note',
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
          text: 'Order Date: ',
          bold: true
        }, {
          text: $filter('bsisDate')($scope.orderForm.orderDate)
        }, {
          text: ' Dispatch From: ',
          bold: true
        }, {
          text: $scope.orderForm.dispatchedFrom.name
        }, {
          text: ' Dispatched To: ',
          bold: true
        }, {
          text: $scope.orderForm.dispatchedTo.name
        }, {
          text: ' Order Type: ',
          bold: true
        }, {
          text: $scope.orderForm.type + '\n'
        }
      );

      docDefinition.content = [{text: prefix, margin: [-10, 0, 0, 0], fontSize: 7}].concat(docDefinition.content);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      var columns = [
        {text: 'Number of components: ' + $scope.unitsSuppliedGridOptions.data.length, width: 'auto'},
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
      $scope.unitsSuppliedGridApi = gridApi;
    }
  };

  function populateUnitsOrderedGrid(orderForm) {
    $scope.unitsOrderedGridOptions.data = [];
    var componentsToMatch = angular.copy(orderForm.components);
    angular.forEach(orderForm.items, function(item) {
      var row = {
        componentTypeName: item.componentType.componentTypeName,
        bloodGroup: item.bloodGroup,
        numberOfUnits: item.numberOfUnits,
        numberSupplied: 0,
        gap: item.numberOfUnits
      };
      var unmatchedComponents = [];
      angular.forEach(componentsToMatch, function(component) {
        var bloodGroup = component.bloodAbo + component.bloodRh;
        if (row.gap > 0 && component.componentType.id === item.componentType.id && bloodGroup === item.bloodGroup) {
          // can't over supply and component matches
          row.numberSupplied = row.numberSupplied + 1;
          row.gap = row.gap - 1;
        } else {
          unmatchedComponents.push(component);
        }
      });
      componentsToMatch = unmatchedComponents; // ensure we don't match the component more than once
      $scope.unitsOrderedGridOptions.data.push(row);
    });
  }

  function populateUnitsSuppliedGrid(orderForm) {
    $scope.unitsSuppliedGridOptions.data = [];
    angular.forEach(orderForm.components, function(component) {
      var row = {
        donationIdentificationNumber: component.donationIdentificationNumber,
        componentTypeName: component.componentType.componentTypeName,
        bloodGroup: component.bloodAbo + component.bloodRh
      };
      $scope.unitsSuppliedGridOptions.data.push(row);
    });
  }

  function init() {
    // Fetch the order form by its id
    OrderFormsService.getOrderForm({id: $routeParams.id}, function(res) {
      $scope.orderForm = res.orderForm;
      populateUnitsOrderedGrid($scope.orderForm);
      populateUnitsSuppliedGrid($scope.orderForm);
    }, $log.error);
  }

  $scope.exportDispatchNote = function() {
    $scope.unitsSuppliedGridApi.exporter.pdfExport('all', 'all');
  };

  $scope.confirmDispatch = function(condition) {
    $scope.displayConfirmDispatch = condition;
  };

  $scope.dispatch = function() {
    $scope.orderForm.status = 'DISPATCHED';
    OrderFormsService.updateOrderForm({}, $scope.orderForm, function(res) {
      $scope.orderForm = res.orderForm;
      populateUnitsOrderedGrid($scope.orderForm);
      populateUnitsSuppliedGrid($scope.orderForm);
      $scope.displayConfirmDispatch = false;
    }, function(err) {
      $log.error(err);
    });
  };

  $scope.edit = function() {
    $location.path('/fulfilOrder/' + $routeParams.id);
  };

  init();

});
