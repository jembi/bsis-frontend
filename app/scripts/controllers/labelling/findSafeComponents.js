'use strict';

angular.module('bsis').controller('FindSafeComponentsCtrl', function($scope, $log, $filter, LabellingService, UtilsService) {
  var data = [{}];
  $scope.data = data;
  var searchMaster = {
    donationIdentificationNumber: null,
    componentCode: null,
    locationId: null,
    distributionSites: [],
    bloodGroups: [],
    componentTypes: [],
    allSites: true,
    anyBloodGroup: true,
    inventoryStatus: null,
    dateFrom: moment().subtract(28, 'days').startOf('day').toDate(),
    dateTo: moment().endOf('day').toDate()
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
      name: 'Date Collected',
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
      name: 'Inventory status',
      field: 'status',
      width: '150',
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

  $scope.searchParams = {};
  $scope.submitted = false;
  $scope.searching = false;
  $scope.componentTypes = [];
  $scope.distributionSites = [];
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
          text: 'Safe components',
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
    $scope.searchParams = angular.copy(searchMaster);
    $scope.submitted = false;
    $scope.searching = false;
    LabellingService.getComponentForm({}, function(response) {
      $scope.componentTypes = response.componentTypes;
      $scope.distributionSites = response.distributionSites;
      $scope.bloodGroups = response.bloodGroups;
    }, $log.error);
  }

  $scope.findSafeComponents = function(findSafeComponentsForm) {
    if (findSafeComponentsForm.$invalid) {
      return;
    }
    $scope.submitted = true;
    $scope.searching = true;
    LabellingService.search($scope.searchParams, function(response) {
      $scope.gridOptions.paginationCurrentPage = 1;
      $scope.gridOptions.data = response.components.sort(initialSort);
      $scope.searching = false;
    }, function(err) {
      $scope.gridOptions.data = [];
      $log.error(err);
      $scope.searching = false;
    });
  };

  $scope.updateDinSearch = function() {
    var din = $scope.search.donationIdentificationNumber;
    if (din && din.length > 0) {
      $scope.dinSearch = true;
      $scope.searchParams.componentCode = null;
      $scope.searchParams.componentTypes = [];
      $scope.searchParams.bloodGroups = [];
      $scope.searchParams.locationId = null;
      $scope.searchParams.dateFrom = null;
      $scope.searchParams.dateTo = null;
      $scope.searchParams.allSites = true;
    } else {
      $scope.dinSearch = false;
      $scope.search.dateFrom = moment().subtract(28, 'days').startOf('day').toDate();
      $scope.search.dateTo = moment().endOf('day').toDate();
    }
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
    $scope.searchParams = angular.copy(searchMaster);
    $scope.submitted = false;
    $scope.searching = false;
    searchForm.$setPristine();
  };
  initialiseForm();
});