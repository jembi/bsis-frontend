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

    if ($routeParams.id) {
      $log.debug('Not implemented yet');
      $scope.savingTransfusionReactionType = false;
    } else {
      TransfusionReactionTypesService.createTransfusionReactionType($scope.transfusionReactionType, function() {
        $location.path('/transfusionReactionTypes');
      }, function(err) {
        if (err.data && err.data.name) {
          $scope.transfusionReactionTypeForm.name.$setValidity('duplicate', false);
        }
        $scope.savingTransfusionReactionType = false;
      });
    }
  };

  function init() {
    if ($routeParams.id) {
      TransfusionReactionTypesService.getTransfusionReactionTypeById({id: $routeParams.id}, function(response) {
        $scope.transfusionReactionType = response.transfusionReactionType;
      }, $log.error);
    }
  }

  init();
});
