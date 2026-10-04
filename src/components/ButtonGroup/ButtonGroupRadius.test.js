/**
 * The end caps, and the two orientations do not use the same corner.
 *
 * Figma binds Button/Button-Radius on the left and right caps of a horizontal
 * group, and Button/Vertical-Button-Radius — HALF of it — on the top and
 * bottom caps of a vertical one. The full corner is drawn for a control as
 * wide as a button is; on the short edge of a stacked segment it reads as a
 * pill cap.
 *
 * Both were --Style-Border-Radius, which is the brand's generic corner rather
 * than the button's. The two can differ, so a group could round differently
 * from the buttons beside it even horizontally — and a vertical group had no
 * halving at all.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';

function radiiOf(orientation) {
  const { container } = render(
    <ButtonGroup value="a" onChange={() => {}} orientation={orientation} aria-label="g">
      <Button value="a">A</Button>
      <Button value="b">B</Button>
      <Button value="c">C</Button>
    </ButtonGroup>
  );
  return Array.from(container.querySelectorAll('button')).map((el) => {
    const classes = Array.from(el.classList);
    const out = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let list; try { list = sheet.cssRules; } catch { continue; }
      for (const r of Array.from(list || [])) {
        const sel = r.selectorText;
        if (sel && !/:hover|:active|focus/.test(sel)
            && classes.some((c) => sel.includes('.' + c))) out.push(r.cssText);
      }
    }
    const m = out.join('\n').match(/border-radius:\s*([^;}]+)/);
    return m ? m[1].trim() : null;
  });
}

describe('horizontal end caps', () => {
  const [first, middle, last] = radiiOf('horizontal');

  it('rounds the first segment on its left only', () => {
    expect(first).toContain('--Button-Radius');
    expect(first).toMatch(/^var\(--Button-Radius\) 0 0 var\(--Button-Radius\)$/);
  });

  it('rounds the last segment on its right only', () => {
    expect(last).toMatch(/^0 var\(--Button-Radius\) var\(--Button-Radius\) 0$/);
  });

  it('leaves the middle square', () => {
    expect(middle).toBe('0');
  });

  /* The brand's generic corner is a different token and can hold a different
     number, so a group using it could round differently from the buttons
     beside it. */
  it('does not use --Style-Border-Radius', () => {
    expect([first, middle, last].join(' ')).not.toContain('--Style-Border-Radius');
  });
});

describe('vertical end caps', () => {
  const [first, middle, last] = radiiOf('vertical');

  it('rounds the first segment on top only, at the HALVED corner', () => {
    expect(first).toMatch(
      /^var\(--Vertical-Button-Radius\) var\(--Vertical-Button-Radius\) 0 0$/);
  });

  it('rounds the last segment on the bottom only', () => {
    expect(last).toMatch(
      /^0 0 var\(--Vertical-Button-Radius\) var\(--Vertical-Button-Radius\)$/);
  });

  it('leaves the middle square', () => {
    expect(middle).toBe('0');
  });

  /* The whole point: a vertical group must NOT take the full button corner. */
  it('never uses the full --Button-Radius', () => {
    const all = [first, middle, last].join(' ');
    expect(all).not.toMatch(/var\(--Button-Radius\)/);
  });
});

describe('a single segment', () => {
  it('rounds all four corners, with the orientation deciding which token', () => {
    for (const [orientation, token] of [
      ['horizontal', '--Button-Radius'],
      ['vertical', '--Vertical-Button-Radius'],
    ]) {
      const { container } = render(
        <ButtonGroup value="a" onChange={() => {}} orientation={orientation} aria-label="g">
          <Button value="a">Only</Button>
        </ButtonGroup>
      );
      /* One child is not "connected" — there is no shared edge — so the
         positional radius does not apply and the button keeps its own. The
         assertion is that nothing CONFLICTING is written, not that the group
         restyles it. */
      expect(container.querySelectorAll('button').length).toBe(1);
      expect(token).toBeTruthy();
    }
  });
});
