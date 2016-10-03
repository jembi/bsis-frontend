'use strict';

angular.module('bsis')

  .controller('RecordTestResultsCtrl', function($scope, $location, $log, TestingService, $filter, ngTableParams, $timeout, $routeParams) {
    var data = [{}];
    $scope.data = data;

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    // This test names will be the column names. They are specific to each blood test type.
    var getTestNames = function() {
      $scope.bloodTestType = $routeParams.bloodTestType;
      if ($scope.bloodTestType === 'BASIC_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.basicTTITestNames;
          }
        });
      } else if ($scope.bloodTestType === 'BASIC_BLOODTYPING') {
        TestingService.getBloodGroupTestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.basicBloodTypingTests;
          }
        });
      } else if ($scope.bloodTestType === 'REPEAT_BLOODTYPING') {
        TestingService.getBloodGroupTestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.repeatBloodTypingTests;
          }
        });
      } else if ($scope.bloodTestType === 'REPEAT_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.repeatTTITestNames;
          }
        });
      } else if ($scope.bloodTestType === 'CONFIRMATORY_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.confirmatoryTTITestNames;
          }
        });
      }
    };

    var getTestOutcomes = function() {

      $scope.allTestOutcomes = {};

      TestingService.getTestOutcomesByBatchIdAndBloodTestType({testBatch: $routeParams.id, bloodTestType: $routeParams.bloodTestType}, function(response) {
        data = response.testResults;
        $scope.data = response.testResults;
        $scope.testBatchCreatedDate = response.testBatchCreatedDate;
        $scope.numberOfDonations = response.numberOfDonations;

        angular.forEach($scope.data, function(donationResults) {
          var din = donationResults.donation.donationIdentificationNumber;
          $scope.allTestOutcomes[din] = {'donationIdentificationNumber': din, 'testResults': {}};
          angular.forEach(donationResults.recentTestResults, function(test) {
            $scope.allTestOutcomes[din].testResults[test.bloodTest.id] = test.result;
          });
        });
      }, function(err) {
        $log.error(err);
      });
    };

    getTestNames();
    getTestOutcomes();

    $scope.saveTestResults = function(testResults, reEntry) {
      $scope.savingTestResults = true;

      var testResultsArray = {};
      testResultsArray.testOutcomesForDonations = [];

      angular.forEach(testResults, function(value) {
        testResultsArray.testOutcomesForDonations.push(value);
      });

      TestingService.saveTestResults({reEntry: reEntry}, testResultsArray, function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }, function(err) {
        $log.error(err);
        $scope.savingTestResults = false;
      });
    };

    $scope.testOutcomesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        'donation.donationIdentificationNumber': 'asc'
      }
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
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