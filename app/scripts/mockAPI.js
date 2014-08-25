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

    // findDonor mock (firstName=sample, lastName=donor)
    $httpBackend.whenGET('/findDonor?firstName=sample&lastName=donor').respond(
      {
      "donors": [
      { 
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000001",
        gender: "Male",
        dob: "10/01/1965"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000002",
        gender: "Female",
        dob: "12/10/1980"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000003",
        gender: "Female",
        dob: "20/01/1975"
      },
      {
        firstName: "Sample",
        lastName: "Donorific",
        donorNum: "000004",
        gender: "Male",
        dob: "10/01/1975"
      },
      {
        firstName: "Samplee",
        lastName: "Donor",
        donorNum: "000005",
        gender: "Female",
        dob: "10/05/1975"
      }
      ,
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000006",
        gender: "Female",
        dob: "10/05/1975"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000007",
        gender: "Female",
        dob: "10/05/1980"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000008",
        gender: "Female",
        dob: "10/05/1975"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000009",
        gender: "Female",
        dob: "10/05/1975"
      },
      {
        firstName: "Samplee",
        lastName: "Donor",
        donorNum: "000010",
        gender: "Female",
        dob: "10/05/1975"
      },
      {
        firstName: "Sample",
        lastName: "Donor",
        donorNum: "000011",
        gender: "Female",
        dob: "10/05/1990"
      }
      ]
    });
    // pass through all other /findDonor requests (will respond with a 404 (Not Found))
    $httpBackend.whenGET(/findDonor?\w+.*/).passThrough();

    // Don't mock html views
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

  });