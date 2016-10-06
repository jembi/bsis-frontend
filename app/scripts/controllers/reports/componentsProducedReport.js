'use strict';

angular.module('bsis')
  .controller('ComponentsProducedReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService) {

    // Initialize variables

    var mergedData = [];
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
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
      totalsRow.total = 0;
      rowsForVenue[$scope.componentTypesNumber + 1] = totalsRow;

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

      angular.forEach(dataValues, function(newRow) {

        var cohorts = newRow.cohorts;
        var componentType = cohorts[0].option;
        var bloodType = cohorts[1].option;
        newRow.cohorts = componentType;

        // New venue
        if (newRow.venue.name !== previousVenue) {

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
            rowsForVenue[$scope.componentTypesNumber + 1][bloodType] += newRow.value;
            rowsForVenue[$scope.componentTypesNumber + 1].total += newRow.value;
            // Populate component type summary rows
            summaryRows[index][bloodType] += newRow.value;
            summaryRows[index].total += newRow.value;
            // Populate total summary row
            summaryRows[$scope.componentTypesNumber + 1][bloodType] += newRow.value;
            summaryRows[$scope.componentTypesNumber + 1].total += newRow.value;
          }
        });
      });

      // Run one last time for the last venue
      pushRowsToGrid(rowsForVenue);

      // Add summary
      pushRowsToGrid(summaryRows);

      $scope.gridOptions.data = mergedData;
    }

    function mockReport() {
      var report = {'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'dataValues': [

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Platelets Concentrate - Apheresis', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Apheresis', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A-', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Platelets Concentrate - Apheresis', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Apheresis', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Blood Type', 'option':'A+', 'comparator':'EQUALS'}]}

      ]};

      return report;

    }

    $scope.getReport = function(searchForm) {

      if (!searchForm.$valid) {
        return;
      }

      var period = {};
      if ($scope.search.startDate) {
        var startDate = moment($scope.search.startDate).startOf('day').toDate();
        period.startDate = startDate;
      }
      if ($scope.search.endDate) {
        var endDate = moment($scope.search.endDate).endOf('day').toDate();
        period.endDate = endDate;
      }
      $scope.searching = true;
      $scope.submitted = true;
      var report = mockReport();
      mergeData(report.dataValues);
      $scope.searching = false;

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
        return ReportsLayoutService.generatePdfPageHeader('Components Produced Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)],
          $scope.gridOptions.exporterPdfOrientation);
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('venues', $scope.gridOptions.data.length / ($scope.componentTypesNumber + 1) - 1, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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
      $scope.processingSites = [{'id':1, 'name':'Leribe'}, {'id':2, 'name':'Maseru'}];
      componentTypes = [{'id':6, 'componentTypeName':'Whole Blood - CPDA', 'componentTypeCode':'1001', 'description':''}, {'id':7, 'componentTypeName':'Whole Blood Poor Platelets - CPDA', 'componentTypeCode':'1005', 'description':''}, {'id':8, 'componentTypeName':'Packed Red Cells - CPDA', 'componentTypeCode':'2001', 'description':''}, {'id':9, 'componentTypeName':'Packed Red Cells - SAGM', 'componentTypeCode':'2011', 'description':''}, {'id':10, 'componentTypeName':'Fresh Frozen Plasma - Whole Blood', 'componentTypeCode':'3001', 'description':''}, {'id':11, 'componentTypeName':'Frozen Plasma - Whole Blood', 'componentTypeCode':'3002', 'description':''}, {'id':12, 'componentTypeName':'Platelets Concentrate - Whole Blood', 'componentTypeCode':'4001', 'description':''}, {'id':13, 'componentTypeName':'Platelets Concentrate - Whole Blood - 24H', 'componentTypeCode':'4011', 'description':''}, {'id':14, 'componentTypeName':'Packed Red Cells - Paediatric - CPDA', 'componentTypeCode':'2101', 'description':''}, {'id':15, 'componentTypeName':'Fresh Frozen Plasma - Apheresis', 'componentTypeCode':'3011', 'description':''}, {'id':16, 'componentTypeName':'Platelets Concentrate - Apheresis', 'componentTypeCode':'4021', 'description':''}];
      $scope.componentTypesNumber = componentTypes.length;
    }

    init();

  });
