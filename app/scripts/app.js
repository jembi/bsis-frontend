'use strict';

angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap'
])
.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'views/home.html',
			controller  : 'HomeCtrl',
		})

		.when('/donors', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})

		.otherwise({
			redirectTo: '/'
		});
});
