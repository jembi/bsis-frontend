'use strict';

angular.module('bsis').controller('DonorCounsellingCtrl', function($scope, $location, $routeParams, $log, $filter, PostDonationCounsellingService, DATEFORMAT) {
  var master = {
    selectedVenues: [],
    startDate: null,
    endDate: null,
    anyDate: true,
    allVenues: true,
    counsellingStatuses: [],
    flaggedForCounselling: false
  };

  $scope.search = angular.copy(master);

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

  $scope.updateAllVenues = function() {
    $scope.search.allVenues = false;
  };

  $scope.clearDates = function() {
    $scope.search.startDate = null;
    $scope.search.endDate = null;
  };

  $scope.updateAnyDate = function() {
    if ($scope.search.startDate || $scope.search.endDate) {
      $scope.search.anyDate = false;
    }
  };

  $scope.clearVenues = function() {
    $scope.search.selectedVenues = [];
  };

  $scope.viewDonorCounselling = function(donation) {
    $location.path('/donorCounselling/' + donation.donorId);
  };

  $scope.refresh = function() {
    if (!$scope.findDonorCounsellingForm.$valid) {
      return;
    }

    var queryParams = {
      search: true
    };

    var query = {};

    if ($scope.search.startDate) {
      var startDate = $filter('isoString')($scope.search.startDate);
      query.startDate = startDate;
      queryParams.startDate = startDate;
    }

    if ($scope.search.endDate) {
      var endDate = $filter('isoString')($scope.search.endDate);
      query.endDate = endDate;
      queryParams.endDate = endDate;
    }

    if ($scope.search.selectedVenues.length > 0) {
      query.venue = $scope.search.selectedVenues;
      queryParams.venue = $scope.search.selectedVenues;
      $scope.search.allVenues = false;
    }

    query.flaggedForCounselling = $scope.search.flaggedForCounselling;
    queryParams.flaggedForCounselling = $scope.search.flaggedForCounselling;

    query.counsellingStatus = $scope.search.counsellingStatus;
    queryParams.counsellingStatus = $scope.search.counsellingStatus;

    query.referred = $scope.search.referred;
    queryParams.referred = $scope.search.referred;

    $location.search(queryParams);

    $scope.searching = true;
    $scope.gridOptions.data = [];

    PostDonationCounsellingService.search(query, function(response) {
      $scope.searched = true;
      $scope.donations = response.counsellings;
      $scope.gridOptions.data = response.counsellings;
      $scope.searching = false;
      $scope.gridOptions.paginationCurrentPage = 1;
    }, function(err) {
      $log.error(err);
      $scope.searching = false;
    });
  };

  $scope.onRowClick = function(row) {
    $location.path('donorCounselling/' + row.entity.donorId).search({});
  };

  $scope.updateReferred = function() {
    if ($scope.search.counsellingStatus !== 'RECEIVED_COUNSELLING') {
      $scope.search.referred = null;
    } else {
      $scope.search.referred = false;
    }
  };

  $scope.clearCounsellingStatusAndReferred = function() {
    $scope.search.counsellingStatus = null;
    $scope.search.referred = null;
  };

  var columnDefs = [
    {name: 'Donor #', field: 'donorNumber'},
    {name: 'First Name', field: 'firstName'},
    {name: 'Last Name', field: 'lastName'},
    {name: 'Gender', field: 'gender'},

    {
      name: 'Date of Birth',
      field: 'birthDate',
      cellFilter: 'bsisDate'
    },
    {
      name: 'Blood Group',
      field: 'bloodGroup'
    },
    {
      name: 'DIN',
      displayName: 'DIN',
      field: 'donationIdentificationNumber'
    },
    {
      name: 'Date of Donation',
      field: 'donationDate',
      cellFilter: 'bsisDate'
    },
    {
      name: 'Venue',
      field: 'venue.name'
    },
    {
      name: 'Referred',
      field: 'referred'
    },
    {
      name: 'Counselled',
      field: 'counselled'
    },
    {
      name: 'Date',
      field: 'counsellingDate',
      cellFilter: 'bsisDate'
    }
  ];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 10,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    rowTemplate: 'views/template/clickablerow.html',
    columnDefs: columnDefs,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true},

    // Format values for exports
    exporterFieldCallback: function(grid, row, col, value) {
      if (col.name.indexOf('Date') !== -1) {
        return $filter('bsisDate')(value);
      }
      return value;
    },

    exporterPdfMaxGridWidth: 650,

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
        {text: 'Venue(s): ' + (venues.join(',') || 'Any'), width: 'auto', fontSize: 10}
      ];

      // Include last donation date range
      if ($scope.search.startDate && $scope.search.endDate) {
        var fromDate = $filter('bsisDate')($scope.search.startDate);
        var toDate = $filter('bsisDate')($scope.search.endDate);
        columns.push({text: 'Donation Period: ' + fromDate + ' to ' + toDate, width: 'auto', fontSize: 10});
      }

      return [
        {
          text: 'List of donors for post donation counselling',
          bold: true,
          margin: [30, 10, 30, 0],
          fontSize: 12
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

  $scope.export = function(format) {
    if (format === 'pdf') {
      $scope.gridApi.exporter.pdfExport('all', 'all');
    } else if (format === 'csv') {
      $scope.gridApi.exporter.csvExport('all', 'all');
    }
  };

  function initialiseRouteParams() {
    // Select venues from route params
    if ($routeParams.venue) {
      var venues = angular.isArray($routeParams.venue) ? $routeParams.venue : [$routeParams.venue];
      $scope.search.selectedVenues = venues.map(function(venueId) {
        // Cast id to number
        return +venueId;
      });
    }

    if ($routeParams.startDate) {
      var startDate = new Date($routeParams.startDate);
      $scope.search.startDate = startDate;
    }

    if ($routeParams.endDate) {
      var endDate = new Date($routeParams.endDate);
      $scope.search.endDate = endDate;
    }

    if ($routeParams.counsellingStatus) {
      var counsellingStatus = $routeParams.counsellingStatus;
      $scope.search.counsellingStatus = counsellingStatus;
    }

    if ($routeParams.flaggedForCounselling) {
      var flaggedForCounselling = $routeParams.flaggedForCounselling;
      $scope.search.flaggedForCounselling =  angular.lowercase(flaggedForCounselling) === true;
    }

    if ($routeParams.referred) {
      var referred = $routeParams.referred;
      $scope.search.referred = angular.lowercase(referred) === true;
    }

    // If the search parameter is present then refresh
    if ($routeParams.search) {
      $scope.refresh();
    }
  }

  function init() {
    PostDonationCounsellingService.getSearchForm(function(form) {
      $scope.venues = form.venues;
      $scope.counsellingStatuses = form.counsellingStatuses;
      initialiseRouteParams();
    }, function(err) {
      $log.error(err);
    });
  }

  init();
});
