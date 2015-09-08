'use strict';

angular.module('bsis').controller('AddAdverseEventTypeCtrl', function($scope, $location, AdverseEventsService) {

  $scope.adverseEventType = {
    name: '',
    description: '',
    isDeleted: false
  };

  $scope.saveAdverseEventType = function(form) {
    if (form.$invalid) {
      return;
    }

    var adverseEventType = {
      name: $scope.adverseEventType.name,
      description: $scope.adverseEventType.description,
      isDeleted: $scope.adverseEventType.isDeleted
    };
    AdverseEventsService.createAdverseEventType(adverseEventType, function() {
      $location.path('/adverseEventTypes');
    }, function(err) {
      console.error(err);
    });
  };
});
