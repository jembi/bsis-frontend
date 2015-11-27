'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $rootScope, $location, $routeParams, ConfigurationsService, DonorService, ICONS, PERMISSIONS, DATEFORMAT, $filter, ngTableParams, $timeout, $q, Alerting, UI) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
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

    var currentTime = new Date();
    $scope.currentYear = currentTime.getFullYear();
    $scope.minYear = $scope.currentYear - 100;

    $scope.canAddDonors = false;

    $scope.closeAlert = function (alertScope,index) {
      Alerting.alertClose(alertScope,index);
    };

    $scope.findDonor = function () {
      $scope.donorSearch.search = true;
      Alerting.setPersistErrors(false);
      $location.search($scope.donorSearch);
      $scope.searching = true;
      DonorService.findDonor($scope.donorSearch, function(response) {
        data = response.donors;
        $scope.searchResults = true;
        $scope.data = response.donors;
        $scope.canAddDonors = response.canAddDonors;
        $scope.searching = false;
      }, function() {
        $scope.searchResults = false;
        $scope.searching = false;
      });
    };

    if ($routeParams.search) {
      $scope.findDonor();
    }

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.tableParams.reload(); });
    });

    $scope.isCurrent = function(path) {
      var initialView = '';
      if ($location.path().indexOf('/viewDonor') === 0 && path === "/findDonor") {
        $scope.selection = '/viewDonor';
        return true;
      } else if ($location.path() === "/addDonor" && path === "/findDonor") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path().indexOf("/manageClinic") === 0 && path === "/manageDonationBatches") {
        $scope.selection = '/manageClinic';
        return true;
      }
      else if ($location.path().indexOf("/locations") === 0 && path === initialView) {
        $scope.selection = '/locations';
        return true;
      }
      else if ($location.path().indexOf('/donorCounselling') === 0 && path.indexOf('/donorCounselling') === 0) {
        var currentPath = $location.path();
        $scope.selection = currentPath === '/donorCounselling' ? currentPath : '/donorCounsellingDetails';
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {

        return true;
      } else {
        // for first time load of /donors view, determine the initial view
        if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONOR) > -1)){
          initialView = '/findDonor';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_DONATION_BATCH) > -1)){
          initialView = '/manageDonationBatches';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.EXPORT_CLINIC_DATA) > -1)){
          initialView = '/exportDonorList';
        }

        // if first time load of /donors view , and path === initialView, return true
        if ($location.path() === "/donors" && path === initialView){
          $location.path(initialView);
          return true;
        }

        return false;
      }
    };

    $scope.clear = function () {
      $location.search({});
      $scope.donorSearch = {};
      $scope.searchResults = '';
      $scope.donation = {};
      $scope.deferral = {};
      $scope.newDonationBatch = {backEntry: false};
      $scope.donorListSearchResults = '';
      $scope.donorList = {};
    };

    $scope.clearForm = function(form){
      form.$setPristine();
      $location.search({});
      $scope.submitted = '';
    };

    $scope.viewDonor = function (item) {

      $scope.donor = item;
      DonorService.setDonor(item);

      $scope.format = DATEFORMAT;
      $scope.initDate = item.birthDate;
      $scope.calIcon = 'fa-calendar';

      $scope.donorBirthDateOpen = false;

      $location.path("/viewDonor/" + item.id).search({});
    };

    $scope.addNewDonor = function (donor){
      DonorService.setDonor(donor);
      $location.path("/addDonor");
    };

    $scope.addDonor = function (newDonor, dob, valid) {

      if (valid) {

        newDonor.birthDate = dob.year + "-" + dob.month + "-" + dob.dayOfMonth;

        $scope.addingDonor = true;

        DonorService.addDonor(newDonor, function(donor) {

          $scope.format = DATEFORMAT;
          $scope.initDate = $scope.donor.birthDate;
          $scope.calIcon = 'fa-calendar';

          $scope.donorBirthDateOpen = false;
          $scope.submitted = '';
          $location.path("/viewDonor/" + donor.id).search({});
        }, function(err) {
          $scope.errorMessage = err.userMessage;
          $scope.err = err;
          if (err["donor.birthDate"]) {
            $scope.dobValid = false;
          }
          $scope.addingDonor = false;
        });
      }
      else {
        $scope.submitted = true;
      }
    };

    $scope.updateDonor = function (donor){
      var d = $q.defer();
      DonorService.updateDonor(donor, function(response){
          $scope.donor = response;
          //Reset Error Message
          $scope.err = null;
          d.resolve();
          if ($scope.donorPermissions) {
            $scope.donorPermissions.canDelete = response.permissions.canDelete;
          }
        },
        function(err){
          $scope.donor = donor;
          $scope.err = err;
          d.reject('Server Error');
        });
      return d.promise;
    };

    $scope.raiseError = function (errorName, errorMessage) {
      $scope.formErrors.push(
        {
          name : errorName,
          error: errorMessage
        }
      );
    };

    $scope.clearError = function (errorName) {
      $scope.errorObject[errorName] = [];
      $scope.formErrors = $scope.formErrors.filter(function( obj ) {
        return obj.name !== errorName;
      });
    };

    $scope.onCancel = function () {
      $scope.errorObject = {};
      $scope.formErrors = [];
    };

    $scope.errorObject = {};

    $scope.getError = function (errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function( obj ) {
        return obj.name == errorName;
      });
    };

    $scope.formErrors = [];

    $scope.checkIdentifier = function (data) {
      if (!data.idNumber || data.idType === undefined) {
        $scope.clearError('identifier');
        $scope.raiseError('identifier',  'Please enter a valid identifier');
        $scope.getError('identifier');
        return ' ';
      } else {
        $scope.clearError('identifier');
      }
    };

    $scope.master = DonorService.getDonor();

    $scope.cancelForm = function (donor, form) {
      $scope.clearForm(form);
      DonorService.getDonorById(donor.id, function (freshDonor) {
        $scope.donor = freshDonor;
        $scope.err = null;
      }, function (err) {
        $scope.err = err;
      });
    };

    $scope.postalSameAsHome = false;
    $scope.workSameAsHome = false;


    $scope.sameAsHome = function (form, addressType) {
      if (addressType == 'Postal'){
        form.postalAddressLine1.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressLine1.$modelValue);
        form.postalAddressLine1.$render();
        form.postalAddressLine2.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressLine2.$modelValue);
        form.postalAddressLine2.$render();
        form.postalAddressCity.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressCity.$modelValue);
        form.postalAddressCity.$render();
        form.postalAddressDistrict.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressDistrict.$modelValue);
        form.postalAddressDistrict.$render();
        form.postalAddressState.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressState.$modelValue);
        form.postalAddressState.$render();
        form.postalAddressProvince.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressProvince.$modelValue);
        form.postalAddressProvince.$render();
        form.postalAddressCountry.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  '' : form.homeAddressCountry.$modelValue);
        form.postalAddressCountry.$render();
        form.postalAddressZipcode.$setViewValue((form.postalSameAsHome.$viewValue === false) ?  null : form.homeAddressZipcode.$modelValue);
        form.postalAddressZipcode.$render();
      }

      if (addressType == 'Work'){
        form.workAddressLine1.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressLine1.$modelValue);
        form.workAddressLine1.$render();
        form.workAddressLine2.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressLine2.$modelValue);
        form.workAddressLine2.$render();
        form.workAddressCity.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressCity.$modelValue);
        form.workAddressCity.$render();
        form.workAddressDistrict.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressDistrict.$modelValue);
        form.workAddressDistrict.$render();
        form.workAddressState.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressState.$modelValue);
        form.workAddressState.$render();
        form.workAddressProvince.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressProvince.$modelValue);
        form.workAddressProvince.$render();
        form.workAddressCountry.$setViewValue((form.workSameAsHome.$viewValue === false) ?  '' : form.homeAddressCountry.$modelValue);
        form.workAddressCountry.$render();
        form.workAddressZipcode.$setViewValue((form.workSameAsHome.$viewValue === false) ?  null : form.homeAddressZipcode.$modelValue);
        form.workAddressZipcode.$render();
      }

    };

    $scope.edit = function () {
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 8,          // count per page
        sorting: {}
    }, {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function ($defer, params) {
            var orderedData = params.sorting() ?
              $filter('orderBy')(data, params.orderBy()) : data;
            params.total(orderedData.length); // set total for pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
  })

  // Controller for Viewing Donors
  .controller('ViewDonorCtrl', function ($scope, $location, $modal, Alerting, DonorService, TestingService, ICONS, PACKTYPE, MONTH, TITLE,
      GENDER, DATEFORMAT, DONATION, $filter, $q, ngTableParams, $timeout,$routeParams) {


    DonorService.getDonorById($routeParams.id, function (donor) {
      DonorService.setDonor(donor);
      $scope.donor = donor;
      $scope.donorPermissions.canDelete = donor.permissions.canDelete;
    }, function(err){
      $location.path('/findDonor');
    });

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



    DonorService.getDonorFormFields(function(response){
      if (response !== false){
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
      else{
      }
    });

    $scope.getDonorOverview = function () {
      DonorService.getDonorOverview($routeParams.id, function(response){
        if (response !== false){
          $scope.data = response;
          $scope.flaggedForCounselling = $scope.data.flaggedForCounselling;
          $scope.currentlyDeferred = $scope.data.currentlyDeferred;
          $scope.deferredUntil = $scope.data.deferredUntil;
          $scope.lastDonation = $scope.data.lastDonation;
          $scope.dateOfFirstDonation = $scope.data.dateOfFirstDonation;
          $scope.totalDonations = $scope.data.totalDonations;
          $scope.dueToDonate = $scope.data.dueToDonate;
          $scope.totalAdverseEvents = response.totalAdverseEvents;
          $scope.donorPermissions.canDelete = response.canDelete;
          $scope.isEligible = response.isEligible;
        }
        else{
        }
      });
    };

    $scope.getDonorOverview();

    DonorService.getDeferralsFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.deferralReasons = $scope.data.deferralReasons;
      }
      else{
      }
    });

    $scope.printDonorBarcode = function () {
      DonorService.getDonorBarcode($scope.donor.id, function(response){
        if (response !== false){
          $scope.labelZPL = response.labelZPL;
          console.log("$scope.labelZPL: ", $scope.labelZPL);
        }
        else{
        }
      });
    };

    $scope.getDeferrals = function (donorId) {
      $scope.confirmDelete = false;
      $scope.deferralView = 'viewDeferrals';

      DonorService.getDeferrals(donorId, function(response){
        if (response !== false){
          $scope.deferralsData = response.allDonorDeferrals;
          $scope.deferralResults = true;
        }
        else{
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
        getData: function ($defer, params) {
          var deferralsData = $scope.deferralsData;

          var orderedData = params.sorting() ?
            $filter('orderBy')(deferralsData, params.orderBy()) : deferralsData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

      $scope.$watch("deferralsData", function () {
        $timeout(function(){ $scope.deferralTableParams.reload(); });
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
          $scope.deferredUntil = "No current deferrals";
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
        if (deferralReason.durationType === "PERMANENT") {
          newEndDate.setFullYear(2100,0,1);
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

    $scope.getDonations = function (donorId) {
      $scope.confirmDelete = false;
      $scope.donationsView = 'viewDonations';

      DonorService.getDonations(donorId, function(response){
        if (response !== false){
          $scope.donationsData = response.allDonations;
          if ($scope.donationsData.length > 0){
            $scope.donationResults = true;
          }
          else {
            $scope.donationResults = false;
          }
        }
        else{
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
        getData: function ($defer, params) {
          var donationsData = $scope.donationsData;

          var orderedData = params.sorting() ?
            $filter('orderBy')(donationsData, params.orderBy()) : donationsData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

      $scope.$watch("donationsData", function () {
        $timeout(function(){ $scope.donationTableParams.reload(); });
      });



    };

    $scope.manageDeferral = function () {

      $scope.format = DATEFORMAT;
      $scope.initDate = new Date();
      $scope.calIcon = 'fa-calendar';

      $scope.dateFromOpen = false;
      $scope.dateToOpen = false;

      $scope.deferralView = 'manageDeferral';

    };

    $scope.viewDonationSummary = function (din) {

      $scope.donation = $filter('filter')($scope.donationsData, {donationIdentificationNumber : din})[0];

      DonorService.getDonationsFormFields(function(response) {
        if (response !== false) {
          $scope.haemoglobinLevels = response.haemoglobinLevels;
          $scope.packTypes = response.packTypes;
          $scope.adverseEventTypes = [null].concat(response.adverseEventTypes);
        }
      });

      $scope.donationsView = 'viewDonationSummary';

    };

    $scope.returnToListView = function () {

      $scope.donationsView = 'viewDonations';

    };

    $scope.updateDonation = function (donation){

      DonorService.updateDonation(donation, function(response){
        if (response === true){

          $scope.addDonationSuccess = true;
          $scope.donation = {};
          $location.path("/addDonation");

        }
        else{
          // TODO: handle case where response == false
          $scope.addDonationSuccess = false;
        }
      });
    };

    $scope.validateForm = function (form){
      if (form.$valid) {
        return true;
      } else {
        return 'This form is not valid';
      }
    };

    $scope.raiseError = function (errorName, errorMessage) {
      $scope.formErrors.push(
        {
          name : errorName,
          error: errorMessage
        }
      );
    };

    $scope.clearError = function (errorName) {
      $scope.errorObject[errorName] = [];
      $scope.formErrors = $scope.formErrors.filter(function( obj ) {
        return obj.name !== errorName;
      });
    };

    $scope.errorObject = {};

    $scope.getError = function (errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function( obj ) {
        return obj.name == errorName;
      });
    };

    $scope.formErrors = [];

    $scope.checkErrors = function (min, max) {
      if (min || max) {
        return ' ';
      }
    };

    $scope.checkBleedTimes = function(data) {

      if (new Date(data.bleedEndTime) < new Date(data.bleedStartTime)){
        $scope.clearError('bleedTime');
        $scope.raiseError('bleedTime',  'Bleed start time should be less than end time');
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
        $scope.getDonorOverview();
      }, function(err) {
        console.error(err);
        $scope.confirmDelete = false;
      });
    };

    $scope.viewAddDonationForm = function (){

      // set initial bleed times
      $scope.bleedStartTime = new Date();
      $scope.bleedEndTime = new Date();
      $scope.adverseEvent = {
        type: null,
        comment: ''
      };

      $scope.donationsView = "addDonation";

      $scope.getDonationsFormFields();
      $scope.getOpenDonationBatches();
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

    $scope.addDonation = function(donation, donationBatch, bleedStartTime, bleedEndTime, valid) {

      if (valid) {

        confirmAddDonation(donation, donationBatch).then(function() {
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

          DonorService.addDonation(donation, function () {

            $scope.addDonationSuccess = true;
            $scope.donation = {};
            $scope.getDonations($scope.donor.id);
            $scope.donationsView = 'viewDonations';
            $scope.submitted = '';
            $scope.getDonorOverview();

            $scope.addingDonation = false;

          }, function(err) {
            $scope.err = err;
            $scope.addDonationSuccess = false;
            // refresh donor overview after adding donation
            $scope.getDonorOverview();

            $scope.addingDonation = false;
          });
        }, function() {
          // Do nothing
        });
      }
      else {
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };

    $scope.getOpenDonationBatches = function (){

      DonorService.getOpenDonationBatches( function(response){
        if (response !== false){
          $scope.donationBatches = response.donationBatches;
          if ($scope.donationBatches.length > 0){
            $scope.openDonationBatches = true;
          }
          else {
            $scope.openDonationBatches = false;
          }
        }
        else{
        }
      });
    };

    $scope.getDonationsFormFields = function (){

      DonorService.getDonationsFormFields(function(response){
          if (response !== false){
            $scope.data = response;
            $scope.packTypes = $scope.data.packTypes;
            $scope.donationTypes = $scope.data.donationTypes;
            $scope.donation = $scope.data.addDonationForm;
            $scope.haemoglobinLevels = $scope.data.haemoglobinLevels;
            $scope.adverseEventTypes = response.adverseEventTypes;
          }
          else{
          }
        });
    };

    $scope.populateEndDate = function(deferral) {
      var deferralReason = deferral.deferralReason;
      deferral.deferredUntil = deferralReason.durationType === 'PERMANENT' ?
          moment('2100-01-01').toDate() :
          moment().add(deferralReason.defaultDuration, 'days').toDate();
    };

    $scope.addDeferral = function (deferral, addDeferralForm){

      if (addDeferralForm.$valid){
        deferral.deferredDonor = $scope.donor.id;

        $scope.addingDeferral = true;

        DonorService.addDeferral(deferral, function(response){
          if (response === true){
            $scope.deferral = {};
            $scope.getDeferrals($scope.donor.id);
            $scope.getDonorOverview();
            $scope.submitted = '';
            $scope.deferral = {};
            // set form back to pristine state
            addDeferralForm.$setPristine();
          }
          else{
            // TODO: handle case where response == false
          }
          $scope.addingDeferral = false;
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };



    /**
     *  Delete Donor Logic
     *
     */

    $scope.confirmDelete = function(donor){
      Alerting.alertReset();

      var deleteObject = {
        title: 'Delete Donor',
        button: 'Delete',
        message: 'Are you sure you wish to delete the donor "' + donor.firstName + ' ' + donor.lastName + ', '+ donor.donorNumber + '"?'
      };

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return deleteObject;
          }
        }
      });

      modalInstance.result.then(function () {
        // Delete confirmed - delete the donor
        $scope.deleteDonor(donor);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    $scope.deleteDonor = function(donor) {
      DonorService.deleteDonor(donor.id, function() {
        deleteCallback(false, donor);
        $location.path('findDonor').search({});
      }, function(err) {
        deleteCallback(err, donor);
        $location.path("viewDonor/" + donor.id)
          .search({failed: true}); // If I do not set a parameter the route does not change, this needs to happen to refresh the donor.
      });
    };

    var deleteCallback = function (err, donor) {
      if (err) {
        Alerting.alertAddMsg(true, 'top', 'danger', 'An error has occurred while deleting the donor "' + donor.firstName + ' ' + donor.lastName + ', ' + donor.donorNumber + '" Error :' + err.status + ' - ' + err.data.developerMessage);
      } else {
        Alerting.alertAddMsg(true, 'top', 'success', 'Donor "' + donor.firstName + ' ' + donor.lastName + ', ' + donor.donorNumber + '" has been deleted successfully');
      }
    };
  })

  // Controller for Adding Donors
  .controller('AddDonorCtrl', function ($scope, $location, DonorService, MONTH, TITLE, GENDER) {

    DonorService.getDonorFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.addressTypes = $scope.data.addressTypes;
        $scope.languages = $scope.data.languages;
        $scope.venues = $scope.data.venues;
        $scope.donor = $scope.data.addDonorForm;
        $scope.searchDonor = DonorService.getDonor();
        $scope.donor.firstName = $scope.searchDonor.firstName;
        $scope.donor.lastName = $scope.searchDonor.lastName;

        // clear $scope.searchDonor fields after assigning them to $scope.donor
        $scope.searchDonor.firstName = '';
        $scope.searchDonor.lastName = '';

        $scope.title = TITLE.options;
        $scope.month = MONTH.options;
        $scope.gender = GENDER.options;
      }
      else{
      }
    });


  })

  // Controller for Viewing Duplicate Donors
  .controller('DonorsDuplicateCtrl', function ($scope, $location, DonorService, $filter, ngTableParams, $timeout) {

    var data = [{}];
    $scope.data = data;
    var duplicateGroups = [{}];
    $scope.duplicateGroups = duplicateGroups;
    $scope.hasDuplicates = false;

    $scope.findDonorDuplicates = function () {
      // FIXME: since we only display the summary, the API endpoint doesn't need to return all duplicates
      DonorService.findAllDonorDuplicates(function(response) {
        if (response !== false) {
          // take the duplicate donor data and convert into a summary array
          data = [];
          var duplicateCount = 0;
          duplicateGroups = response.duplicates;
          var len = duplicateGroups.length;
          // go through the duplicate groups which are stored as a map of arrays
          for (var groupKey in duplicateGroups) {
            duplicateCount++;
            var duplicates = duplicateGroups[groupKey];
            if (duplicates) {
              // create a summary for the 1st donor
              var donor = duplicates[0];
              if (donor) {
                var duplicateSummary = {};
                duplicateSummary.groupKey = groupKey;
                duplicateSummary.firstName = donor.firstName;
                duplicateSummary.lastName = donor.lastName;
                duplicateSummary.birthDate = donor.birthDate;
                duplicateSummary.gender = donor.gender;
                duplicateSummary.count = duplicates.length;
                data.push(duplicateSummary);
              }
            }
          }
          $scope.data = data;
          $scope.duplicateGroups = duplicateGroups;
          $scope.duplicateDonorCount = duplicateCount;
          $scope.totalCount = $scope.data.length;
          if ($scope.totalCount > 0) {
            $scope.hasDuplicates = true;
          }
        }
      });
    };

    $scope.findDonorDuplicates();

    $scope.duplicateDonorTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 12,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: $scope.data.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
    $scope.$watch("data", function () {
      $timeout(function(){ $scope.duplicateDonorTableParams.reload(); });
    });

    $scope.viewDuplicates = function (item) {
      $location.path("/manageDuplicateDonors").search({groupKey: item.groupKey});
    };
  })

  // Controller for Viewing Duplicate Donors
  .controller('ManageDonorsDuplicateCtrl', function ($scope, $window, $location, $routeParams, DonorService, $filter, ngTableParams, $timeout) {

    var duplicatesData = [{}];
    $scope.duplicatesData = duplicatesData;
    $scope.duplicateCount = 0;

    var donationsData = [{}];
    $scope.donationsData = donationsData;

    var deferralsData = [{}];
    $scope.deferralsData = deferralsData;

    var groupKey = "1";
    if ($routeParams.groupKey) {
      groupKey = $routeParams.groupKey;
    }

    var currentStep = 1;
    $scope.currentStep = currentStep;
    $scope.lastStep = 7;
    var donorFields = {};
    $scope.donorFields = donorFields;

    var selectedDonorsData = [{}];
    $scope.selectedDonorsData = selectedDonorsData;

    var mergedDonor = {};
    $scope.mergedDonor = mergedDonor;

    // 1a: load the duplicates
    $scope.manageDonorDuplicates = function () {
      DonorService.findDonorDuplicates(groupKey, function(response) {
        if (response !== false) {
          duplicatesData = [];
          var duplicates = response.duplicates;
          angular.forEach(duplicates, function(donor, index) {
            donor.merge = null;
            duplicatesData.push(donor);
          });
        }
        $scope.duplicatesData = duplicatesData;
        $scope.donor = duplicatesData[0];
        $scope.duplicateCount = $scope.duplicatesData.length;
        $scope.groupKey = groupKey;
      });
    };
    $scope.manageDonorDuplicates(); // loaded on the 1st step
    $scope.manageDuplicateDonorTableParams = new ngTableParams({
      page: 1,
      count: 100,         // don't paginate (?)
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: $scope.duplicatesData.length,
      getData: function ($defer, params) {
        var filteredData = params.filter() ? $filter('filter')(duplicatesData, params.filter()) : duplicatesData;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : duplicatesData;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
    $scope.$watch("duplicatesData", function () {
      $timeout(function(){ $scope.manageDuplicateDonorTableParams.reload(); });
    });

    // 1b: selected donors to merge
    $scope.manageSelectedDuplicateDonorTableParams = new ngTableParams({
      page: 1,
      count: 100,         // don't paginate (?)
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: $scope.selectedDonorsData.length,
      getData: function ($defer, params) {
        var filteredData = params.filter() ? $filter('filter')(selectedDonorsData, params.filter()) : selectedDonorsData;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : selectedDonorsData;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
    $scope.$watch("selectedDonorsData", function () {
      $timeout(function(){ $scope.manageSelectedDuplicateDonorTableParams.reload(); });
    });

    // 2: do a preview of the merge and load the donations and the deferrals
    $scope.previewMerge = function() {
      DonorService.mergePreviewDonorsDuplicate(groupKey, $scope.copyMergedDonor(mergedDonor), 
        function(response) {
          // process donations
          donationsData = response.allDonations;
          $scope.donationsData = donationsData;
          if (donationsData.length === 0)
            $scope.donationResults = false;
          else
            $scope.donationResults = true;
          // process deferrals
          deferralsData = response.allDeferrals;
          if (deferralsData.length === 0)
            $scope.deferralResults = false;
          else
            $scope.deferralResults = true;
          $scope.deferralsData = deferralsData;
          // update mergedDonor
          $scope.updatedMergedDonor = response.mergedDonor;
          mergedDonor.dateOfFirstDonation = response.mergedDonor.dateOfFirstDonation;
          mergedDonor.dueToDonate = response.mergedDonor.dueToDonate;
          mergedDonor.dateOfLastDonation = response.mergedDonor.dateOfLastDonation;
        }, 
        function(err) {
          $scope.hasMessage = true;
          $scope.message = "Error merging the duplicate Donors. More information: "+err.moreInfo+" ... "+JSON.stringify(err);
        }
      );
    };

    $scope.copyMergedDonor = function() {
      // copy the existing mergedDonor
      var newMergedDonor = angular.copy(mergedDonor);
      $scope.newMergedDonor = newMergedDonor;
      // set the data that isn't selectable
      newMergedDonor.firstName = selectedDonorsData[0].firstName;
      newMergedDonor.lastName = selectedDonorsData[0].lastName;
      newMergedDonor.gender = selectedDonorsData[0].gender;
      newMergedDonor.birthDate = selectedDonorsData[0].birthDate;
      // clear the temporary selections
      delete newMergedDonor.idNumberId;
      delete newMergedDonor.homeAddress;
      delete newMergedDonor.workAddress;
      delete newMergedDonor.postalAddress;
      delete newMergedDonor.noteSelection;
      // clear the none selections
      angular.forEach(newMergedDonor, function(attribute, i) {
        if (attribute == "none") {
          newMergedDonor[i] = null;
        }
      });
      // set the duplicate donor numbers
      newMergedDonor.duplicateDonorNumbers = [];
      angular.forEach(selectedDonorsData, function(donor, i) {
        newMergedDonor.duplicateDonorNumbers.push(donor.donorNumber);
      });
      return newMergedDonor;
    };

    // Donations Table
    $scope.manageDuplicateDonorDonationsTableParams = new ngTableParams({
      page: 1,
      count: 6,
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [],
      total: $scope.donationsData.length,
      getData: function ($defer, params) {
        var filteredData = params.filter() ? $filter('filter')(donationsData, params.filter()) : donationsData;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : donationsData;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
    $scope.$watch("donationsData", function () {
      $timeout(function(){ $scope.manageDuplicateDonorDonationsTableParams.reload(); });
    });

    // Deferrals Table
    $scope.manageDuplicateDonorDeferralTableParams = new ngTableParams({
      page: 1,
      count: 6,
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [],
      total: $scope.deferralsData.length,
      getData: function ($defer, params) {
        var deferralsData = $scope.deferralsData;
        var filteredData = params.filter() ? $filter('filter')(deferralsData, params.filter()) : deferralsData;
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : deferralsData;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
    $scope.$watch("deferralsData", function () {
      $timeout(function(){ $scope.manageDuplicateDonorDeferralTableParams.reload(); });
    });

    $scope.goBack = function() {
      $window.history.back();
    };

    $scope.step = function(newStep, mergeDonorForm) {
      $scope.invalid = false;
      $scope.hasMessage = false;
      $scope.message = "";
      if ($scope.currentStep < newStep && !mergeDonorForm.$valid) {
        $scope.invalid = true;
        return;
      }
      if (newStep == 2) {
        // see which donors have been selected and then move onto the overview page
        selectedDonorsData = [];
        var donorFields = {};
        // set up the "None of the above" option and required error message flags
        donorFields.idNumber = false;
        donorFields.title = false;
        donorFields.callingName = false;
        donorFields.preferredLanguage = false;
        donorFields.venue = false;
        donorFields.contactMethodType = false;
        donorFields.email = false;
        donorFields.mobileNumber = false;
        donorFields.homeNumber = false;
        donorFields.workNumber = false;

        var bloodTypingMismatch = false;
        angular.forEach(duplicatesData, function(donor, i) {
          // if the donor is selected
          if (donor.merge) {
            // check if the donor has got any data and set the flags for the error message and none option to display
            if (donor.idNumber !== null && donor.idNumber !== '')
              donorFields.idNumber = true;
            if (donor.title !== null && donor.title !== '')
              donorFields.title = true;
            if (donor.callingName !== null && donor.callingName !== '')
              donorFields.callingName = true;
            if (donor.preferredLanguage !== null && donor.preferredLanguage !== '')
              donorFields.preferredLanguage = true;
            if (donor.venue !== null && donor.venue !== '')
              donorFields.venue = true;
            if (donor.contactMethodType !== null && donor.contactMethodType !== '')
              donorFields.contactMethodType = true;
            if (donor.contact.email !== null && donor.contact.email !== '')
              donorFields.email = true;
            if (donor.contact.mobileNumber !== null && donor.contact.mobileNumber !== '')
              donorFields.mobileNumber = true;
            if (donor.contact.homeNumber !== null && donor.contact.homeNumber !== '')
              donorFields.homeNumber = true;
            if (donor.contact.workNumber !== null && donor.contact.workNumber !== '')
              donorFields.workNumber = true;
            if (donor.preferredAddressType !== null && donor.preferredAddressType !== '')
              donorFields.preferredAddressType = true;
            if (donor.address.homeAddressLine1 !== null && donor.address.homeAddressLine1 !== '')
              donorFields.homeAddress = true;
            if (donor.address.workAddressLine1 !== null && donor.address.workAddressLine1 !== '')
              donorFields.workAddress = true;
            if (donor.address.postalAddressLine1 !== null && donor.address.postalAddressLine1 !== '')
              donorFields.postalAddress = true;
            // check the blood typing of the selected users
            if (mergedDonor.bloodRh) {
              if (donor.bloodRh && mergedDonor.bloodRh != donor.bloodRh) {
                bloodTypingMismatch = true;
              }
            } else {
              mergedDonor.bloodRh = donor.bloodRh;
            }
            if (mergedDonor.bloodAbo) {
              if (donor.bloodAbo && mergedDonor.bloodAbo != donor.bloodAbo) {
                bloodTypingMismatch = true;
              }
            } else {
              mergedDonor.bloodAbo = donor.bloodAbo;
            }
            // save the donor
            selectedDonorsData.push(donor);
          }
        });
        $scope.selectedDonorsData = selectedDonorsData;
        $scope.donorFields = donorFields;
        if (selectedDonorsData === null || selectedDonorsData.length<=1) {
          $scope.message = "Please select at least two donors.";
          $scope.invalid = true;
          $scope.hasMessage = true;
          return;
        }
        if (bloodTypingMismatch) {
          if ($scope.bloodTypingMismatchCheck) {
            // they've confirmed the mismatch
            mergedDonor.bloodAbo = "";
            mergedDonor.bloodRh = "";
          } else {
            // show them the mismatch message
            $scope.message = "The selected donors do not have the same blood group. If you continue, the merged donor will not be assigned a blood group, and will be considered a first time donor.";
            $scope.invalid = true;
            $scope.hasMessage = true;
            $scope.bloodTypingMismatchCheck = true;
            return;
          }
        }
      } else if (newStep == 3) {
        // set the idType and idNumber according to which option was selected
        mergedDonor.notes = "";
        angular.forEach(selectedDonorsData, function(donor, i) {
          if (donor.id == mergedDonor.idNumberId) {
            mergedDonor.idType = donor.idType;
            mergedDonor.idNumber = donor.idNumber;
          }
          // set the notes according to what was selected
          if (mergedDonor.noteSelection && mergedDonor.noteSelection[donor.id]) {
            if (mergedDonor.notes) {
              if (mergedDonor.notes.length > 0) {
                mergedDonor.notes = mergedDonor.notes.concat(", ");
              }
              mergedDonor.notes = mergedDonor.notes.concat(donor.notes);
            } else {
              mergedDonor.notes = donor.notes;
            }
          }
        });
      } else if (newStep == 4) {
      } else if (newStep == 5) {
        // set the work, home and postal addresses according to which option was selected
        mergedDonor.address = {};
        angular.forEach(selectedDonorsData, function(donor, i) {
          if (donor.address.id == mergedDonor.homeAddress) {
            mergedDonor.address.homeAddressLine1 = donor.address.homeAddressLine1;
            mergedDonor.address.homeAddressLine2 = donor.address.homeAddressLine2;
            mergedDonor.address.homeAddressCity = donor.address.homeAddressCity;
            mergedDonor.address.homeAddressProvince = donor.address.homeAddressProvince;
            mergedDonor.address.homeAddressDistrict = donor.address.homeAddressDistrict;
            mergedDonor.address.homeAddressCountry = donor.address.homeAddressCountry;
            mergedDonor.address.homeAddressState = donor.address.homeAddressState;
            mergedDonor.address.homeAddressZipcode = donor.address.homeAddressZipcode;
          }
          if (donor.address.id == mergedDonor.postalAddress) {
            mergedDonor.address.postalAddressLine1 = donor.address.postalAddressLine1;
            mergedDonor.address.postalAddressLine2 = donor.address.postalAddressLine2;
            mergedDonor.address.postalAddressCity = donor.address.postalAddressCity;
            mergedDonor.address.postalAddressProvince = donor.address.postalAddressProvince;
            mergedDonor.address.postalAddressDistrict = donor.address.postalAddressDistrict;
            mergedDonor.address.postalAddressCountry = donor.address.postalAddressCountry;
            mergedDonor.address.postalAddressState = donor.address.postalAddressState;
            mergedDonor.address.postalAddressZipcode = donor.address.postalAddressZipcode;
          }
          if (donor.address.id == mergedDonor.workAddress) {
            mergedDonor.address.workAddressLine1 = donor.address.workAddressLine1;
            mergedDonor.address.workAddressLine2 = donor.address.workAddressLine2;
            mergedDonor.address.workAddressCity = donor.address.workAddressCity;
            mergedDonor.address.workAddressProvince = donor.address.workAddressProvince;
            mergedDonor.address.workAddressDistrict = donor.address.workAddressDistrict;
            mergedDonor.address.workAddressCountry = donor.address.workAddressCountry;
            mergedDonor.address.workAddressState = donor.address.workAddressState;
            mergedDonor.address.workAddressZipcode = donor.address.workAddressZipcode;
          }
        });
        // load data for next step
        //$scope.viewDonorsDeferrals();
        $scope.previewMerge();
      } else if (newStep == 6) {
        // load data for next step
        //$scope.viewDonorsDonations();
      } else if (newStep == 7) {
        // FIXME: review & run tests!!
      }
      $scope.currentStep = newStep;
    };

    $scope.merge = function (item) {
      // submit
      DonorService.mergeDonorsDuplicate(groupKey, $scope.copyMergedDonor(mergedDonor), 
        function(mergedDonor) {
          $location.path("/viewDonor/" + mergedDonor.id).search({});
        }, 
        function(err) {
          $scope.hasMessage = true;
          $scope.message = "Error merging the duplicate Donors. More information: "+err.moreInfo+" ... "+JSON.stringify(err);
        }
      );
    };

    $scope.cancel = function (item) {
      $location.path('/duplicateDonors');
    };
  })

  // Controller for Managing the Donor Clinic
  .controller('DonorClinicCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, $q, $filter, DATEFORMAT, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = [{}];
    var recentDonationBatchData = [{}];
    $scope.data = data;
    $scope.recentDonationBatchData = recentDonationBatchData;
    $scope.openDonationBatches = false;
    $scope.recentDonationBatches = false;
    $scope.newDonationBatch = {backEntry: false};
    $scope.dateFormat = DATEFORMAT;

    $scope.getOpenDonationBatches = function (){

      DonorService.getOpenDonationBatches( function(response){
        if (response !== false){
          data = response.donationBatches;
          $scope.data = data;
          DonorService.getDonationBatchFormFields( function(response){
            $scope.venues = response.venues;
            angular.forEach(data, function(item) {
              angular.forEach($scope.venues, function(panel, i){
                if (panel.name == item.venue.name){
                  $scope.venues[i].disabled = true;
                }
              });
            });
          }, console.error);

          if (data.length > 0){
            $scope.openDonationBatches = true;
          }
          else {
            $scope.openDonationBatches = false;
          }
        }
        else{
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
      isClosed:true,
      selectedVenues: [],
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.clearSearch = function() {
      $location.search({});
      $scope.searched = false;
      $scope.search = angular.copy(master);

      
    };

    $scope.search = angular.copy(master);


    $scope.getRecentDonationBatches = function (){
      var query = angular.copy(master);

      if ($scope.search.startDate) {
        var startDate =  moment($scope.search.startDate).startOf('day').toDate();
        query.startDate = startDate;
      }

      if ($scope.search.endDate) {
        var endDate =  moment($scope.search.endDate).endOf('day').toDate();
        query.endDate = endDate;
      }

      if ($scope.search.selectedVenues.length > 0) {
        query.venues = $scope.search.selectedVenues;
      }

      $scope.searching = true;

      DonorService.getRecentDonationBatches(query,  function(response){
        $scope.searching = false;
        if (response !== false){
          recentDonationBatchData = response.donationBatches;
          $scope.recentDonationBatchData = recentDonationBatchData;
          if (recentDonationBatchData.length > 0){
            $scope.recentDonationBatches = true;
          }


          else {
            $scope.recentDonationBatches = false;
          }
        }
        else{
        }
      }, function(err) {
        $scope.searching = false;
        console.log(err);
      });
    };


    $scope.getRecentDonationBatches();

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
      $timeout(function(){ $scope.donationBatchTableParams.reload(); });
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
      total: recentDonationBatchData.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(recentDonationBatchData, params.filter()) : recentDonationBatchData;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : recentDonationBatchData;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("recentDonationBatchData", function () {
      $timeout(function(){ $scope.recentDonationBatchesTableParams.reload(); });
    });

    $scope.addDonationBatch = function (donationBatch, donationBatchForm){
      if(donationBatchForm.$valid){

        $scope.addingDonationBatch = true;

        DonorService.addDonationBatch(donationBatch, function(response){
            $scope.newDonationBatch = {backEntry: false};
            $scope.getOpenDonationBatches();
            // set form back to pristine state
            donationBatchForm.$setPristine();
            $scope.submitted = '';
            $scope.addingDonationBatch = false;

        }, function (err){
          $scope.err = err;
          $scope.addingDonationBatch = false;
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };

    $scope.manageClinic = function (item){

      $scope.donationBatch = item;
      DonorService.setDonationBatch($scope.donationBatch);
      data = $scope.donationBatch.donations;
      $scope.data = data;
      $location.path("/manageClinic/" + item.id);

    };

  })

  // Controller for Managing the Donor Clinic
  .controller('ViewDonationBatchCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE,  DATEFORMAT, DONATION, $q, $filter, ngTableParams, $timeout, $routeParams, $modal) {

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


    $scope.init = function () {
      DonorService.getDonationBatchById($routeParams.id, function (donationBatch) {
        $scope.donationBatch = donationBatch;
        data = donationBatch.donations;
        $scope.gridOptions.data = donationBatch.donations;
        $scope.data = data;

        DonorService.getDonationBatchFormFields(function (response) {
          $scope.venues = response.venues;
        }, console.error);
      }, console.error);
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
        if ($scope.donationBatch.isClosed){
          status = "Closed";
        } else {
          status = "Open";
        }

        var columns = [
          {text: 'Batch Status: ' + status, width: 'auto'},
          {text: 'Venue: ' + venue, width: 'auto'},
          {text: 'Date Created: ' + dateCreated , width: 'auto'},
          {text: 'Last Updated: ' + lastUpdated , width: 'auto'}
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

      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      }
    };

    $scope.init();

    $scope.export = function(format){
      if(format === 'pdf'){
        $scope.gridApi.exporter.pdfExport('all', 'all');
      }
      else if (format === 'csv'){
        $scope.gridApi.exporter.csvExport('all', 'all');
      }
    };

    $scope.returnToListView = function () {

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
          console.error(err);
        });
      } else {
        DonorService.updateDonationBatch(donationBatch, function(response) {
          $scope.refreshDonationBatch(donationBatch, response);
        }, function(err) {
          console.error(err);
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
        $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : $scope.donation.donationIdentificationNumber})[0];
      }
    };

    $scope.closeDonationBatch = function (donationBatch){
      DonorService.closeDonationBatch(donationBatch, function(response) {
        $location.path("/manageDonationBatches");
      }, function(err) {
        console.error(err);
      });
    };

    $scope.deleteDonationBatch = function (donationBatchId){
      DonorService.deleteDonationBatch(donationBatchId, function(response) {
        $location.path("/manageDonationBatches");
      }, function(err) {
        console.error(err);
      });
    };


    $scope.onRowClick = function (row) {
      $scope.viewDonationSummary(row.entity);
    };

    $scope.viewDonationSummary = function (donation) {
      $scope.donation = donation;
      $scope.donationBatchView = 'viewDonationSummary';

      DonorService.getDonationsFormFields(function(response) {
        if (response !== false) {
          $scope.haemoglobinLevels = response.haemoglobinLevels;
          $scope.packTypes = response.packTypes;
          $scope.adverseEventTypes = [null].concat(response.adverseEventTypes);
        }
      });
    };

    $scope.viewAddDonationForm = function (){

      $scope.err = {};
      $scope.addDonationSuccess = null;
      $scope.donation = {};
      $scope.donorSummary = {};
      $scope.donorSummaryLoading = false;

      $scope.$watch('donation.donorNumber', function() {
        if ($scope.donation.donorNumber) {
          $scope.donorSummaryLoading = true;
          DonorService.getDonorSummaries($scope.donation.donorNumber, function(data) {
            $scope.donorSummary = data.donor;
            $scope.donorSummary.eligible = data.eligible;
            $scope.donorSummaryLoading = false;
          });
        }
      });

      // set initial bleed times
      $scope.bleedStartTime = new Date();
      $scope.bleedEndTime = new Date();

      $scope.donationBatchView = "addDonation";

      DonorService.getDonationsFormFields(function(response){
        if (response !== false){
          $scope.data = response;
          $scope.venues = response.venues;
          $scope.packTypes = $scope.data.packTypes;
          $scope.donationTypes = $scope.data.donationTypes;
          $scope.donation = $scope.data.addDonationForm;
          $scope.haemoglobinLevels = $scope.data.haemoglobinLevels;
          $scope.adverseEventTypes = response.adverseEventTypes;
        }
        else{
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

    $scope.addDonation = function(donation, bleedStartTime, bleedEndTime, valid) {

      if (valid) {

        confirmAddDonation(donation).then(function() {
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

    $scope.updateDonation = function (donation){

      //$scope.addDonationSuccess = '';

      DonorService.updateDonation(donation, function(response){
        if (response === true){

          $scope.addDonationSuccess = true;
          $scope.donation = {};
          $location.path("/addDonation");

        }
        else{
          // TODO: handle case where response == false
          $scope.addDonationSuccess = false;
        }
      });
    };

    $scope.validateForm = function (form){
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
        console.error(err);
        $scope.confirmDelete = false;
      });
    };

    $scope.close = function () {

    };

    $scope.raiseError = function (errorName, errorMessage) {
      $scope.formErrors.push(
        {
          name : errorName,
          error: errorMessage
        }
      );
    };

    $scope.clearError = function (errorName) {
      $scope.errorObject[errorName] = [];
      $scope.formErrors = $scope.formErrors.filter(function( obj ) {
        return obj.name !== errorName;
      });
    };

    $scope.errorObject = {};

    $scope.getError = function (errorName) {
      $scope.errorObject[errorName] = $scope.formErrors.filter(function( obj ) {
        return obj.name == errorName;
      });
    };

    $scope.formErrors = [];

    $scope.checkErrors = function (min, max) {
      if (min || max) {
        return ' ';
      }
    };

    $scope.checkBleedTimes = function(data) {

      if (new Date(data.bleedEndTime) < new Date(data.bleedStartTime)){
        $scope.clearError('bleedTime');
        $scope.raiseError('bleedTime',  'Bleed start time should be less than end time');
        $scope.getError('bleedTime');
        return ' ';
      } else {
        $scope.clearError('bleedTime');
      }
    };
  })

;
