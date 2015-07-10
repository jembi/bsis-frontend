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
      }, function (err){
        response(false, err.data);
      });
    },

    updateUser: function (user, response) {
      var updatedUser = angular.copy(user);
      Api.Users.update({id:user.id}, updatedUser, function(data) {
        userObj = data.role;
        response(userObj);
      }, function (err){
        response(false, err.data);
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
