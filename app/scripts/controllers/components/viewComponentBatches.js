'use strict';

angular.module('bsis').controller('ViewComponentBatchesCtrl', function($scope, $timeout, $filter, ngTableParams) {

  // View componentBatch variables and methods

  var data = [
    {
      date: new Date(),
      venue: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numDonations: 12,
      numBoxes: 3,
      deliveryTime: new Date()
    },
    {
      date: new Date(),
      venue: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numDonations: 12,
      numBoxes: 3,
      deliveryTime: new Date()
    },
    {
      date: new Date(),
      venue: {
        name: 'Maseru'
      },
      donationBatchStatus: 'CLOSED',
      numDonations: 12,
      numBoxes: 3,
      deliveryTime: new Date()
    }
  ];
  $scope.searchResults = true;

  $scope.deliveryFormsTableParams = new ngTableParams({
    page: 1,            // show first page
    count: 6,          // count per page
    filter: {},
    sorting: {}
  },
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function($defer, params) {
        var orderedData = params.sorting() ?
          $filter('orderBy')(data, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

  $scope.$watch('data', function() {
    $timeout(function() {
      $scope.deliveryFormsTableParams.reload();
    });
  });
});
