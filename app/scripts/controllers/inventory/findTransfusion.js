'use strict';

angular.module('bsis')
  .controller('FindTransfusionCtrl', function($scope, $filter, $log, TransfusionService, DATEFORMAT) {

    $scope.dateFormat = DATEFORMAT;
    $scope.transfusionOutcomes = [];
    $scope.componentTypes = [];
    $scope.transfusionSites = [];

    $scope.searchParams = {};
    $scope.submitted = false;
    $scope.searching = false;

    $scope.clearFields = function() {
      $scope.searchParams.receivedFromId = null;
      $scope.searchParams.transfusionOutcome = null;

      if ($scope.searchParams.donationIdentificationNumber) {
        $scope.searchParams.startDate = null;
        $scope.searchParams.endDate = null;
      } else {
        $scope.searchParams.startDate = moment().subtract(7, 'days').startOf('day').toDate();
        $scope.searchParams.endDate = moment().endOf('day').toDate();
      }
    };

    var master = {
      donationIdentificationNumber: null,
      componentCode: null,
      componentTypeId: null,
      receivedFromId: null,
      transfusionOutcome: null,
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
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
        name: 'Component Type',
        field: 'componentType',
        width: '**'
      },
      {
        name: 'Transfused On',
        field: 'dateTransfused',
        cellFilter: 'bsisDate',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Outcome',
        field: 'transfusionOutcome',
        width: '**'
      },
      {
        name: 'Transfusion Site',
        field: 'receivedFrom.name',
        width: '**'
      }
    ];

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
      exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},
      exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
      exporterPdfMaxGridWidth: 400,

      exporterFieldCallback: function(grid, row, col, value) {
        if (col.field === 'dateTransfused') {
          return $filter('bsisDate')(value);
        }
        return value;
      },

      // PDF header
      exporterPdfHeader: function() {
        var finalArray = [
          {
            text: 'Transfusions',
            fontSize: 10,
            bold: true,
            margin: [30, 20, 0, 0] // [left, top, right, bottom]
          }
        ];
        return finalArray;
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

    function initialiseForm() {
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      TransfusionService.getSearchForm(function(response) {
        $scope.componentTypes = response.componentTypes;
        $scope.transfusionSites = response.usageSites;
        $scope.transfusionOutcomes = response.transfusionOutcomes;
      }, $log.error);
    }

    $scope.findTransfusion = function(searchForm) {
      if (searchForm.$invalid) {
        return;
      }
      $scope.submitted = true;
      $scope.searching = true;
      $scope.gridOptions.data = [];
      TransfusionService.search($scope.searchParams, function(response) {
        $scope.gridOptions.paginationCurrentPage = 1;
        $scope.gridOptions.data = response.transfusions;
        $scope.searching = false;
      }, function(err) {
        $log.error(err);
        $scope.searching = false;
      });
    };

    $scope.setComponentType = function(componentCode) {
      if (componentCode) {
        var filteredComponentTypes = $scope.componentTypes.filter(function(componentType) {
          return componentCode.indexOf(componentType.componentTypeCode) !== -1;
        });

        if (filteredComponentTypes.length > 0) {
          $scope.searchParams.componentTypeId = filteredComponentTypes[0].id;
        } else {
          $scope.searchParams.componentTypeId = null;
        }
      } else {
        $scope.searchParams.componentTypeId = null;
      }
    };

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
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