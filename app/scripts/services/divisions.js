'use strict';

angular.module('bsis').factory('DivisionsService', function(Api) {
  return {
    findDivisions: Api.Divisions.search
  };
});
