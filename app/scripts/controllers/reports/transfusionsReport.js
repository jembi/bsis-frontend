'use strict';

angular.module('bsis').controller('TransfusionsReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService, TransfusionsReportingService, DATEFORMAT) {

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

  var mockDataValues = [
    {'value':3, 'location':{'name':'Maseru'}, 'cohorts':[{'category': 'Transfusion Reaction Type', 'option':'TT-Parasitical'}, {'category': 'Transfusion Outcome', 'option':'TRANSFUSION_REACTION_OCCURRED'}]},
    {'value':6, 'location':{'name':'Maseru'}, 'cohorts':[{'category': 'Transfusion Reaction Type', 'option':'TT-HIV'}, {'category': 'Transfusion Outcome', 'option':'TRANSFUSION_REACTION_OCCURRED'}]},
    {'value':3, 'location':{'name':'Maseru'}, 'cohorts':[{'category': 'Transfusion Reaction Type', 'option':'null'}, {'category': 'Transfusion Outcome', 'option':'TRANSFUSED_UNEVENTFULLY'}]},
    {'value':1, 'location':{'name':'Mohales Hoek'}, 'cohorts':[{'category': 'Transfusion Reaction Type', 'option':'TT-Parasitical'}, {'category': 'Transfusion Outcome', 'option':'TRANSFUSION_REACTION_OCCURRED'}]},
    {'value':10, 'location':{'name':'Mohales Hoek'}, 'cohorts':[{'category': 'Transfusion Reaction Type', 'option':'null'}, {'category': 'Transfusion Outcome', 'option':'NOT_TRANSFUSED'}]}];


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
    exporterPdfMaxGridWidth: ReportsLayoutService.pdfLandscapeMaxGridWidth,

    // PDF header
    exporterPdfHeader: function() {
      var sitesNumberLine = 'Usage Sites: ' + $scope.usageSitesNumber;
      return ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
        'Transfusion Summary Report',
        ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)],
        sitesNumberLine);
    },

    // Change formatting of PDF
    exporterPdfCustomFormatter: function(docDefinition) {
      docDefinition = ReportsLayoutService.highlightTotalRows('All Sites', 0, docDefinition);
      docDefinition = ReportsLayoutService.paginatePdf(27, docDefinition);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      return ReportsLayoutService.generatePdfPageFooter('sites', $scope.usageSitesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

  function initRow(reactionTypes) {
    var row = {};
    row.usageSite = '';
    row.totalTransfusedUneventfully = 0;
    row.totalNotTransfused = 0;
    angular.forEach(reactionTypes, function(reactionType) {
      row[reactionType.name] = 0;
    });
    row.totalReactions = 0;
    row.totalUnknown = 0;
    return row;
  }

  function populateRow(row, dataValue) {
    var reactionType = $filter('filter')(dataValue.cohorts, { category: 'Transfusion Reaction Type'})[0].option;
    var outcome = $filter('filter')(dataValue.cohorts, { category: 'Transfusion Outcome'})[0].option;

    row.usageSite = dataValue.location.name;

    if (outcome === 'TRANSFUSED_UNEVENTFULLY') {
      row.totalTransfusedUneventfully += dataValue.value;
    } else if (outcome === 'NOT_TRANSFUSED') {
      row.totalNotTransfused += dataValue.value;
    } else if (outcome === 'UNKNOWN') {
      row.totalUnknown += dataValue.value;
    } else if (outcome === 'TRANSFUSION_REACTION_OCCURRED') {
      row[reactionType] += dataValue.value;
      row.totalReactions += dataValue.value;
    }
  }

  $scope.getReport = function(searchForm) {

    if (!searchForm.$valid) {
      return;
    }

    $scope.searching = false;
    $log.debug(angular.toJson($scope.search));

    $scope.submitted = true;

    var data = TransfusionsReportingService.generateDataRows(mockDataValues, mockTransfusionReactionTypes, initRow, populateRow);
    $scope.gridOptions.data = data[0];
    $scope.usageSitesNumber = data[1];

    // Add summary row
    if ($scope.usageSitesNumber > 1) {
      $scope.gridOptions.data.push(TransfusionsReportingService.generateSummaryRow(mockDataValues, mockTransfusionReactionTypes, initRow, populateRow));
    }

  };

  function init() {
    populateColumnNames();
    $scope.usageSites = mockUsageSites;
    $scope.usageSitesNumber = 0;
  }

  init();
});
