'use strict';

angular.module('bsis')
.controller('LoginCtrl', function ($scope, $location, $modal, AuthService) {
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

        AuthService.login(credentials, function(user) {

          var password = $scope.credentials.password;

          // Reset the login form
          $scope.loginInvalid = false;
          $scope.credentials.username = null;
          $scope.credentials.password = null;
          loginForm.$setPristine();

          if (user.passwordReset) {
            $modal.open({
              controller: 'PasswordResetCtrl',
              templateUrl: 'views/template/passwordResetModal.html',
              backdrop: 'static',
              keyboard: false,
              resolve: {
                user: function() {
                  return user;
                },
                password: function() {
                  return password;
                }
              }
            });
          } else {
            $location.path('/home');
          }
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
        console.log("FORM NOT VALID");
      }

    };

  })
  .controller('PasswordResetCtrl', function($scope, $location, UsersService, user, password) {

    $scope.setPassword = function(scope) {

      if (scope.passwordResetForm.$invalid) {
        // Don't update
        return;
      }

      // Update the user details
      var update = angular.copy(user);
      update.modifyPassword = true;
      update.currentPassword = password;
      update.password = scope.newPassword;
      update.confirmPassword = scope.confirmPassword;

      UsersService.updateLoggedOnUser(update, function() {
        $location.path('/home');
      }, function() {
        scope.errorMessage = 'Setting your new password failed. Please try again.';
      });
    };
  });
