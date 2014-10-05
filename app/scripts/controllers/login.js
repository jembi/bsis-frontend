'use strict';

angular.module('bsis')
.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, Authinterceptor, $location) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    //if url "#/logout" is returned then destroy the session
    if ($location.path() === "/logout"){
      AuthService.logout();
    }

    $scope.login = function (credentials) {
      AuthService.login(credentials, function(loggedIn){
        if (loggedIn){
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          $location.path( "/home" );
          $scope.loginInvalid = false;

          //Create the session for the logged in user
          $scope.createUserSession(credentials);
        }
        else{
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          $scope.loginInvalid = true;
          $scope.credentials.username = null;
          $scope.credentials.password = null;
        }
      });
        
      // MOCKAPI LOGIN FUNCTION
      /*
      AuthService.login(credentials, ).then(function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $location.path( "/home" );
        $scope.loginInvalid = false;
      }, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        $scope.loginInvalid = true;
        $scope.credentials.username = null;
        $scope.credentials.password = null;
      });
      */
      
    };

    $scope.createUserSession = function(credentials){

         // get the logged in user details
        var userProfile = AuthService.getLoggedInUser();
        // check if userProfile exists
        if ( !userProfile.roles ){
          return 'Logged in user could not be found!';
        }else{
          var currentTime = new Date();
          //add 1 hour onto timestamp (1 hour persistence time)
          var expireTime = new Date(currentTime.getTime() + (1*1000*60*60));
          //generate random sessionID
          var sessionID = Math.random().toString(36).slice(2).toUpperCase();

          var sessionUserRoles = userProfile.roles;

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 'sessionUser': credentials.username, 'sessionUserRoles': sessionUserRoles, 'expires': expireTime };

          // Put the object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
        }
    };

  });