'use strict';

angular.module('bsis')
  .factory('ModalsService', function($uibModal) {
    return {
      showConfirmation: function(confirmationFields) {
        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: 'views/confirmModal.html',
          controller: 'ConfirmModalCtrl',
          resolve: {
            confirmObject: function() {
              return confirmationFields;
            }
          }
        });
        return modalInstance.result;
      }
    };
  });
