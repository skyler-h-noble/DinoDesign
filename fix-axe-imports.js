#!/usr/bin/env node
/**
 * fix-axe-imports.js
 * Simple string replacement to fix broken axe imports.
 * 
 * Run: node fix-axe-imports.js
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'src/components');
const AXE_LINE = "import { axe } from 'jest-axe';";

let fixed = 0;
let skipped = 0;

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check for the broken pattern: axe import on the line after "import {"
  // Pattern: "import {\nimport { axe } from 'jest-axe';\n"
  const brokenPattern = "import {\n" + AXE_LINE + "\n";
  
  if (!content.includes(brokenPattern)) {
    return false; // Not broken
  }

  // Step 1: Remove axe import from inside the block
  content = content.replace(brokenPattern, "import {\n");

  // Step 2: Find the last "} from './Something';" line
  const lines = content.split('\n');
  let lastFromLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('} from \'./') || lines[i].trim().startsWith('} from "./')) {
      lastFromLine = i;
    }
  }

  // Step 3: Insert axe import after the last "} from" line
  if (lastFromLine >= 0) {
    lines.splice(lastFromLine + 1, 0, AXE_LINE);
  } else {
    // Fallback: put after last regular import
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') && lines[i].includes(' from ')) {
        lastImport = i;
      }
    }
    lines.splice(lastImport + 1, 0, AXE_LINE);
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  return true;
}

// Process all component test files
const components = fs.readdirSync(COMPONENTS_DIR).filter(name => {
  try { return fs.statSync(path.join(COMPONENTS_DIR, name)).isDirectory(); }
  catch { return false; }
});

components.forEach(componentName => {
  const testFile = path.join(COMPONENTS_DIR, componentName, `${componentName}.test.js`);
  if (!fs.existsSync(testFile)) return;
  
  if (fixFile(testFile)) {
    console.log(`✅ Fixed ${componentName}`);
    fixed++;
  } else {
    skipped++;
  }
});

// Also check App.test.js
const appTest = path.join(__dirname, 'src/App.test.js');
if (fs.existsSync(appTest) && fixFile(appTest)) {
  console.log('✅ Fixed App.test.js');
  fixed++;
}

console.log(`\n📊 Fixed: ${fixed} | Already OK: ${skipped}`);
console.log('Now run: npm test -- --watchAll=false');