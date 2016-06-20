'use strict';

angular.module('bsis')
  .factory('LabellingService', function($http, Api) {
    return {
      getComponents: function(query, response) {
        var components = Api.Labelling.getComponents(query, function() {
          response(components);
        }, function() {
          response(false);
        });
      },
      printPackLabel: function(componentId, response) {
        var label = Api.Labelling.printPackLabel({componentId: componentId}, function() {
          response(label);

          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:attachment/zpl,' + encodeURI(label.labelZPL);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'label.zpl';
          hiddenElement.click();

        }, function() {
          response(false);
        });
      },
      printDiscardLabel: function(componentId, response) {
        var label = Api.Labelling.printDiscardLabel({componentId: componentId}, function() {
          response(label);

          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:attachment/zpl,' + encodeURI(label.labelZPL);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'label.zpl';
          hiddenElement.click();

        }, function() {
          response(false);
        });
      }

    };
  });
