'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $location, TestingService, ICONS, PERMISSIONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = {};
    $scope.data = data;
    $scope.openTestBatches = false;
    $scope.selectedDonationBatches = {};
    $scope.selectedDonationBatches.ids = [];
    $scope.searchResults = '';
    $scope.testResultsSearch = {
      donationIdentificationNumber: ''
    };
    
    $scope.ttiTests = [];
    $scope.bloodTypingStatus = [];

    $scope.isCurrent = function(path) {
      if ($location.path() === "/viewTestBatch" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageTTITesting" && path === "/recordTestResults") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageBloodGroupTesting" && path === "/recordTestResults") {
        $scope.selection = $location.path();
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/testing" && path === "/manageTestBatch") {
        return true;
      } else {
        return false;
      }
    };

    $scope.go = function (path) {
      $location.path(path);
    };

    $scope.clear = function () {
      $scope.selectedDonationBatches = {};
      $scope.searchResults = '';
      $scope.testResultsSearch = {};
      $scope.file = {};
    };

    $scope.setFile = function(element) {
      $scope.$apply(function($scope) {
        $scope.file = element.files[0];
      });
    };

    $scope.getOpenTestBatches = function(){

      TestingService.getOpenTestBatches( function(response){
        if (response !== false){
          data = response.testBatches;
          $scope.data = data;
          if ($scope.testBatchTableParams.data.length >= 0){
            $scope.testBatchTableParams.reload();
          }
          if (data.length > 0){
            $scope.openTestBatches = true;
          }
          else {
            $scope.openTestBatches = false;
          }
          
        }
        else{
        }
      });
    };

    $scope.getOpenTestBatches();

    TestingService.getTestBatchFormFields( function(response){
      if (response !== false){
        TestingService.setDonationBatches(response.donationBatches);
        $scope.donationBatches = TestingService.getDonationBatches();
      }
      else{
      }
    });
    /*
    TestingService.getTestBatchFormFields().then(function (response) {

        TestingService.setDonationBatches(response.data.donationBatches);
        $scope.donationBatches = TestingService.getDonationBatches();
        $scope.ttiTests = response.data.ttiTests;
        $scope.bloodTypingTests = response.data.bloodTypingTests;
        if (data.length > 0){
          $scope.openTestBatches = true;
        }
        else {
          $scope.openTestBatches = false;
        }
      }, function () {
        $scope.openTestBatches = false;
    });
    */

    $scope.donationBatches = TestingService.getDonationBatches();

    $scope.addTestBatch = function (donationBatches){

      TestingService.addTestBatch(donationBatches, function(response){
        if (response === true){
          $scope.getOpenTestBatches();
        }
        else{
          // TODO: handle case where response == false
        }
      });
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
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.getTestResultsByDIN = function (testResultsSearch) {
      TestingService.getTestResultsByDIN(testResultsSearch.donationIdentificationNumber, function(response){
        if (response !== false){
          $scope.donation = response.donation;
          $scope.testResults = response.overview.recentTestResults;
          $scope.searchResults = true;
        }
        else{
          $scope.searchResults = false;
        }
      });
    };

    /*
    $scope.getTestResultsByDIN = function () {
      TestingService.getTestResultsByDIN($scope.testResultsSearch.donationIdentificationNumber).then(function (response) {
          data = response.data;
          $scope.data = data;
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });
    };
    */
    
    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setTestBatch(item);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting");
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting");
      }
    };

  })

  .controller('TestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams) {

    $scope.viewTestBatch = function (item) {
      TestingService.setTestBatch(item);
      $location.path("/viewTestBatch");
    };

    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setTestBatch(item);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting");
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting");
      }
    };

  })

  .controller('ViewTestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams) {
    var data = {};
    $scope.data  = data;

    $scope.testBatch = TestingService.getTestBatch();

    var donations = [];
    angular.forEach($scope.testBatch.collectionBatches, function(batch){
      angular.forEach(batch.collectionsInBatch, function(donation){
        donations.push(donation);
      });
    });

    data = donations;
    $scope.data = data;

    $scope.testSamplesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 8,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

  })

  .controller('RecordTestResultsCtrl', function ($scope, $location, TestingService, TTITESTS, BLOODTYPINGTESTS, TTIOUTCOME, BGSOUTCOME, ABO, RH, $filter, ngTableParams) {
    var data = {};
    $scope.data  = data;
    $scope.ttiTests = TTITESTS.options;
    $scope.bloodTypingTests = BLOODTYPINGTESTS.options;
    $scope.ttiOutcomes = TTIOUTCOME.options;
    $scope.bgsOutcomes = BGSOUTCOME.options;
    $scope.abo = ABO.options;
    $scope.rh = RH.options;

    $scope.testBatch = TestingService.getTestBatch();

    $scope.getTests = function () {
      TestingService.getTTITestingFormFields( function(response){
        if (response !== false){
          $scope.ttiTestsBasic = response.basicTTITests;
          console.log("$scope.ttiTestsBasic: ",$scope.ttiTestsBasic);
        }
        else{
        }
      });
      TestingService.getBloodGroupTestingFormFields( function(response){
        if (response !== false){
          $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;
          console.log("$scope.bloodTypingTestsBasic: ",$scope.bloodTypingTestsBasic);
        }
        else{
        }
      });
    };

    $scope.getTestResults = function () {
      TestingService.getTestResults($scope.testBatch.id, function(response){
        if (response !== false){
          data = response.testresults;
          $scope.data = data;

          $scope.addTestResults = {};
          angular.forEach($scope.data, function(value, key) {
            $scope.addTestResults[value.collectedSample.collectionNumber] = {"donationIdentificationNumber": value.collectedSample.collectionNumber};
          });

          if ($scope.testSamplesTTITableParams.data.length >= 0){
            $scope.testSamplesTTITableParams.reload();
          }
        }
        else{
        }
      });
    };

    $scope.getTests();
    $scope.getTestResults();

    $scope.saveTTITestResults = function (testResults) {

      angular.forEach(testResults, function(value, key) {
        TestingService.saveTTITestResults(value, function(response){
          if (response === true){
          }
          else{
            // TODO: handle case where response == false
          }
        });
        
      });

      $location.path("/viewTestBatch");

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
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

  })
;
