'use strict';

angular.module('bsis')
  .controller('TTIPrevalenceReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT) {

    // Initialize variables

    var mergedData = [];
    var numericMergedData = [];
    var mergedKey = {};
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);

    // Report methods

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
      $scope.submitted = false;
    };

    function createZeroValuesRow(row, venue, gender) {
      var zeroValuesRow = angular.copy(row);
      zeroValuesRow.venue = venue;
      zeroValuesRow.cohorts = gender;
      zeroValuesRow.hivpos = 0;
      zeroValuesRow.hbvpos = 0;
      zeroValuesRow.hcvpos = 0;
      zeroValuesRow.syphpos = 0;
      zeroValuesRow.totalpos = 0;
      zeroValuesRow.total = 0;
      zeroValuesRow.ttirate = 0;
      zeroValuesRow.hivrate = 0;
      zeroValuesRow.hbvrate = 0;
      zeroValuesRow.hcvrate = 0;
      zeroValuesRow.syphrate = 0;
      return zeroValuesRow;
    }

    function createAllGendersRow(femaleRow, maleRow) {
      var allGendersRow = angular.copy(femaleRow);
      allGendersRow.venue = '';
      allGendersRow.cohorts = 'All';
      allGendersRow.hivpos = femaleRow.hivpos + maleRow.hivpos;
      allGendersRow.hbvpos = femaleRow.hbvpos + maleRow.hbvpos;
      allGendersRow.hcvpos = femaleRow.hcvpos + maleRow.hcvpos;
      allGendersRow.syphpos = femaleRow.syphpos + maleRow.syphpos;
      allGendersRow.totalpos = femaleRow.totalpos + maleRow.totalpos;
      allGendersRow.total = femaleRow.total + maleRow.total;
      return allGendersRow;
    }

    function mergeRows(newRow, existingRow, bloodTest, result) {
      var mergedRow = angular.copy(existingRow);
      if (bloodTest === 'HIV') {
        if (result === 'POS') {
          mergedRow.hivpos = newRow.value;
        }
      } else if (bloodTest === 'HBV') {
        if (result === 'POS') {
          mergedRow.hbvpos = newRow.value;
        }
      } else if (bloodTest === 'HCV') {
        if (result === 'POS') {
          mergedRow.hcvpos = newRow.value;
        }
      } else if (bloodTest === 'Syphilis') {
        if (result === 'POS') {
          mergedRow.syphpos = newRow.value;
        }
      }

      if (newRow.id === 'totalUnitsTested') {
        mergedRow.total = newRow.value;
      } else if (newRow.id ===  'totalUnsafeUnitsTested') {
        mergedRow.totalpos = newRow.value;
      }

      return mergedRow;
    }

    function addFemaleMaleAllRows(mergedFemaleRow, mergedMaleRow) {
      mergedData[mergedKey] = mergedFemaleRow;
      mergedKey = mergedKey + 1;
      mergedData[mergedKey] = mergedMaleRow;
      mergedKey = mergedKey + 1;
      mergedData[mergedKey] = createAllGendersRow(mergedFemaleRow, mergedMaleRow);
      mergedKey = mergedKey + 1;
    }

    function calculatePercentages() {
      angular.forEach(mergedData, function(row) {
        if (row.total !== 0) {
          row.ttirate = row.totalpos / row.total * 100;
          row.hivrate = row.hivpos / row.total * 100;
          row.hbvrate = row.hbvpos / row.total * 100;
          row.hcvrate = row.hcvpos / row.total * 100;
          row.syphrate = row.syphpos / row.total * 100;
        }
      });
    }

    function calculateSummary() {
      var summaryData = [
        ['All venues', 'female', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['', 'male', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['', 'All', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      var summaryRow = null;
      angular.forEach(numericMergedData, function(row) {
        if (row.cohorts === 'female') {
          summaryRow = summaryData[0];
        }
        if (row.cohorts === 'male') {
          summaryRow = summaryData[1];
        }
        if (row.cohorts === 'All') {
          summaryRow = summaryData[2];
        }

        summaryRow[2] = summaryRow[2] + row.hivpos;
        summaryRow[3] = summaryRow[3] + row.hbvpos;
        summaryRow[4] = summaryRow[4] + row.hcvpos;
        summaryRow[5] = summaryRow[5] + row.syphpos;
        summaryRow[6] = summaryRow[6] + row.totalpos;
        summaryRow[7] = summaryRow[7] + row.total;
      });

      // Calculate percentages
      angular.forEach(summaryData, function(row) {
        if (row[7] !== 0) {
          row[8] = row[6] / row[7] * 100;
          row[9] = row[2] / row[7] * 100;
          row[10] = row[3] / row[7] * 100;
          row[11] = row[4] / row[7] * 100;
          row[12] = row[5] / row[7] * 100;
        }
      });

      return ReportsLayoutService.formatPercentageColumnsAndConvertAllValuesToText(summaryData, [8, 9, 10, 11, 12]);
    }

    function mergeData(dataValues) {

      var previousVenue = '';
      var mergedFemaleRow = {};
      var mergedMaleRow = {};
      mergedKey = 0;
      mergedData = [];

      angular.forEach(dataValues, function(newRow) {

        var cohorts = newRow.cohorts;
        var bloodTest = null;
        var result = null;
        var gender = null;
        if (newRow.id === null) {
          bloodTest = cohorts[0].option;
          result = cohorts[1].option;
          gender = cohorts[2].option;
        } else {
          gender = cohorts[0].option;
        }

        newRow.cohorts = gender;

        // New venue
        if (newRow.venue.name !== previousVenue) {

          if (previousVenue != '') {
            // Add female, male and all rows for previous venue
            addFemaleMaleAllRows(mergedFemaleRow, mergedMaleRow);
          }

          // Initialize values for the new venue
          previousVenue = newRow.venue.name;
          mergedFemaleRow = createZeroValuesRow(newRow, previousVenue, 'female');
          mergedMaleRow = createZeroValuesRow(newRow, '', 'male');
        }

        // Merge gender row with new row
        if (gender === 'female') {
          mergedFemaleRow = mergeRows(newRow, mergedFemaleRow, bloodTest, result);
        }
        if (gender === 'male') {
          mergedMaleRow = mergeRows(newRow, mergedMaleRow, bloodTest, result);
        }

      });

      // Run this one last time for the last row
      addFemaleMaleAllRows(mergedFemaleRow, mergedMaleRow);

      // Calculate percentages
      calculatePercentages();

      // Make a copy of the mergedData before applying formatting to be used to create the summary
      numericMergedData = angular.copy(mergedData);

      // Format percentage values and convert all values to text
      mergedData = ReportsLayoutService.formatPercentageColumnsAndConvertAllValuesToText(mergedData, ['ttirate', 'hivrate', 'hbvrate', 'hcvrate', 'syphrate']);

      $scope.gridOptions.data = mergedData;
    }

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

      ReportsService.generateTTIPrevalenceReport(period, function(report) {
        $scope.searching = false;
        if (report.dataValues.length > 0) {
          mergeData(report.dataValues);
        }
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.log(err);
      });
    };

    // Grid ui variables and methods

    var columnDefs = [
      { name: 'Venue', field: 'venue', width: '**', minWidth: '200' },
      { name: 'Gender', field: 'cohorts', width:'**', maxWidth: '130' },
      { name: 'HIVPOS', displayName: 'HIV +', field: 'hivpos', width: '**', maxWidth: '70' },
      { name: 'HBVPOS', displayName: 'HBV +', field: 'hbvpos', width: '**', maxWidth: '70' },
      { name: 'HCVPOS', displayName: 'HCV +', field: 'hcvpos', width: '**', maxWidth: '70' },
      { name: 'SyphilisPOS', displayName: 'Syphilis +', field: 'syphpos', width: '**', maxWidth: '100' },
      { name: 'TotalUnsafeUnitsTested', displayName: 'Total +', field: 'totalpos', width: '**', maxWidth: '80'  },
      { name: 'TotalUnitsTested', displayName: 'Total', field: 'total', width: '**', maxWidth: '80'  },
      { name: 'TTIRate', displayName: 'TTI %', field: 'ttirate', width: '**', maxWidth: '80'  },
      { name: 'HIVRate', displayName: 'HIV %', field: 'hivrate', width: '**', maxWidth: '80'  },
      { name: 'HBVRate', displayName: 'HBV %', field: 'hbvrate', width: '**', maxWidth: '80'  },
      { name: 'HCVRate', displayName: 'HCV %', field: 'hcvrate', width: '**', maxWidth: '80'  },
      { name: 'SyphRate', displayName: 'Syph %', field: 'syphrate', width: '**', maxWidth: '80'  }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 9,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: 9,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

      // PDF header
      exporterPdfHeader: function() {
        return ReportsLayoutService.generatePdfPageHeader('TTI Prevalence Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
      },

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = ReportsLayoutService.addSummaryContent(calculateSummary(), docDefinition);
        docDefinition = ReportsLayoutService.highlightTotalRows('All', 1, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(27, docDefinition);
        return docDefinition;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('venues', $scope.gridOptions.data.length / 3, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

  });
