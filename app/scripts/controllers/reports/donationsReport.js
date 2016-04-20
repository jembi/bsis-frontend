'use strict';

angular.module('bsis')
  .controller('DonationsReportCtrl', function($scope, $location, $log, $filter, $routeParams, ICONS, PERMISSIONS, ReportsService) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

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
        name: 'A+',
        field: 'aPlus',
        width: 70
      },
      {
        name: 'A-',
        field: 'aMinus',
        width: 70
      },
      {
        name: 'B+',
        field: 'bPlus',
        width: 70
      },
      {
        name: 'B-',
        field: 'bMinus',
        width: 70
      },
      {
        name: 'AB+',
        field: 'abPlus',
        width: 70
      },
      {
        name: 'AB-',
        field: 'abMinus',
        width: 70
      },
      {
        name: 'O+',
        field: 'oPlus',
        width: 70
      },
      {
        name: 'O-',
        field: 'oMinus',
        width: 70
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

      // PDF header
      exporterPdfHeader: function() {

        return [
          {
            text: 'Donations report',
            bold: true,
            margin: [30, 10, 30, 0]
          }
        ];
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total donations: ' + $scope.gridOptions.data.length, width: 'auto'},
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

    function search() {

      var startDate = '2016-02-03T21:59:59.999Z';
      var endDate = '2016-04-03T21:59:59.999Z';
      var period = {};
      period.startDate = startDate;
      period.endDate = endDate;

      ReportsService.generateDonationsReport(period, function(report) {
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
      }, $log.error);

    }

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    search();
  });