// src/components/a11yPanel.js
//
// The live accessibility panel, shared by every showcase.
//
// This lived inside ButtonShowcase.js, which meant Button was the only
// component whose contrast was actually measured against the surface you had
// selected. Everywhere else the Accessibility tab was prose: true statements
// about what the thresholds ARE, with nothing checking them. Extracted so the
// measurement is the same everywhere rather than reimplemented per component
// and drifting.
import React, { useState, useEffect } from 'react';
import { BodySmall, Caption } from './Typography';
import { getContrast, getCssVarFrom } from './contrast';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';

/* One sheet for the panel. The pass / fail / unmeasured verdict is a class,
   not an inline color, so the three states are read in one place. */
registerStaticStyles('omni-a11y-panel', [
  '.omni-a11y-badge{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;white-space:nowrap;flex-shrink:0;'
    + 'color:var(--Buttons-Error-Text);background-color:var(--Buttons-Error-Button);border:none}',
  '.omni-a11y-badge-pass{color:var(--Buttons-Success-Text);background-color:var(--Buttons-Success-Button)}',
  '.omni-a11y-badge-none{color:var(--Text-Quiet);background-color:transparent;border:1px solid var(--Border)}',
  '.omni-a11y-note{margin-bottom:24px;padding:16px;border-left:3px solid var(--Border);background-color:var(--Hover)}',
  '.omni-a11y-row{display:flex;-webkit-box-pack:justify;justify-content:space-between;align-items:flex-start;padding-top:12px;padding-bottom:12px;'
    + 'border-bottom:1px solid var(--Border);gap:16px}',
  '.omni-a11y-label{flex:1;min-width:0}',
].join('\n'));

const badgeClass = (unmeasured, pass) => 'MuiBox-root omni-a11y-badge'
  + (unmeasured ? ' omni-a11y-badge-none' : (pass ? ' omni-a11y-badge-pass' : ''));

/* Three-valued on purpose. null means the ratio could not be MEASURED — a
   token that did not resolve, or a color format the parser does not read —
   and that is not a failure. Rendering it as one invents accessibility bugs
   that are not there, which is worse than reporting nothing: someone then goes
   hunting for a contrast problem that does not exist. */
export function ContrastBadge({ ratio, threshold = 4.5 }) {
  const unmeasured = ratio === null || ratio === undefined || Number.isNaN(ratio);
  const pass = unmeasured ? null : ratio >= threshold;
  useStaticStyles('omni-a11y-panel');
  return (
    <div className={badgeClass(unmeasured, pass)}>
      {unmeasured ? '--' : `${ratio.toFixed(2)}:1 ${pass ? 'PASS' : 'FAIL'}`}
    </div>
  );
}

/**
 * What the numbers below are a verdict ON.
 *
 * Every ratio in this tab is measured against the component AS CONFIGURED IN
 * THE PLAYGROUND — the variant, color, size and surface currently selected
 * there — not against the component in general. Change a control and these
 * numbers change with it.
 *
 * Saying so matters because the two readings lead opposite ways. A FAIL here
 * means "this combination fails", which is a thing the user chose and can
 * change; read as "this component fails" it becomes a bug report against the
 * library for a configuration nobody shipped. And a PASS on the default
 * configuration says nothing about the eight palettes the user did not look
 * at — so a tab that stated no scope was quietly inviting both mistakes.
 *
 * One component, one place: the wording lives here rather than in 54
 * showcases, so it can be corrected once.
 */
export function A11yScopeNote({ configuration }) {
  useStaticStyles('omni-a11y-panel');
  return (
    <div className="MuiBox-root omni-a11y-note">
      <BodySmall>
        These are live measurements of the component <strong>as you have it set
        up in the Playground</strong> — its current variant, color, size and
        surface. Each row is a pass or fail against the threshold named beside
        it. Change a control in Playground and these numbers change.
      </BodySmall>
      {configuration ? (
        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>
          Measuring: {configuration}
        </Caption>
      ) : null}
      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>
        A pass here covers this configuration only. Other palettes and surfaces
        are checked the same way — switch to them to see their numbers. A row
        reading “--” could not be measured and is not a failure.
      </Caption>
    </div>
  );
}

export function A11yRow({ label, ratio, threshold, note }) {
  useStaticStyles('omni-a11y-panel');
  return (
    <div className="MuiBox-root omni-a11y-row">
      <div className="MuiBox-root omni-a11y-label">
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </div>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </div>
  );
}

/* A plain pass/fail, for things that are not a contrast ratio — a touch target
   measured in px, say. Same three-valued rule. */
export function A11yCheckRow({ label, pass, detail, note }) {
  const unmeasured = pass === null || pass === undefined;
  useStaticStyles('omni-a11y-panel');
  return (
    <div className="MuiBox-root omni-a11y-row">
      <div className="MuiBox-root omni-a11y-label">
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </div>
      <div className={badgeClass(unmeasured, pass)}>
        {unmeasured ? '--' : `${detail ? detail + ' ' : ''}${pass ? 'PASS' : 'FAIL'}`}
      </div>
    </div>
  );
}

/**
 * Read resolved CSS custom properties off a mounted element.
 *
 * Deferred with setTimeout and NOT requestAnimationFrame: rAF does not fire in
 * a background or hidden tab, so a page opened in one measured nothing, and
 * because the deps do not change afterwards it never retried — every row read
 * "--" forever, even once the tab was focused.
 *
 * It also RETRIES, because the element can mount later than the effect: the
 * preview often lives inside the Playground tab while the landing tab is
 * Summary, so on first paint there is nothing to measure. Returning early used
 * to end it permanently. Forty tries at 50ms, then stop, so a component with no
 * preview does not poll forever.
 *
 * @param ref   ref to the element whose computed style is read
 * @param read  (v) => data, where v(name) resolves one custom property
 * @param deps  re-measure when these change
 */
export function useMeasuredTokens(ref, read, deps) {
  const [data, setData] = useState({});
  useEffect(() => {
    let tries = 0;
    let t;
    const run = () => {
      const el = ref.current;
      if (!el) {
        if (tries < 40) { tries += 1; t = setTimeout(run, 50); }
        return;
      }
      setData(read((name) => getCssVarFrom(el, name)) || {});
    };
    t = setTimeout(run);
    return () => clearTimeout(t);
  }, deps);
  return data;
}

export { getContrast };
