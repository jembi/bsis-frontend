'use strict';

angular.module('bsis')

  .controller('AmbiguousBloodTypingTestingCtrl', function($scope, $location, $log, TestingService, $q, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.data = [];

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    var getSamples = function() {
      TestingService.getTestBatchDonations($routeParams.id, 'AMBIGUOUS', function(response) {
        $scope.data = response.donations;
        $scope.testBatchCreatedDate = response.testBatchCreatedDate;
        $scope.numberOfDonations = response.numberOfDonations;
        $scope.matchConfirmations = {};

        angular.forEach($scope.data, function(sample) {
          var din = sample.donationIdentificationNumber;
          $scope.matchConfirmations[din] = {};
          $scope.matchConfirmations[din].donationIdentificationNumber = din;
          $scope.matchConfirmations[din].bloodAbo = sample.bloodAbo;
          $scope.matchConfirmations[din].bloodRh = sample.bloodRh;
        });
      }, function(err) {
        $log.error(err);
      });
    };

    getSamples();

    $scope.saveBloodGroupMatchTestResults = function(matchConfirmations) {

      $scope.savingTestResults = true;

      var requests = [];

      angular.forEach(matchConfirmations, function(matchConfirmation) {
        if (matchConfirmation.confirm) {
            // save confirmation last
          var request = TestingService.saveBloodGroupMatchTestResults(matchConfirmation, angular.noop);
          requests.push(request);
        }
      });

      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).catch(function(err) {
        $log.error(err);
        // TODO: handle the case where there have been errors
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.testOutcomesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {},
      sorting: {}
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: $scope.data.length, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.testOutcomesTableParams.reload();
      });
    });

  })
;


