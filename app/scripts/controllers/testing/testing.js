'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function($scope, $rootScope, $location, TestingService, ICONS, PERMISSIONS, BLOODABO, BLOODRH, DATEFORMAT, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.bloodAboOptions = BLOODABO;
    $scope.bloodRhOptions = BLOODRH;
    $scope.dateFormat = DATEFORMAT;

    var data = [{}];
    $scope.data = data;

    $scope.ttiTests = [];
    $scope.bloodTypingStatus = [];

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.clear = function() {
      $location.search({});
      $scope.selectedDonationBatches = {};
      $scope.file = {};
    };

    $scope.setFile = function(element) {
      $scope.$apply(function(scope) {
        scope.file = element.files[0];
      });
    };
  })

  .controller('RecordTestResultsCtrl', function($scope, $location, $log, TestingService, $q, $filter, ngTableParams, $timeout, $routeParams) {
    var data = [{}];
    $scope.data = data;

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.getTests = function() {
      TestingService.getTTITestingFormFields(function(response) {
        if (response !== false) {
          $scope.ttiTestsBasic = response.basicTTITests;
          $scope.ttiTestsPending = response.pendingTTITests;
        }
      });
      TestingService.getBloodGroupTestingFormFields(function(response) {
        if (response !== false) {
          $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;
          $scope.bloodTypingTestsRepeat = response.repeatBloodTypingTests;
        }
      });
    };

    $scope.getCurrentTestResults = function() {

      $scope.searching = true;
      $scope.allTestOutcomes = {};
      $scope.addTestMatchResults = {};

      TestingService.getTestOutcomesByBatchIdAndBloodTestType($routeParams.id, $routeParams.bloodTestType, function(response) {
        if (response !== false) {

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
        }
        $scope.searching = false;
      });
    };

    $scope.getTests();
    $scope.getCurrentTestResults();

    $scope.saveTestResults = function(testResults, reEntry) {

      $scope.savingTestResults = true;

      var requests = [];

      angular.forEach(testResults, function(value) {
        var request = TestingService.saveTestResults(value, reEntry, angular.noop);
        requests.push(request);
      });

      // FIXME: Handle errors
      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.getBloodTestId = function(testNameShort) {
      var testId = null;
      angular.forEach($scope.data[0].recentTestResults, function(value, key) {
        if (value.bloodTest.testNameShort == testNameShort) {
          testId = key;
        }
      });
      return testId;
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
          var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
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
