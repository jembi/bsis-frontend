'use strict';

angular.module('bsis')
  .controller('PasswordResetCtrl', function($scope, $location, $modalInstance, UsersService, user, password) {

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
        $modalInstance.close();
      }, function() {
        scope.errorMessage = 'Setting your new password failed. Please try again.';
      });
    };
  });
