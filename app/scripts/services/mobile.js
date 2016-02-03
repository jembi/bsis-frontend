'use strict';

angular.module('bsis')
  .factory('MobileService', function($http, Api) {

    return {

      getMobileClinicLookUpFormFields: function(response) {
        Api.MobileClinicLookUpFormFields.get({}, function(form) {
          response(form);
        }, function() {
          response(false);
        });
      },

      mobileClinicLookUp: function(search, onSuccess, onError) {
        var donors = Api.MobileClinicLookUp.query({
          venue: search.venue,
          clinicDate: search.clinicDate
        }, function() {
          onSuccess(donors.donors);
        }, function(err) {
          onError(err.data);
        });
      }

    };
  });
