'use strict';

angular.module('bsis')
  .controller('UnitsDiscardedReportCtrl', function($scope, $log, $filter, ReportsService, ReportsLayoutService) {

    // Initialize variables

    var mergedData = [];
    var master = {
      startDate: moment().subtract(7, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
      allSites: true,
      processingSiteId: null
    };
    var discardReasons = [];
    $scope.search = angular.copy(master);

    // Report methods

    $scope.clearSearch = function(form) {
      $scope.search = angular.copy(master);
      form.$setPristine();
      form.$setUntouched();
      $scope.gridOptions.data = [];
      $scope.submitted = false;
    };

    $scope.clearProcessingSiteId = function() {
      $scope.search.processingSiteId = null;
    };

    $scope.updateAllSites = function() {
      if ($scope.search.processingSiteId) {
        $scope.search.allSites = false;
      } else {
        $scope.search.allSites = true;
      }
    };

    function initRow(componentType) {
      var row = {};
      row.componentType = componentType;
      angular.forEach(discardReasons, function(discardReason) {
        row[discardReason.reason] = 0;
      });
      row.total = 0;
      return row;
    }

    function pushRowsToGrid(rowsForVenue) {
      // Move Total row to end
      var totalRow = angular.copy(rowsForVenue[0]);
      rowsForVenue.splice(0, 1);
      rowsForVenue.push(totalRow);
      // Push rows to grid
      angular.forEach(rowsForVenue, function(row) {
        mergedData.push(row);
      });
    }

    function mergeData(dataValues) {

      var previousVenue = '';
      var rowsForVenue = [];
      var componentTypeIndex = 0;
      mergedData = [];
      $scope.venuesNumber = 0;

      angular.forEach(dataValues, function(newRow) {
        var cohorts = newRow.cohorts;
        var componentType = cohorts[0].option;
        var discardReason = cohorts[1].option;
        newRow.cohorts = componentType;

        // New venue
        if (newRow.venue.name !== previousVenue) {
          $scope.venuesNumber += 1;

          if (previousVenue != '') {
            pushRowsToGrid(rowsForVenue);
          }

          // Initialize total row for new venue
          previousVenue = newRow.venue.name;
          rowsForVenue = [];
          rowsForVenue[0] = initRow('Total');
          componentTypeIndex = 0;
        }

        componentTypeIndex += 1;
        if (!rowsForVenue[componentTypeIndex]) {
          // Initialize component type row for new venue
          rowsForVenue[componentTypeIndex] = initRow(componentType);
        }

        // Show processing site name on frist component type row only
        if (componentTypeIndex === 1) {
          rowsForVenue[componentTypeIndex].venue = previousVenue;
        }

        // Populate component type row
        rowsForVenue[componentTypeIndex][discardReason] = newRow.value;
        rowsForVenue[componentTypeIndex].total += newRow.value;
        // Populate total row
        rowsForVenue[0][discardReason] += newRow.value;
        rowsForVenue[0].total += newRow.value;
      });

      // Run one last time for the last venue
      pushRowsToGrid(rowsForVenue);

      $scope.gridOptions.data = mergedData;
    }

    function mockReport() {
      var report = {'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'dataValues': [

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Platelets Concentrate - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Storage Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - SAGM', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Quad Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Triple Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Double Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':2, 'name':'Leribe', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Single Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Platelets Concentrate - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Storage Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - SAGM', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Quad Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Triple Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Double Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Maseru', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Single Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Platelets Concentrate - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Storage Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Apheresis', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - Paediatric - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Packed Red Cells - SAGM', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Fresh Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Frozen Plasma - Whole Blood', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Quad Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Triple Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Double Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]},

        {'id':null, 'startDate':'2016-09-26T22:00:00.000Z', 'endDate':'2016-10-04T21:59:59.999Z', 'value':1, 'venue':{'id':3, 'name':'Other', 'isUsageSite':false, 'isMobileSite':false, 'isVenue':true, 'isProcessingSite':true, 'isDistributionSite':false, 'isTestingSite':false, 'isDeleted':false, 'divisionLevel1':null, 'divisionLevel2':null, 'divisionLevel3':null, 'notes':''},
        'cohorts':[{'category':'Component Type', 'option':'Whole Blood Single Pack - CPDA', 'comparator':'EQUALS'}, {'category':'Discard Reason', 'option':'Processing Problems', 'comparator':'EQUALS'}]}

      ]};

      return report;

    }

    $scope.getReport = function(searchForm) {

      if (!searchForm.$valid) {
        return;
      }

      var period = {};
      if ($scope.search.startDate) {
        var startDate = moment($scope.search.startDate).startOf('day').toDate();
        period.startDate = startDate;
      }
      if ($scope.search.endDate) {
        var endDate = moment($scope.search.endDate).endOf('day').toDate();
        period.endDate = endDate;
      }
      $scope.searching = true;
      $scope.submitted = true;
      var report = mockReport();
      mergeData(report.dataValues);
      $scope.gridOptions.paginationCurrentPage = 1;
      $scope.searching = false;

    };

    // Grid ui variables and methods

    var columnDefs = [
      { name: 'Site', field: 'venue' },
      { name: 'Component Type', field: 'componentType'},
      { name: 'Total', field: 'total', width: 55 }
    ];

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

      // Change formatting of PDF
      exporterPdfCustomFormatter: function(docDefinition) {
        docDefinition = ReportsLayoutService.highlightTotalRows('Total', 1, docDefinition);
        docDefinition = ReportsLayoutService.paginatePdf(19, docDefinition);
        return docDefinition;
      },

      // PDF header
      exporterPdfHeader: function() {
        var processingSitesNumberLine = 'Number of processing sites: ' + $scope.venuesNumber;
        return ReportsLayoutService.generatePdfPageHeader($scope.gridOptions.exporterPdfOrientation,
          'Discards Summary Report',
          ['Date Period: ', $filter('bsisDate')($scope.search.startDate), ' to ', $filter('bsisDate')($scope.search.endDate)],
          processingSitesNumberLine);
      },

      // PDF footer
      exporterPdfFooter: function(currentPage, pageCount) {
        return ReportsLayoutService.generatePdfPageFooter('sites', $scope.venuesNumber, currentPage, pageCount, $scope.gridOptions.exporterPdfOrientation);
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

    function init() {
      ReportsService.getUnitsDiscardedReportForm(function(response) {
        $scope.processingSites = response.processingSites;
        discardReasons = response.discardReasons;
        angular.forEach(discardReasons, function(discardReason) {
          // Add new column before the total column
          columnDefs.splice(-1, 0, {displayName: discardReason.reason, field: discardReason.reason, width: '**', maxWidth: '125'});
        });
      }, $log.error);
    }

    init();

  });
