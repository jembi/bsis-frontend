'use strict';

angular.module('bsis').controller('DataExportCtrl', function($scope, $log, DataExportService) {

  $scope.downloading = false;

  $scope.download = function() {
    $scope.downloading = true;
    DataExportService.getDataExport(function(response) {
      var fileName = 'dataexport' + moment(new Date()).format('YYYYMMDDHHmm') + '.zip';

      var hiddenElement = document.createElement('a');
      var blob = new Blob([response.data], {type: 'application/octet-stream'});
      hiddenElement.href = URL.createObjectURL(blob);
      hiddenElement.target = '_blank';
      hiddenElement.download = fileName;
      hiddenElement.click();

      $scope.downloading = false;

    }, function(err) {
      $log.error(err);
      if (err.userMessage) {
        $scope.error = {
          message: err.userMessage
        };
      }
      $scope.downloading = false;
    });
  };
});
