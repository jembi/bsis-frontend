'use strict';

angular.module('bsis').controller('DataExportCtrl', function($scope, $log, ModalsService, DataExportService) {

  $scope.downloading = false;

  function downloadFile() {
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
  }


  $scope.download = function() {
    var unprocessConfirmation = {
      title: 'Data Export',
      button: 'Export Data',
      message: 'Are you sure that you want to export all data? This export may take some time and can affect the performance of the system.' +
      'It is recommended that this process is only run after standard operating hours, to minimise impact on other activities.'
    };

    ModalsService.showConfirmation(unprocessConfirmation).then(function() {
      $scope.downloading = true;
      downloadFile();
    }).catch(function() {
      // Confirmation was rejected
      $scope.downloading = false;
    });
  };

});
