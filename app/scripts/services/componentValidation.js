'use strict';

angular.module('bsis')
	.factory('ComponentValidationService', function(ModalsService, $q) {
  return {
    showChildComponentWeightConfirmation: function(parent, totalChildrenWeight) {
      // Show confirmation if total child weight is greater than parent weight
      if (totalChildrenWeight > parent.weight) {
        return ModalsService.showConfirmation({
          title: 'Overweight Child Packs',
          button: 'Continue',
          message: 'Combined weight of components exceeds weight of parent component. Do you want to continue?'
        });
      }

      // Continue with recording weight
      return $q.resolve();
    }
  };
});
