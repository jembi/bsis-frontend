'use strict';

angular.module('bsis', [
  'ngRoute',
  'ui.bootstrap',
  'mockAPI'
])
.config(function($routeProvider, USER_ROLES) {
	$routeProvider
		// HOME PAGE
		.when('/', {
			templateUrl : 'views/_login.html',
			controller  : 'LoginCtrl',
		})

		.when('/home', {
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
})
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  })
  .controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
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
	    //  console.log("Session.id: ", userRole);
	    //  console.log("Session.id: ", userId);
	    //  console.log("Session.id: ", userRole);
	       // console.log($rootScope.user.roleeee);
      	}, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        console.log("NOPPPPE");
      });
    };
  })
  .factory('AuthService', function ($http, $rootScope, Session) {
    return {

      login: function (credentials) {
         return $http.post('/login', {username: credentials.username, password: credentials.password})
          .success(function(user){
	        if (user.Error === undefined) {
	          //Session.create(data.user.id, data.user.userId, data.user.role)
	          $rootScope.user = user.user;
	          //$rootScope.user = data;
	          console.log("user.userid: ",user.user.userId);
	          console.log("Login Successful");
	        }
	      })
	      .error(function(data){
	      	console.log("Login Unsuccessful");
	      });
      },

      isAuthenticated: function(user) {
            if(user === undefined)
                user = $rootScope.user;
            return user.role === USER_ROLES.admin || user.role === USER_ROLES.editor;
       },

       isAuthorized: function(accessLevel, role) {
            if(role === undefined)
                role = $rootScope.user.role;
            return accessLevel &amp; role;
        },

       logout: function() {
            
                $rootScope.user = {
                    id : '',
                    userId: '',
                    role : USER_ROLES.guest
                };

        }


/*
      isAuthenticated: function () {
        return !!Session.userId;
      },
      isAuthorized: function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
      },
*/      
      
    };
  })
  .service('Session', function () {
    this.create = function (sessionId, userId, role) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };
    return this;
  })
  .controller('ApplicationCtrl', function ($scope,
	                                               USER_ROLES,
	                                               AuthService) {
	  $scope.currentUser = null;
	  $scope.userRoles = USER_ROLES;
	  $scope.isAuthorized = AuthService.isAuthorized;
	})

  .run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (!AuthService.isAuthorized($location.path)) {
            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
            event.preventDefault();
                if(AuthService.isLoggedIn()) {
                    $state.go('user.home');
                } else {
                    $rootScope.error = null;
                    $state.go('anon.login');
                }
            
        }
    });
;