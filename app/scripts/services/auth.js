'use strict';

angular.module('bsis')
.factory('AuthService', function ($http, $rootScope, ROLES) {
    return {

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

       logout: function() {
              console.log("INNNN LOGOUT!!!");
                $rootScope.user = {
                    id : '',
                    userId: '',
                    role : ROLES.guest
                };
                $rootScope.isLoggedIn = false;

        }
      
    };
  });