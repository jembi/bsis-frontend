'use strict';

angular.module('bsis')
  .controller('DonationTypesReportCtrl', function($scope, $log, $filter, ReportsService, DATEFORMAT) {

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
      zeroValuesRow.voluntary = 0;
      zeroValuesRow.family = 0;
      zeroValuesRow.autologous = 0;
      zeroValuesRow.other = 0;
      zeroValuesRow.empty = 0;
      zeroValuesRow.total = 0;
      return zeroValuesRow;
    }

    function createAllGendersRow(femaleRow, maleRow) {
      var allGendersRow = angular.copy(femaleRow);
      allGendersRow.venue.name = '';
      allGendersRow.cohorts = 'All';
      allGendersRow.voluntary = femaleRow.voluntary + maleRow.voluntary;
      allGendersRow.family = femaleRow.family + maleRow.family;
      allGendersRow.autologous = femaleRow.autologous + maleRow.autologous;
      allGendersRow.other = femaleRow.other + maleRow.other;
      allGendersRow.empty = femaleRow.empty + maleRow.empty;
      allGendersRow.total = femaleRow.total + maleRow.total;
      return allGendersRow;
    }

    function createPercentageRow(allGendersRow) {
      var percentageRow = angular.copy(allGendersRow);
      var total = allGendersRow.total;
      percentageRow.venue.name = '';
      percentageRow.cohorts = '%';
      percentageRow.voluntary = allGendersRow.voluntary / total * 100;
      percentageRow.family = allGendersRow.family / total * 100;
      percentageRow.autologous = allGendersRow.autologous / total * 100;
      percentageRow.other = allGendersRow.other / total * 100;
      percentageRow.empty = allGendersRow.empty / total * 100;
      percentageRow.total = allGendersRow.total / total * 100;
      return percentageRow;
    }

    function mergeRows(newRow, existingRow, donationType) {
      var mergedRow = angular.copy(existingRow);
      if (donationType === 'Voluntary') {
        mergedRow.voluntary = newRow.value;
      } else if (donationType === 'Family') {
        mergedRow.family = newRow.value;
      } else if (donationType === 'Autologous') {
        mergedRow.autologous = newRow.value;
      } else if (donationType === 'Other') {
        mergedRow.other = newRow.value;
      } else if (donationType === 'null') {
        mergedRow.empty = newRow.value;
      }
      mergedRow.total = mergedRow.voluntary + mergedRow.family + mergedRow.autologous + mergedRow.other + mergedRow.empty;
      return mergedRow;
    }

    function addFemaleMaleAllRows(mergedFemaleRow, mergedMaleRow) {
      mergedData[mergedKey] = mergedFemaleRow;
      mergedKey = mergedKey + 1;
      mergedData[mergedKey] = mergedMaleRow;
      mergedKey = mergedKey + 1;
      mergedData[mergedKey] = createAllGendersRow(mergedFemaleRow, mergedMaleRow);
      mergedKey = mergedKey + 1;
      mergedData[mergedKey] = createPercentageRow(mergedData[mergedKey - 1]);
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
        var gender = cohorts[1].option;
        var donationType = cohorts[0].option;
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
          mergedFemaleRow = mergeRows(newRow, mergedFemaleRow, donationType);
        }
        if (gender === 'male') {
          mergedMaleRow = mergeRows(newRow, mergedMaleRow, donationType);
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

      ReportsService.generateDonationsReport(period, function(report) {
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
      { name: 'Voluntary', field: 'voluntary', cellFilter: 'number: 0', width: 100 },
      { name: 'Family', field: 'family', cellFilter: 'number: 0', width: 100 },
      { name: 'Autologous', field: 'autologous', cellFilter: 'number: 0', width: 100 },
      { name: 'Other', field: 'other', cellFilter: 'number: 0', width: 100 },
      { name: 'Total', field: 'total', cellFilter: 'number: 0' }
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
            text: 'Donations Collected By Type Report - Date Period: ' + $filter('bsisDate')($scope.search.startDate) + ' to ' + $filter('bsisDate')($scope.search.endDate),
            bold: true,
            margin: [300, 10, 30, 0]
          }
        ];
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total venues: ' + $scope.gridOptions.data.length / 4, width: 'auto'},
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
