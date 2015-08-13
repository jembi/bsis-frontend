'use strict';

angular.module('bsis').controller('AuditLogCtrl', function($scope, $filter, $q, Api, ngTableParams) {
  
  function unwindRevisions(revisions) {
    var mapped = [];

    angular.forEach(revisions, function(revision) {

      angular.forEach(revision.entityModifications, function(modification) {

        mapped.push({
          id: revision.id,
          revisionDate: revision.revisionDate,
          user: revision.user,
          revisionType: modification.revisionType,
          entityName: modification.entityName
        });
      });
    });

    return mapped;
  }

  function groupModifications(revisions) {
    var grouped = [];

    angular.forEach(revisions, function(revision) {

      var match = false;
      angular.forEach(grouped, function(group) {
        if (!match &&
            revision.id === group.id &&
            revision.entityName === group.entityName &&
            revision.revisionType === group.revisionType) {
          match = true;
          group.count += 1;
        }
      });

      if (!match) {
        grouped.push(angular.extend({count: 1}, revision));
      }
    });

    return grouped;
  }

  $scope.dateRange = {
    startDate: moment().startOf('day'),
    endDate: moment()
  };

  $scope.ranges = {
    'Today': [
      moment().startOf('day'),
      moment()
    ],
    'Yesterday': [
      moment().subtract(1, 'day').startOf('day'),
      moment().subtract(1, 'day').endOf('day')
    ],
    'Last 7 days': [
      moment().subtract(7, 'days'),
      moment()
    ]
  };

  // The date range picker does not update the model
  // so we need to keep track of the selected date
  // range manually.
  var queryRange = angular.copy($scope.dateRange);
  $scope.reloadTable = function(dateRange) {
    queryRange = dateRange;
    $scope.tableParams.reload();
  };

  $scope.getRevisionTypes = function() {
    var deferred = $q.defer();
    deferred.resolve([
      {
        id: 'ADD',
        title: 'Added'
      },
      {
        id: 'MOD',
        title: 'Modified'
      },
      {
        id: 'DEL',
        title: 'Deleted'
      }
    ]);
    return deferred;
  };

  $scope.tableParams = new ngTableParams({
    page: 1,
    count: 10,
    sorting: {
      revisionDate: 'desc'
    }
  }, {
    counts: [],
    getData: function($defer, params) {

      var query = {
        startDate: queryRange.startDate.toISOString(),
        endDate: queryRange.endDate.toISOString()
      };

      var filter = angular.copy(params.filter() || {});
      if (filter.user) {
        query.search = filter.user;
      }
      delete filter.user;

      Api.AuditRevisions.query(query, function(auditRevisions) {
        // Transform
        var data = groupModifications(unwindRevisions(auditRevisions));

        // Filter
        data = $filter('filter')(data, filter);

        // Sort
        if (params.sorting()) {
          data = $filter('orderBy')(data, params.orderBy());
        }
        
        // Set total number of rows for pagination
        params.total(data.length);

        // Page
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }, $defer.reject);
    }
  });
});
