'use strict';

angular.module('bsis')
.factory('ComponentService', function ($http) {
  return {
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
    }
  };
});