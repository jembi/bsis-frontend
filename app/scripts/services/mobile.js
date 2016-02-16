'use strict';

angular.module('bsis')
  .factory('MobileService', function($http, Api) {

    return {

      getMobileClinicLookUpFormFields: function(onSuccess, onError) {
        Api.MobileClinicLookUpFormFields.get({}, onSuccess, onError);
      },

      mobileClinicLookUp: function(search, onSuccess, onError) {
        Api.MobileClinicLookUp.get(search, function(response) {
          onSuccess(response.donors);
        }, function(err) {
          onError(err.data);
        });
      }

    };
  });
