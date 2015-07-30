'use strict';

angular.module('bsis')
  .controller('AccountSettingsCtrl', function ($scope, UsersService) {

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
      UsersService.updateLoggedOnUser($scope.userDetails, function(updatedUser) {
        $scope.masterDetails = updatedUser;
        $scope.resetUserDetails();
        $scope.detailsStyle = 'success';
        $scope.detailsMessage = 'Your details were successfully updated.';
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
    UsersService.getLoggedOnUser(function(response) {
      angular.extend($scope.masterDetails, response, {
        modifyPassword: false,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
      $scope.resetUserDetails();
    }, function(err) {
      $scope.detailsStyle = 'danger';
      $scope.detailsMessage = 'Loading details failed. Please try refreshing.';
    });

  });
