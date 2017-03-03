'use strict';

angular.module('bsis').factory('ReportGeneratorService', function() {

  return {
    // The response's first element is generated rows, and the second element is the number of usage sites
    generateDataRows: function(dataValues, reactionTypes, initRow, populateRow) {
      var response = [];
      var generatedRows = [];
      var usageSitesNumber = 0;
      var rowsForUsageSite = {};
      var rowForUsageSite = null;

      angular.forEach(dataValues, function(dataValue) {
        rowForUsageSite = rowsForUsageSite[dataValue.location.name];
        if (!rowForUsageSite) { // new usageSite
          usageSitesNumber += 1;
          rowForUsageSite = initRow(reactionTypes);
          rowsForUsageSite[dataValue.location.name] = rowForUsageSite;
        }
        populateRow(rowForUsageSite, dataValue);
      });

      angular.forEach(rowsForUsageSite, function(row) {
        generatedRows.push(row);
      });

      response.push(generatedRows);
      response.push(usageSitesNumber);
      return response;
    },

    generateSummaryRow: function(dataValues, reactionTypes, initRow, populateRow) {
      var summaryRow = initRow(reactionTypes);
      angular.forEach(dataValues, function(dataValue) {
        populateRow(summaryRow, dataValue);
      });
      summaryRow.usageSite = 'All Sites';
      return summaryRow;
    }
  };

});
