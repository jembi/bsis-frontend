'use strict';

angular.module('bsis').factory('ReturnFormsService', function(Api) {

  return {
    getReturnFormsForm: Api.ReturnForms.getForm,
    addReturnForm: Api.ReturnForms.save
  };
});
