'use strict';

angular.module('bsis').factory('OrderFormsService', function(Api) {

  return {
    getOrderFormsForm: Api.OrderFormForm.get,
    addOrderForm: Api.OrderForms.save,
    getOrderForm: Api.OrderForms.get,
    updateOrderForm: Api.OrderForms.update,
    getOrderFormItemForm: Api.OrderFormItemForm.get,
    findOrderForms: function(params, onSuccess, onError) {
      Api.OrderFormsSearch.query({
        orderDateFrom: params.orderDateFrom,
        orderDateTo: params.orderDateTo,
        dispatchedFromId: params.dispatchedFromId,
        dispatchedToId: params.dispatchedToId,
        status: params.status},
      function(report) {
        onSuccess(report);
      }, function(err) {
        onError(err.data);
      });
    }
  };
});
