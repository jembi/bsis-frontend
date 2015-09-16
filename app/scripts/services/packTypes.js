'use strict';

angular.module('bsis')
  .factory('PackTypesService', function ($http, Api, $filter) {
    var packTypeObj = {};
    return {

      getPackTypes: function (response) {
        Api.PackTypes.get({}, function (apiResponse) {
          response(apiResponse.allPackTypes);
        }, function () {
          response(false);
        });
      },

      getPackTypeById: function (id, onSuccess, onError) {
       Api.PackTypes.get({id: id}, function (apiResponse) {
          onSuccess(apiResponse.packtype);
        }, function (err) {
          onError(err.data);
        });
      },

      setPackType: function (packType) {
        packTypeObj = packType;
      },

      getPackType: function () {
        return packTypeObj;
      },

      addPackType: function (packType, response) {
        var addPackType = new Api.PackTypes();
        angular.copy(packType, addPackType);
        addPackType.$save(function (data) {
          response(data);
        }, function (err) {
          response(false, err.data);
        });
      },

      updatePackType: function (packType, response) {
        Api.PackTypes.update({id: packType.id}, packType, function (data) {
          response(data);
        }, function (err) {
          response(false, err.data);
        });
      }
    };
  });
