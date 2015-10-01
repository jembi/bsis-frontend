'use strict';

angular.module('bsis').controller('DonorCommunicationsCtrl', function($scope, $filter, $location, $routeParams, BLOODGROUP, DATEFORMAT, DonorService) {

  $scope.dateFormat = DATEFORMAT;
  $scope.venues = [];
  $scope.bloodGroups = [];
  $scope.error = {
    message: null
  };
  $scope.currentSearch = null;

  DonorService.getDonationBatchFormFields(function(res) {
    $scope.bloodGroups = BLOODGROUP.options;
    $scope.venues = res.venues;

    // Work around issue with ui-select and tracking by id
    // See https://github.com/angular-ui/ui-select/issues/806
    $scope.search.venues = $scope.search.venues.map(function(selectedVenue) {
      var venues = $scope.venues;
      for (var index in venues) {
        if (venues[index].id === selectedVenue.id) {
          return venues[index];
        }
      }
      return selectedVenue;
    });
    if ($scope.currentSearch && $scope.currentSearch.venues) {
      $scope.currentSearch.venues = $scope.currentSearch.venues.map(function(selectedVenue) {
        var venues = $scope.venues;
        for (var index in venues) {
          if (venues[index].id === selectedVenue.id) {
            return venues[index];
          }
        }
        return selectedVenue;
      });
    }
  }, function(err) {
    $scope.error.message = err.userMessage;
  });

  var master = $scope.master = {
    venues: [],
    bloodGroups: [],
    anyBloodGroup: true,
    noBloodGroup: false,
    lastDonationFromDate: null,
    lastDonationToDate: null,
    clinicDate: null
  };

  function toArray(maybeArray) {
    if (angular.isUndefined(maybeArray)) {
      return null;
    }
    return angular.isArray(maybeArray) ? maybeArray : [maybeArray];
  }

  $scope.search = {
    venues: (toArray($routeParams.venues) || master.venues).map(function(venueId) {
      return {id: +venueId};
    }),
    bloodGroups: toArray($routeParams.bloodGroups) || master.bloodGroups,
    anyBloodGroup: angular.isUndefined($routeParams.anyBloodGroup) ? master.anyBloodGroup : $routeParams.anyBloodGroup === true,
    noBloodGroup: angular.isUndefined($routeParams.noBloodGroup) ? master.noBloodGroup : $routeParams.noBloodGroup === true,
    lastDonationFromDate: angular.isUndefined($routeParams.lastDonationFromDate) ? master.lastDonationFromDate : new Date($routeParams.lastDonationFromDate),
    lastDonationToDate: angular.isUndefined($routeParams.lastDonationToDate) ? master.lastDonationToDate : new Date($routeParams.lastDonationToDate),
    clinicDate: angular.isUndefined($routeParams.clinicDate) ? master.clinicDate : new Date($routeParams.clinicDate)
  };

  var columnDefs = [
    {field: 'donorNumber'},
    {field: 'firstName'},
    {field: 'lastName'},
    {
      name: 'Date of Last Donation',
      field: 'dateOfLastDonation',
      cellFilter: 'bsisDate'
    },
    {field: 'bloodGroup'},
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
      if (col.name === 'Date of Last Donation') {
        return $filter('bsisDate')(value);
      }
      return value;
    },

    // PDF header
    exporterPdfHeader: function() {

      var venues = $scope.currentSearch.venues.map(function(venue) {
        return venue.name;
      });

      var bloodGroups = angular.copy($scope.currentSearch.bloodGroups);

      if ($scope.currentSearch.anyBloodGroup) {
        bloodGroups.push('Any');
      }

      if ($scope.currentSearch.noBloodGroup) {
        bloodGroups.push('None');
      }

      var columns = [
        {text: 'Venue(s): ' + venues.join(', '), width: 'auto'},
        {text: 'Blood Group(s): ' + bloodGroups.join(', '), width: 'auto'}
      ];

      // Include last donation date range
      if ($scope.currentSearch.lastDonationFromDate && $scope.currentSearch.lastDonationToDate) {
        var fromDate = $filter('bsisDate')($scope.currentSearch.lastDonationFromDate);
        var toDate = $filter('bsisDate')($scope.currentSearch.lastDonationToDate);
        columns.push({text: 'Date of Last Donation: ' + fromDate + ' to ' + toDate, width: 'auto'});
      }

      // Include date due to donate
      if ($scope.currentSearch.clinicDate) {
        var dueToDonateDate = $filter('bsisDate')($scope.currentSearch.clinicDate);
        columns.push({text: 'Due to Donate: ' + dueToDonateDate, width: 'auto'});
      }

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
    },

    onRegisterApi: function(gridApi){ 
      $scope.gridApi = gridApi;
    }
  };

  $scope.onSearch = function(form) {
    
    if (form && form.$invalid) {
      return;
    }

    $scope.currentSearch = angular.copy($scope.search);

    var search = angular.extend({}, $scope.currentSearch, {
      venues: $scope.currentSearch.venues.map(function(venue) {
        return venue.id;
      })
    });

    $location.search(angular.extend({}, search, {search: true}));

    DonorService.findDonorListDonors(search, function(res) {
      $scope.gridOptions.data = res;
    }, function(err) {
      $scope.error.message = err.userMessage;
    });
  };

  $scope.onClear = function(form) {
    $scope.currentSearch = null;
    $scope.error.message = null;
    $scope.search = angular.copy(master);
    $location.search({});
    form.$setPristine();
  };

  $scope.onAnyBloodGroupChange = function() {
    if ($scope.search.anyBloodGroup) {
      $scope.search.bloodGroups = [];
    }
  };

  $scope.onBloodGroupSelect = function() {
    $scope.search.anyBloodGroup = false;
  };

  if ($routeParams.search) {
    $scope.onSearch();
  }

  $scope.export = function(format){
    if(format === 'pdf'){
      $scope.gridApi.exporter.pdfExport('all', 'all');
    }
    else if (format === 'csv'){
      $scope.gridApi.exporter.csvExport('all', 'all');
    }
  };

});
