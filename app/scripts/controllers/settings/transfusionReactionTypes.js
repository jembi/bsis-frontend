'use strict';

angular.module('bsis').controller('TransfusionReactionTypesCtrl', function($scope, $filter, $location, $log, $timeout, ICONS, TransfusionReactionTypesService, ngTableParams) {

  $scope.icons = ICONS;
  var data = [{}];
  $scope.data = data;
  $scope.transfusionReactionTypes = {};

  $scope.getTransfusionReactionTypes = function() {
    TransfusionReactionTypesService.getTransfusionReactionTypes(function(response) {
      if (response !== false) {
        data = response;
        $scope.data = data;
        $scope.transfusionReactionTypes = data;
        $scope.transfusionReactionTypesCount = $scope.transfusionReactionTypes.length;
      }
    });
  };

  $scope.tableParams = new ngTableParams({
    page: 1,
    count: 6
  }, {
    counts: [],
    getData: function($defer, params) {
      var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
      var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
      params.total(orderedData.length); // set total for pagination
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  $scope.$watch('data', function() {
    $timeout(function() {
      $scope.tableParams.reload();
    });
  });

  $scope.getTransfusionReactionTypes();
});
