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

    $scope.getTestNames = function() {
      var bloodTestType = $routeParams.bloodTestType;
      if (bloodTestType === 'BASIC_TTI') {
        TestingService.getTTITestingFormFields(function(response) {
          if (response !== false) {
            $scope.testNames = response.basicTTITests;
          }
        })
      };
    };

    var getAllTestOutcomes = function() {
      $scope.searching = true;
      TestingService.getTestOutcomesByBatchIdAndBloodTestType($routeParams.id, $routeParams.bloodTestType, function(response) {
        if (response !== false) {
          data = response.testResults;
          $scope.data = data;
          $scope.allTestOutcomes = {};
            
          angular.forEach($scope.data, function(donationResults) {              
            var din = donationResults.donation.donationIdentificationNumber;           
            $scope.allTestOutcomes[din] = {'donationIdentificationNumber': din, 'testResults': {}};
            angular.forEach(donationResults.recentTestResults, function(test) {                        
              if (test.reEntryRequired === false) {
                $scope.allTestOutcomes[din].testResults[test.bloodTest.id] = test.result;
              }                            
            })  
          });
        }
        $scope.searching = false;
      });
    };

    getCurrentTestBatch();
    $scope.getTestNames();
    getAllTestOutcomes();

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

    $scope.confirmedCheckbox = false;

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


