'use strict';

angular.module('bsis')
.factory('DonorService', function ($http, Api, $filter) {

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
    getDonorOverview: function (donorId, response) {
      Api.DonorOverview.get({id:donorId}, function (overview) {
        response(overview);
      }, function (){
        response(false);
      });
    },
    getDonorListFormFields: function(response){
      Api.DonorCommunicationsFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });

      /*
      return $http.get('/getDonorListFormFields')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Form Unsuccessful");
      });
      */
    },
    findDonorListDonors: function (donorSearch, response) {
      var donors = Api.DonorCommunicationsSearch.query({bloodGroups: donorSearch.bloodGroups, donorPanels: donorSearch.donorPanels, 
          clinicDate: $filter('date')(donorSearch.clinicDate,'MM/dd/yyyy'), lastDonationFromDate: $filter('date')(donorSearch.lastDonationFromDate,'MM/dd/yyyy'), 
          lastDonationToDate: $filter('date')(donorSearch.lastDonationToDate,'MM/dd/yyyy'), anyBloodGroup: donorSearch.anyBloodGroup}, function(){
        console.log("donorList response: ", donors);
        response(donors.donors);
      }, function (){
        response(false);  
      });
    },
    setDonor: function(donor) {
      donorObj = donor;
    },
    setDonors: function(donors) {
      donorsObj = donors;
    },
    getDonationsFormFields: function(response){
      Api.DonationsFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    addDonation: function (donation, response){
      // create $Resource object and assign donation values
      var addDonation = new Api.Donations();

      console.log("donation: ", donation);
      angular.copy(donation, addDonation);

      // set temporary donationDate, site & center values
      addDonation.collectedOn = '10/16/2014 12:00:00 am';
      addDonation.collectionSite = '3';
      addDonation.collectionCenter = '3';

      console.log("addDonation: ", addDonation);

      // save donation (POST /donations)
      addDonation.$save(function(data){ 
        response(true);
        console.log("addDonation response: ",data.donation);
      }, function (){
        response(false);
      }); 
    },
    getDeferralsFormFields: function(response){
      Api.DeferralsFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    addDeferral: function (deferral, response){
      // create $Resource object and assign donation values
      var addDeferral = new Api.Deferrals();

      
      angular.copy(deferral, addDeferral);

      addDeferral.deferredOn = $filter('date')(deferral.deferredOn,'MM/dd/yyyy');
      addDeferral.deferredUntil = $filter('date')(deferral.deferredUntil,'MM/dd/yyyy');

      console.log("addDeferral: ", addDeferral);

      // save deferral (POST /deferral)
      addDeferral.$save(function(data){ 
        response(true);
        console.log("addDeferral response: ",data.deferral);
      }, function (){
        response(false);
      }); 
    },
    getDeferrals: function (donorId, response) {
      Api.DonorDeferrals.get({id:donorId}, function (deferrals) {
        response(deferrals);
      }, function (){
        response(false);
      });
      /*
      return $http.get('/getDeferrals')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donor Deferrals Unsuccessful");
      });
      */
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
    getDonorBarcode: function (donorId, response) {
      Api.DonorBarcode.get({id:donorId}, function (label) {
        response(label);
      }, function (){
        response(false);
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