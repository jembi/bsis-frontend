'use strict';

angular.module('bsis').factory('TransfusionsReportingService', function() {

  function initRow(reactionTypes) {
    var row = {};
    row.usageSite = '';
    row.totalTransfusedUneventfully = 0;
    row.totalNotTransfused = 0;
    angular.forEach(reactionTypes, function(reactionType) {
      row[reactionType.name] = 0;
    });
    row.totalReactions = 0;
    row.totalUnknown = 0;
    return row;
  }

  function populateRow(row, dataValue) {
    var cohorts = dataValue.cohorts;
    var reactionType = cohorts[0].option;
    var outcome = cohorts[1].option;

    row.usageSite = dataValue.location.name;

    if (outcome === 'TRANSFUSED_UNEVENTFULLY') {
      row.totalTransfusedUneventfully += dataValue.value;
    } else if (outcome === 'NOT_TRANSFUSED') {
      row.totalNotTransfused += dataValue.value;
    } else if (outcome === 'UNKNOWN') {
      row.totalUnknown += dataValue.value;
    } else if (outcome === 'TRANSFUSION_REACTION_OCCURRED') {
      row[reactionType] += dataValue.value;
      row.totalReactions += dataValue.value;
    }
  }

  return {
    generateDataRows: function(dataValues, reactionTypes) {
      // The response's first element is generated rows, and the second element is the number of usage sites
      var response = [];
      var rowsForUsageSite = {};
      var generatedRows = [];
      var usageSitesNumber = 0;

      angular.forEach(dataValues, function(dataValue) {
        var rowForUsageSite = rowsForUsageSite[dataValue.location.name];
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

    generateSummaryRow: function(dataValues, reactionTypes) {
      var summaryRow = initRow(reactionTypes);
      angular.forEach(dataValues, function(dataValue) {
        populateRow(summaryRow, dataValue);
      });
      summaryRow.usageSite = 'All Sites';
      return summaryRow;
    }
  };

});
