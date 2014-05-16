'use strict';

angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap',
  'mockAPI'
])
.config(function($routeProvider, PERMISSIONS) {
	$routeProvider
		// HOME PAGE
		.when('/', {
			templateUrl : 'views/login.html',
			controller  : 'LoginCtrl'
		})

		.when('/home', {
			templateUrl : 'views/home.html',
			controller  : 'HomeCtrl',
			data: {
				permission: PERMISSIONS.VIEW_HOME
			}
		})

		// DONORS URLs
		.when('/donors', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.VIEW_DONORS
			}
		})
		.when('/findDonor', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.FIND_DONOR
			}
		})
		.when('/addDonor', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.ADD_DONOR
			}
		})
		.when('/linkDonation', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.LINK_DONATION
			}
		})
		.when('/manageClinic', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.MANAGE_CLINIC
			}
		})
		.when('/exportDonorList', {
			templateUrl : 'views/donors.html',
			controller  : 'DonorsCtrl',
			data: {
				permission: PERMISSIONS.EXPORT_DONOR_LIST
			}
		})

		.otherwise({
			redirectTo: '/home'
		});
})
  .run( ['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

  	$rootScope.$on('$locationChangeStart', function(event){
  		console.log("in locationChangeStart: ");
  		//if (!AuthService.isAuthorized($location.path)) {
  		if (!$rootScope.isLoggedIn){
            console.log("Attempt to access unauthorized route");
           // event.preventDefault();
                if($rootScope.isLoggedIn) {
                    $location.path( "/home" );
                } else {
                    $location.path( "/" );
                }

  		}
  	})

  }]);
