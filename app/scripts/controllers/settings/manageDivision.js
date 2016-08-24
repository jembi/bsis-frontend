'use strict';

angular.module('bsis').controller('ManageDivisionCtrl', function($scope, $routeParams, $log, $location, DivisionsService) {

  function init() {
    if ($routeParams.id) {
      DivisionsService.getDivision({id: $routeParams.id}, function(res) {
        $scope.division = res.division;
      }, function(err) {
        $log.error(err);
      });
    }
  }

  function onSaveSuccess() {
    // Redirect back to divisions page
    $location.path('/divisions');
    $scope.saving = false;
  }

  function onSaveError(err) {
    $log.error(err);
    $scope.saving = false;
  }

  // Form fields
  $scope.levels = [1, 2, 3];
  $scope.parentDivisions = null;

  $scope.division = {
    name: null,
    level: null,
    parent: null
  };

  $scope.saving = false;

  $scope.$watch('division.level', function(level) {

    if (level !== 2 && level !== 3) {
      // This division has no parent
      $scope.parentDivisions = null;
      return;
    }

    DivisionsService.findDivisions({level: level - 1}, function(res) {
      $scope.parentDivisions = res.divisions;
    }, function(err) {
      $log.error(err);
    });
  });

  $scope.saveDivision = function() {

    if ($scope.divisionForm && $scope.divisionForm.$invalid) {
      // Invalid form - don't save the division
      return;
    }

    $scope.saving = true;

    if ($routeParams.id) {
      var division = angular.extend({id: +$routeParams.id}, $scope.division);
      DivisionsService.updateDivision(division, onSaveSuccess, onSaveError);
    } else {
      DivisionsService.createDivision($scope.division, onSaveSuccess, onSaveError);
    }
  };

  $scope.cancel = function() {
    $location.path('/divisions');
  };

  init();
});
