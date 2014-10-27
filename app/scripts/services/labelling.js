'use strict';

angular.module('bsis')
.factory('LabellingService', function ($http, Api, $filter) {
  return {
    checkLabellingStatus: function (donationIdentificationNumber, response) {
      var status = Api.LabellingStatus.get({donationIdentificationNumber: donationIdentificationNumber}, function(){
          response(status);
      }, function (){
        response(false);  
      });
    },
    printPackLabel: function (donationIdentificationNumber, response) {
      var label = Api.PrintPackLabel.get({donationIdentificationNumber: donationIdentificationNumber}, function(){
          response(label);
      }, function (){
        response(false);  
      });
    },
    printDiscardLabel: function (donationIdentificationNumber, response) {
      var label = Api.PrintDiscardLabel.get({donationIdentificationNumber: donationIdentificationNumber}, function(){
          response(label);
      }, function (){
        response(false);  
      });
    }

  };
});