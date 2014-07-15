'use strict';

angular.module('bsis')
.factory('DonorService', function ($http) {
  return {
    findDonor: function (donor) {
       return $http.get('/findDonor', {params: { firstName: donor.firstName, lastName:  donor.lastName }})
        .success(function(data, status, headers, config){
        if (donor.Error === undefined) {
          console.log("donor.firstName: ",data.donor.firstName);
          console.log("donor.lastName: ",data.donor.lastName);
          return data.donor;
        }
      })
      .error(function(data){
        console.log("Find Donor Unsuccessful");
      });
    }
  };
});