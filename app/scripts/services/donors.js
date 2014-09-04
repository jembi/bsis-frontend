'use strict';

angular.module('bsis')
.factory('DonorService', function ($http) {

  var donorObj = {};
  var donorsObj = {};

  return {
    findDonor: function (donor) {
       return $http.get('/findDonor', {params: { firstName: donor.firstName, lastName:  donor.lastName }})
        .success(function(data, status, headers, config){
        if (donor.Error === undefined) {
          donorsObj = data.donors;
          return data.donors;
        }
      })
      .error(function(data){
        console.log("Find Donor Unsuccessful");
      });
    },
    addDonor: function (){
      return $http.get('/addDonor')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Add Donor Form Unsuccessful");
      });
    },
    getDonor: function(){
      return donorObj;
    },
    getDonorFormFields: function(){
      return $http.get('/getDonorFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Form Unsuccessful");
      });
    },
    getDonorListFormFields: function(){
      return $http.get('/getDonorListFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Form Unsuccessful");
      });
    },
    setDonor: function(donor) {
      donorObj = donor;
    },
    getDeferrals: function (donor) {
       return $http.get('/getDeferrals')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Deferrals Unsuccessful");
      });
    },
    getDonations: function (donor) {
       return $http.get('/getDonations')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Donations Unsuccessful");
      });
    },
    getDonationBatch: function (donor) {
       return $http.get('/getDonationBatch')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donation Batch Unsuccessful");
      });
    }
  };
});