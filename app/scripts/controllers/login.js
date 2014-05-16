'use strict';

angular.module('bsis')
.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $location) {
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
    	console.log(credentials.username);
    	console.log(credentials.password);
          AuthService.login(credentials).then(function () {
	        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	       	console.log("user.id: ", $rootScope.user.id);
	       	console.log("user.userId: ", $rootScope.user.userId);
	       	console.log("user.Role: ", $rootScope.user.role);
	       	$location.path( "/home" );
      	}, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        console.log("NOPPPPE");
      });
    };
  });