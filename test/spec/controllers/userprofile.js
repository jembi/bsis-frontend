'use strict';
/* global readJSON: true */

describe('Controller: LoginCtrl', function () {

  beforeEach(module('bsis'));

  beforeEach(function(){
    module('bsis', function($provide){
      $provide.constant('SYSTEMCONFIG', readJSON('test/mockData/systemconfig.json'));
      $provide.constant('USERCONFIG', readJSON('test/mockData/userconfig.json'));
    });
  });

  var httpBackend;
  var scope;

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    $controller('UserProfileCtrl', {$scope: scope});

    httpBackend = $httpBackend;
    $httpBackend.whenGET(/\/users\/login-user-details$/).respond(readJSON('test/mockData/superuser.json'));
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('initial load', function() {

    it('should set the user details', function() {
      httpBackend.flush(1);

      expect(scope.userDetails.firstName).toBe('Super');
      expect(scope.userDetails.lastName).toBe('User');
      expect(scope.userDetails.emailId).toBe('xxxx@jembi.org');
      expect(scope.userDetails.username).toBe('superuser');
      expect(scope.userDetails.modifyPassword).toBe(false);
      expect(scope.userDetails.password).toBe('');
      expect(scope.userDetails.confirmPassword).toBe('');
    });
  });
});
