'use strict';

angular.module('bsis')
    .controller('ForgotPasswordCtrl', function($scope, Api) {

      $scope.username = '';
      $scope.resetting = false;
      $scope.messageStyle = '';
      $scope.message = '';

      $scope.resetPassword = function() {
        if ($scope.forgotPasswordForm.$invalid) {
          $scope.messageStyle = 'danger';
          $scope.message = 'You need to provide a username';
          return;
        }

        $scope.resetting = true;

        Api.PasswordResets.save({username: $scope.username}, function() {
          $scope.resetting = false;
          $scope.username = '';
          $scope.forgotPasswordForm.$setPristine();
          $scope.forgotPasswordForm.$setUntouched();
          $scope.messageStyle = 'success';
          $scope.message = 'Your password has been reset. Please check your email for the new password.';
        }, function() {
          $scope.resetting = false;
          $scope.messageStyle = 'danger';
          $scope.message = 'Password reset failed. Please make sure that you have entered the correct username and try again.';
        });
      };
    });
