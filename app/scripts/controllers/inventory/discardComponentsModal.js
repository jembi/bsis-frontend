'use strict';

angular.module('bsis').controller('DiscardComponentsModalCtrl', function($scope, $uibModalInstance, $log, returnFormId, ComponentService) {

  $scope.returnFormId = returnFormId;
  $scope.discard = {};
  $scope.discardReasons = [];
  $scope.discardingComponent = false;

  function init() {
    ComponentService.getDiscardForm(function(response) {
      $scope.discardReasons = response.discardReasons;
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
    // FIXME: do the discard
    $log.info('Not yet implemented');
    $scope.discardingComponent = false;
  };

  init();

});