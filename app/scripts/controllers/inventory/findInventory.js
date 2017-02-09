'use strict';

angular.module('bsis')
  .controller('FindInventoryCtrl', function($scope, $filter, $log, BLOODGROUP, InventoriesService, UtilsService, DATEFORMAT) {

    $scope.dateFormat = DATEFORMAT;

    var master = {
      donationIdentificationNumber: null,
      allSites: true,
      locationId: null,
      dueToExpireBy: null,
      bloodGroups: [],
      anyBloodGroup: true
    };

    var columnDefs = [
      {
        name: 'DIN',
        displayName: 'DIN',
        field: 'donationIdentificationNumber',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Component Code',
        field: 'componentCode',
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
        name: 'Component Type',
        field: 'componentType.componentTypeName',
        width: '**'
      },
      {
        name: 'Blood Group',
        field: 'bloodGroup',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Expiry Status',
        field: 'expiryStatus',
        width: '**',
        maxWidth: '200',
        sortingAlgorithm: function(a, b, rowA, rowB) {
          return UtilsService.dateSort(rowA.entity.expiresOn, rowB.entity.expiresOn);
        }
      },
      {
        name: 'Location',
        field: 'location.name',
        width: '**',
        maxWidth: '350'
      }
    ];

    function initialSort(a, b) {
      // 1: sort by componentType code
      if (a.componentType.componentTypeCode < b.componentType.componentTypeCode) {
        return -1;
      } else if (a.componentType.componentTypeCode > b.componentType.componentTypeCode) {
        return 1;
      } else {
        // 2: sort by DIN
        if (a.donationIdentificationNumber < b.donationIdentificationNumber) {
          return -1;
        } else if (a.donationIdentificationNumber > b.donationIdentificationNumber) {
          return 1;
        } else {
          // 3: sort by componentCode
          if (a.componentCode < b.componentCode) {
            return -1;
          } else if (a.componentCode > b.componentCode) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    }

    $scope.distributionCenters = [];
    $scope.componentTypes = [];
    $scope.bloodGroups = BLOODGROUP.options;

    $scope.searchParams = {};
    $scope.submitted = false;
    $scope.searching = false;

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 8,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      minRowsToShow: 8,
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
        $scope.gridApi.exporter.pdfExport('all', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    function initialiseForm() {
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      InventoriesService.getSearchForm(function(res) {
        $scope.distributionCenters = res.distributionSites;
        $scope.componentTypes = res.componentTypes;
      }, $log.error);
    }

    $scope.findInventory = function(searchForm) {
      if (searchForm.$invalid) {
        return;
      }
      $scope.submitted = true;
      $scope.searching = true;
      InventoriesService.search($scope.searchParams, function(res) {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.gridOptions.data = res.inventories.sort(initialSort);
        $scope.searching = false;
      }, function(err) {
        $scope.gridOptions.data = [];
        $log.error(err);
        $scope.searching = false;
      });
    };

    $scope.updateAllSites = function() {
      if ($scope.searchParams.locationId) {
        $scope.searchParams.allSites = false;
      } else {
        $scope.searchParams.allSites = true;
      }
    };

    $scope.clearLocationId = function() {
      $scope.searchParams.locationId = null;
    };

    $scope.updateAnyBloodGroup = function() {
      $scope.searchParams.anyBloodGroup = false;
    };

    $scope.clearBloodGroups = function() {
      if ($scope.searchParams.anyBloodGroup) {
        $scope.searchParams.bloodGroups = [];
      }
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