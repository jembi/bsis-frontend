'use strict';

angular.module('bsis')

  .factory('Api', function ($resource, $http, APIHOST, APIPORT, APIAPP) {

    var url = 'http://' + APIHOST + ':' + APIPORT + '/' + APIAPP;

    return {
      User: $resource(url + '/user' , {}, {
        get: {
          method: 'GET'
        }
      }),

      Donor: $resource(url + '/donor:id'),

      DonorFormFields: $resource(url + '/donor' , {}, {
        get: {
          method: 'GET'
        }
      })

    };
});