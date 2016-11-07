'use strict';

angular.module('bsis')
  .factory('UtilsService', function() {
    return {
      dateSort: function(date1, date2) {
        if (date2 === null || date1 < date2) {
          return -1; // if date2 is null it never expires (so is larger than date1)
        } else if (date1 === null || date1 > date2) {
          return 1;
        } else {
          return 0; // equal
        }
      }
    };
  });
