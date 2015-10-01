'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $rootScope, $location, $routeParams, ConfigurationsService, DonorService, ICONS, PERMISSIONS, DATEFORMAT, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.getBooleanValue = ConfigurationsService.getBooleanValue;

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



    $scope.findDonor = function () {
      $scope.donorSearch.search = true;
      $location.search($scope.donorSearch);
      DonorService.findDonor($scope.donorSearch, function(response) {
        data = response.donors;
        $scope.searchResults = true;
        $scope.data = response.donors;
        $scope.canAddDonors = response.canAddDonors;
      }, function() {
        $scope.searchResults = false;
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
      } else if ($location.path().indexOf('/donorCounselling') === 0 && path.indexOf('/donorCounselling') === 0) {
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
      $scope.newDonationBatch = {};
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

        DonorService.addDonor(newDonor, function(donor) {

          $scope.format = DATEFORMAT;
          $scope.initDate = $scope.donor.birthDate;
          $scope.calIcon = 'fa-calendar';

          $scope.donorBirthDateOpen = false;
          $scope.submitted = '';
          $location.path("/viewDonor/" + donor.id).search({});
        }, function(err) {
          $scope.errorMessage = err.data.userMessage;
          $scope.err = err;
          if (err["donor.birthDate"]) {
            $scope.dobValid = false;
          }
        });
      }
      else {
        $scope.submitted = true;
      }
    };

    $scope.updateDonor = function (donor){

      DonorService.updateDonor(donor, function(response){
          $scope.donor = response;
        },
        // display error from back end
        function(err){
          $scope.err = err;
          if (err["donor.birthDate"]) {
            $scope.dobValid = false;
          }
        });

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
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, TestingService, ICONS, PACKTYPE, MONTH, TITLE,
      GENDER, DATEFORMAT, DONATION, $filter, $q, ngTableParams, $timeout,$routeParams) {

    DonorService.getDonorById($routeParams.id, function (donor) {
      DonorService.setDonor(donor);
      $scope.donor = donor;
    }, function(err){
      $location.path('/findDonor');
    });

    $scope.data = {};
    $scope.age = '';
    $scope.deferralsData = {};
    $scope.donationsData = {};

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
          var filteredData = params.filter() ?
            $filter('filter')(deferralsData, params.filter()) : deferralsData;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : deferralsData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

      $scope.$watch("deferralsData", function () {
        $timeout(function(){ $scope.deferralTableParams.reload(); });
      });

      $scope.deferralReasonsFilter = function(column) {
        var def = $q.defer();
        var arr = [];
        angular.forEach($scope.deferralReasons, function(item){
          arr.push({
            'id': item.reason,
            'title': item.reason
          });
        });
        def.resolve(arr);
        return def;
      };

    };

    $scope.getDonations = function (donorId) {

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
          var filteredData = params.filter() ?
            $filter('filter')(donationsData, params.filter()) : donationsData;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : donationsData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

      $scope.$watch("donationsData", function () {
        $timeout(function(){ $scope.donationTableParams.reload(); });
      });

      $scope.packTypeFilter = function(column) {
        var def = $q.defer();
        var arr = [];
        angular.forEach(PACKTYPE.packtypes, function(item){
          arr.push({
              'id': item.name,
              'title': item.name
          });
        });
        def.resolve(arr);
        return def;
      };

    };

    $scope.manageDeferral = function () {

      $scope.format = DATEFORMAT;
      $scope.initDate = new Date();
      $scope.calIcon = 'fa-calendar';

      $scope.dateFromOpen = false;
      $scope.dateToOpen = false;

      $scope.deferralView = 'manageDeferral';

    };

    $scope.viewDonationDetails = function (din) {

      var requests = [];
      $scope.donation = $filter('filter')($scope.donationsData, {donationIdentificationNumber : din})[0];
      $scope.testResults = {};

      var testResultsRequest = TestingService.getTestResultsByDIN(din, function(response){
        if (response !== false){
          $scope.testResults = response.testResults.recentTestResults;
        }
        else{
        }
        requests.push(testResultsRequest);
      });

      $q.all(requests).then(function(){
        $scope.donationsView = 'viewDonationDetails';
      });

    };

    $scope.deleteDonation = function(donationId) {
      DonorService.deleteDonation(donationId, function() {
        $scope.donationsData = $scope.donationsData.filter(function(donation) {
          return donation.id !== donationId;
        });
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

    $scope.addDonation = function (donation, donationBatch, bleedStartTime, bleedEndTime, valid) {

      if (valid) {
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

        DonorService.addDonation(donation, function (response) {

          $scope.addDonationSuccess = true;
          $scope.donation = {};
          $scope.getDonations($scope.donor.id);
          $scope.donationsView = 'viewDonations';
          $scope.submitted = '';
          $scope.getDonorOverview();
        }, function (err) {
          $scope.err = err;
          $scope.addDonationSuccess = false;
          // refresh donor overview after adding donation
          $scope.getDonorOverview();

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
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };

    $scope.deleteDonor = function(donorId) {
      DonorService.deleteDonor(donorId, function() {
        $location.path('findDonor');
      }, function(err) {
        console.error(err);
      });
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

    // 2: load the donor's donations (loaded on the donations step)
    $scope.viewDonorsDonations = function() {
      $scope.donationResults = false;
      donationsData = [];
      angular.forEach(selectedDonorsData, function(donor, i) {
        // FIXME: use only one service
        DonorService.getDonations(donor.id, function(response) {
          if (response !== false) {
            angular.forEach(response.allDonations, function(donation, i) {
              donationsData.push(donation);
              $scope.donationsData = donationsData;
              $scope.donationResults = true;
            });
          }
        });
      });
    };
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

    // 3: load the donor's deferrals (loaded on the deferrals step)
    $scope.viewDonorsDeferrals = function() {
      $scope.deferralResults = false;
      deferralsData = [];
      angular.forEach(selectedDonorsData, function(donor, i) {
        // FIXME: use one service that returns all the deferrals
        DonorService.getDeferrals(donor.id, function(response) {
          if (response !== false) {
            angular.forEach(response.allDonorDeferrals, function(deferral, i) {
                deferralsData.push(deferral);
                $scope.deferralResults = true;
                $scope.deferralsData = deferralsData;
            });
          }
        });
      });
    };
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
        donorFields.donorPanel = false;
        donorFields.contactMethodType = false;
        donorFields.email = false;
        donorFields.mobileNumber = false;
        donorFields.homeNumber = false;
        donorFields.workNumber = false;

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
            if (donor.donorPanel !== null && donor.donorPanel !== '')
              donorFields.donorPanel = true;
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
      } else if (newStep == 3) {
        // set the idType and idNumber according to which option was selected
        angular.forEach(selectedDonorsData, function(donor, i) {
          if (donor.id == mergedDonor.idNumberId) {
            mergedDonor.idType = donor.idType;
            mergedDonor.idNumber = donor.idNumber;
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
        $scope.viewDonorsDeferrals();
      } else if (newStep == 6) {
        // load data for next step
        $scope.viewDonorsDonations();
      } else if (newStep == 7) {
        // FIXME: review & run tests!!
      }
      $scope.currentStep = newStep;
    };

    $scope.merge = function (item) {
      // set the data that isn't selectable
      mergedDonor.firstName = selectedDonorsData[0].firstName;
      mergedDonor.lastName = selectedDonorsData[0].lastName;
      mergedDonor.gender = selectedDonorsData[0].gender;
      mergedDonor.birthDate = selectedDonorsData[0].birthDate;
      // clear the temporary selections
      delete mergedDonor.idNumberId;
      delete mergedDonor.homeAddress;
      delete mergedDonor.workAddress;
      delete mergedDonor.postalAddress;
      // clear the none selections
      angular.forEach(mergedDonor, function(attribute, i) {
        if (attribute == "none") {
          mergedDonor[i] = null;
        }
      });
      // set the duplicate donor numbers
      mergedDonor.duplicateDonorNumbers = [];
      angular.forEach(selectedDonorsData, function(donor, i) {
        mergedDonor.duplicateDonorNumbers.push(donor.donorNumber);
      });
      // submit
      DonorService.mergeDonorsDuplicate(groupKey, mergedDonor, 
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

  // Controller for Adding Donations
  .controller('AddDonationCtrl', function ($scope, $location, DonorService, BPUNIT, HBUNIT, WEIGHTUNIT, PULSEUNIT) {

    $scope.bpUnit = BPUNIT;
    $scope.hbUnit = HBUNIT;
    $scope.weightUnit = WEIGHTUNIT;
    $scope.pulseUnit = PULSEUNIT;

    $scope.addDonationSuccess = '';

    $scope.adverseEvent = {
      type: null,
      comment: ''
    };

    DonorService.getDonationsFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.venues = response.venues;
        $scope.packTypes = $scope.data.packTypes;
        $scope.donationTypes = $scope.data.donationTypes;
        $scope.donation = $scope.data.addDonationForm;
        $scope.adverseEventTypes = response.adverseEventTypes;
      }
      else{
      }
    });

    $scope.addDonation = function (donation){

      $scope.addDonationSuccess = '';

      // set temporary venue - should be auto-populated from donation batch info
      donation.venue = $scope.venues[0];
      // set temporary donationDate
      donation.donationDate = '10/16/2014 12:00:00 am';

      if ($scope.adverseEvent.type) {
        donation.adverseEvent = $scope.adverseEvent;
      }

      DonorService.addDonation(donation, function(response){
          $scope.addDonationSuccess = true;
          $scope.donation = {};
          $location.path("/addDonation");
      }, function (err){
        $scope.err = err;
        $scope.addDonationSuccess = false;
      });
    };

  })

  // Controller for Managing the Donor Clinic
  .controller('DonorClinicCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, $q, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = [{}];
    var recentDonationBatchData = [{}];
    $scope.data = data;
    $scope.recentDonationBatchData = recentDonationBatchData;
    $scope.openDonationBatches = false;
    $scope.recentDonationBatches = false;
    $scope.newDonationBatch = {};


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

    $scope.getRecentDonationBatches = function (){

      DonorService.getRecentDonationBatches( function(response){
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

        DonorService.addDonationBatch(donationBatch, function(response){
            $scope.newDonationBatch = {};
            $scope.getOpenDonationBatches();
            // set form back to pristine state
            donationBatchForm.$setPristine();
            $scope.submitted = '';

        }, function (err){
          $scope.err = err;
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
  .controller('ViewDonationBatchCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE,  DATEFORMAT, DONATION, $q, $filter, ngTableParams, $timeout, $routeParams) {

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
        $scope.data = data;

        DonorService.getDonationBatchFormFields(function (response) {
          $scope.venues = response.venues;
        }, console.error);
      }, console.error);
    };

    $scope.init();

    $scope.donorClinicTableParams = new ngTableParams({
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
      $timeout(function(){ $scope.donorClinicTableParams.reload(); });
    });

    $scope.packTypeFilter = function(column) {
      var def = $q.defer();
      var arr = [];
      angular.forEach(PACKTYPE.packtypes, function(item){
        arr.push({
            'id': item.name,
            'title': item.name
        });
      });
      def.resolve(arr);
      return def;
    };

    $scope.viewDonationBatch = function () {

      $scope.format = DATEFORMAT;
      $scope.initDate = '';
      $scope.calIcon = 'fa-calendar';

      $scope.donationBatchDateOpen = false;
      $scope.donationBatchView = 'viewDonationBatch';

    };

    $scope.closeDonationBatchCheck = function(donationBatch){
      $scope.donationBatchToClose = donationBatch.id;
    };

    $scope.closeDonationBatchCancel = function(){
      $scope.donationBatchToClose = '';
    };

    $scope.closeDonationBatch = function (donationBatch){
      DonorService.closeDonationBatch(donationBatch, function(response){
        if (response !== false){
          $scope.donationBatchToClose = '';
          $location.path("/manageDonationBatches");
        }
        else{
          // TODO: handle case where response == false
        }
      });

    };

    $scope.viewDonationSummary = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
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

      $scope.donation = {};
      $scope.donorSummaryLoading = false;

      $scope.$watch('donation.donorNumber', function() {
        $scope.donorSummaryLoading = true;
        DonorService.getDonorSummaries($scope.donation.donorNumber, function(donorSummary) {
          $scope.donorSummary = donorSummary;
          $scope.donorSummaryLoading = false;
        });
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

    $scope.addDonation = function (donation, bleedStartTime, bleedEndTime, valid){

      if(valid){
        $scope.addDonationSuccess = '';

        // set donation center, site & date to those of the donation batch
        donation.venue = $scope.donationBatch.venue;
        donation.donationDate = $scope.donationBatch.createdDate;
        donation.donationBatchNumber = $scope.donationBatch.batchNumber;
        donation.bleedStartTime = bleedStartTime;
        donation.bleedEndTime = bleedEndTime;

        DonorService.addDonationToBatch(donation, function(response){


            //$scope.addDonationSuccess = true;
            $scope.donation = {};
            $scope.donationBatchView = 'viewDonationBatch';

            $scope.donationBatch = response;
            data = $scope.donationBatch.donations;
            $scope.data = data;
            $scope.submitted = '';
            $scope.err = {};
          },
          function (err) {
            $scope.err = err;
            $scope.addDonationSuccess = false;
        });
      }
      else {
        $scope.submitted = true;
        console.log("FORM NOT VALID");
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

    $scope.checkPulse = function(data) {
      var min = $scope.pulseMin;
      var max = $scope.pulseMax;
      if (data < min) {
        return "Pulse should be greater than " + min;
      }

      if (data > max) {
        return "Pulse should be less than " + max;
      }
    };

    $scope.checkHb = function(data) {
      var min = $scope.hbMin;
      var max = $scope.hbMax;
      if (data < min) {
        return "Hb should be greater than " + min;
      }

      if (data > max) {
        return "Hb should be less than " + max;
      }
    };

    $scope.checkBpSystolic = function(data) {
      var min = $scope.bpSystolicMin;
      var max = $scope.bpSystolicMax;
      if (data < min) {
        return "BP Systolic should be greater than " + min;
      }

      if (data > max) {
        return "BP Systolic should be less than " + max;
      }
    };

    $scope.checkBpDiastolic = function(data) {
      var min = $scope.bpDiastolicMin;
      var max = $scope.bpDiastolicMax;
      if (data < min) {
        return "BP Diastolic should be greater than " + min;
      }

      if (data > max) {
        return "BP Diastolic should be less than " + max;
      }
    };

    $scope.checkWeight = function(data) {
      var min = $scope.weightMin;
      var max = $scope.weightMax;
      if (data < min) {
        return "Weight should be greater than " + min;
      }

      if (data > max) {
        return "Weight should be less than " + max;
      }
    };

  })

;
