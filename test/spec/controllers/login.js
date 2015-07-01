'use strict';
/* global readJSON: true */
/* jshint expr: true */

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('bsis'));


  // setup system & user config constants
  beforeEach(function(){
    module('bsis', function($provide){
      $provide.constant( 'SYSTEMCONFIG', readJSON('test/mockData/systemconfig.json') );
      $provide.constant( 'USERCONFIG', readJSON('test/mockData/userconfig.json') );
    });
  });


  // instantiate service
  //var _AuthService_, httpBackend;
  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    // reset localStorage session variable
    localStorage.removeItem('consoleSession');

    httpBackend = $httpBackend;

    httpBackend.when('GET', new RegExp('.*/users/login-user-details')).respond( readJSON('test/mockData/superuser.json') );
    httpBackend.when('GET', new RegExp('.*/configurations')).respond( readJSON('test/mockData/userconfig.json') );

    createController = function() {
      scope = $rootScope.$new();
      return $controller('LoginCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });


  // Testing the login() function
  describe('*login()', function () {

    // process the createUserSession() function and throw no user profile found error
    it('should run the login() and successfully login a valid user', function () {
      createController();

      var credentials = {username: 'superuser', password: 'superuser'};
      var loginForm = { $valid: true, $setPristine: function(){} };

      // run the login function
      scope.login( credentials, loginForm );
      httpBackend.flush();

      // loginAlert should be undefined and loginInvalid should be false
      expect( scope.loginAlert ).toBe( undefined );
      expect( scope.loginInvalid ).toBe( false );
    });

    it('should run the login() and reject login - loginAlert exists', function () {
      createController();

      var credentials = {username: 'superuser', password: 'superuser'};
      var loginForm = { $valid: false, $setPristine: function(){} };
      
      // run the login function
      scope.login( credentials, loginForm );
      httpBackend.flush();

      // loginAlert should have a message and loginInvalid should be true
      expect( scope.loginAlert ).toBe( 'Please supply all fields' );
      expect( scope.loginInvalid ).toBe( true );
    });

  });


  // Testing the createUserSession() function
  describe('*createUserSession()', function () {

    // process the createUserSession() function and throw no user profile found error
    it('should run the createUserSession() function and throw error if user profile not found', function () {
      createController();

      var credentials = {username: 'superuser', password: 'superuser'};

      // create the session object to store session data
      var sessionResult = scope.createUserSession(credentials);
      httpBackend.flush();
      // user not yet logged in so no userProfile exist
      expect( sessionResult ).toBe( 'Logged in user could not be found!' );
    });

    // process the createUserSession() function and create user session successfully
    it('should run the createUserSession() function and create a user session successfully', function () {
      
      createController();

      var credentials = {username: 'superuser', password: 'superuser'};
      var loginForm = { $valid: true, $setPristine: function(){} };
      scope.login( credentials, loginForm );
      httpBackend.flush();

      
      // create the session object to store session data
      var sessionResult = scope.createUserSession(credentials);
      // user not yet logged in so no userProfile exist
      expect( sessionResult ).toBe( 'Session created!' );


      var consoleSession = localStorage.getItem('consoleSession');
      expect( consoleSession ).not.toBe(null);


      expect( JSON.parse( consoleSession).sessionUserName ).toBe('Super User');
      expect( JSON.parse( consoleSession).sessionUser ).toBe('superuser');

    });

  });



});