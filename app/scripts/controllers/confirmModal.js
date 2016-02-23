'use strict';

angular.module('bsis')
  .controller('ConfirmModalCtrl', function($scope, $modalInstance, $sce, confirmObject) {

    $scope.confirmObject = confirmObject;

    $scope.confirmed = function() {
      $modalInstance.close();
    };

    $scope.cancelled = function() {
      $modalInstance.dismiss('cancel');
    };

    //No user input data should be shown using this function as this is unsafe
    $scope.renderHtml = function(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

  });