'use strict';

angular.module('bsis').controller('ViewReturnsCtrl', function($scope, $location, $log, DonationsService, TestingService, DATEFORMAT, gettextCatalog) {

  $scope.dateFormat = DATEFORMAT;

  var searchParams = {
    din: null,
    venueId: null,
    allVenues: false,
    packTypeId: null,
    allPackTypes: false,
    startDate: moment().date(1).startOf('day').toDate(),
    endDate: moment().endOf('month').toDate()
  };

  var columnDefs = [
    {
      name: 'DonationIdentificationNumber',
      displayName: gettextCatalog.getString('DIN'),
      field: 'donationIdentificationNumber',
      cellFilter: 'bsisDate',
      width: '**'
    },
    {
      name: 'Venue',
      displayName: gettextCatalog.getString('Venue'),
      field: 'venue.name',
      cellFilter: 'translate',
      width: '**'
    },
    {
      name: 'Donation Date',
      displayName: gettextCatalog.getString('Collection Date'),
      field: 'donationDate',
      cellFilter: 'bsisDate',
      width: '**'
    },
    {
      name: 'Pack Type',
      displayName: gettextCatalog.getString('Pack Type'),
      field: 'packType.packType',
      width: '**'
    },
    {
      name: 'TTI Status',
      displayName: gettextCatalog.getString('TTI Test Status'),
      field: 'ttiStatus',
      width: '**'
    },
    {
      name: 'Blood Typing Match Status',
      displayName: gettextCatalog.getString('Blood Group Serology Test Status'),
      field: 'bloodTypingMatchStatus',
      width: '**'
    }
  ];

  $scope.searchParams = {};
  $scope.venues = [];
  $scope.packTypes = [];
  $scope.searching = false;
  $scope.submitted = false;

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 5,
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 5,
    columnDefs: columnDefs,

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.isTestSampleSearchValid = function() {
    var searchParams = $scope.searchParams;
    return searchParams.din
           || ((searchParams.venueId || searchParams.allVenues)
           && (searchParams.packTypeId || searchParams.allPackTypes)
           && searchParams.startDate && searchParams.endDate);
  };

  $scope.findReturns = function(findTestSamplesForm) {
    if (findTestSamplesForm.$invalid) {
      return;
    }
    $scope.searching = true;
    $scope.submitted = true;

    DonationsService.search($scope.searchParams, function (response) {
      $scope.gridOptions.data = response.donations;
      $scope.searching = false;
      $scope.gridOptions.paginationCurrentPage = 1;
    }, function (error) {
      $scope.searching = false;
      $log.error(error);
    });
  };

  $scope.init = function() {
    $scope.gridOptions.data = [];
    $scope.searchParams = angular.copy(searchParams);
    $scope.submitted = false;
    $scope.searching = false;
    TestingService.getTestResultsForm(function(response) {
      $scope.venues = response.venues;
      $scope.packTypes = response.packTypes;
    }, $log.error);
  };

  $scope.init();


});
