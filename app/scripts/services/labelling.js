'use strict';

angular.module('bsis')
  .factory('LabellingService', function($http, Api) {
    return {
      checkLabellingStatus: function(query, response) {
        var status = Api.LabellingStatus.get(query, function() {
          response(status);
        }, function() {
          response(false);
        });
      },
      printPackLabel: function(componentId, response) {
        var label = Api.PrintPackLabel.get({componentId: componentId}, function() {
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
        var label = Api.PrintDiscardLabel.get({componentId: componentId}, function() {
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
