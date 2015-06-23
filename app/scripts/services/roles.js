'use strict';

angular.module('bsis')
.factory('RolesService', function ($http, Api, $filter) {

  var roleObj = {};
  var permissionsObj = {};

  return {

    getRoles: function(response){
      Api.Roles.get({}, function (apiResponse) {
        response(apiResponse.allRoles);
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

      var updatedRole = {
        id : role.id,
        name : role.name,
        description: role.description,
        permissionValues : []
      };

      role.permissions.forEach( function (item) {
        updatedRole.permissionValues.push("" + item.id);
      });

      Api.Roles.update({id:role.id}, updatedRole, function(data) {
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
