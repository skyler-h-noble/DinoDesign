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
import { Box } from '@mui/material';
import { BodySmall, Caption } from './Typography';
import { getContrast, getCssVarFrom } from './contrast';

/* Three-valued on purpose. null means the ratio could not be MEASURED — a
   token that did not resolve, or a color format the parser does not read —
   and that is not a failure. Rendering it as one invents accessibility bugs
   that are not there, which is worse than reporting nothing: someone then goes
   hunting for a contrast problem that does not exist. */
export function ContrastBadge({ ratio, threshold = 4.5 }) {
  const unmeasured = ratio === null || ratio === undefined || Number.isNaN(ratio);
  const pass = unmeasured ? null : ratio >= threshold;
  return (
    <Box sx={{
      px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
      whiteSpace: 'nowrap', flexShrink: 0,
      color: unmeasured ? 'var(--Text-Quiet)' : (pass ? 'var(--Buttons-Success-Text)' : 'var(--Buttons-Error-Text)'),
      backgroundColor: unmeasured ? 'transparent' : (pass ? 'var(--Buttons-Success-Button)' : 'var(--Buttons-Error-Button)'),
      border: unmeasured ? '1px solid var(--Border)' : 'none',
    }}>
      {unmeasured ? '--' : `${ratio.toFixed(2)}:1 ${pass ? 'PASS' : 'FAIL'}`}
    </Box>
  );
}

/**
 * What the numbers below are a verdict ON.
 *
 * Every ratio in this tab is measured against the component AS CONFIGURED IN
 * THE PLAYGROUND — the variant, colour, size and surface currently selected
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
  return (
    <Box sx={{
      mb: 3, p: 2,
      borderLeft: '3px solid var(--Border)',
      backgroundColor: 'var(--Hover)',
    }}>
      <BodySmall>
        These are live measurements of the component <strong>as you have it set
        up in the Playground</strong> — its current variant, colour, size and
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
    </Box>
  );
}

export function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
               py: 1.5, borderBottom: '1px solid var(--Border)', gap: 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}

/* A plain pass/fail, for things that are not a contrast ratio — a touch target
   measured in px, say. Same three-valued rule. */
export function A11yCheckRow({ label, pass, detail, note }) {
  const unmeasured = pass === null || pass === undefined;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
               py: 1.5, borderBottom: '1px solid var(--Border)', gap: 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        whiteSpace: 'nowrap', flexShrink: 0,
        color: unmeasured ? 'var(--Text-Quiet)' : (pass ? 'var(--Buttons-Success-Text)' : 'var(--Buttons-Error-Text)'),
        backgroundColor: unmeasured ? 'transparent' : (pass ? 'var(--Buttons-Success-Button)' : 'var(--Buttons-Error-Button)'),
        border: unmeasured ? '1px solid var(--Border)' : 'none',
      }}>
        {unmeasured ? '--' : `${detail ? detail + ' ' : ''}${pass ? 'PASS' : 'FAIL'}`}
      </Box>
    </Box>
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
