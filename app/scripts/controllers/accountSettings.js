'use strict';

angular.module('bsis')
  .controller('AccountSettingsCtrl', function ($scope, Api, Authinterceptor, AuthService, Base64) {

    $scope.masterDetails = {
      firstName: '',
      lastName: '',
      emailId: '',
      username: '',
      modifyPassword: false,
      currentPassword: '',
      password: '',
      confirmPassword: ''
    };

    $scope.userDetails = {};

    function updateUser(update, onSuccess, onError) {
      // Delete fields added by angular
      delete update.$promise;
      delete update.$resolved;

      // Make API call
      Api.Users.update({}, update, onSuccess, onError);
    }

    // Reset user details to their initial state
    $scope.resetUserDetails = function() {
      $scope.userDetails = angular.copy($scope.masterDetails);
      $scope.detailsMessage = null;
      if ($scope.userDetailsForm) {
        // If the form exists, reset it
        $scope.userDetailsForm.$setPristine();
        $scope.userDetailsForm.$setUntouched();
      }
    };

    // Update user details on form submission
    $scope.updateUserDetails = function() {
      if ($scope.userDetailsForm.$invalid) {
        $scope.detailsStyle = 'danger';
        $scope.detailsMessage = 'Please complete all of the required fields.';
        return;
      }

      // Update the user details
      var update = angular.copy($scope.userDetails);
      updateUser(update, function(updatedUser) {
        $scope.masterDetails = updatedUser;
        $scope.resetUserDetails();
        $scope.detailsStyle = 'success';
        $scope.detailsMessage = 'Your details were successfully updated.';
        AuthService.setLoggedOnUser(updatedUser);

        if (update.modifyPassword) {
          // Update credentials
          var credentials = Base64.encode(updatedUser.username + ':' + update.password);
          Authinterceptor.setCredentials(credentials);
        }
      }, function(response) {
        $scope.detailsStyle = 'danger';
        if (response.data && response.data['user.password']) {
          $scope.detailsMessage = response.data['user.password'];
        } else {
          $scope.detailsMessage = 'Updating details failed. Please try again.';
        }
      });
    };

    // Fetch user details
    Api.User.get(function(response) {
      angular.extend($scope.masterDetails, response, {
        modifyPassword: false,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
      $scope.resetUserDetails();
    }, function(err) {
      console.error(err);
      $scope.detailsStyle = 'danger';
      $scope.detailsMessage = 'Loading details failed. Please try refreshing.';
    });

  });