'use strict';

angular.module('bsis')
  .controller('DonorsCtrl', function ($scope, $location, DonorService, ICONS, $filter, ngTableParams) {

    $scope.icons = ICONS;
    
    /*$scope.donor = {
      firstName: '',
      lastName: '',
      donorNum: ''
    };
    */

    //var data = [];

    /*var data = [
                    {name: "Moroni", age: 50},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34}
                ];
                $scope.data = data;
  */

  var objs = {
    "donors": [
    { 
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000001",
      gender: "Male",
      dob: "10/01/1965"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000002",
      gender: "Female",
      dob: "12/10/1980"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000003",
      gender: "Female",
      dob: "20/01/1975"
    },
    {
      firstName: "Sample",
      lastName: "Donorific",
      donorNum: "000004",
      gender: "Male",
      dob: "10/01/1975"
    },
    {
      firstName: "Samplee",
      lastName: "Donor",
      donorNum: "000005",
      gender: "Female",
      dob: "10/05/1975"
    }
    ,
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000006",
      gender: "Female",
      dob: "10/05/1975"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000007",
      gender: "Female",
      dob: "10/05/1980"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000008",
      gender: "Female",
      dob: "10/05/1975"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000009",
      gender: "Female",
      dob: "10/05/1975"
    },
    {
      firstName: "Samplee",
      lastName: "Donor",
      donorNum: "000010",
      gender: "Female",
      dob: "10/05/1975"
    },
    {
      firstName: "Sample",
      lastName: "Donor",
      donorNum: "000011",
      gender: "Female",
      dob: "10/05/1990"
    }
    ]
  };
  var data = objs.donors;
  $scope.data = data;


    //console.log("$scope.donor: ", $scope.donor);

    //$scope.donor = DonorService.getDonor();
   // $scope.donor = {};
    $scope.donorSearch = {};
    $scope.searchResults = '';

    $scope.findDonor = function () {      
      DonorService.findDonor($scope.donorSearch).then(function (response) {
          //$scope.donor = response.data.donor;
          //data = $scope.donor;
          //$scope.data = data;
          //console.log('findDonor - DonorService.getDonor()',DonorService.getDonor());
          //console.log('findDonor - $scope.donor',$scope.donor);
          //console.log("ReturnedDonor: ",$scope.donor);
          $scope.searchResults = true;
        }, function () {
          $scope.searchResults = false;
      });

    };

    $scope.isCurrent = function(path) {
      //console.log("$location.path(): ",$location.path());
      //console.log("path: ",path);
      //console.log("$scope.selection : ",$scope.selection );
      if ($location.path() === "/viewDonor" && path === "/findDonor") {
        //$location.path(path);
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

    $scope.edit = function () {
    };

    $scope.done = function () {
      $location.path("/findDonor");
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            //donorNum: 'asc'     // initial sorting
        }        
    }, {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function ($defer, params) {
            //var filteredData = params.filter() ?
            //       $filter('filter')(data, params.filter()) :
            //      data;
            //var filteredData = data;
            var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    
  })
  
  .controller('ViewDonorCtrl', function ($scope, $location, DonorService, ICONS) {
      /*DonorService.getDonor().then(function (response) {
          $scope.donor = response.data.donor;
          console.log('ViewDonorCtrl - $scope.donor',$scope.donor);
          //console.log("ReturnedDonor: ",$scope.donor);
          //$scope.searchResults = true;
        }, function () {
          //$scope.searchResults = false;
      });
*/

     $scope.donor = DonorService.getDonor();
     //console.log('ViewDonorCtrl - DonorService.getDonor()',DonorService.getDonor());
  })


;


