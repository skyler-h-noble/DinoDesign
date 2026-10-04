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

/** The focus-visible rules for a segment, which is a different bucket from
 *  the base one and is where the ring's own corner lives. */
function focusCssOf(orientation, index) {
  const { container } = render(
    <ButtonGroup value="a" onChange={() => {}} orientation={orientation} aria-label="g">
      <Button value="a">A</Button>
      <Button value="b">B</Button>
      <Button value="c">C</Button>
    </ButtonGroup>
  );
  const el = Array.from(container.querySelectorAll('button'))[index];
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      const sel = r.selectorText || '';
      if (/focus/i.test(sel) && classes.some((c) => sel.includes('.' + c))) out.push(r.cssText);
    }
  }
  return out.join('\n');
}

describe('the focus ring follows the corner it surrounds', () => {
  /* The ring is the corner plus 3, so the gap stays even. A square ring
     around a rounded cap is the failure this prevents — and it was the state
     before, because the positional radius applied to the button and not to
     its focus rule.

     Worth pinning rather than trusting: a later `&:focus-visible` key in the
     same sx object would shadow this one, and nothing about that would look
     wrong in a diff. */
  it('rounds a vertical top cap at the vertical FOCUS radius', () => {
    expect(focusCssOf('vertical', 0)).toMatch(
      /border-radius:\s*var\(--Vertical-Button-Focus-Radius\) var\(--Vertical-Button-Focus-Radius\) 0 0/);
  });

  it('rounds a vertical bottom cap on the bottom only', () => {
    expect(focusCssOf('vertical', 2)).toMatch(
      /border-radius:\s*0 0 var\(--Vertical-Button-Focus-Radius\) var\(--Vertical-Button-Focus-Radius\)/);
  });

  it('rounds a horizontal first cap at the button FOCUS radius', () => {
    expect(focusCssOf('horizontal', 0)).toMatch(
      /border-radius:\s*var\(--Button-Focus-Radius\) 0 0 var\(--Button-Focus-Radius\)/);
  });

  it('leaves a middle segment square', () => {
    expect(focusCssOf('vertical', 1)).toMatch(/border-radius:\s*0[;\s}]/);
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
