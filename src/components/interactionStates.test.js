/**
 * Every clickable control implements every interaction state.
 *
 * WHY A SOURCE SCAN AND NOT A RENDER TEST
 * These states live in `sx` objects that MUI compiles to real stylesheet rules
 * for :hover / :active / :focus-visible. jsdom has no layout, applies no
 * pseudo-class, and returns the resting style from getComputedStyle — so a
 * render test can assert that a control renders and that it is disabled, and
 * can assert nothing at all about hover or pressed. A scan of the source is
 * the only check available that fails when a state is missing.
 *
 * WHY A CURATED REGISTRY AND NOT A GLOB
 * A directory-wide grep was the first attempt and it reported BottomNavigation
 * as fully covered. It was not: `BottomNavItem` had a focus ring and nothing
 * else, and the hover/pressed the grep found belonged to the FAB's menu rows
 * further down the same file. Auditing a FILE answers "does this file mention
 * hover", which is not the question. The registry names CONTROLS, so a second
 * control in a file that already passes cannot hide behind the first.
 *
 * Adding a component? Add it here, or add it to EXEMPT with a reason. The
 * discovery test at the bottom fails until you do one or the other.
 *
 * An icon button inside any other component takes its states FROM the icon
 * button — it does not restate them. Six components imported MUI's IconButton
 * and hand-wrote hover/pressed/focus at each call site; the lib has had its
 * own (`Button.js`: `IconButton = <Button iconOnly>`) the whole time. A
 * `delegatesTo` entry is what that looks like once it is fixed.
 *
 * `delegatesTo` is the third option: the wrapper's control IS a lib component
 * that already holds the four states, so the states are asserted on that
 * component and the wrapper only has to keep rendering it. Pagination renders
 * <Button> for every page; duplicating a hover rule into Pagination would be
 * a second definition to keep in step, which is the failure this file exists
 * to prevent.
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS = path.join(__dirname);

const read = (rel) => fs.readFileSync(path.join(COMPONENTS, rel), 'utf8');

/* Strip comments before matching. This file argues about hover in prose, and
   so do several components — matching a comment would let a component pass by
   describing a state it does not have. */
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/* The four states, and what counts as implementing each.
   `scrimStates()` / `TOGGLE_STATES` satisfy all four at once — a control that
   spreads one is taking the shared table, which is the outcome this test
   exists to encourage. */
const SHARED = /scrimStates\(|TOGGLE_STATES/;

const STATES = {
  hover:    [/&:hover|\.bottom-nav-item:hover|:hover &/, SHARED],
  pressed:  [/&:active|&\.Mui-active|\.bottom-nav-item:active|:active &/, SHARED],
  focus:    [/&:focus-visible|&\.Mui-focusVisible|&:focus-within|FOCUS_RING/, SHARED],
  disabled: [/&:disabled|&\.Mui-disabled|disabled &&|disabled \?|DISABLED_STATE/, SHARED],
};

/**
 * Each entry: the control, the file it lives in, and — where a file holds more
 * than one control — a `within` slice so the states must be found on THAT
 * control rather than anywhere in the file.
 */
const REGISTRY = [
  { control: 'Button',              file: 'Button/Button.js' },
  { control: 'Fab',                 file: 'Fab/Fab.js' },
  { control: 'Chip',                file: 'Chip/Chip.js' },
  { control: 'Link',                file: 'Link/Link.js' },
  { control: 'Tabs',                file: 'Tabs/Tabs.js' },
  { control: 'Accordion summary',   file: 'Accordion/Accordion.js' },
  { control: 'MenuItem',            file: 'Menu/Menu.js' },
  { control: 'ToggleButton',        file: 'ToggleButton/ToggleButton.js' },
  { control: 'ToggleButtonGroup',   file: 'ToggleButtonGroup/ToggleButtonGroup.js' },
  { control: 'Checkbox',            file: 'Checkbox/Checkbox.js' },
  { control: 'Radio',               file: 'Radio/Radio.js' },
  { control: 'Switch',              file: 'Switch/Switch.js' },
  { control: 'Slider',              file: 'Slider/Slider.js' },
  { control: 'Rating',              file: 'Rating/Rating.js' },
  { control: 'Input',               file: 'Input/Input.js' },
  { control: 'SearchField',         file: 'SearchField/SearchField.js' },
  { control: 'Select',              file: 'Select/Select.js' },
  { control: 'Autocomplete',        file: 'Autocomplete/Autocomplete.js' },
  { control: 'Card (clickable)',    file: 'Card/Card.js' },
  { control: 'Step indicator',      file: 'Stepper/Stepper.js' },
  { control: 'Pagination page',     file: 'Pagination/Pagination.js', delegatesTo: 'Button/Button.js', renders: /<Button\b/ },
  { control: 'Rail item',           file: 'Rail/Rail.js' },
  { control: 'List item',           file: 'List/List.js' },
  { control: 'TreeBranch',          file: 'TreeView/TreeBranch.js' },
  { control: 'TransferList',        file: 'TransferList/TransferList.js', delegatesTo: 'Button/Button.js', renders: /<Button\b/ },
  { control: 'DropZone',            file: 'DropZone/DropZone.js' },
  { control: 'SpeedDial action',    file: 'SpeedDial/SpeedDial.js', delegatesTo: 'Fab/Fab.js', renders: /<Fab\b/ },
  { control: 'DrawerClose',         file: 'Drawer/Drawer.js', delegatesTo: 'Button/Button.js', renders: /<Button\b/ },
  { control: 'Modal close',         file: 'Modal/Modal.js' },
  { control: 'Dialog close',        file: 'Dialog/Dialog.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  { control: 'Dialog buttons',      file: 'Dialog/Dialog.js' },
  { control: 'CodeBlock copy',      file: 'CodeBlock/CodeBlock.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  { control: 'CodeWithCopy',        file: 'shared/CodeWithCopy.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  { control: 'Sidebar row',         file: 'Sidebar/Sidebar.js' },
  { control: 'Sidebar rail button', file: 'Sidebar/Sidebar.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  { control: 'MainLayout nav row',  file: 'MainLayout/MainLayout.js' },
  { control: 'MainLayout menu btn', file: 'MainLayout/MainLayout.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  { control: 'Header icon button',  file: 'Header/Header.js', delegatesTo: 'Button/Button.js', renders: /<IconButton\b/ },
  // Paper itself is a surface with no onClick. InteractivePaper is the
  // clickable export, and its docblock promises hover and focus.
  { control: 'InteractivePaper',    file: 'Paper/Paper.js', within: ['export function InteractivePaper', 'export function ElevatedPaper'] },
  { control: 'NumberField spinner', file: 'NumberField/NumberField.js' },
  {
    control: 'BottomNavItem',
    file: 'BottomNavigation/BottomNavigation.js',
    // The control this test was redesigned around — see the header note.
    within: ['function BottomNavItem', 'function BottomNavFab'],
  },
  {
    control: 'BottomNav FAB menu row',
    file: 'BottomNavigation/BottomNavigation.js',
    within: ['function BottomNavFab', null],
  },
];

/** Directories with no control of their own, and why. */
const EXEMPT = {
  Alert: 'a message region; its dismiss control is a Button',
  AppBar: 'a bar; the controls inside it are passed in',
  Avatar: 'an image, clickable only when wrapped in a Button',
  AvatarGroup: 'lays out Avatars',
  Badge: 'a count rendered onto another control',
  Box: 'layout primitive',
  Breadcrumbs: 'links and an ellipsis button; disabled is not a breadcrumb state — the current page is a span, not a link',
  Charts: 'data rendering',
  CircularProgress: 'output, not input',
  Colors: 'swatch documentation',
  Container: 'layout primitive',
  Copyright: 'text',
  CurvedText: 'text',
  Divider: 'a rule',
  Footer: 'a region; its links are Links',
  Grid: 'layout primitive',
  Icon: 'decoration; the button around it owns the states',
  IconBadge: 'decoration — takes no onClick at all; the button around it owns the states',
  LinearProgress: 'output, not input',
  Loader: 'output, not input',
  Popover: 'a panel; its contents own their states',
  Progress: 'output, not input',
  Ratio: 'layout primitive',
  Section: 'paints a region',
  Sheet: 'a panel',
  Showcase: 'documentation',
  Snackbar: 'a message; its action is a Button',
  Spacing: 'layout primitive',
  Stack: 'layout primitive',
  Surfaced: 'paints a region',
  Table: 'cells; a sortable header is a Button',
  Tag: 'a label; the dismissible variant renders a Button',
  ThemedZone: 'sets attributes only',
  Toolbar: 'a bar; the controls inside it are passed in',
  Tooltip: 'a hint attached to another control',
  Typography: 'text',
  BevelText: 'text',
  Gradient: 'paints a fill',
  DropdownContext: 'context only',
};

function slice(src, within) {
  if (!within) return src;
  const [from, to] = within;
  const a = src.indexOf(from);
  if (a === -1) throw new Error(`"${from}" not found — the registry is out of date`);
  const b = to ? src.indexOf(to, a + 1) : src.length;
  return src.slice(a, b === -1 ? src.length : b);
}

describe('every clickable control has every interaction state', () => {
  for (const entry of REGISTRY) {
    describe(entry.control, () => {
      const own = code(slice(read(entry.file), entry.within));

      if (entry.delegatesTo) {
        it(`renders ${entry.delegatesTo.split('/')[0]}, which owns the states`, () => {
          if (!entry.renders.test(own)) {
            throw new Error(
              `${entry.control} no longer renders ${entry.delegatesTo.split('/')[0]}. `
              + 'It either owns its states now (drop delegatesTo and list them) '
              + 'or it lost its control.',
            );
          }
          expect(entry.renders.test(own)).toBe(true);
        });
      }

      const src = entry.delegatesTo ? code(read(entry.delegatesTo)) : own;
      for (const [state, patterns] of Object.entries(STATES)) {
        it(`implements ${state}`, () => {
          const found = patterns.some((p) => p.test(src));
          if (!found) {
            // Jest's expect takes one argument, so the explanation goes in the
            // thrown message rather than a second parameter.
            throw new Error(
              `${entry.control} (${entry.file}) has no ${state} state.\n`
              + `Add it, or spread scrimStates() from components/_states.js.`,
            );
          }
          expect(found).toBe(true);
        });
      }
    });
  }
});

describe('no clickable component escapes the registry', () => {
  /* Without this, the registry only protects what someone remembered to list,
     and a new component ships with no states and a green suite. */
  const RENDERS_CONTROL = /component=["']button["']|<button\b|role=["']button["']|<(Mui)?(ButtonBase|IconButton|ToggleButton|MenuItem|ListItemButton)\b/;

  it('every directory rendering a control is registered or exempt', () => {
    const registered = new Set(REGISTRY.map((e) => e.file.split('/')[0]));
    const unaccounted = [];

    for (const dir of fs.readdirSync(COMPONENTS)) {
      const full = path.join(COMPONENTS, dir);
      if (!fs.statSync(full).isDirectory()) continue;
      if (dir.startsWith('_') || registered.has(dir) || dir in EXEMPT) continue;

      const rendersControl = fs.readdirSync(full).some((f) => {
        if (!f.endsWith('.js')) return false;
        if (/\.test\.|\.stories\.|Showcase|showcase/.test(f)) return false;
        return RENDERS_CONTROL.test(code(fs.readFileSync(path.join(full, f), 'utf8')));
      });
      if (rendersControl) unaccounted.push(dir);
    }

    if (unaccounted.length) {
      throw new Error(
        'These render a control but are neither in REGISTRY nor EXEMPT.\n'
        + 'Add each to REGISTRY (and give it the four states) or to EXEMPT with a reason:\n  '
        + unaccounted.join('\n  '),
      );
    }
    expect(unaccounted).toEqual([]);
  });

  it('the registry points at files that exist', () => {
    for (const e of REGISTRY) {
      if (!fs.existsSync(path.join(COMPONENTS, e.file))) {
        throw new Error(`REGISTRY names ${e.file}, which does not exist`);
      }
    }
  });
});
