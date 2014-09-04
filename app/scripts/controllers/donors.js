'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $location, DonorService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    var data = {};
    $scope.data = data;

    $scope.donorSearch = {
      firstName: '',
      lastName: ''
    };
    $scope.searchResults = '';


    $scope.findDonor = function () {   
      DonorService.findDonor($scope.donorSearch).then(function (response) {
          data = response.data.donors;
          $scope.data = data;
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });
    };

    $scope.isCurrent = function(path) {
      if ($location.path() === "/viewDonor" && path === "/findDonor") {
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
    };

    $scope.viewDonor = function (item) {
      console.log("\tITEM: ", item);
      $scope.donor = item;
      DonorService.setDonor(item);
      console.log("\t$scope.donor: ", $scope.donor);
      $location.path("/viewDonor");
    };

    $scope.addNewDonor = function (donor){
      DonorService.setDonor(donor);
      $location.path("/addDonor");
    };

    $scope.addDonor = function (newDonor){
      console.log("Add Donor - firstName:", newDonor.firstName);
      console.log("Add Donor - lastName:", newDonor.lastName);
      console.log("Add Donor - preferredLanguage:", newDonor.preferredLanguage);
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
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, MONTH, TITLE, GENDER, $filter, $q, ngTableParams) {

    var data = {};
    $scope.data  = data;
    var deferralReasons = [];

    $scope.donor = DonorService.getDonor();

    /* TODO: Update service call above (getDonor()) to include donorFormFields, so that two service calls are not required*/
    DonorService.getDonorFormFields().then(function (response) {
        var data = response.data;
        $scope.addressTypes = data.addressTypes;
        $scope.languages = data.languages;
        $scope.donorPanels = data.donorPanels;
        $scope.idTypes = data.idTypes;
        $scope.preferredContactMethods = data.preferredContactMethods;
        $scope.title = TITLE.options;
        $scope.month = MONTH.options;
        $scope.gender = GENDER.options;

        }, function () {
      });

    $scope.getDeferrals = function () {

      $scope.deferralView = 'viewDeferrals';

      DonorService.getDeferrals().then(function (response) {
        data = response.data.allDonorDeferrals;
        $scope.data = data;
        deferralReasons = response.data.deferralReasons;
        $scope.deferralResults = true;
      }, function () {
        $scope.deferralResults = false;
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

      $scope.deferralReasonsFilter = function(column) {
        var def = $q.defer();
        var arr = [];
        angular.forEach(deferralReasons, function(item){
          arr.push({
            'id': item.reason,
            'title': item.reason
          });
        });
        def.resolve(arr);
        return def;
      };

    };

    $scope.getDonations = function () {

      $scope.donationsView = 'viewDonations';

      DonorService.getDonations().then(function (response) {
        data = response.data.donations;
        $scope.data = data;
        $scope.donationResults = true;
      }, function () {
        $scope.donationResults = false;
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

      $scope.dateFromOpen = false;
      $scope.dateToOpen = false;

      $scope.today = function() {
        $scope.dateFrom = new Date();
        $scope.dateTo = new Date();
      };

      $scope.today();

      $scope.clear = function () {
        $scope.dateFrom = null;
        $scope.dateTo = null;
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event, datePicker) {

        console.log("datePicker: ", datePicker);
        $event.preventDefault();
        $event.stopPropagation();

        $scope.closeAll();

        if (datePicker === 'dateFromOpen'){
          $scope.dateFromOpen = true;
        }
        else if (datePicker === 'dateToOpen'){
          $scope.dateToOpen = true;
        }

        console.log("$scope.dateFromOpen: ", $scope.dateFromOpen);
        console.log("$scope.dateToOpen: ", $scope.dateToOpen);
      };

      $scope.closeAll = function() {
          $scope.dateFromOpen = false;
          $scope.dateToOpen = false;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.initDate = new Date();
      //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      //$scope.format = $scope.formats[0];
      $scope.format = 'dd/MM/yyyy';


      $scope.deferralView = 'manageDeferral';
      $scope.deferralReasons = deferralReasons;

      //$scope.deferral.deferredOn = new Date();

      console.log("deferralReasons: ", deferralReasons);
      console.log("$scope.deferralReasons: ", $scope.deferralReasons);
    };

    $scope.viewDonationDetails = function (din) {
      console.log("din: ", din);
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      console.log("$scope.donation: ", $scope.donation);

      $scope.donationsView = 'viewDonationDetails';

    };

  })

  // Controller for Adding Donors
  .controller('AddDonorCtrl', function ($scope, $location, DonorService, MONTH, TITLE, GENDER) {
      DonorService.addDonor().then(function (response) {
        var data = response.data;
        $scope.addressTypes = data.addressTypes;
        $scope.languages = data.languages;
        $scope.donorPanels = data.donorPanels;
        $scope.donor = data.addDonorForm;
        $scope.searchDonor = DonorService.getDonor();
        $scope.donor.firstName = $scope.searchDonor.firstName;
        $scope.donor.lastName = $scope.searchDonor.lastName;

        console.log("AddDonorCtrl firstName: ", $scope.searchDonor.firstName);
        console.log("AddDonorCtrl lastName: ", $scope.searchDonor.lastName);

        $scope.title = TITLE.options;
        $scope.month = MONTH.options;
        $scope.gender = GENDER.options;

      }, function () {
      });
  })

  // Controller for Adding Donations
  .controller('AddDonationCtrl', function ($scope, $location, DonorService, PACKTYPE) {

    $scope.packTypes = PACKTYPE.packtypes;

  })

  // Controller for Viewing/Exporting Donor Lists
  .controller('DonorListCtrl', function ($scope, $location, DonorService, BLOODGROUP, MONTH, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;

    var data = {};
    $scope.data = data;
    $scope.donorListsearchResults = '';

    DonorService.getDonorListFormFields().then(function (response) {
        var data = response.data;
        $scope.donorPanels = data.donorPanels;
      }, function () {
    });

    $scope.bloodGroups = BLOODGROUP.options;
    $scope.month = MONTH.options;

    $scope.getDonors = function () {

      $scope.donorSearch = {
        'firstName': 'Sample',
        'lastName': 'Donor'
      };

      DonorService.findDonor($scope.donorSearch).then(function (response) {
          data = response.data.donors;
          $scope.data = data;
          console.log("DATA.DONORS.LENGTH: ", $scope.data.length);
          $scope.donorListsearchResults = true;
        }, function () {
          $scope.donorListsearchResults = false;
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




    /* datePicker options */
    $scope.dueToDonateOpen = false;

    $scope.today = function() {
      $scope.dueToDonate = new Date();
    };

    $scope.today();

    $scope.clear = function () {
      $scope.dueToDonate = new Date();
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, datePicker) {

      console.log("datePicker: ", datePicker);
      $event.preventDefault();
      $event.stopPropagation();

      $scope.closeAll();

      if (datePicker === 'dateFromOpen'){
        $scope.dueToDonateOpen = true;
      }

    };

    $scope.closeAll = function() {
        $scope.dueToDonateOpen = false;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.initDate = new Date();
    //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    $scope.format = 'dd/MM/yyyy';



  })

;


