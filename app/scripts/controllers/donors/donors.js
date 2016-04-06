'use strict';

angular.module('bsis')

  .controller('DonorsCtrl', function($scope, $rootScope, $location, $routeParams, ConfigurationsService, DonorService, DATEFORMAT, $filter, ngTableParams, $timeout, $q, Alerting, UI) {

    $scope.getBooleanValue = ConfigurationsService.getBooleanValue;
    $scope.alerts = Alerting.getAlerts();
    $scope.ui = UI;

    // Tabs with their active status
    $scope.tabs = {
      overview: false,
      demographics: false,
      donations: false,
      deferrals: false
    };

    var activeTab = $routeParams.tab || 'overview';
    if ($scope.tabs[activeTab] === false) {
      $scope.tabs[activeTab] = true;
    } else {
      $scope.tabs.overview = true;
    }

    var data = [{}];
    $scope.data = data;
    $scope.age = '';

    $scope.donorSearch = $routeParams;
    $scope.searchResults = '';

    $scope.canAddDonors = false;

    $scope.closeAlert = function(alertScope, index) {
      Alerting.alertClose(alertScope, index);
    };


    $scope.clear = function(form) {
      if (form) {
        form.$setPristine();
      }
      $location.search({});
      $scope.donorSearch = {};
      $scope.searchResults = '';
      $scope.donation = {};
      $scope.deferral = {};
      $scope.newDonationBatch = {backEntry: false};
      $scope.donorListSearchResults = '';
      $scope.donorList = {};
    };

    $scope.clearForm = function(form) {
      form.$setPristine();
      $location.search({});
      $scope.submitted = '';
    };

    $scope.updateDonor = function(donor) {
      var d = $q.defer();
      DonorService.updateDonor(donor, function(response) {
        $scope.donor = response;
          //Reset Error Message
        $scope.err = null;
        d.resolve();
        if ($scope.donorPermissions) {
          $scope.donorPermissions.canDelete = response.permissions.canDelete;
        }
      },
        function(err) {
          $scope.donor = donor;
          $scope.err = err;
          d.reject('Server Error');
        });
      return d.promise;
    };

    $scope.raiseError = function(errorName, errorMessage) {
      $scope.formErrors.push(
        {
          name: errorName,
          error: errorMessage
        }
      );
    };

    $scope.clearError = function(errorName) {
      $scope.errorObject[errorName] = [];
      $scope.formErrors = $scope.formErrors.filter(function(obj) {
        return obj.name !== errorName;
      });
    };

    $scope.onCancel = function() {
      $scope.errorObject = {};
      $scope.formErrors = [];
    };

    $scope.errorObject = {};

    $scope.getError = function(errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function(obj) {
        return obj.name == errorName;
      });
    };

    $scope.formErrors = [];

    $scope.checkIdentifier = function(identifierData) {
      if (!identifierData.idNumber || angular.isUndefined(identifierData.idType)) {
        $scope.clearError('identifier');
        $scope.raiseError('identifier', 'Please enter a valid identifier');
        $scope.getError('identifier');
        return ' ';
      } else {
        $scope.clearError('identifier');
      }
    };

    $scope.master = DonorService.getDonor();

    $scope.cancelForm = function(donor, form) {
      $scope.clearForm(form);
      DonorService.getDonorById(donor.id, function(freshDonor) {
        $scope.donor = freshDonor;
        $scope.err = null;
      }, function(err) {
        $scope.err = err;
      });
    };

    $scope.edit = function() {
    };

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 8,          // count per page
      sorting: {}
    }, {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function($defer, params) {
        var orderedData = params.sorting() ?
          $filter('orderBy')(data, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  })

  // Controller for Viewing Donors


  // Controller for Managing the Donor Clinic
  .controller('DonorClinicCtrl', function($scope, $location, $log, DonorService, ICONS, PACKTYPE, $q, $filter, DATEFORMAT, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = [];
    var recentDonationBatchData = null;
    $scope.data = data;
    $scope.recentDonationBatchData = recentDonationBatchData;
    $scope.openDonationBatches = false;
    $scope.recentDonationBatches = false;
    $scope.newDonationBatch = {backEntry: false};
    $scope.dateFormat = DATEFORMAT;

    $scope.getOpenDonationBatches = function() {

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
    };

    $scope.getOpenDonationBatches();

    $scope.clearDates = function() {
      $scope.search.startDate = null;
      $scope.search.endDate = null;
    };

    $scope.clearVenues = function() {
      $scope.search.selectedVenues = [];
    };

    var master = {
      isClosed: true,
      selectedVenues: [],
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
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
          $scope.getOpenDonationBatches();
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

  })
;
