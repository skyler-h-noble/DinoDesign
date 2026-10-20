/**
 * The Avatar against Figma's Icons & Avatars variables (set 3156:3696):
 *   Avatar-Size     medium 32
 *   the ring        1px Buttons::Border on every disc frame, at every size
 *   Avatar-Initials xxs 9 · xs 12 · small 14 · medium 18 · large 22 · xl 28 · xxl 40
 * and the Default style: the person glyph alone, filled with Buttons::Border,
 * on no disc of its own.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Avatar } from './Avatar';

const rulesFor = (el) => {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (r.selectorText && classes.some((c) => r.selectorText.includes('.' + c))) out.push(r.cssText);
    }
  }
  return out.join('\n');
};

describe('Avatar matches the Figma variables', () => {
  it('always has a 1px ring, inside the diameter', () => {
    for (const props of [{}, { insideButton: true }]) {
      const el = render(<Avatar initials="LN" {...props} />).container.querySelector('.avatar');
      expect(rulesFor(el)).toMatch(/border:[^;]*solid/);
      expect(rulesFor(el)).toMatch(/box-sizing:\s*border-box/);
    }
  });

  it.each([['small', 14], ['medium', 18], ['large', 22], ['xl', 28]])(
    'initials at %s are %ipx', (size, px) => {
      const { container } = render(<Avatar size={size} initials="LN" />);
      const text = container.querySelector('.avatar .typography, .avatar p, .avatar span');
      expect(rulesFor(text)).toMatch(new RegExp(`font-size:\\s*${px}px`));
    });

  it('the Default style is the glyph alone, filling the disc', () => {
    const { container } = render(<Avatar defaultPhoto={false} />);
    const el = container.querySelector('.avatar');
    expect(rulesFor(el)).toMatch(/background-color:\s*transparent/);
    const svg = el.querySelector('svg');
    expect(svg.style.width).toBe('100%');
    expect(rulesFor(el)).toMatch(/(^|[;{\s])color:\s*var\(--Buttons-Default-Border\)/);
  });
});
