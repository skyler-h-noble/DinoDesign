import { floatingLabelGeometry, ADORNMENT_GAP } from './Input';

/* The two offsets were constants — 16px down, +32px right with a start
   adornment. Each was tuned for one size and wrong at the others, and the
   errors ran in opposite directions: the vertical one grew as the field got
   TALLER, the horizontal one grew as the icon got SMALLER. */

const SIZES = {
  small:  { height: '48px', fontSize: '13px', leftPad: 12, iconSize: 16 },
  medium: { height: '56px', fontSize: '15px', leftPad: 14, iconSize: 18 },
  large:  { height: '64px', fontSize: '17px', leftPad: 16, iconSize: 20 },
};

describe('horizontal', () => {
  test('no adornment: the label reads the same token as the text', () => {
    /* Not a number equal to the padding — the TOKEN. The input's own inset is
       var(--Input-Padding, <leftPad>px), where the number is only a fallback,
       and the generated CSS defines that variable as 4px (2px below an 8px
       radius). A literal leftPad here put the label at 14px while the text sat
       at 4px: ten pixels apart, on every plain field, with both values
       individually reasonable so nothing reported it. */
    for (const [n, cfg] of Object.entries(SIZES)) {
      expect([n, floatingLabelGeometry(cfg, false).labelX])
        .toEqual([n, `var(--Input-Padding, ${cfg.leftPad}px)`]);
    }
  });

  test('a bare number can never come back', () => {
    // The failure mode is a label that agrees with the FALLBACK and disagrees
    // with the variable, which looks correct until a design system loads.
    for (const cfg of Object.values(SIZES)) {
      for (const withAdornment of [false, true]) {
        const { labelX } = floatingLabelGeometry(cfg, withAdornment);
        expect(typeof labelX).toBe('string');
        expect(labelX).toContain('var(--Input-Padding');
      }
    }
  });

  test('with an adornment: clears exactly what the adornment occupies', () => {
    /* margin + icon + gap = 36 / 40 / 44, not the old flat 44 / 46 / 48.
       These were 32 / 36 / 40 while the gap was split between the adornment's
       4px marginRight and a 4px input paddingLeft; the label counted only one
       half, so it sat 4px inside the text at every size. One ADORNMENT_GAP of
       8 now, counted once, by both. */
    expect(floatingLabelGeometry(SIZES.small,  true).clearance).toBe(24);
    expect(floatingLabelGeometry(SIZES.medium, true).clearance).toBe(26);
    expect(floatingLabelGeometry(SIZES.large,  true).clearance).toBe(28);
  });

  test('the label starts where the input text starts', () => {
    /* The property that actually matters — if these disagree, the label jumps
       sideways the moment it shrinks, which is what the bug looked like. */
    /* Both sides are now the same expression: the token, plus what the
       adornment occupies. Asserting the composed string is what makes "one
       source" checkable — the previous version compared two numbers, which
       agreed with each other and disagreed with the CSS. */
    for (const cfg of Object.values(SIZES)) {
      const clearance = cfg.iconSize + ADORNMENT_GAP;
      expect(floatingLabelGeometry(cfg, true).labelX)
        .toBe(`calc(var(--Input-Padding, ${cfg.leftPad}px) + ${clearance}px)`);
    }
  });
});

describe('vertical', () => {
  test('the resting label is centred in the field', () => {
    expect(floatingLabelGeometry(SIZES.small).restingY).toBe(15);
    expect(floatingLabelGeometry(SIZES.medium).restingY).toBe(17);
    expect(floatingLabelGeometry(SIZES.large).restingY).toBe(20);
  });

  test('centred to within a pixel at every size', () => {
    for (const [n, cfg] of Object.entries(SIZES)) {
      const h = parseInt(cfg.height, 10);
      const box = parseInt(cfg.fontSize, 10) * 1.4375;
      const centre = floatingLabelGeometry(cfg).restingY + box / 2;
      expect(Math.abs(centre - h / 2)).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('the constants cannot come back', () => {
  test('no two sizes share a geometry', () => {
    const seen = new Set(
      Object.values(SIZES).map(c => JSON.stringify(floatingLabelGeometry(c, true))),
    );
    expect(seen.size).toBe(3);
  });

  test('missing config falls back without producing NaN', () => {
    const g = floatingLabelGeometry({}, true);
    // labelX and padX are CSS lengths now; the rest stay numeric.
    for (const [k, v] of Object.entries(g)) {
      if (typeof v === 'string') expect(v).not.toContain('NaN');
      else expect([k, Number.isFinite(v)]).toEqual([k, true]);
    }
  });
});

// ─── Text styles ─────────────────────────────────────────────────────────────

import { render } from '@testing-library/react';
import React from 'react';
import { Input, FLOATING_LABEL_STYLE } from './Input';

/* The floating label is two design-system styles, not one size scaled.
 *
 * It used to be hardcoded pixels (13/15/17) with scale(0.75), so a large
 * field's shrunk label rendered at 12.75px — a number in no token, matching no
 * style. And scale() shrinks the RENDERED PIXELS, so weight and tracking shrank
 * with it: a squashed Body rather than a Label.
 *
 * Asserted against the emotion stylesheet, not innerHTML — emotion emits class
 * names into the DOM and the declarations into <style> in the head, so an
 * innerHTML assertion here would pass whatever the values were. */
const sheet = () => {
  /* Emotion inserts through CSSOM (insertRule) rather than as text nodes, so
     style.textContent is empty — read the rules themselves. */
  let css = '';
  for (const ss of Array.from(document.styleSheets)) {
    let rules;
    try { rules = ss.cssRules; } catch { continue; }
    for (const r of Array.from(rules || [])) css += r.cssText || '';
  }
  return css + Array.from(document.querySelectorAll('style'))
    .map(s => s.textContent).join('');
};

describe('floating label uses design-system text styles', () => {
  test('the mapping is Body at rest, Label shrunk', () => {
    expect(FLOATING_LABEL_STYLE).toEqual({
      small:  { resting: 'Body-Small',  shrunk: 'Label-ExtraSmall' },
      medium: { resting: 'Body-Medium', shrunk: 'Label-Small' },
      large:  { resting: 'Body-Large',  shrunk: 'Label-Medium' },
    });
  });

  test.each(Object.entries(FLOATING_LABEL_STYLE))(
    '%s renders both token families', (size, { resting, shrunk }) => {
      const { unmount } = render(
        <Input label="Email" labelPosition="floating" size={size} />,
      );
      const css = sheet();
      expect(css).toContain('--' + resting + '-Font-Size');
      expect(css).toContain('--' + shrunk + '-Font-Size');
      unmount();
    });

  test('the shrunk label carries its own weight and tracking', () => {
    /* The point of a real Label style over a scaled Body — scale() would have
       shrunk these along with the size. */
    render(<Input label="Email" labelPosition="floating" size="large" />);
    expect(sheet()).toContain('--Label-Medium-Font-Weight');
    expect(sheet()).toContain('--Label-Medium-Letter-Spacing');
  });

  test('no scale() survives on the label', () => {
    render(<Input label="Email" labelPosition="floating" size="large" />);
    const rules = sheet().split('}').filter(r => r.includes('--Label-Medium-Font-Size'));
    expect(rules.join('')).not.toContain('scale(');
  });

  test('NumberField shares the map rather than copying it', () => {
    /* Structural, not behavioural: two copies of a mapping drift the first time
       one is edited, and the drift is invisible until the two controls sit side
       by side. */
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '../NumberField/NumberField.js'), 'utf8');
    expect(src).toContain("FLOATING_LABEL_STYLE");
    expect(src).not.toContain('NF_LABEL_STYLE');
  });
});
