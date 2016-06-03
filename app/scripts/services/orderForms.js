'use strict';

angular.module('bsis').factory('OrderFormsService', function(Api) {

  return {
    getOrderFormsForm: Api.OrderForms.getForm,
    addOrderForm: Api.OrderForms.save,
    getOrderForm: Api.OrderForms.get,
    updateOrderForm: Api.OrderForms.update,
    getOrderFormItemForm: Api.OrderForms.getItemsForm,
    findOrderForms: Api.OrderForms.search
  };
});
