'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function ($scope, $rootScope, $location, TestingService, ICONS, PERMISSIONS, BLOODABO, BLOODRH, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.bloodAboOptions = BLOODABO;
    $scope.bloodRhOptions = BLOODRH;

    var data = [{}];
    $scope.data = data;
    $scope.openTestBatches = false;
    $scope.selectedDonationBatches = {};
    $scope.selectedDonationBatches.ids = [];
    $scope.searchResults = '';
    $scope.testResultsSearch = {
      donationIdentificationNumber: ''
    };

    var recentTestBatchData = [{}];
    $scope.recentTestBatchData = recentTestBatchData;
    $scope.recentTestBatches = false;
    
    $scope.ttiTests = [];
    $scope.bloodTypingStatus = [];

    $scope.isCurrent = function(path) {
      var initialView = '';
      if ($location.path().indexOf('/viewTestBatch') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/viewTestBatch';
        return true;
      } else if ($location.path().indexOf('/manageTTITesting') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/manageTTITesting';
        return true;
      } else if ($location.path().indexOf('/managePendingTests') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/managePendingTests';
        return true;
      } else if ($location.path().indexOf('/manageBloodGroupTesting') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/manageBloodGroupTesting';
        return true;
      } else if ($location.path().indexOf('/manageBloodGroupMatchTesting') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/manageBloodGroupMatchTesting';
        return true;
      } else if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        $location.path(path);
        $scope.selection = path;
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        // for first time load of /testing view, determine the initial view
        if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_BATCH) > -1)){
          initialView = '/manageTestBatch';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_OUTCOME) > -1)){
          initialView = '/viewTestResults';
        }
        else if(($rootScope.sessionUserPermissions.indexOf($scope.permissions.ADD_TEST_OUTCOME) > -1)){
          initialView = '/uploadTestResults';
        }

        // if first time load of /testing view , and path === initialView, return true
        if ($location.path() === "/testing" && path === initialView){
          $location.path(initialView);
          return true;
        }

        return false;
      }
    };

    $scope.go = function (path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.clear = function () {
      $location.search({});
      $scope.selectedDonationBatches = {};
      $scope.searchResults = '';
      $scope.testResultsSearch = {};
      $scope.file = {};
    };

    $scope.clearForm = function(form){
      $location.search({});
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.setFile = function(element) {
      $scope.$apply(function($scope) {
        $scope.file = element.files[0];
      });
    };

    $scope.getOpenTestBatches = function(){

      TestingService.getOpenTestBatches( function(response){
        if (response !== false){
          data = response.testBatches;
          $scope.data = data;
          if ($scope.testBatchTableParams.data.length >= 0){
            $scope.testBatchTableParams.reload();
          }
          if (data.length > 0){
            $scope.openTestBatches = true;
          }
          else {
            $scope.openTestBatches = false;
          }
          
        }
        else{
        }
      });

    };

    $scope.getRecentTestBatches = function (){

      TestingService.getRecentTestBatches( function(response){
        if (response !== false){
          recentTestBatchData = response.testBatches;
          $scope.recentTestBatchData = recentTestBatchData;

          if (recentTestBatchData.length > 0){
            $scope.recentTestBatches = true;
          }
          else {
            $scope.recentTestBatches = false;
          }
        }
        else{
        }
      });
    };

    

    $scope.getTestBatchFormFields = function(){

      TestingService.getTestBatchFormFields( function(response){
        if (response !== false){
          TestingService.setDonationBatches(response.donationBatches);
          $scope.donationBatches = TestingService.getDonationBatches();
        }
        else{
        }
      });

      $scope.donationBatches = TestingService.getDonationBatches();

    };

    $scope.getOpenTestBatches();
    $scope.getRecentTestBatches();
    $scope.getTestBatchFormFields();

    $scope.addTestBatch = function (donationBatches, valid){
      if (valid){

        $scope.addingTestBatch = true;
        TestingService.addTestBatch(donationBatches, function(response){
          if (response === true){
            $scope.selectedDonationBatches = {};
            $scope.getOpenTestBatches();
            $scope.getTestBatchFormFields();
            $scope.submitted = '';
          }
          else{
            // TODO: handle case where response == false
          }
          $scope.addingTestBatch = false;
        });
      }
      else{
        $scope.submitted = true;
        console.log("FORM NOT VALID");
      }
    };

    $scope.testBatchTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 4,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testBatchTableParams.reload(); });
    });

    $scope.recentTestBatchesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 8,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: recentTestBatchData.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(recentTestBatchData, params.filter()) : recentTestBatchData;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : recentTestBatchData;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("recentTestBatchData", function () {
      $timeout(function(){ $scope.recentTestBatchesTableParams.reload(); });
    });

    $scope.getTestResultsByDIN = function (testResultsSearch) {
      testResultsSearch.search = true;
      $location.search(testResultsSearch);
      $scope.searching = true;
      TestingService.getTestResultsByDIN(testResultsSearch.donationIdentificationNumber, function(response){
        if (response !== false){
          $scope.donation = response.donation;
          $scope.testResults = response.testResults.recentTestResults;
          $scope.searchResults = true;
        }
        else{
          $scope.searchResults = false;
        }
        $scope.searching = false;
      });
    };

    if ($routeParams.search){
      $scope.getTestResultsByDIN($routeParams);
    }
    
    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting/" + item.id);
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting/" + item.id);
      }
    };

    $scope.recordPendingBloodGroupMatchTests = function (item) {
      TestingService.setCurrentTestBatch(item.id);
        $location.path("/manageBloodGroupMatchTesting/" + item.id);
    };

    $scope.recordPendingTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path("/managePendingTests/" + item.id);
    };

  })

  .controller('TestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams) {

    $scope.viewTestBatch = function (item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path("/viewTestBatch/" + item.id);
    };

    $scope.recordTestResults = function (item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if(testCategory === 'tti'){
        $location.path("/manageTTITesting/" + item.id);
      }
      else if (testCategory === 'bloodGrouping'){
        $location.path("/manageBloodGroupTesting/" + item.id);
      }
    };

  })

  .controller('ViewTestBatchCtrl', function ($scope, $location, TestingService, $filter, ngTableParams, $timeout, $routeParams, $q, $route) {
    var data = [{}];
    $scope.data  = data;

    $scope.getCurrentTestBatch = function () {
      TestingService.getTestBatchById($routeParams.id, function(response){
          $scope.testBatch = response.testBatch;
          var donations = [];
          angular.forEach($scope.testBatch.donationBatches, function(batch){
            angular.forEach(batch.donations, function(donation){
              donations.push(donation);
            });
          });
          data = donations;
        $scope.gridOptions.data = data;
          $scope.data = data;
      }, function (err){
        console.log(err);
      });
    };

    $scope.getCurrentTestBatch();

    $scope.getCurrentTestBatchOverview = function () {
      TestingService.getTestBatchOverviewById($routeParams.id, function(response){
        if (response !== false){
          $scope.testBatchOverview = response;
          $scope.pendingBloodTypingTests = response.pendingBloodTypingTests;
          $scope.pendingTTITests = response.pendingTTITests;
          $scope.pendingBloodTypingMatchTests = response.pendingBloodTypingMatchTests;
          $scope.basicBloodTypingComplete = response.basicBloodTypingComplete;
          $scope.basicTTIComplete = response.basicTTIComplete;
        }
        else{
        }
      });
    };

    $scope.getCurrentTestBatchOverview();

    var columnDefs = [
      {
        name: 'DIN',
        displayName: 'DIN',
        field: 'donationIdentificationNumber',
        visible: true,
      },
      {
        name: 'Date Bled',
        displayName: 'Date Bled',
        field: 'bleedStartTime',
        cellFilter: 'bsisDate',
        visible: true,
      },
      {
        name: 'Pack Type',
        field: 'packType.packType',
        visible: true,
      },
      {
        name: 'Venue',
        displayName: 'Venue',
        field: 'venue.name',
        visible: true,
      },
      {
        name: 'ttistatus',
        displayName: 'TTI Status',
        field: 'ttistatus',
        cellFilter: 'mapTTIStatus',
        visible: true,
      },
      {
        name:'bloodAboRh',
        displayName: 'Blood Group Serology',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity["bloodTypingStatus"]}} - {{row.entity["bloodTypingMatchStatus"]}} <em>({{row.entity["bloodAbo"]}}{{row.entity["bloodRh"]}})</em></div>',
        visible: true,
      }
    ];

    $scope.getTests = function () {
      TestingService.getTTITestingFormFields( function(response){
        if (response !== false){
          $scope.ttiTestsBasic = response.basicTTITests;
          $scope.ttiTestsConfirmatory = response.confirmatoryTTITests;

          // add TTI Tests Basic to report column defs
          angular.forEach($scope.ttiTestsBasic, function(test){
            columnDefs.push(
              {
                name: test.testNameShort,
                displayName:  test.testNameShort,
                field: 'testResults.recentTestResults',
                visible: false,
              }
            );
          });

          // add TTI Tests Confirmatory to report column defs
          angular.forEach($scope.ttiTestsConfirmatory, function(test){
            columnDefs.push(
              {
                name: test.testNameShort,
                displayName:  test.testNameShort,
                field: 'testResults.recentTestResults',
                visible: false,
              }
            );
          });

        }
        else{
        }
      });
      TestingService.getBloodGroupTestingFormFields( function(response){
        if (response !== false){
          $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;

          // add Blood Typing Tests to report column defs
          angular.forEach($scope.bloodTypingTestsBasic, function(test){
            columnDefs.push(
              {
                name: test.testNameShort,
                displayName:  test.testNameShort,
                field: 'testResults.recentTestResults',
                visible: false,
              }
            );
          });

        }
        else{
        }
      });
    };

    $scope.getTests();

    $scope.gridOptions = {
      data: [],
      paginationPageSize: 10,
      paginationPageSizes: [10],
      paginationTemplate: 'views/template/pagination.html',
      columnDefs: columnDefs,

      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'A4',
      exporterPdfDefaultStyle: {fontSize: 6},
      exporterPdfTableHeaderStyle: {fontSize: 6, bold: true},
      exporterPdfMaxGridWidth: 250,

      // Format values for exports
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'Date Bled') {
          return $filter('bsisDate')(value);
        }

        else if (col.name === 'ttistatus') {
          return $filter('mapTTIStatus')(value);
        }

        else if (col.name === 'bloodAboRh'){
          var bloodSerology = 'N/D';
          if (row.entity.bloodTypingStatus !== 'NOT_DONE'){
            bloodSerology = row.entity.bloodTypingStatus + ' ' + row.entity.bloodTypingMatchStatus + ' (' + row.entity.bloodAbo + row.entity.bloodRh + ') in ' + row.entity.packType.packType + ' pack';
          }
          return bloodSerology;
        }

        // assume that column is a test outcome column, and manage empty values
        else if (col.name !== 'DIN' && col.name !== 'Pack Type' && col.name !== 'Venue'){
          for (var test in value) {
            if (value[test].bloodTest.testNameShort == col.name){
              return value[test].result || 'N/D';
            }
          }
          return 'N/D';
        }

        return value;
      },


      
      // PDF header
      exporterPdfHeader: function() {
        var finalArray = [
            {
              text: $scope.reportName,
              bold: true,
              margin: [30, 10, 0, 0]
            },
            {
              text: 'Created On: ' + $filter('bsisDate')($scope.testBatch.createdDate),
              margin: [300, -10, 0, 0]
            }
        ];
        return finalArray;
      },
      
      
      exporterPdfCustomFormatter: function (docDefinition) {
        var prefix = [];
        angular.forEach($scope.testBatch.donationBatches, function(val){
            var venue = val.venue.name;
            var dateCreated = $filter('bsisDate')(val.createdDate);
            var numDonations = val.numDonations;
            prefix.push(
              {
                text: 'Venue: ' + venue +', Date Created: ' + dateCreated +  ', Number of Donations: ' + numDonations + '\n'
              }
            );
        });

        docDefinition.content= [{text: prefix, margin: [-10, -20, 0, 0]}].concat(docDefinition.content);
        return docDefinition;
      },
      

      exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},
      

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        var columns = [
          {text: 'Number of Samples: ' + $scope.gridOptions.data.length, width: 'auto'},
          {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
          {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
        ];
        return {
          columns: columns,
          columnGap: 10,
          margin: [30, 0]
        };
      },
      enableFiltering: false,

      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;

      }
    };

    $scope.filter = function(filterKey) {
      $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
      $scope.gridApi.grid.refresh();
      $scope.filterKey = filterKey;
    };

    $scope.resetGrid = function () {
      $route.reload();
    };

    $scope.singleFilter = function(renderableRows){
      var matcher = new RegExp($scope.filterKey);
      renderableRows.forEach( function(row) {
        [ 'ttistatus', 'bloodTypingStatus', 'bloodTypingMatchStatus' ].forEach(function( field ){
          if (row.entity[field].match(matcher) ){
            row.visible = false;
          }
        });
      });
      return renderableRows;
    };

    $scope.export = function(format){
      TestingService.getTestResults($routeParams.id, function (testResults){
        angular.forEach($scope.gridOptions.data, function (item, key) {
          angular.forEach(testResults.testResults, function(testResult){
            if (item.id == testResult.donation.id){
              $scope.gridOptions.data[key].testResults = testResult;
            }
          });
        });
        if(format === 'pdf'){
          $scope.reportName = 'Test Batch Outcomes Summary Report';
          $scope.gridApi.exporter.pdfExport('all', 'all');
        }
        else if (format === 'csv'){
          $scope.gridApi.exporter.csvExport('all', 'all');
        } else if (format === 'pdfVisible'){
          if ($scope.filterKey == 'TTI_SAFE') {
            $scope.reportName = 'Unsafe Test Batch Outcomes Summary Report';
          }

          if ($scope.filterKey == 'COMPLETE') {
            $scope.reportName = 'Blood Serology Not Done Test Batch Outcomes Summary Report';
          }

          $scope.gridApi.exporter.pdfExport('visible', 'all');
        }
        else if (format === 'csvVisible'){
          $scope.gridApi.exporter.csvExport('visible', 'all');
        }
      });
    };

    $scope.testSamplesTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 8,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testSamplesTableParams.reload(); });
    });

    $scope.closeTestBatchCheck = function(testBatch){
      $scope.testBatchToClose = testBatch.id;
    };

    $scope.closeTestBatchCancel = function(){
      $scope.testBatchToClose = '';
    };

    $scope.closeTestBatch = function (testBatch){
      TestingService.closeTestBatch(testBatch, function(response){
        if (response !== false){
          $scope.testBatchToClose = '';
          $location.path("/manageTestBatch");
        }
        else{
          // TODO: handle case where response == false
        }
      });
      
    };

  })

  .controller('RecordTestResultsCtrl', function ($scope, $location, TestingService, TTITESTS, BLOODTYPINGTESTS, TTIOUTCOME, BGSOUTCOME, ABO, RH, $q, $filter, ngTableParams, $timeout,$routeParams) {
    var data = [{}];
    $scope.data  = data;
    $scope.ttiTests = TTITESTS.options;
    $scope.bloodTypingTests = BLOODTYPINGTESTS.options;
    $scope.ttiOutcomes = TTIOUTCOME.options;
    $scope.bgsOutcomes = BGSOUTCOME.options;
    $scope.abo = ABO.options;
    $scope.rh = RH.options;

    $scope.go = function (path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.getCurrentTestBatch = function () {
      TestingService.getTestBatchById($routeParams.id,  function(response){
        if (response !== false){
          $scope.testBatch = response.testBatch;

        }
        else{
        }
      });
    };

    $scope.getTests = function () {
      TestingService.getTTITestingFormFields( function(response){
        if (response !== false){
          $scope.ttiTestsBasic = response.basicTTITests;
          $scope.ttiTestsConfirmatory = response.confirmatoryTTITests;
        }
        else{
        }
      });
      TestingService.getBloodGroupTestingFormFields( function(response){
        if (response !== false){
          $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;
        }
        else{
        }
      });
    };

    $scope.getCurrentTestResults = function () {

      $scope.searching = true;

      TestingService.getTestResultsById($routeParams.id, function(response){
        if (response !== false){
          data = response.testResults;
          $scope.data = data;

          $scope.addTestResults = {};
          $scope.addTestMatchResults = {};
          angular.forEach($scope.data, function(value, key) {
            $scope.addTestResults[value.donation.donationIdentificationNumber] = {"donationIdentificationNumber": value.donation.donationIdentificationNumber};

            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"donationIdentificationNumber": value.donation.donationIdentificationNumber};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"bloodAbo": ""};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {"bloodRh": ""};
          });

        }
        else{
        }
        $scope.searching = false;
      });
    };

    $scope.getCurrentTestBatch();
    $scope.getTests();
    $scope.getCurrentTestResults();

    $scope.saveTestResults = function (testResults) {

      $scope.savingTestResults = true;

      var requests = [];

      angular.forEach(testResults, function(value, key) {
        var request = TestingService.saveTestResults(value, function(response){
          if (response === true){
          }
          else{
            // TODO: handle case where response == false
          }
        });

        requests.push(request);
      });

      $q.all(requests).then(function(){
        $location.path("/viewTestBatch/" + $routeParams.id );
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.saveBloodGroupMatchTestResults = function (testResults) {

      $scope.savingTestResults = true;

      var requests = [];

      angular.forEach(testResults, function(value, key) {
        if(value.confirm){
          var request = TestingService.saveBloodGroupMatchTestResults(value, function(response){
            if (response === true){
            }
            else{
              // TODO: handle case where response == false
            }
          });
          requests.push(request);
        }
        
      });

      $q.all(requests).then(function(){
        $location.path("/viewTestBatch/" + $routeParams.id);
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.testSamplesTTITableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {},
      sorting: {}
    }, 
    {
      defaultSort: 'asc',
      counts: [], // hide page counts control
      total: data.length, // length of data
      getData: function ($defer, params) {
        var filteredData = params.filter() ?
          $filter('filter')(data, params.filter()) : data;
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()) : data;
        params.total(orderedData.length); // set total for pagination
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    $scope.$watch("data", function () {
      $timeout(function(){ $scope.testSamplesTTITableParams.reload(); });
    });

  })
;
