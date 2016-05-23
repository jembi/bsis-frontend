'use strict';

angular.module('bsis').factory('OrderFormsService', function(Api) {

  return {
    getOrderFormsForm: Api.OrderFormForm.get,
    addOrderForm: Api.OrderForms.save,
    getOrderForm: Api.OrderForms.get,
    updateOrderForm: Api.OrderForms.update,
    getOrderFormItemForm: Api.OrderFormItemForm.get
  };
});
