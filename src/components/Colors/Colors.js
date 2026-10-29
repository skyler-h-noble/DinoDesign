// src/components/Colors/Colors.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/* ── Static sheet ─────────────────────────────────────────────────────────
   This page was built from MUI's Typography, Stack, Grid and Alert on MUI's
   default theme (Roboto, MUI's own info blue), and it keeps that look exactly:
   each MUI part is its plain element with MUI's class names and the styles
   MUI computed for it. Swapping in the lib's own Typography or Alert would
   restyle the page, which is a design change rather than a conversion.

   Stacks keep MUI's selectors and so their weight: every child's margin is
   reset and the gap is a margin on each child after the first — which is
   also why a child's own margin inside a stack never applied. Per-instance
   colors travel as custom properties declared on the element they paint. */
const TYPE = {
  h5: ['h5', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:1.5rem;line-height:1.334;letter-spacing:0em'],
  h6: ['h6', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:500;font-size:1.25rem;line-height:1.6;letter-spacing:0.0075em'],
  body2: ['p', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em'],
  caption: ['span', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:0.75rem;line-height:1.66;letter-spacing:0.03333em'],
};
const stack = (cls, dir, gap) => [
  `.${cls}>:not(style):not(style){margin:0}`,
  `.${cls}>:not(style)~:not(style){margin-${dir === 'row' ? 'left' : 'top'}:${gap}}`,
];
registerStaticStyles('omni-colors', [
  '.omni-col-t{margin:0}',
  ...Object.entries(TYPE).map(([v, [, css]]) => `.omni-col-${v}{${css}}`),
  // Typography sx, in the order emotion wrote them (after the variant).
  '.omni-col-title{margin-bottom:24px;font-weight:700}',
  '.omni-col-title-sm{margin-bottom:16px;font-weight:700}',
  '.omni-col-quiet{color:var(--Text-Secondary)}',
  '.omni-col-mb3{margin-bottom:24px}',
  '.omni-col-swname{font-weight:600;font-size:12px;color:var(--Text);word-break:break-word}',
  '.omni-col-swname-gap{margin-bottom:4px}',
  '.omni-col-swvar{display:block;font-size:10px;font-family:monospace;word-break:break-all}',
  '.omni-col-key{font-weight:600;min-width:80px}',
  '.omni-col-cat{margin-bottom:16px;font-weight:600}',
  '.omni-col-sub{font-weight:600;margin-bottom:8px}',
  // Boxes.
  '.omni-col-center{text-align:center}',
  '.omni-col-swatch{width:80px;height:80px;background-color:var(--_col-bg);border-radius:8px;border:1px solid var(--Border);'
    + 'margin-bottom:8px;margin-left:auto;margin-right:auto}',
  '.omni-col-bg{min-width:max(var(--Button-Height), var(--Min-Button-Width));min-height:var(--Button-Height);'
    + 'background-color:var(--_col-bg);border-radius:var(--Style-Border-Radius);border:2px solid var(--Border);margin-bottom:8px}',
  '.omni-col-pair{display:flex;gap:16px}',
  '.omni-col-howto{padding-top:32px;border-top:1px solid var(--Border)}',
  '.omni-col-pre{background-color:var(--Container);padding:16px;border-radius:8px;overflow:auto;font-size:12px;'
    + 'border:1px solid var(--Border);color:var(--Text)}',
  // Stacks.
  '.omni-col-stack{display:flex;flex-direction:column}',
  '.omni-col-row{display:flex;flex-direction:row;flex-wrap:wrap;-webkit-box-pack:center;justify-content:center;gap:24px}',
  '.omni-col-mb4{margin-bottom:32px}',
  ...stack('omni-col-s6', 'column', '48px'),
  ...stack('omni-col-s4', 'column', '32px'),
  ...stack('omni-col-s2', 'column', '16px'),
  ...stack('omni-col-s1', 'column', '8px'),
  ...stack('omni-col-row', 'row', '24px'),
  // Grid (MUI v7: the gap is a gap; item / xs are ignored, so items size to content).
  '.omni-col-grid{flex-flow:wrap;min-width:0;box-sizing:border-box;display:flex;gap:16px 16px;-webkit-box-pack:center;justify-content:center}',
  '.omni-col-cell{min-width:0;box-sizing:border-box;display:flex;-webkit-box-pack:center;justify-content:center}',
  // Alert severity="info", variant standard, on MUI's default theme.
  '.omni-col-alert{transition:box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);border-radius:4px;box-shadow:none;'
    + 'background-image:none;font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:0.875rem;'
    + 'line-height:1.43;letter-spacing:0.01071em;display:flex;padding:6px 16px;color:rgb(1, 67, 97);'
    + 'background-color:var(--Container-Low);margin-bottom:24px;border:1px solid var(--Border)}',
  '.omni-col-alert .MuiAlert-icon{color:rgb(2, 136, 209)}',
  '.omni-col-alert-icon{margin-right:12px;padding:7px 0;display:flex;font-size:22px;opacity:0.9}',
  '.omni-col-alert-svg{user-select:none;width:1em;height:1em;display:inline-block;flex-shrink:0;'
    + 'transition:fill 200ms cubic-bezier(0.4, 0, 0.2, 1);fill:currentColor;font-size:inherit}',
  '.omni-col-alert-msg{padding:8px 0;min-width:0;overflow:auto}',
].join('\n'));

/** One MUI Typography variant as its element. */
function T({ v, as, className = '', children }) {
  const Tag = as || TYPE[v][0];
  return (
    <Tag className={`MuiTypography-root MuiTypography-${v} omni-col-t omni-col-${v}${className ? ' ' + className : ''}`}>
      {children}
    </Tag>
  );
}

/* MUI's own InfoOutlined (its internal Alert icon, not the icons package's,
   whose path data differs). */
const INFO_PATH = 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z';

const GRID = 'MuiGrid-root MuiGrid-container MuiGrid-direction-xs-row MuiGrid-spacing-xs-2 omni-col-grid';
const CELL = 'MuiGrid-root MuiGrid-direction-xs-row omni-col-cell';

/**
 * Colors component - Displays the design system color palette
 * Shows Primary, Secondary, Tertiary colors and their background variants
 * Explains dynamic color system based on mode, background, and surface
 */
export function Colors() {
  useStaticStyles('omni-colors');
  const brandColors = [
    { name: 'Primary', var: '--Primary-Color-11' },
    { name: 'Secondary', var: '--Secondary-Color-11' },
    { name: 'Tertiary', var: '--Tertiary-Color-11' },
  ];

  const backgroundColors = [
    {
      name: 'Default Background',
      cssVar: 'var(--Theme-Default-Surfaces-Surface)',
    },
    {
      name: 'Primary Background',
      cssVar: 'var(--Theme-Primary-Surfaces-Surface)',
    },
    {
      name: 'Secondary Background',
      cssVar: 'var(--Theme-Secondary-Surfaces-Surface)',
    },
    {
      name: 'Tertiary Background',
      cssVar: 'var(--Theme-Tertiary-Surfaces-Surface)',
    },
    {
      name: 'Neutral Background',
      cssVar: 'var(--Theme-Neutral-Surfaces-Surface)',
    },
    {
      name: 'Neutral-Variant Background',
      cssVar: 'var(--Theme-Neutral-Variant-Surfaces-Surface)',
    },
  ];

  const dynamicColorCategories = [
    {
      name: 'Layout & Surfaces',
      colors: [
        { name: 'Background', var: '--Background' },
        { name: 'Border', var: '--Border' },
        { name: 'Border-Variant', var: '--Border-Variant' },
      ],
    },
    {
      name: 'Text & Links',
      colors: [
        { name: 'Header', var: '--Header' },
        { name: 'Text', var: '--Text' },
        { name: 'Text-Quiet', var: '--Text-Quiet' },
        { name: 'Hotlink', var: '--Hotlink' },
        { name: 'Hotlink-Visited', var: '--Hotlink-Visited' },
      ],
    },
    {
      name: 'Buttons - Primary',
      colors: [
        { name: 'Button BG', var: '--Button-Primary-Button' },
        { name: 'Button Text', var: '--Button-Primary-Text' },
        { name: 'Button Hover', var: '--Button-Primary-Hover' },
        { name: 'Button Active', var: '--Button-Primary-Pressed' },
        { name: 'Focus-Visible', var: '--Focus-Visible' },
      ],
    },
    
    {
      name: 'Buttons - Secondary',
      colors: [
        { name: 'Button BG', var: '--Button-Secondary-Button' },
        { name: 'Button Text', var: '--Button-Secondary-Text' },
        { name: 'Button Hover', var: '--Button-Secondary-Hover' },
        { name: 'Button Active', var: '--Button-Secondary-Pressed' },
        { name: 'Focus-Visible', var: '--Focus-Visible' },
      ],
    },
    {
      name: 'Buttons - State',
      colors: [
        { name: 'Info Button', var: '--Button-Info-Button' },
        { name: 'Success Button', var: '--Button-Success-Button' },
        { name: 'Warning Button', var: '--Button-Warning-Button' },
        { name: 'Error Button', var: '--Button-Error-Button' },
      ],
    },
    {
      name: 'Icons',
      colors: [
        { name: 'Default', var: '--Icons-Default' },
        { name: 'Primary', var: '--Icons-Primary' },
        { name: 'Secondary', var: '--Icons-Secondary' },
        { name: 'Tertiary', var: '--Icons-Tertiary' },
        { name: 'Neutral', var: '--Icons-Neutral' },
        { name: 'Info', var: '--Icons-Info' },
        { name: 'Success', var: '--Icons-Success' },
        { name: 'Warning', var: '--Icons-Warning' },
        { name: 'Error', var: '--Icons-Error' },
      ],
    },
    {
      name: 'Chips & Badges',
      colors: [
        { name: 'Primary BG', var: '--Tags-Primary-BG' },
        { name: 'Primary Text', var: '--Tags-Primary-Text' },
        { name: 'Secondary BG', var: '--Tags-Secondary-BG' },
        { name: 'Secondary Text', var: '--Tags-Secondary-Text' },
        { name: 'Tertiary BG', var: '--Tags-Tertiary-BG' },
        { name: 'Tertiary Text', var: '--Tags-Tertiary-Text' },
        { name: 'Neutral BG', var: '--Tags-Neutral-BG' },
        { name: 'Neutral Text', var: '--Tags-Neutral-Text' },
        { name: 'Info BG', var: '--Tags-Info-BG' },
        { name: 'Info Text', var: '--Tags-Info-Text' },
        { name: 'Success BG', var: '--Tags-Success-BG' },
        { name: 'Success Text', var: '--Tags-Success-Text' },
        { name: 'Warning BG', var: '--Tags-Warning-BG' },
        { name: 'Warning Text', var: '--Tags-Warning-Text' },
        { name: 'Error BG', var: '--Tags-Error-BG' },
        { name: 'Error Text', var: '--Tags-Error-Text' },
      ],
    },
  ];

  // Color Swatch Component - 80x80
  const ColorSwatch = ({ color }) => (
    <div className="MuiBox-root omni-col-center">
      <div className="MuiBox-root omni-col-swatch" style={{ '--_col-bg': `var(${color.var})` }} />
      <T v="body2" className="omni-col-swname omni-col-swname-gap">{color.name}</T>
      <T v="caption" className="omni-col-quiet omni-col-swvar">{color.var}</T>
    </div>
  );

  return (
    <div className="MuiStack-root omni-col-stack omni-col-s6">
      {/* Primary, Secondary, Tertiary Colors */}
      <div className="MuiBox-root">
        <T v="h5" className="omni-col-title">Brand Colors (Static)</T>
        <div className="MuiStack-root omni-col-row">
          {brandColors.map((color) => (
            <ColorSwatch key={color.var} color={color} />
          ))}
        </div>
      </div>

      {/* Background Colors */}
      <div className="MuiBox-root">
        <T v="h5" className="omni-col-title">Background Colors (Dynamic)</T>
        <T v="body2" className="omni-col-mb3 omni-col-quiet">
          Update based on selected Background variant and Mode
        </T>
        <div className={GRID}>
          {backgroundColors.map((bg) => (
            <div key={bg.name} className={CELL}>
              <div className="MuiBox-root omni-col-center">
                <div className="MuiBox-root omni-col-bg" style={{ '--_col-bg': bg.cssVar }} />
                <T v="body2" className="omni-col-swname">{bg.name}</T>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Color Categories */}
      <div className="MuiBox-root">
        <T v="h5" className="omni-col-title">Dynamic Colors (Update with Mode, Background &amp; Surface)</T>
        <div
          className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiAlert-root MuiAlert-colorInfo MuiAlert-standardInfo MuiAlert-standard omni-col-alert"
          role="alert"
        >
          <div className="MuiAlert-icon omni-col-alert-icon">
            <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit omni-col-alert-svg" focusable="false"
              aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoOutlinedIcon">
              <path d={INFO_PATH} />
            </svg>
          </div>
          <div className="MuiAlert-message omni-col-alert-msg">
            <T v="body2">
              Most colors update automatically based on the current{' '}
              <strong>Mode</strong> (Light/Dark), <strong>Background</strong>{' '}
              variant, and <strong>Surface</strong> theme. Only Primary, Secondary,
              and Tertiary colors are fixed brand colors.
            </T>
          </div>
        </div>

        <T v="body2" className="omni-col-mb3 omni-col-quiet">
          These colors automatically adapt based on:
        </T>
        <div className="MuiStack-root omni-col-stack omni-col-mb4 omni-col-s1">
          <div className="MuiBox-root omni-col-pair">
            <T v="body2" className="omni-col-key">Mode:</T>
            <T v="body2">Light or Dark theme</T>
          </div>
          <div className="MuiBox-root omni-col-pair">
            <T v="body2" className="omni-col-key">Background:</T>
            <T v="body2">
              Default, Primary, Secondary, Tertiary, Neutral, or Neutral-Variant
            </T>
          </div>
          <div className="MuiBox-root omni-col-pair">
            <T v="body2" className="omni-col-key">Surface:</T>
            <T v="body2">Theme surface layer selection</T>
          </div>
        </div>

        <div className="MuiStack-root omni-col-stack omni-col-s4">
          {dynamicColorCategories.map((category) => (
            <div key={category.name} className="MuiBox-root">
              <T v="h6" className="omni-col-cat">{category.name}</T>
              <div className={GRID}>
                {category.colors.map((color) => (
                  <div key={color.var} className={CELL}>
                    <ColorSwatch color={color} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color System Overview */}
      <div className="MuiBox-root omni-col-howto">
        <T v="h5" className="omni-col-title-sm">How to Use</T>
        <div className="MuiStack-root omni-col-stack omni-col-s2">
          <div className="MuiBox-root">
            <T v="h6" className="omni-col-sub">Static Colors</T>
            <T v="body2" className="omni-col-quiet">
              Use brand colors (
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Primary-Color-11
              </code>
              ,{' '}
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Secondary-Color-11
              </code>
              ,{' '}
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Tertiary-Color-11
              </code>
              ) for brand elements that should never change.
            </T>
          </div>
          <div className="MuiBox-root">
            <T v="h6" className="omni-col-sub">Dynamic Colors</T>
            <T v="body2" className="omni-col-quiet">
              Use dynamic color variables for all UI elements. They will automatically
              update when users change Mode, Background, or Surface settings.
            </T>
          </div>
          <div className="MuiBox-root">
            <T v="h6" className="omni-col-sub">Example Usage</T>
            <pre className="MuiBox-root omni-col-pre">
              {`/* Dynamic - updates with theme changes */
color: var(--Text);
backgroundColor: var(--Background);
borderColor: var(--Border);

/* Static - brand colors stay the same */
accentColor: var(--Primary-Color-11);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Colors;
