import { floatingLabelGeometry, ADORNMENT_GAP } from './Input';

/* The two offsets were constants — 16px down, +32px right with a start
   adornment. Each was tuned for one size and wrong at the others, and the
   errors ran in opposite directions: the vertical one grew as the field got
   TALLER, the horizontal one grew as the icon got SMALLER. */

const SIZES = {
  small:  { height: '48px', fontSize: '14px', fontPx: 14, leftPad: 12, iconSize: 16 },
  medium: { height: '56px', fontSize: '16px', fontPx: 16, leftPad: 12, iconSize: 20 },
  large:  { height: '64px', fontSize: '18px', fontPx: 18, leftPad: 16, iconSize: 32 },
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
    // icon + one 12px gap (Figma's Sizing-1-and-Half): 16+12 / 20+12 / 32+12.
    expect(floatingLabelGeometry(SIZES.small,  true).clearance).toBe(28);
    expect(floatingLabelGeometry(SIZES.medium, true).clearance).toBe(32);
    expect(floatingLabelGeometry(SIZES.large,  true).clearance).toBe(44);
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
    expect(floatingLabelGeometry(SIZES.small).restingY).toBe(14);
    expect(floatingLabelGeometry(SIZES.medium).restingY).toBe(16);
    expect(floatingLabelGeometry(SIZES.large).restingY).toBe(19);
  });

  test('centred to within a pixel at every size', () => {
    for (const [n, cfg] of Object.entries(SIZES)) {
      const h = parseInt(cfg.height, 10);
      const box = parseInt(cfg.fontSize, 10) * 1.5;
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
  test('the mapping is Body at rest, Floating-Label raised', () => {
    // Figma's Dynamic-Floating-Label style, 11 / 12 / 14 at weight 500.
    expect(FLOATING_LABEL_STYLE).toEqual({
      small:  { resting: 'Body-Small',  shrunk: 'Small' },
      medium: { resting: 'Body-Medium', shrunk: 'Medium' },
      large:  { resting: 'Body-Large',  shrunk: 'Large' },
    });
  });

  test.each(Object.entries(FLOATING_LABEL_STYLE))(
    '%s renders both token families', (size, { resting, shrunk }) => {
      const { unmount } = render(
        <Input label="Email" labelPosition="floating" size={size} />,
      );
      const css = sheet();
      expect(css).toContain('--' + resting + '-Font-Size');
      expect(css).toContain('--Floating-Label-' + shrunk + '-Font-Size');
      unmount();
    });

  test('the shrunk label carries its own weight and tracking', () => {
    /* The point of a real Label style over a scaled Body — scale() would have
       shrunk these along with the size. */
    render(<Input label="Email" labelPosition="floating" size="large" />);
    expect(sheet()).toContain('--Floating-Label-Font-Weight');
    expect(sheet()).toContain('--Floating-Label-Letter-Spacing');
  });

  test('no scale() survives on the label', () => {
    render(<Input label="Email" labelPosition="floating" size="large" />);
    const rules = sheet().split('}').filter(r => r.includes('--Floating-Label-Large-Font-Size'));
    expect(rules.join('')).not.toContain('scale(');
  });

  test('NumberField shares the map rather than copying it', () => {
    /* Structural, not behavioural: two copies of a mapping drift the first time
       one is edited, and the drift is invisible until the two controls sit side
       by side. NumberField now draws its field WITH Input, so it carries Input's
       floating label (and its map) rather than a copy of either. */
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '../NumberField/NumberField.js'), 'utf8');
    expect(src).toMatch(/from '\.\.\/Input\/Input'/);
    expect(src).not.toContain('NF_LABEL_STYLE');
    expect(src).not.toContain('LABEL_STYLE = {');
  });
});

describe('the label rests until there is focus or content', () => {
  const { render, screen, fireEvent } = require('@testing-library/react');
  const { Input } = require('./Input');
  const label = () => document.querySelector('.MuiInputLabel-root');
  test('an empty field with a start icon keeps its label down', () => {
    render(<Input label="Name" labelPosition="floating" startAdornment={<span>$</span>} />);
    expect(label()).not.toHaveClass('MuiInputLabel-shrink');
  });
  test('focus raises it, blur on an empty field lowers it', () => {
    render(<Input label="Name" labelPosition="floating" startAdornment={<span>$</span>} />);
    const input = screen.getByLabelText('Name');
    fireEvent.focus(input);
    expect(label()).toHaveClass('MuiInputLabel-shrink');
    fireEvent.blur(input);
    expect(label()).not.toHaveClass('MuiInputLabel-shrink');
  });
  test('content keeps it raised', () => {
    render(<Input label="Name" labelPosition="floating" defaultValue="Jane" startAdornment={<span>$</span>} />);
    expect(label()).toHaveClass('MuiInputLabel-shrink');
  });
});

describe('standard and left labels are the FormLabel', () => {
  const { render, screen } = require('@testing-library/react');
  const { Input } = require('./Input');
  test('the label is a FormLabel associated with the field', () => {
    render(<Input label="Name" />);
    expect(document.querySelector('.form-label-row label.form-label')).toBeInTheDocument();
    expect(screen.getByLabelText('Name').tagName).toBe('INPUT');
  });
  test('labelType carries the marker through', () => {
    render(<Input label="Name" labelType="optional" />);
    expect(screen.getByLabelText(/Name.*Optional/)).toBeInTheDocument();
  });
  test('left puts the label in its own column', () => {
    const { container } = render(<Input label="Name" labelPosition="left" helperText="Help" />);
    expect(container.firstChild.querySelector(':scope > .form-label-row')).toBeInTheDocument();
    expect(getComputedStyle(container.firstChild).display).toBe('grid');
  });
});
