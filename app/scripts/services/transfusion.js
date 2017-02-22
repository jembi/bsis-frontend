'use strict';

angular.module('bsis').factory('TransfusionService', function(Api) {

  return {
    getTransfusionForm: Api.Transfusion.getForm
  };
});
