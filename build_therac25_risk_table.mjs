import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const risks = [
  [
    1,
    "Zixuan Liang",
    "Unsafe radiation overdose from software-controlled mode mismatch",
    "Therac-25 could deliver a high-energy beam in an unsafe configuration when software state and physical machine setup diverged, exposing a patient to a catastrophic overdose.",
    5,
    "The condition occurred repeatedly across installed machines once the rapid-edit sequence was reproduced; the design relied heavily on software with insufficient independent verification.",
    5,
    "Patient consequence could be death or severe radiation injury, making the impact maximal.",
    "5x5",
    25,
    "Top risk because it directly connects software failure to patient harm.",
  ],
  [
    2,
    "Zixuan Liang",
    "Removal or absence of independent hardware interlocks",
    "Therac-25 depended more on software than predecessor machines and did not duplicate all prior hardware safety mechanisms that could block unsafe beam delivery.",
    4,
    "The architectural decision affected the product line by design rather than being a rare field defect.",
    5,
    "Without independent barriers, one software defect can become a fatal treatment event.",
    "4x5",
    20,
    "Architectural safety risk; mitigation requires defense in depth.",
  ],
  [
    3,
    "Zixuan Liang",
    "Inadequate software testing and hazard analysis",
    "Software risk analysis apparently excluded software design faults, and evidence suggests testing relied heavily on system use rather than rigorous unit, concurrency, stress, and hazard-driven tests.",
    4,
    "The process weaknesses were systemic and existed before deployment.",
    5,
    "Unfound defects in safety-critical control software can lead directly to injury or death.",
    "4x5",
    20,
    "Process risk that enabled multiple technical failures to escape.",
  ],
  [
    4,
    "Zixuan Liang",
    "Cryptic operator feedback and unsafe recovery behavior",
    "Messages such as Malfunction 54 did not clearly communicate overdose danger, and the system allowed treatment to be resumed after severe malfunctions.",
    4,
    "Operators saw frequent malfunctions and could normalize alarms; unclear messages were part of routine operation.",
    4,
    "Poor feedback can cause operators to continue unsafe treatment and delay escalation.",
    "4x4",
    16,
    "Human factors risk; interface clarity is part of safety.",
  ],
  [
    5,
    "Zixuan Liang",
    "Weak incident reporting, audit trails, and corrective action",
    "Early accidents were not immediately connected, and the system lacked sufficient logs and transparent reporting channels to reconstruct faults and warn all users quickly.",
    3,
    "Major incidents are less frequent than daily operation failures, but organizational response weaknesses appeared repeatedly.",
    5,
    "Delayed recognition can expose additional patients to the same hazard across multiple sites.",
    "3x5",
    15,
    "Lifecycle SQA risk; fixes must include reporting and field safety communication.",
  ],
];

const input = await FileBlob.load("Therac25_Risk_Table_Template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Sheet1");

sheet.getRange("A1:K1").values = [[
  "Risk number",
  "Risk Assigned to (Name of the Group member)",
  "Risk title",
  "Risk description",
  "Likelihood Score",
  "Likelihood Score justification",
  "Impact Score",
  "Impact Score justification",
  "Risk value",
  "Risk Score/rank (impact * Likelihood)",
  "General Notes / Review comments",
]];
sheet.getRange("A2:K21").clear({ applyTo: "contents" });
sheet.getRange("A2:K6").values = risks;

sheet.getRange("J2").formulas = [["=E2*G2"]];
sheet.getRange("J2:J6").fillDown();
sheet.getRange("I2").formulas = [['=E2&"x"&G2']];
sheet.getRange("I2:I6").fillDown();

sheet.getRange("A1:K1").format.font = { bold: true, color: "#000000" };
sheet.getRange("A1:K1").format.fill = { color: "#E7EEF7" };
sheet.getRange("A1:K6").format.wrapText = true;
sheet.getRange("A1:K6").format.verticalAlignment = "Top";
sheet.getRange("A1:K6").format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
sheet.getRange("A2:A21").format.horizontalAlignment = "Center";
sheet.getRange("E2:E21").format.horizontalAlignment = "Center";
sheet.getRange("G2:G21").format.horizontalAlignment = "Center";
sheet.getRange("I2:J21").format.horizontalAlignment = "Center";
sheet.getRange("A1").format.columnWidthPx = 70;
sheet.getRange("B1").format.columnWidthPx = 160;
sheet.getRange("C1").format.columnWidthPx = 220;
sheet.getRange("D1").format.columnWidthPx = 340;
sheet.getRange("E1").format.columnWidthPx = 90;
sheet.getRange("F1").format.columnWidthPx = 340;
sheet.getRange("G1").format.columnWidthPx = 80;
sheet.getRange("H1").format.columnWidthPx = 300;
sheet.getRange("I1").format.columnWidthPx = 90;
sheet.getRange("J1").format.columnWidthPx = 110;
sheet.getRange("K1").format.columnWidthPx = 260;
sheet.getRange("A2:K6").format.rowHeightPx = 96;
sheet.getRange("A1:K1").format.rowHeightPx = 42;
sheet.freezePanes.freezeRows(1);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({ sheetName: "Sheet1", range: "A1:K6", scale: 1.2, format: "png" });
await fs.writeFile("Therac25_Risk_Table_preview.png", new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save("Therac25_Risk_Table_Zixuan_Liang.xlsx");
