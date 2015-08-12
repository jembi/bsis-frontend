'use strict';

angular.module('bsis').controller('AuditLogCtrl', function($scope, $filter, Api, ngTableParams) {
  
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

  $scope.revisionTypes = [
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
  ];

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
        startDate: moment().subtract(7, 'days').toISOString(),
        endDate: moment().toISOString()
      };

      var filter = angular.copy(params.filter() || {});
      if (filter.user) {
        query.search = filter.user;
      }
      delete filter.user;

      Api.AuditRevisions.query(query, function(auditRevisions) {
        // Transform
        var data = groupModifications(unwindRevisions(auditRevisions));
        params.total(data.length);

        // Filter
        data = $filter('filter')(data, filter);

        // Sort
        if (params.sorting()) {
          data = $filter('orderBy')(data, params.orderBy());
        }

        // Page
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }, $defer.reject);
    }
  });
});
