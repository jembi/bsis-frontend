'use strict';

angular.module('bsis').factory('OrderFormsService', function(Api) {

  return {
    getOrderFormsForm: Api.OrderFormsForm.get,
    addOrderForm: Api.OrderForms.save,
    getOrderForm: Api.OrderForms.get,
    updateOrderForm: Api.OrderForms.update
  };
});
