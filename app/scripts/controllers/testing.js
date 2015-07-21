'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $rootScope, $location, TestingService, ICONS, PERMISSIONS, BLOODABO, BLOODRH, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.bloodAboOptions = BLOODABO;
    $scope.bloodRhOptions = BLOODRH;

    var data = [{}];
    $scope.data = data;
    $scope.openTestBatches = false;
    $scope.selectedDonationBatches = {};
    $scope.selectedDonationBatches.ids = [];
    $scope.searchResults = '';
    $scope.testResultsSearch = {
      donationIdentificationNumber: ''
    };

    var recentTestBatchData = [{}];
    $scope.recentTestBatchData = recentTestBatchData;
    $scope.recentTestBatches = false;
    
    $scope.ttiTests = [];
    $scope.bloodTypingStatus = [];

    $scope.isCurrent = function(path) {
      var initialView = '';
      if ($location.path() === "/viewTestBatch" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageTTITesting" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/managePendingTests" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageBloodGroupTesting" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageBloodGroupMatchTesting" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        // for first time load of /testing view, determine the initial view
        if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_BATCH) > -1)){
          initialView = '/manageTestBatch';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_OUTCOME) > -1)){
          initialView = '/viewTestResults';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.ADD_TEST_OUTCOME) > -1)){
          initialView = '/uploadTestResults';
        }

        // if first time load of /testing view , and path === initialView, return true
        if ($location.path() === "/testing" && path === initialView){
          $location.path(initialView);
          return true;
        }

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

    $scope.clearForm = function(form){
      form.$setPristine();
      $scope.submitted = '';
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

    $scope.getRecentTestBatches = function (){

      TestingService.getRecentTestBatches( function(response){
        if (response !== false){
          recentTestBatchData = response.testBatches;
          $scope.recentTestBatchData = recentTestBatchData;
          console.log("recentTestBatchData: ", recentTestBatchData);
          console.log("recentTestBatchData.length: ", recentTestBatchData.length);

          if (recentTestBatchData.length > 0){
            $scope.recentTestBatches = true;
          }
          else {
            $scope.recentTestBatches = false;
          }
        }
        else{
        }
      });
    };

    

    $scope.getTestBatchFormFields = function(){

      TestingService.getTestBatchFormFields( function(response){
        if (response !== false){
          TestingService.setDonationBatches(response.donationBatches);
          $scope.donationBatches = TestingService.getDonationBatches();
        }
        else{
        }
      });

      $scope.donationBatches = TestingService.getDonationBatches();

    };

    $scope.getOpenTestBatches();
    $scope.getRecentTestBatches();
    $scope.getTestBatchFormFields();

    $scope.addTestBatch = function (donationBatches, valid){
      if (valid){

        TestingService.addTestBatch(donationBatches, function(response){
          if (response === true){
            $scope.selectedDonationBatches = {};
            $scope.getOpenTestBatches();
            $scope.getTestBatchFormFields();
            $scope.submitted = '';
          }
          else{
            // TODO: handle case where response == false
          }
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
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
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testBatchTableParams.reload(); });
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
      total: recentTestBatchData.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(recentTestBatchData, params.filter()) : recentTestBatchData;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : recentTestBatchData;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("recentTestBatchData", function () {
      $timeout(function(){ $scope.recentTestBatchesTableParams.reload(); });
    });

    $scope.getTestResultsByDIN = function (testResultsSearch) {
      TestingService.getTestResultsByDIN(testResultsSearch.donationIdentificationNumber, function(response){
        if (response !== false){
          $scope.donation = response.donation;
          $scope.testResults = response.testResults.recentTestResults;
          $scope.searchResults = true;
        }
        else{
          $scope.searchResults = false;
        }
      });
    };
    
    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting");
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting");
      }
    };

    $scope.recordPendingBloodGroupMatchTests = function (item) {
      TestingService.setCurrentTestBatch(item.id);
        $location.path("/manageBloodGroupMatchTesting");
    };

    $scope.recordPendingTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path("/managePendingTests");
    };

  })

  .controller('TestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams) {

    $scope.viewTestBatch = function (item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path("/viewTestBatch");
    };

    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting");
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting");
      }
    };

  })

  .controller('ViewTestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams, $timeout) {
    var data = [{}];
    $scope.data  = data;

    $scope.getCurrentTestBatch = function () {
      TestingService.getCurrentTestBatch( function(response){
        if (response !== false){
          $scope.testBatch = response.testBatch;

          var donations = [];
          angular.forEach($scope.testBatch.donationBatches, function(batch){
            angular.forEach(batch.donations, function(donation){
              donations.push(donation);
            });
          });

          data = donations;
          $scope.data = data;

        }
        else{
        }
      });
    };

    $scope.getCurrentTestBatch();

    $scope.getCurrentTestBatchOverview = function () {
      TestingService.getCurrentTestBatchOverview( function(response){
        if (response !== false){
          $scope.testBatchOverview = response;
          $scope.pendingBloodTypingTests = response.pendingBloodTypingTests;
          $scope.pendingTTITests = response.pendingTTITests;
          $scope.pendingBloodTypingMatchTests = response.pendingBloodTypingMatchTests;
          $scope.basicBloodTypingComplete = response.basicBloodTypingComplete;
          $scope.basicTTIComplete = response.basicTTIComplete;
        }
        else{
        }
      });
    };

    $scope.getCurrentTestBatchOverview();

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

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testSamplesTableParams.reload(); });
    });

    $scope.closeTestBatchCheck = function(testBatch){
      console.log("testBatch.id: ", testBatch.id);
      $scope.testBatchToClose = testBatch.id;
    };

    $scope.closeTestBatchCancel = function(){
      $scope.testBatchToClose = '';
    };

    $scope.closeTestBatch = function (testBatch){
      TestingService.closeTestBatch(testBatch, function(response){
        if (response !== false){
          $scope.testBatchToClose = '';
          $location.path("/manageTestBatch");
        }
        else{
          // TODO: handle case where response == false
        }
      });
      
    };

  })

  .controller('RecordTestResultsCtrl', function ($scope, $location, TestingService, TTITESTS, BLOODTYPINGTESTS, TTIOUTCOME, BGSOUTCOME, ABO, RH, $q, $filter, ngTableParams, $timeout) {
    var data = [{}];
    $scope.data  = data;
    $scope.ttiTests = TTITESTS.options;
    $scope.bloodTypingTests = BLOODTYPINGTESTS.options;
    $scope.ttiOutcomes = TTIOUTCOME.options;
    $scope.bgsOutcomes = BGSOUTCOME.options;
    $scope.abo = ABO.options;
    $scope.rh = RH.options;

    $scope.go = function (path) {
      $location.path(path);
    };

    $scope.getCurrentTestBatch = function () {
      TestingService.getCurrentTestBatch( function(response){
        if (response !== false){
          $scope.testBatch = response.testBatch;

        }
        else{
        }
      });
    };

    $scope.getTests = function () {
      TestingService.getTTITestingFormFields( function(response){
        if (response !== false){
          $scope.ttiTestsBasic = response.basicTTITests;
          console.log("$scope.ttiTestsBasic: ",$scope.ttiTestsBasic);
          $scope.ttiTestsConfirmatory = response.confirmatoryTTITests;
          console.log("$scope.ttiTestsConfirmatory: ",$scope.ttiTestsConfirmatory);
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

    $scope.getCurrentTestResults = function () {

      TestingService.getCurrentTestResults(function(response){
        if (response !== false){
          data = response.testResults;
          $scope.data = data;

          $scope.addTestResults = {};
          $scope.addTestMatchResults = {};
          angular.forEach($scope.data, function(value, key) {
            $scope.addTestResults[value.donation.donationIdentificationNumber] = {"donationIdentificationNumber": value.donation.donationIdentificationNumber};

            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"donationIdentificationNumber": value.donation.donationIdentificationNumber};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"bloodAbo": ""};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"bloodRh": ""};
          });

        }
        else{
        }
      });
    };

    $scope.getCurrentTestBatch();
    $scope.getTests();
    $scope.getCurrentTestResults();

    $scope.saveTestResults = function (testResults) {

      var requests = [];

      angular.forEach(testResults, function(value, key) {
        var request = TestingService.saveTestResults(value, function(response){
          if (response === true){
          }
          else{
            // TODO: handle case where response == false
          }
        });

        requests.push(request);
      });

      $q.all(requests).then(function(){
        $location.path("/viewTestBatch");
      });

    };

    $scope.saveBloodGroupMatchTestResults = function (testResults) {

      var requests = [];

      angular.forEach(testResults, function(value, key) {
        if(value.confirm){
          var request = TestingService.saveBloodGroupMatchTestResults(value, function(response){
            if (response === true){
            }
            else{
              // TODO: handle case where response == false
            }
          });
          requests.push(request);
        }
        
      });

      $q.all(requests).then(function(){
        $location.path("/viewTestBatch");
      });

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

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testSamplesTTITableParams.reload(); });
    });

  })
;
