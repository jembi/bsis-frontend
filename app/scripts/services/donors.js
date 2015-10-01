'use strict';

angular.module('bsis')
.factory('DonorService', function ($http, Api) {

  var donorObj = {};
  var donationBatchObj = {};
  var donorsObj = {};
  var mergedDonor = {};

  return {

    findDonor: function(donorSearch, onSuccess, onError) {
      var query = {
        firstName: donorSearch.firstName,
        lastName: donorSearch.lastName, 
        donorNumber: donorSearch.donorNumber,
        donationIdentificationNumber: donorSearch.donationIdentificationNumber,
        usePhraseMatch: donorSearch.usePhraseMatch
      };
      Api.FindDonors.query(query, function(response) {
        // Keep a reference to the donors
        donorsObj = response.donors;
        onSuccess(response);
      }, onError);
    },

    addDonor: function (donor, onSuccess, onError){
      // create $Resource object and assign donor values
      var addDonor = new Api.Donor();
      angular.copy(donor, addDonor);

      // save donor (POST /donor) and assign response donor object to 'donorObj'
      addDonor.$save(function(response){
        donorObj = response.donor;
        onSuccess(response.donor);
      }, function (err){
        onError(err.data);
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
    getDonorById: function (id, onSuccess, onFailure) {
      Api.Donor.get({id:id}, function(response) {
        onSuccess(response.donor);
      }, function (err){
        onFailure(err.data);
      });
    },
    getDonationBatch: function(){
      return donationBatchObj;
    },

    getDonationBatchById: function (id, onSuccess, onFailure) {
      Api.DonationBatches.get({id:id}, function(response) {
        onSuccess(response.donationBatch);
      }, function (err){
        onFailure(err.data);
      });
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
    findDonorListDonors: function (donorSearch, onSuccess, onError) {
      var donors = Api.DonorCommunicationsSearch.query({bloodGroups: donorSearch.bloodGroups, venues: donorSearch.venues,
          clinicDate: donorSearch.clinicDate, lastDonationFromDate: donorSearch.lastDonationFromDate,
          lastDonationToDate: donorSearch.lastDonationToDate, anyBloodGroup: donorSearch.anyBloodGroup, noBloodGroup: donorSearch.noBloodGroup}, function(){
        onSuccess(donors.donors);
      }, function(err) {
        onError(err.data);
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
    addDonationToBatch: function (donation, onSuccess, onError){
      // create $Resource object and assign donation values
      var addDonation = new Api.Donations();

      angular.copy(donation, addDonation);

      // save donation (POST /donations)
      addDonation.$save(function(data){
        // refresh donation batch after adding donation to it, and add to response
        Api.DonationBatches.get({id:donationBatchObj.id}, function (donationBatch){
          donationBatchObj = donationBatch.donationBatch;
          onSuccess(donationBatch.donationBatch);
        });
      }, function (err){
        onError(err.data);
      });
    },
    addDonation: function (donation, onSuccess, onError){
      // create $Resource object and assign donation values
      var addDonation = new Api.Donations();

      angular.copy(donation, addDonation);

      if (addDonation.adverseEvent && !addDonation.adverseEvent.type) {
        addDonation.adverseEvent = null;
      }

      // save donation (POST /donations)
      addDonation.$save(function(data){
        onSuccess(true);
      }, function (err){
        onError(err.data);
      });
    },
    updateDonation: function (donation, response){

      var updateDonation = Api.Donations.get({id:donation.id}, function() {
        updateDonation = updateDonation.donation;

        angular.copy(donation, updateDonation);

        if (updateDonation.adverseEvent && !updateDonation.adverseEvent.type) {
          updateDonation.adverseEvent = null;
        }

        Api.Donations.update({id:donation.id}, updateDonation, function(data) {
         response(data.donation);
        }, function (){
          response(false);
        });

      });
    },
    deleteDonation: function(donationId, onSuccess, onError) {
      Api.Donations.delete({id: donationId}, onSuccess, onError);
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
    getDonationBatchFormFields: function(onSuccess, onError){
      Api.DonationBatchFormFields.get({}, onSuccess, function(err) {
        onError(err.data);
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
    addDonationBatch: function (donationBatch, onSuccess, onError){
      // create $Resource object and assign donation values
      var addDonationBatch = new Api.DonationBatches();

      angular.copy(donationBatch, addDonationBatch);

      // save deferral (POST /deferral)
      addDonationBatch.$save(function(data){
        onSuccess(true);
      }, function (err){
        onError(err.data);
      }); 
    },
    closeDonationBatch: function (donationBatch, response){
      var updateDonationBatch = Api.DonationBatches.get({id:donationBatch.id}, function() {
        updateDonationBatch = updateDonationBatch.donationBatch;

        updateDonationBatch.isClosed = true;
        updateDonationBatch.venue = updateDonationBatch.venue.id;

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
    },

    getDonorPostDonationCounselling: function(donorId, onSuccess, onError) {
      Api.DonorPostDonationCounselling.get({donorId: donorId}, onSuccess, onError);
    },

    deleteDonor: function(donorId, onSuccess, onError) {
      Api.Donors.delete({id: donorId}, onSuccess, onError);
    },

    findAllDonorDuplicates: function(response){
      Api.AllDonorDuplicates.get({}, function (data) {
        response(data);
      }, function (){
        response(false);
      });
    },

    findDonorDuplicates: function(donorNumber, response){
      Api.DonorDuplicates.get({donorNumber: donorNumber}, function (data) {
        response(data);
      }, function (){
        response(false);
      });
    },

    mergeDonorsDuplicate: function(donorNumber, donors, onSuccess, onError) {
      // create $Resource object and assign donor values
      var duplicateDonors = new Api.DonorMergeDuplicates();
      angular.copy(donors, duplicateDonors);
      // save donation (POST /donations)
      duplicateDonors.$save({donorNumber: donorNumber}, function(data) {
        onSuccess(data.donor);
      }, function (err){
        onError(err.data);
      });
    }

  };
});
