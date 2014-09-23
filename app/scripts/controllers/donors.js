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

    $scope.data = {};
    $scope.deferralsData = {};
    $scope.donationsData = {};
    var deferralReasons = [];

    $scope.donor = DonorService.getDonor();

    /* TODO: Update service call above (getDonor()) to include donorFormFields, so that two service calls are not required*/
    DonorService.getDonorFormFields().then(function (response) {
        $scope.data = response.data;
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
        $scope.deferralsData = response.data.allDonorDeferrals;
        deferralReasons = response.data.deferralReasons;
        $scope.deferralResults = true;
      }, function () {
        $scope.deferralResults = false;
      });

      $scope.$watch("deferralsData", function () {
        $scope.deferralTableParams.reload();
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
        },
        $scope: { $deferralsData: {} }
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
        $scope.donationsData = response.data.donations;
        $scope.donationResults = true;
      }, function () {
        $scope.donationResults = false;
      });

      $scope.$watch("donationsData", function () {
        $scope.donationTableParams.reload();
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
        },
        $scope: { $donationsData: {} }
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
      $scope.deferralReasons = deferralReasons;

    };

    $scope.viewDonationDetails = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
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

        // clear $scope.searchDonor fields after assigning them to $scope.donor 
        $scope.searchDonor.firstName = '';
        $scope.searchDonor.lastName = '';

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

  // Controller for Adding Donations
  .controller('AddDonationCtrl', function ($scope, $location, DonorService, PACKTYPE) {

    $scope.packTypes = PACKTYPE.packtypes;

  })

  // Controller for Managing the Donor Clinic
  .controller('DonorClinicCtrl', function ($scope, $location, DonorService, ICONS, PACKTYPE, $q, $filter, ngTableParams) {

    $scope.icons = ICONS;
    $scope.packTypes = PACKTYPE.packtypes;

    var data = {};
    $scope.data = data;
    $scope.donationBatch = {
      'date': '03/09/2014',
      'venue': 'Maseru'
    };

    DonorService.getDonationBatch().then(function (response) {
      data = response.data.donations;
      $scope.data = data;
      $scope.donorPanels = response.data.donorPanels;
      }, function () {
    });

    $scope.$watch("data", function () {
        $scope.donorClinicTableParams.reload();
    }); 

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
      },
      $scope: { $data: {} }
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
      $scope.donorClinicTableParams.reload();

    };

    $scope.viewDonationSummary = function (din) {
      $scope.donation = $filter('filter')($scope.data, {donationIdentificationNumber : din})[0];
      $scope.donationBatchView = 'viewDonationSummary';
    };

  })

;


