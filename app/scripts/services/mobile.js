'use strict';

angular.module('bsis').factory('MobileService', function(Api) {
  return {
    getMobileClinicLookUpFormFields: Api.MobileClinicDonors.getForm,
    mobileClinicLookUp: Api.MobileClinicDonors.search
  };
});
