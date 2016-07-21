'use strict';

angular.module('bsis')
  .factory('ComponentTypesService', function(Api) {
    return {
      getComponentTypes: Api.ComponentTypes.getAll
    };
  });