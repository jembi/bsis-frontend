'use strict';

angular.module('bsis').controller('ManageTransfusionReactionTypeCtrl', function($scope, $location, $log, $timeout, $routeParams, TransfusionReactionTypesService) {

  $scope.transfusionReactionType = {
    isDeleted: false,
    name: '',
    description: ''
  };

  $scope.cancel = function() {
    $location.path('/transfusionReactionTypes');
  };

  $scope.$watch('transfusionReactionType.name', function() {
    $timeout(function() {
      $scope.transfusionReactionTypeForm.name.$setValidity('duplicate', true);
    });
  });

  $scope.saveTransfusionReactionType = function() {

    if ($scope.transfusionReactionTypeForm.$invalid) {
      return;
    }

    $scope.savingTransfusionReactionType = true;
    TransfusionReactionTypesService.createTransfusionReactionType($scope.transfusionReactionType, function() {
      $location.path('/transfusionReactionTypes');
    }, function(err) {
      if (err && err.name) {
        $scope.transfusionReactionTypeForm.name.$setValidity('duplicate', false);
      }
      $scope.savingTransfusionReactionType = false;
    });
  };
});
