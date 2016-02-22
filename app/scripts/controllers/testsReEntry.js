'use strict';

angular.module('bsis')

  .controller('TestsReEnterCtrl', function($scope, $location, $log, TestingService, $modal, $sce, $q, $filter, ngTableParams, $timeout, $routeParams) {

    var data = [{}];
    $scope.data = data;

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    var getCurrentTestBatch = function() {
      TestingService.getTestBatchById($routeParams.id, function(response) {
        if (response !== false) {
          $scope.testBatch = response.testBatch;

        }
      });
    };

    var getTestNames = function() {
      var bloodTestType = $routeParams.bloodTestType;
      if (bloodTestType === 'BASIC_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.basicTTITests;
          }
        });
      }
    };

    // The array reEnteredTestOutcomes is originally populated with all test outcomes where reEntryRequired is false.
    // As the reEntry values are selected from the dropdowns, they are added to this array.
    var getReEnteredTestOutcomes = function() {
      $scope.searching = true;
      TestingService.getTestOutcomesByBatchIdAndBloodTestType($routeParams.id, $routeParams.bloodTestType, function(response) {
        if (response !== false) {
          data = response.testResults;
          $scope.data = data;
          $scope.reEnteredTestOutcomes = {};

          angular.forEach($scope.data, function(donationResults) {
            var din = donationResults.donation.donationIdentificationNumber;
            $scope.reEnteredTestOutcomes[din] = {'donationIdentificationNumber': din, 'testResults': {}};
            angular.forEach(donationResults.recentTestResults, function(test) {
              if (test.reEntryRequired === false) {
                $scope.reEnteredTestOutcomes[din].testResults[test.bloodTest.id] = test.result;
              }
            });
          });
        }
        $scope.searching = false;
      });
    };

    getCurrentTestBatch();
    getTestNames();
    getReEnteredTestOutcomes();

    var reEntriesConfirmed = 0;
    var reEntriesWithDiscrepancies = 0;
    var totalReEntries = 0;
    $scope.reEntryConfirmations = {};

    var calculateConfirmationCounters = function() {
      reEntriesConfirmed = 0;
      reEntriesWithDiscrepancies = 0;
      totalReEntries = 0;
      angular.forEach($scope.data, function(donationResults) {
        var din = donationResults.donation.donationIdentificationNumber;
        angular.forEach(donationResults.recentTestResults, function(testOutcome) {

          // only check outcomes where reEntryRequired = true
          if (testOutcome.reEntryRequired === true) {
            totalReEntries++;

            var confirmed = false;
            if ($scope.reEntryConfirmations[din] && $scope.reEntryConfirmations[din][testOutcome.bloodTest.id]) {
              confirmed = $scope.reEntryConfirmations[din][testOutcome.bloodTest.id];
            }
            if (testOutcome.result === $scope.reEnteredTestOutcomes[din].testResults[testOutcome.bloodTest.id]) {
              reEntriesConfirmed++;
            } else {
              if (confirmed) {
                reEntriesConfirmed++;
              // if it hasn't been confirmed and the result has been selected (is not undefined) it's a discrepancy
              } else if ($scope.reEnteredTestOutcomes[din].testResults[testOutcome.bloodTest.id]) {
                reEntriesWithDiscrepancies++;
              }
            }
          }
        });
      });
    };

    var saveTestOutcomes = function() {
      $scope.savingTestOutcomes = true;
      var requests = [];
      angular.forEach($scope.reEnteredTestOutcomes, function(value) {
        var request = TestingService.saveTestResults(value, true, angular.noop);
        requests.push(request);
      });

      // FIXME: Handle errors
      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).finally(function() {
        $scope.savingTestOutcomes = false;
      });

    };

    var confirmSaveTestOutcomes = function() {
      var messageText = '';
      messageText += 'Re-entry completed for ' + reEntriesConfirmed  + ' of ' + totalReEntries + ' outcomes.<br /> ';
      messageText += 'Re-entry required for ' + (totalReEntries - reEntriesConfirmed) + ' of ' + totalReEntries + ' outcomes. <br /> ';
      var saveObject = {
        title: 'Save test outcomes',
        button: 'Save',
        message: messageText
      };
      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function() {
            return saveObject;
          }
        }
      });
      modalInstance.result.then(function() {
        // Then save the test outcomes
        saveTestOutcomes($scope.reEnteredTestOutcomes, true);
      }, function() {
        // save cancelled - do nothing
      });
    };

    $scope.validateSaveTestOutcomesForm = function() {
      calculateConfirmationCounters();
      
      // Only save once all the discrepancies have been confirmed
      if (reEntriesWithDiscrepancies > 0) {
        $scope.showAlert = true;
      } else {
        $scope.showAlert = false;
        confirmSaveTestOutcomes();
      }
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
        total: data.length, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
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


