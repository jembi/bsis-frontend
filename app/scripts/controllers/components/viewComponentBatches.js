'use strict';

angular.module('bsis')
  .controller('ViewComponentBatchesCtrl', function($scope, $timeout, $filter, ngTableParams, ComponentBatchService, $location) {

    $scope.tabs = [{addDelivery: true}, {viewDelivery: false}];

    // Add componentBatch variables and methods

    function initFields() {
      $scope.componentBatch.donationBatch = {'id': ''};
      $scope.componentBatch.location = {'id': ''};
      $scope.componentBatch.bloodTransportBoxes = [];
      $scope.componentBatch.deliveryDate = new Date();
      $scope.temperature = '';
      $scope.submitted = false;

    }

    function getComponentBatchFormFields() {
      ComponentBatchService.getComponentBatchesFormFields(function(response) {
        if (response !== false) {
          $scope.processingSites = response.processingSites;
          $scope.donationBatches = response.donationBatches;
          $scope.componentBatch = response.addComponentBatchForm;
          initFields();
        }
      });
    }

    $scope.addBox = function(temperature) {
      $scope.componentBatch.bloodTransportBoxes.push(
        {temperature: temperature}
      );
    };

    $scope.clearForm = function(addComponentBatchForm) {
      initFields();
      addComponentBatchForm.$setPristine();
      $location.search({});
    };

    $scope.addComponentBatch = function(addComponentBatchForm) {
      if (addComponentBatchForm.$valid) {
        $scope.adding = true;
        ComponentBatchService.addComponentBatch($scope.componentBatch, function() {
          $scope.submitted = false;
          $scope.clearForm(addComponentBatchForm);
          $scope.tabs.addDelivery = false;
          $scope.tabs.viewDelivery = true;
        }, function() {
          $scope.submitted = true;
        });
      } else {
        $scope.submitted = true;
      }
      $scope.adding = false;

    };

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

    // Execute

    getComponentBatchFormFields();

  });
