'use strict';

angular.module('bsis')
  .controller('ConfigurationsCtrl', function ($scope, $location, ConfigurationsService, ICONS, PERMISSIONS) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;

    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === '/settings' && path === '/profile') {
        return true;
      } else {
        return false;
      }
    };

    var data = {};
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

  .controller('UserProfileCtrl', function($scope, Api) {

    // Default values
    $scope.masterDetails = {
      firstName: '',
      lastName: '',
      email: ''
    };
    $scope.userDetails = {};
    $scope.userPassword = {
      password: '',
      confirmPassword: ''
    };

    // Fetch user details
    Api.User.get(function(response) {
      angular.extend($scope.masterDetails, response);
      $scope.resetUserDetails();
    }, function(err) {
      // TODO: Display error message
      console.error(err);
    });

    // Reset user details to their initial state
    $scope.resetUserDetails = function() {
      $scope.userDetails = angular.copy($scope.masterDetails);
      $scope.userDetailsForm.$setPristine();
      $scope.userDetailsForm.$setUntouched();
    };

    // Update user details on form submission
    $scope.updateUserDetails = function() {
      if ($scope.userDetailsForm.$invalid) {
        // TODO: Display error message
        console.log($scope.userDetailsForm.$error);
      }
      // TODO: Make API call
    };

    // Update password on form submission
    $scope.updatePassword = function() {
      if ($scope.userPasswordForm.$invalid) {
        // TODO: Check passwords match
        // TODO: Display error message
        console.log($scope.userPasswordForm.$error);
      }
      // TODO: Make API call
    };
  });
