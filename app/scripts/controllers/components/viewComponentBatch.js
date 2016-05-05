'use strict';

angular.module('bsis').controller('ViewComponentBatchCtrl', function($scope, $routeParams) {

  $scope.gridOptions = {
    columnDefs: [
      {
        displayName: 'DIN',
        name: 'donationIdentificationNumber'
      }, {
        displayName: 'Pack Type',
        name: 'packType.componentTypeName'
      }
    ]
  };

  $scope.componentBatch = null;

  function fetchComponentBatchById(componentBatchId) {
    // TODO: Fetch component batch
    $scope.componentBatch = {
      id: componentBatchId,
      status: 'OPEN',
      deliveryDate: new Date(),
      collectionDate: new Date(),
      donationBatch: {
        id: 1,
        createdDate: new Date(),
        numDonations: 14,
        venue: {
          name: 'Maseru'
        },
        closed: false
      },
      bloodTransportBoxes: [
        {
          id: 1,
          temperature: 10.5
        }, {
          id: 2,
          temperature: 11.0
        }
      ],
      components: [
        {
          id: 1,
          donationIdentificationNumber: '0000006',
          packType: {
            id: 1,
            componentTypeName: 'Double'
          }
        }
      ]
    };

    $scope.gridOptions.data = $scope.componentBatch.components;
  }

  fetchComponentBatchById($routeParams.id);
});
