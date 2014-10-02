'use strict';

angular.module('bsis')
.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $location) {
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
      AuthService.login(credentials, function(loggedIn){
        if (loggedIn){
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          $location.path( "/home" );
          $scope.loginInvalid = false;
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
  });