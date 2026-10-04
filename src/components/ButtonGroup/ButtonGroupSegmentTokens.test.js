/**
 * An unselected segment's label comes from the group's palette.
 *
 * Figma binds Buttons/Outline-Quiet at rest and Buttons/Outline-Text on
 * hover, pressed and focus — consistently across Button-Group-Segments and
 * Separated-Button-Segments, both styles, all 180 and 60 variants.
 *
 * This file used --Quiet and --Text, the SURFACE roles. Right shape, wrong
 * table: an outline segment in a success group had exactly the same label as
 * one in an error group, so while nothing was selected the group's colour was
 * invisible. The FILLS are surface tokens and stay that way — an unselected
 * segment has no fill of its own, so its hover tint is the surface's scrim.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';

/** Rules for an element, split by whether the selector has a pseudo-class. */
function rulesFor(el) {
  const classes = Array.from(el.classList);
  const base = [];
  const states = {};
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      const sel = r.selectorText;
      if (!sel || !classes.some((c) => sel.includes('.' + c))) continue;
      const m = sel.match(/:(hover|active)\b|\.Mui-(focusVisible)\b|:(focus-visible)\b/);
      if (m) {
        const key = m[1] || m[2] || m[3];
        states[key] = (states[key] || '') + r.cssText;
      } else base.push(r.cssText);
    }
  }
  return { base: base.join('\n'), states };
}

const colorIn = (css) =>
  [...String(css).matchAll(/(?:^|[;{])\s*color:\s*([^;}]+)/g)].map(m => m[1].trim()).join(' | ');

function segments(color) {
  const { container } = render(
    <ButtonGroup value="a" onChange={() => {}} color={color}>
      <Button value="a">A</Button>
      <Button value="b">B</Button>
    </ButtonGroup>
  );
  const all = Array.from(container.querySelectorAll('button'));
  return { selected: all[0], unselected: all[1] };
}

describe('unselected segment label', () => {
  it('rests on the group palette Outline-Quiet, not the surface --Quiet', () => {
    const { unselected } = segments('success');
    const { base } = rulesFor(unselected);
    expect(colorIn(base)).toContain('--Buttons-Success-Outline-Quiet');
    expect(colorIn(base)).not.toMatch(/var\(--Quiet\)/);
  });

  for (const state of ['hover', 'active', 'focusVisible']) {
    it(`moves to Outline-Text on ${state}`, () => {
      const { unselected } = segments('success');
      const { states } = rulesFor(unselected);
      expect(colorIn(states[state])).toContain('--Buttons-Success-Outline-Text');
    });
  }

  /* The regression that mattered: two groups of different colours had
     identical unselected labels. */
  it('differs between two differently coloured groups', () => {
    const a = colorIn(rulesFor(segments('success').unselected).base);
    const b = colorIn(rulesFor(segments('error').unselected).base);
    expect(a).not.toEqual(b);
    expect(a).toContain('Success');
    expect(b).toContain('Error');
  });

  /* The FILLS are deliberately NOT palette tokens — an unselected segment has
     no fill, so its scrims come from the surface underneath. */
  it('keeps the surface scrims for its hover and pressed fills', () => {
    const { states } = rulesFor(segments('success').unselected);
    expect(states.hover).toContain('var(--Hover)');
    expect(states.active).toContain('var(--Pressed)');
    expect(states.hover).not.toContain('--Buttons-Success-Hover');
  });

  it('paints the selected segment from the palette fill', () => {
    const { base } = rulesFor(segments('success').selected);
    expect(base).toContain('--Buttons-Success-Button');
  });
});

describe('selected segment label', () => {
  /* Same rest/interaction split as every other label: Quiet at rest, Text on
     interaction. It was frozen at Text across all states, so a selected
     segment was the one thing in the group that was loud at rest and had no
     feedback left to give on hover. */
  it('rests on the palette Quiet', () => {
    const { base } = rulesFor(segments('success').selected);
    expect(colorIn(base)).toContain('--Buttons-Success-Quiet');
  });

  for (const state of ['hover', 'active', 'focusVisible']) {
    it(`moves to Text on ${state}`, () => {
      const { states } = rulesFor(segments('success').selected);
      expect(colorIn(states[state])).toContain('--Buttons-Success-Text');
    });
  }

  /* The FILL stays put while the label moves. --Buttons-{C}-Hover is a
     lighter tone, so a selected segment that took it lightened on hover and
     read as deselecting. Figma does move the fill, so this is a recorded
     divergence — the assertion exists so a future change to it is deliberate
     rather than accidental.

     Asserted as the PRESENCE of the !important override rather than the
     absence of --Buttons-{C}-Hover. `rulesFor` buckets every rule matching
     the element, so the Button's own hover rule is in the same string even
     though the override beats it on specificity; an absence check there fails
     on correct code. */
  it('keeps its fill frozen across the pointer states', () => {
    const { states } = rulesFor(segments('success').selected);
    expect(states.hover).toMatch(
      /background-color:\s*var\(--Buttons-Success-Button\)\s*!important/);
  });
});
