'use strict';
/* global readJSON: true */

describe('Controller: UserProfileCtrl', function () {

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

    scope.userDetailsForm = {
      $setPristine: angular.noop,
      $setUntouched: angular.noop
    };

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

    it('should update the master details', function() {
      httpBackend.flush(1);

      expect(scope.masterDetails.firstName).toBe('Super');
      expect(scope.masterDetails.lastName).toBe('User');
      expect(scope.masterDetails.emailId).toBe('xxxx@jembi.org');
      expect(scope.masterDetails.username).toBe('superuser');
      expect(scope.masterDetails.modifyPassword).toBe(false);
      expect(scope.masterDetails.password).toBe('');
      expect(scope.masterDetails.confirmPassword).toBe('');
    });
  });

  describe('resetUserDetails()', function() {

    beforeEach(function() {
      httpBackend.flush(1);
    });

    it('should clear the message', function() {
      scope.detailsMessage = 'Failure message';

      scope.resetUserDetails();

      expect(scope.detailsMessage).toBeNull();
    });

    it('should reset the state of the form', function() {
      spyOn(scope.userDetailsForm, '$setPristine');
      spyOn(scope.userDetailsForm, '$setUntouched');

      scope.resetUserDetails();

      expect(scope.userDetailsForm.$setPristine).toHaveBeenCalled();
      expect(scope.userDetailsForm.$setUntouched).toHaveBeenCalled();
    });

    it('should set the user details back to their initial state', function() {
      scope.userDetails.firstName = 'Test';
      scope.userDetails.lastName = 'Tester';
      scope.userDetails.emailId = 'test@jembi.org';
      scope.userDetails.username = 'testuser';
      scope.userDetails.modifyPassword = true;
      scope.userDetails.password = 'test';
      scope.userDetails.confirmPassword = 'test';

      scope.resetUserDetails();

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
