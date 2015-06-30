'use strict';

angular.module('bsis')
.factory('UsersService', function ($http, Api) {
  var rolesObj = {};
  var userObj = {};
  return {

    getUsers: function(response){
      Api.Users.get({}, function (apiResponse) {
        console.log("user response: ", apiResponse);
        response(apiResponse.users);
      }, function (){
        response(false);
      });
    },


    addUser: function(user, response){
      var addUser = new Api.Users();
      angular.copy(user, addUser);

      addUser.$save(function(data){
        response(data);
      }, function (){
        response(false);
      });
    },

    setUser : function (user) {
      userObj = user;
    },

    getUser: function () {
      return userObj;
    },

    setRoles : function(roles) {
      rolesObj = roles;
    },

    getRoles : function () {
      return rolesObj;
    }

  };
});
