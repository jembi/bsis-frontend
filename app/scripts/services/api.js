'use strict';

angular.module('bsis')

  .factory('Api', function ($resource, $http, APIHOST, APIPORT, APIAPP) {

    var url = 'http://' + APIHOST + ':' + APIPORT + '/' + APIAPP;

    return {
      User: $resource(url + '/users/login-user-details' , {}, {
        get: {
          method: 'GET'
        }
      }),

      Donor: $resource(url + '/donors/:id', null, 
        {
          update: {method:'PUT'}
        }
      ),

      Deferrals: $resource(url + '/deferrals/:id', null, 
        {
          update: {method:'PUT'}
        }
      ),

      Donations: $resource(url + '/donations/:id', null, 
        {
          update: {method:'PUT'}
        }
      ),

      DonorFormFields: $resource(url + '/donors/form'),
      DonationsFormFields: $resource(url + '/donations/form'),
      DeferralsFormFields: $resource(url + '/deferrals/form'),

      FindDonors: $resource(url + '/donors/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{firstName:'@firstName', lastName:'@lastName', donorNumber: '@donorNumber', 
            donationIdentificationNumber: '@donationIdentificationNumber', usePhraseMatch: '@usePhraseMatch' }
          }
        }
      ),

      DonorOverview:  $resource(url + '/donors/:id/overview'),
      DonorDonations: $resource(url + '/donors/:id/donations'),
      DonorDeferrals: $resource(url + '/donors/:id/deferrals'),
      DonorBarcode:   $resource(url + '/donors/:id/print'),

      DonorCommunicationsFormFields: $resource(url + '/donorcommunications/form'),
      DonorCommunicationsSearch: $resource(url + '/donorcommunications/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{bloodGroups:'@bloodGroups', donorPanels:'@donorPanels', clinicDate: '@clinicDate', 
            lastDonationFromDate: '@lastDonationFromDate', lastDonationToDate: '@lastDonationToDate', anyBloodGroup: '@anyBloodGroup' }
          }
        }
      )

    };
});