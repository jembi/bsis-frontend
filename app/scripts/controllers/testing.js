'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $location, TestingService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    var data = {};
    $scope.data = data;
    $scope.openTestBatches = false;
    $scope.searchResults = '';
    $scope.testResultsSearch = {
      donationIdentificationNumber: ''
    };

    $scope.isCurrent = function(path) {
      if ($location.path() === "/viewTestBatch" && path === "/manageTestBatch") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageTTITesting" && path === "/ttiTesting") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageBloodGroupTesting" && path === "/ttiTesting") {
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

    TestingService.getTestBatchFormFields().then(function (response) {
        data = response.data.testBatches;
        $scope.data = data;
        TestingService.setDonationBatches(response.data.donationBatches);
        $scope.donationBatches = TestingService.getDonationBatches();
        if (data.length > 0){
          $scope.openTestBatches = true;
        }
        else {
          $scope.openTestBatches = false;
        }
      }, function () {
        $scope.openTestBatches = false;
    });

    $scope.donationBatches = TestingService.getDonationBatches();

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

    $scope.getTestResultsByDIN = function () {
      TestingService.getTestResultsByDIN($scope.testResultsSearch.donationIdentificationNumber).then(function (response) {
          data = response.data;
          $scope.data = data;
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });
    };

  })

  .controller('TestBatchCtrl', function ($scope, $location, TestingService, ICONS, $filter, ngTableParams) {

    $scope.viewTestBatch = function (item) {
      TestingService.setTestBatch(item);
      $location.path("/viewTestBatch");
    };

    $scope.viewTestBatchTTI = function (item, testCategory) {
      console.log("testCategory: ",testCategory);
      TestingService.setTestBatch(item);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting");
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting");
      }
    };

  })

  .controller('ViewTestBatchCtrl', function ($scope, $location, TestingService, ICONS, $filter, ngTableParams) {
    var data = {};
    $scope.data  = data;

    $scope.testBatch = TestingService.getTestBatch();
    $scope.donationBatches = $scope.testBatch.donationBatches;
    data = $scope.testBatch.samples;
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

  .controller('TTITestBatchCtrl', function ($scope, $location, TestingService, ICONS, $filter, ngTableParams) {
    var data = {};
    $scope.data  = data;

    $scope.testBatch = TestingService.getTestBatch();
    data = $scope.testBatch.samples;
    $scope.data = data;

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
