'use strict';

angular.module('bsis').controller('DiscardComponentsModalCtrl', function($scope, $uibModalInstance, $log, componentIds, returnFormId, ComponentService) {

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
    // Fixme: when there are errors in the form, the modal is dismissed but the viewReturn page doesn't load properly
    $uibModalInstance.dismiss();
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

    ComponentService.bulkDiscard({}, bulkDiscardForm, function() {
      $scope.discardingComponent = false;
      $uibModalInstance.close();
    }, function(err) {
      $log.error(err);
      $scope.discardingComponent = false;
    });
  };

  init();

});