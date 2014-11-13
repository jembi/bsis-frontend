'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $location, DonorService, ICONS, PERMISSIONS, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    var data = {};
    $scope.data = data;
    $scope.age = '';

    $scope.donorSearch = {
      firstName: '',
      lastName: ''
    };
    $scope.searchResults = '';

    $scope.findDonor = function () {   
      DonorService.findDonor($scope.donorSearch, function(response){
      if (response !== false){
        data = response;
        console.log("DonorService.getDonors(): ", DonorService.getDonors());
        $scope.data = data;
        console.log("$scope.data: ", $scope.data);
        $scope.searchResults = true;
        
      }
      else{
        $scope.searchResults = false;
      }
    });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.tableParams.reload(); });
    });

  };

    $scope.isCurrent = function(path) {
      if ($location.path() === "/viewDonor" && path === "/findDonor") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/addDonor" && path === "/findDonor") {
        $scope.selection = $location.path();
        return true;
      } else if ($location.path() === "/manageClinic" && path === "/manageDonationBatches") {
        $scope.selection = $location.path();
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else if ($location.path() === "/donors" && path === "/findDonor") {
        return true;
      } else {
        return false;
      }
    };

    $scope.clear = function () {
      $scope.donorSearch = {};
      $scope.searchResults = '';
      $scope.donation = {};
      $scope.deferral = {};
      $scope.newDonationBatch = {};
    };

    $scope.viewDonor = function (item) {
      $scope.donor = item;
      DonorService.setDonor(item);

      $scope.dateOptions = {
        'formatYear': 'yy',
        'startingDay': 1,
        'show-weeks': false
      };
      $scope.format = 'dd/MM/yyyy';
      $scope.initDate = item.birthDate;
      $scope.calIcon = 'fa-calendar';

      $scope.donorBirthDateOpen = false;

      $location.path("/viewDonor");
    };

    $scope.addNewDonor = function (donor){
      DonorService.setDonor(donor);
      $location.path("/addDonor");
    };

    $scope.addDonor = function (newDonor){

      DonorService.addDonor(newDonor, function(response){
        if (response === true){

          $scope.dateOptions = {
            'formatYear': 'yy',
            'startingDay': 1,
            'show-weeks': false
          };
          $scope.format = 'dd/MM/yyyy';
          $scope.initDate = $scope.donor.birthDate;
          $scope.calIcon = 'fa-calendar';

          $scope.donorBirthDateOpen = false;

          $location.path("/viewDonor");
          
        }
        else{
          // TODO: handle case where response == false
        }
      });
    };

    $scope.updateDonor = function (donor){
      
      DonorService.updateDonor(donor, function(response){
        if (response !== false){
          $scope.donor = response;
        }
        else{
          // TODO: handle case where response == false
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
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, MONTH, TITLE, GENDER, $filter, $q, ngTableParams, $timeout) {

    $scope.data = {};
    $scope.age = '';
    $scope.deferralsData = {};
    $scope.donationsData = {};

    $scope.donor = DonorService.getDonor();

    DonorService.getDonorFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.addressTypes = $scope.data.addressTypes;
        $scope.languages = $scope.data.languages;
        $scope.donorPanels = $scope.data.donorPanels;
        $scope.idTypes = $scope.data.idTypes;
        $scope.preferredContactMethods = $scope.data.preferredContactMethods;
        $scope.title = TITLE.options;
        $scope.month = MONTH.options;
        $scope.gender = GENDER.options;
      }
      else{
      }
    });

    DonorService.getDonorOverview($scope.donor.id, function(response){
      if (response !== false){
        $scope.data = response;
        $scope.currentlyDeferred = $scope.data.currentlyDeferred;
        $scope.deferredUntil = $scope.data.deferredUntil;
        $scope.lastDonation = $scope.data.lastDonation;
        $scope.dateOfFirstDonation = $scope.data.dateOfFirstDonation;
        $scope.totalDonations = $scope.data.totalDonations;
      }
      else{
      }
    });

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
          console.log("$scope.deferralsData: ", $scope.deferralsData);
          $scope.deferralResults = true;
        }
        else{
          $scope.deferralResults = false;
        }
      });

      $scope.$watch("deferralsData", function () {
        if ($scope.deferralTableParams.data.length > 0) {
          $scope.deferralTableParams.reload();
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

      $scope.$watch("data", function () {
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
          $scope.donationsData = response.allCollectedSamples;
          console.log("$scope.donationsData: ", $scope.donationsData);
          $scope.donationResults = true;
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

      $scope.dateOptions = {
        'formatYear': 'yy',
        'startingDay': 1,
        'show-weeks': false
      };
      $scope.format = 'dd/MM/yyyy';
      $scope.initDate = new Date();
      $scope.calIcon = 'fa-calendar';

      $scope.dateFromOpen = false;
      $scope.dateToOpen = false;

      $scope.deferralView = 'manageDeferral';

    };

    $scope.viewDonationDetails = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      $scope.donationsView = 'viewDonationDetails';
    };

    $scope.addDeferral = function (deferral){

      deferral.deferredDonor = $scope.donor.id;

      DonorService.addDeferral(deferral, function(response){
        if (response === true){
          $scope.deferral = {};
          $scope.getDeferrals($scope.donor.id);
        }
        else{
          // TODO: handle case where response == false
        }
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
        $scope.donorPanels = $scope.data.donorPanels;
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

  // Controller for Adding Donations
  .controller('AddDonationCtrl', function ($scope, $location, DonorService) {

    $scope.addDonationSuccess = '';

    DonorService.getDonationsFormFields(function(response){
      if (response !== false){
        $scope.data = response;
        $scope.sites = $scope.data.sites;
        $scope.centers = $scope.data.centers;
        $scope.packTypes = $scope.data.packTypes;
        $scope.donationTypes = $scope.data.donationTypes;
        $scope.donation = $scope.data.addDonationForm;
      }
      else{
      }
    });

    $scope.addDonation = function (donation){

      $scope.addDonationSuccess = '';

      // set temporary donation center & site - should be auto-populated from donation batch info
      donation.collectionCenter = $scope.centers[0];
      donation.collectionSite = $scope.sites[0];
      // set temporary donationDate
      donation.collectedOn = '10/16/2014 12:00:00 am';

      DonorService.addDonation(donation, function(response){
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

  })

  // Controller for Viewing/Exporting Donor Lists
  .controller('DonorListCtrl', function ($scope, $location, DonorService, BLOODGROUP, MONTH, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;

    var data = {};
    $scope.data = data;
    $scope.donorListSearchResults = '';
    $scope.donorList = {};
    $scope.donorList.donorPanels = [];
    $scope.donorList.bloodGroups = [];

    DonorService.getDonorListFormFields(function(response){
      if (response !== false){
        console.log("response: ", response);
        $scope.donorPanels = response.donorPanels;
        //$scope.bloodGroups = response.bloodGroups;
        $scope.bloodGroups = BLOODGROUP.options;
      }
      else{
      }
    });

    $scope.getDonors = function (searchParameters) {

      console.log("searchParameters: ", searchParameters);
      
      $scope.selectedDonorPanels = [];
      angular.forEach(searchParameters.donorPanels,function(value,index){
          $scope.selectedDonorPanels.push(value.id);
      });
      searchParameters.donorPanels = $scope.selectedDonorPanels;

      $scope.selectedBloodGroups = [];
      angular.forEach(searchParameters.bloodGroups,function(value,index){
          $scope.selectedBloodGroups.push(value);
      });
      searchParameters.bloodGroups = $scope.selectedBloodGroups;

      console.log("searchParameters: ", searchParameters);

      DonorService.findDonorListDonors(searchParameters, function(response){
        if (response !== false){
          data = response;
          $scope.data = data;
          console.log("$scope.data: ", $scope.data);
          $scope.donorListSearchResults = true;
          console.log("$scope.data.length: ", $scope.data.length);
          $scope.donorListSearchCount = $scope.data.length;

          
          if ($scope.donorListTableParams.data.length >= 0){
            $scope.donorListTableParams.reload();
          }
          
        }
        else{
          $scope.donorListSearchResults = false;
        }
      });
    };

    $scope.donorListTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
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

    $scope.dateOptions = {
      'formatYear': 'yy',
      'startingDay': 1,
      'show-weeks': false
    };
    $scope.format = 'dd/MM/yyyy';
    $scope.initDate = new Date();
    $scope.calIcon = 'fa-calendar';

    $scope.donationDateFromOpen = false;
    $scope.donationDateToOpen = false;
    $scope.dueToDonateOpen = false;

  })

  // Controller for Managing the Donor Clinic
  .controller('DonorClinicCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, $q, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = {};
    $scope.data = data;
    $scope.openDonationBatches = false;
    $scope.newDonationBatch = {};

    DonorService.getDonationBatchFormFields( function(response){
      if (response !== false){
        $scope.centers = response.centers;
        $scope.sites = response.sites;
      }
      else{
      }
    });

    $scope.getOpenDonationBatches = function (){

      DonorService.getOpenDonationBatches( function(response){
        if (response !== false){
          data = response.donationBatches;
          $scope.data = data;
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

    $scope.donationBatchTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 5,          // count per page
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

    $scope.addDonationBatch = function (donationBatch){

      DonorService.addDonationBatch(donationBatch, function(response){
        if (response === true){
          $scope.newDonationBatch = {};
          $scope.getOpenDonationBatches();
        }
        else{
          // TODO: handle case where response == false
        }
      });
    };

    $scope.manageClinic = function (item){
      
      $scope.donationBatch = item;
      DonorService.setDonationBatch($scope.donationBatch);
      console.log("VIEW DONATIONBATCH - ", $scope.donationBatch);
      data = $scope.donationBatch.collectionsInBatch;
      $scope.data = data;
      $location.path("/manageClinic");
      
    };

  })

  // Controller for Managing the Donor Clinic
  .controller('ViewDonationBatchCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, $q, $filter, ngTableParams, $timeout) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = {};
    $scope.data = data;

    $scope.init = function () {
      $scope.donationBatch = DonorService.getDonationBatch();
      data = $scope.donationBatch.collectionsInBatch;
      $scope.data = data;

      DonorService.getDonationBatchFormFields( function(response){
        if (response !== false){
          $scope.centers = response.centers;
          $scope.sites = response.sites;
        }
        else{
        }
      });
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

      $scope.dateOptions = {
        'formatYear': 'yy',
        'startingDay': 1,
        'show-weeks': false
      };
      $scope.format = 'dd/MM/yyyy';
      $scope.initDate = '';
      $scope.calIcon = 'fa-calendar';

      $scope.donationBatchDateOpen = false;
      $scope.donationBatchView = 'viewDonationBatch';

    };

    $scope.viewDonationSummary = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      $scope.donationBatchView = 'viewDonationSummary';
    };

    $scope.viewAddDonationForm = function (){
      $scope.donationBatchView = "addDonation";

      DonorService.getDonationsFormFields(function(response){
        if (response !== false){
          $scope.data = response;
          $scope.sites = $scope.data.sites;
          $scope.centers = $scope.data.centers;
          $scope.packTypes = $scope.data.packTypes;
          $scope.donationTypes = $scope.data.donationTypes;
          $scope.donation = $scope.data.addDonationForm;
        }
        else{
        }
      });
    };

    $scope.addDonationSuccess = '';

    $scope.addDonation = function (donation){

      $scope.addDonationSuccess = '';

      // set donation center, site & date to those of the donation batch
      donation.collectionCenter = $scope.donationBatch.collectionCenter;
      donation.collectionSite = $scope.donationBatch.collectionSite;
      donation.collectedOn = $scope.donationBatch.createdDate;
      donation.collectionBatchNumber = $scope.donationBatch.batchNumber;

      DonorService.addDonationToBatch(donation, function(response){
        if (response !== false){

          $scope.addDonationSuccess = true;
          $scope.donation = {};
          $scope.donationBatchView = 'viewDonationBatch';

          $scope.donationBatch = response;
          data = $scope.donationBatch.collectionsInBatch;
          $scope.data = data;
        }
        else{
          // TODO: handle case where response == false
          $scope.addDonationSuccess = false;
        }
      });
    };

  })

;


