'use strict';

angular.module('bsisFilters', [])

  // if component has been processed or discarded, expiry status info is not relevant - display 'N/A' instead
  .filter('expiryStatus', function () {
    return function (input) {
      if (input.status === "DISCARDED" || input.status === "PROCESSED" || input.status === "SPLIT") {
        return "N/A";
      }
      return input.expiryStatus;
    };
  })

  .filter('bsisDate', function ($filter,$rootScope) {
    var angularDateFilter = $filter('date');
    return function (theDate) {
      return angularDateFilter(theDate, $rootScope.dateFormat);
    };
  });