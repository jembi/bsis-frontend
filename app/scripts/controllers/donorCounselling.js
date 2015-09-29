'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, $routeParams, Api, LocationsService, DATEFORMAT, $filter) {

  $scope.dateFormat = DATEFORMAT;
  $scope.venues = [];
  $scope.donations = [];

  $scope.searched = false;

  var master = {
    selectedVenues: [],
    startDate: null,
    endDate: null
  };

  $scope.search = angular.copy(master);

  if ($routeParams.startDate) {
    $scope.search.startDate = new Date($routeParams.startDate);
  }

  if ($routeParams.endDate) {
    $scope.search.endDate = new Date($routeParams.endDate);
  }

  if ($routeParams.venue) {
    var venues = $routeParams.venue;
    if (!angular.isArray(venues)) {
      venues = [venues];
    }
    $scope.search.selectedVenues = venues;
  }

  LocationsService.getVenues(function(venues) {
    $scope.venues = venues;
  });

  $scope.clearSearch = function() {
    $location.search({});
    $scope.searched = false;
    $scope.search = angular.copy(master);
  };

  $scope.clearDates = function() {
    $scope.search.startDate = null;
    $scope.search.endDate = null;
  };

  $scope.clearVenues = function() {
    $scope.search.selectedVenues = [];
  };

  $scope.viewDonorCounselling = function(donation) {
    $location.path('/donorCounselling/' + donation.donor.id);
  };

  function getISOString(maybeDate) {
    return angular.isDate(maybeDate) ? maybeDate.toISOString() : maybeDate;
  }

  $scope.refresh = function() {

    var queryParams = {
      search: true
    };

    var query = {
      flaggedForCounselling: true
    };

    if ($scope.search.startDate) {
      var startDate = getISOString($scope.search.startDate);
      query.startDate = startDate;
      queryParams.startDate = startDate;
    }

    if ($scope.search.endDate) {
      var endDate = getISOString($scope.search.endDate);
      query.endDate = endDate;
      queryParams.endDate = endDate;
    }

    if ($scope.search.selectedVenues.length > 0) {
      query.venue = $scope.search.selectedVenues;
      queryParams.venue = $scope.search.selectedVenues;
    }

    $location.search(queryParams);

    Api.DonationSummaries.query(query, function(response) {
      $scope.searched = true;
      $scope.donations = response;
      $scope.gridOptions.data = response;
    }, function(err) {
      console.error(err);
    });
  };

  var columnDefs = [
    {name: 'Donor Number', field: 'donor.donorNumber'},
    {name: 'First Name', field: 'donor.firstName'},
    {name: 'Last Name', field: 'donor.lastName'},
    {
      name: 'Date of Last Donation',
      field: 'donationDate',
      cellFilter: 'bsisDate'
    },
    {name: 'Blood Group', field: 'donor.bloodGroup'},
    {
      name: 'Venue',
      field: 'venue.name'
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    enableGridMenu: true,
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

      var venues = $scope.venues.map(function(venue) {
        return venue.name;
      });

      var bloodGroups = angular.copy($scope.bloodGroups);

      if ($scope.anyBloodGroup) {
        bloodGroups.push('Any');
      }

      if ($scope.noBloodGroup) {
        bloodGroups.push('None');
      }

      var columns = [
        {text: 'Venue(s): ' + venues.join(', '), width: 'auto'}
      ];

      return [
        {
          text: 'Donors List',
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
        {text: 'Total donors: ' + $scope.gridOptions.data.length, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0]
      };
    }
  };

  if ($routeParams.search) {
    $scope.refresh();
  }
});
