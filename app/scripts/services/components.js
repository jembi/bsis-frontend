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
    getComponentsByDIN: function (donationIdentificationNumber) {
      return $http.get('/getComponentsByDIN', {params: { din: donationIdentificationNumber }})
        .success(function(data, status, headers, config){
        if (donationIdentificationNumber.Error === undefined) {
          return data;
        }
      })
      .error(function(data){
        console.log("Find Components Unsuccessful");
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
        donationDateFrom: $filter('date')(componentsSearch.donationDateFrom,'MM/dd/yyyy'), donationDateTo: $filter('date')(componentsSearch.donationDateTo)}, function(){
          console.log("components response: ", components);
          response(components.components);
      }, function (){
        response(false);  
      });
    }
  };
});