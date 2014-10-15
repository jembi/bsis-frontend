'use strict';

angular.module('bsis')
.factory('DonorService', function ($http, Api) {

  var donorObj = {};
  var donorsObj = {};

  return {
    findDonor: function (donorSearch, response) {
      var donors = Api.FindDonors.query({firstName: donorSearch.firstName, lastName: donorSearch.lastName, 
          donorNumber: donorSearch.donorNumber, donationIdentificationNumber: donorSearch.donationIdentificationNumber, usePhraseMatch: donorSearch.usePhraseMatch}, function(){
        console.log("donorSearch: ", donorSearch);
        console.log("findDonors: ", donors);
        donors = donors.donors;
        donorsObj = donors;
        response(donorsObj);
      }, function (){
        response(false);  
      });

      // MOCKAPI FIND DONOR FUNCTION
      /*
       return $http.get('/findDonor', {params: { firstName: donor.donorSearch, lastName:  donor.donorSearch }})
        .success(function(data, status, headers, config){
        if (donor.Error === undefined) {
          donorsObj = data.donors;
          return data.donors;
        }
      })
      .error(function(data){
        console.log("Find Donor Unsuccessful");
      });
      */
    },
    addDonor: function (donor, response){
      // create $Resource object and assign donor values
      var addDonor = new Api.Donor();

      console.log("donor: ", donor);
      angular.copy(donor, addDonor);
      addDonor.birthDate = addDonor.month + "/" + addDonor.dayOfMonth + "/" + addDonor.year;
      console.log("addDonor: ", addDonor);

      // save donor (POST /donor) and assign response donor object to 'donorObj'
      addDonor.$save(function(data){ 
        response(true);
        donorObj = data.donor;
      }, function (){
        response(false);
      }); 

      /*
      return $http.get('/addDonor')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Add Donor Form Unsuccessful");
      });
      */
    },
    updateDonor: function (donor, response){

      var updateDonor = Api.Donor.get({id:donor.id}, function() {
        updateDonor = updateDonor.donor;

        angular.copy(donor, updateDonor);
        console.log("updateDonor: ", updateDonor);

        Api.Donor.update({id:donor.id}, updateDonor, function(data) {
         donorObj = data.donor;
         console.log("updateDonor response: ", donorObj);
         response(donorObj);
        }, function (){
          response(false);
        }); 

      });

    },
    getDonor: function(){
      return donorObj;
    },
    getDonors: function(){
      return donorsObj;
    },
    getDonorFormFields: function(response){
      Api.DonorFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
      /*
      return $http.get('/getDonorFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Form Unsuccessful");
      });
      */
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
    setDonors: function(donors) {
      donorsObj = donors;
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
    getDonations: function (donorId, response) {
      Api.DonorDonations.get({id:donorId}, function (donations) {
        response(donations);
      }, function (){
        response(false);
      });
      /*
      return $http.get('/getDonations')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Donations Unsuccessful");
      });
      */
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