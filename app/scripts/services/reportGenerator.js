'use strict';

angular.module('bsis').factory('ReportGeneratorService', function($filter) {

  return {
    // returns the data value's cohort
    getCohort: function(dataValue, category) {
      return $filter('filter')(dataValue.cohorts, { category: category})[0];
    },

    // generate the rows of the report/table
    // param: dataValues: an array of the data values provided by the report
    // param: reactionTypes: an array of Transfusion Reaction Types, which can be configured by the user
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // returns: A response object with the first element containing the generated rows, and the second element, the number of locations counted
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

    // generate the summary rows for the report/table
    // param: dataValues: an array of the data values provided by the report
    // param: reactionTypes: an array of Transfusion Reaction Types, which can be configured by the user
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // returns: a summary row object that can be appended to the report/table
    generateSummaryRow: function(dataValues, reactionTypes, initRow, populateRow) {
      var summaryRow = initRow(reactionTypes);
      angular.forEach(dataValues, function(dataValue) {
        populateRow(summaryRow, dataValue);
      });
      return summaryRow;
    }
  };

});
