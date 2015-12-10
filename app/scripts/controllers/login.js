'use strict';

angular.module('bsis')
  .controller('LoginCtrl', function ($scope, $location, AuthService) {
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

        AuthService.login(credentials, function() {

          // Reset the login form
          $scope.loginInvalid = false;
          $scope.credentials.username = null;
          $scope.credentials.password = null;
          loginForm.$setPristine();

          $location.path('/home');
        }, function(statusCode) {
          $scope.loginInvalid = true;

          // error message for 401 - Unauthorized response
          if (statusCode === 401) {
              $scope.loginAlert = "Invalid Username / Password.";
          }

          // error message to display when the host is unavailable
          if (statusCode === 0) {
              $scope.loginAlert = "Unable to establish a connection. Please report this issue and try again later.";
          }
        });
      }
      else{
        $scope.loginInvalid = true;
        $scope.loginAlert = "Please supply all fields";
      }

    };

  });
