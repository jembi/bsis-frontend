'use strict';

angular.module('bsis')
.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, Authinterceptor, $location) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    if ($location.path() === "/logout"){
      AuthService.logout();
      $location.path( "/login" );
    }

    $scope.login = function (credentials, loginForm) {

      if(loginForm.$valid){

        AuthService.login(credentials, function(loggedIn){
          if (loggedIn === true){
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            // set form back to pristine state
            loginForm.$setPristine();

            $location.path( "/home" );
            $scope.loginInvalid = false;

            //Create the session for the logged in user
            $scope.createUserSession(credentials);
            $scope.credentials.username = null;
            $scope.credentials.password = null;
          }
          else{
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $scope.loginInvalid = true;
            
            // error message for 401 - Unauthorized response
            if(loggedIn == "401"){
              $scope.loginAlert = "Invalid Username / Password.";
            }
            // error message to display when the host is unavailable
            if(loggedIn == "0"){
              $scope.loginAlert = "Unable to establish a connection. Please report this issue and try again later.";
            }
          }
        });
      }
      else{
        $scope.loginInvalid = true;
        console.log("FORM NOT VALID");
      }
      
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

          var sessionUserPermissions = [];
          var role = '';
          var permission = '';
          // iterate through the user's roles and associated permissions, and populate sessionUserPermissions with these permissions 
          for (var roleIndex in userProfile.roles){
            role = userProfile.roles[roleIndex];
            for (var permissionIndex in role.permissions){
              permission = role.permissions[permissionIndex];
              // if the permission is not already in the user permissions array, add it to the array
              if (sessionUserPermissions.indexOf(permission.name) <= -1){
                sessionUserPermissions.push(permission.name);
              }
            }
          }

          var sessionUser = userProfile.username;

          var firstName = '';
          // if firstName hasn't been set, use '' rather than null
          if (userProfile.firstName !== null){
            firstName = userProfile.firstName;
          }
          var lastName = '';
          // if lastName hasn't been set, use '' rather than null
          if (userProfile.lastName !== null){
            lastName = userProfile.lastName;
          }
          var sessionUserName = firstName + ' ' + lastName;

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 'sessionUser': sessionUser, 'sessionUserName': sessionUserName, 'sessionUserPermissions': sessionUserPermissions, 'expires': expireTime };

          // Put the object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
        }
    };

  });