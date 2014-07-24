'use strict';

angular.module('bsis')
.factory('DonorService', function ($http) {

  var donorrr = {
    firstName: 'Yes',
    lastName: 'You',
    donorNum: ''
  };

  return {
    findDonor: function (donor) {
       return $http.get('/findDonor', {params: { firstName: donor.firstName, lastName:  donor.lastName }})
        .success(function(data, status, headers, config){
        if (donor.Error === undefined) {
          console.log("donor.firstName: ",data.donor.firstName);
          console.log("donor.lastName: ",data.donor.lastName);
          donorrr = data.donor;
          return data.donor;
        }
      })
      .error(function(data){
        console.log("Find Donor Unsuccessful");
      });
    },
    getDonor: function(){
      return donorrr;
    }
  };
});