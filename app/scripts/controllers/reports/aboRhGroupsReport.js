'use strict';

angular.module('bsis')
  .controller('AboRhGroupsReportCtrl', function($scope, $log, $filter, ReportsService, DATEFORMAT) {

    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.dateFormat = DATEFORMAT;
    $scope.search = angular.copy(master);

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
    };

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
          $scope.gridOptions.data = report.dataValues;
          angular.forEach($scope.gridOptions.data, function(item) {
            var cohorts = item.cohorts;
            var donationType = cohorts[0].option;
            var gender = cohorts[1].option;
            var bloodType = cohorts[2].option;
            item.cohorts = gender;
            item.donationType = donationType;

            if (bloodType === 'A+') {
              item.aPlus = item.value;
            } else if (bloodType === 'A-') {
              item.aMinus = item.value;
            } else if (bloodType === 'B+') {
              item.bPlus = item.value;
            } else if (bloodType === 'B-') {
              item.bMinus = item.value;
            } else if (bloodType === 'AB+') {
              item.abPlus = item.value;
            } else if (bloodType === 'AB-') {
              item.abMinus = item.value;
            } else if (bloodType === 'O+') {
              item.oPlus = item.value;
            } else if (bloodType === 'O-') {
              item.oMinus = item.value;
            } else if (bloodType === 'nullnull') {
              item.empty = item.value;
            }
          });
          $scope.submitted = true;
        }, function(err) {
          $scope.searching = false;
          $log.log(err);
        });
      }
    };

    // Grid ui variables and functions

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
        name: 'Donation Type',
        field: 'donationType'
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
        name: 'No blood type',
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
            text: 'Abo Rh Groups Report (' + $filter('bsisDate')($scope.search.startDate) + ' - ' + $filter('bsisDate')($scope.search.endDate) + ')',
            bold: true,
            margin: [30, 10, 30, 0]
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