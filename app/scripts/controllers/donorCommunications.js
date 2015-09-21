'use strict';

angular.module('bsis').controller('DonorCommunicationsCtrl', function($scope, $location, $routeParams, BLOODGROUP, DATEFORMAT, DonorService) {

  $scope.dateFormat = DATEFORMAT;
  $scope.donorPanels = [];
  $scope.bloodGroups = [];
  $scope.error = {
    message: null
  };

  DonorService.getDonationBatchFormFields(function(res) {
    $scope.bloodGroups = BLOODGROUP.options;
    $scope.donorPanels = res.donorPanels;
  }, function(err) {
    $scope.error.message = err.userMessage;
  });

  var master = $scope.master = {
    search: false,
    donorPanels: [],
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
    search: angular.isUndefined($routeParams.search) ? master.search : $routeParams.search,
    donorPanels: toArray($routeParams.donorPanels) || master.donorPanels,
    bloodGroups: toArray($routeParams.bloodGroups) || master.bloodGroups,
    anyBloodGroup: angular.isUndefined($routeParams.search) ? master.anyBloodGroup : $routeParams.anyBloodGroup,
    noBloodGroup: angular.isUndefined($routeParams.search) ? master.noBloodGroup : $routeParams.noBloodGroup,
    lastDonationFromDate: angular.isUndefined($routeParams.lastDonationFromDate) ? master.lastDonationFromDate : new Date($routeParams.lastDonationFromDate),
    lastDonationToDate: angular.isUndefined($routeParams.lastDonationToDate) ? master.lastDonationToDate : new Date($routeParams.lastDonationToDate),
    clinicDate: angular.isUndefined($routeParams.clinicDate) ? master.clinicDate : new Date($routeParams.clinicDate)
  };

  var columnDefs = [
    {field: 'donorNumber'},
    {field: 'firstName'},
    {field: 'lastName'},
    {
      field: 'dateOfLastDonation',
      cellFilter: 'bsisDate'
    },
    {field: 'bloodGroup'},
    {
      name: 'Donor Panel',
      field: 'donorPanel.name'
    }
  ];

  $scope.gridOptions = {
    data: [],
    enableGridMenu: true,
    columnDefs: columnDefs
  };

  $scope.onSearch = function(form) {
    
    if (form && form.$invalid) {
      return;
    }

    $scope.search.search = true;
    $location.search($scope.search);

    var search = angular.copy($scope.search);

    DonorService.findDonorListDonors(search, function(res) {
      $scope.gridOptions.data = res;
    }, function(err) {
      $scope.error.message = err.userMessage;
    });
  };

  $scope.onClear = function(form) {
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

  if ($scope.search.search) {
    $scope.onSearch();
  }
});
