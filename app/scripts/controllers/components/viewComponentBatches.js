'use strict';

angular.module('bsis').controller('ViewComponentBatchesCtrl', function($scope, $filter, $location, ComponentBatchService, $log) {

  var master = {
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate()
  };

  $scope.findComponentBatches = function() {
    if ($scope.findComponentBatchesForm.$invalid) {
      return;
    }
    $scope.searching = true;
    $scope.submitted = true;
    ComponentBatchService.findComponentBatches($scope.period, function(response) {
      $scope.gridOptions.data = response.componentBatches;
      $scope.searching = false;
    }, function(err) {
      $scope.searching = false;
      $log.log(err);
    });
  };

  $scope.init = function() {
    $scope.period = angular.copy(master);
    $scope.gridOptions.data = [];
    $scope.submitted = false;
  };

  var columnDefs = [
    {
      name: 'Collection Date',
      field: 'collectionDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '250'
    },
    {
      name: 'Processing Site',
      field: 'location.name',
      width: '**',
      maxWidth: '350'
    },
    {
      name: 'Num Components',
      field: 'numberOfComponents',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Donation Batch Status',
      field: 'donationBatch.status',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Delivery Date',
      field: 'deliveryDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '250'
    },
    {
      name: 'Num Boxes',
      field: 'numberOfBoxes',
      width: '**'
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

    exporterFieldCallback: function(grid, row, col, value) {
      if (col.field === 'collectionDate' || col.field === 'deliveryDate') {
        return $filter('bsisDate')(value);
      }
      return value;
    },

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

  $scope.init();

});
