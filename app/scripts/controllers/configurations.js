'use strict';

angular.module('bsis')
  .controller('ConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    var data = [{}];
    $scope.data = data;
    $scope.configurations = {};

    $scope.clear = function () {

    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.getConfigurations = function () {
      ConfigurationsService.getConfigurations(function(response){
        if (response !== false){
          data = response;
          $scope.configurations = data;
          console.log('configurations: ', response);
        }
      });

    };

    $scope.getConfiguration = function () {
      ConfigurationsService.getConfiguration(1, function(response){
        if (response !== false){
          //data = response;
          //$scope.data = data;
          console.log('configuration id 1: ', response);
        }
      });

    };

    $scope.getConfigurations();
    $scope.getConfiguration();

  })

  .controller('UserProfileCtrl', function($scope, Api, Authinterceptor, AuthService, Base64) {

    $scope.masterDetails = {
      firstName: '',
      lastName: '',
      emailId: ''
    };
    $scope.masterPassword = {
      currentPassword: '',
      password: '',
      confirmPassword: ''
    };

    $scope.userDetails = {};
    $scope.userPassword = angular.copy($scope.masterPassword);

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
      $scope.userDetailsForm.$setPristine();
      $scope.userDetailsForm.$setUntouched();
    };

    // Update user details on form submission
    $scope.updateUserDetails = function() {
      if ($scope.userDetailsForm.$invalid) {
        $scope.detailsStyle = 'alert-danger';
        $scope.detailsMessage = 'Please complete all of the required fields.';
        return;
      }

      // Update the user details
      var update = angular.extend({modifyPassword: false}, $scope.userDetails);
      updateUser(update, function(updatedUser) {
        $scope.masterDetails = updatedUser;
        $scope.resetUserDetails();
        $scope.detailsStyle = 'alert-success';
        $scope.detailsMessage = 'Your details were successfully updated.';
        AuthService.setLoggedOnUser(updatedUser);
      }, function(err) {
        console.error(err);
        $scope.detailsStyle = 'alert-danger';
        $scope.detailsMessage = 'Updating details failed. Please try again.';
      });
    };

    $scope.resetUserPassword = function() {
      $scope.userPassword = angular.copy($scope.masterPassword);
      $scope.userPasswordForm.$setPristine();
      $scope.userPasswordForm.$setUntouched();
    };

    // Update password on form submission
    $scope.updatePassword = function() {
      var form = $scope.userPasswordForm;
      if (form.$invalid) {
        $scope.passwordStyle = 'alert-danger';
        $scope.passwordMessage = 'Please complete all of the required fields.';
        return;
      }

      if (form.password.$modelValue !== form.confirmPassword.$modelValue) {
        $scope.passwordStyle = 'alert-danger';
        $scope.passwordMessage = 'New passwords don\'t match.';
        form.$setValidity(false);
        return;
      }

      // Update the password
      var update = angular.extend({modifyPassword: true}, $scope.masterDetails, $scope.userPassword);
      updateUser(update, function(updatedUser) {

        // Update the logged on user
        var credentials = Base64.encode(updatedUser.username + ':' + update.password);
        Authinterceptor.setCredentials(credentials);

        $scope.masterDetails = updatedUser;
        $scope.resetUserPassword();
        $scope.passwordStyle = 'alert-success';
        $scope.passwordMessage = 'Your password was successfully changed.';
      }, function(err) {
        console.error(err);
        $scope.passwordStyle = 'alert-danger';
        $scope.passwordMessage = 'Changing password failed. Please try again.';
      });
    };

    // Fetch user details
    Api.User.get(function(response) {
      angular.extend($scope.masterDetails, response);
      $scope.resetUserDetails();
    }, function(err) {
      console.error(err);
    });
  });
