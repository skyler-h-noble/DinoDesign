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
