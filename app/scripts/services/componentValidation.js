'use strict';

angular.module('bsis')
	.factory('ComponentValidationService', function(ModalsService, $q) {
  return {
    showChildComponentWeightConfirmation: function(parent, child) {
      // Show confirmation if child weight is greater than parent weight
      if (child.weight > parent.weight) {
        return ModalsService.showConfirmation({
          title: 'Overweight Pack',
          button: 'Continue',
          message: 'Component weight exceeds weight of parent component - please re-enter'
        });
      }

      // Continue with recording weight
      return $q.resolve();
    }
  };
});
