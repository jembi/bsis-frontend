'use strict';

angular.module('bsis')
.factory('LabellingService', function ($http, Api, $filter) {
  return {
    checkLabellingStatus: function (donationIdentificationNumber, response) {
      var status = Api.LabellingStatus.get({donationIdentificationNumber: donationIdentificationNumber}, function(){
          console.log("labelling response: ", status);
          response(status);
      }, function (){
        response(false);  
      });
    },

  };
});