'use strict';

angular.module('bsis').factory('ComponentTypeCombinationsService', function(Api) {
  return {
    getComponentTypeCombinations: Api.ComponentTypeCombinations.search,
    updateComponentTypeCombinations: Api.ComponentTypeCombinations.update,
    getComponentTypeCombinationsForm: Api.ComponentTypeCombinations.getForm,
    saveComponentTypeCombinations: Api.ComponentTypeCombinations.addCombinations
  };
});