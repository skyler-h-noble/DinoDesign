// src/components/Ratio/Ratio.test.js
//
// Ratio must INHERIT the surrounding theme and surface.
//
// It used to stamp data-theme="Default" + data-surface="Surface" on every
// instance. That is not a no-op: `Default` is a real theme in every generated
// system, so a Ratio inside a Primary card switched out of it, and the Image
// Placeholder — which fills with var(--Border) and draws its icon in
// var(--Background) — resolved both against the wrong scope. On a light brand
// that is a blank white square with an invisible glyph, which looks like a
// missing asset rather than a theme bug, so it survived a long time.
//
// The same component had already been fixed once for emitting `X-Light` theme
// names that no generated sheet defined. Both are the same mistake: naming a
// scope instead of inheriting one.
import React from 'react';
import { render } from '@testing-library/react';
import { Ratio } from './Ratio';

describe('Ratio scope inheritance', () => {
  test('emits no data-theme or data-surface by default', () => {
    const { container } = render(<Ratio />);
    expect(container.querySelector('[data-theme]')).toBeNull();
    expect(container.querySelector('[data-surface]')).toBeNull();
  });

  test('does not override a surrounding theme', () => {
    const { container } = render(
      <div data-theme="Primary" data-surface="Container">
        <Ratio />
      </div>,
    );
    // Nothing inside the wrapper may re-declare either axis.
    expect(container.querySelectorAll('[data-theme]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-surface]')).toHaveLength(1);
  });

  test('still honours an explicit color', () => {
    const { container } = render(<Ratio color="secondary" />);
    expect(container.querySelector('[data-theme="Secondary"]')).not.toBeNull();
  });

  test('still honours the dark and light variants', () => {
    const dark = render(<Ratio variant="dark" />).container;
    expect(dark.querySelector('[data-surface="Surface-Dimmest"]')).not.toBeNull();
    const light = render(<Ratio variant="light" />).container;
    expect(light.querySelector('[data-surface="Surface-Brightest"]')).not.toBeNull();
  });

  test('renders the placeholder icon when the slot is empty', () => {
    // The visible symptom of the old bug was a blank square: the fill and the
    // icon both resolved in the wrong scope and landed the same colour, so the
    // glyph was present in the DOM but invisible. Assert it is drawn — the
    // colour pairing itself (fill --Border / icon --Background) is a style
    // contract jsdom cannot resolve, and is covered by the source comment.
    const { container } = render(<Ratio />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  test('draws no placeholder icon when placeholder is off', () => {
    const { container } = render(<Ratio placeholder={false} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  test('a supplied child wins over the placeholder', () => {
    const { container } = render(<Ratio><img alt="real" src="x.png" /></Ratio>);
    expect(container.querySelector('img[alt="real"]')).not.toBeNull();
  });
});
