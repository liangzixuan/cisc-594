import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("Therac25_Risk_Table_Template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);

console.log("Sheets:");
for (const sheet of workbook.worksheets) {
  console.log(`- ${sheet.name}`);
}

const inspection = await workbook.inspect({
  kind: "table",
  range: "Sheet1!A1:K30",
  include: "values,formulas,formats",
  tableMaxRows: 30,
  tableMaxCols: 11,
});
console.log(inspection.ndjson);
