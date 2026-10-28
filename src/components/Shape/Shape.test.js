import React from 'react';
import { render } from '@testing-library/react';
import { Shape } from './Shape';
import { SHAPE_NAMES, MORPHABLE_SHAPES, ICON_SHAPES, shapePath, shapeStyle, POINTS } from './shapes';
import { IconBadge } from '../IconBadge';

describe('shape source', () => {
  test('every drawn shape is a closed path inside the 0–100 box', () => {
    for (const name of SHAPE_NAMES.filter((n) => n !== 'rounded' && n !== 'squircle')) {
      const d = shapePath(name);
      expect([name, /^M.*Z$/.test(d)]).toEqual([name, true]);
      expect([name, /NaN|Infinity/.test(d)]).toEqual([name, false]);
      const nums = d.replace(/[MLZ]/g, ' ').trim().split(/\s+/).map(Number);
      expect([name, nums.every((n) => n >= -0.5 && n <= 100.5)]).toEqual([name, true]);
    }
  });

  test('round shapes share one point count, so any can morph into any', () => {
    const counts = new Set(MORPHABLE_SHAPES.map((n) => shapePath(n).split('L').length));
    expect([...counts]).toEqual([POINTS]);
  });

  test('rounded follows the brand radius; squircle uses corner-shape where supported', () => {
    expect(shapeStyle('rounded')).toEqual({ borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius, 8px))' });
    expect(JSON.stringify(shapeStyle('squircle'))).toContain('squircle');
  });

  test('a path shape becomes a mask that stretches to the box', () => {
    const st = shapeStyle('cookie-9');
    expect(st.mask).toContain('data:image/svg+xml');
    expect(st.mask).toContain('100% 100%');
  });

  test('icon-safe shapes are all real shapes', () => {
    expect(ICON_SHAPES.every((n) => SHAPE_NAMES.includes(n))).toBe(true);
  });
});

describe('Shape', () => {
  test('frames an image and paints nothing of its own', () => {
    const { container } = render(<Shape shape="arch"><img src="/a.jpg" alt="Hills" /></Shape>);
    const el = container.firstChild;
    expect(el).toHaveClass('shape-arch');
    expect(el).not.toHaveAttribute('data-theme');
  });

  test('with a color it is a themed surface', () => {
    const { container } = render(<Shape shape="burst" color="warning" variant="light">NEW</Shape>);
    expect(container.firstChild).toHaveAttribute('data-theme', 'Warning');
    expect(container.firstChild).toHaveAttribute('data-surface', 'Surface-Brightest');
  });

  test('decorative is hidden from assistive tech', () => {
    const { container } = render(<Shape shape="flower" decorative />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('IconBadge shape', () => {
  test('takes a shape and drops its corner for it', () => {
    const { container } = render(<IconBadge shape="cookie-9"><span /></IconBadge>);
    expect(container.firstChild).toHaveStyle({ borderRadius: '0' });
  });

  test('warns once for a shape that clips the icon', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<IconBadge shape="burst"><span /></IconBadge>);
    render(<IconBadge shape="burst"><span /></IconBadge>);
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[IconBadge] shape')).length).toBe(1);
    warn.mockRestore();
  });
});

describe('Shape content stays inside the shape', () => {
  test('text is padded into the safe area; an image is not', () => {
    const { container: t } = render(<Shape shape="soft-burst" color="warning">NEW</Shape>);
    expect(t.firstChild).toHaveStyle({ padding: '25.5%' });
    const { container: i } = render(<Shape shape="soft-burst"><img src="/a.jpg" alt="" /></Shape>);
    expect(i.firstChild.style.padding || getComputedStyle(i.firstChild).padding).not.toBe('25.5%');
  });
});
