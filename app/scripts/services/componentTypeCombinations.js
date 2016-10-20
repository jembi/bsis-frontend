'use strict';

angular.module('bsis').factory('ComponentTypeCombinationsService', function(Api) {
  return {
    getComponentTypeCombinations: Api.ComponentTypeCombinations.search
  };
});