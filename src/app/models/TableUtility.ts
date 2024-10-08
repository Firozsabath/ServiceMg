import * as XLSX from "xlsx";

const getFileName = (name: string) => {
    let timeSpan = new Date().toISOString();
    let sheetName = name || "ExportResult";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
      sheetName,
      fileName
    };
  };
export class TableUtility{
    static exportTableToExcel(tableId: string, name?: string) {
        let { sheetName, fileName } = getFileName(name);
        let targetTableElm = document.getElementById(tableId);
        let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
          sheet: sheetName
        });
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      }
}