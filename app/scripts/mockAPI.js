'use strict';

var mockAPI = angular.module('mockAPI', [ 'ngMockE2E']);
  mockAPI.run(function($httpBackend) {
    
    //console.log("IN MOCKAPI");

    // login mock
    $httpBackend.whenPOST('/login', {username: 'admin', password: '123'}).respond(
      { user:{
          id: "100",
          userId: "Admin User",
          role: "admin"
        }
      });

    $httpBackend.whenGET('/findDonor?firstName=sample&lastName=donor').respond(
      { donors:{
          firstName: "Sample",
          lastName: "Donor",
          donorNum: "000001",
          gender: "Male",
          birthDate: "10/01/1980"
        }
      });

    // Don't mock html views
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

  });