import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { CHART_TOKENS } from './tokens';
import {
  toNumbers, toLabels, extent, bands, slots, scaleY,
  linePath, smoothPath, areaPath, arcPath, sliceAngles, ticks,
} from './geometry';

// ─── geometry ────────────────────────────────────────────────────────────────
// This is the layer a Figma plugin will reuse, so it is tested on its own
// terms rather than only through what the SVG happens to render.

describe('geometry / inputs', () => {
  test('accepts bare numbers and {value,label} objects alike', () => {
    expect(toNumbers([1, 2, 3])).toEqual([1, 2, 3]);
    expect(toNumbers([{ value: 4, label: 'a' }])).toEqual([4]);
    expect(toLabels([{ value: 4, label: 'a' }])).toEqual(['a']);
  });
  test('non-numeric data becomes 0 rather than NaN', () => {
    // NaN propagates into path data as "NaN" and the whole path silently
    // fails to render, so it must be stopped at the door.
    expect(toNumbers(['x', null, undefined, {}])).toEqual([0, 0, 0, 0]);
  });
});

describe('geometry / extent', () => {
  test('bars start at zero so length stays proportional to value', () => {
    expect(extent([10, 20, 30], { fromZero: true })).toEqual({ min: 0, max: 30 });
  });
  test('lines may float', () => {
    expect(extent([10, 20, 30], { fromZero: false })).toEqual({ min: 10, max: 30 });
  });
  test('a flat series still has a range, so points do not divide by zero', () => {
    const e = extent([5, 5, 5], { fromZero: false });
    expect(e.max).toBeGreaterThan(e.min);
    expect(Number.isFinite(scaleY(5, e, 0, 100))).toBe(true);
  });
  test('negative values keep a zero baseline for bars', () => {
    expect(extent([-5, 10], { fromZero: true }).min).toBe(0 - 5);
  });
});

describe('geometry / scaleY', () => {
  test('the maximum sits at the top and the minimum at the bottom', () => {
    const e = { min: 0, max: 100 };
    expect(scaleY(100, e, 0, 200)).toBe(0);
    expect(scaleY(0, e, 0, 200)).toBe(200);
    expect(scaleY(50, e, 0, 200)).toBe(100);
  });
});

describe('geometry / layout', () => {
  test('bands spread across the width and touch both ends', () => {
    const b = bands(3, 0, 100);
    expect(b).toEqual([0, 50, 100]);
  });
  test('a single band is centred, not pinned left', () => {
    expect(bands(1, 0, 100)).toEqual([50]);
  });
  test('slots leave the requested gap', () => {
    const { centres, bandWidth } = slots(4, 0, 400, { gapRatio: 0.5 });
    expect(bandWidth).toBe(50);
    expect(centres).toEqual([50, 150, 250, 350]);
  });
  test('zero data produces no geometry rather than throwing', () => {
    expect(bands(0, 0, 100)).toEqual([]);
    expect(slots(0, 0, 100).centres).toEqual([]);
  });
});

describe('geometry / paths', () => {
  const pts = [{ x: 0, y: 10 }, { x: 10, y: 0 }, { x: 20, y: 10 }];

  test('a straight path moves then lines', () => {
    expect(linePath(pts)).toBe('M0 10 L10 0 L20 10');
  });
  test('a smooth path passes THROUGH every point', () => {
    // Each cubic segment must END on the next data point — that is what
    // separates Catmull-Rom from bezier smoothing that only approaches them.
    const d = smoothPath(pts);
    expect(d.startsWith('M0 10')).toBe(true);
    expect(d).toContain('10 0');
    expect(d.trimEnd().endsWith('20 10')).toBe(true);
  });
  test('two points still produce a curve, not an empty string', () => {
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toContain('C');
  });
  test('an area closes back along the baseline', () => {
    const a = areaPath(linePath(pts), pts, 100);
    expect(a.endsWith('Z')).toBe(true);
    expect(a).toContain('L20 100');
    expect(a).toContain('L0 100');
  });
  test('empty input yields empty path data, never "undefined"', () => {
    expect(linePath([])).toBe('');
    expect(areaPath('', [], 10)).toBe('');
  });
  test('no path contains NaN', () => {
    const bad = [{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 0 }];
    expect(smoothPath(bad)).not.toMatch(/NaN/);
    expect(arcPath(50, 50, 0, 40, 0, Math.PI)).not.toMatch(/NaN/);
  });
});

describe('geometry / slices', () => {
  test('slices sum to a full turn', () => {
    const { slices } = sliceAngles([1, 1, 2]);
    const sweep = slices.reduce((a, s) => a + (s.end - s.start), 0);
    expect(sweep).toBeCloseTo(Math.PI * 2, 9);
  });
  test('fractions sum to 1', () => {
    const { slices } = sliceAngles([3, 1]);
    expect(slices.reduce((a, s) => a + s.fraction, 0)).toBeCloseTo(1, 9);
    expect(slices[0].fraction).toBeCloseTo(0.75, 9);
  });
  test('non-positive values are dropped and counted, not mirrored', () => {
    const { slices, dropped } = sliceAngles([5, -5, 0]);
    expect(slices.filter((s) => s.value > 0)).toHaveLength(1);
    expect(dropped).toBe(2);
  });
  test('an all-zero series draws nothing rather than dividing by zero', () => {
    expect(sliceAngles([0, 0]).slices).toEqual([]);
  });
  test('a lone value draws a full circle as two arcs, not an invisible one', () => {
    // A 360° arc has coincident endpoints and renders as nothing at all.
    const d = arcPath(50, 50, 0, 40, 0, Math.PI * 2);
    expect((d.match(/A/g) || []).length).toBe(2);
  });
  test('a donut path carries both radii', () => {
    const d = arcPath(50, 50, 20, 40, 0, Math.PI / 2);
    expect(d).toContain('A40 40');
    expect(d).toContain('A20 20');
  });
});

describe('geometry / ticks', () => {
  test('ticks are round numbers inside the range', () => {
    const t = ticks({ min: 0, max: 100 }, 4);
    expect(t[0]).toBe(0);
    expect(t[t.length - 1]).toBeLessThanOrEqual(100);
    t.forEach((v) => expect(Number.isFinite(v)).toBe(true));
  });
  test('no floating-point dust in the labels', () => {
    // 0.1 + 0.2 style accumulation would otherwise print 0.30000000000000004.
    ticks({ min: 0, max: 1 }, 10).forEach((v) => {
      expect(String(v).length).toBeLessThan(8);
    });
  });
});

// ─── components ──────────────────────────────────────────────────────────────

describe('BarChart', () => {
  // Count by ROLE (which token the rect is painted with) rather than by raw
  // <rect>, since the chart also draws a hover slot and full-height hit
  // targets. Counting elements would make this test fail on every layer added.
  const byFill = (c, token) =>
    [...c.querySelectorAll('rect')].filter((r) => r.getAttribute('fill') === token);

  test('renders one filled bar per value', () => {
    const { container } = render(<BarChart data={[1, 2, 3]} showTrack={false} />);
    expect(byFill(container, CHART_TOKENS.fill)).toHaveLength(3);
  });
  test('a track is drawn behind each bar when asked', () => {
    const { container } = render(<BarChart data={[1, 2, 3]} showTrack />);
    expect(byFill(container, CHART_TOKENS.track)).toHaveLength(3);
  });
  test('the track uses --Border-Variant and the bar --Icons-Primary', () => {
    const { container } = render(<BarChart data={[5]} showTrack />);
    expect(byFill(container, CHART_TOKENS.track)).toHaveLength(1);
    expect(byFill(container, CHART_TOKENS.fill)).toHaveLength(1);
    expect(CHART_TOKENS.track).toBe('var(--Border-Variant)');
    expect(CHART_TOKENS.fill).toBe('var(--Icons-Primary)');
  });
  test('a zero value draws no bar, so it cannot show as a rounded stub', () => {
    const { container } = render(<BarChart data={[0, 10]} showTrack={false} />);
    expect(byFill(container, CHART_TOKENS.fill)).toHaveLength(1);
  });
  test('category labels are quiet, value labels are not', () => {
    const { container } = render(
      <BarChart data={[{ value: 5, label: 'Mon' }]} showValues showLabels />,
    );
    const texts = [...container.querySelectorAll('text')];
    expect(texts.find((t) => t.textContent === 'Mon').getAttribute('fill'))
      .toBe(CHART_TOKENS.quietLabel);
    expect(texts.find((t) => t.textContent === '5').getAttribute('fill'))
      .toBe(CHART_TOKENS.label);
  });
  test('empty data renders without throwing', () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.querySelectorAll('rect')).toHaveLength(0);
  });
});

describe('LineChart', () => {
  test('smooth draws cubics, straight draws line segments', () => {
    const { container: a } = render(<LineChart data={[1, 5, 2]} curve="smooth" gradient={false} />);
    const { container: b } = render(<LineChart data={[1, 5, 2]} curve="straight" gradient={false} />);
    expect(a.querySelector('path').getAttribute('d')).toContain('C');
    expect(b.querySelector('path').getAttribute('d')).not.toContain('C');
  });
  test('the line is --Icons-Primary and never filled', () => {
    const { container } = render(<LineChart data={[1, 2]} gradient={false} />);
    const p = container.querySelector('path');
    expect(p.getAttribute('stroke')).toBe('var(--Icons-Primary)');
    expect(p.getAttribute('fill')).toBe('none');
  });
  test('the gradient runs from --Icons-Primary-Variant to transparent', () => {
    const { container } = render(<LineChart data={[1, 2, 3]} gradient />);
    const stops = [...container.querySelectorAll('stop')];
    expect(stops).toHaveLength(2);
    expect(stops[0].getAttribute('stop-color')).toBe('var(--Icons-Primary-Variant)');
    expect(stops[0].getAttribute('stop-opacity')).toBe('1');
    expect(stops[1].getAttribute('stop-opacity')).toBe('0');
  });
  test('two charts on one page get different gradient ids', () => {
    // A shared id makes the second chart silently reuse the first one's fill.
    const { container } = render(
      <div>
        <LineChart data={[1, 2]} gradient />
        <LineChart data={[3, 4]} gradient />
      </div>,
    );
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });
  test('gridlines use --Border-Variant', () => {
    const { container } = render(<LineChart data={[1, 5, 3]} showGrid gradient={false} />);
    const lines = [...container.querySelectorAll('line')];
    expect(lines.length).toBeGreaterThan(0);
    lines.forEach((l) => expect(l.getAttribute('stroke')).toBe('var(--Border-Variant)'));
  });
  test('a single point still shows, as a dot', () => {
    const { container } = render(<LineChart data={[7]} />);
    expect(container.querySelector('circle')).toBeInTheDocument();
  });
  test('empty data renders without throwing', () => {
    const { container } = render(<LineChart data={[]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('PieChart', () => {
  test('renders one wedge per positive value', () => {
    const { container } = render(<PieChart data={[1, 2, 3]} />);
    expect(container.querySelectorAll('path')).toHaveLength(3);
  });
  test('wedges cycle the icon palettes so categories are told apart by hue', () => {
    const { container } = render(<PieChart data={[1, 1, 1]} />);
    const fills = [...container.querySelectorAll('path')].map((p) => p.getAttribute('fill'));
    expect(fills).toEqual([
      'var(--Icons-Primary)', 'var(--Icons-Secondary)', 'var(--Icons-Tertiary)',
    ]);
    expect(new Set(fills).size).toBe(3);
  });

  test('each wedge is separated by the surface background, not a grey line', () => {
    // --Background so the gap reads as a gap on ANY surface and in either mode.
    const { container } = render(<PieChart data={[1, 1]} separatorWidth={2} />);
    [...container.querySelectorAll('path')].forEach((p) => {
      expect(p.getAttribute('stroke')).toBe('var(--Background)');
      expect(p.getAttribute('stroke-width')).toBe('2');
    });
  });

  test('a wedge label uses the --Icons-On-* generated for its own fill', () => {
    // That token is computed to clear 4.5:1 against exactly this fill, so no
    // label ever has to be contrast-checked by hand.
    const { container } = render(<PieChart data={[{ value: 1, label: 'A' }]} showLabels />);
    const text = container.querySelector('text');
    expect(text.getAttribute('fill')).toBe('var(--Icons-On-Primary)');
  });

  test('the palette can be overridden when categories carry meaning', () => {
    const { container } = render(
      <PieChart data={[1, 1, 1]} colors={['Success', 'Warning', 'Error']} />,
    );
    expect([...container.querySelectorAll('path')].map((p) => p.getAttribute('fill')))
      .toEqual(['var(--Icons-Success)', 'var(--Icons-Warning)', 'var(--Icons-Error)']);
  });

  test('more slices than palettes cycles rather than running out', () => {
    const { container } = render(<PieChart data={Array(10).fill(1)} />);
    const fills = [...container.querySelectorAll('path')].map((p) => p.getAttribute('fill'));
    expect(fills).toHaveLength(10);
    expect(fills[8]).toBe(fills[0]);
    expect(fills[9]).toBe(fills[1]);
  });
  test('donut leaves a hole', () => {
    const { container } = render(<PieChart data={[1, 1]} donut />);
    expect(container.querySelector('path').getAttribute('d')).toMatch(/A\d+(\.\d+)? /);
  });
  test('omitted values are named in the accessible caption', () => {
    render(<PieChart data={[5, -1]} />);
    expect(screen.getByRole('table', { name: /1 non-positive values omitted/ }))
      .toBeInTheDocument();
  });
  test('slivers do not get labels that would overflow their neighbours', () => {
    const { container } = render(<PieChart data={[97, 1, 1, 1]} showLabels />);
    expect(container.querySelectorAll('text')).toHaveLength(1);
  });
  test('empty data renders without throwing', () => {
    const { container } = render(<PieChart data={[]} />);
    expect(container.querySelectorAll('path')).toHaveLength(0);
  });
});

// ─── interaction & accessibility ─────────────────────────────────────────────
// The colour system makes a chart legible; none of it makes the chart READABLE
// to a screen reader. These cover the text equivalent and the keyboard path.

describe('accessibility', () => {
  test.each([
    ['BarChart', BarChart],
    ['LineChart', LineChart],
    ['PieChart', PieChart],
  ])('%s ships the data as a real table, not just a label', (_n, C) => {
    render(<C data={[{ value: 4, label: 'Mon' }, { value: 9, label: 'Tue' }]} label="Visits" />);
    const table = screen.getByRole('table', { name: /Visits/ });
    expect(table).toBeInTheDocument();
    // The numbers themselves must be present — an aria-label summary can say
    // what a chart is about, but only a table says what it SAYS.
    expect(within(table).getByRole('rowheader', { name: 'Mon' })).toBeInTheDocument();
    expect(within(table).getByText('9')).toBeInTheDocument();
  });

  test.each([
    ['BarChart', BarChart],
    ['LineChart', LineChart],
    ['PieChart', PieChart],
  ])('%s hides the SVG from the accessibility tree', (_n, C) => {
    const { container } = render(<C data={[1, 2]} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  test('the hidden table stays in the accessibility tree, not display:none', () => {
    // display:none / visibility:hidden would remove it from the tree too,
    // hiding it from exactly the users it exists for.
    render(<BarChart data={[1]} label="X" />);
    const table = screen.getByRole('table', { name: /X/ });
    const style = table.getAttribute('style') || '';
    expect(style).not.toMatch(/display:\s*none/);
    expect(style).not.toMatch(/visibility:\s*hidden/);
  });

  // Band charts get real <button> hit targets in an overlay OUTSIDE the
  // aria-hidden SVG — natively focusable, so no tabindex is needed, and named
  // so a screen reader announces the value rather than a shape.
  test.each([
    ['BarChart', BarChart],
    ['LineChart', LineChart],
  ])('%s marks are keyboard reachable and named', (_n, C) => {
    render(<C data={[{ value: 4, label: 'Mon' }]} />);
    const mark = screen.getByRole('button', { name: 'Mon: 4' });
    expect(mark.tagName).toBe('BUTTON');
  });

  test('no focusable element sits inside the aria-hidden SVG', () => {
    // Focusable content inside aria-hidden is invalid ARIA: a keyboard user
    // lands on something a screen reader will not announce. This is why the
    // hit targets are an overlay rather than <rect>s.
    const { container } = render(<BarChart data={[1, 2, 3]} />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg.querySelectorAll('button, [tabindex]')).toHaveLength(0);
  });

  test('a pie wedge is pointer-only, so the table is its keyboard path', () => {
    // Wedges are not rectangles, so they cannot be mirrored by an overlay of
    // buttons the way bands can. Rather than ship a focusable shape a screen
    // reader cannot describe, the hidden table carries the data.
    render(<PieChart data={[{ value: 4, label: 'Mon' }]} label="Split" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByRole('table', { name: /Split/ })).toBeInTheDocument();
  });

  test('interactive={false} removes the hit targets entirely', () => {
    render(<BarChart data={[1, 2]} interactive={false} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('motion', () => {
  test('bars animate on the brand motion tokens, not a literal duration', () => {
    // A literal here would ignore the system's prefers-reduced-motion switch,
    // which works by redefining --Motion-Duration-* to 0s.
    const { container } = render(<BarChart data={[5]} showTrack={false} animate />);
    const bar = [...container.querySelectorAll('rect')]
      .find((r) => r.getAttribute('fill') === CHART_TOKENS.fill);
    expect(bar.getAttribute('style')).toContain('--Motion-Duration-Slow');
    expect(bar.getAttribute('style')).toContain('--Motion-Easing-Enter');
  });

  test('the line draws itself on with a normalised path length', () => {
    // pathLength="1" avoids getTotalLength(), which needs a ref and a layout
    // pass and returns 0 during SSR.
    const { container } = render(<LineChart data={[1, 5, 2]} animate gradient={false} />);
    const path = container.querySelector('path[stroke]');
    expect(path).toHaveAttribute('pathLength', '1');
    expect(path.getAttribute('style')).toContain('--Motion-Duration-Slow');
  });

  test('animate={false} paints at full size on the first frame', () => {
    const { container } = render(<BarChart data={[5]} showTrack={false} animate={false} />);
    const bar = [...container.querySelectorAll('rect')]
      .find((r) => r.getAttribute('fill') === CHART_TOKENS.fill);
    expect(bar.getAttribute('style')).toContain('scaleY(1)');
  });
});

describe('hover', () => {
  test('the readout stays inside the viewBox on the tallest value', () => {
    // The tallest bar's top sits at the very top of the plot, so a readout
    // placed above it would be drawn at a negative y and vanish — on the one
    // value a reader is most likely to hover.
    const { container } = render(<BarChart data={[{ value: 99, label: 'Max' }]} />);
    fireEvent.focus(screen.getByRole('button', { name: 'Max: 99' }));
    const box = [...container.querySelectorAll('svg rect')]
      .find((r) => r.getAttribute('fill') === CHART_TOKENS.fill && r.getAttribute('rx') === '6');
    expect(Number(box.getAttribute('y'))).toBeGreaterThanOrEqual(0);
  });

  test('hovering a bar paints its slot with --Hover and shows the value', async () => {
    const user = userEvent.setup();
    const { container } = render(<BarChart data={[{ value: 42, label: 'Mon' }]} />);
    expect(container.querySelector('rect[fill="var(--Hover)"]')).toBeNull();
    await user.hover(screen.getByRole('button', { name: 'Mon: 42' }));
    expect(container.querySelector('rect[fill="var(--Hover)"]')).toBeInTheDocument();
    // Scoped to the SVG — the hidden table carries the same number, and an
    // unscoped query cannot tell the readout from the text equivalent.
    const readout = [...container.querySelectorAll('svg text')]
      .find((t) => t.textContent === '42');
    expect(readout).toBeTruthy();
  });

  test('the readout label sits on --Icons-On-Primary, not a guessed colour', () => {
    const { container } = render(<BarChart data={[{ value: 42, label: 'Mon' }]} />);
    fireEvent.focus(screen.getByRole('button', { name: 'Mon: 42' }));
    const readout = [...container.querySelectorAll('text')]
      .find((t) => t.textContent === '42');
    expect(readout.getAttribute('fill')).toBe('var(--Icons-On-Primary)');
  });

  test('keyboard focus gives the same readout as the mouse', () => {
    render(<LineChart data={[{ value: 7, label: 'Mon' }]} />);
    fireEvent.focus(screen.getByRole('button', { name: 'Mon: 7' }));
    expect([...document.querySelectorAll('svg text')].some((t) => t.textContent === '7'))
      .toBe(true);
  });

  test('a shrinking dataset does not leave the readout pointing past the end', () => {
    const { rerender, container } = render(<BarChart data={[1, 2, 3]} />);
    fireEvent.focus(screen.getAllByRole('button')[2]);
    rerender(<BarChart data={[1]} />);
    // Would throw on values[active] if the index were not reset.
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
