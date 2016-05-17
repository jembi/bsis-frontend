'use strict';

angular.module('bsis').factory('OrderFormsService', function(Api) {

  return {
    getOrderFormsForm: Api.OrderFormsForm.get,
    addOrderForm: Api.OrderForms.save
  };
});