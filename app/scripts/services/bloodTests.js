'use strict';

angular.module('bsis').factory('BloodTestsService', function(Api) {
  return {
    getBloodTests: Api.BloodTests.search
  };
});