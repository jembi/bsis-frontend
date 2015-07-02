'use strict';
/* global readJSON: true */

describe('Service: Auth', function() {

  beforeEach(function() {
    jasmine.addMatchers({
      toDeepEqual: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: angular.equals(actual, expected),
              message: 'Expected objects to be deeply equal'
            };
          }
        };
      }
    });
  });

  beforeEach(module('bsis'));

  beforeEach(function(){
    module('bsis', function($provide){
      $provide.constant('APIHOST', 'localhost');
      $provide.service('Authinterceptor', function() {
        return {
          setCredentials: angular.noop,
          clearCredentials: angular.noop
        };
      });
    });
  });

  beforeEach(inject(function($rootScope, Authinterceptor) {
    spyOn($rootScope, '$broadcast').and.callThrough();
    spyOn(Authinterceptor, 'setCredentials');
    spyOn(Authinterceptor, 'clearCredentials');
  }));

  describe('login()', function() {

    var httpBackend;

    beforeEach(inject(function($httpBackend) {
      httpBackend = $httpBackend;
      httpBackend.whenGET(/\/configurations$/).respond(readJSON('test/mockData/config.json'));
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should store the logged on user and update the root scope', inject(function($rootScope, AUTH_EVENTS, AuthService, Authinterceptor, Base64) {
      var mockUser = readJSON('test/mockData/superuser.json');
      var credentials = {
        username: 'user',
        password: 'pass'
      };
      var encodedCredentials = Base64.encode(credentials.username + ':' + credentials.password);

      httpBackend.whenGET(/\/users\/login-user-details$/, function(headers) {
        return headers.authorization === 'Basic ' + encodedCredentials;
      }).respond(mockUser);

      AuthService.login(credentials, function(loggedOnUser) {
        var storedUser = angular.fromJson(localStorage.getItem('loggedOnUser'));
        expect(storedUser).toDeepEqual(mockUser);
        expect(loggedOnUser).toDeepEqual(mockUser);

        expect(Authinterceptor.setCredentials).toHaveBeenCalledWith(encodedCredentials);

        expect($rootScope.displayHeader).toBe(true);
        expect($rootScope.user).toDeepEqual(mockUser);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess);
      });

      httpBackend.flush();
    }));
  });

  describe('logout()', function() {

    beforeEach(inject(function($rootScope) {
      var mockUser = readJSON('test/mockData/superuser.json');
      localStorage.setItem('loggedOnUser', angular.toJson(mockUser));

      $rootScope.displayHeader = true;
      $rootScope.user = mockUser;
      $rootScope.sessionUserName = 'Super User';
      $rootScope.sessionUserPermissions = ['Authenticated'];
    }));

    it('should clear the logged on user and update the root scope', inject(function($rootScope, AUTH_EVENTS, ROLES, AuthService, Authinterceptor) {
      AuthService.logout();

      var storedUser = angular.fromJson(localStorage.getItem('loggedOnUser'));
      expect(storedUser).toBeNull();

      expect(Authinterceptor.clearCredentials).toHaveBeenCalled();
      expect($rootScope.user).toDeepEqual({
        id: '',
        userId: '',
        role: ROLES.guest
      });
      expect($rootScope.displayHeader).toBe(false);
      expect($rootScope.sessionUserName).toBe('');
      expect($rootScope.sessionUserPermissions).toBe('');
      expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.logoutSuccess);
    }));
  });
});
