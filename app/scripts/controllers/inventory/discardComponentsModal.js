'use strict';

angular.module('bsis').controller('DiscardComponentsModalCtrl', function($scope, $location, $uibModalInstance, $log, componentIds, returnFormId, ComponentService) {

  $scope.discard = {};
  $scope.discardReasons = [];
  $scope.discardingComponent = false;
  var bulkDiscardForm = {};

  function init() {
    ComponentService.getDiscardForm(function(response) {
      $scope.discardReasons = response.discardReasons;
      bulkDiscardForm = response.discardComponentsForm;
    }, $log.error);
  }

  $scope.close = function() {
    $uibModalInstance.close();
  };

  $scope.discardComponents = function() {
    if ($scope.discardComponentsForm.$invalid) {
      return;
    }
    $scope.discardingComponent = true;

    // Populate bulkDiscardForm
    bulkDiscardForm.componentIds = componentIds;
    bulkDiscardForm.discardReason = $scope.discard.discardReason;
    bulkDiscardForm.discardReasonText = $scope.discard.discardReasonText;

    ComponentService.bulkDiscard({}, bulkDiscardForm, function(response) {
      $scope.discardingComponent = false; 
      console.info(response.success);
    }, function(err) {
      $log.error(err);
      $scope.discardingComponent = false;
    });

    $uibModalInstance.close();
  };

  init();

});