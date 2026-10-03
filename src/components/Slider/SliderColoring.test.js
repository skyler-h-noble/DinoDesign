import React from 'react';
import { render } from '@testing-library/react';
import { Slider } from './Slider';

/* The slider's contrast holds by CONSTRUCTION, not by check — each pairing is
   chosen so the required ratio is guaranteed by which tokens meet, and that is
   only true while these specific tokens are the ones meeting. */

const css = () => Array.from(document.styleSheets)
  .flatMap(ss => { try { return Array.from(ss.cssRules); } catch { return []; } })
  .map(r => r.cssText).join('');

describe('the focus indicator is measurable', () => {
  test('the thumb carries a 1px --Background border', () => {
    /* Not decoration. It separates the handle from the fill it sits on AND
       from the focus ring outside it, so both comparisons are against a known
       color rather than against whatever the handle happens to overlap. */
    render(<Slider defaultValue={40} />);
    expect(css().replace(/\s+/g, '')).toContain('1pxsolidvar(--Background)');
  });

  test('focus adds --Focus-Visible flush against it, with no gap', () => {
    /* It was `outline: 2px --Focus-Visible` with `outline-offset: 2px`, and the
       gap is the bug: it shows whatever is BEHIND the thumb — rail, fill, or
       page — so the 3:1 was measured against an unknown that changes as the
       thumb moves along the track. */
    render(<Slider defaultValue={40} />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('0001pxvar(--Focus-Visible)');
    expect(c).not.toContain('outline-offset:2px');
  });
});

describe('surface tokens, not the button palette', () => {
  test('the rail has a button-palette edge, not a decorative one', () => {
    /* It was --Border-Variant as a fill with no edge, and Border-Variant is the
       token documented as DECORATIVE — no contrast requirement. A slider rail is
       the boundary of an interactive control, so it needs an edge that carries
       one.

       That edge was the surface --Border and is now --Buttons-{C}-Border, to
       match what Figma binds. The two are identical at `default`, so this test
       reads the same either way; what changed is which token carries the
       requirement once a colour is set. The point it has always defended — that
       the rail HAS an edge, and not a decorative one — is unchanged. */
    render(<Slider defaultValue={40} />);
    const c = css().replace(/\s+/g, '');
    /* Primary, not Default: Slider's own default variant is 'primary'. That
       contradicts the house rule that components default to `default` and
       never to primary — recorded here because the test is where it surfaced,
       not fixed here, because changing a default recolours every existing
       slider. */
    expect(c).toContain('1pxsolidvar(--Buttons-Primary-Border)');
    expect(c).not.toContain('var(--Border-Variant)');
  });

  test('the label inverts the surface pair', () => {
    // --Text ground with --Background text: legible on any surface by
    // definition, which a color from the button palette is not.
    render(<Slider defaultValue={40} valueLabelDisplay="on" />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('background-color:var(--Text)');
    expect(c).toContain('color:var(--Background)');
  });

  test('the label uses a real text style, not hardcoded pixels', () => {
    render(<Slider defaultValue={40} valueLabelDisplay="on" />);
    expect(css()).toContain('--Label-ExtraSmall-Font-Size');
  });

  test('...including its weight', () => {
    /* There were two fontWeight keys in the same object — the token, then a
       literal 600 below it. The later key silently won, so the label read
       three of its four properties from the type scale and invented the
       fourth, which is invisible whenever the scale happens to say 600. */
    render(<Slider defaultValue={40} valueLabelDisplay="on" />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('font-weight:var(--Label-ExtraSmall-Font-Weight)');
    expect(c).not.toContain('font-weight:600');
  });
});

describe('a named color moves the fill only', () => {
  test('color="success" themes the fill', () => {
    render(<Slider defaultValue={40} variant="success" />);
    expect(css()).toContain('--Buttons-Success-Button');
  });

  test('...but the thumb and focus stay on surface tokens', () => {
    /* Everything carrying a contrast requirement must not move with the color
       prop, or the guarantee becomes per-palette rather than structural. */
    render(<Slider defaultValue={40} variant="success" />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('1pxsolidvar(--Background)');
    expect(c).toContain('0001pxvar(--Focus-Visible)');
  });
});
