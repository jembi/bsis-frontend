'use strict';

angular.module('bsis')
  .controller('ViewStockLevelsCtrl', function($scope, $location, $filter) {

    var master = {
      inventoryStatus: 'IN_STOCK',
      allSites: true
    };

    var inStockColumnDefs = [
      { name: 'Component Type', field: 'componentType', width: '**' },
      { name: 'A+', displayName: 'A+', field: 'aPlus', width: 55 },
      { name: 'A-', displayName: 'A-', field: 'aMinus', width: 55 },
      { name: 'B+', displayName: 'B+', field: 'bPlus', width: 55 },
      { name: 'B-', displayName: 'B-', field: 'bMinus', width: 55 },
      { name: 'AB+', displayName: 'AB+', field: 'abPlus', width: 65 },
      { name: 'AB-', displayName: 'AB-', field: 'abMinus', width: 65 },
      { name: 'O+', displayName: 'O+', field: 'oPlus', width: 55 },
      { name: 'O-', displayName: 'O-', field: 'oMinus', width: 55 },
      { name: 'Total', displayName: 'Total', field: 'total', width: 95 }
    ];

    var notLabelledColumnDefs = [
      { name: 'Component Type', field: 'componentType', width: '**' },
      { name: 'A+', displayName: 'A+', field: 'aPlus', width: 55 },
      { name: 'A-', displayName: 'A-', field: 'aMinus', width: 55 },
      { name: 'B+', displayName: 'B+', field: 'bPlus', width: 55 },
      { name: 'B-', displayName: 'B-', field: 'bMinus', width: 55 },
      { name: 'AB+', displayName: 'AB+', field: 'abPlus', width: 65 },
      { name: 'AB-', displayName: 'AB-', field: 'abMinus', width: 65 },
      { name: 'O+', displayName: 'O+', field: 'oPlus', width: 55 },
      { name: 'O-', displayName: 'O-', field: 'oMinus', width: 55 },
      { name: 'NTD', displayName: 'NTD', field: 'empty', width: 65 },
      { name: 'Total', displayName: 'Total', field: 'total', width: 95 }
    ];

    function isInStockSearch() {
      if ($scope.searchedParams && $scope.searchedParams.inventoryStatus === 'IN_STOCK') {
        return true;
      }
      return false;
    }

    function exportPDFCustomFormatter(docDefinition) {
      var prefix = [];
      if (!$scope.searchedParams.distributionCenter) {
        prefix.push(
          {
            text: 'All Sites',
            fontSize: 8,
            bold: true
          }
        );
      } else {
        var selectedDistributionCenter = $scope.distributionCenters.filter(function(center) {
          return $scope.searchedParams.distributionCenter === center.id.toString();
        });
        prefix.push(
          {
            text: 'Distribution Center: ',
            fontSize: 8,
            bold: true
          }, {
            text: selectedDistributionCenter[0].name
          }
        );
      }

      docDefinition.content = [{text: prefix, margin: [-10, 0, 0, 0], fontSize: 7}].concat(docDefinition.content);
      return docDefinition;
    }

    function exportPDFHeader() {
      return [
        {
          text: 'Stock Levels: ' + (isInStockSearch() ? 'In Stock' : 'Not Labelled'),
          fontSize: 10,
          bold: true,
          margin: [30, 20, 0, 0]
        }
      ];
    }

    function exportPDFFooter(gridOptions, currentPage, pageCount) {
      var columns = [
        {text: 'Total venues: ' + gridOptions.data.length / 3, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0]
      };
    }

    $scope.gridOptions = {
      data: [],
      columnDefs: [],

      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: {fontSize: 6, margin: [-2, 0, 0, 0] },
      exporterPdfTableHeaderStyle: {fontSize: 6, bold: true, margin: [-2, 0, 0, 0] },
      exporterPdfMaxGridWidth: 400,

      exporterPdfCustomFormatter: function(docDefinition) {
        return exportPDFCustomFormatter(docDefinition);
      },
      exporterPdfHeader: function() {
        return exportPDFHeader();
      },
      exporterPdfFooter: function(currentPage, pageCount) {
        return exportPDFFooter($scope.gridOptions, currentPage, pageCount);
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

    $scope.clearSearch = function(searchForm) {
      $scope.search = angular.copy(master);
      $scope.searched = false;
      searchForm.$setPristine();
      $location.search({});
    };

    $scope.clearDistributionCenter = function() {
      $scope.search.distributionCenter = null;
    };

    $scope.updateAllSites = function() {
      if ($scope.search.distributionCenter) {
        $scope.search.allSites = false;
      } else {
        $scope.search.allSites = true;
      }
    };

    $scope.viewStockLevels = function(searchForm) {
      if (searchForm.$invalid) {
        return;
      }
      $scope.searched = false;
      $scope.searching = true;
      $scope.searchedParams = angular.copy($scope.search);

      var inStockData = [
        {
          componentType: 'Whole Blood Single Pack - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Whole Blood Double Pack - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Whole Blood Triple Pack - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Whole Blood Quad Pack - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Apheresis',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Whole Blood - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Whole Blood Poor Platelets - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Packed Red Cells - CPDA',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Packed Red Cells - SAGM',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Fresh Frozen Plasma - Whole Blood',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Frozen Plasma - Whole Blood',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Platelets Concentrate - Whole Blood',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }, {
          componentType: 'Platelets Concentrate - Whole Blood - 24H',
          aPlus: 2,
          aMinus: 0,
          bPlus: 0,
          bMinus: 0,
          abPlus: 0,
          abMinus: 1,
          oPlus: 0,
          oMinus: 0,
          empty: 1,
          total: 4
        }
      ];

      $scope.gridOptions.data = inStockData;
      $scope.gridOptions.columnDefs = isInStockSearch() ? inStockColumnDefs : notLabelledColumnDefs;

      $scope.searched = true;
      $scope.searching = false;
    };

    function initialiseForm() {
      $scope.search = angular.copy(master);
      $scope.searched = false;
      $scope.distributionCenters = [
        {
          id: 1,
          name: 'Center#1'
        }, {
          id: 2,
          name: 'Center#2'
        }
      ];
    }

    initialiseForm();
  });