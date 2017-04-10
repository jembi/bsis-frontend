'use strict';

angular.module('bsis').controller('ViewReturnsCtrl', function($scope, $location, $log, ReturnFormsService, DATEFORMAT, gettextCatalog) {

  $scope.dateFormat = DATEFORMAT;

  var master = {
    returnDateFrom: moment().subtract(7, 'days').startOf('day').toDate(),
    returnDateTo: moment().endOf('day').toDate(),
    returnedFromId: null,
    returnedToId: null
  };

  var returnDateTitle = gettextCatalog.getString('Return Date');
  var returnStatusTitle = gettextCatalog.getString('Return Status');
  var returnedFromTitle = gettextCatalog.getString('Returned From');
  var returnedTOTitle = gettextCatalog.getString('Returned To');

  var columnDefs = [
    {
      name: 'Return Date',
      displayName: returnDateTitle,
      field: 'returnDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Return Status',
      displayName: returnStatusTitle,
      field: 'status',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Returned From',
      displayName: returnedFromTitle,
      field: 'returnedFrom.name',
      width: '**'
    },
    {
      name: 'Returned To',
      displayName: returnedTOTitle,
      field: 'returnedTo.name',
      width: '**'
    }
  ];

  $scope.searchParams = {};
  $scope.returnToSites = [];
  $scope.returnFromSites = [];
  $scope.searching = false;
  $scope.submitted = false;

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 7,
    paginationTemplate: 'views/template/pagination.html',
    minRowsToShow: 7,
    columnDefs: columnDefs,
    rowTemplate: 'views/template/clickablerow.html',

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  $scope.findReturns = function(findReturnForm) {
    if (findReturnForm.$invalid) {
      return;
    }
    $scope.searching = true;
    $scope.submitted = true;

    // Find returns
    ReturnFormsService.findReturnForms($scope.searchParams, function(res) {
      $scope.gridOptions.data = res.returnForms;
      $scope.searching = false;
      $scope.gridOptions.paginationCurrentPage = 1;
    }, function(err) {
      $scope.searching = false;
      $log.error(err);
    });
  };

  $scope.onRowClick = function(row) {
    $location.path('/viewReturn/' + row.entity.id);
  };

  $scope.init = function() {
    $scope.gridOptions.data = [];
    $scope.searchParams = angular.copy(master);
    $scope.submitted = false;
    $scope.searching = false;
    ReturnFormsService.getReturnFormsForm(function(response) {
      $scope.returnFromSites = response.usageSites;
      $scope.returnToSites = response.distributionSites;
    }, $log.error);
  };

  $scope.init();


});
