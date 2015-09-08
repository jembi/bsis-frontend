'use strict';

angular.module('bsis').controller('EditAdverseEventTypeCtrl', function($scope, $location, $routeParams, AdverseEventsService) {

  $scope.adverseEventType = {
    id: $routeParams.id,
    name: '',
    description: '',
    isDeleted: false
  };

  AdverseEventsService.getAdverseEventTypeById($routeParams.id, function(adverseEventType) {
    $scope.adverseEventType = adverseEventType;
  }, function(err) {
    console.error(err);
  });

  $scope.saveAdverseEventType = function() {
    var adverseEventType = {
      id: $scope.adverseEventType.id,
      name: $scope.adverseEventType.name,
      description: $scope.adverseEventType.description,
      isDeleted: $scope.adverseEventType.isDeleted
    };
    AdverseEventsService.updateAdverseEventType(adverseEventType, function() {
      $location.path('/adverseEventTypes');
    }, function(err) {
      console.error(err);
    });
  };
});
