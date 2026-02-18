const fs = require("fs");
const path =
  "c:/Users/Dhruv/Desktop/CMDAHUB-Beta/cmda-hub-frontend-legacy/src/components/EquityHub/CandlePatterns/ChartAnnotations.jsx";
let content = fs.readFileSync(path, "utf8");

// Update drawing logic defaults
content = content.replace(
  /showFibTargets !== false/g,
  "showFibTargets === true",
);

// Update initial settings defaults
content = content.replace(/showFibTargets: true/g, "showFibTargets: false");

fs.writeFileSync(path, content, "utf8");
console.log("Elliott Wave settings updated.");
