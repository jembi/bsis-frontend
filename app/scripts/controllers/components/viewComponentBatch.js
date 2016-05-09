'use strict';

angular.module('bsis').controller('ViewComponentBatchCtrl', function($scope, $routeParams, $log, ComponentService) {

  $scope.gridOptions = {
    columnDefs: [
      {
        displayName: 'DIN',
        name: 'donationIdentificationNumber'
      }, {
        displayName: 'Pack Type',
        name: 'packType.packType'
      }
    ]
  };

  $scope.componentBatch = null;

  function fetchComponentBatchById(componentBatchId) {
    ComponentService.getComponentBatch(componentBatchId, function(response) {
      $scope.componentBatch = response;
      $scope.gridOptions.data = $scope.componentBatch.components;
    }, function(err) {
      $log.error(err);
    });
  }

  fetchComponentBatchById($routeParams.id);
});
