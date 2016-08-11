'use strict';

angular.module('bsis').controller('ManageDonationBatchesCtrl', function($scope, $location, $log, DonorService, ICONS, PACKTYPE, $q, $filter, DATEFORMAT, ngTableParams, $timeout) {

  var data = [];
  var recentDonationBatchData = null;
  var master = {
    isClosed: true,
    selectedVenues: [],
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate()
  };
  $scope.data = data;
  $scope.recentDonationBatchData = recentDonationBatchData;
  $scope.openDonationBatches = false;
  $scope.recentDonationBatches = false;
  $scope.newDonationBatch = {backEntry: false};
  $scope.dateFormat = DATEFORMAT;
  $scope.icons = ICONS;
  $scope.packTypes = PACKTYPE.packtypes;

  function getOpenDonationBatches() {

    DonorService.getOpenDonationBatches(function(response) {
      if (response !== false) {
        data = response.donationBatches;
        $scope.data = data;
        DonorService.getDonationBatchFormFields(function(formFieldsResponse) {
          $scope.venues = formFieldsResponse.venues;
          angular.forEach(data, function(item) {
            angular.forEach($scope.venues, function(panel, i) {
              if (panel.name == item.venue.name) {
                $scope.venues[i].disabled = true;
              }
            });
          });
        }, $log.error);

        $scope.openDonationBatches = data.length > 0;
      }
    });
  }

  $scope.clearDates = function() {
    $scope.search.startDate = null;
    $scope.search.endDate = null;
  };

  $scope.clearVenues = function() {
    $scope.search.selectedVenues = [];
  };

  $scope.clearSearch = function(form) {
    $location.search({});
    $scope.search = angular.copy(master);
    form.$setPristine();
    form.$setUntouched();
  };

  $scope.search = angular.copy(master);

  $scope.getRecentDonationBatches = function(recentDonationsForm) {
    if (recentDonationsForm.$valid) {
      var query = angular.copy($scope.search);

      if ($scope.search.startDate) {
        var startDate = moment($scope.search.startDate).startOf('day').toDate();
        query.startDate = startDate;
      }
      if ($scope.search.endDate) {
        var endDate = moment($scope.search.endDate).endOf('day').toDate();
        query.endDate = endDate;
      }
      if ($scope.search.selectedVenues.length > 0) {
        query.venues = $scope.search.selectedVenues;
      }

      $scope.searching = true;

      DonorService.getRecentDonationBatches(query, function(response) {
        $scope.searching = false;
        if (response !== false) {
          recentDonationBatchData = response.donationBatches;
          $scope.recentDonationBatchData = recentDonationBatchData;
          $scope.recentDonationBatches = recentDonationBatchData.length > 0;
        }
      }, function(err) {
        $scope.searching = false;
        $log.log(err);
      });
    }

  };

  $scope.donationBatchTableParams = new ngTableParams({
    page: 1,            // show first page
    count: 6,          // count per page
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
      $scope.donationBatchTableParams.reload();
    });
  });

  $scope.recentDonationBatchesTableParams = new ngTableParams({
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
          $filter('filter')(recentDonationBatchData, params.filter()) : recentDonationBatchData;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : recentDonationBatchData;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

  $scope.$watch('recentDonationBatchData', function() {
    $timeout(function() {
      $scope.recentDonationBatchesTableParams.reload();
    });
  });

  $scope.addDonationBatch = function(donationBatch, donationBatchForm) {
    if (donationBatchForm.$valid) {

      $scope.addingDonationBatch = true;

      DonorService.addDonationBatch(donationBatch, function() {
        $scope.newDonationBatch = {backEntry: false};
        getOpenDonationBatches();
        // set form back to pristine state
        donationBatchForm.$setPristine();
        $scope.submitted = '';
        $scope.addingDonationBatch = false;

      }, function(err) {
        $scope.err = err;
        $scope.addingDonationBatch = false;
      });
    } else {
      $scope.submitted = true;
    }
  };

  $scope.manageClinic = function(item) {
    $location.path('/manageClinic/' + item.id);
  };

  $scope.selectTab = function() {
    $scope.$applyAsync();
  };

  // Execute methods
  getOpenDonationBatches();

});
