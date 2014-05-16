var mockAPI = angular.module('mockAPI', [ 'ngMockE2E']);
  mockAPI.run(function($httpBackend) {
    

    // login mock
    $httpBackend.whenPOST('/login', {username: 'admin', password: '123'}).respond(
      { user:{
          id: "100",
          userId: "Admin User",
          role: "admin"
        }
      })

    // Don't mock html views
    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

  });