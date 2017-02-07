'use strict';

angular.module('bsis').controller('FindSafeComponentsCtrl', function($scope, $log, $filter, DATEFORMAT, LabellingService, UtilsService) {
  var searchMaster = {
    donationIdentificationNumber: null,
    componentCode: null,
    locationId: null,
    locations: [],
    bloodGroups: [],
    componentTypes: [],
    allSites: true,
    allComponentTypes: true,
    anyBloodGroup: true,
    inventoryStatus: 'NOT_IN_STOCK',
    startDate: moment().subtract(28, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate()
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
  // To be used in the hook up task
  /*function initialSort(a, b) {
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
  }*/

  $scope.dateFormat = DATEFORMAT;
  $scope.searchParams = {};
  $scope.submitted = false;
  $scope.searching = false;
  $scope.dinSearch = false;
  $scope.componentTypes = [];
  $scope.locations = [];
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

  // This is only mock ups, initialisation will be done in the hook up task
  var bloodGroups = ['O+', 'O-', 'A+', 'A-', 'AB-', 'AB+', 'B+', 'B-'];
  var locations = [{'id':2, 'name':'Cape town', 'isDeleted':false},
                           {'id':1, 'name':'Muizenburg', 'isDeleted':false},
                           {'id':3, 'name':'Paarl', 'isDeleted':false},
                           {'id':4, 'name':'Worcester', 'isDeleted':false}];
  var componentTypes = [{'id':1, 'componentTypeName':'Whole Blood Single Pack - CPDA', 'componentTypeCode':'0011', 'description': '', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':2, 'componentTypeName':'Whole Blood Double Pack - CPDA', 'componentTypeCode':'0012', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':3, 'componentTypeName':'Whole Blood Triple Pack - CPDA', 'componentTypeCode':'0013', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':4, 'componentTypeName':'Whole Blood Quad Pack - CPDA', 'componentTypeCode':'0014', 'description':'',  'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':5, 'componentTypeName':'Apheresis', 'componentTypeCode':'0021', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':6, 'componentTypeName':'Whole Blood - CPDA', 'componentTypeCode':'1001', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':7, 'componentTypeName':'Whole Blood Poor Platelets - CPDA', 'componentTypeCode':'1005', 'description':'', 'maxBleedTime':12, 'maxTimeSinceDonation':24},
                        {'id':8, 'componentTypeName':'Packed Red Cells - CPDA', 'componentTypeCode':'2001', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':10, 'componentTypeName':'Fresh Frozen Plasma - Whole Blood', 'componentTypeCode':'3001', 'description':'', 'maxBleedTime':15, 'maxTimeSinceDonation':24},
                        {'id':11, 'componentTypeName':'Frozen Plasma - Whole Blood', 'componentTypeCode':'3002', 'description':'', 'maxBleedTime':null, 'maxTimeSinceDonation':null},
                        {'id':12, 'componentTypeName':'Platelets Concentrate - Whole Blood', 'componentTypeCode':'4001', 'description':'', 'maxBleedTime':12, 'maxTimeSinceDonation':24},
                        {'id':13, 'componentTypeName':'Platelets Concentrate - Whole Blood - 24H', 'componentTypeCode':'4011', 'description':'', 'maxBleedTime':12, 'maxTimeSinceDonation':24},
                        {'id':16, 'componentTypeName':'Platelets Concentrate - Apheresis', 'componentTypeCode':'4021', 'description':'', 'maxBleedTime':12, 'maxTimeSinceDonation':24}];
  var mockResponse = {
    bloodGroups: bloodGroups,
    locations: locations,
    componentTypes: componentTypes
  };

  function initialiseForm() {
    $scope.searchParams = angular.copy(searchMaster);
    $scope.submitted = false;
    $scope.searching = false;
    $scope.bloodGroups = mockResponse.bloodGroups;
    $scope.locations = mockResponse.locations;
    $scope.componentTypes = mockResponse.componentTypes;
  }

  $scope.findSafeComponents = function(findSafeComponentsForm) {
    if (findSafeComponentsForm.$invalid) {
      return;
    }
    $scope.submitted = true;
    $scope.searching = true;
    $scope.gridOptions.paginationCurrentPage = 1;
   // $scope.gridOptions.data = mockResponse.sort(initialSort);
    $scope.searching = false;
  }, function(err) {
    $scope.gridOptions.data = [];
    $log.error(err);
    $scope.searching = false;
  };

  $scope.updateDinSearch = function() {
    var din = $scope.searchParams.donationIdentificationNumber;
    if (din && din.length > 0) {
      $scope.dinSearch = true;
      $scope.searchParams = angular.copy(searchMaster);
      $scope.searchParams.donationIdentificationNumber = din;
    } else {
      $scope.dinSearch = false;
    }
  };

  $scope.updateAllSites = function() {
    if ($scope.searchParams.locationId) {
      $scope.searchParams.allSites = false;
    }
  };

  $scope.clearLocationId = function() {
    $scope.searchParams.locationId = null;
  };

  $scope.updateAllComponentTypes = function() {
    if ($scope.searchParams.componentTypeId) {
      $scope.searchParams.allComponentTypes = false;
    }
  };

  $scope.clearComponentTypeId = function() {
    $scope.searchParams.componentTypeId = null;
  };

  $scope.updateAnyBloodGroup = function() {
    if ($scope.searchParams.bloodGroups && $scope.searchParams.bloodGroups.length !== 0) {
      $scope.searchParams.anyBloodGroup = false;
    } else {
      $scope.searchParams.anyBloodGroup = true;
    }
  };

  $scope.clearBloodGroups = function() {
    $scope.searchParams.bloodGroups = [];
  };

  $scope.clearSearch = function(searchForm) {
    $scope.gridOptions.data = [];
    $scope.searchParams = angular.copy(searchMaster);
    $scope.submitted = false;
    $scope.searching = false;
    $scope.dinSearch = false;
    searchForm.$setPristine();
  };
  initialiseForm();
});