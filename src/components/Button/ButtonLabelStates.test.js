/**
 * The label is muted at rest and full strength on interaction.
 *
 * Figma binds this uniformly across all 80 variants of the Button set:
 *
 *   Style    Default / Disabled      Hover / Pressed / Focus-Visible
 *   solid    Buttons/Quiet           Buttons/Text
 *   outline  Buttons/Outline-Quiet   Buttons/Outline-Text
 *   ghost    Buttons/Outline-Quiet   Buttons/Outline-Text
 *
 * Measured values on the default palette: #464646 → #101010 for solid,
 * #787878 at rest for outline. The icon inside takes the SAME token as the
 * label, which happens for free here because Icon paints `currentColor` and
 * the button root owns the color.
 *
 * Disabled uses the REST token, not a third one — disabled is the resting
 * button with opacity 0.38 and nothing else rebound.
 *
 * SELECTED is the exception, and the only one. It decides which PAIR applies
 * by deciding whether there is a FILL — Quiet/Text with one,
 * Outline-Quiet/Outline-Text without — and then pins to that pair's Text end,
 * at rest and on interaction alike. A selected segment is the engaged one;
 * muting it would make the chosen option read quieter than the options beside
 * it, which inverts what a group is for.
 *
 * Before this, every state used the interaction token: a button had no label
 * change to give on hover, and Outline-Quiet had no consumer anywhere in the
 * library. That made the token look unused rather than making the rest state
 * look missing, which is why it survived as an "orphan token" question.
 *
 * These tests separate the BASE rule from the pseudo-class rules. Asserting
 * only that a token appears somewhere in the button's CSS cannot tell the two
 * states apart — the earlier Outline-Text test kept passing once Outline-Text
 * moved to hover, while the rest state had changed underneath it.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';

/** Rules for this element, split by whether the selector has a pseudo-class. */
function rulesFor(el) {
  const classes = Array.from(el.classList);
  const base = [];
  const states = {};
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      const sel = r.selectorText;
      if (!sel || !classes.some((c) => sel.includes('.' + c))) continue;
      const m = sel.match(/:(hover|active)\b|\.Mui-(focusVisible|disabled)\b/);
      if (m) {
        const key = m[1] || m[2];
        states[key] = (states[key] || '') + r.cssText;
      } else {
        base.push(r.cssText);
      }
    }
  }
  return { base: base.join('\n'), states };
}

const probe = (jsx) => rulesFor(render(jsx).container.querySelector('button'));

/* `color:` only — a token can also appear as a background or border in the
   same rule, and matching the whole rule text would conflate them. */
const colorIn = (css) => {
  const hits = [...String(css).matchAll(/(?:^|[;{])\s*color:\s*([^;}]+)/g)].map((m) => m[1].trim());
  return hits.join(' | ');
};

describe('solid button label: Quiet at rest, Text on interaction', () => {
  it('rests on Quiet, not Text', () => {
    const { base } = probe(<Button variant="primary">x</Button>);
    expect(colorIn(base)).toContain('--Buttons-Primary-Quiet');
    expect(colorIn(base)).not.toContain('--Buttons-Primary-Text');
  });

  for (const state of ['hover', 'active', 'focusVisible']) {
    it(`moves to Text on ${state}`, () => {
      const { states } = probe(<Button variant="primary">x</Button>);
      expect(colorIn(states[state])).toContain('--Buttons-Primary-Text');
    });
  }

  it('follows the palette', () => {
    const { base } = probe(<Button variant="error">x</Button>);
    expect(colorIn(base)).toContain('--Buttons-Error-Quiet');
  });

  /* Selected holds Text throughout. `selected` decides which PAIR applies by
     deciding whether there is a fill, then pins to that pair's Text end — a
     selected segment is the engaged one, and muting it would make the chosen
     option read quieter than the options beside it. */
  it('holds Text at rest when selected', () => {
    const { base } = probe(<Button variant="primary" selected>x</Button>);
    expect(colorIn(base)).toContain('--Buttons-Primary-Text');
    expect(colorIn(base)).not.toContain('--Buttons-Primary-Quiet');
  });

  it('stays on Text through interaction when selected', () => {
    const { states } = probe(<Button variant="primary" selected>x</Button>);
    expect(colorIn(states.hover)).toContain('--Buttons-Primary-Text');
  });

  /* Disabled is the REST token dimmed. The rule restates the resting color
     only to stop MUI greying it out, so it must not pick up the active one. */
  it('keeps the rest token when disabled', () => {
    const { states } = probe(<Button variant="primary" disabled>x</Button>);
    expect(colorIn(states.disabled)).toContain('--Buttons-Primary-Quiet');
    expect(states.disabled).toContain('opacity');
  });
});

describe('outline button label: Outline-Quiet at rest, Outline-Text on interaction', () => {
  it('rests on Outline-Quiet', () => {
    const { base } = probe(<Button variant="success-outline">x</Button>);
    expect(colorIn(base)).toContain('--Buttons-Success-Outline-Quiet');
    /* Outline-Text is a SUBSTRING-free check: Outline-Quiet does not contain
       it, so a plain `not.toContain` is safe here. */
    expect(colorIn(base)).not.toContain('--Buttons-Success-Outline-Text');
  });

  for (const state of ['hover', 'active', 'focusVisible']) {
    it(`moves to Outline-Text on ${state}`, () => {
      const { states } = probe(<Button variant="success-outline">x</Button>);
      expect(colorIn(states[state])).toContain('--Buttons-Success-Outline-Text');
    });
  }

  /* Selected gains a FILL, so an outline button swaps from the Outline pair
     to the filled one, and pins to its Text end. */
  it('swaps to the filled pair Text when selected', () => {
    const { base } = probe(<Button variant="success-outline" selected>x</Button>);
    expect(colorIn(base)).toContain('--Buttons-Success-Text');
    expect(colorIn(base)).not.toContain('--Buttons-Success-Outline-Quiet');
  });

  it('stays on the filled pair Text through interaction when selected', () => {
    const { states } = probe(<Button variant="success-outline" selected>x</Button>);
    expect(colorIn(states.hover)).toContain('--Buttons-Success-Text');
  });

  it('covers black-white, whose Outline-Text the generator still omits', () => {
    const { base } = probe(<Button variant="black-white-outline">x</Button>);
    expect(colorIn(base)).toContain('--Buttons-BlackWhite-Outline-Quiet');
  });
});

describe('ghost button label', () => {
  /* A text ghost reads like a link. This is a deliberate departure from
     Figma, which binds Outline-Quiet — kept because link styling is the
     better accessibility answer for text. */
  it('keeps --Hotlink for text content', () => {
    const { base } = probe(<Button variant="ghost">Save</Button>);
    expect(colorIn(base)).toContain('--Hotlink');
  });

  /* An icon-only ghost had the right shape already, muted at rest and
     darkening on interaction — but on the SURFACE pair, so it ignored the
     button table the way outline buttons used to. */
  it('rests an icon-only ghost on the button pair, not the surface pair', () => {
    const { base } = probe(<Button variant="ghost" iconOnly aria-label="Close"><span>x</span></Button>);
    expect(colorIn(base)).toContain('--Buttons-Default-Outline-Quiet');
    expect(colorIn(base)).not.toMatch(/color:\s*var\(--Quiet\)/);
  });

  for (const state of ['hover', 'active', 'focusVisible']) {
    it(`moves an icon-only ghost to Outline-Text on ${state}`, () => {
      const { states } = probe(
        <Button variant="ghost" iconOnly aria-label="Close"><span>x</span></Button>);
      expect(colorIn(states[state])).toContain('--Buttons-Default-Outline-Text');
    });
  }
});
