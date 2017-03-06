'use strict';

angular.module('bsis').factory('ReportGeneratorService', function($filter) {

  return {
    // returns the data value's cohort
    getCohort: function(dataValue, category) {
      return $filter('filter')(dataValue.cohorts, { category: category})[0];
    },

    // The response's first element is generated rows, and the second element is the number of usage sites
    generateDataRowsGroupingByLocation: function(dataValues, reactionTypes, initRow, populateRow) {
      var response = [];
      var generatedRows = [];
      var locationsNumber = 0;
      var rowsForLocation = {};
      var rowForLocation = null;

      angular.forEach(dataValues, function(dataValue) {
        rowForLocation = rowsForLocation[dataValue.location.name];
        if (!rowForLocation) { // new location
          locationsNumber += 1;
          rowForLocation = initRow(reactionTypes);
          rowsForLocation[dataValue.location.name] = rowForLocation;
        }
        populateRow(rowForLocation, dataValue);
      });

      angular.forEach(rowsForLocation, function(row) {
        generatedRows.push(row);
      });

      response.push(generatedRows);
      response.push(locationsNumber);
      return response;
    },

    generateSummaryRow: function(dataValues, reactionTypes, initRow, populateRow) {
      var summaryRow = initRow(reactionTypes);
      angular.forEach(dataValues, function(dataValue) {
        populateRow(summaryRow, dataValue);
      });
      return summaryRow;
    }
  };

});
