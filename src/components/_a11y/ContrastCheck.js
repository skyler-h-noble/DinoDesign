// src/components/_a11y/ContrastCheck.js
//
// Lightweight contrast checker for showcase Accessibility tabs.
// Reads the actual painted background + foreground colors via
// getComputedStyle, computes the WCAG 2.1 relative-luminance ratio, and
// shows a pass / fail verdict for AA (4.5) and AAA (7) at normal text size.
import React, { useEffect, useState } from 'react';
import { BodySmall, Caption } from '../Typography';

function parseRgb(str) {
  // Handles "rgb(r, g, b)" and "rgba(r, g, b, a)". Returns [r,g,b] or null.
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function rgbToHex(rgb) {
  if (!rgb) return '—';
  return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
}

function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(bg, fg) {
  if (!bg || !fg) return null;
  const L1 = luminance(bg);
  const L2 = luminance(fg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * ContrastCheck — given a ref to a DOM element, reads its background-color
 * and color and shows a pass/fail row.
 *
 * Props:
 *   targetRef — a React ref pointing at a rendered DOM element.
 *   label     — what this row is checking (e.g. "Footer body", "Copyright").
 *   deps      — array of values that, when changed, re-runs the check.
 */
export function ContrastCheck({ targetRef, label, deps = [] }) {
  const [bg, setBg] = useState(null);
  const [fg, setFg] = useState(null);

  useEffect(() => {
    if (!targetRef.current) return;
    // Defer to the next paint so the preset-applied colors are resolved.
    const id = requestAnimationFrame(() => {
      if (!targetRef.current) return;
      const cs = getComputedStyle(targetRef.current);
      setBg(parseRgb(cs.backgroundColor));
      setFg(parseRgb(cs.color));
    });
    return () => cancelAnimationFrame(id);
  }, deps);

  const ratio = contrastRatio(bg, fg);
  const passAA = ratio !== null && ratio >= 4.5;
  const passAAA = ratio !== null && ratio >= 7;
  const verdict = ratio === null
    ? '—'
    : passAAA ? 'AAA' : passAA ? 'AA' : 'Fail';
  const badgeColor = ratio === null
    ? 'var(--Text-Quiet)'
    : passAA ? 'var(--Text-Success)' : 'var(--Text-Error)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 16px',
      borderRadius: 8,
      background: 'var(--Container)',
      border: '1px solid var(--Border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <BodySmall style={{ fontWeight: 600 }}>{label}</BodySmall>
        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
          Background {rgbToHex(bg)} · Text {rgbToHex(fg)}
        </Caption>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        padding: '4px 10px',
        background: 'var(--Background)',
        border: '1px solid var(--Border)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: badgeColor }}>
          {verdict}
        </span>
        <Caption style={{ color: 'var(--Text-Quiet)' }}>
          {ratio !== null ? ratio.toFixed(2) + ':1' : '—'}
        </Caption>
      </div>
    </div>
  );
}

export default ContrastCheck;
