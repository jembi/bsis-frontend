'use strict';

angular.module('bsis')
.factory('DonorService', function ($http, Api, $filter) {

  var donorObj = {};
  var donationBatchObj = {};
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
    },
    addDonor: function (donor, response){
      // create $Resource object and assign donor values
      var addDonor = new Api.Donor();
      angular.copy(donor, addDonor);

      // save donor (POST /donor) and assign response donor object to 'donorObj'
      addDonor.$save(function(data){ 
        response(true);
        donorObj = data.donor;
      }, function (){
        response(false);
      }); 
    },
    updateDonor: function (donor, response){

      var updateDonor = Api.Donor.get({id:donor.id}, function() {
        updateDonor = updateDonor.donor;
        var birthDate = updateDonor.birthDate;

        angular.copy(donor, updateDonor);
        updateDonor.birthDate = birthDate;

        Api.Donor.update({id:donor.id}, updateDonor, function(data) {
         donorObj = data.donor;
         response(donorObj);
        }, function (){
          response(false);
        }); 

      });

    },
    getDonor: function(){
      return donorObj;
    },
    getDonationBatch: function(){
      return donationBatchObj;
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
    },
    findDonorListDonors: function (donorSearch, response) {
      var donors = Api.DonorCommunicationsSearch.query({bloodGroups: donorSearch.bloodGroups, donorPanels: donorSearch.donorPanels,
          clinicDate: donorSearch.clinicDate, lastDonationFromDate: donorSearch.lastDonationFromDate,
          lastDonationToDate: donorSearch.lastDonationToDate, anyBloodGroup: donorSearch.anyBloodGroup, noBloodGroup: donorSearch.noBloodGroup}, function(){
        response(donors.donors);
      }, function () {
        response(false);
      });
    },
    setDonor: function(donor) {
      donorObj = donor;
    },
    setDonationBatch: function(donationBatch) {
      donationBatchObj = donationBatch;
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
    addDonationToBatch: function (donation, response){
      // create $Resource object and assign donation values
      var addDonation = new Api.Donations();

      angular.copy(donation, addDonation);

      // save donation (POST /donations)
      addDonation.$save(function(data){ 
        // refresh donation batch after adding donation to it, and add to response
        Api.DonationBatches.get({id:donationBatchObj.id}, function (donationBatch){
          donationBatchObj = donationBatch.donationBatch;
          response(donationBatch.donations);
        });
      }, function (){
        response(false);
      }); 
    },
    addDonation: function (donation, response){
      // create $Resource object and assign donation values
      var addDonation = new Api.Donations();

      angular.copy(donation, addDonation);

      // save donation (POST /donations)
      addDonation.$save(function(data){ 
        response(true);
      }, function (){
        response(false);
      }); 
    },
    updateDonation: function (donation, response){

      var updateDonation = Api.Donations.get({id:donation.id}, function() {
        updateDonation = updateDonation.donation;

        angular.copy(donation, updateDonation);

        Api.Donations.update({id:donation.id}, updateDonation, function(data) {
         response(data.donation);
        }, function (){
          response(false);
        }); 

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
    },
    getDonations: function (donorId, response) {
      Api.DonorDonations.get({id:donorId}, function (donations) {
        response(donations);
      }, function (){
        response(false);
      });
    },
    getDonorBarcode: function (donorId, response) {
      Api.DonorBarcode.get({id:donorId}, function (label) {
        response(label);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/zpl,' + encodeURI(label.labelZPL);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'barcode.bc';
        hiddenElement.click();

      }, function (){
        response(false);
      });
    },
    getDonationBatchDonations: function (donor) {
       return $http.get('/getDonationBatch')
        .success(function(data, status, headers, config){
          return data;
      })
      .error(function(data){
        console.log("Get Donation Batch Unsuccessful");
      });
    },
    getDonationBatchFormFields: function(response){
      Api.DonationBatchFormFields.get({}, function (backingForm) {
        response(backingForm);
      }, function (){
        response(false);
      });
    },
    getOpenDonationBatches: function (response) {
      Api.FindDonationBatches.query({isClosed:false}, function (donationBatches) {
        response(donationBatches);
      }, function (){
        response(false);
      });
    },
    getRecentDonationBatches: function (response) {
      Api.RecentDonationBatches.get({count:10}, function (donationBatches) {
        response(donationBatches);
      }, function (){
        response(false);
      });
    },
    addDonationBatch: function (donationBatch, response){
      // create $Resource object and assign donation values
      var addDonationBatch = new Api.DonationBatches();

      angular.copy(donationBatch, addDonationBatch);

      // save deferral (POST /deferral)
      addDonationBatch.$save(function(data){ 
        response(true);
      }, function (){
        response(false);
      }); 
    },
    closeDonationBatch: function (donationBatch, response){
      var updateDonationBatch = Api.DonationBatches.get({id:donationBatch.id}, function() {
        updateDonationBatch = updateDonationBatch.donationBatch;

        updateDonationBatch.isClosed = true;
        updateDonationBatch.donorPanel = updateDonationBatch.donorPanel.id;

        Api.DonationBatches.update({id:donationBatch.id}, updateDonationBatch, function(data) {
         response(data.donationBatch);
        }, function (){
          response(false);
        }); 

      });
    },

    getDonorSummaries: function(donorNumber, response) {
      Api.DonorSummaries.get({donorNumber: donorNumber}, function(data) {
        response(data.donor);
      }, function() {
        response(false);
      });
    }
  };
});
