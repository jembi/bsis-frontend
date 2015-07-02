'use strict';
/* global readJSON: true */

describe('Service: Auth', function() {

  var httpBackend;

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

  beforeEach(inject(function($httpBackend, Authinterceptor) {
    httpBackend = $httpBackend;

    httpBackend.whenGET(/\/configurations$/).respond(readJSON('test/mockData/config.json'));

    spyOn(Authinterceptor, 'setCredentials');
    spyOn(Authinterceptor, 'clearCredentials');
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('login()', function() {

    it('should store the logged on user and update the root scope', inject(function($rootScope, AUTH_EVENTS, AuthService, Authinterceptor, Base64) {
      spyOn($rootScope, '$broadcast').and.callThrough();

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
});
