import React from 'react';
import { render } from '@testing-library/react';
import { Section } from './Section';
import { EDGE_NAMES, REPEATING_EDGES, edgePath, edgeTile } from './edges';

describe('Section edges', () => {
  test('every edge is a closed path that sits on the box\'s bottom line', () => {
    for (const n of EDGE_NAMES) {
      const d = edgePath(n);
      expect([n, /^M0 100L.*Z$/.test(d)]).toEqual([n, true]);
      expect([n, /NaN/.test(d)]).toEqual([n, false]);
    }
  });

  test('repeating edges tile by height; curve and slant stretch', () => {
    expect(REPEATING_EDGES).toEqual(['wave', 'scallop', 'zigzag', 'steps']);
    expect(edgeTile('wave', 48)).toBe(288);
    expect(edgeTile('curve', 48)).toBeNull();
  });

  test('a top edge reaches up out of the section in its own color', () => {
    const { container } = render(<Section theme="Primary" edgeTop="wave">x</Section>);
    const sec = container.firstChild;
    expect(sec.style.position).toBe('relative');
    const edge = sec.querySelector('.section-edge-top');
    expect(edge).toHaveAttribute('aria-hidden', 'true');
    expect(edge).toHaveStyle({ bottom: '100%', height: '48px' });
  });

  test('a bottom edge is the same shape turned over', () => {
    const { container } = render(<Section edgeBottom="zigzag" edgeHeight={24}>x</Section>);
    const edge = container.querySelector('.section-edge-bottom');
    expect(edge).toHaveStyle({ top: '100%', height: '24px', transform: 'scaleY(-1)' });
  });

  test('no edge leaves the section exactly as it was', () => {
    const { container } = render(<Section>x</Section>);
    expect(container.firstChild.style.position).toBe('');
    expect(container.querySelector('.section-edge')).toBeNull();
  });
});
