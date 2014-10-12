'use strict';

angular.module('bsis')
.factory('DonorService', function ($http, Api) {

  var donorObj = {};
  var donorsObj = {};

  return {
    findDonor: function (donorSearch, response) {
      var donors = Api.FindDonors.query({firstName: donorSearch.firstName, lastName: donorSearch.lastName}, function(){
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
      addDonor.firstName = donor.firstName;
      addDonor.lastName = donor.lastName;
      addDonor.title = donor.title;
      addDonor.gender = donor.gender;
      addDonor.donorPanel = donor.donorPanel;
      addDonor.preferredLanguage = donor.preferredLanguage;
      addDonor.dayOfMonth = donor.dayOfMonth;
      addDonor.month = donor.month;
      addDonor.year = donor.year;

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
      console.log("IN DONOR SERVICE...");
      console.log("donor.idNumber: ", donor.idNumber);
      console.log("donor.id: ", donor.id);
      console.log("donor: ", donor);

      var updateDonor = Api.Donor.get({id:donor.id}, function() {
        updateDonor = updateDonor.donor;

        updateDonor.idNumber = '1234567890';

        var yesDonor = Api.Donor.update({id:donor.id}, updateDonor, function() {
         response(true);
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