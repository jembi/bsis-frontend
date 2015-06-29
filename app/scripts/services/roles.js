'use strict';

angular.module('bsis')
.factory('RolesService', function ($http, Api, $filter) {

  var roleObj = {};
  var permissionsObj = {};

  return {

    getRoles: function(response){
      Api.Roles.get({}, function (apiResponse) {
        response(apiResponse.roles);
      }, function (){
        response(false);
      });
    },

    getAllPermissions : function (response){
      Api.Permissions.get({}, function (apiResponse) {
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

    getRoleById: function (id, response) {
      var apiResponse = Api.Roles.get({id: id}, function(){
        console.log("role response: ", apiResponse);
        response(apiResponse);
      }, function (){
        response(false);
      });
    },

    updateRole : function (role, response) {

      var roleObj = {};

      var updatedRole = angular.copy(role);

      role.permissions.forEach( function (item) {
        updatedRole.permissions.push("" + item.id);
      });

      Api.Roles.update({id:role.id}, role, function(data) {
        roleObj = data.role;
        response(roleObj);
      }, function (){
        response(false);
      });

    },

    setRole: function (role) {
      roleObj = role;
    },

    getRole : function(){
      return roleObj;
    },

    setPermissions: function (permissions) {
      permissionsObj = permissions;
    },

    getPermissions : function(){
      return permissionsObj;
    }

  };
});
