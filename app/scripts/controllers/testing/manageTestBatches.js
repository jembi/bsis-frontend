angular.module('bsis')
  .controller('TestBatchCtrl', function($scope, $location, TestingService, ngTableParams, $timeout, $filter, $log, DATEFORMAT, ICONS) {

    $scope.icons = ICONS;

    // Open batches functions

    var data = [{}];
    $scope.openTestBatches = false;
    var testBatchMaster = {
      donationBatchIds: [],
      location: null
    };
    $scope.testBatch = angular.copy(testBatchMaster);

    $scope.clearAddTestBatchForm = function(form) {
      $location.search({});
      form.$setPristine();
      $scope.submitted = '';
      $scope.testBatch = angular.copy(testBatchMaster);
      $scope.searchResults = '';
    };

    $scope.viewTestBatch = function(item) {
      $location.path('/viewTestBatch/' + item.id);
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

    $scope.getUnassignedDonationBatches = function() {
      TestingService.getTestBatchFormFields(function(response) {
        if (response !== false) {
          $scope.donationBatches = response.donationBatches;
          $scope.testingSites = response.testingSites;
        }
      });
    };

    $scope.getOpenTestBatches();
    $scope.getUnassignedDonationBatches();

    $scope.addTestBatch = function(addTestBatchForm) {
      if (addTestBatchForm.$valid) {

        $scope.addingTestBatch = true;
        TestingService.addTestBatch($scope.testBatch, function() {
          $scope.testBatch = angular.copy(testBatchMaster);
          $scope.getOpenTestBatches();
          $scope.getUnassignedDonationBatches();
          $scope.submitted = '';
          $scope.addingTestBatch = false;
          addTestBatchForm.$setPristine();
        }, function(err) {
          $log.error(err);
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

    // Closed batches functions

    $scope.dateFormat = DATEFORMAT;
    var closedTestBatchData = null;
    $scope.closedTestBatchData = closedTestBatchData;
    $scope.closedTestBatches = false;

    var master = {
      status: 'CLOSED',
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.search = angular.copy(master);

    $scope.clearClosedBatchesSearch = function() {
      $scope.searched = false;
      $scope.search = {
        status: 'CLOSED',
        startDate: null,
        endDate: null
      };
    };

    $scope.getClosedTestBatches = function(closedTestBatchesForm) {
      if (closedTestBatchesForm.$valid) {
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
            closedTestBatchData = response.testBatches;
            $scope.closedTestBatchData = closedTestBatchData;
            $scope.closedTestBatchesTableParams.$params.page = 1;

            $scope.closedTestBatches = closedTestBatchData.length > 0;
          }
        }, function() {
          $scope.searching = false;
        });
      }
    };

    $scope.closedTestBatchesTableParams = new ngTableParams({
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
            $filter('filter')(closedTestBatchData, params.filter()) : closedTestBatchData;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : closedTestBatchData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('closedTestBatchData', function() {
      $timeout(function() {
        $scope.closedTestBatchesTableParams.reload();
      });
    });

  })
;
