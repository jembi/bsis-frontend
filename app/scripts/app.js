'use strict';

angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap'
])
.config(function($routeProvider) {
	$routeProvider
		// HOME PAGE
		.when('/', {
			templateUrl : 'views/home.html',
			controller  : 'HomeCtrl',
		})

		// DONORS URLs
		.when('/donors', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})
		.when('/findDonor', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})
		.when('/addDonor', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})
		.when('/linkDonation', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})
		.when('/manageClinic', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})
		.when('/exportDonorList', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl'
		})

		.otherwise({
			redirectTo: '/'
		});
});