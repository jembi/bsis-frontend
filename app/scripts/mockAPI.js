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
    $httpBackend.whenGET('/findDonor?firstName=sample&lastName=donor').respond($resource('data/donors.json').get());
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

    // Don't mock html views
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

  });