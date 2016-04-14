'use strict';

angular.module('bsis')

  .controller('ViewTestBatchCtrl', function($scope, $location, $log, TestingService, $filter, $timeout, $routeParams, $q, $route, $uibModal, PERMISSIONS, uiGridConstants) {

    $scope.permissions = PERMISSIONS;

    var data = [{}];
    $scope.data = data;

    $scope.testBatchAvailableDonationBatches = [];
    $scope.exportOptions = [
      {
        id: 'allSamples',
        value: 'All Samples',
        reportName: 'Test Batch Outcomes Summary Report',
        filterKeys: [],
        columns: ['ttistatus', 'bloodTypingStatus', 'bloodTypingMatchStatus'],
        matchType: true
      },
      {
        id: 'ttiUnsafeSample',
        value: 'TTI Unsafe or Incomplete',
        reportName: 'Test Batch Outcomes Summary Report - TTI Unsafe and Tests Outstanding',
        filterKeys: ['TTI_SAFE'],
        columns: ['ttistatus'],
        matchType: false
      },
      {
        id: 'testingIncompleteSamples',
        value: 'Blood Typing Issues or Incomplete',
        reportName: 'Test Batch Outcomes Summary Report - Blood Typing Issues and Tests Outstanding',
        filterKeys: ['MATCH', 'RESOLVED'],
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
        TestingService.setCurrentTestBatch($scope.testBatch.id);
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
      for (var i = 0; i < data.length; i++) {
        data[i].bloodTypingStatusBloodTypingMatchStatus = data[i].bloodTypingStatus + ' ' +  data[i].bloodTypingMatchStatus + '(' + data[i].bloodAbo + data[i].bloodRh + ')';
        data[i].previousDonationAboRhOutcome = '';
      }
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
          $scope.reEntryRequiredPendingBloodTypingTests = response.reEntryRequiredPendingBloodTypingTests;
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
        width: '**',
        maxWidth: '150'
      },
      {
        name: 'Pack Type',
        field: 'packType.packType',
        visible: true,
        width: '**',
        maxWidth: '120'
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
        width: '**',
        maxWidth: '120'
      },
      {
        name: 'bloodTypingStatusBloodTypingMatchStatus',
        displayName: 'Blood Group Serology',
        field: 'bloodTypingStatusBloodTypingMatchStatus',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity["bloodTypingStatus"]}} - {{row.entity["bloodTypingMatchStatus"]}} <em>({{row.entity["bloodAbo"]}}{{row.entity["bloodRh"]}})</em></div>',
        visible: true,
        width: '**'
      },
      {
        name: 'previousDonationAboRhOutcome',
        displayName: 'Previous ABO/Rh',
        field: 'previousDonationAboRhOutcome',
        visible: false,
        width: '100'
      }
    ];

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
        } else if (col.name === 'previousDonationAboRhOutcome') {
          if (row.entity.previousDonationAboRhOutcome === null) {
            return '';
          } else {
            return row.entity.previousDonationAboRhOutcome;
          }
        }
        // assume that column is a test outcome column, and manage empty values
        if (col.name !== 'DIN' && col.name !== 'Pack Type' && col.name !== 'Venue' && col.name !== 'TTI Status' && col.name !== 'bloodTypingStatusBloodTypingMatchStatus' && col.name !== 'previousDonationAboRhOutcome') {
          for (var test in value) {
            if (test === col.name) {
              return value[test] || '';
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
          if ($scope.dataExportType.filterKeys.length === 0) {
            match = true;
          } else if ($scope.dataExportType.filterKeys.indexOf(row.entity[field]) !== -1) {
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

    function addTestNamesToColumnDefs(testBatchOutcomesReport) {

      angular.forEach(testBatchOutcomesReport.basicTtiTestNames, function(testName) {
        columnDefs.push(
          {
            name: testName,
            displayName: testName,
            field: 'testResults',
            visible: false,
            width: '80'
          }
        );
      });

      angular.forEach(testBatchOutcomesReport.repeatTtiTestNames, function(testName) {
        columnDefs.push(
          {
            name: testName,
            displayName: testName,
            field: 'testResults',
            visible: false,
            width: '80'
          }
        );
      });

      angular.forEach(testBatchOutcomesReport.basicBloodTypingTestNames, function(testName) {
        columnDefs.push(
          {
            name: testName,
            displayName: testName,
            field: 'testResults',
            visible: false,
            width: '65'
          }
        );
      });

      angular.forEach(testBatchOutcomesReport.repeatBloodTypingTestNames, function(testName) {
        columnDefs.push(
          {
            name: testName,
            displayName: testName,
            field: 'testResults',
            visible: false,
            width: '70'
          }
        );
      });

      // notify grid-ui that the column defs have changed
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    }

    $scope.export = function(format) {

      TestingService.getTestBatchOutcomesReport($routeParams.id, function(testBatchOutcomesReport) {

        addTestNamesToColumnDefs(testBatchOutcomesReport);

        // load test outcomes and previous ABO/Rh for each donation in the test batch
        angular.forEach($scope.gridOptions.data, function(item, key) {
          angular.forEach(testBatchOutcomesReport.donationTestOutcomesReports, function(donationTestOutcomesReport) {
            if (item.donationIdentificationNumber === donationTestOutcomesReport.donationIdentificationNumber) {
              $scope.gridOptions.data[key].testResults = donationTestOutcomesReport.bloodTestOutcomes;
              $scope.gridOptions.data[key].previousDonationAboRhOutcome = donationTestOutcomesReport.previousDonationAboRhOutcome;
            }
          });
        });

        $scope.reportName = $scope.dataExportType.reportName;
        if (format === 'pdf') {
          $scope.gridApi.exporter.pdfExport('all', 'all');
        } else if (format === 'csv') {
          $scope.gridApi.exporter.csvExport('all', 'all');
        }
      }, function(err) {
        $log.error(err);
      });
    };

    function showConfirmation(title, button, message) {

      var modal = $uibModal.open({
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

    $scope.validateForm = function(form) {
      if (form.donationBatches.$invalid) {
        return 'invalid';
      } else {
        $scope.confirmEdit = false;
      }
    };
  });
