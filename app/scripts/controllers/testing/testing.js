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
    $scope.openTestBatches = false;
    $scope.selectedDonationBatches = {};
    $scope.selectedDonationBatches.ids = [];
    $scope.searchResults = '';
    $scope.testResultsSearch = {
      donationIdentificationNumber: ''
    };

    var recentTestBatchData = null;
    $scope.recentTestBatchData = recentTestBatchData;
    $scope.recentTestBatches = false;

    $scope.ttiTests = [];
    $scope.bloodTypingStatus = [];

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.clear = function() {
      $location.search({});
      $scope.selectedDonationBatches = {};
      $scope.searchResults = '';
      $scope.testResultsSearch = {};
      $scope.file = {};
    };

    $scope.clearForm = function(form) {
      $location.search({});
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.setFile = function(element) {
      $scope.$apply(function(scope) {
        scope.file = element.files[0];
      });
    };

    $scope.getOpenTestBatches = function() {

      TestingService.getOpenTestBatches(function(response) {
        if (response !== false) {
          data = response.testBatches;
          $scope.data = data;
          if ($scope.testBatchTableParams.data.length >= 0) {
            $scope.testBatchTableParams.reload();
          }
          $scope.openTestBatches = data.length > 0;

        }
      });

    };


    $scope.clearDates = function() {
      $scope.search.startDate = null;
      $scope.search.endDate = null;
    };

    var master = {
      status: 'CLOSED',
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.clearSearch = function() {

      $scope.searched = false;
      $scope.search = {
        status: 'CLOSED',
        startDate: null,
        endDate: null
      };
    };

    $scope.search = angular.copy(master);

    $scope.getRecentTestBatches = function(recentTestBatchesForm) {
      if (recentTestBatchesForm.$valid) {
        var query = {
          status: 'CLOSED'
        };

        if ($scope.search.startDate) {
          var startDate = moment($scope.search.startDate).startOf('day').toDate();
          query.startDate = startDate;
        }

        if ($scope.search.endDate) {
          var endDate = moment($scope.search.endDate).endOf('day').toDate();
          query.endDate = endDate;
        }

        $scope.searching = true;

        TestingService.getRecentTestBatches(query, function(response) {
          $scope.searching = false;
          if (response !== false) {
            recentTestBatchData = response.testBatches;
            $scope.recentTestBatchData = recentTestBatchData;

            $scope.recentTestBatches = recentTestBatchData.length > 0;
          }
        }, function() {
          $scope.searching = false;
        });
      }
    };

    $scope.getTestBatchFormFields = function() {

      TestingService.getTestBatchFormFields(function(response) {
        if (response !== false) {
          TestingService.setDonationBatches(response.donationBatches);
          $scope.donationBatches = TestingService.getDonationBatches();
        }
      });

      $scope.donationBatches = TestingService.getDonationBatches();
    };

    $scope.getOpenTestBatches();
    $scope.getTestBatchFormFields();

    $scope.addTestBatch = function(donationBatches, valid) {
      if (valid) {

        $scope.addingTestBatch = true;
        TestingService.addTestBatch(donationBatches, function(response) {
          if (response === true) {
            $scope.selectedDonationBatches = {};
            $scope.getOpenTestBatches();
            $scope.getTestBatchFormFields();
            $scope.submitted = '';
          }
          $scope.addingTestBatch = false;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.testBatchTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 4,          // count per page
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
        $scope.testBatchTableParams.reload();
      });
    });

    $scope.recentTestBatchesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 8,          // count per page
      filter: {},
      sorting: {}
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(recentTestBatchData, params.filter()) : recentTestBatchData;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : recentTestBatchData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('recentTestBatchData', function() {
      $timeout(function() {
        $scope.recentTestBatchesTableParams.reload();
      });
    });

    $scope.getTestResultsByDIN = function(testResultsSearch) {
      testResultsSearch.search = true;
      $location.search(testResultsSearch);
      $scope.searching = true;
      TestingService.getTestResultsByDIN(testResultsSearch.donationIdentificationNumber, function(response) {
        if (response !== false) {
          $scope.donation = response.donation;
          $scope.testResults = response.testResults.recentTestResults;
          $scope.searchResults = true;
        } else {
          $scope.searchResults = false;
        }
        $scope.searching = false;
      });
    };

    if ($routeParams.search) {
      $scope.getTestResultsByDIN($routeParams);
    }

    $scope.recordTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/manageTTITesting/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'bloodGrouping') {
        $location.path('/manageBloodGroupTesting/' + item.id + '/BASIC_BLOODTYPING');
      } else if (testCategory === 'bloodGroupingReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_BLOODTYPING');
      }
    };

    $scope.recordConfirmatoryBloodGroupMatchTests = function(item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path('/manageBloodGroupMatchTesting/' + item.id);
    };

    $scope.recordPendingBloodTypingTests = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'bloodGrouping') {
        $location.path('/managePendingBloodTypingTests/' + item.id + '/REPEAT_BLOODTYPING');
      } else if (testCategory === 'bloodGroupingReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/REPEAT_BLOODTYPING');
      }
    };

    $scope.recordPendingTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/managePendingTests/' + item.id + '/CONFIRMATORY_TTI');
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/CONFIRMATORY_TTI');
      }
    };

  })

  .controller('TestBatchCtrl', function($scope, $location, TestingService) {

    $scope.viewTestBatch = function(item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path('/viewTestBatch/' + item.id);
    };

    $scope.recordTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/manageTTITesting/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'bloodGrouping') {
        $location.path('/manageBloodGroupTesting/' + item.id + '/BASIC_BLOODTYPING');
      } else if (testCategory === 'bloodGroupingReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_BLOODTYPING');
      }
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
