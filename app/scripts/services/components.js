'use strict';

angular.module('bsis')
.factory('ComponentService', function ($http, Api, $filter) {
  return {
    getComponentsFormFields: function(response){
      Api.ComponentsFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    getComponentsByDIN: function (donationIdentificationNumber, response) {
      var apiResponse = Api.getComponentsByDIN.query({donationIdentificationNumber: donationIdentificationNumber}, function(){
        console.log("components response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);  
      });
    },
    getComponentsSummary: function () {
      return $http.get('/getComponentsSummary')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Find Components Summary Unsuccessful");
      });
    },
    getDiscardsSummary: function () {
      return $http.get('/getDiscardsSummary')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Find Discards Summary Unsuccessful");
      });
    },
    ComponentsSearch: function (componentsSearch, response) {
      var components = Api.ComponentsSearch.query({donationIdentificationNumber: componentsSearch.donationIdentificationNumber, 
        componentTypes: componentsSearch.componentTypes, status: componentsSearch.status, 
        donationDateFrom: $filter('date')(componentsSearch.donationDateFrom,'MM/dd/yyyy'), donationDateTo: $filter('date')(componentsSearch.donationDateTo,'MM/dd/yyyy')}, function(){
          console.log("components response: ", components);
          response(components);
      }, function (){
        response(false);  
      });
    },
    recordComponents: function (component, response) {
      
      var addComponent = new Api.RecordComponents();

      angular.copy(component, addComponent);
      
      addComponent.$save(function(data){ 
        response(data);
      }, function (){
        response(false);
      }); 

    },
    discardComponent: function (component, response) {
      Api.discardComponents.update({id: component.componentId, discardReasonId: component.discardReason, discardReasonText: component.discardReasonText}, function(data){
          response(data);
      }, function (){
        response(false);  
      });
    },
  };
});