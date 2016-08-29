'use strict';

angular.module('bsis').factory('DonationsService', function(Api) {
  return {
    getEditForm: Api.Donations.getEditForm
  };
});
