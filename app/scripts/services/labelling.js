'use strict';

angular.module('bsis')
  .factory('LabellingService', function($http, Api) {
    return {
      getComponentForm: Api.Labelling.getComponentForm,
      getComponents: Api.Labelling.getComponents,
      verifyPackLabel: function(verificationParams, onSuccess, onError) {
        Api.Labelling.verifyPackLabel(verificationParams, function(res) {
          onSuccess(res);
        }, function(err) {
          onError(err.data);
        });
      },
      printPackLabel: function(componentId, onSuccess, onError) {
        Api.Labelling.printPackLabel({componentId: componentId}, function(label) {
          onSuccess(label);
          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:attachment/zpl,' + encodeURI(label.labelZPL);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'label.zpl';
          hiddenElement.click();
        }, function(err) {
          onError(err.data);
        });
      },

      printDiscardLabel: function(componentId, onSuccess, onError) {
        Api.Labelling.printDiscardLabel({componentId: componentId}, function(label) {
          onSuccess(label);
          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:attachment/zpl,' + encodeURI(label.labelZPL);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'label.zpl';
          hiddenElement.click();
        }, function(err) {
          onError(err.data);
        });
      }
    };
  }
);
