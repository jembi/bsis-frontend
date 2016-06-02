'use strict';

angular.module('bsis')
  .factory('ReportsService', function($http, Api) {
    return {
      generateDonationsReport: function(period, onSuccess, onError) {
        Api.DonationsReport.get({startDate: period.startDate, endDate: period.endDate}, function(report) {
          onSuccess(report);
        }, function(err) {
          onError(err.data);
        });
      },
      generateStockLevelsReport: Api.StockLevelsReport.generate,
      getStockLevelsReportForm: Api.StockLevelsReport.getForm
    };
  });