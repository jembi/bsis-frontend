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
      DonorCommunicationsFormFields: $resource(url + '/donorcommunications/form'),
      ComponentsFormFields: $resource(url + '/components/form'),

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

      
      DonorCommunicationsSearch: $resource(url + '/donorcommunications/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{bloodGroups:'@bloodGroups', donorPanels:'@donorPanels', clinicDate: '@clinicDate', 
            lastDonationFromDate: '@lastDonationFromDate', lastDonationToDate: '@lastDonationToDate', anyBloodGroup: '@anyBloodGroup' }
          }
        }
      ),

      ComponentsSearch: $resource(url + '/components/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{donationIdentificationNumber:'@donationIdentificationNumber', componentTypes:'@componentTypes', status: '@status', 
            donationDateFrom: '@donationDateFrom', donationDateTo: '@donationDateTo' }
          }
        }
      ),

      getComponentsByDIN:  $resource(url + '/components/donations/:donationIdentificationNumber', {}, 
        {
          query: {
            method: 'GET', 
            params:{donationIdentificationNumber:'@donationIdentificationNumber'}
          }
        }
      ),

      discardComponents:  $resource(url + '/components/:id/discard', {}, 
        {
          update: {
            method: 'PUT', 
            params:{id: '@id', discardReasonId: '@discardReasonId', discardReasonText: '@discardReasonText'}
          }
        }
      )

    };
});