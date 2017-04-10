'use strict';

angular.module('bsis').controller('ViewOrderCtrl', function ($scope, $location, $log, $filter, $routeParams, OrderFormsService, ModalsService, DATEFORMAT, gettextCatalog) {

  $scope.dateFormat = DATEFORMAT;

  var componentTypeTitle = gettextCatalog.getString('Component Type');
  var bloodGroupTitle = gettextCatalog.getString('Blood Group');
  var unitsOrderedTitle = gettextCatalog.getString('Units Ordered');
  var unitsSuppliedTitle = gettextCatalog.getString('Units Supplied');
  var gapTitle = gettextCatalog.getString('Gap');

  var unitsOrderedColumnDefs = [
    {
      name: 'Component Type',
      displayName: componentTypeTitle,
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'Blood Group',
      displayName: bloodGroupTitle,
      field: 'bloodGroup',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Ordered',
      displayName: unitsOrderedTitle,
      field: 'numberOfUnits',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Units Supplied',
      displayName: unitsSuppliedTitle,
      field: 'numberSupplied',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Gap',
      displayName: gapTitle,
      field: 'gap',
      width: '**',
      maxWidth: '200'
    }
  ];

  var dinTitle = gettextCatalog.getString('DIN');

  var unitsSuppliedColumnDefs = [
    {
      name: 'donationIdentificationNumber',
      displayName: dinTitle,
      field: 'donationIdentificationNumber',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Component Type',
      displayName: componentTypeTitle,
      field: 'componentTypeName',
      width: '**'
    },
    {
      name: 'bloodGroup',
      displayName: bloodGroupTitle,
      displayName: 'Blood Group',
      field: 'bloodGroup',
      width: '**',
      maxWidth: '200'
    }
  ];

  $scope.unitsOrderedGridOptions = {
    data: [],
    columnDefs: unitsOrderedColumnDefs,
    paginationPageSize: 4,
    paginationPageSizes: [4],
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 4,

    onRegisterApi: function (gridApi) {
      $scope.unitsOrderedGridApi = gridApi;
    }
  };

  $scope.unitsSuppliedGridOptions = {
    data: [],
    columnDefs: unitsSuppliedColumnDefs,
    paginationPageSize: 4,
    paginationPageSizes: [4],
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 4,

    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: { fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: { fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 400,

    // PDF header
    exporterPdfHeader: function () {
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

    exporterPdfTableStyle: { margin: [-10, 10, 0, 0] },

    exporterPdfCustomFormatter: function (docDefinition) {
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
          text: $filter('titleCase')($scope.orderForm.type) + '\n'
        }
      );
      if ($scope.orderForm.type === 'PATIENT_REQUEST') {
        prefix.push(
          {
            text: ' Blood Bank No: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.hospitalBloodBankNumber) ? 'Not Specified' : $scope.orderForm.patient.hospitalBloodBankNumber
          }, {
            text: ' Ward No: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.hospitalWardNumber) ? 'Not Specified' : $scope.orderForm.patient.hospitalWardNumber
          }, {
            text: ' Patient Number: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.patientNumber) ? 'Not Specified' : $scope.orderForm.patient.patientNumber
          }, {
            text: ' Patient Name: ',
            bold: true
          }, {
            text: $scope.orderForm.patient.name1 + ' ' + $scope.orderForm.patient.name2 + '\n'
          }, {
            text: ' Blood Group: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.bloodGroup) ? 'Not Specified' : $scope.orderForm.patient.bloodGroup
          }, {
            text: ' Gender: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.gender) ? 'Not Specified' : $scope.orderForm.patient.gender
          }, {
            text: ' Date of Birth: ',
            bold: true
          }, {
            text: $scope.isFieldEmpty($scope.orderForm.patient.dateOfBirth) ? 'Not Specified' : $filter('bsisDate')($scope.orderForm.patient.dateOfBirth)
          }
        );
      }

      docDefinition.content = [{ text: prefix, margin: [-10, 0, 0, 0], fontSize: 7 }].concat(docDefinition.content);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function (currentPage, pageCount) {
      var columns = [
        { text: 'Number of components: ' + $scope.unitsSuppliedGridOptions.data.length, width: 'auto' },
        { text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto' },
        { text: 'Page ' + currentPage + ' of ' + pageCount, style: { alignment: 'right' } }
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0],
        fontSize: 6
      };
    },

    onRegisterApi: function (gridApi) {
      $scope.unitsSuppliedGridApi = gridApi;
    }
  };

  function populateUnitsOrderedGrid(orderForm) {
    $scope.unitsOrderedGridOptions.data = [];
    var componentsToMatch = angular.copy(orderForm.components);
    angular.forEach(orderForm.items, function (item) {
      var row = {
        componentTypeName: item.componentType.componentTypeName,
        bloodGroup: item.bloodGroup,
        numberOfUnits: item.numberOfUnits,
        numberSupplied: 0,
        gap: item.numberOfUnits
      };
      var unmatchedComponents = [];
      angular.forEach(componentsToMatch, function (component) {
        var bloodGroup = component.bloodGroup;
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
    angular.forEach(orderForm.components, function (component) {
      var row = {
        donationIdentificationNumber: component.donationIdentificationNumber,
        componentTypeName: component.componentType.componentTypeName,
        bloodGroup: component.bloodGroup
      };
      $scope.unitsSuppliedGridOptions.data.push(row);
    });
  }

  function init() {
    // Fetch the order form by its id
    OrderFormsService.getOrderForm({ id: $routeParams.id }, function (res) {
      $scope.orderForm = res.orderForm;
      $scope.orderFormHasPatient = res.orderForm.patient !== null ? true : false;
      populateUnitsOrderedGrid($scope.orderForm);
      populateUnitsSuppliedGrid($scope.orderForm);
    }, $log.error);
  }

  $scope.exportDispatchNote = function () {
    $scope.unitsSuppliedGridApi.exporter.pdfExport('all', 'all');
  };

  $scope.deleteOrder = function () {
    var unprocessConfirmation = {
      title: 'Void Order',
      button: 'Void',
      message: 'Are you sure that you want to delete this Order?'
    };

    ModalsService.showConfirmation(unprocessConfirmation).then(function () {
      $scope.deleting = true;
      OrderFormsService.deleteOrderForm({ id: $routeParams.id }, function () {
        $location.path('/manageOrders');
      }, function (err) {
        $log.error(err);
        $scope.deleting = false;
      });
    }).catch(function () {
      // Confirmation was rejected
      $scope.deleting = false;
    });
  };

  $scope.dispatch = function () {
    var dispatchConfirmation = {
      title: 'Dispatch Order',
      button: 'Dispatch Order',
      message: 'Are you sure you want to dispatch the order?'
    };

    ModalsService.showConfirmation(dispatchConfirmation).then(function () {
      $scope.orderForm.status = 'DISPATCHED';
      OrderFormsService.updateOrderForm({}, $scope.orderForm, function (res) {
        $scope.orderForm = res.orderForm;
        populateUnitsOrderedGrid($scope.orderForm);
        populateUnitsSuppliedGrid($scope.orderForm);
      }, function (err) {
        $log.error(err);
      });
    });
  };

  $scope.isFieldEmpty = function (field) {
    if (field) {
      return field.length === 0;
    }
    return true;
  };

  $scope.edit = function () {
    $location.path('/fulfilOrder/' + $routeParams.id);
  };

  init();

});
