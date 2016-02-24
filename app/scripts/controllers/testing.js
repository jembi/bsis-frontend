'use strict';

angular.module('bsis')
  .controller('TestingCtrl', function($scope, $rootScope, $location, TestingService, ICONS, PERMISSIONS, BLOODABO, BLOODRH, DATEFORMAT, $filter, ngTableParams, $timeout, $routeParams) {

    $scope.icons = ICONS;
    $scope.permissions = PERMISSIONS;
    $scope.bloodAboOptions = BLOODABO;
    $scope.bloodRhOptions = BLOODRH;
    $scope.dateFormat = DATEFORMAT;

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
      } else if ($location.path().indexOf('/reEnterTestOutcomes') === 0 && path === '/manageTestBatch') {
        if ($routeParams.bloodTestType === 'BASIC_TTI' || $routeParams.bloodTestType === 'CONFIRMATORY_TTI') {
          $scope.selection = '/reEnterTTI';
        } else if ($routeParams.bloodTestType === 'BASIC_BLOODTYPING') {
          $scope.selection = '/reEnterBloodTyping';
        }
        return true;
      } else if ($location.path().indexOf('/managePendingTests') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/managePendingTests';
        return true;
      } else if ($location.path().indexOf('/managePendingBloodTypingTests') === 0 && path === '/manageTestBatch') {
        $scope.selection = '/managePendingBloodTypingTests';
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
        if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_BATCH) > -1)) {
          initialView = '/manageTestBatch';
        } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.VIEW_TEST_OUTCOME) > -1)) {
          initialView = '/viewTestResults';
        } else if (($rootScope.sessionUserPermissions.indexOf($scope.permissions.ADD_TEST_OUTCOME) > -1)) {
          initialView = '/uploadTestResults';
        }

        // if first time load of /testing view , and path === initialView, return true
        if ($location.path() === '/testing' && path === initialView) {
          $location.path(initialView);
          return true;
        }

        return false;
      }
    };

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.clear = function() {
      $location.search({});
      $scope.selectedDonationBatches = {};
      $scope.searchResults = '';
      $scope.testResultsSearch = {};
      $scope.file = {};
    };

    $scope.clearForm = function(form) {
      $location.search({});
      form.$setPristine();
      $scope.submitted = '';
    };

    $scope.setFile = function(element) {
      $scope.$apply(function(scope) {
        scope.file = element.files[0];
      });
    };

    $scope.getOpenTestBatches = function() {

      TestingService.getOpenTestBatches(function(response) {
        if (response !== false) {
          data = response.testBatches;
          $scope.data = data;
          if ($scope.testBatchTableParams.data.length >= 0) {
            $scope.testBatchTableParams.reload();
          }
          $scope.openTestBatches = data.length > 0;

        }
      });

    };


    $scope.clearDates = function() {
      $scope.search.startDate = null;
      $scope.search.endDate = null;
    };

    var master = {
      status: 'CLOSED',
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate()
    };

    $scope.clearSearch = function() {

      $scope.searched = false;
      $scope.search = {
        status: 'CLOSED',
        startDate: null,
        endDate: null
      };
    };

    $scope.search = angular.copy(master);

    $scope.getRecentTestBatches = function() {
      var query = {
        status: 'CLOSED'
      };

      if ($scope.search.startDate) {
        var startDate = moment($scope.search.startDate).startOf('day').toDate();
        query.startDate = startDate;
      }

      if ($scope.search.endDate) {
        var endDate = moment($scope.search.endDate).endOf('day').toDate();
        query.endDate = endDate;
      }

      $scope.searching = true;

      TestingService.getRecentTestBatches(query, function(response) {
        $scope.searching = false;
        if (response !== false) {
          recentTestBatchData = response.testBatches;
          $scope.recentTestBatchData = recentTestBatchData;

          $scope.recentTestBatches = recentTestBatchData.length > 0;
        }
      }, function() {
        $scope.searching = false;
      });
    };

    $scope.getTestBatchFormFields = function() {

      TestingService.getTestBatchFormFields(function(response) {
        if (response !== false) {
          TestingService.setDonationBatches(response.donationBatches);
          $scope.donationBatches = TestingService.getDonationBatches();
        }
      });

      $scope.donationBatches = TestingService.getDonationBatches();
    };

    $scope.getOpenTestBatches();
    $scope.getRecentTestBatches();
    $scope.getTestBatchFormFields();

    $scope.addTestBatch = function(donationBatches, valid) {
      if (valid) {

        $scope.addingTestBatch = true;
        TestingService.addTestBatch(donationBatches, function(response) {
          if (response === true) {
            $scope.selectedDonationBatches = {};
            $scope.getOpenTestBatches();
            $scope.getTestBatchFormFields();
            $scope.submitted = '';
          }
          $scope.addingTestBatch = false;
        });
      } else {
        $scope.submitted = true;
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
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.testBatchTableParams.reload();
      });
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
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(recentTestBatchData, params.filter()) : recentTestBatchData;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : recentTestBatchData;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('recentTestBatchData', function() {
      $timeout(function() {
        $scope.recentTestBatchesTableParams.reload();
      });
    });

    $scope.getTestResultsByDIN = function(testResultsSearch) {
      testResultsSearch.search = true;
      $location.search(testResultsSearch);
      $scope.searching = true;
      TestingService.getTestResultsByDIN(testResultsSearch.donationIdentificationNumber, function(response) {
        if (response !== false) {
          $scope.donation = response.donation;
          $scope.testResults = response.testResults.recentTestResults;
          $scope.searchResults = true;
        } else {
          $scope.searchResults = false;
        }
        $scope.searching = false;
      });
    };

    if ($routeParams.search) {
      $scope.getTestResultsByDIN($routeParams);
    }

    $scope.recordTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/manageTTITesting/' + item.id);
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'bloodGrouping') {
        $location.path('/manageBloodGroupTesting/' + item.id);
      } else if (testCategory === 'bloodGroupingReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_BLOODTYPING');
      }
    };

    $scope.recordConfirmatoryBloodGroupMatchTests = function(item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path('/manageBloodGroupMatchTesting/' + item.id);
    };

    $scope.recordPendingBloodTypingTests = function(item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path('/managePendingBloodTypingTests/' + item.id);
    };

    $scope.recordPendingTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/managePendingTests/' + item.id);
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/CONFIRMATORY_TTI');
      }
    };

  })

  .controller('TestBatchCtrl', function($scope, $location, TestingService) {

    $scope.viewTestBatch = function(item) {
      TestingService.setCurrentTestBatch(item.id);
      $location.path('/viewTestBatch/' + item.id);
    };

    $scope.recordTestResults = function(item, testCategory) {
      TestingService.setCurrentTestBatch(item.id);
      if (testCategory === 'tti') {
        $location.path('/manageTTITesting/' + item.id);
      } else if (testCategory === 'ttiReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_TTI');
      } else if (testCategory === 'bloodGrouping') {
        $location.path('/manageBloodGroupTesting/' + item.id);
      } else if (testCategory === 'bloodGroupingReentry') {
        $location.path('/reEnterTestOutcomes/' + item.id + '/BASIC_BLOODTYPING');
      }
    };

  })

  .controller('ViewTestBatchCtrl', function($scope, $location, $log, TestingService, $filter, $timeout, $routeParams, $q, $route, $modal) {
    var data = [{}];
    $scope.data = data;

    $scope.testBatchAvailableDonationBatches = [];
    $scope.exportOptions = [
      {
        id: 'allSamples',
        value: 'All Samples',
        reportName: 'Test Batch Outcomes Summary Report',
        filterKey: '',
        columns: ['ttistatus', 'bloodTypingStatus', 'bloodTypingMatchStatus'],
        matchType: true
      },
      {
        id: 'ttiUnsafeSample',
        value: 'TTI Unsafe or Incomplete',
        reportName: 'Test Batch Outcomes Summary Report - TTI Unsafe and Tests Outstanding',
        filterKey: 'TTI_SAFE',
        columns: ['ttistatus'],
        matchType: false
      },
      {
        id: 'testingIncompleteSamples',
        value: 'Blood Typing Issues or Incomplete',
        reportName: 'Test Batch Outcomes Summary Report - Blood Typing Issues and Tests Outstanding',
        filterKey: 'MATCH',
        columns: ['bloodTypingMatchStatus'],
        matchType: false
      }
    ];
    $scope.dataExportType = $scope.exportOptions[0];

    $scope.getCurrentTestBatch = function() {
      TestingService.getTestBatchById($routeParams.id, function(response) {
        $scope.testBatch = response.testBatch;
        $scope.refreshCurrentTestBatch();
        $scope.refreshTestBatchAvailableDonations();
      }, function(err) {
        $log.error(err);
      });
    };

    $scope.refreshCurrentTestBatch = function() {
      // get the donation batches and the donations linked to this test batch
      $scope.testBatch.donationBatchIds = [];
      var donations = [];
      var numReleasedSamples = 0;
      angular.forEach($scope.testBatch.donationBatches, function(batch) {
        $scope.testBatch.donationBatchIds.push(batch.id);
        angular.forEach(batch.donations, function(donation) {
          if (donation.released) {
            numReleasedSamples++;
          }
          donations.push(donation);
        });
      });
      data = donations;
      $scope.gridOptions.data = data;
      $scope.data = data;
      $scope.testBatch.numReleasedSamples = numReleasedSamples;
    };

    $scope.refreshTestBatchAvailableDonations = function() {
      $scope.testBatchAvailableDonationBatches = [];
      angular.forEach($scope.testBatch.donationBatches, function(batch) {
        $scope.testBatchAvailableDonationBatches.push(batch);
      });
      // get the available donation batches
      TestingService.getTestBatchFormFields(function(response) {
        if (response !== false) {
          TestingService.setDonationBatches(response.donationBatches);
          $scope.donationBatches = response.donationBatches;
          angular.forEach(response.donationBatches, function(batch) {
            $scope.testBatchAvailableDonationBatches.push(batch);
          });
        }
      });
    };

    $scope.getCurrentTestBatch();

    $scope.getCurrentTestBatchOverview = function() {
      TestingService.getTestBatchOverviewById($routeParams.id, function(response) {
        if (response !== false) {
          $scope.testBatchOverview = response;
          $scope.pendingBloodTypingTests = response.pendingBloodTypingTests;
          $scope.pendingTTITests = response.pendingTTITests;
          $scope.basicBloodTypingComplete = response.basicBloodTypingComplete;
          $scope.basicTTIComplete = response.basicTTIComplete;
          $scope.pendingBloodTypingConfirmations = response.pendingBloodTypingConfirmations;
          $scope.reEntryRequiredTTITests = response.reEntryRequiredTTITests;
          $scope.reEntryRequiredBloodTypingTests = response.reEntryRequiredBloodTypingTests;
          $scope.reEntryRequiredPendingTTITests = response.reEntryRequiredPendingTTITests;
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
        width: '**',
        maxWidth: '120'
      },
      {
        name: 'Date Bled',
        displayName: 'Date Bled',
        field: 'donationDate',
        cellFilter: 'bsisDate',
        visible: true,
        width: '**'
      },
      {
        name: 'Pack Type',
        field: 'packType.packType',
        visible: true,
        width: '**',
        maxWidth: '100'
      },
      {
        name: 'Venue',
        displayName: 'Venue',
        field: 'venue.name',
        visible: true,
        width: '**'
      },
      {
        name: 'ttistatus',
        displayName: 'TTI Status',
        field: 'ttistatus',
        cellFilter: 'mapTTIStatus',
        visible: true,
        width: '**'
      },
      {
        name: 'bloodAboRh',
        displayName: 'Blood Group Serology',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity["bloodTypingStatus"]}} - {{row.entity["bloodTypingMatchStatus"]}} <em>({{row.entity["bloodAbo"]}}{{row.entity["bloodRh"]}})</em></div>',
        visible: true,
        width: '**'
      }
    ];

    $scope.getTests = function() {

      var ttiTests = TestingService.getTTITestingFormFields(function(response) {
        if (response !== false) {
          $scope.ttiTestsBasic = response.basicTTITests;
          $scope.ttiTestsPending = response.pendingTTITests;

          // add TTI Tests Basic to report column defs
          angular.forEach($scope.ttiTestsBasic, function(test) {
            columnDefs.push(
              {
                name: test.testNameShort,
                displayName: test.testNameShort,
                field: 'testResults.recentTestResults',
                visible: false,
                width: 80
              }
            );
          });

          // add TTI Tests Repeat to report column defs
          angular.forEach($scope.ttiTestsPending, function(test) {
            columnDefs.push(
              {
                name: test.testNameShort,
                displayName: test.testNameShort,
                field: 'testResults.recentTestResults',
                visible: false,
                width: 80
              }
            );
          });

        }
      });

      $q.all(ttiTests).then(function() {
        TestingService.getBloodGroupTestingFormFields(function(response) {
          if (response !== false) {
            $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;
            $scope.bloodTypingTestsRepeat = response.repeatBloodTypingTests;

            // add Blood Typing Tests to report column defs
            angular.forEach($scope.bloodTypingTestsBasic, function(test) {
              columnDefs.push(
                {
                  name: test.testNameShort,
                  displayName: test.testNameShort,
                  field: 'testResults.recentTestResults',
                  visible: false,
                  width: 70
                }
              );
            });

            // add Blood Typing Tests Repeat to report column defs
            angular.forEach($scope.bloodTypingTestsRepeat, function(test) {
              columnDefs.push(
                {
                  name: test.testNameShort,
                  displayName: test.testNameShort,
                  field: 'testResults.recentTestResults',
                  visible: false,
                  width: 70
                }
              );
            });
          }
        });

      }).finally(function() {
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
      exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
      exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
      exporterPdfMaxGridWidth: 500,

      // Format values for exports
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'Date Bled') {
          return $filter('bsisDate')(value);
        } else if (col.name === 'ttistatus') {
          return $filter('mapTTIStatus')(value);
        } else if (col.name === 'bloodAboRh') {
          var bloodSerology = '';
          if (row.entity.bloodTypingStatus !== 'NOT_DONE') {
            bloodSerology = row.entity.bloodTypingMatchStatus;
          }
          return bloodSerology;
        }
        // assume that column is a test outcome column, and manage empty values
        if (col.name !== 'DIN' && col.name !== 'Pack Type' && col.name !== 'Venue') {
          for (var test in value) {
            if (value[test].bloodTest.testNameShort == col.name) {
              return value[test].result || '';
            }
          }
          return '';
        }

        return value;
      },

      // PDF header
      exporterPdfHeader: function() {
        var finalArray = [
          {
            text: $scope.reportName,
            fontSize: 10,
            bold: true,
            margin: [30, 20, 0, 0] // [left, top, right, bottom]
          },
          {
            text: 'Created On: ' + $filter('bsisDate')($scope.testBatch.createdDate),
            fontSize: 6,
            margin: [300, -10, 0, 0]
          }
        ];
        return finalArray;
      },


      exporterPdfCustomFormatter: function(docDefinition) {
        var prefix = [];
        angular.forEach($scope.testBatch.donationBatches, function(val) {
          var venue = val.venue.name;
          var dateCreated = $filter('bsisDate')(val.createdDate);
          var numDonations = val.numDonations;
          prefix.push(
            {
              text: 'Venue: ' + venue + ', Date Created: ' + dateCreated + ', Number of Donations: ' + numDonations + '\n'
            }
          );
        });

        docDefinition.content = [{text: prefix, margin: [-10, 0, 0, 0], fontSize: 7}].concat(docDefinition.content);
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
          margin: [30, 0],
          fontSize: 6
        };
      },
      enableFiltering: false,

      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;

      }
    };

    $scope.filter = function(filterType) {

      $scope.dataExportType = filterType;
      $scope.getCurrentTestBatch();
      $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);

    };

    $scope.resetGrid = function() {
      $route.reload();
    };

    $scope.singleFilter = function(renderableRows) {
      $scope.filteredData = [];

      renderableRows.forEach(function(row) {
        var match = false;
        $scope.dataExportType.columns.forEach(function(field) {
          if ($scope.dataExportType.filterKey === '') {
            match = true;
          } else if (row.entity[field] === $scope.dataExportType.filterKey) {
            match = true;
          }
        });

        if (match != $scope.dataExportType.matchType) {
          row.visible = false;
        } else {
          $scope.filteredData.push(row.entity);
        }
      });

      $scope.gridOptions.data = $scope.filteredData;
      return renderableRows;
    };


    $scope.export = function(format) {
      TestingService.getTestResults($routeParams.id, function(testResults) {

        // load test outcomes for test batch
        angular.forEach($scope.gridOptions.data, function(item, key) {
          angular.forEach(testResults.testResults, function(testResult) {
            if (item.id == testResult.donation.id) {
              $scope.gridOptions.data[key].testResults = testResult;
            }
          });
        });

        $scope.reportName = $scope.dataExportType.reportName;
        if (format === 'pdf') {
          $scope.gridApi.exporter.pdfExport('all', 'all');
        } else if (format === 'csv') {
          $scope.gridApi.exporter.csvExport('all', 'all');
        }
      });
    };

    function showConfirmation(title, button, message) {

      var modal = $modal.open({
        animation: false,
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: {
            title: title,
            button: button,
            message: message
          }
        }
      });

      return modal.result;
    }

    $scope.closeTestBatch = function(testBatch) {

      showConfirmation('Confirm Close', 'Close', 'Are you sure that you want to close this test batch?').then(function() {

        TestingService.closeTestBatch(testBatch, function() {
          $location.path('/manageTestBatch');
        }, function(err) {
          $log.error(err);
        });
      });
    };

    $scope.reopenTestBatch = function(testBatch) {

      showConfirmation('Confirm Reopen', 'Reopen', 'Are you sure that you want to reopen this test batch?').then(function() {

        TestingService.reopenTestBatch(testBatch, function(response) {
          if (testBatch.permissions) {
            testBatch.permissions = response.permissions;
            testBatch.status = response.status;
          }
        }, function(err) {
          $scope.err = err;
          $log.error(err);
        });
      });
    };

    $scope.deleteTestBatch = function(testBatchId) {

      showConfirmation('Confirm Void', 'Void', 'Are you sure that you want to void this test batch?').then(function() {

        TestingService.deleteTestBatch(testBatchId, function() {
          $location.path('/manageTestBatch');
        }, function(err) {
          $scope.err = err;
          $log.error(err);
        });
      });
    };

    $scope.releaseTestBatch = function(testBatch) {

      var message = testBatch.readyForReleaseCount + ' of ' + testBatch.numSamples + ' samples will be released';
      if (testBatch.readyForReleaseCount < testBatch.numSamples) {
        message += ', the remaining samples require discrepancies to be resolved';
      }
      message += '. Are you sure that you want to release this test batch?';

      showConfirmation('Confirm Release', 'Release', message).then(function() {
        TestingService.releaseTestBatch(testBatch, function(response) {
          $scope.testBatch = response;
          $scope.refreshCurrentTestBatch();
        }, function(err) {
          $scope.err = err;
          $log.error(err);
        });
      });
    };

    $scope.updateTestBatch = function(testBatch) {
      TestingService.updateTestBatch(testBatch, function(response) {
        $scope.testBatch = response;
        $scope.refreshCurrentTestBatch();
        $scope.err = '';
      }, function(err) {
        $scope.err = err;
        $log.error(err);
      });
    };

  })

  .controller('RecordTestResultsCtrl', function($scope, $location, $log, TestingService, $q, $filter, ngTableParams, $timeout, $routeParams) {
    var data = [{}];
    $scope.data = data;

    $scope.go = function(path) {
      $location.path(path + '/' + $routeParams.id);
    };

    $scope.getCurrentTestBatch = function() {
      TestingService.getTestBatchById($routeParams.id, function(response) {
        if (response !== false) {
          $scope.testBatch = response.testBatch;

        }
      }, function(err) {
        $log.error(err);
      });
    };

    $scope.getTests = function() {
      TestingService.getTTITestingFormFields(function(response) {
        if (response !== false) {
          $scope.ttiTestsBasic = response.basicTTITests;
          $scope.ttiTestsPending = response.pendingTTITests;
        }
      });
      TestingService.getBloodGroupTestingFormFields(function(response) {
        if (response !== false) {
          $scope.bloodTypingTestsBasic = response.basicBloodTypingTests;
          $scope.bloodTypingTestsRepeat = response.repeatBloodTypingTests;
        }
      });
    };

    $scope.getCurrentTestResults = function() {

      $scope.searching = true;

      TestingService.getTestResultsById($routeParams.id, function(response) {
        if (response !== false) {
          data = response.testResults;
          $scope.data = data;

          $scope.addTestResults = {};
          $scope.addTestMatchResults = {};
          angular.forEach($scope.data, function(value) {
            $scope.addTestResults[value.donation.donationIdentificationNumber] = {'donationIdentificationNumber': value.donation.donationIdentificationNumber};

            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'donationIdentificationNumber': value.donation.donationIdentificationNumber};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'bloodAbo': ''};
            $scope.addTestMatchResults[value.donation.donationIdentificationNumber] = {'bloodRh': ''};
          });

        }
        $scope.searching = false;
      });
    };

    $scope.getCurrentTestBatch();
    $scope.getTests();
    $scope.getCurrentTestResults();

    $scope.saveTestResults = function(testResults, reEntry) {

      $scope.savingTestResults = true;

      var requests = [];

      angular.forEach(testResults, function(value) {
        var request = TestingService.saveTestResults(value, reEntry, angular.noop);
        requests.push(request);
      });

      // FIXME: Handle errors
      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.saveBloodGroupMatchTestResults = function(testResults) {

      $scope.savingTestResults = true;

      var requests = [];

      var aboTestId = $scope.getBloodTestId('ABO');
      var rhTestId = $scope.getBloodTestId('Rh');

      angular.forEach(testResults, function(value) {
        // save updated test results first
        var updatedTestResults = {};
        updatedTestResults.donationIdentificationNumber = value.donationIdentificationNumber;
        updatedTestResults.testResults = {};
        updatedTestResults.testResults[aboTestId] = value.bloodAbo;
        updatedTestResults.testResults[rhTestId] = value.bloodRh == '+' ? 'POS' : 'NEG';
        if (value.confirm) {
            // save confirmation last
          var request = TestingService.saveBloodGroupMatchTestResults(value, angular.noop);
          requests.push(request);
        }
      });

      $q.all(requests).then(function() {
        $location.path('/viewTestBatch/' + $routeParams.id);
      }).catch(function(err) {
        $log.error(err);
        // TODO: handle the case where there have been errors
      }).finally(function() {
        $scope.savingTestResults = false;
      });

    };

    $scope.getBloodTestId = function(testNameShort) {
      var testId = null;
      angular.forEach($scope.data[0].recentTestResults, function(value, key) {
        if (value.bloodTest.testNameShort == testNameShort) {
          testId = key;
        }
      });
      return testId;
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
        getData: function($defer, params) {
          var filteredData = params.filter() ?
            $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.testSamplesTTITableParams.reload();
      });
    });

    $scope.testSamplesBloodTypingTableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {},
      sorting: {}
    },
      {
        defaultSort: 'asc',
        counts: [], // hide page counts control
        total: data.length, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
          var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
          params.total(orderedData.length); // set total for pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    $scope.$watch('data', function() {
      $timeout(function() {
        $scope.testSamplesBloodTypingTableParams.reload();
      });
    });

  })
;

