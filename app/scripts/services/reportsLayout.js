'use strict';

angular.module('bsis').factory('ReportsLayoutService', function($filter) {
  return {
    generatePdfPageHeader: function(headerTextLine1, headerTextLine2) {
      var header = [{text: headerTextLine1, fontSize: 11, bold: true, marginTop: 10, alignment: 'center'}];
      if (headerTextLine2) {
        header.push({text: headerTextLine2, fontSize: 9, alignment: 'center'});
      }
      return header;
    },
    generatePdfPageFooter: function(recordsName, totalRecords, currentPage, pageCount) {
      var columns = [];
      if (recordsName) {
        columns.push({text: 'Total ' + recordsName + ': ' + totalRecords, width: 'auto'});
      }
      columns.push({text: 'Date generated: ' + $filter('bsisDateTime')(new Date()), width: 'auto'});
      if (currentPage) {
        columns.push({text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'right'});
      }
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
    pdfPortraitMaxGridWidth: 450,
    pdfLandscapeMaxGridWidth: 650,

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
    },
    highlightTotalRows: function(columnText, columnTextIndex, docDefinition) {
      // set the cell style of each column in the row containing all/total data
      docDefinition.styles.greyBoldCell = this.pdfTableBodyGreyBoldStyle;
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[columnTextIndex] === columnText) {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'greyBoldCell'};
          });
        }
      });

      return docDefinition;
    },
    highlightPercentageRows: function(columnText, columnTextIndex, docDefinition) {
      // set the cell style of each column in the row containing percentage data
      docDefinition.styles.boldCell = this.pdfTableBodyBoldStyle;
      angular.forEach(docDefinition.content[0].table.body, function(row) {
        if (row[columnTextIndex] === columnText) {
          angular.forEach(row, function(cell, index) {
            row[index] = { text: '' + cell, style: 'boldCell'};
          });
        }
      });

      return docDefinition;
    }

  };

});