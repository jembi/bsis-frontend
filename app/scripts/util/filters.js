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

  .filter('slice', function() {
    return function(arr, start, end) {
      return arr.slice(start, end);
    };
  })
  .filter('bsisDate', function ($filter,$rootScope) {
    var angularDateFilter = $filter('date');
    return function (theDate) {
      return angularDateFilter(theDate, $rootScope.dateFormat);
    };
  })

  .filter('bsisDateTime', function ($filter,$rootScope) {
    var angularDateFilter = $filter('date');
    return function (theDate) {
      return angularDateFilter(theDate, $rootScope.dateTimeFormat);
    };
  })

  .filter('bsisTime', function ($filter,$rootScope) {
    var angularDateFilter = $filter('date');
    return function (theDate) {
      return angularDateFilter(theDate, $rootScope.timeFormat);
    };
  })
;




