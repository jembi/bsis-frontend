'use strict';

angular.module('bsis').controller('TransfusionsReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, DATEFORMAT) {

  // Initialize mocks
  var mockUsageSites = [
    {id: 1, name: 'Leribe'},
    {id: 2, name: 'Maseru'}
  ];

  var mockTransfusionReactionTypes = [
    {id: 1, name: 'ABO incompatibility'},
    {id: 2, name: 'Allo-antibody'},
    {id: 3, name: 'NI Haemolysis'},
    {id: 4, name: 'Anaphylaxis'},
    {id: 5, name: 'TACO'},
    {id: 6, name: 'TRALI'},
    {id: 7, name: 'TTBI'},
    {id: 8, name: 'TT-HBV'},
    {id: 9, name: 'TT-HCV'},
    {id: 10, name: 'TT-HIV'},
    {id: 11, name: 'TT-Other'},
    {id: 12, name: 'TT-Malaria'},
    {id: 13, name: 'TT-Parasitical'},
    {id: 14, name: 'PTP'},
    {id: 15, name: 'TA-GVHD'},
    {id: 16, name: 'Other'}
  ];

  // Initialize variables
  var master = {
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate(),
    allSites: true,
    usageSite: null
  };
  $scope.search = angular.copy(master);
  $scope.dateFormat = DATEFORMAT;

  var columnDefs = [];

  $scope.gridOptions = {
    data: [],
    paginationPageSize: 8,
    paginationTemplate: 'views/template/pagination.html',
    columnDefs: columnDefs,
    minRowsToShow: 8,

    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: ReportsLayoutService.pdfDefaultStyle,
    exporterPdfTableHeaderStyle: ReportsLayoutService.pdfTableHeaderStyle,
    exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth
  };

  // Report methods

  $scope.clearSearch = function(form) {
    $scope.search = angular.copy(master);
    form.$setPristine();
    form.$setUntouched();
    $scope.gridOptions.data = [];
    $scope.submitted = false;
  };

  $scope.clearUsageSite = function() {
    $scope.search.usageSite = null;
  };

  $scope.updateAllSites = function() {
    if ($scope.search.usageSite) {
      $scope.search.allSites = false;
    }
  };

  function populateColumnNames() {
    columnDefs.push({ displayName: 'Usage Site', field: 'usageSite', width: '**', minWidth: 150 });
    columnDefs.push({ displayName: 'Total Transfused Uneventfully', field: 'totalTransfusedUneventfully', width: 55 });
    columnDefs.push({ displayName: 'Total Not Transfused', field: 'totalNotTransfused', width: 55 });
    angular.forEach(mockTransfusionReactionTypes, function(adverseEventType) {
      var displayName = ReportsLayoutService.hyphenateLongWords(adverseEventType.name, 11);
      columnDefs.push({displayName: displayName, field: adverseEventType.name, width: '**', minWidth: 80, maxWidth: 100});
    });
    columnDefs.push({ displayName: 'Total Reactions', field: 'totalReactions', width: 55 });
    columnDefs.push({ displayName: 'Total Unknown', field: 'totalUnknown', width: 55 });
  }

  $scope.getReport = function(searchForm) {

    if (!searchForm.$valid) {
      return;
    }

    $scope.searching = false;
    $log.debug(angular.toJson($scope.search));

    $scope.submitted = true;

    populateColumnNames();

  };

  function init() {
    $scope.usageSites = mockUsageSites;
    $scope.usageSitesNumber = 0;
  }

  init();
});
