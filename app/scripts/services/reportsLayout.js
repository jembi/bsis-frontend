'use strict';

angular.module('bsis').factory('ReportsLayoutService', function($filter) {
  return {
    generatePdfPageHeader: function(headerText) {
      return {text: headerText, fontSize: 11, bold: true, marginTop: 10, alignment: 'center'};
    },
    generateTwoLinesPdfPageHeader: function(headerTextLine1, headerTextLine2) {
      return [{text: headerTextLine1, fontSize: 11, bold: true, marginTop: 10, alignment: 'center'},
        {text: headerTextLine2, fontSize: 9, style: {alignment: 'center'}}];
    },
    generatePdfPageFooter: function(recordsName, totalRecords, currentPage, pageCount) {
      var columns = [
        {text: 'Total ' + recordsName + ': ' + totalRecords, width: 'auto'},
        {text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'},
        {text: 'Page ' + currentPage + ' of ' + pageCount, style: {alignment: 'right'}}
      ];
      return {
        columns: columns,
        columnGap: 10,
        margin: [30, 0]
      };
    },

    pdfTableHeaderStyle: {fontSize: 8, bold: true, margin: [-2, 0, 0, 0]},
    pdfTableBodyBoldStyle: {fontSize: 8, bold: true},
    pdfTableBodyGreyBoldStyle: {fillColor: 'lightgrey', fontSize: 8, bold: true},
    pdfDefaultStyle: {fontSize: 8, margin: [-2, 0, 0, 0]},

    paginatePdf: function(rowsPerPage, docDefinition) {
      // split the table into pages with breaks
      var header = docDefinition.content[0].table.body.splice(0, 1);
      var table = docDefinition.content[0].table.body;
      var contentTemplate = docDefinition.content[0];
      docDefinition.content = [];
      do {
        var newRows = (table.length > rowsPerPage) ? rowsPerPage : table.length;
        var newTable = angular.copy(header).concat(table.splice(0, newRows));
        var newContent = angular.copy(contentTemplate);
        newContent.table.body = newTable;
        if (table.length > 0) {
          newContent.pageBreak = 'after';
        }
        docDefinition.content.push(newContent);
      } while (table.length > 0);

      return docDefinition;
    }
  };

});