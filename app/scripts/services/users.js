'use strict';

angular.module('bsis')
.factory('UsersService', function ($http, Api, $filter) {
  return {

    getUsers: function(response){
      Api.Users.get({}, function (apiResponse) {
        response(apiResponse.userRoles);
      }, function (){
        response(false);
      });
    },

    getUser: function (id, response) {
      var apiResponse = Api.Users.get({id: id}, function(){
        console.log("user response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

  };
});
