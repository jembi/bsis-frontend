'use strict';

var mockAPI = angular.module('mockAPI', ['ngMockE2E', 'ngResource']);
  mockAPI.run(function($httpBackend, $resource) {
    
    //console.log("IN MOCKAPI");

    // login mock
    $httpBackend.whenPOST('/login', {username: 'admin', password: '123'}).respond(
      { user:{
          id: "100",
          userId: "Admin User",
          role: "admin"
        }
      });
    // pass through all other /login attempts (will respond with a 404 (Not Found))
    $httpBackend.whenPOST('/login').passThrough();

    // findDonor mock (firstName=sample, lastName=donor)
    $httpBackend.whenGET('/findDonor?firstName=Sample&lastName=Donor').respond($resource('data/donors.json').get());
    // pass through all other /findDonor requests (will respond with a 404 (Not Found))
    $httpBackend.whenGET(/findDonor?\w+.*/).passThrough();


    $httpBackend.whenPOST('/login', {username: 'admin', password: '123'}).respond(
      { user:{
          id: "100",
          userId: "Admin User",
          role: "admin"
        }
      });

    // addDonor mock
    $httpBackend.whenGET('/addDonor').respond($resource('data/donorformfields.json').get());

    // getDonorFormFields mock
    $httpBackend.whenGET('/getDonorFormFields').respond($resource('data/donorformfields.json').get());

    // getDonorListFormFields mock
    $httpBackend.whenGET('/getDonorListFormFields').respond($resource('data/donorlistformfields.json').get());

    // getDeferrals mock
    $httpBackend.whenGET('/getDeferrals').respond($resource('data/donordeferrals.json').get());

    // getDonations mock
    $httpBackend.whenGET('/getDonations').respond($resource('data/donordonations.json').get());

    // getDonationBatch mock
    $httpBackend.whenGET('/getDonationBatch').respond($resource('data/donationbatch.json').get());

    // getComponentsByDIN mock (din=12345)
    $httpBackend.whenGET('/getComponentsByDIN?din=12345').respond($resource('data/componentsdin12345.json').get());
    // pass through all other /getComponentsByDIN requests (will respond with a 404 (Not Found))
    $httpBackend.whenGET(/getComponentsByDIN?\w+.*/).passThrough();

    // getComponentsSummary mock
    $httpBackend.whenGET('/getComponentsSummary').respond($resource('data/componentssummary.json').get());

    // Don't mock html views
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

  });