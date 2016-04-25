'use strict';

angular.module('bsis')
  .controller('AboRhGroupsReportCtrl', function($scope, $log, $filter, ReportsService, DATEFORMAT) {

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
      zeroValuesRow.aPlus = 0;
      zeroValuesRow.aMinus = 0;
      zeroValuesRow.bPlus = 0;
      zeroValuesRow.bMinus = 0;
      zeroValuesRow.abPlus = 0;
      zeroValuesRow.abMinus = 0;
      zeroValuesRow.oPlus = 0;
      zeroValuesRow.oMinus = 0;
      zeroValuesRow.empty = 0;
      zeroValuesRow.total = 0;
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
      allGendersRow.total = femaleRow.total + maleRow.total;
      return allGendersRow;
    }
  
    function mergeRows(newRow, existingRow, bloodType) {
      var mergedRow = angular.copy(existingRow);
      if (bloodType === 'A+') {
          mergedRow.aPlus = newRow.value;
        } else if (bloodType === 'A-') {
          mergedRow.aMinus = newRow.value;
        } else if (bloodType === 'B+') {
          mergedRow.bPlus = newRow.value;
        } else if (bloodType === 'B-') {
          mergedRow.bMinus = newRow.value;
        } else if (bloodType === 'AB+') {
          mergedRow.abPlus = newRow.value;
        } else if (bloodType === 'AB-') {
          mergedRow.abMinus = newRow.value;
        } else if (bloodType === 'O+') {
          mergedRow.oPlus = newRow.value;
        } else if (bloodType === 'O-') {
          mergedRow.oMinus = newRow.value;
        } else if (bloodType === 'nullnull') {
          mergedRow.empty = newRow.value;
        }
        mergedRow.total = mergedRow.aPlus + mergedRow.aMinus + mergedRow.bPlus + mergedRow.bMinus + mergedRow.abPlus + mergedRow.abMinus +
          mergedRow.oPlus + mergedRow.oMinus + mergedRow.empty;     
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
        var gender = cohorts[1].option;
        var bloodType = cohorts[2].option;
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
          mergedFemaleRow = mergeRows(newRow, mergedFemaleRow, bloodType);
        }
        if (gender === 'male') {
          mergedMaleRow = mergeRows(newRow, mergedMaleRow, bloodType);
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

        mergeData(report.dataValues);
        $scope.submitted = true;
      }, function(err) {
        $scope.searching = false;
        $log.log(err);
      });
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
        name: 'A+',
        field: 'aPlus',
        width: 55
      },
      {
        name: 'A-',
        field: 'aMinus',
        width: 55
      },
      {
        name: 'B+',
        field: 'bPlus',
        width: 55
      },
      {
        name: 'B-',
        field: 'bMinus',
        width: 55
      },
      {
        name: 'AB+',
        field: 'abPlus',
        width: 65
      },
      {
        name: 'AB-',
        field: 'abMinus',
        width: 65
      },
      {
        name: 'O+',
        field: 'oPlus',
        width: 55
      },
      {
        name: 'O-',
        field: 'oMinus',
        width: 55
      },
      {
        name: 'NTD',
        field: 'empty',
        width: 65
      },
      {
        name: 'Total',
        field: 'total'
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
      exporterPdfMaxGridWidth: 550,

      // PDF header
      exporterPdfHeader: function() {

        return [
          {
            text: 'ABO Rh Blood Grouping Report - Date Period: ' + $filter('bsisDate')($scope.search.startDate) + ' to ' + $filter('bsisDate')($scope.search.endDate),
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