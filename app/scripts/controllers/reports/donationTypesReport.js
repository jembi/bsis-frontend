'use strict';

angular.module('bsis')
  .controller('DonationTypesReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT) {

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
      percentageRow.voluntary = $filter('number')(allGendersRow.voluntary / total * 100, 2);
      percentageRow.family = $filter('number')(allGendersRow.family / total * 100, 2);
      percentageRow.autologous = $filter('number')(allGendersRow.autologous / total * 100, 2);
      percentageRow.other = $filter('number')(allGendersRow.other / total * 100, 2);
      percentageRow.empty = $filter('number')(allGendersRow.empty / total * 100, 2);
      percentageRow.total = $filter('number')(allGendersRow.total / total * 100, 2);
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
      { name: 'Venue', field: 'venue.name', width: '**', minWidth: '250' },
      { name: 'Gender', field: 'cohorts', width: '**', maxWidth: '150' },
      { name: 'Voluntary', field: 'voluntary', width: '**', maxWidth: '125' },
      { name: 'Family', field: 'family', width: '**', maxWidth: '125' },
      { name: 'Autologous', field: 'autologous', width: '**', maxWidth: '125' },
      { name: 'Other', field: 'other', width: '**', maxWidth: '125' },
      { name: 'Total', field: 'total', width: '**', maxWidth: '125' }
    ];

    function updatePdfDocDefinition(docDefinition) {
      // Fill with grey and display in bold '%' rows
      docDefinition.styles.greyBoldCell = ReportsLayoutService.pdfTableBodyGreyBoldStyle;
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[1] === '%') {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'greyBoldCell'};
          });
        }
      });

      // Display in bold 'All' rows
      docDefinition.styles.boldCell = ReportsLayoutService.pdfTableBodyBoldStyle;
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[1] === 'All') {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'boldCell'};
          });
        }
      });

      return ReportsLayoutService.paginatePdf(48, docDefinition);
    }

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 8,
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,
      minRowsToShow: 8,

      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
      exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
      exporterPdfMaxGridWidth: ReportsLayoutService.pdfPortraitMaxGridWidth,

      // PDF header
      exporterPdfHeader: function() {
        return ReportsLayoutService.generatePdfPageHeader('Donations Collected By Type Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)]);
      },

      // PDF: add search parameters under the header
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = updatePdfDocDefinition(docDefinition);
        return docDefinition;
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('venues', $scope.gridOptions.data.length / 4, currentPage, pageCount);
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