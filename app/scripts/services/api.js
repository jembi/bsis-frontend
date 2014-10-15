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

      DonorFormFields: $resource(url + '/donors/form'),

      FindDonors: $resource(url + '/donors/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{firstName:'@firstName', lastName:'@lastName', donorNumber: '@donorNumber', donationIdentificationNumber: '@donationIdentificationNumber', usePhraseMatch: '@usePhraseMatch' }
          }
        }
      ),

      DonorDonations: $resource(url + '/donors/:id/donations'),

      DonorDeferrals: $resource(url + '/donors/:id/deferrals')


    };
});