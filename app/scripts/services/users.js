'use strict';

angular.module('bsis')
.factory('UsersService', function ($http, Api) {
  return {

    getUsers: function(response){
      Api.Users.get({}, function (apiResponse) {
        console.log("user response: ", apiResponse);
        response(apiResponse.users);
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
