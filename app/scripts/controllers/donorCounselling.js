'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, $routeParams, Api, LocationsService, DATEFORMAT, $filter) {
  var master = {
    selectedVenues: [],
    startDate: null,
    endDate: null
  };

  $scope.search = angular.copy(master);
  LocationsService.getVenues(function(allVenues) {
    $scope.venues = allVenues;
    if ($routeParams.venue) {
      var venues = $routeParams.venue;
      if (!angular.isArray(venues)) {
        $scope.search.selectedVenues = [venues];
      } else {
        angular.forEach(venues, function(value) {
          $scope.search.selectedVenues.push(parseInt(value));
        });
      }
    }
  });

  $scope.dateFormat = DATEFORMAT;
  $scope.donations = [];

  $scope.searched = false;

  if ($routeParams.startDate) {
    $scope.search.startDate = new Date($routeParams.startDate);
  }

  if ($routeParams.endDate) {
    $scope.search.endDate = new Date($routeParams.endDate);
  }

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

    $scope.searching = true;

    Api.DonationSummaries.query(query, function(response) {
      $scope.searched = true;
      $scope.donations = response;
      $scope.gridOptions.data = response;
      $scope.searching = false;
    }, function(err) {
      console.error(err);
      $scope.searching = false;
    });
  };

  var columnDefs = [
    {name: 'Donor #', field: 'donor.donorNumber'},
    {name: 'First Name', field: 'donor.firstName'},
    {name: 'Last Name', field: 'donor.lastName'},
    {name: 'Gender', field: 'donor.gender'},

    {
      name: 'Date of Birth',
      field: 'donor.birthDate',
      cellFilter: 'bsisDate'
    },
    {
      name: 'Blood Group',
      field: 'donor.bloodGroup'
    },
    {
      name: 'DIN',
      displayName: 'DIN',
      field: 'donationIdentificationNumber'},
    {
      name: 'Date of Donation',
      field: 'donationDate',
      cellFilter: 'bsisDate'
    },
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
    columnDefs: columnDefs,

    // Format values for exports
    exporterFieldCallback: function(grid, row, col, value) {
      if (col.name === 'Date of Donation' || col.name === 'Date of Birth') {
        return $filter('bsisDate')(value);
      }
      return value;
    },

    exporterPdfMaxGridWidth: 700,

    // PDF header
    exporterPdfHeader: function() {

      var venues = $scope.search.selectedVenues.map(function(selectedVenue) {
        for (var index in $scope.venues) {
          if ($scope.venues[index].id === selectedVenue) {
            return $scope.venues[index].name;
          }
        }
      });

      var columns = [
        {text: 'Venue(s): ' + (venues.join(',') || 'Any'), width: 'auto'}
      ];

      // Include last donation date range
      if ($scope.search.startDate && $scope.search.endDate) {
        var fromDate = $filter('bsisDate')($scope.search.startDate);
        var toDate = $filter('bsisDate')($scope.search.endDate);
        columns.push({text: 'Donation Period: ' + fromDate + ' to ' + toDate, width: 'auto'});
      }

      return [
        {
          text: 'List of donors for post donation counselling',
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
    },

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  if ($routeParams.search) {
    $scope.refresh();
  }

  $scope.export = function(format) {
    if (format === 'pdf') {
      $scope.gridApi.exporter.pdfExport('all', 'all');
    } else if (format === 'csv') {
      $scope.gridApi.exporter.csvExport('all', 'all');
    }
  };
});
