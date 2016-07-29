'use strict';

angular.module('bsis')
  .controller('TTIPrevalenceReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT) {

    // Initialize variables

    var mergedData = [];
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
      zeroValuesRow.venue.name = venue;
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
      allGendersRow.venue.name = '';
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
      var femaleRow = null;
      var maleRow = null;
      var allGendersRow = null;
      angular.forEach(mergedData, function(row) {
        if (femaleRow === null) {
          femaleRow = row;
          if (femaleRow.total !== 0) {
            femaleRow.ttirate = femaleRow.totalpos / femaleRow.total * 100;
            femaleRow.hivrate = femaleRow.hivpos / femaleRow.total * 100;
            femaleRow.hbvrate = femaleRow.hbvpos / femaleRow.total * 100;
            femaleRow.hcvrate = femaleRow.hcvpos / femaleRow.total * 100;
            femaleRow.syphrate = femaleRow.syphpos / femaleRow.total * 100;
          }
        } else if (maleRow === null) {
          maleRow = row;
          if (maleRow.total !== 0) {
            maleRow.ttirate = maleRow.totalpos / maleRow.total * 100;
            maleRow.hivrate = maleRow.hivpos / maleRow.total * 100;
            maleRow.hbvrate = maleRow.hbvpos / maleRow.total * 100;
            maleRow.hcvrate = maleRow.hcvpos / maleRow.total * 100;
            maleRow.syphrate = maleRow.syphpos / maleRow.total * 100;
          }
        } else {
          allGendersRow = row;
          allGendersRow.ttirate = allGendersRow.totalpos / allGendersRow.total * 100;
          allGendersRow.hivrate = allGendersRow.hivpos / allGendersRow.total * 100;
          allGendersRow.hbvrate = allGendersRow.hbvpos / allGendersRow.total * 100;
          allGendersRow.hcvrate = allGendersRow.hcvpos / allGendersRow.total * 100;
          allGendersRow.syphrate = allGendersRow.syphpos / allGendersRow.total * 100;

          // Format with 2 spaces
          femaleRow.ttirate = $filter('number')(femaleRow.ttirate, 2);
          femaleRow.hivrate = $filter('number')(femaleRow.hivrate, 2);
          femaleRow.hbvrate = $filter('number')(femaleRow.hbvrate, 2);
          femaleRow.hcvrate = $filter('number')(femaleRow.hcvrate, 2);
          femaleRow.syphrate = $filter('number')(femaleRow.syphrate, 2);
          maleRow.ttirate = $filter('number')(maleRow.ttirate, 2);
          maleRow.hivrate = $filter('number')(maleRow.hivrate, 2);
          maleRow.hbvrate = $filter('number')(maleRow.hbvrate, 2);
          maleRow.hcvrate = $filter('number')(maleRow.hcvrate, 2);
          maleRow.syphrate = $filter('number')(maleRow.syphrate, 2);
          allGendersRow.ttirate = $filter('number')(allGendersRow.ttirate, 2);
          allGendersRow.hivrate = $filter('number')(allGendersRow.hivrate, 2);
          allGendersRow.hbvrate = $filter('number')(allGendersRow.hbvrate, 2);
          allGendersRow.hcvrate = $filter('number')(allGendersRow.hcvrate, 2);
          allGendersRow.syphrate = $filter('number')(allGendersRow.syphrate, 2);

          femaleRow = null;
          maleRow = null;
        }
      });
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
      { name: 'Venue', field: 'venue.name', width: '**', minWidth: '200' },
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

    function updatePdfDocDefinition(docDefinition) {
      // Display in grey and bold 'All' rows
      docDefinition.styles.greyBoldCell = ReportsLayoutService.pdfTableBodyGreyBoldStyle;
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[1] === 'All') {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'greyBoldCell'};
          });
        }
      });

      return ReportsLayoutService.paginatePdf(30, docDefinition);
    }

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

      // Add % to rate column values
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.field.indexOf('rate') !== -1) {
          return value + '%';
        }
        return value;
      },

      // PDF header
      exporterPdfHeader: function() {
        return ReportsLayoutService.generatePdfPageHeader('TTI Prevalence Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
      },

      // PDF: add search parameters under the header
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = updatePdfDocDefinition(docDefinition);
        return docDefinition;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('venues', $scope.gridOptions.data.length / 3, currentPage, pageCount);
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
