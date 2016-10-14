'use strict';

angular.module('bsis')
  .controller('ComponentsProducedReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService) {

    // Initialize variables

    var mergedData = [];
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
      allSites: true,
      processingSite: null
    };
    var componentTypes = [];
    $scope.search = angular.copy(master);

    // Report methods

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
      $scope.submitted = false;
    };

    $scope.clearProcessingSite = function() {
      $scope.search.processingSite = null;
    };

    $scope.updateAllSites = function() {
      if ($scope.search.processingSite) {
        $scope.search.allSites = false;
      }
    };

    function initRowsForVenue(venue) {
      var rowsForVenue = [{}];

      angular.forEach(componentTypes, function(ct, index) {
        var row = {};
        if (index !== 0) {
          row.venue =  '';
        } else {
          row.venue = venue;
        }
        row.componentType = ct.componentTypeName;
        row['A+'] = 0;
        row['A-'] = 0;
        row['B+'] = 0;
        row['B-'] = 0;
        row['AB+'] = 0;
        row['AB-'] = 0;
        row['O+'] = 0;
        row['O-'] = 0;
        row.nullnull = 0;
        row.total = 0;

        rowsForVenue[index] = row;
      });

      var totalsRow = {};
      totalsRow.venue =  '';
      totalsRow.componentType = 'Total';
      totalsRow['A+'] = 0;
      totalsRow['A-'] = 0;
      totalsRow['B+'] = 0;
      totalsRow['B-'] = 0;
      totalsRow['AB+'] = 0;
      totalsRow['AB-'] = 0;
      totalsRow['O+'] = 0;
      totalsRow['O-'] = 0;
      totalsRow.nullnull = 0;
      totalsRow.total = 0;
      rowsForVenue[componentTypes.length + 1] = totalsRow;

      return rowsForVenue;
    }

    function pushRowsToGrid(rowsForVenue) {
      angular.forEach(rowsForVenue, function(row) {
        mergedData.push(row);
      });
    }

    function mergeData(dataValues) {

      var previousVenue = '';
      var rowsForVenue = [];
      var summaryRows = initRowsForVenue('All Processing Sites');
      mergedData = [];
      $scope.sitesNumber = 0;

      angular.forEach(dataValues, function(newRow) {

        var cohorts = newRow.cohorts;
        var componentType = cohorts[0].option;
        var bloodType = cohorts[1].option;
        newRow.cohorts = componentType;

        // New venue
        if (newRow.venue.name !== previousVenue) {
          $scope.sitesNumber += 1;

          if (previousVenue != '') {
            pushRowsToGrid(rowsForVenue);
          }

          // Initialize rows for the new venue
          previousVenue = newRow.venue.name;
          rowsForVenue = initRowsForVenue(previousVenue);
        }

        // Populate component type and total rows for each venue and for summary
        angular.forEach(componentTypes, function(ct, index) {
          if (componentType === ct.componentTypeName) {
            // Populate component type rows
            rowsForVenue[index][bloodType] = newRow.value;
            rowsForVenue[index].total += newRow.value;
            // Populate total row
            rowsForVenue[componentTypes.length + 1][bloodType] += newRow.value;
            rowsForVenue[componentTypes.length + 1].total += newRow.value;
            // Populate component type summary rows
            summaryRows[index][bloodType] += newRow.value;
            summaryRows[index].total += newRow.value;
            // Populate total summary row
            summaryRows[componentTypes.length + 1][bloodType] += newRow.value;
            summaryRows[componentTypes.length + 1].total += newRow.value;
          }
        });
      });

      // Run one last time for the last venue
      pushRowsToGrid(rowsForVenue);

      // Add summary
      pushRowsToGrid(summaryRows);

      $scope.gridOptions.data = mergedData;
    }

    $scope.getReport = function(searchForm) {
      if (!searchForm.$valid) {
        return;
      }
      $scope.searching = true;
      ReportsService.generateComponentProductionReport($scope.search, function(report) {
        $scope.searching = false;
        if (report.dataValues.length > 0) {
          mergeData(report.dataValues);
          $scope.gridOptions.paginationCurrentPage = 1;
        } else {
          $scope.gridOptions.data = [];
          $scope.sitesNumber = 0;
        }
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.log(err);
      });
    };

    // Grid ui variables and methods

    var columnDefs = [
      { name: 'Site', field: 'venue' },
      { name: 'Component Type', field: 'componentType'},
      { name: 'A+', field: 'A+', width: 55 },
      { name: 'A-', field: 'A-', width: 55 },
      { name: 'B+', field: 'B+', width: 55 },
      { name: 'B-', field: 'B-', width: 55 },
      { name: 'AB+', displayName: 'AB+', field: 'AB+', width: 65 },
      { name: 'AB-', displayName: 'AB-', field: 'AB-', width: 65 },
      { name: 'O+', field: 'O+', width: 55 },
      { name: 'O-', field: 'O-', width: 55 },
      { name: 'NTD', displayName: 'NTD', field: 'nullnull', width: 55 },
      { name: 'Total', field: 'total', width: 55 }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 12,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: 12,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = ReportsLayoutService.highlightTotalRows('Total', 1, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(12, docDefinition);
        return docDefinition;
      },

      // PDF header
      exporterPdfHeader: function() {
        var processingSitesNumberLine = 'Number of processing sites: ' + $scope.sitesNumber;
        return ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
          'Components Produced Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)],
          processingSitesNumberLine);
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('sites', $scope.sitesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

    function init() {
      ReportsService.getComponentProductionReportForm(function(res) {
        $scope.processingSites = res.processingSites;
        componentTypes = res.componentTypes;
      }, function(err) {
        $log.error(err);
      });

    }

    init();

  });