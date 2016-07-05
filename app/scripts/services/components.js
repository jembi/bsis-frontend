'use strict';

angular.module('bsis')
  .factory('ComponentService', function($http, Api) {
    return {
      getComponentsFormFields: function(response) {
        Api.Components.getComponentForm({}, function(backingForm) {
          response(backingForm);
        }, function() {
          response(false);
        });
      },
      getComponentsByDIN: function(donationIdentificationNumber, response) {
        var apiResponse = Api.Components.findByDIN({donationIdentificationNumber: donationIdentificationNumber}, function() {
          response(apiResponse);
        }, function() {
          response(false);
        });
      },
      findComponent: function(componentSearch, onSuccess, onError) {
        Api.Components.find(componentSearch, function(response) {
          onSuccess(response.component);
        }, function(err) {
          onError(err.data);
        });
      },
      ComponentsSearch: function(componentsSearch, response) {
        var components = Api.Components.search({
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
        Api.Components.record(component, function(data) {
          response(data);
        }, function() {
          response(false);
        });
      },

      getDiscardForm: Api.Components.getDiscardForm,
      discard: Api.Components.discard,
      update: Api.Components.update,
      unprocess: Api.Components.unprocess,
      undiscard: Api.Components.undiscard
    };
  });
