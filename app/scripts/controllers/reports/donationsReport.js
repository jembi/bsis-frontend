'use strict';

angular.module('bsis')
  .controller('DonationsReportCtrl', function($scope, $location, $log, $filter, $routeParams, ICONS, PERMISSIONS, ReportsService) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var columnDefs = [
      {
        name: 'Donation Type',
        field: 'cohorts'
      },
      {
        name: 'Gender',
        displayName: 'Gender',
        field: 'gender'
      },
      {
        name: 'Blood Type',
        field: 'bloodType'
      },
      {
        name: 'Venue',
        field: 'venue.name'
      },
      {
        name: 'Number of Donations',
        field: 'value'
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
          item.cohorts = cohorts[0].option;
          item.gender = cohorts[1].option;
          item.bloodType = cohorts[2].option;
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