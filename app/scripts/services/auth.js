'use strict';

angular.module('bsis')
.factory('AuthService', function ($http, $rootScope, ROLES, Api, Authinterceptor, Base64) {

  var userProfile = {};

  return {

    login: function (credentials, loginSuccess) {
      var encoded = Base64.encode(credentials.username + ':' + credentials.password);
      $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      Api.User.get({}, function (profile) {
        userProfile = profile;
        $rootScope.user = userProfile;
        $rootScope.displayHeader = true;
        Authinterceptor.setLoggedInUser(userProfile, encoded);
        console.log("Login Successful");
        loginSuccess(true);
      }, function (){
        $rootScope.displayHeader = false;
        $rootScope.user = {};
        console.log("Login Unsuccessful");
        loginSuccess(false);
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
      $rootScope.displayHeader = false;
      $rootScope.sessionUserName = '';
      $rootScope.sessionUserPermissions = '';
      localStorage.removeItem('consoleSession');
      localStorage.removeItem('auth');
      localStorage.removeItem('loggedOnUser');
    },
    getLoggedInUser: function () {
      return userProfile;
    },
    isLoggedIn: function () {
      if (userProfile !== null){
        return true;
      } else {
        return false;
      }
    }

  };
});