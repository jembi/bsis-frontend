'use strict';

angular.module('bsis')
  .factory('ComponentService', function($http, Api) {
    return {
      getComponentsFormFields: function(response) {
        Api.ComponentsFormFields.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getComponentCombinations: function(response) {
        Api.ComponentCombinations.get({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getComponentsByDIN: function(donationIdentificationNumber, response) {
        var apiResponse = Api.getComponentsByDIN.query({donationIdentificationNumber: donationIdentificationNumber}, function() {
          response(apiResponse);
        }, function() {
          response(false);
        });
      },
      getComponentsSummary: function() {
        return $http.get('/getComponentsSummary');
      },
      getDiscardsSummary: function() {
        return $http.get('/getDiscardsSummary');
      },
      ComponentsSearch: function(componentsSearch, response) {
        var components = Api.ComponentsSearch.query({
          donationIdentificationNumber: componentsSearch.donationIdentificationNumber,
          componentTypes: componentsSearch.componentTypes,
          status: componentsSearch.status,
          donationDateFrom: componentsSearch.donationDateFrom,
          donationDateTo: componentsSearch.donationDateTo
        }, function() {
          response(components);
        }, function() {
          response(false);
        });
      },
      recordComponents: function(component, response) {

        var addComponent = new Api.RecordComponents();

        angular.copy(component, addComponent);

        addComponent.$save(function(data) {
          response(data);
        }, function() {
          response(false);
        });

      },
      discardComponent: function(component, response) {
        Api.discardComponents.update({
          id: component.componentId,
          discardReasonId: component.discardReason,
          discardReasonText: component.discardReasonText
        }, function(data) {
          response(data);
        }, function() {
          response(false);
        });
      },
      getComponentBatch: function(id, onSuccess, onFailure) {
        Api.ComponentBatches.get({id: id}, function(response) {
          onSuccess(response);
        }, function(err) {
          onFailure(err);
        });
      }
    };
  });
