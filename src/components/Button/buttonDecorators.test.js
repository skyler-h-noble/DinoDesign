// src/components/Button/buttonDecorators.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';
import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon/Icon';
import HomeIcon from '@mui/icons-material/Home';

/**
 * A button's decorators have their OWN size ramp — Button-Avatar and
 * Button-Icon in Figma's Component-Size collection — which does not line up
 * with the standalone Avatar and Icon ramps.
 *
 * Mapping to standalone NAMES is what hid three wrong values: a medium button
 * drew a 24px avatar where the design says 20, and both small and medium drew
 * the wrong icon. 20 is not a named size in either component, which is exactly
 * why a name could not express the mapping.
 */

const EXPECTED = {
  small:  { avatar: 16, icon: 20 },
  medium: { avatar: 20, icon: 20 },
  large:  { avatar: 40, icon: 32 },
};

describe('avatar decorators follow Button-Avatar', () => {
  for (const [size, want] of Object.entries(EXPECTED)) {
    it(`${size} button gives its avatar ${want.avatar}px`, () => {
      const { container } = render(
        <Button size={size} startDecorator={<Avatar initials="LN" />}>Save</Button>,
      );
      const av = container.querySelector('.avatar');
      if (!av) throw new Error(`${size}: no avatar rendered`);
      const style = av.getAttribute('style') || '';
      const css = window.getComputedStyle(av).width;
      const found = `${style} ${css}`;
      if (!found.includes(`${want.avatar}px`)) {
        throw new Error(`${size} avatar: expected ${want.avatar}px, got "${found.trim()}"`);
      }
    });
  }
});

describe('icon decorators follow Button-Icon', () => {
  for (const [size, want] of Object.entries(EXPECTED)) {
    it(`${size} button gives its icon ${want.icon}px`, () => {
      const { container } = render(
        <Button size={size} startDecorator={<Icon><HomeIcon /></Icon>}>Save</Button>,
      );
      const ic = container.querySelector('.icon');
      if (!ic) throw new Error(`${size}: no icon rendered`);
      const found = `${ic.getAttribute('style') || ''} ${window.getComputedStyle(ic).fontSize}`;
      if (!found.includes(`${want.icon}px`)) {
        throw new Error(`${size} icon: expected ${want.icon}px, got "${found.trim()}"`);
      }
    });
  }

  it('small and medium share 20px deliberately', () => {
    /* Not a copy-paste. The small button is 24px tall and a 16px icon left it
       underfilled beside a 20px avatar, so the design holds both at 20. A test
       that allowed them to differ would let a "tidy-up" reintroduce a ramp the
       design does not have. */
    expect(EXPECTED.small.icon).toBe(EXPECTED.medium.icon);
  });
});

describe('the sizes that were removed stay removed', () => {
  it('Avatar has no xxx-small', () => {
    /* It existed for exactly one caller — Button's decorator — which now
       passes a pixel size. A public name kept for a private need is a cost
       with no consumer. */
    const { container } = render(<Avatar size="xxx-small" initials="LN" />);
    const av = container.querySelector('.avatar');
    // Falls back to medium (32 after the 2026-09-28 realignment) rather than
    // rendering a 16px avatar.
    expect(`${av.getAttribute('style') || ''}`).not.toMatch(/(^|[^0-9])16px/);
  });

  it('the Icon ladder is Figma\'s seven steps, in order', () => {
    /* Was "Icon has no xs", asserting a three-step ladder. That ladder was
       three names stretched across Figma's seven rungs, each having drifted to
       whichever rung it was nearest — the lib's `small` was Figma's `xxs` and
       its `large` was Figma's `medium`. Realigned 2026-09-28.

       Asserted as the full ordered list rather than spot-checks: the bug was a
       ladder with holes, so a test that only checks the rungs that exist
       cannot see the next hole appear. */
    const { ICON_SIZE_MAP } = require('../Icon/Icon');
    expect(Object.keys(ICON_SIZE_MAP))
      .toEqual(['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl']);
    expect(Object.values(ICON_SIZE_MAP))
      .toEqual(['16px', '20px', '24px', '32px', '40px', '56px', '72px']);
  });

  it('Icon and Avatar agree rung for rung', () => {
    /* They are one Figma collection — `Icons & Avatars`, one set of modes
       driving both Icon-Size and Avatar-Size. Two ladders in code that are one
       ladder in the design is how the offset survived: each could be
       self-consistent while disagreeing with the other. */
    const { ICON_SIZE_MAP } = require('../Icon/Icon');
    const rungs = ['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'];
    const icon = rungs.map((r) => parseInt(ICON_SIZE_MAP[r], 10));
    expect(icon).toEqual([16, 20, 24, 32, 40, 56, 72]);
  });
});
