// src/components/Ratio/Ratio.test.js
//
// Ratio must INHERIT the surrounding theme and surface.
//
// It used to stamp data-theme="Default" + data-surface="Surface" on every
// instance. That is not a no-op: `Default` is a real theme in every generated
// system, so a Ratio inside a Primary card switched out of it, and the Image
// Placeholder — then a var(--Border) fill with its icon in var(--Background),
// now ImagePlaceholder's --Border-Variant tint and --Quiet icon — resolved
// both against the wrong scope. On a light brand
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
  test('emits no data-theme by default, and Surface-Dim as its surface', () => {
    // Figma pins the Ratio's Surface mode to Surface-Dim — a level, so the
    // theme around it still decides the color.
    const { container } = render(<Ratio />);
    expect(container.querySelector('[data-theme]')).toBeNull();
    expect(container.querySelector('[data-surface="Surface-Dim"]')).not.toBeNull();
  });

  test('does not override a surrounding theme', () => {
    const { container } = render(
      <div data-theme="Primary" data-surface="Container">
        <Ratio />
      </div>,
    );
    // The theme is never re-declared inside; only the surface LEVEL is.
    expect(container.querySelectorAll('[data-theme]')).toHaveLength(1);
    expect(container.querySelector('.ratio [data-surface]').getAttribute('data-surface')).toBe('Surface-Dim');
  });

  test('still honours an explicit color', () => {
    const { container } = render(<Ratio color="secondary" />);
    expect(container.querySelector('[data-theme="Secondary"]')).not.toBeNull();
  });

  test('the retired dark / light / solid variants render the one style and warn once', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const dark = render(<Ratio variant="dark" />).container;
    expect(dark.querySelector('[data-surface="Surface-Dim"]')).not.toBeNull();
    const light = render(<Ratio variant="light" />).container;
    expect(light.querySelector('[data-surface="Surface-Dim"]')).not.toBeNull();
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Ratio]')).length).toBe(1);
    warn.mockRestore();
  });

  test('renders the placeholder icon when the slot is empty', () => {
    // The visible symptom of the old bug was a blank square: the fill and the
    // icon both resolved in the wrong scope and landed the same color, so the
    // glyph was present in the DOM but invisible. Assert it is drawn — the
    // color pairing itself (fill --Border-Variant / icon --Quiet, ImagePlaceholder) is a style
    // contract jsdom cannot resolve, and is covered by the source comment.
    const { container } = render(<Ratio placeholder />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  test('an empty Ratio is an empty Surface-Dim slot by default, as in Figma', () => {
    const { container } = render(<Ratio />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('[data-surface="Surface-Dim"]')).not.toBeNull();
    expect(container.querySelector('[data-theme]')).toBeNull();
  });

  test('a supplied child wins over the placeholder', () => {
    const { container } = render(<Ratio><img alt="real" src="x.png" /></Ratio>);
    expect(container.querySelector('img[alt="real"]')).not.toBeNull();
  });
});

describe('no states', () => {
  test('clickable / onClick / elevated are retired: no role, no tab stop, warns once', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onClick = jest.fn();
    const { container } = render(<><Ratio clickable onClick={onClick} /><Ratio elevated /></>);
    const r = container.querySelector('.ratio');
    expect(r).not.toHaveAttribute('role');
    expect(r).not.toHaveAttribute('tabindex');
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('clickable')).length).toBe(1);
    warn.mockRestore();
  });
});
