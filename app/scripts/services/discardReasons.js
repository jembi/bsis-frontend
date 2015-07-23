'use strict';

angular.module('bsis')
  .factory('DiscardReasonsService', function ($http, Api, $filter, USERCONFIG) {

    var discardReasonObj = {};
    return {

      getDiscards: function(response){
        Api.discardReasons.get({}, function (apiResponse) {
          response(apiResponse.allDiscardReasons);
        }, function (){
          response(false);
        });
      },

      getDiscardById: function (id, response) {
        var apiResponse = Api.discardReasons.get({id: id}, function(){
          response(apiResponse.reason);
        }, function (){
          response(false);
        });
      },

      setDiscardReason: function (discard) {
        discardReasonObj = discard;
      },

      getDiscardReason: function () {
        return discardReasonObj;
      },

      addDiscardReason: function (discard,response) {
        var addDiscard = new Api.discardReasons();
        angular.copy(discard, addDiscard);

        addDiscard.$save(function(data){
          response(data.reason);
        }, function (err){
          response(false, err.data);
        });

      },

      updateDiscardReason: function (discard, response) {

        var updatedDiscard = angular.copy(discard);
        Api.discardReasons.update({id:discard.id}, updatedDiscard, function(data) {
          discardReasonObj = data.reason;
          response(discardReasonObj);
        }, function (err){
          response(false, err.data);
        });

      },

      removeDiscardReason: function (discard, response) {
        var deleteDiscard = new Api.discardReasons();
        angular.copy(discard, deleteDiscard);

        deleteDiscard.$delete({id: discard.id},function(data){
          response(data);
        }, function (err){
          response(false, err.data);
        });
      }

    };
  });