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

  // Controller for Managing the Donor Clinic
  .controller('ViewDonationBatchCtrl', function($scope, $location, $log, DonorService, ConfigurationsService, ICONS, PACKTYPE, DATEFORMAT, DONATION, $q, $filter, ngTableParams, $timeout, $routeParams, $modal, TestingService) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = [{}];
    $scope.data = data;

    $scope.hstep = 1;
    $scope.mstep = 5;
    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };


    $scope.bpUnit = DONATION.BPUNIT;
    $scope.hbUnit = DONATION.HBUNIT;
    $scope.weightUnit = DONATION.WEIGHTUNIT;
    $scope.pulseUnit = DONATION.PULSEUNIT;

    $scope.weightMin = DONATION.DONOR.WEIGHT_MIN;
    $scope.weightMax = DONATION.DONOR.WEIGHT_MAX;
    $scope.hbMin = DONATION.DONOR.HB_MIN;
    $scope.hbMax = DONATION.DONOR.HB_MAX;
    $scope.bpSystolicMin = DONATION.DONOR.BP_SYSTOLIC_MIN;
    $scope.bpSystolicMax = DONATION.DONOR.BP_SYSTOLIC_MAX;
    $scope.bpDiastolicMin = DONATION.DONOR.BP_DIASTOLIC_MIN;
    $scope.bpDiastolicMax = DONATION.DONOR.BP_DIASTOLIC_MAX;
    $scope.pulseMin = DONATION.DONOR.PULSE_MIN;
    $scope.pulseMax = DONATION.DONOR.PULSE_MAX;


    $scope.init = function() {
      DonorService.getDonationBatchById($routeParams.id, function(donationBatch) {
        $scope.donationBatch = donationBatch;
        data = donationBatch.donations;
        $scope.gridOptions.data = donationBatch.donations;
        $scope.data = data;

        DonorService.getDonationBatchFormFields(function(response) {
          $scope.venues = response.venues;
        }, $log.error);
      }, $log.error);
    };

    var columnDefs = [
      {
        name: 'Donor #',
        field: 'donorNumber'
      },
      {
        name: 'DIN',
        displayName: 'DIN',
        field: 'donationIdentificationNumber'
      },
      {
        name: 'Pack Type',
        field: 'packType.packType'
      },
      {
        name: 'Donation Type',
        field: 'donationType.donationType'
      }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      rowTemplate: 'views/template/clickablerow.html',
      columnDefs: columnDefs,

      // Format values for exports
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'Date of Last Donation') {
          return $filter('bsisDate')(value);
        }
        return value;
      },

      // PDF header
      exporterPdfHeader: function() {

        var venue = $scope.donationBatch.venue.name;
        var dateCreated = $filter('bsisDate')($scope.donationBatch.createdDate);
        var lastUpdated = $filter('bsisDate')($scope.donationBatch.lastUpdated);
        var status;
        if ($scope.donationBatch.isClosed) {
          status = 'Closed';
        } else {
          status = 'Open';
        }

        var columns = [
          {text: 'Batch Status: ' + status, width: 'auto'},
          {text: 'Venue: ' + venue, width: 'auto'},
          {text: 'Date Created: ' + dateCreated, width: 'auto'},
          {text: 'Last Updated: ' + lastUpdated, width: 'auto'}
        ];

        return [
          {
            text: 'Donation Batch Report',
            bold: true,
            margin: [30, 10, 30, 0]
          },
          {
            columns: columns,
            columnGap: 10,
            margin: [30, 0]
          }
        ];
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Total donations: ' + $scope.gridOptions.data.length, width: 'auto'},
          {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
          {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
        ];
        return {
          columns: columns,
          columnGap: 10,
          margin: [30, 0]
        };
      },

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    $scope.init();

    $scope.export = function(format) {
      if (format === 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      } else if (format === 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    $scope.returnToListView = function() {

      $scope.format = DATEFORMAT;
      $scope.initDate = '';
      $scope.calIcon = 'fa-calendar';
      $scope.init();

      $scope.donationBatchView = 'viewDonationBatch';

    };

    $scope.updateDonationBatch = function(donationBatch, reopen) {
      if (reopen) {
        DonorService.reopenDonationBatch(donationBatch, function(response) {
          donationBatch.isClosed = response.isClosed;
          $scope.refreshDonationBatch(donationBatch, response);
        }, function(err) {
          $log.error(err);
        });
      } else {
        DonorService.updateDonationBatch(donationBatch, function(response) {
          $scope.refreshDonationBatch(donationBatch, response);
        }, function(err) {
          $log.error(err);
        });
      }
    };

    $scope.refreshDonationBatch = function(donationBatch, response) {
      // refresh the donation batch permissions
      if (donationBatch.permissions) {
        donationBatch.permissions = response.permissions;
      }
      // update the donations (in the case of the date or venue change)
      donationBatch.donations = response.donations;
      data = donationBatch.donations;
      $scope.gridOptions.data = donationBatch.donations;
      $scope.data = data;
      if ($scope.donation) {
        // update the currently selected donation
        $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber: $scope.donation.donationIdentificationNumber})[0];
      }
    };

    $scope.closeDonationBatch = function(donationBatch) {
      DonorService.closeDonationBatch(donationBatch, function() {
        $location.path('/manageDonationBatches');
      }, function(err) {
        $log.error(err);
      });
    };

    $scope.deleteDonationBatch = function(donationBatchId) {
      DonorService.deleteDonationBatch(donationBatchId, function() {
        $location.path('/manageDonationBatches');
      }, function(err) {
        $log.error(err);
      });
    };


    $scope.onRowClick = function(row) {
      DonorService.getDonation(row.entity.id, function(response) {
        $scope.viewDonationSummary(response.donation);
      }, function(err) {
        $log.error(err);
      });
    };

    $scope.updateCommentFieldDisabledState = function(form) {
      $scope.commentFieldDisabled = !form.adverseEventType.$viewValue;
      if (!form.adverseEventType.$viewValue) {
        form.adverseEventComment.$setViewValue(null);
        form.adverseEventComment.$render();
      }
    };

    $scope.showTestResults = false;

    $scope.toggleShowResults = function(show) {
      $scope.showTestResults = show;
    };

    $scope.viewDonationSummary = function(donation) {
      $scope.donation = donation;
      $scope.donationBatchView = 'viewDonationSummary';
      $scope.commentFieldDisabled = !donation.adverseEvent;

      DonorService.getDonationsFormFields(function(response) {
        if (response !== false) {
          $scope.haemoglobinLevels = response.haemoglobinLevels;
          $scope.packTypes = response.packTypes;
          $scope.adverseEventTypes = [null].concat(response.adverseEventTypes);
        }
      });

      TestingService.getTestResultsByDIN($scope.donation.donationIdentificationNumber, function(testingResponse) {
        if (testingResponse !== false) {
          $scope.testResults = testingResponse.testResults.recentTestResults;
        }
      });

    };

    $scope.viewAddDonationForm = function() {

      $scope.err = {};
      $scope.addDonationSuccess = null;
      $scope.donation = {};
      $scope.donorSummary = {};
      $scope.donorSummaryLoading = false;
      $scope.adverseEvent = {
        type: null,
        comment: ''
      };


      $scope.$watch('donation.donorNumber', function() {
        if ($scope.donation.donorNumber) {
          $scope.donorSummaryLoading = true;
          DonorService.getDonorSummaries($scope.donation.donorNumber, function(donorSummaries) {
            $scope.donorSummary = donorSummaries.donor;
            $scope.donorSummary.eligible = donorSummaries.eligible;
            $scope.donorSummaryLoading = false;
          });
        }
      });

      // set initial bleed times
      $scope.bleedStartTime = new Date();
      $scope.bleedEndTime = new Date();

      $scope.donationBatchView = 'addDonation';

      DonorService.getDonationsFormFields(function(response) {
        if (response !== false) {
          $scope.data = response;
          $scope.venues = response.venues;
          $scope.packTypes = $scope.data.packTypes;
          $scope.donationTypes = $scope.data.donationTypes;
          $scope.donation = $scope.data.addDonationForm;
          $scope.haemoglobinLevels = $scope.data.haemoglobinLevels;
          $scope.adverseEventTypes = response.adverseEventTypes;
        }
      });
    };

    $scope.addDonationSuccess = '';

    function confirmAddDonation(donation) {

      // Only show modal if donor is not eligible and batch is back entry
      if ($scope.donorSummary.eligible || $scope.donationBatch.backEntry === false || donation.packType.countAsDonation === false) {
        return $q.resolve(null);
      }

      var modal = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: {
            title: 'Ineligible Donor',
            button: 'Continue',
            message: 'This donor is not eligible to donate. Components for this donation will be flagged as unsafe. Do you want to continue?'
          }
        }
      });

      return modal.result;
    }

    var minAge = ConfigurationsService.getIntValue('donors.minimumAge');
    var maxAge = ConfigurationsService.getIntValue('donors.maximumAge') || 100;
    var minBirthDate = moment().subtract(maxAge, 'years');
    var maxBirthDate = moment().subtract(minAge, 'years');

    function checkDonorAge(donor) {
      var birthDate = moment(donor.birthDate);

      var message;
      if (birthDate.isBefore(minBirthDate)) {
        message = 'This donor is over the maximum age of ' + maxAge + '.';
      } else if (birthDate.isAfter(maxBirthDate)) {
        message = 'This donor is below the minimum age of ' + minAge + '.';
      } else {
        // Don't show confirmation
        return Promise.resolve(null);
      }
      message += ' Are you sure that you want to continue?';

      var modal = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: {
            title: 'Invalid donor',
            button: 'Add donation',
            message: message
          }
        }
      });

      return modal.result;
    }

    $scope.resetAdverseEventComment = function() {
      if (!$scope.adverseEvent.type) {
        $scope.adverseEvent.comment = null;
      }
    };

    $scope.addDonation = function(donation, bleedStartTime, bleedEndTime, valid) {

      if (valid) {

        checkDonorAge($scope.donorSummary).then(function() {
          return confirmAddDonation(donation);
        }).then(function() {
          $scope.addDonationSuccess = '';

          DonorService.setDonationBatch($scope.donationBatch);

          // set donation center, site & date to those of the donation batch
          donation.venue = $scope.donationBatch.venue;
          donation.donationDate = $scope.donationBatch.createdDate;
          donation.donationBatchNumber = $scope.donationBatch.batchNumber;
          donation.bleedStartTime = bleedStartTime;
          donation.bleedEndTime = bleedEndTime;

          $scope.addingDonation = true;

          DonorService.addDonationToBatch(donation, function(response) {
            $scope.addDonationSuccess = true;
            $scope.donation = {};
            $scope.donationBatchView = 'viewDonationBatch';

            $scope.donationBatch = response;
            $scope.gridOptions.data = $scope.donationBatch.donations;
            $scope.submitted = '';
            $scope.err = {};
            $scope.addingDonation = false;
          }, function(err) {

            $scope.err = err;
            $scope.addDonationSuccess = false;
            $scope.addingDonation = false;
          });
        }, function() {
          // Do nothing
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.viewDonationBatch = function() {
      $scope.donation = {};
      $scope.donationBatchView = 'viewDonationBatch';
    };

    $scope.updateDonation = function(donation) {

      DonorService.updateDonation(donation, function() {
        $scope.addDonationSuccess = true;
        $scope.donation = {};
        $scope.viewDonationSummary(donation);
      }, function(err) {
        $log.error(err);
        $scope.addDonationSuccess = false;
      });
    };

    $scope.validateForm = function(form) {
      if (form.$valid) {
        return true;
      } else {
        return 'This form is not valid';
      }
    };

    $scope.deleteDonation = function(donationId) {
      DonorService.deleteDonation(donationId, function() {
        data = data.filter(function(donation) {
          return donation.id !== donationId;
        });
        $scope.donorClinicTableParams.reload();
      }, function(err) {
        $log.error(err);
        $scope.confirmDelete = false;
      });
    };

    $scope.close = function() {

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

    $scope.errorObject = {};

    $scope.getError = function(errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function(obj) {
        return obj.name == errorName;
      });
    };

    $scope.formErrors = [];

    $scope.checkErrors = function(min, max) {
      if (min || max) {
        return ' ';
      }
    };

    $scope.checkBleedTimes = function(bleedTimeData) {

      if (new Date(bleedTimeData.bleedEndTime) < new Date(bleedTimeData.bleedStartTime)) {
        $scope.clearError('bleedTime');
        $scope.raiseError('bleedTime', 'Bleed start time should be less than end time');
        $scope.getError('bleedTime');
        return ' ';
      } else {
        $scope.clearError('bleedTime');
      }
    };
  })

;
