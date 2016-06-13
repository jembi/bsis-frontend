'use strict';

angular.module('bsis')

  .factory('Api', function($resource, $http, SYSTEMCONFIG) {

    var url = 'http://' + SYSTEMCONFIG.apiHost + ':' + SYSTEMCONFIG.apiPort + '/' + SYSTEMCONFIG.apiApp;

    return {
      User: $resource(url + '/users/login-user-details', {}, {
        get: {
          method: 'GET'
        }
      }),

      Users: $resource(url + '/users/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      Roles: $resource(url + '/roles/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      Permissions: $resource(url + '/roles/permissions'),

      Donor: $resource(url + '/donors/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      Deferrals: $resource(url + '/deferrals/:id', null,
        {
          update: {method: 'PUT'},
          end: {
            url: url + '/deferrals/:id/end',
            method: 'PUT',
            params: {id: '@id'}
          }
        }
      ),

      deferralReasons: $resource(url + '/deferralreasons/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      Donations: $resource(url + '/donations/:id', {id: '@id'}, {
        update: {
          method: 'PUT'
        },
        bloodTypingResolutions: {
          method: 'POST',
          url: url + '/donations/bloodTypingResolutions'
        }
      }),

      DonationBatches: $resource(url + '/donationbatches/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      TestBatches: $resource(url + '/testbatches/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      TestBatchDonations: $resource(url + '/testbatches/:id/donations', {},
        {
          query: {
            method: 'GET',
            params: {id: '@id',
                     bloodTypingMatchStatus: '@bloodTypingMatchStatus'}
          }
        }
      ),

      ComponentBatches: $resource(url + '/componentbatches/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      ComponentBatchesSearch: $resource(url + '/componentbatches/search', {},
        {
          query: {
            method: 'GET',
            params: {
              startCollectionDate: '@startCollectionDate',
              endCollectionDate: '@endCollectionDate'
            }
          }
        }
      ),

      DonorFormFields: $resource(url + '/donors/form'),
      DonationsFormFields: $resource(url + '/donations/form'),
      DeferralsFormFields: $resource(url + '/deferrals/form'),
      DonorCommunicationsFormFields: $resource(url + '/donorcommunications/form'),
      ComponentsFormFields: $resource(url + '/components/form'),
      ComponentCombinations: $resource(url + '/components/combinations'),
      ComponentTypes: $resource(url + '/componenttypes'),
      DonationBatchFormFields: $resource(url + '/donationbatches/form'),
      TestBatchFormFields: $resource(url + '/testbatches/form'),
      TTITestingFormFields: $resource(url + '/ttitests/form'),
      BloodGroupTestingFormFields: $resource(url + '/bloodgroupingtests/form'),
      ComponentBatchesFormFields: $resource(url + '/componentbatches/form'),

      Donors: $resource(url + '/donors/:id', {id: '@id'}),

      FindDonors: $resource(url + '/donors/search', {},
        {
          query: {
            method: 'GET',
            params: {
              firstName: '@firstName',
              lastName: '@lastName',
              donorNumber: '@donorNumber',
              donationIdentificationNumber: '@donationIdentificationNumber',
              usePhraseMatch: '@usePhraseMatch'
            }
          }
        }
      ),

      DonorOverview: $resource(url + '/donors/:id/overview'),
      DonorDonations: $resource(url + '/donors/:id/donations'),
      DonorDeferrals: $resource(url + '/donors/:id/deferrals'),
      DonorBarcode: $resource(url + '/donors/:id/print'),

      DonorCommunicationsSearch: $resource(url + '/donorcommunications/search', {},
        {
          query: {
            method: 'GET',
            params: {
              bloodGroups: '@bloodGroups',
              venues: '@venues',
              clinicDate: '@clinicDate',
              lastDonationFromDate: '@lastDonationFromDate',
              lastDonationToDate: '@lastDonationToDate',
              anyBloodGroup: '@anyBloodGroup',
              noBloodGroup: '@noBloodGroup'
            }
          }
        }
      ),

      DonorSummaries: $resource(url + '/donors/summaries'),

      AllDonorDuplicates: $resource(url + '/donors/duplicates/all'),

      DonorDuplicates: $resource(url + '/donors/duplicates', {},
        {
          query: {
            method: 'GET',
            params: {donorNumber: '@donorNumber'}
          }
        }
      ),

      DonorPreviewMergeDuplicates: $resource(url + '/donors/duplicates/merge/preview', {},
        {
          query: {
            method: 'POST',
            params: {donorNumbers: '@donorNumbers'}
          }
        }
      ),

      DonorMergeDuplicates: $resource(url + '/donors/duplicates/merge', {},
        {
          query: {
            method: 'POST',
            params: {donorNumber: '@donorNumber'}
          }
        }
      ),

      ComponentsSearch: $resource(url + '/components/search', {},
        {
          query: {
            method: 'GET',
            params: {
              donationIdentificationNumber: '@donationIdentificationNumber',
              componentTypes: '@componentTypes',
              status: '@status',
              donationDateFrom: '@donationDateFrom',
              donationDateTo: '@donationDateTo'
            }
          }
        }
      ),

      getComponentsByDIN: $resource(url + '/components/donations/:donationIdentificationNumber', {},
        {
          query: {
            method: 'GET',
            params: {donationIdentificationNumber: '@donationIdentificationNumber'}
          }
        }
      ),

      Components: $resource(url + '/components'),

      discardComponents: $resource(url + '/components/:id/discard', {},
        {
          update: {
            method: 'PUT',
            params: {
              id: '@id',
              discardReasonId: '@discardReasonId',
              discardReasonText: '@discardReasonText'
            }
          }
        }
      ),

      RecordComponents: $resource(url + '/components/recordcombinations'),

      LabellingStatus: $resource(url + '/labels/status/:donationIdentificationNumber'),
      PrintPackLabel: $resource(url + '/labels/print/packlabel/:componentId'),
      PrintDiscardLabel: $resource(url + '/labels/print/discardlabel/:componentId'),

      FindDonationBatches: $resource(url + '/donationbatches/search', {},
        {
          query: {
            method: 'GET',
            params: {isClosed: '@isClosed', venues: '@venues'}
          }
        }
      ),

      FindTestBatches: $resource(url + '/testbatches/search'),

      TestResults: $resource(url + '/testresults/:donationIdentificationNumber', {donationIdentificationNumber: '@donationIdentificationNumber'}, {
        find: {
          method: 'GET',
          url: url + '/testresults/search',
          params: {
            testBatch: '@testBatch',
            bloodTestType: '@bloodTestType'
          }
        },
        overview: {
          method: 'GET',
          url: url + '/testresults/overview',
          params: {
            testBatch: '@testBatch'
          }
        },
        report: {
          method: 'GET',
          url: url + '/testresults/report',
          params: {
            testBatch: '@testBatch'
          }
        },
        saveResults: {
          method: 'POST',
          url: url + '/testresults',
          params: {
            reEntry: '@reEntry'
          }
        }
      }),

      Locations: $resource(url + '/locations/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      Configurations: $resource(url + '/configurations/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      PackTypes: $resource(url + '/packtypes/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      DiscardReasons: $resource(url + '/discardreasons/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      DonationTypes: $resource(url + '/donationtypes/:id', null,
        {
          update: {method: 'PUT'}
        }
      ),

      PasswordResets: $resource(url + '/passwordresets'),

      AuditRevisions: $resource(url + '/auditrevisions'),

      DonationSummaries: $resource(url + '/donations/summaries'),

      DonorPostDonationCounselling: $resource(url + '/donors/:donorId/postdonationcounselling'),

      PostDonationCounselling: $resource(url + '/postdonationcounsellings/:id', {id: '@id'}, {
        update: {method: 'PUT'}
      }),
      PostDonationCounsellingFormFields: $resource(url + '/postdonationcounsellings/form'),

      AdverseEventTypes: $resource(url + '/adverseevents/types/:id', {id: '@id'}, {
        update: {method: 'PUT'}
      }),

      MobileClinicLookUpFormFields: $resource(url + '/mobileclinic/form'),

      MobileClinicLookUp: $resource(url + '/mobileclinic/lookup'),

      DonationsReport: $resource(url + '/reports/collecteddonations/generate'),

      TTIPrevalenceReport: $resource(url + '/reports/ttiprevalence/generate'),

      StockLevelsReport: $resource(url + '/reports/stockLevels', {}, {
        generate: {
          method: 'GET',
          url: url + '/reports/stockLevels/generate'
        },
        getForm: {
          method: 'GET',
          url: url + '/reports/stockLevels/form'
        }
      }),

      OrderForms: $resource(url + '/orderforms/:id', {id: '@id'}, {
        update: {method: 'PUT'},
        search: {
          method: 'GET',
          url: url + '/orderforms/search'
        },
        getForm: {
          method: 'GET',
          url: url + '/orderforms/form'
        },
        getItemsForm: {
          method: 'GET',
          url: url + '/orderforms/items/form'
        }
      }),

      ReturnForms: $resource(url + '/returnforms/:id', {id: '@id'}, {
        getForm: {
          method: 'GET',
          url: url + '/returnforms/form'
        }
      }),

      Inventories: $resource(url + '/inventories/', {}, {
        search: {
          method: 'GET',
          url: url + '/inventories/search'
        },
        getSearchForm: {
          method: 'GET',
          url: url + '/inventories/search/form'
        }
      })
    };
  });
