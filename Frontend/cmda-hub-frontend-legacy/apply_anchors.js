const fs = require("fs");
const path = require("path");

const filePath =
  "c:\\Users\\Dhruv\\Desktop\\CMDAHUB-Beta\\cmda-hub-frontend-legacy\\src\\components\\EquityHub\\CandlePatterns\\ChartAnnotations.jsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Add drawAnchor helper
const drawAnchorHelper = `
      const drawAnchor = (x, y) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#2962FF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      };
`;

const markerLine = "      // Define local helpers if not already defined";
if (content.includes(markerLine)) {
  content = content.replace(markerLine, drawAnchorHelper + "\n" + markerLine);
  console.log("Inserted drawAnchor helper.");
} else {
  console.error("Marker line not found for drawAnchor.");
}

// 2. Add anchor rendering logic
const anchorLogic = `
        // Draw selection anchors
        if (d.id === selectedDrawingID) {
          const isPointLike = (val) =>
            val && typeof val === "object" && typeof val.price === "number";

          if (["path", "brush"].includes(d.type)) {
            (d.points || []).forEach((p) => {
              const c = getCoords(p);
              if (c) drawAnchor(c.x + bounds.left, c.y);
            });
          } else {
            Object.keys(d).forEach((key) => {
              if (isPointLike(d[key])) {
                const c = getCoords(d[key]);
                if (c) drawAnchor(c.x + bounds.left, c.y);
              }
            });
          }
        }
`;

// Find the end of drawings.forEach loop
// We'll search for the last fallback line and the closing braces
const loopEndMarker =
  '            drawLine(\n              ctx,\n              offsetStart,\n              offsetEnd,\n              d.color || color || "#607D8B",\n            );\n          }\n        }\n      });';

if (content.includes(loopEndMarker)) {
  const replacement = loopEndMarker.replace(
    "        }\n      });",
    anchorLogic + "        }\n      });",
  );
  content = content.replace(loopEndMarker, replacement);
  console.log("Inserted anchor rendering logic.");
} else {
  console.error("Loop end marker not found.");
  // Alternative approach: find by line 7133 vicinity
  const altMarker = "          }\n        }\n      });";
  // This might be risky if there are multiple occurrences, but let's check
  if (content.split(altMarker).length === 2) {
    content = content.replace(altMarker, anchorLogic + altMarker);
    console.log("Inserted anchor rendering logic (alt).");
  } else {
    console.error("Alt marker not found or ambiguous.");
  }
}

fs.writeFileSync(filePath, content);
console.log("File updated successfully.");
