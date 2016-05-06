'use strict';

angular.module('bsis').controller('ViewComponentBatchesCtrl', function($scope, $filter, $location) {

  // View componentBatch variables and methods

  var data = [
    {
      id: 1,
      collectionDate: new Date(),
      location: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numComponents: 12,
      numBoxes: 3,
      deliveryDate: new Date()
    },
    {
      id: 2,
      collectionDate: new Date(),
      location: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numComponents: 12,
      numBoxes: 3,
      deliveryDate: new Date()
    },
    {
      id: 3,
      collectionDate: new Date(),
      location: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numComponents: 12,
      numBoxes: 3,
      deliveryDate: new Date()
    }
  ];

  function getComponentBatches() {
    $scope.gridOptions.data = data;
  }

  var columnDefs = [
    {
      name: 'Collection Date',
      field: 'collectionDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Processing Site',
      field: 'location.name',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Num Components',
      field: 'numComponents',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Donation Batch Status',
      field: 'donationBatchStatus',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Delivery Date',
      field: 'deliveryDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Num Boxes',
      field: 'numBoxes',
      width: '**',
      maxWidth: '200'
    }
  ];

  $scope.onRowClick = function(row) {
    $location.path('/viewComponentBatch/' + row.entity.id);
  };

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    rowTemplate: 'views/template/clickablerow.html',
    columnDefs: columnDefs,

    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 400,

    // PDF header
    exporterPdfHeader: function() {
      var finalArray = [
        {
          text: 'Component Delivery Forms',
          fontSize: 10,
          bold: true,
          margin: [30, 20, 0, 0] // [left, top, right, bottom]
        },
        {
          text: 'Created On: ' + $filter('bsisDate')(new Date()),
          fontSize: 6,
          margin: [300, -10, 0, 0]
        }
      ];
      return finalArray;
    },

    exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},


    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      var columns = [
        {text: 'Number of forms: ' + $scope.gridOptions.data.length, width: 'auto'},
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
    enableFiltering: false,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;

    }
  };

  $scope.export = function(format) {
    if (format === 'pdf') {
      $scope.gridApi.exporter.pdfExport('all', 'all');
    } else if (format === 'csv') {
      $scope.gridApi.exporter.csvExport('all', 'all');
    }
  };

  getComponentBatches();
});
