#!/usr/bin/env node
/**
 * add-axe-tests.js
 *
 * Does two things in one pass:
 *   1. FIXES any broken jest-axe imports that landed inside multi-line
 *      import blocks from a previous run
 *   2. ADDS jest-axe accessibility test blocks to components that don't
 *      have them yet
 *
 * Safe to run multiple times — skips files that are already correct.
 *
 * Run from your project root:
 *   node add-axe-tests.js
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'src/components');
const AXE_IMPORT = "import { axe } from 'jest-axe';";

// ─── Render configs per component ────────────────────────────────────────────

const COMPONENT_RENDERS = {
  Accordion:         { render: `<AccordionGroup><Accordion><AccordionSummary>Title</AccordionSummary><AccordionDetails>Content</AccordionDetails></Accordion></AccordionGroup>` },
  Alert:             { render: `<Alert>Test alert message</Alert>` },
  AppBar:            { render: `<AppBar />` },
  Autocomplete:      { render: `<Autocomplete aria-label="test" options={[]} />` },
  Avatar:            { render: `<Avatar alt="Test User" />` },
  Backdrop:          { render: `<Backdrop open={false} />` },
  Badge:             { render: `<Badge badgeContent={4}><span>Item</span></Badge>` },
  BottomNavigation:  { render: `<BottomNavigation />` },
  Box:               { render: `<Box>Content</Box>` },
  Breadcrumbs:       { render: `<Breadcrumbs><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Page</BreadcrumbItem></Breadcrumbs>` },
  Button:            { render: `<Button variant="primary">Click me</Button>` },
  ButtonGroup:       { render: `<ButtonGroup><button>One</button><button>Two</button></ButtonGroup>` },
  ButtonIcon:        { render: `<ButtonIcon aria-label="Add item">+</ButtonIcon>` },
  Card:              { render: `<Card>Card content</Card>` },
  Checkbox:          { render: `<Checkbox aria-label="Accept terms" />` },
  Chip:              { render: `<Chip label="Test chip" />` },
  CircularProgress:  { render: `<CircularProgress aria-label="Loading" />` },
  Container:         { render: `<Container><p>Content</p></Container>` },
  Dialog:            { render: `<Dialog open={false} aria-labelledby="dialog-title"><div id="dialog-title">Title</div></Dialog>` },
  Divider:           { render: `<Divider />` },
  Drawer:            { render: `<Drawer open={false} aria-label="Navigation drawer"><p>Content</p></Drawer>` },
  Fab:               { render: `<Fab aria-label="Add">+</Fab>` },
  Footer:            { render: `<Footer />` },
  Grid:              { render: `<Grid><div>Item</div></Grid>` },
  Icon:              { render: `<Icon aria-hidden="true" />` },
  Input:             { render: `<Input aria-label="Test input" />` },
  LinearProgress:    { render: `<LinearProgress aria-label="Loading" />` },
  Link:              { render: `<Link href="#">Test link</Link>` },
  List:              { render: `<List><li>Item one</li><li>Item two</li></List>` },
  Loader:            { render: `<Loader aria-label="Loading" />` },
  Menu:              { render: `<Menu open={false}><MenuItem>Item</MenuItem></Menu>` },
  Modal:             { render: `<Modal open={false} aria-labelledby="modal-title"><div id="modal-title">Title</div></Modal>` },
  NumberField:       { render: `<NumberField aria-label="Quantity" />` },
  Pagination:        { render: `<Pagination count={5} aria-label="Pagination" />` },
  Paper:             { render: `<Paper>Content</Paper>` },
  Radio:             { render: `<Radio aria-label="Option one" value="one" />` },
  Rail:              { render: `<Rail />` },
  Rating:            { render: `<Rating aria-label="Rating" value={3} />` },
  SearchField:       { render: `<SearchField aria-label="Search" />` },
  Select:            { render: `<Select aria-label="Select option"><option value="1">Option 1</option></Select>` },
  Sheet:             { render: `<Sheet>Content</Sheet>` },
  Sidebar:           { render: `<Sidebar />` },
  Skeleton:          { render: `<Skeleton aria-label="Loading placeholder" />` },
  Slider:            { render: `<Slider aria-label="Volume" defaultValue={50} />` },
  Snackbar:          { render: `<Snackbar open={false} message="Test message" />` },
  SpeedDial:         { render: `<SpeedDial open={false} ariaLabel="Speed dial actions" icon={<span>+</span>} />` },
  Stack:             { render: `<Stack><div>Item one</div><div>Item two</div></Stack>` },
  Stepper:           { render: `<Stepper activeStep={0}><Step label="Step 1" /><Step label="Step 2" /></Stepper>` },
  Switch:            { render: `<Switch aria-label="Toggle feature" />` },
  Table:             { render: `<Table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></Table>` },
  Tabs:              { render: `<Tabs defaultValue={0}><TabList><Tab>Tab 1</Tab><Tab>Tab 2</Tab></TabList><TabPanel value={0}>Panel 1</TabPanel><TabPanel value={1}>Panel 2</TabPanel></Tabs>` },
  TextField:         { render: `<TextField aria-label="Text field" />` },
  ToggleButton:      { render: `<ToggleButton value="bold" aria-label="Bold">B</ToggleButton>` },
  ToggleButtonGroup: { render: `<ToggleButtonGroup aria-label="Text formatting"><button value="bold">Bold</button></ToggleButtonGroup>` },
  Toolbar:           { render: `<Toolbar />` },
  Tooltip:           { render: `<Tooltip title="Helpful tip"><button>Hover me</button></Tooltip>` },
  TransferList:      { render: `<TransferList />` },
  Typography:        { render: `<Typography>Text content</Typography>` },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateAxeBlock(componentName, renderCode) {
  return `
// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('${componentName} — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      ${renderCode}
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        ${renderCode}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        ${renderCode}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
`;
}

/**
 * Find the index of the last line of the last complete import statement.
 * Correctly handles multi-line imports like:
 *   import {
 *     Badge,
 *   } from './Badge';   ← returns this line's index
 */
function findLastImportEnd(lines) {
  let lastImportEnd = -1;
  let insideBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('import {') && !trimmed.includes('} from')) {
      insideBlock = true;
    }
    if (insideBlock && trimmed.includes('} from ')) {
      insideBlock = false;
      lastImportEnd = i;
      continue;
    }
    if (!insideBlock && trimmed.startsWith('import ') && trimmed.includes(' from ')) {
      lastImportEnd = i;
    }
  }
  return lastImportEnd;
}

/**
 * Fix a broken axe import that was inserted inside a multi-line import block.
 * Returns true if the file was modified.
 */
function fixBrokenAxeImport(lines) {
  let brokenIndex = -1;
  let openBraceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('import {') && !line.includes('} from')) {
      openBraceCount++;
    }
    if (line.includes('} from ') && openBraceCount > 0) {
      openBraceCount--;
    }
    // Axe import found while inside an open import block = broken
    if (line === AXE_IMPORT && openBraceCount > 0) {
      brokenIndex = i;
      break;
    }
  }

  if (brokenIndex === -1) return false;

  // Remove from wrong position
  lines.splice(brokenIndex, 1);

  // Re-insert after last complete import
  const lastEnd = findLastImportEnd(lines);
  lines.splice(lastEnd + 1, 0, AXE_IMPORT);

  return true;
}

/**
 * Add axe import after last import if not present.
 * Returns true if added.
 */
function addAxeImportIfMissing(lines) {
  if (lines.some(l => l.trim() === AXE_IMPORT)) return false;

  const lastEnd = findLastImportEnd(lines);
  if (lastEnd === -1) {
    lines.unshift(AXE_IMPORT);
  } else {
    lines.splice(lastEnd + 1, 0, AXE_IMPORT);
  }
  return true;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let fixedImports = 0;
let addedTests = 0;
let skipped = 0;
let noConfig = 0;
let noFile = 0;

const components = fs.readdirSync(COMPONENTS_DIR).filter(name => {
  try { return fs.statSync(path.join(COMPONENTS_DIR, name)).isDirectory(); }
  catch { return false; }
});

components.forEach(componentName => {
  const testFile = path.join(COMPONENTS_DIR, componentName, `${componentName}.test.js`);

  if (!fs.existsSync(testFile)) {
    noFile++;
    return;
  }

  const content = fs.readFileSync(testFile, 'utf8');
  const lines = content.split('\n');
  let changed = false;

  // Step 1: Fix broken axe import if present
  if (content.includes(AXE_IMPORT)) {
    const wasBroken = fixBrokenAxeImport(lines);
    if (wasBroken) {
      console.log(`🔧 Fixed import in ${componentName}`);
      fixedImports++;
      changed = true;
    }
  }

  // Step 2: Add axe tests if not already present
  const currentContent = lines.join('\n');
  if (!currentContent.includes('toHaveNoViolations')) {
    const config = COMPONENT_RENDERS[componentName];
    if (!config) {
      console.log(`⚠️  No render config for ${componentName} — skipping axe tests`);
      noConfig++;
    } else {
      addAxeImportIfMissing(lines);
      const axeBlock = generateAxeBlock(componentName, config.render);
      const newContent = lines.join('\n').trimEnd() + '\n' + axeBlock;
      fs.writeFileSync(testFile, newContent);
      console.log(`✅ Added axe tests to ${componentName}`);
      addedTests++;
      return; // Already wrote file
    }
  } else if (!changed) {
    skipped++;
  }

  // Write file if import was fixed but no axe block was added
  if (changed) {
    fs.writeFileSync(testFile, lines.join('\n'));
  }
});

console.log(`
📊 Summary:
   🔧 Fixed broken imports:  ${fixedImports}
   ✅ Added axe tests:        ${addedTests}
   ⏭  Already complete:       ${skipped}
   ⚠️  No render config:       ${noConfig}
   ❓ No test file:            ${noFile}

Run tests with: npm test -- --watchAll=false
`);