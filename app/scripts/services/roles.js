'use strict';

angular.module('bsis')
.factory('RolesService', function ($http, Api, $filter) {
  return {

    getRoles: function(response){
      Api.Roles.get({}, function (apiResponse) {
        response(apiResponse.allRoles);
      }, function (){
        response(false);
      });
    },

    getRole: function (id, response) {
      var apiResponse = Api.Roles.get({id: id}, function(){
        console.log("role response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

  };
});
