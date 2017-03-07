'use strict';

angular.module('bsis')
  .controller('FindTransfusionCtrl', function($scope, $filter, $log, TransfusionService, DATEFORMAT) {

    $scope.dateFormat = DATEFORMAT;
    $scope.transfusionOutcomes = [];
    $scope.componentTypes = [];
    $scope.transfusionSites = [];

    $scope.searchParams = {};
    $scope.submitted = false;
    $scope.searching = false;

    var master = {
      donationIdentificationNumber: null,
      componentCode: null,
      componentTypeId: null,
      receivedFromId: null,
      transfusionOutcome: null,
      startDate: null,
      endDate: null
    };

    var columnDefs = [
      {
        name: 'DIN',
        displayName: 'DIN',
        field: 'donationIdentificationNumber',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Component Code',
        field: 'componentCode',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Component Type',
        field: 'componentType.componentTypeName',
        width: '**'
      },
      {
        name: 'Transfused On',
        field: 'dateTransfused',
        cellFilter: 'bsisDate',
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Outcome',
        field: 'transfusionOutcome',
        width: '**'
      }
    ];

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 8,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      minRowsToShow: 8,
      columnDefs: columnDefs,
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };

    function initialiseForm() {
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      TransfusionService.getSearchForm(function(response) {
        $scope.componentTypes = response.componentTypes;
        $scope.transfusionSites = response.usageSites;
        $scope.transfusionOutcomes = response.transfusionOutcomes;
      }, $log.error);
    }

    $scope.findTransfusion = function(searchForm) {
      if (searchForm.$invalid) {
        return;
      }
      $scope.submitted = true;
      $scope.searching = true;
      // hook up post endpoint
      $log.debug('Form initialised');
    };

    $scope.clearSearch = function(searchForm) {
      $scope.gridOptions.data = [];
      $scope.searchParams = angular.copy(master);
      $scope.submitted = false;
      $scope.searching = false;
      searchForm.$setPristine();
    };

    initialiseForm();
  });