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

  $scope.$watch('transfusionReactionTypes.name', function() {
    $timeout(function() {
      $scope.transfusionReactionTypesForm.name.$setValidity('duplicate', true);
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
      if (err.data && err.data.name) {
        $scope.transfusionReactionTypeForm.name.$setValidity('duplicate', false);
      }
      $scope.savingTransfusionReactionType = false;
    });
  };

  function initExistingTransfusionReactionType() {
    TransfusionReactionTypesService.getTransfusionReactionTypeById({id: $routeParams.id}, function(response) {
      $scope.transfusionReactionType = response.transfusionReactionType;
    });
  }

  function init() {
    if ($routeParams.id) {
      initExistingTransfusionReactionType();
    }
  }

  init();

});
