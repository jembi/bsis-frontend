'use strict';

angular.module('bsis')

  // if component has been processed or discarded, expiry status info is not relevant - display 'N/A' instead
  .filter('expiryStatus', function() {
    return function(input) {
      if (input.status === 'DISCARDED' || input.status === 'PROCESSED' || input.status === 'SPLIT') {
        return 'N/A';
      }
      return input.expiryStatus;
    };
  })

  .filter('slice', function() {
    return function(arr, start, end) {
      return arr.slice(start, end);
    };
  })

  .filter('bsisDate', function($filter, DATEFORMAT) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
      return angularDateFilter(theDate, DATEFORMAT);
    };
  })

  .filter('bsisDateTime', function($filter, DATETIMEFORMAT) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
      return angularDateFilter(theDate, DATETIMEFORMAT);
    };
  })

  .filter('bsisTime', function($filter, TIMEFORMAT) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
      return angularDateFilter(theDate, TIMEFORMAT);
    };
  })

  .filter('revisionType', function() {
    return function(revisionType) {
      switch (revisionType) {
        case 'ADD':
          return 'Added';

        case 'MOD':
          return 'Modified';

        case 'DEL':
          return 'Deleted';

        default:
          return '';
      }
    };
  })

  .filter('mapTTIStatus', function() {
    return function(input) {
      switch (input) {
        case 'TTI_SAFE':
          return 'Safe';

        case 'TTI_UNSAFE':
          return 'Unsafe';

        default:
          return 'Not Done';

      }
    };
  })

  .filter('eligibility', function() {
    return function(input) {
        return input ? 'Eligible' : 'Not Eligible';
    }
  })
;