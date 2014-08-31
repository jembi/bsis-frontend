'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $location, DonorService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    var data = {};
    $scope.data = data;

    $scope.donorSearch = {};
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

    $scope.addDonor = function (newDonor){
      console.log("Add Donor - firstName:", newDonor.firstName);
      console.log("Add Donor - lastName:", newDonor.lastName);
      console.log("Add Donor - preferredLanguage:", newDonor.preferredLanguage);
    };

    $scope.edit = function () {
    };

    $scope.done = function () {
      $location.path("/findDonor");
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 8,          // count per page
        sorting: {
        //donorNumber: 'asc'     // initial sorting
        }        
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
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, ICONS) {
     $scope.donor = DonorService.getDonor();
  })

  // Controller for Adding Donors
  .controller('AddDonorCtrl', function ($scope, $location, DonorService, MONTH, TITLE, GENDER) {
      DonorService.addDonor().then(function (response) {
          var data = response.data;
          $scope.addressTypes = data.addressTypes;
          $scope.languages = data.languages;
          $scope.donorPanels = data.donorPanels;
          $scope.donor = data.addDonorForm;

          $scope.title = TITLE.options;
          $scope.month = MONTH.options;
          $scope.gender = GENDER.options;

        }, function () {
      });
  })

;


