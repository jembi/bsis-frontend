'use strict';

angular.module('bsis').controller('ViewComponentBatchCtrl', function($scope, $routeParams, $filter, $log, ComponentBatchService) {

  $scope.gridOptions = {
    columnDefs: [
      {
        displayName: 'DIN',
        name: 'donationIdentificationNumber'
      }, {
        displayName: 'Pack Type',
        name: 'packType.packType'
      }
    ],

    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'A4',
    exporterPdfDefaultStyle: {fontSize: 4, margin: [-2, 0, 0, 0] },
    exporterPdfTableHeaderStyle: {fontSize: 5, bold: true, margin: [-2, 0, 0, 0] },
    exporterPdfMaxGridWidth: 400,

    // PDF header
    exporterPdfHeader: function() {
      var finalArray = [
        {
          text: 'Delivery Note',
          fontSize: 10,
          bold: true,
          margin: [30, 20, 0, 0] // [left, top, right, bottom]
        }
      ];
      return finalArray;
    },

    exporterPdfTableStyle: {margin: [-10, 10, 0, 0]},

    exporterPdfCustomFormatter: function(docDefinition) {
      var prefix = [];
      prefix.push(
        {
          text: 'Date Created: ',
          bold: true
        }, {
          text: $filter('bsisDate')($scope.componentBatch.donationBatch.createdDate)
        }, {
          text: ' Venue: ',
          bold: true
        }, {
          text: $scope.componentBatch.donationBatch.venue.name
        }, {
          text: ' Number of Donations: ',
          bold: true
        }, {
          text: '' + $scope.componentBatch.donationBatch.numDonations
        }, {
          text: ' Status: ',
          bold: true
        }, {
          text: ($scope.componentBatch.donationBatch.isClosed ? 'CLOSED' : 'OPEN') + '\n'
        }
      );
      prefix.push(
        {
          text: 'Time of Delivery: ',
          bold: true
        }, {
          text: $filter('bsisDateTime')($scope.componentBatch.deliveryDate)
        }, {
          text: ' Location: ',
          bold: true
        }, {
          text: $scope.componentBatch.location.name
        }, {
          text: ' Number of Blood Transport Boxes: ',
          bold: true
        }, {
          text: '' + $scope.componentBatch.bloodTransportBoxes.length + '\n'
        }
      );
      angular.forEach($scope.componentBatch.bloodTransportBoxes, function(box) {
        prefix.push(
          {
            text: 'Blood Transport Box Temperature: ',
            bold: true
          }, {
            text: box.temperature + '\u00B0C\n'
          }
        );
      });

      docDefinition.content = [{text: prefix, margin: [-10, 0, 0, 0], fontSize: 7}].concat(docDefinition.content);
      return docDefinition;
    },

    // PDF footer
    exporterPdfFooter: function(currentPage, pageCount) {
      var columns = [
        {text: 'Number of components: ' + $scope.gridOptions.data.length, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0],
        fontSize: 6
      };
    },

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
    }

  };

  $scope.componentBatch = null;

  $scope.printDeliveryNote = function() {
    $scope.gridApi.exporter.pdfExport('all', 'all');
  };

  function fetchComponentBatchById(componentBatchId) {
    ComponentBatchService.getComponentBatch(componentBatchId, function(response) {
      $scope.componentBatch = response;
      $scope.components = null;
      angular.forEach($scope.componentBatch.components, function(component) {
        if (!component.isInitialComponent) {
          $scope.components = $scope.componentBatch.components.splice(component, 1);
        }
      });
      $scope.gridOptions.data = $scope.components;
    }, function(err) {
      $log.error(err);
    });
  }

  fetchComponentBatchById($routeParams.id);
});
