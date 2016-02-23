'use strict';

angular.module('bsis')

  .controller('TestsReEnterCtrl', function($scope, $location, $log, TestingService, $modal, $sce, $q, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.data = [];

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

    // This test names will be the column names. They are specific to each blood test type.
    var getTestNames = function() {
      var bloodTestType = $routeParams.bloodTestType;
      if (bloodTestType === 'BASIC_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.basicTTITests;
          }
        });
      }
      // add other blood test types here as they are implemented...
    };

    // The array reEnteredTestOutcomes is originally populated with all test outcomes where reEntryRequired is false.
    // As the reEntry values are selected from the dropdowns, they are added to this array.
    var getReEnteredTestOutcomes = function() {
      $scope.searching = true;
      TestingService.getTestOutcomesByBatchIdAndBloodTestType($routeParams.id, $routeParams.bloodTestType, function(response) {
        if (response !== false) {
          $scope.data = response.testResults;
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
    var testOutcomesToSave = {};

    // This method calculates the values used in the confirmation popup and
    // populates testOutcomesToSave
    var preSaveCalculations = function() {
      reEntriesConfirmed = 0;
      reEntriesWithDiscrepancies = 0;
      totalReEntries = 0;

      angular.forEach($scope.data, function(donationResults) {
        var donationWasUpdated = false;
        var din = donationResults.donation.donationIdentificationNumber;
        testOutcomesToSave[din] = {'donationIdentificationNumber': din, 'testResults': {}};

        angular.forEach(donationResults.recentTestResults, function(testOutcome) {
          // only check outcomes where reEntryRequired = true
          if (testOutcome.reEntryRequired === true) {
            totalReEntries++;
            // check that a reEntry outcome has been selected
            if ($scope.reEnteredTestOutcomes[din].testResults[testOutcome.bloodTest.id]) {
              donationWasUpdated = true;

              // populate test outcomes to save
              testOutcomesToSave[din].testResults[testOutcome.bloodTest.id] = $scope.reEnteredTestOutcomes[din].testResults[testOutcome.bloodTest.id];

              // case 1: selected same outcome as before
              if (testOutcome.result === $scope.reEnteredTestOutcomes[din].testResults[testOutcome.bloodTest.id]) {
                reEntriesConfirmed++;
              // case 2: selected different outcome as before, and it was confirmed
              } else if ($scope.reEntryConfirmations[din] && $scope.reEntryConfirmations[din][testOutcome.bloodTest.id]) {
                reEntriesConfirmed++;
              // case 3: selected different outcome as before, and it wasn't confirmed (discrepancy)
              } else {
                reEntriesWithDiscrepancies++;
              }
            }
          }
        });

        // if donation was not updated, delete the object from testOutcomesToSave
        if (!donationWasUpdated) {
          delete testOutcomesToSave[din];
        }

      });
    };

    var saveTestOutcomes = function() {
      $scope.savingTestOutcomes = true;
      var requests = [];
      angular.forEach(testOutcomesToSave, function(value) {
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
        saveTestOutcomes();
      }, function() {
        // save cancelled - do nothing
      });
    };

    $scope.validateSaveTestOutcomesForm = function() {
      preSaveCalculations();

      // Only save once all the discrepancies have been confirmed
      if (reEntriesWithDiscrepancies > 0) {
        $scope.showAlert = true;
      } else {
        $scope.showAlert = false;
        confirmSaveTestOutcomes();
      }
    };

    $scope.resetPreviousConfirmations = function(din, bloodTestId, firstEntryResult) {
      // If there was a previous confirmation for that outcome, if the outcome now selected is the same as first entry,
      // update reEntryConfirmations to false for that outcome
      if ($scope.reEntryConfirmations[din] && $scope.reEntryConfirmations[din][bloodTestId]) {
        if ($scope.reEnteredTestOutcomes[din].testResults[bloodTestId] === firstEntryResult) {
          $scope.reEntryConfirmations[din][bloodTestId] = false;
        }
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


