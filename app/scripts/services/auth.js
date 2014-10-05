'use strict';

angular.module('bsis')
.factory('AuthService', function ($http, $rootScope, ROLES, Api, Authinterceptor, Base64) {

  var userProfile = {};

  return {

    // MOCKAPI LOGIN FUNCTION
    /* 
    login: function (credentials) {
       return $http.post('/login', {username: credentials.username, password: credentials.password})
        .success(function(user){
        if (user.Error === undefined) {
          $rootScope.user = user.user;
          $rootScope.isLoggedIn = true;
          //$rootScope.user = data;
          console.log("user.userid: ",user.user.userId);
          console.log("Login Successful");
        }
      })
      .error(function(data){
        console.log("Login Unsuccessful");
      });
    },
    */

    login: function (credentials, done) {
      var encoded = Base64.encode(credentials.username + ':' + credentials.password);
      $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      Api.User.get({}, function (profile) {
        userProfile = profile;
        $rootScope.user = userProfile;
        $rootScope.isLoggedIn = true;
        Authinterceptor.setLoggedInUser(userProfile, encoded);
        console.log("Login Successful");
        done(true);
      }, function (){
        $rootScope.isLoggedIn = false;
        $rootScope.user = {};
        console.log("Login Unsuccessful");
        done(false);
      });
    },

    isAuthenticated: function(user) {
      if(user === undefined)
          user = $rootScope.user;
      return user.role === ROLES.admin || user.role === ROLES.editor;
     },

     /*isAuthorized: function(accessLevel, role) {
        if(role === undefined)
          role = $rootScope.user.role;
        return accessLevel &amp; role;
      },
      */

    logout: function () {
      userProfile = null;
      $rootScope.user = {
        id : '',
        userId: '',
        role : ROLES.guest
      };
      $rootScope.isLoggedIn = false;
      localStorage.removeItem('consoleSession');
      localStorage.removeItem('auth');
      localStorage.removeItem('loggedOnUser');
    },
    getLoggedInUser: function () {
      return userProfile;
    },
    isLoggedIn: function () {
      return $rootScope.isLoggedIn;
    }

  };
});