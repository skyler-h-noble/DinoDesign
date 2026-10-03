/**
 * The slider's rail, track, thumb and focus ring match the Figma Slider.
 *
 * Read off the Slider set (6791:14897) and its thumb sets:
 *   Slider Back Bar  fills Surface::Background   strokes Buttons::Border
 *   Fill             fills Buttons::Button       strokes Buttons::Border
 *   Handle           fills Buttons::Border       strokes Surface::Background
 *   Label            fills Surface::Text, text Surface::Background
 *   Focus-Visible    Handle | 4px Buttons Button | 1px Focus-Visible | 1px Background
 *
 * The one that mattered most could not be seen by reading the code: the track
 * for `color="default"` was `var(--Button)` with no fallback, and --Button is
 * defined nowhere — not foundation.css, not base.css, not any brand bundle. An
 * undefined custom property with no fallback is invalid at computed-value time,
 * so the DEFAULT slider painted no fill at all and rendered as a bare outline.
 * Every named colour worked, which is exactly why it lasted: the broken case
 * was the one that looks like a deliberate style.
 */
import React from 'react';
import { render } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { Slider } from './Slider';

const cssFor = (el) => {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (!r.selectorText || !classes.some((c) => r.selectorText.includes('.' + c))) continue;
      out.push(r.cssText);
    }
  }
  return out.join('\n');
};
/* The rail, track and thumb are CHILD elements with their own emotion classes,
   so collecting only the root's rules misses every colour this file is about. */
const rootCss = (jsx) => {
  const { container } = render(jsx);
  const root = container.querySelector('.MuiSlider-root');
  const els = [root, ...root.querySelectorAll('*')];
  return els.map(cssFor).join('\n');
};

describe('Slider colors match Figma', () => {
  it('never references an undefined token for the fill', () => {
    /* var(--Button) — no s, no palette — is not a token in this system. */
    for (const color of ['default', 'primary', 'success']) {
      const css = rootCss(<Slider value={50} color={color} />);
      expect(`${color} uses var(--Button): ${/var\(--Button\)/.test(css)}`)
        .toBe(`${color} uses var(--Button): false`);
    }
  });

  /* These two read the SOURCE rather than rendered CSS. The rail and track are
     styled through nested `& .MuiSlider-rail` selectors, which emotion does not
     surface as separate cssRules under jsdom — a render assertion here tests
     the harness, not the component. The token NAMES are what parity is about,
     and they are visible in the file. */
  it('fills the track from the Buttons palette for every colour', () => {
    const src = fs.readFileSync(path.join(__dirname, 'Slider.js'), 'utf8');
    expect(src).toMatch(/track:\s*'var\(--Buttons-' \+ C \+ '-Button\)'/);
  });

  it('keeps rail, track edge and thumb on the SURFACE border, not the palette', () => {
    /* A KNOWN divergence from Figma, pinned so it stays deliberate.
       Figma binds the Handle and both bar edges to Buttons::Border. The code
       uses --Border, because each of those carries a contrast requirement
       against the surface and --Border is the 3:1 token guaranteed against it;
       --Buttons-{C}-Border is guaranteed against its own button fill, which is
       a different comparison. The two agree at `default` and diverge the moment
       a colour is set — so following Figma here would move the edge to a token
       nothing has checked against the page, invisibly. */
    const src = fs.readFileSync(path.join(__dirname, 'Slider.js'), 'utf8');
    for (const k of ['thumb', 'trackBorder', 'railBorder']) {
      const line = src.match(new RegExp(`\\b${k}:\\s*([^,]+),`))?.[1] || '';
      expect(`${k} on surface --Border: ${/var\(--Border\)/.test(line)}`)
        .toBe(`${k} on surface --Border: true`);
    }
  });

  it('keeps the focus ring flush, with no halo between', () => {
    /* The other known divergence. Figma draws a 4px Buttons/Default/Button halo
       between the thumb's --Background edge and the Focus-Visible ring, plus a
       second --Background ring outside. Reproducing it moves the ring's
       comparison from Focus-Visible-against-Background, which is guaranteed, to
       Focus-Visible-against-a-button-colour, which is not — and a gap showing
       something other than a known colour is the exact failure the flush
       construction was introduced to fix. */
    const css = rootCss(<Slider value={50} />);
    const rule = css.split('\n').find((r) => /focus-visible|Mui-focusVisible/.test(r)) || '';
    expect(`flush 1px ring: ${/0 0 0 1px var\(--Focus-Visible\)/.test(rule)}`)
      .toBe('flush 1px ring: true');
    expect(`halo present: ${/0 0 0 4px/.test(rule)}`).toBe('halo present: false');
  });

  it('keeps the value label on the surface pair', () => {
    /* --Text on --Background is legible on any surface by definition; a button
       palette colour is not. Figma agrees — Label is Surface::Text. */
    const css = rootCss(<Slider value={50} color="error" valueLabelDisplay="on" />);
    expect(css).toMatch(/var\(--Text\)/);
  });
});
