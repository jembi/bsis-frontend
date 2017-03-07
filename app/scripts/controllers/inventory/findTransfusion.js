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
            text: 'Component Transfusion Information',
            fontSize: 10,
            bold: true,
            margin: [30, 20, 0, 0] // [left, top, right, bottom]
          }
        ];
        return finalArray;
      },

      exporterPdfCustomFormatter: function(docDefinition) {
        var componentType = $filter('filter')($scope.componentTypes, function(ct) {
          return ct.id === parseInt($scope.searchParams.componentTypeId);
        });
        var transfusionSite = $filter('filter')($scope.transfusionSites, function(usageSite) {
          return usageSite.id === parseInt($scope.searchParams.receivedFromId);
        });
        var transfusionOutcome = $scope.searchParams.transfusionOutcome;
        var searchParams = [{
          text: [
            {text: 'Component Type: ', bold: true},
            (componentType && componentType[0] ? componentType[0].componentTypeName : 'All') + '          ',
            {text: 'Transfusion Site: ', bold: true},
            (transfusionSite && transfusionSite[0] ? transfusionSite[0].name : 'All') + '          ',
            {text: 'Transfusion Outcome: ', bold: true},
            (transfusionOutcome ? transfusionOutcome : 'All')
          ], margin: [-10, 0, 0, 0], fontSize: 7
        }];
        docDefinition.content = searchParams.concat(docDefinition.content);
        return docDefinition;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total Units: ' + $scope.gridOptions.data.length, width: 'auto'},
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