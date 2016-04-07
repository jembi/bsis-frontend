'use strict';

angular.module('bsis')

  .controller('ViewDonorCtrl', function($scope, $location, $modal, $log, Alerting, DonorService, TestingService, ConfigurationsService, ICONS, PERMISSIONS, PACKTYPE, MONTH, TITLE,
                                         GENDER, DATEFORMAT, UI, DONATION, $filter, $q, ngTableParams, $timeout, $routeParams) {

    //Initialize scope variables
    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.getBooleanValue = ConfigurationsService.getBooleanValue;
    $scope.alerts = Alerting.getAlerts();
    $scope.ui = UI;

    $scope.alerts = Alerting.getAlerts();
    $scope.data = {};
    $scope.age = '';
    $scope.deferralsData = {};
    $scope.donationsData = {};
    $scope.donorPermissions = {
      canDelete: false
    };

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
    $scope.postalSameAsHome = false;
    $scope.workSameAsHome = false;

    $scope.formErrors = [];
    $scope.errorObject = {};

    //Donor Overview and Demographics Section

    function initializeDonor() {
      DonorService.getDonorById($routeParams.id, function(donor) {
        DonorService.setDonor(donor);
        $scope.donor = donor;
        $scope.donorPermissions.canDelete = donor.permissions.canDelete;
      }, function() {
        $location.path('/findDonor');
      });
    }

    function initializeDonorFormFields() {
      DonorService.getDonorFormFields(function(response) {
        if (response !== false) {
          $scope.data = response;
          $scope.addressTypes = $scope.data.addressTypes;
          $scope.languages = $scope.data.languages;
          $scope.venues = $scope.data.venues;
          $scope.idTypes = $scope.data.idTypes;
          $scope.preferredContactMethods = $scope.data.preferredContactMethods;
          $scope.title = TITLE.options;
          $scope.month = MONTH.options;
          $scope.gender = GENDER.options;
        }
      });
    }

    function getDonorOverview() {
      DonorService.getDonorOverview($routeParams.id, function(response) {
        if (response !== false) {
          $scope.data = response;
          $scope.flaggedForCounselling = $scope.data.flaggedForCounselling;
          $scope.hasCounselling = $scope.data.hasCounselling;
          $scope.currentlyDeferred = $scope.data.currentlyDeferred;
          $scope.lastDeferral = $scope.data.deferral;
          $scope.deferredUntil = $scope.data.deferredUntil;
          $scope.lastDonation = $scope.data.lastDonation;
          $scope.dateOfFirstDonation = $scope.data.dateOfFirstDonation;
          $scope.totalDonations = $scope.data.totalDonations;
          $scope.dueToDonate = $scope.data.dueToDonate;
          $scope.totalAdverseEvents = response.totalAdverseEvents;
          $scope.donorPermissions.canDelete = response.canDelete;
          $scope.isEligible = response.isEligible;
        }
      });
    }

    $scope.sameAsHome = function(form, addressType) {
      if (addressType == 'Postal') {
        form.postalAddressLine1.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressLine1.$modelValue);
        form.postalAddressLine1.$render();
        form.postalAddressLine2.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressLine2.$modelValue);
        form.postalAddressLine2.$render();
        form.postalAddressCity.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressCity.$modelValue);
        form.postalAddressCity.$render();
        form.postalAddressDistrict.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressDistrict.$modelValue);
        form.postalAddressDistrict.$render();
        form.postalAddressState.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressState.$modelValue);
        form.postalAddressState.$render();
        form.postalAddressProvince.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressProvince.$modelValue);
        form.postalAddressProvince.$render();
        form.postalAddressCountry.$setViewValue((form.postalSameAsHome.$viewValue === false) ? '' : form.homeAddressCountry.$modelValue);
        form.postalAddressCountry.$render();
        form.postalAddressZipcode.$setViewValue((form.postalSameAsHome.$viewValue === false) ? null : form.homeAddressZipcode.$modelValue);
        form.postalAddressZipcode.$render();
      }

      if (addressType == 'Work') {
        form.workAddressLine1.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressLine1.$modelValue);
        form.workAddressLine1.$render();
        form.workAddressLine2.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressLine2.$modelValue);
        form.workAddressLine2.$render();
        form.workAddressCity.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressCity.$modelValue);
        form.workAddressCity.$render();
        form.workAddressDistrict.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressDistrict.$modelValue);
        form.workAddressDistrict.$render();
        form.workAddressState.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressState.$modelValue);
        form.workAddressState.$render();
        form.workAddressProvince.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressProvince.$modelValue);
        form.workAddressProvince.$render();
        form.workAddressCountry.$setViewValue((form.workSameAsHome.$viewValue === false) ? '' : form.homeAddressCountry.$modelValue);
        form.workAddressCountry.$render();
        form.workAddressZipcode.$setViewValue((form.workSameAsHome.$viewValue === false) ? null : form.homeAddressZipcode.$modelValue);
        form.workAddressZipcode.$render();
      }
    };

    /**
     *  Delete Donor Logic
     *
     */

    $scope.confirmDelete = function(donor) {
      Alerting.alertReset();

      var deleteObject = {
        title: 'Delete Donor',
        button: 'Delete',
        message: 'Are you sure you wish to delete the donor "' + donor.firstName + ' ' + donor.lastName + ', ' + donor.donorNumber + '"?'
      };

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function() {
            return deleteObject;
          }
        }
      });

      modalInstance.result.then(function() {
        // Delete confirmed - delete the donor
        $scope.deleteDonor(donor);
      }, function() {
        // delete cancelled - do nothing
      });

    };

    function deleteCallback(err, donor) {
      if (err) {
        Alerting.alertAddMsg(true, 'top', 'danger', 'An error has occurred while deleting the donor "' + donor.firstName + ' ' + donor.lastName + ', ' + donor.donorNumber + '" Error :' + err.status + ' - ' + err.data.developerMessage);
      } else {
        Alerting.alertAddMsg(true, 'top', 'success', 'Donor "' + donor.firstName + ' ' + donor.lastName + ', ' + donor.donorNumber + '" has been deleted successfully');
      }
    }

    $scope.deleteDonor = function(donor) {
      DonorService.deleteDonor(donor.id, function() {
        deleteCallback(false, donor);
        $location.path('findDonor').search({});
      }, function(err) {
        deleteCallback(err, donor);
        $location.path('viewDonor/' + donor.id)
          .search({failed: true}); // If I do not set a parameter the route does not change, this needs to happen to refresh the donor.
      });
    };

    //Donations Section

    function getOpenDonationBatches() {
      DonorService.getOpenDonationBatches(function(response) {
        if (response !== false) {
          $scope.donationBatches = response.donationBatches;
          $scope.openDonationBatches = $scope.donationBatches.length > 0;
        }
      });
    }

    function getDonationsFormFields() {
      DonorService.getDonationsFormFields(function(response) {
        if (response !== false) {
          $scope.data = response;
          $scope.packTypes = $scope.data.packTypes;
          $scope.donationTypes = $scope.data.donationTypes;
          $scope.donation = $scope.data.addDonationForm;
          $scope.haemoglobinLevels = $scope.data.haemoglobinLevels;
          $scope.adverseEventTypes = response.adverseEventTypes;
        }
      });
    }

    $scope.getDonations = function(donorId) {
      $scope.confirmDelete = false;
      $scope.donationsView = 'viewDonations';

      DonorService.getDonations(donorId, function(response) {
        if (response !== false) {
          $scope.donationsData = response.allDonations;
          $scope.donationResults = $scope.donationsData.length > 0;
        } else {
          $scope.donationResults = false;
        }
      });

      $scope.donationTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
        {
          defaultSort: 'asc',
          counts: [], // hide page counts control
          total: $scope.donationsData.length, // length of data
          getData: function($defer, params) {
            var donationsData = $scope.donationsData;

            var orderedData = params.sorting() ?
              $filter('orderBy')(donationsData, params.orderBy()) : donationsData;
            params.total(orderedData.length); // set total for pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });

      $scope.$watch('donationsData', function() {
        $timeout(function() {
          $scope.donationTableParams.reload();
        });
      });
    };

    $scope.showTestResults = false;

    $scope.viewDonationSummary = function(din) {

      $scope.donation = $filter('filter')($scope.donationsData, {donationIdentificationNumber: din})[0];
      $scope.commentFieldDisabled = !$scope.donation.adverseEvent;

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
      $scope.donationsView = 'viewDonationSummary';
    };

    $scope.toggleShowResults = function(show) {
      $scope.showTestResults = show;
    };

    $scope.returnToListView = function() {
      $scope.donationsView = 'viewDonations';
    };

    $scope.updateCommentFieldDisabledState = function(form) {
      $scope.commentFieldDisabled = !form.adverseEventType.$viewValue;
      if (!form.adverseEventType.$viewValue) {
        form.adverseEventComment.$setViewValue(null);
        form.adverseEventComment.$render();
      }
    };

    $scope.updateDonation = function(donation) {
      var d = $q.defer();
      DonorService.updateDonation(donation, function(response) {
        $scope.donation.permissions = response.permissions;
        $scope.addDonationSuccess = true;
        $scope.donation = {};
        $scope.err = null;
        $scope.viewDonationSummary(response.donationIdentificationNumber);
        d.resolve();
      }, function(err) {
        $log.error(err);
        $scope.err = err;
        $scope.addDonationSuccess = false;
        d.reject('Server Error');
      });
      return d.promise;
    };

    $scope.checkBleedTimes = function(data) {
      if (new Date(data.bleedEndTime) < new Date(data.bleedStartTime)) {
        $scope.clearError('bleedTime');
        $scope.raiseError('bleedTime', 'Bleed start time should be less than end time');
        $scope.getError('bleedTime');
        return ' ';
      } else {
        $scope.clearError('bleedTime');
      }
    };

    $scope.deleteDonation = function(donationId) {
      DonorService.deleteDonation(donationId, function() {
        $scope.donationsData = $scope.donationsData.filter(function(donation) {
          return donation.id !== donationId;
        });
        getDonorOverview();
      }, function(err) {
        $log.error(err);
        $scope.confirmDelete = false;
      });
    };

    $scope.viewAddDonationForm = function() {
      // set initial bleed times
      $scope.donorDonationError = null;
      $scope.addDonationSuccess = true;
      $scope.bleedStartTime = new Date();
      $scope.bleedEndTime = new Date();
      $scope.adverseEvent = {
        type: null,
        comment: ''
      };

      $scope.donationsView = 'addDonation';

      getDonationsFormFields();
      getOpenDonationBatches();
    };

    $scope.addDonationSuccess = '';

    function confirmAddDonation(donation, donationBatch) {

      // Only show modal if donor is not eligible and batch is back entry
      if ($scope.isEligible || !donationBatch.backEntry || donation.packType.countAsDonation === false) {
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

    $scope.resetAdverseEventComment = function() {
      if (!$scope.adverseEvent.type) {
        $scope.adverseEvent.comment = null;
      }
    };

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

    $scope.addDonation = function(donation, donationBatch, bleedStartTime, bleedEndTime, valid) {

      if (valid) {

        checkDonorAge($scope.donor).then(function() {
          return confirmAddDonation(donation, donationBatch);
        }).then(function() {
          $scope.addDonationSuccess = '';

          // set donation center, site & date to those of the donation batch
          donation.venue = donationBatch.venue;
          donation.donationDate = donationBatch.createdDate;
          donation.donationBatchNumber = donationBatch.batchNumber;

          donation.donorNumber = $scope.donor.donorNumber;

          donation.bleedStartTime = bleedStartTime;
          donation.bleedEndTime = bleedEndTime;

          if ($scope.adverseEvent.type) {
            donation.adverseEvent = $scope.adverseEvent;
          }

          $scope.addingDonation = true;

          DonorService.addDonation(donation, function() {

            $scope.addDonationSuccess = true;
            $scope.donation = {};
            $scope.getDonations($scope.donor.id);
            $scope.donationsView = 'viewDonations';
            $scope.submitted = '';
            getDonorOverview();

            $scope.addingDonation = false;

          }, function(err) {
            $scope.donorDonationError = err;
            $scope.addDonationSuccess = false;
            // refresh donor overview after adding donation
            getDonorOverview();

            $scope.addingDonation = false;
          });
        }, function() {
          // Do nothing
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.printDonorBarcode = function() {
      DonorService.getDonorBarcode($scope.donor.id, function(response) {
        if (response !== false) {
          $scope.labelZPL = response.labelZPL;
          $log.debug('$scope.labelZPL: ', $scope.labelZPL);
        }
      });
    };

    //Deferrals Section

    function getDeferralsFormFields() {
      DonorService.getDeferralsFormFields(function(response) {
        if (response !== false) {
          $scope.data = response;
          $scope.deferralReasons = $scope.data.deferralReasons;
          $scope.venues = $scope.data.venues;
        }
      });
    }

    $scope.getDeferrals = function(donorId) {
      $scope.confirmDelete = false;
      $scope.deferralView = 'viewDeferrals';

      DonorService.getDeferrals(donorId, function(response) {
        if (response !== false) {
          $scope.deferralsData = response.allDonorDeferrals;
          $scope.deferralResults = true;
        } else {
          $scope.deferralResults = false;
        }
      });

      $scope.deferralTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: {},
        sorting: {}
      },
        {
          defaultSort: 'asc',
          counts: [], // hide page counts control
          total: $scope.deferralsData.length, // length of data
          getData: function($defer, params) {
            var deferralsData = $scope.deferralsData;

            var orderedData = params.sorting() ?
              $filter('orderBy')(deferralsData, params.orderBy()) : deferralsData;
            params.total(orderedData.length); // set total for pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        }
      );

      $scope.$watch('deferralsData', function() {
        $timeout(function() {
          $scope.deferralTableParams.reload();
        });
      });

      $scope.endDonorDeferral = function(deferral, comment, endDeferralForm) {
        if (endDeferralForm.$valid) {
          var endDeferralPostData = {};
          endDeferralPostData.comment = comment;
          DonorService.endDonorDeferral(deferral.id, endDeferralPostData, function(response) {
            // refresh the notice at the top
            $scope.clearDeferralMessage();
            // edit the end date in the table
            var updatedDeferral = response;
            angular.forEach($scope.deferralsData, function(d) {
              if (d.id === updatedDeferral.id) {
                if (d.permissions) {
                  d.permissions = updatedDeferral.permissions;
                }
                d.deferredUntil = updatedDeferral.deferredUntil;
                d.deferralReasonText = updatedDeferral.deferralReasonText;
              }
              $scope.refreshDeferralMessage(d);
            });
          }, function(err) {
            $scope.err = err;
          });
        }
      };

      $scope.updateDonorDeferral = function(deferral) {
        DonorService.updateDonorDeferral(deferral, function(response) {
          var updatedDeferral = response;
          if (deferral.permissions) {
            deferral.permissions = updatedDeferral.permissions;
          }
          // refresh the notice at the top
          $scope.clearDeferralMessage();
          angular.forEach($scope.deferralsData, function(d) {
            $scope.refreshDeferralMessage(d);
          });
        }, function(err) {
          $scope.err = err;
        });
      };

      $scope.clearDeferralMessage = function() {
        $scope.currentlyDeferred = false;
        var today = new Date();
        today.setHours(23, 59, 59, 0);
        $scope.deferredUntilDate = today;
        $scope.deferredUntil = 'No current deferrals';
      };

      $scope.refreshDeferralMessage = function(deferral) {
        var deferredUntil = new Date(deferral.deferredUntil);
        deferredUntil.setHours(0, 0, 0, 0);
        if ($scope.deferredUntilDate.getTime() < deferredUntil.getTime()) {
          $scope.currentlyDeferred = true;
          $scope.deferredUntilDate = deferredUntil;
          $scope.deferredUntil = deferral.deferredUntil;
        }
      };

      $scope.updateDonorDeferralReason = function(deferral, deferralReason) {
        // change end date
        var newEndDate = new Date();
        if (deferralReason.durationType === 'PERMANENT') {
          newEndDate.setFullYear(2100, 0, 1);
        } else {
          newEndDate.setDate(newEndDate.getDate() + deferralReason.defaultDuration);
        }
        deferral.deferredUntil = newEndDate;
      };

      $scope.deleteDonorDeferral = function(donorDeferralId) {
        DonorService.deleteDonorDeferral(donorDeferralId, function() {
          // refresh the notice at the top
          $scope.clearDeferralMessage();
          // remove item from the table once it has been deleted
          var deferralsData = $scope.deferralsData.filter(function(deferral) {
            if (deferral.id === donorDeferralId) {
              return false;
            }
            $scope.refreshDeferralMessage(deferral);
            return true;
          });
          $scope.deferralsData = deferralsData;
        }, function(err) {
          $scope.err = err;
          $scope.confirmDelete = false;
        });
      };
    };

    $scope.manageDeferral = function() {
      $scope.format = DATEFORMAT;
      $scope.initDate = new Date();
      $scope.calIcon = 'fa-calendar';
      $scope.dateFromOpen = false;
      $scope.dateToOpen = false;
      $scope.deferralView = 'manageDeferral';
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

    $scope.validateForm = function(form) {
      if (form.$valid) {
        return true;
      } else {
        return 'This form is not valid';
      }
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

    $scope.getError = function(errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function(obj) {
        return obj.name == errorName;
      });
    };

    $scope.checkErrors = function(min, max) {
      if (min || max) {
        return ' ';
      }
    };

    $scope.populateEndDate = function(deferral) {
      var deferralReason = deferral.deferralReason;
      deferral.deferredUntil = deferralReason.durationType === 'PERMANENT' ?
        moment('2100-01-01').toDate() :
        moment().add(deferralReason.defaultDuration, 'days').toDate();
    };

    $scope.addDeferral = function(deferral, addDeferralForm) {
      if (addDeferralForm.$valid) {
        deferral.deferredDonor = $scope.donor.id;
        $scope.addingDeferral = true;
        DonorService.addDeferral(deferral, function(response) {
          if (response === true) {
            $scope.deferral = {};
            $scope.getDeferrals($scope.donor.id);
            getDonorOverview();
            $scope.submitted = '';
            $scope.deferral = {};
            // set form back to pristine state
            addDeferralForm.$setPristine();
          }
          $scope.addingDeferral = false;
        });
      } else {
        $scope.submitted = true;
      }
    };

    initializeDonor();
    initializeDonorFormFields();
    getDeferralsFormFields();
    getDonorOverview();

  });
