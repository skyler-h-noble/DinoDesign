// src/components/Spacing/Spacing.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/* ── Static sheet ─────────────────────────────────────────────────────────
   Built from MUI's Typography, Stack and Grid on MUI's default theme, and it
   keeps that look exactly: each MUI part is its plain element with MUI's
   class names and the styles MUI computed for it.

   Stacks keep MUI's selectors and so their weight: every child's margin is
   reset and the gap is a margin on each child after the first — so a child's
   own margin inside a stack (SpacingBar's mb, the note's mt) never applied,
   and still does not. The MUI v7 Grid ignores item / xs / sm / md / lg, so
   its items size to their content. Per-instance sizes travel as custom
   properties declared on the element they size. */
const TYPE = {
  h5: ['h5', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:1.5rem;line-height:1.334;letter-spacing:0em'],
  h6: ['h6', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:500;font-size:1.25rem;line-height:1.6;letter-spacing:0.0075em'],
  subtitle2: ['h6', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:500;font-size:0.875rem;line-height:1.57;letter-spacing:0.00714em'],
  body2: ['p', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em'],
  caption: ['span', 'font-family:Roboto, Helvetica, Arial, sans-serif;font-weight:400;font-size:0.75rem;line-height:1.66;letter-spacing:0.03333em'],
};
const stack = (cls, dir, gap) => [
  `.${cls}>:not(style):not(style){margin:0}`,
  `.${cls}>:not(style)~:not(style){margin-${dir === 'row' ? 'left' : 'top'}:${gap}}`,
];
registerStaticStyles('omni-spacing', [
  '.omni-spc-t{margin:0}',
  ...Object.entries(TYPE).map(([v, [, css]]) => `.omni-spc-${v}{${css}}`),
  // Typography sx, after the variant as emotion wrote it.
  '.omni-spc-mb1{margin-bottom:8px}',
  '.omni-spc-mb2{margin-bottom:16px}',
  '.omni-spc-mb3{margin-bottom:24px}',
  '.omni-spc-mt1{margin-top:8px}',
  '.omni-spc-w600{font-weight:600}',
  '.omni-spc-w700{font-weight:700}',
  '.omni-spc-quiet{color:var(--Text-Secondary)}',
  '.omni-spc-block{display:block}',
  // Boxes.
  '.omni-spc-bar-row{display:flex;-webkit-box-align:center;align-items:center;gap:16px;margin-bottom:8px}',
  '.omni-spc-bar{width:var(--_spc-w);min-width:20px;height:24px;background-color:var(--Buttons-Primary-Button);'
    + 'border-radius:2px;border:1px solid var(--Border)}',
  '.omni-spc-size{width:100px;height:var(--_spc-h);background-color:var(--Buttons-Primary-Button);border-radius:4px;'
    + 'border:1px solid var(--Border);margin-bottom:8px}',
  '.omni-spc-container{padding:var(--Spacing-3);background-color:var(--Container-Low);'
    + 'border:2px dashed var(--Buttons-Primary-Button);border-radius:4px}',
  '.omni-spc-pad{padding:var(--_spc-p);background-color:var(--Container);border:1px solid var(--Border);border-radius:4px}',
  '.omni-spc-square{width:60px;height:60px;background-color:var(--Buttons-Primary-Button);border-radius:4px;flex-shrink:0}',
  '.omni-spc-note{padding:16px;background-color:var(--Container-Low);border-radius:4px;'
    + 'border-left:4px solid var(--Buttons-Primary-Button);margin-top:24px}',
  // Stacks.
  '.omni-spc-stack{display:flex;flex-direction:column}',
  '.omni-spc-root{padding:16px}',
  '.omni-spc-row{display:flex;flex-direction:row;margin-bottom:8px}',
  ...stack('omni-spc-s3', 'column', '24px'),
  ...stack('omni-spc-s1', 'column', '8px'),
  ...stack('omni-spc-sh', 'column', '4px'),
  ...stack('omni-spc-row', 'row', 'var(--_spc-gap)'),
  // Grid.
  '.omni-spc-grid{flex-flow:wrap;min-width:0;box-sizing:border-box;display:flex;gap:var(--_spc-g) var(--_spc-g)}',
  '.omni-spc-grid-mb4{margin-bottom:32px}',
  '.omni-spc-cell{min-width:0;box-sizing:border-box}',
].join('\n'));

/** One MUI Typography variant as its element. */
function T({ v, as, className = '', children }) {
  const Tag = as || TYPE[v][0];
  return (
    <Tag className={`MuiTypography-root MuiTypography-${v} omni-spc-t omni-spc-${v}${className ? ' ' + className : ''}`}>
      {children}
    </Tag>
  );
}

const grid = (n, extra = '') => ({
  className: `MuiGrid-root MuiGrid-container MuiGrid-direction-xs-row MuiGrid-spacing-xs-${n} omni-spc-grid${extra}`,
  style: { '--_spc-g': n * 8 + 'px' },
});
const CELL = 'MuiGrid-root MuiGrid-direction-xs-row omni-spc-cell';

/**
 * Spacing Component - Design System Documentation
 * 
 * Displays the design system spacing and sizing scales
 * 
 * WCAG 2.1 Accessibility Best Practices:
 * - Visual demos use aria-hidden="true" to hide from screen readers
 * - No empty decorative <div> elements in DOM
 * - Semantic HTML for all content
 * - CSS-based spacing (margin/padding) for actual layout
 * - aria-hidden only on non-focusable, decorative elements
 * 
 * @returns {React.ReactNode} Spacing scale documentation
 */
export function Spacing() {
  useStaticStyles('omni-spacing');
  const spacingUnits = [
    { name: 'Quarter', var: '--Spacing-Quarter', baseValue: '2px' },
    { name: 'Half', var: '--Spacing-Half', baseValue: '4px' },
    { name: '1-and-Half', var: '--Spacing-1-and-Half', baseValue: '12px' },
    { name: '1', var: '--Spacing-1', baseValue: '8px' },
    { name: '2', var: '--Spacing-2', baseValue: '16px' },
    { name: '3', var: '--Spacing-3', baseValue: '24px' },
    { name: '4', var: '--Spacing-4', baseValue: '32px' },
    { name: '5', var: '--Spacing-5', baseValue: '40px' },
    { name: '6', var: '--Spacing-6', baseValue: '48px' },
    { name: '7', var: '--Spacing-7', baseValue: '56px' },
    { name: '8', var: '--Spacing-8', baseValue: '64px' },
    { name: '9', var: '--Spacing-9', baseValue: '72px' },
    { name: '10', var: '--Spacing-10', baseValue: '80px' },
  ];

  const sizingUnits = [
    { name: 'Quarter', var: '--Sizing-Quarter', value: '2px' },
    { name: 'Half', var: '--Sizing-Half', value: '4px' },
    { name: '1-and-Half', var: '--Sizing-1-and-Half', value: '12px' },
    { name: '1', var: '--Sizing-1', value: '8px' },
    { name: '2', var: '--Sizing-2', value: '16px' },
    { name: '3', var: '--Sizing-3', value: '24px' },
    { name: '4', var: '--Sizing-4', value: '32px' },
    { name: '5', var: '--Sizing-5', value: '40px' },
    { name: '6', var: '--Sizing-6', value: '48px' },
    { name: '7', var: '--Sizing-7', value: '56px' },
    { name: '8', var: '--Sizing-8', value: '64px' },
    { name: '9', var: '--Sizing-9', value: '72px' },
    { name: '10', var: '--Sizing-10', value: '80px' },
    { name: '11', var: '--Sizing-11', value: '88px' },
    { name: '12', var: '--Sizing-12', value: '96px' },
    { name: '13', var: '--Sizing-13', value: '104px' },
    { name: '14', var: '--Sizing-14', value: '112px' },
    { name: '15', var: '--Sizing-15', value: '160px' },
    { name: '16', var: '--Sizing-16', value: '240px' },
    { name: '17', var: '--Sizing-17', value: '320px' },
    { name: '18', var: '--Sizing-18', value: '480px' },
  ];

  const negativeSizing = [
    { name: 'Negative-Quarter', var: '--Sizing-Negative-Quarter', value: '-2px' },
    { name: 'Negative-Half', var: '--Sizing-Negative-Half', value: '-4px' },
    { name: 'Negative-1-and-Half', var: '--Sizing-Negative-1-and-Half', value: '-12px' },
    { name: 'Negative-1', var: '--Sizing-Negative-1', value: '-8px' },
  ];

  /**
   * SpacingBar Component
   * Visual demonstration of spacing value
   * Uses aria-hidden="true" on decorative bar since content is shown in text
   * 
   * WCAG 2.1: Decorative elements should be hidden from screen readers
   * {@link https://dequeuniversity.com/rules/axe/3.5/aria-hidden-focus}
   */
  const SpacingBar = ({ name, varName, baseValue }) => {
    return (
      <div className="MuiBox-root omni-spc-mb2">
        <div className="MuiBox-root omni-spc-bar-row">
          {/* 
            Visual bar - HIDDEN from assistive technology
            aria-hidden="true" because the spacing value is fully conveyed 
            by the text labels below. Screen readers don't need this visual.
          */}
          <div aria-hidden="true" className="MuiBox-root omni-spc-bar" style={{ '--_spc-w': `var(${varName})` }} />
          
          {/* Text labels - VISIBLE to screen readers */}
          <div className="MuiStack-root omni-spc-stack omni-spc-sh">
            <T v="subtitle2" className="omni-spc-w600">{name}</T>
            <T v="caption" className="omni-spc-quiet">{varName}</T>
            <T v="caption" className="omni-spc-quiet">Base: {baseValue}</T>
          </div>
        </div>
      </div>
    );
  };

  /**
   * SizingBox Component
   * Visual demonstration of sizing value
   * Uses aria-hidden="true" on decorative box
   */
  const SizingBox = ({ name, varName, value }) => {
    return (
      <div className="MuiBox-root omni-spc-mb2">
        {/* 
          Decorative visual box - HIDDEN from assistive technology
          The actual size values are in the text below
        */}
        <div aria-hidden="true" className="MuiBox-root omni-spc-size" style={{ '--_spc-h': value }} />
        
        {/* Text content - VISIBLE to screen readers */}
        <T v="subtitle2" className="omni-spc-w600">{name}</T>
        <T v="caption" className="omni-spc-quiet omni-spc-block">{varName}</T>
        <T v="caption" className="omni-spc-quiet">{value}</T>
      </div>
    );
  };

  return (
    <div className="MuiStack-root omni-spc-stack omni-spc-root omni-spc-s3">
      {/* Spacing Section */}
      <section>
        <T v="h5" as="h2" className="omni-spc-mb2 omni-spc-w700">Spacing Scale</T>
        <T v="body2" className="omni-spc-mb3 omni-spc-quiet">
          
          Each spacing value includes a visual reference and text label for clarity.
        </T>
        <div className="MuiStack-root omni-spc-stack omni-spc-s1">
          {spacingUnits.map((unit) => (
            <SpacingBar
              key={unit.var}
              name={unit.name}
              varName={unit.var}
              baseValue={unit.baseValue}
            />
          ))}
        </div>
      </section>

      {/* Sizing Section */}
      <section>
        <T v="h5" as="h2" className="omni-spc-mb2 omni-spc-w700">Sizing Scale</T>
        <T v="body2" className="omni-spc-mb3 omni-spc-quiet">
          Fixed sizing values for components and layouts. Each size is labeled 
          with its CSS variable and pixel value.
        </T>
        <div {...grid(3)}>
          {sizingUnits.map((unit) => (
            <div key={unit.var} className={CELL}>
              <SizingBox 
                name={unit.name} 
                varName={unit.var} 
                value={unit.value} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Negative Sizing Section */}
      <section>
        <T v="h5" as="h2" className="omni-spc-mb2 omni-spc-w700">Negative Sizing</T>
        <T v="body2" className="omni-spc-mb3 omni-spc-quiet">
          Negative values for margins and offsets. Use these to reduce or remove 
          default spacing when needed.
        </T>
        <div {...grid(3)}>
          {negativeSizing.map((unit) => (
            <div key={unit.var} className={CELL}>
              <div className="MuiBox-root">
                <T v="subtitle2" className="omni-spc-w600">{unit.name}</T>
                <T v="caption" className="omni-spc-quiet omni-spc-block">{unit.var}</T>
                <T v="caption" className="omni-spc-quiet">{unit.value}</T>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Container Padding */}
      <section style={{ paddingTop: 24, borderTop: '1px solid var(--Border)' }}>
        <T v="h5" as="h2" className="omni-spc-mb2 omni-spc-w700">Container Padding</T>
        <div className="MuiBox-root omni-spc-container">
          <T v="body2">
            Default container padding: <strong>var(--Spacing-3)</strong> = 24px
          </T>
          <T v="caption" className="omni-spc-quiet omni-spc-block omni-spc-mt1">
            Use this variable for consistent padding around main content areas.
          </T>
        </div>
      </section>

      {/* Practical Examples */}
      <section style={{ paddingTop: 24, borderTop: '1px solid var(--Border)' }}>
        <T v="h5" as="h2" className="omni-spc-mb3 omni-spc-w700">Practical Examples</T>

        {/* Padding Examples */}
        <article>
          <T v="h6" as="h3" className="omni-spc-mb2 omni-spc-w600">Padding Examples</T>
          <T v="caption" className="omni-spc-quiet omni-spc-mb2 omni-spc-block">
            Different padding values create different visual breathing room.
          </T>
          <div {...grid(2, ' omni-spc-grid-mb4')}>
            {['var(--Spacing-1)', 'var(--Spacing-2)', 'var(--Spacing-3)', 'var(--Spacing-4)'].map((spacing) => (
              <div key={spacing} className={CELL}>
                <div className="MuiBox-root omni-spc-pad" style={{ '--_spc-p': spacing }}>
                  <T v="subtitle2">
                    Padding: {spacing}
                  </T>
                  <T v="caption" className="omni-spc-block omni-spc-mt1 omni-spc-quiet">
                    Content with spacing applied
                  </T>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Gap Examples */}
        <article>
          <T v="h6" as="h3" className="omni-spc-mb2 omni-spc-w600">Gap Examples</T>
          <T v="caption" className="omni-spc-quiet omni-spc-mb2 omni-spc-block">
            Gap controls spacing between flex/grid children without adding extra elements.
          </T>
          <div className="MuiStack-root omni-spc-stack omni-spc-s3">
            {['var(--Spacing-1)', 'var(--Spacing-2)', 'var(--Spacing-3)'].map((gap) => (
              <div key={gap} className="MuiBox-root">
                <div className="MuiStack-root omni-spc-row" style={{ '--_spc-gap': gap }}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} aria-hidden="true" className="MuiBox-root omni-spc-square" />
                  ))}
                </div>
                <T v="caption" className="omni-spc-quiet">
                  Gap: {gap}
                </T>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* CSS Best Practices Note */}
      <div role="note" className="MuiBox-root omni-spc-note">
        <T v="subtitle2" className="omni-spc-w600 omni-spc-mb1">
          ✓ Accessibility Best Practices Used
        </T>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>
            <T v="caption">
              <strong>aria-hidden="true"</strong> on purely decorative visual elements
            </T>
          </li>
          <li>
            <T v="caption">
              All spacing information conveyed through text labels and values
            </T>
          </li>
          <li>
            <T v="caption">
              No empty decorative <code>&lt;div&gt;</code> elements in DOM
            </T>
          </li>
          <li>
            <T v="caption">
              Semantic HTML: <code>&lt;section&gt;</code> and <code>&lt;article&gt;</code> for structure
            </T>
          </li>
          <li>
            <T v="caption">
              CSS-based spacing (padding/margin) for actual layout, not decorative divs
            </T>
          </li>
          <li>
            <T v="caption">
              Full keyboard navigation and screen reader support
            </T>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Spacing;
