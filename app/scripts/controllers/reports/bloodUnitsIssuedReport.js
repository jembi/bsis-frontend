'use strict';

angular.module('bsis')
  .controller('BloodUnitsIssuedReportCtrl', function($scope, $log, $filter, DATEFORMAT, ReportsService, ReportsLayoutService) {

    // Initialize variables
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    var componentTypes = [
      'Whole Blood - CPDA',
      'Whole Blood Poor Platelets - CPDA',
      'Packed Red Cells - CPDA',
      'Packed Red Cells - SAGM',
      'Fresh Frozen Plasma - Whole Blood',
      'Frozen Plasma - Whole Blood',
      'Platelets Concentrate - Whole Blood',
      'Platelets Concentrate - Whole Blood - 24H',
      'Packed Red Cells - Paediatric - CPDA',
      'Fresh Frozen Plasma - Apheresis',
      'Platelets Concentrate - Apheresis'
    ];

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);

    function initialise() {
      // FIXME: fetch componentTypes from form endpoint
    }

    // Report methods

    function createZeroValuesRow(componentType) {
      var zeroValuesRow = {};
      zeroValuesRow.cohorts = componentType;
      zeroValuesRow.ordered = 0;
      zeroValuesRow.issued = 0;
      zeroValuesRow.gap = 0;
      zeroValuesRow.rate = $filter('number')(0, 2);
      return zeroValuesRow;
    }

    function createAllComponentTypesRow(componentTypesRows) {
      var allComponentTypesRow = null;
      angular.forEach(componentTypesRows, function(row) {
        if (allComponentTypesRow == null) {
          allComponentTypesRow = createZeroValuesRow('Total Blood Units');
        }
        allComponentTypesRow.ordered = allComponentTypesRow.ordered + row.ordered;
        allComponentTypesRow.issued = allComponentTypesRow.issued + row.issued;
        allComponentTypesRow.gap = allComponentTypesRow.gap + row.gap;
        allComponentTypesRow.rate = $filter('number')(allComponentTypesRow.issued / allComponentTypesRow.ordered * 100, 2);
      });
      return allComponentTypesRow;
    }

    function mergeData(dataValues) {

      var mergedData = [];

      // initialise the componentTypes rows
      angular.forEach(componentTypes, function(componentType) {
        mergedData.push(createZeroValuesRow(componentType));
      });

      // merge data from report
      angular.forEach(dataValues, function(newRow) {
        var componentType = $filter('filter')(newRow.cohorts, { category: 'Component Type'})[0].option;
        var rowData = $filter('filter')(mergedData, { cohorts: componentType})[0];

        // add new ordered/issued values and calculate gap & rate
        if (newRow.id === 'unitsOrdered') {
          rowData.ordered = rowData.ordered + newRow.value;
        } else if (newRow.id === 'unitsIssued') {
          rowData.issued = rowData.issued + newRow.value;
        }
        rowData.gap = rowData.ordered - rowData.issued;
        rowData.rate = $filter('number')(rowData.issued / rowData.ordered * 100, 2);
      });

      // add the Total Blood Units row
      mergedData.push(createAllComponentTypesRow(mergedData));

      $scope.gridOptions.data = mergedData;
    }

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
      $scope.submitted = false;
    };

    $scope.getReport = function(selectPeriodForm) {

      if (!selectPeriodForm.$valid) {
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

      $log.debug('Not implemented yet (using dummy data)');
      var reportData = {
        'startDate': '2016-07-08T21:59:59.999Z',
        'endDate': '2016-08-08T21:59:59.999Z',
        'dataValues': [
          {
            'id': 'unitsIssued',
            'startDate': '2016-07-08T21:59:59.999Z',
            'endDate': '2016-08-08T21:59:59.999Z',
            'value': 5,
            'venue': {},
            'cohorts': [
              {
                'category': 'Component Type',
                'option': 'Whole Blood - CPDA',
                'comparator': 'EQUALS'
              }
            ]
          },
          {
            'id': 'unitsOrdered',
            'startDate': '2016-07-08T21:59:59.999Z',
            'endDate': '2016-08-08T21:59:59.999Z',
            'value': 8,
            'venue': {},
            'cohorts': [
              {
                'category': 'Component Type',
                'option': 'Whole Blood - CPDA',
                'comparator': 'EQUALS'
              }
            ]
          },
          {
            'id': 'unitsIssued',
            'startDate': '2016-07-08T21:59:59.999Z',
            'endDate': '2016-08-08T21:59:59.999Z',
            'value': 7,
            'venue': {},
            'cohorts': [
              {
                'category': 'Component Type',
                'option': 'Whole Blood Poor Platelets - CPDA',
                'comparator': 'EQUALS'
              }
            ]
          },
          {
            'id': 'unitsOrdered',
            'startDate': '2016-07-08T21:59:59.999Z',
            'endDate': '2016-08-08T21:59:59.999Z',
            'value': 10,
            'venue': {},
            'cohorts': [
              {
                'category': 'Component Type',
                'option': 'Whole Blood Poor Platelets - CPDA',
                'comparator': 'EQUALS'
              }
            ]
          }
        ]
      };
      $scope.searching = false;
      mergeData(reportData.dataValues);
      $scope.submitted = true;
    };

    // Grid ui variables and methods
    var columnDefs = [
      { displayName: 'Component Type', field: 'cohorts'},
      { displayName: 'Ordered', field: 'ordered', width: 100 },
      { displayName: 'Issued', field: 'issued', width: 100 },
      { displayName: 'Gap', field: 'gap', width: 100 },
      { displayName: '% Issued vs Ordered', field: 'rate', width: 150 }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: componentTypes.length + 1,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: componentTypes.length + 1,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = ReportsLayoutService.highlightTotalRows('Total Blood Units', 0, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(33, docDefinition);
        return docDefinition;
      },

      // Reformat column data
      exporterFieldCallback: function(grid, row, col, value) {
        value = ReportsLayoutService.addPercentages(col, value);
        return value;
      },

      // PDF header
      exporterPdfHeader: function() {
        return ReportsLayoutService.generatePdfPageHeader('Blood Units Issued Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter(null, null, currentPage, pageCount);
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

    initialise();

  });
