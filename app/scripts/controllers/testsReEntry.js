'use strict';

angular.module('bsis')

  .controller('TestsReEnterCtrl', function($scope, $location, $log, TestingService, TTITESTS, $modal, $sce, BLOODTYPINGTESTS, TTIOUTCOME, BGSOUTCOME, ABO, RH, $q, $filter, ngTableParams, $timeout, $routeParams) {

    var data = [{}];
    $scope.data = data;

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.getCurrentTestBatch = function() {
      TestingService.getTestBatchById($routeParams.id, function(response) {
        if (response !== false) {
          $scope.testBatch = response.testBatch;

        }
      });
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

      TestingService.getTestResultsByIdByBloodTestType($routeParams.id, 'BASIC_TTI', function(response) {
        if (response !== false) {
          data = response.testResults;
          $scope.data = data;
          $scope.addTestResults = {};
          $scope.addTestMatchResults = {};
          angular.forEach($scope.data, function(value) {
            $scope.addTestResults[value.donation.donationIdentificationNumber] = {'donationIdentificationNumber': value.donation.donationIdentificationNumber, 'testResults': {}};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'donationIdentificationNumber': value.donation.donationIdentificationNumber};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'bloodAbo': ''};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'bloodRh': ''};
          });

        }
        $scope.searching = false;
      });
    };

    $scope.getCurrentTestBatch();
    $scope.getTests();
    $scope.getCurrentTestResults();

    var saveTestResults = function(testResults, reEntry) {

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

    $scope.validateForm = function(testResults, reEntry) {
        saveTestResults(testResults, reEntry);
    };

    //Populate the arrays as you build the form
    $scope.populateArrays = function(sample, test) {
      if (angular.isDefined(sample.recentTestResults) && angular.isDefined(sample.donation.donationIdentificationNumber)) {
        if (angular.isDefined(sample.recentTestResults[test.id])) {
          $scope.addTestResults[sample.donation.donationIdentificationNumber].testResults[test.id] = sample.recentTestResults[test.id].result;
        }
      }
      return true;
    };

    $scope.testSamplesTTITableParams = new ngTableParams({
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
        $scope.testSamplesTTITableParams.reload();
      });
    });

  })
;


