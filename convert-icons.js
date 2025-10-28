import fs from "fs";
import path from "path";

const inputDir = "./public/icons"; // folder where your .svg files live
const outputDir = "./src/icons"; // folder where you want .tsx components

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const file of fs.readdirSync(inputDir)) {
  if (!file.endsWith(".svg")) continue;

  let svg = fs.readFileSync(path.join(inputDir, file), "utf-8");
  const componentName = file
    .replace(/\.svg$/, "")
    .replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase()) + "Icon";

  // Remove hardcoded width and height
  svg = svg.replace(/\s(width|height)="[^"]*"/g, "");

  // For stroke-based icons, set fill to none, otherwise currentColor
  if (svg.includes('stroke=')) {
    svg = svg.replace(/fill="[^"]*"/g, 'fill="none"');
  } else {
    svg = svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  }

  // Replace stroke colors with currentColor
  svg = svg.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');

  // Add props spread and proper formatting
  svg = svg.replace("<svg", "<svg\n      {...props}");

  const tsx = `
import * as React from "react";

export default function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${svg.trim()}
  );
}
`;

  fs.writeFileSync(path.join(outputDir, `${componentName}.tsx`), tsx.trim());
}

console.log("✅ All SVGs converted to React components!");
