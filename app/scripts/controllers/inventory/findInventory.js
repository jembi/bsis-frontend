'use strict';

angular.module('bsis')
  .controller('FindInventoryCtrl', function($scope, $filter, $log) {

    var master = {
      donationIdentificationNumber: null,
      allSites: true,
      distributionCenter: null,
      expireDate: null
    };

    var columnDefs = [
      {
        name: 'DIN',
        displayName: 'DIN',
        field: 'donationIdentificationNumber',
        width: '**',
        maxWidth: '150',
        sort: { direction: 'asc', priority: 0 }
      },
      {
        name: 'Component Code',
        field: 'componentCode',
        width: '**',
        maxWidth: '150',
        sort: { direction: 'asc' }
      },
      {
        name: 'Created On',
        field: 'createdOn',
        cellFilter: 'bsisDate',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Component Type',
        field: 'componentType.componentTypeName',
        width: '**'
      },
      {
        name: 'Expiry Status',
        field: 'expiryStatus',
        width: '**',
        maxWidth: '200'
      },
      {
        name: 'Location',
        field: 'location.name',
        width: '**',
        maxWidth: '350'
      }
    ];

    $scope.distributionCenters = [];
    $scope.componentTypes = [];

    $scope.searchParams = {};
    $scope.submitted = false;
    $scope.searching = false;

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,

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
            text: 'Inventory',
            fontSize: 10,
            bold: true,
            margin: [30, 20, 0, 0] // [left, top, right, bottom]
          }
        ];
        return finalArray;
      },

      exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},

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

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('visible', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    function initialiseForm() {
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      // FIXME: load distributionCenters and componentTypes
      $scope.distributionCenters = [
        {
          id: 1,
          name: 'distributionCenter #1'
        },
        {
          id: 2,
          name: 'distributionCenter #2'
        }
      ];
      $scope.componentTypes = [
        {
          id: 1,
          componentTypeName: 'Whole Blood Single Pack - CPDA',
          componentTypeCode: '0011'
        },
        {
          id: 2,
          componentTypeName: 'Whole Blood Double Pack - CPDA',
          componentTypeCode: '0012'
        }
      ];
    }

    $scope.findInventory = function(searchForm) {
      if (searchForm.$invalid) {
        return;
      }
      $scope.submitted = true;
      $scope.searching = true;
      $log.debug($scope.searchParams);
      // FIXME: call search endpoint
      $scope.gridOptions.data = [
        {
          donationIdentificationNumber: '1234567',
          componentCode: '0011-02',
          createdOn: new Date(),
          componentType: {
            id: 1,
            componentTypeName: 'Whole Blood Single Pack - CPDA',
            componentTypeCode: '0011'
          },
          expiryStatus: '3 days to expire',
          location: {
            id: 123,
            name: 'everythng happens here'
          }
        },
        {
          donationIdentificationNumber: '1234565',
          componentCode: '0011-01',
          createdOn: new Date(),
          componentType: {
            id: 1,
            componentTypeName: 'Whole Blood Single Pack - CPDA',
            componentTypeCode: '0011'
          },
          expiryStatus: '3 days to expire',
          location: {
            id: 123,
            name: 'everythng happens here'
          }
        },
        {
          donationIdentificationNumber: '1234567',
          componentCode: '0011-01',
          createdOn: new Date(),
          componentType: {
            id: 1,
            componentTypeName: 'Whole Blood Single Pack - CPDA',
            componentTypeCode: '0011'
          },
          expiryStatus: '3 days to expire',
          location: {
            id: 123,
            name: 'everythng happens here'
          }
        }
      ];
      $scope.searching = false;
    };

    $scope.updateAllSites = function() {
      if ($scope.searchParams.distributionCenter) {
        $scope.searchParams.allSites = false;
      } else {
        $scope.searchParams.allSites = true;
      }
    };

    $scope.clearDistributionCenter = function() {
      $scope.searchParams.distributionCenter = null;
    };

    $scope.clearSearch = function(searchForm) {
      $scope.gridOptions.data = [];
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      searchForm.$setPristine();
    };

    initialiseForm();
  });