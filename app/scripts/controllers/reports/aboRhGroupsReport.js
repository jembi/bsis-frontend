'use strict';

angular.module('bsis')
  .controller('AboRhGroupsReportCtrl', function($scope, $log, $filter, ReportsService, DATEFORMAT) {

    // Initialize variables

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
      zeroValuesRow.aPlus = 0;
      zeroValuesRow.aMinus = 0;
      zeroValuesRow.bPlus = 0;
      zeroValuesRow.bMinus = 0;
      zeroValuesRow.abPlus = 0;
      zeroValuesRow.abMinus = 0;
      zeroValuesRow.oPlus = 0;
      zeroValuesRow.oMinus = 0;
      zeroValuesRow.empty = 0;
      return zeroValuesRow;

    }

    function createAllGendersRow(femaleRow, maleRow) {

      var allGendersRow = angular.copy(femaleRow);

      allGendersRow.venue.name = '';
      allGendersRow.cohorts = 'All';
      allGendersRow.aplus = femaleRow.aplus + maleRow.aplus;
      allGendersRow.aMinus = femaleRow.aMinus + maleRow.aMinus;
      allGendersRow.bPlus = femaleRow.bPlus + maleRow.bPlus;
      allGendersRow.bMinus = femaleRow.bMinus + maleRow.bMinus;
      allGendersRow.abPlus = femaleRow.abPlus + maleRow.abPlus;
      allGendersRow.abMinus = femaleRow.abMinus + maleRow.abMinus;
      allGendersRow.oPlus = femaleRow.oPlus + maleRow.oPlus;
      allGendersRow.oMinus = femaleRow.oMinus + maleRow.oMinus;
      allGendersRow.empty = femaleRow.empty + maleRow.empty;
      return allGendersRow;

    }

    function mergeData(dataValues) {
      $scope.gridOptions.data = dataValues;

      var previousVenue = '';
      var previousGender = '';
      var mergedRow = {};
      var mergedData = [];
      var mergedKey = 0;
      var zeroValuesRow = {};
      var foundFemale = [];
      var foundMale = [];
      var allGendersRow = {};

      angular.forEach($scope.gridOptions.data, function(row) {

        var cohorts = row.cohorts;
        var gender = cohorts[1].option;
        var bloodType = cohorts[2].option;
        row.cohorts = gender;

        // New venue ()
        if (row.venue.name !== previousVenue) {

          if (previousVenue != '') {

            // Add gender row if missing for previous venue

            if (!foundMale[previousVenue]) {
              // add row male at mergedKey + 1
              zeroValuesRow = createZeroValuesRow(mergedRow, previousVenue, 'male');
              mergedKey = mergedKey + 1;
              mergedData[mergedKey] = zeroValuesRow;
            } else if (!foundFemale[previousVenue]) {
              // add row female at mergedKey and move mergedRow to mergedKey +1
              zeroValuesRow = createZeroValuesRow(mergedRow, previousVenue, 'female');
              mergedData[mergedKey] = zeroValuesRow;
              mergedKey = mergedKey + 1;
              mergedData[mergedKey] = mergedRow;
            }

            // Add all genders row for previous venue
            mergedKey = mergedKey + 1;
            allGendersRow = createAllGendersRow(mergedData[mergedKey - 1], mergedData[mergedKey - 2]);
            mergedData[mergedKey] = allGendersRow;

          }

          // Update values for new venue

          previousVenue = row.venue.name;
          previousGender = gender;
          mergedRow = createZeroValuesRow(row, previousVenue, gender);
          mergedKey = mergedKey + 1;

        // Same venue new gender, update values

        } else if (gender != previousGender) {
          previousGender = gender;
          mergedRow = createZeroValuesRow(row, previousVenue, gender);
          mergedKey = mergedKey + 1;

        // Else, use existing row and merge contents with this new row.

        } else {
          // do nothing
        }

        // Populate found gender arrays

        if (gender === 'female') {
          foundFemale[row.venue.name] = true;
        }
        if (gender === 'male') {
          foundMale[row.venue.name] = true;
        }

        // Populate blood type numbers

        if (bloodType === 'A+') {
          mergedRow.aPlus = row.value;
        } else if (bloodType === 'A-') {
          mergedRow.aMinus = row.value;
        } else if (bloodType === 'B+') {
          mergedRow.bPlus = row.value;
        } else if (bloodType === 'B-') {
          mergedRow.bMinus = row.value;
        } else if (bloodType === 'AB+') {
          mergedRow.abPlus = row.value;
        } else if (bloodType === 'AB-') {
          mergedRow.abMinus = row.value;
        } else if (bloodType === 'O+') {
          mergedRow.oPlus = row.value;
        } else if (bloodType === 'O-') {
          mergedRow.oMinus = row.value;
        } else if (bloodType === 'nullnull') {
          mergedRow.empty = row.value;
        }

        // Add row to mergedData

        mergedData[mergedKey] = mergedRow;

      });
      $scope.gridOptions.data = mergedData;
    }

    $scope.getReport = function(selectPeriodForm) {
      if (selectPeriodForm.$valid) {
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

          mergeData(report.dataValues);
          $scope.submitted = true;
        }, function(err) {
          $scope.searching = false;
          $log.log(err);
        });
      }
    };

    // Grid ui variables and methods

    var columnDefs = [
      {
        name: 'Venue',
        field: 'venue.name'
      },
      {
        name: 'Gender',
        field: 'cohorts'
      },
      {
        name: 'A +',
        field: 'aPlus',
        width: 55
      },
      {
        name: 'A -',
        field: 'aMinus',
        width: 55
      },
      {
        name: 'B +',
        field: 'bPlus',
        width: 55
      },
      {
        name: 'B -',
        field: 'bMinus',
        width: 55
      },
      {
        name: 'AB +',
        field: 'abPlus',
        width: 65
      },
      {
        name: 'AB -',
        field: 'abMinus',
        width: 65
      },
      {
        name: 'O +',
        field: 'oPlus',
        width: 55
      },
      {
        name: 'O -',
        field: 'oMinus',
        width: 55
      },
      {
        name: 'NTD',
        field: 'empty'
      }
    ];

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
      exporterPdfMaxGridWidth: 650,

      // PDF header
      exporterPdfHeader: function() {

        return [
          {
            text: 'Abo Rh Blood Grouping Report - Date Period: ' + $filter('bsisDate')($scope.search.startDate) + ' to ' + $filter('bsisDate')($scope.search.endDate),
            bold: true,
            margin: [300, 10, 30, 0]
          }
        ];
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total records: ' + $scope.gridOptions.data.length, width: 'auto'},
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