'use strict';

angular.module('bsis')

  .controller('AmbiguousBloodTypingTestingCtrl', function($scope, $location, $log, TestingService, $q, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.data = [];

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    // The array reEnteredTestOutcomes is originally populated with all test outcomes where reEntryRequired is false.
    // As the reEntry values are selected from the dropdowns, they are added to this array.
    var getSamples = function() {
      $scope.searching = true;
      TestingService.getTestBatchDonations($routeParams.id, 'AMBIGUOUS', function(response) {
        if (response !== false) {
          $scope.data = response.donations;   
          $scope.testBatchCreatedDate = response.testBatchCreatedDate;
          $scope.donationsNumber = response.donationsNumber;
          $scope.matchConfirmations = {};
          
          $log.info("$scope.testBatchCreatedDate: " + $scope.testBatchCreatedDate);

          angular.forEach($scope.data, function(sample) {
            var din = sample.donationIdentificationNumber;
            $log.info("din: " + din);
            $scope.matchConfirmations[din] = {};
            $scope.matchConfirmations[din].donationIdentificationNumber = din;
            $scope.matchConfirmations[din].bloodAbo = sample.bloodAbo;
            $scope.matchConfirmations[din].bloodRh = sample.bloodRh;
            $log.info("matchConfirmations: " + $scope.matchConfirmations[din].bloodRh);
          });
          
        }
        $scope.searching = false;
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


