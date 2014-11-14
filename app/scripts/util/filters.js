'use strict';

angular.module('bsisFilters', [])

  // if component has been processed or discarded, expiry status info is not relevant - display 'N/A' instead
  .filter('expiryStatus', function() {

    return function(input) {
      console.log("input.status", input.status);
      if (input.status === "DISCARDED" || input.status === "PROCESSED" || input.status === "SPLIT"){
        return "N/A";
      }
      return input.expiryStatus;
    };
  }

);