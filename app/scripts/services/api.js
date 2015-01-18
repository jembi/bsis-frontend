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

      DonationBatches: $resource(url + '/donationbatches/:id', null, 
        {
          update: {method:'PUT'}
        }
      ),

      TestBatches: $resource(url + '/testbatches/:id', null, 
        {
          update: {method:'PUT'}
        }
      ),

      DonorFormFields: $resource(url + '/donors/form'),
      DonationsFormFields: $resource(url + '/donations/form'),
      DeferralsFormFields: $resource(url + '/deferrals/form'),
      DonorCommunicationsFormFields: $resource(url + '/donorcommunications/form'),
      ComponentsFormFields: $resource(url + '/components/form'),
      ComponentCombinations: $resource(url + '/components/combinations'),
      DonationBatchFormFields: $resource(url + '/donationbatches/form'),
      TestBatchFormFields: $resource(url + '/testbatches/form'),
      TTITestingFormFields: $resource(url + '/ttitests/form'),
      BloodGroupTestingFormFields: $resource(url + '/bloodgroupingtests/form'),

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
      ),

      RecordComponents: $resource(url + '/components/record'),

      LabellingStatus:  $resource(url + '/labels/status/:donationIdentificationNumber'),
      PrintPackLabel:  $resource(url + '/labels/print/packlabel/:componentId'),
      PrintDiscardLabel: $resource(url + '/labels/print/discardlabel/:componentId'),

      FindDonationBatches: $resource(url + '/donationbatches/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{isClosed:'@isClosed', collectionCenters:'@collectionCenters', collectionSites: '@collectionSites'}
          }
        }
      ),

      RecentDonationBatches: $resource(url + '/donationbatches/recent/:count'),

      FindTestBatches: $resource(url + '/testbatches/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{status:'@status', createdBeforeDate:'@createdBeforeDate', createdAfterDate: '@createdAfterDate'}
          }
        }
      ),

      FindTestResults: $resource(url + '/testresults/search', {}, 
        {
          query: {
            method: 'GET', 
            params:{testBatch:'@testBatch'}
          }
        }
      ),

      TestResults: $resource(url + '/testresults/:donationIdentificationNumber', null, 
        {
          update: {method:'PUT'}
        }
      ),

      TestBatchOverview: $resource(url + '/testresults/overview', {}, 
        {
          query: {
            method: 'GET', 
            params:{testBatch:'@testBatch'}
          }
        }
      ),

      // Admin Configuration API endpoints
      Locations: $resource(url + '/locations/:id', null, 
        {
          update: {method:'PUT'}
        }
      )

    };
});