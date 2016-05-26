'use strict';

angular.module('bsis')
  .controller('TTIPrevalenceReportCtrl', function($scope, $log, $filter, ReportsService, DATEFORMAT) {

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
      zeroValuesRow.hivneg = 0;
      zeroValuesRow.hbvpos = 0;
      zeroValuesRow.hbvneg = 0;
      zeroValuesRow.hcvpos = 0;
      zeroValuesRow.hcvneg = 0;
      zeroValuesRow.syphilispos = 0;
      zeroValuesRow.syphilisneg = 0;
      zeroValuesRow.empty = 0;
      zeroValuesRow.total = 0;
      return zeroValuesRow;
    }

    function createAllGendersRow(femaleRow, maleRow) {
      var allGendersRow = angular.copy(femaleRow);
      allGendersRow.venue.name = '';
      allGendersRow.cohorts = 'All';
      allGendersRow.hivpos = femaleRow.hivpos + maleRow.hivpos;
      allGendersRow.hivneg = femaleRow.hivneg + maleRow.hivneg;
      allGendersRow.hbvpos = femaleRow.hbvpos + maleRow.hbvpos;
      allGendersRow.hbvneg = femaleRow.hbvneg + maleRow.hbvneg;
      allGendersRow.hcvpos = femaleRow.hcvpos + maleRow.hcvpos;
      allGendersRow.hcvneg = femaleRow.hcvneg + maleRow.hcvneg;
      allGendersRow.syphilispos = femaleRow.syphilispos + maleRow.syphilispos;
      allGendersRow.syphilisneg = femaleRow.syphilisneg + maleRow.syphilisneg;
      allGendersRow.empty = femaleRow.empty + maleRow.empty;
      allGendersRow.total = femaleRow.total + maleRow.total;
      return allGendersRow;
    }

    function mergeRows(newRow, existingRow, bloodTest, result) {
      var mergedRow = angular.copy(existingRow);
      if (bloodTest === 'HIV') {
        if (result === 'POS') {
          mergedRow.hivpos = newRow.value;
        } else if (result === 'NEG') {
          mergedRow.hivneg = newRow.value;
        }
      } else if (bloodTest === 'HBV') {
        if (result === 'POS') {
          mergedRow.hbvpos = newRow.value;
        } else if (result === 'NEG') {
          mergedRow.hbvneg = newRow.value;
        }
      } else if (bloodTest === 'HCV') {
        if (result === 'POS') {
          mergedRow.hcvpos = newRow.value;
        } else if (result === 'NEG') {
          mergedRow.hcvneg = newRow.value;
        }
      } else if (bloodTest === 'Syphilis') {
        if (result === 'POS') {
          mergedRow.syphilispos = newRow.value;
        } else if (result === 'NEG') {
          mergedRow.syphilisneg = newRow.value;
        }
      } else if (bloodTest === 'null' || result === 'null') {
        mergedRow.empty = newRow.value;
      }
      mergedRow.total = mergedRow.hivpos + mergedRow.hivneg +
        mergedRow.hbvpos + mergedRow.hbvneg +
        mergedRow.hcvpos + mergedRow.hcvneg +
        mergedRow.syphilispos +  mergedRow.syphilisneg;
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

    function mergeData(dataValues) {

      var previousVenue = '';
      var mergedFemaleRow = {};
      var mergedMaleRow = {};
      mergedKey = 0;
      mergedData = [];

      angular.forEach(dataValues, function(newRow) {

        var cohorts = newRow.cohorts;
        var bloodTest = cohorts[0].option;
        var result = cohorts[1].option;
        var gender = cohorts[2].option;
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
      { name: 'Venue', field: 'venue.name' },
      { name: 'Gender', field: 'cohorts'},
      { name: 'HIVPOS', displayName: 'HIV +', field: 'hivpos', width: 60 },
      { name: 'HIVNEG', displayName: 'HIV -', field: 'hivneg', width: 60 },
      { name: 'HBVPOS', displayName: 'HBV +', field: 'hbvpos', width: 60 },
      { name: 'HBVNEG', displayName: 'HBV -', field: 'hbvneg', width: 60 },
      { name: 'HCVPOS', displayName: 'HCV +', field: 'hcvpos', width: 60 },
      { name: 'HCVNEG', displayName: 'HCV -', field: 'hcvneg', width: 60 },
      { name: 'SyphilisPOS', displayName: 'Syphilis +', field: 'syphilispos', width: 60 },
      { name: 'SyphilisNEG', displayName: 'Syphilis -', field: 'syphilisneg', width: 60 },
      { name: 'Total', field: 'total' }
    ];

    function updatePdfDocDefinition(docDefinition) {
      // Fill with grey 'All' rows
      docDefinition.styles.greyBoldCell = { fillColor: 'lightgrey', fontSize: 8, bold: true };
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[1] === 'All') {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'greyBoldCell'};
          });
        }
      });

      return docDefinition;
    }

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: {fontSize: 8, margin: [-2, 0, 0, 0] },
      exporterPdfTableHeaderStyle: {fontSize: 8, bold: true, margin: [-2, 0, 0, 0] },
      exporterPdfMaxGridWidth: 550,

      exporterPdfCustomFormatter: function(docDefinition) {
        return updatePdfDocDefinition(docDefinition);
      },

      // PDF header
      exporterPdfHeader: function() {

        return [
          {
            text: 'TTI Prevalence Report - Date Period: ' + $filter('bsisDate')($scope.search.startDate) + ' to ' + $filter('bsisDate')($scope.search.endDate),
            bold: true,
            margin: [300, 10, 30, 0]
          }
        ];
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total venues: ' + $scope.gridOptions.data.length / 3, width: 'auto'},
          {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
          {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
        ];
        return {
          columns: columns,
          columnGap: 10,
          margin: [30, 0]
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

  });
