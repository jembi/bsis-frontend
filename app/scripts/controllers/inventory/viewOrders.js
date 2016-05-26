'use strict';

angular.module('bsis').controller('ViewOrdersCtrl', function($scope, $location, $log, OrderFormsService) {

  var master = {
    period: {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    },
    type: null,
    dispatchedFrom: null,
    dispatchedTo: null
  };

  var columnDefs = [
    {
      name: 'Order Date',
      field: 'orderDate',
      cellFilter: 'bsisDate',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Order Status',
      field: 'status',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Dispatch Type',
      field: 'type',
      width: '**',
      maxWidth: '200'
    },
    {
      name: 'Dispatched From',
      field: 'dispatchedFrom.name',
      width: '**'
    },
    {
      name: 'Dispatched To',
      field: 'dispatchedTo.name',
      width: '**'
    }
  ];

  var distributionSites = [];
  var usageSites = [];

  $scope.searchParams = {};
  $scope.dispatchToSites = [];
  $scope.dispatchFromSites = [];
  $scope.searching = false;
  $scope.submitted = false;

  $scope.gridOptions = {
    data: [],
    columnDefs: columnDefs,

    minRowsToShow: 7,
    paginationPageSize: 7,
    paginationPageSizes: [10],
    paginationTemplate: 'views/template/pagination.html',
    rowTemplate: 'views/template/clickablerow.html',

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }
  };

  // Set the "dispatch to" sites based on dispatch type
  function updateDispatchToSites() {
    if ($scope.searchParams.type === 'TRANSFER') {
      $scope.dispatchToSites = distributionSites.filter(function(site) {
        // Filter the selected distribution site from the options
        return site.id !== $scope.searchParams.dispatchedFrom;
      });
    } else if ($scope.searchParams.type === 'ISSUE') {
      $scope.dispatchToSites = usageSites;
    } else {
      $scope.dispatchToSites = [];
    }
  }

  $scope.$watch('searchParams.type', function() {
    // Update to set available options based on type
    updateDispatchToSites();
  });

  $scope.$watch('searchParams.dispatchedFrom', function() {
    // Update to ensure that the correct site is filtered
    updateDispatchToSites();
  });

  $scope.findOrders = function(findOrderForm) {
    if (findOrderForm.$invalid) {
      return;
    }
    $scope.searching = true;
    $scope.submitted = true;
    $scope.gridOptions.data.push({
      id: 1,
      orderDate: new Date(),
      dispatchedFrom: {
        id: 1,
        name: 'Test site'
      },
      dispatchedTo: {
        id: 2,
        name: 'Another test site'
      },
      type: 'ISSUED',
      status: 'DISPATCHED'
    });
    $scope.searching = false;
  };

  $scope.onRowClick = function(row) {
    $location.path('/viewOrder/' + row.entity.id);
  };

  $scope.init = function() {
    $scope.gridOptions.data = [];
    $scope.searchParams = angular.copy(master);
    $scope.submitted = false;
    $scope.searching = false;
    OrderFormsService.getOrderFormsForm(function(response) {
      $scope.dispatchFromSites = distributionSites = response.distributionSites;
      usageSites = response.usageSites;
      updateDispatchToSites();
    }, $log.error);
  };

  $scope.init();


});
