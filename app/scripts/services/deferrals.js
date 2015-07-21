'use strict';

angular.module('bsis')
  .factory('DeferralsService', function ($http, Api, $filter, USERCONFIG) {

    var deferralObj = {};
    return {

      getDeferrals: function(response){
        Api.Deferrals.get({}, function (apiResponse) {
          USERCONFIG = apiResponse;
          response(apiResponse.deferralReasons);
        }, function (){
          response(false);
        });
      },

      getDeferralById: function (id, response) {
        var apiResponse = Api.Deferrals.get({id: id}, function(){
          response(apiResponse);
        }, function (){
          response(false);
        });
      },

      setDeferral: function (deferral) {
        deferralObj = deferral;
      },

      getDeferral: function () {
        return deferralObj;
      },

      addDeferral: function (deferral,response) {
        var addDeferral = new Api.Deferrals();
        angular.copy(deferral, addDeferral);

        addDeferral.$save(function(data){
          response(data);
        }, function (err){
          response(false, err.data);
        });

      },

      updateDeferral: function (deferral, response) {

        var updatedDeferral = angular.copy(deferral);
        Api.Deferrals.update({id:deferral.id}, updatedDeferral, function(data) {
          deferralObj = data.deferral;
          response(deferralObj);
        }, function (err){
          response(false, err.data);
        });

      },

      removeDeferral: function (deferral, response) {
        var deleteDeferral = new Api.Deferrals();
        angular.copy(deferral, deleteDeferral);

        deleteDeferral.$delete({id: deferral.id},function(data){
          response(data);
        }, function (err){
          response(false, err.data);
        });
      }

    };
  });
