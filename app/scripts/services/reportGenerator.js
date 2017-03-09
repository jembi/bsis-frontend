'use strict';

angular.module('bsis').factory('ReportGeneratorService', function($filter) {

  function getCohort(dataValue, category) {
    return $filter('filter')(dataValue.cohorts, { category: category})[0];
  }

  return {

    // converts row objects to arrays
    // Example:
    // rowObject = row.location, row.componentType, row.gap
    // rowArray = [location, componentType, gap]
    convertRowObjectsToArrays: function(rowObjects) {
      var rowArrays = [];
      angular.forEach(rowObjects, function(rowObject) {
        var rowArray = [];
        angular.forEach(rowObject, function(column, key) {
          rowArray.push('' + rowObject[key]);
        });
        rowArrays.push(rowArray);
      });
      return rowArrays;
    },

    // returns the data value's cohort
    getCohort: function(dataValue, category) {
      return getCohort(dataValue, category);
    },

    // generate the rows of the report/table grouping them by location
    // param: dataValues: an array of the data values provided by the report
    // param: dynamicData: an array of dynamic data, which can be configured by the user and is used to init and populate data rows (can be null)
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // returns: A response object with the first element containing the generated rows, and the second element, the number of locations counted
    generateDataRowsGroupingByLocation: function(dataValues, dynamicData, initRow, populateRow) {
      var locationsNumber = 0;
      var rowsForLocation = {};

      angular.forEach(dataValues, function(dataValue) {
        var rowForLocation = rowsForLocation[dataValue.location.name];
        if (!rowForLocation) { // new location
          locationsNumber += 1;
          rowForLocation = initRow(dynamicData);
          rowsForLocation[dataValue.location.name] = rowForLocation;
        }
        populateRow(rowForLocation, dataValue);
      });

      var generatedRows = [];
      angular.forEach(rowsForLocation, function(row) {
        generatedRows.push(row);
      });

      var response = [];
      response.push(generatedRows);
      response.push(locationsNumber);
      return response;
    },

    // generate the rows of the report/table grouping them by location and a cohort
    // param: dataValues: an array of the data values provided by the report
    // param: cohortCategory: the category of the cohort we are grouping by
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // param: addSubtotalsRow: a function that, if present, calculates the subtotal row per location, else, no row is added
    // returns: A response object with the first element containing the generated rows, and the second element, the number of locations counted
    generateDataRowsGroupingByLocationAndCohort: function(dataValues, cohortCategory, initRow, populateRow, addSubtotalsRow) {
      var locationsNumber = 0;
      var rowsForLocation = {};

      angular.forEach(dataValues, function(dataValue) {
        var cohort = getCohort(dataValue, cohortCategory);
        if (cohort) {
          var cohortValue = cohort.option;
          var newLocation = false;
          var rowForCohort = null;

          // Check if there's rows for that location
          var rowsForCohort = rowsForLocation[dataValue.location.name];
          if (!rowsForCohort) { // new location
            locationsNumber += 1;
            rowsForCohort = {};
            newLocation = true;
            rowForCohort = initRow(dataValue, newLocation);
            rowsForCohort[cohortValue] = rowForCohort;
            rowsForLocation[dataValue.location.name] = rowsForCohort;
          }

          newLocation = false;

          // Check if there's a row for that location and cohort
          rowForCohort = rowsForCohort[cohortValue];
          if (!rowForCohort) { // new rowForCohort
            rowForCohort = initRow(dataValue, newLocation);
            rowsForCohort[cohortValue] = rowForCohort;
          }
          populateRow(rowForCohort, dataValue);
        }
      });

      var generatedRows = [];
      angular.forEach(rowsForLocation, function(rows) {
        angular.forEach(rows, function(row) {
          generatedRows.push(row);
        });

        if (addSubtotalsRow) {
          generatedRows.push(addSubtotalsRow(rows));
        }
      });

      var response = [];
      response.push(generatedRows);
      response.push(locationsNumber);
      return response;
    },

    // generate the rows of the report/table grouping them by location, can be used for a report or a summary if necessary
    // param: dataValues: an array of the data values provided by the report
    // param: cohortCategory: the cohortCategory to group the rows by
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // param: addTotalsRow: a function that, if present, calculates the totals row, else, no row is added
    // returns: the generated rows, grouped by cohort, according to the cohort category entered
    generateDataRowsGroupingByCohort: function(dataValues, cohortCategory, initRow, populateRow, addTotalsRow) {
      var rowsForCohort = {};

      angular.forEach(dataValues, function(dataValue) {
        var cohort = getCohort(dataValue, cohortCategory);
        if (cohort) {
          var cohortValue = cohort.option;
          var rowForCohort = rowsForCohort[cohortValue];
          if (!rowForCohort) { // new rowForCohort
            rowForCohort = initRow();
            rowsForCohort[cohortValue] = rowForCohort;
          }
          populateRow(rowForCohort, dataValue);
        }
      });

      var generatedRows = [];
      angular.forEach(rowsForCohort, function(row) {
        generatedRows.push(row);
      });

      if (addTotalsRow) {
        generatedRows.push(addTotalsRow(generatedRows));
      }

      return generatedRows;
    },

    // generate a summary row for the report/table
    // param: dataValues: an array of the data values provided by the report
    // param: dynamicData: an array of dynamic data, which can be configured by the user and is used to init and populate data rows (can be null)
    // param: initRow: a function that initialises and returns a single table row object
    // param: populateRow: a function that, given row and data value objects, updates the row with the counts from the data value
    // returns: a summary row object that can be appended to the report/table
    generateSummaryRow: function(dataValues, dynamicData, initRow, populateRow) {
      var summaryRow = initRow(dynamicData);
      angular.forEach(dataValues, function(dataValue) {
        populateRow(summaryRow, dataValue);
      });
      return summaryRow;
    }
  };

});
