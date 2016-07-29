'use strict';

angular.module('bsis').controller('ManageComponentTypeCtrl', function($scope, $location, $log, $timeout, $routeParams, ComponentTypesService) {

  $scope.componentType = {isDeleted: false};
  $scope.componentTypeForm = {};

  $scope.$watch('componentType.componentTypeCode', function() {
    $timeout(function() {
      $scope.componentTypeForm.componentTypeCode.$setValidity('duplicate', true);
    });
  });

  $scope.cancel = function() {
    $location.path('/componentTypes');
  };

  $scope.saveComponentType = function() {
    if ($scope.componentTypeForm.$invalid) {
      return;
    }

    $scope.savingComponentType = true;
    ComponentTypesService.updateComponentType($scope.componentType, function() {
      $location.path('/componentTypes');
    }, function(response) {
      if (response.data && response.data.componentTypeCode) {
        $scope.componentTypeForm.componentTypeCode.$setValidity('duplicate', false);
      }
      $scope.savingComponentType = false;
    });
  };

  function init() {
    ComponentTypesService.getComponentTypeById({id: $routeParams.id}, function(response) {
      $scope.componentType = response.componentType;
    }, $log.error);
  }

  init();

});
