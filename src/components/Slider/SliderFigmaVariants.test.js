/**
 * The Figma Slider set, variant by variant (file Qv2dqF7mYoAGY77EkdrwTv,
 * component set 6791:14897). Two axes:
 *
 *   Type         single | single-inverted | double | double-inverted
 *   Orientation  horizontal | vertical
 *
 * In code the thumb count comes from `value` (a number or [low, high]) and the
 * direction from `fill` (`standard` | `inverted`), so every Figma variant is
 * one combination:
 *
 *   Type=single           value={n}         fill="standard" (default)
 *   Type=single-inverted  value={n}         fill="inverted"
 *   Type=double           value={[lo, hi]}  fill="standard" (default)
 *   Type=double-inverted  value={[lo, hi]}  fill="inverted"
 *   Orientation=…         orientation="horizontal" (default) | "vertical"
 *
 * The bar is one rail with one track span over it. `inverted` swaps their
 * paint (rail = fill, track = unfilled), so the FILLED parts are the track's
 * interval or its complement. `filled()` below reads exactly that from the
 * DOM — the same arithmetic a reader of the design would do.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Slider } from './Slider';

const pct = (s) => parseFloat(s);

/* The filled intervals along the bar, in percent from the START (left for
   horizontal, bottom for vertical). */
function filled(container) {
  const root = container.querySelector('.MuiSlider-root');
  const track = container.querySelector('.MuiSlider-track');
  const vertical = root.classList.contains('MuiSlider-vertical');
  const start = pct(vertical ? track.style.bottom : track.style.left);
  const size = pct(vertical ? track.style.height : track.style.width);
  const inside = [start, start + size];
  if (!root.classList.contains('omni-sl-inv')) return [inside];
  return [[0, inside[0]], [inside[1], 100]].filter(([a, b]) => b > a);
}

const VARIANTS = [
  { type: 'single',          value: 40,       fill: undefined,  expected: [[0, 40]] },
  { type: 'single-inverted', value: 40,       fill: 'inverted', expected: [[40, 100]] },
  { type: 'double',          value: [20, 80], fill: undefined,  expected: [[20, 80]] },
  { type: 'double-inverted', value: [20, 80], fill: 'inverted', expected: [[0, 20], [80, 100]] },
];

describe.each(['horizontal', 'vertical'])('Orientation=%s', (orientation) => {
  test.each(VARIANTS)('Type=$type fills $expected', ({ value, fill, expected }) => {
    const { container } = render(
      <Slider aria-label="Level" value={value} fill={fill} orientation={orientation} />,
    );
    expect(filled(container)).toEqual(expected);
    const root = container.querySelector('.MuiSlider-root');
    expect(root.classList.contains('MuiSlider-vertical')).toBe(orientation === 'vertical');
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(Array.isArray(value) ? 2 : 1);
    thumbs.forEach((t) => expect(t).toHaveAttribute('aria-orientation', orientation));
  });

  test('thumbs sit on their values along the right axis', () => {
    const { container } = render(
      <Slider aria-label="Level" value={[25, 75]} orientation={orientation} />,
    );
    const prop = orientation === 'vertical' ? 'bottom' : 'left';
    const thumbs = [...container.querySelectorAll('.MuiSlider-thumb')];
    expect(thumbs.map((t) => t.style[prop])).toEqual(['25%', '75%']);
  });
});

describe('inverted fill math', () => {
  test('follows the value as it moves', () => {
    const { container, rerender } = render(<Slider aria-label="L" value={10} fill="inverted" />);
    expect(filled(container)).toEqual([[10, 100]]);
    rerender(<Slider aria-label="L" value={90} fill="inverted" />);
    expect(filled(container)).toEqual([[90, 100]]);
  });

  test('scales with min / max', () => {
    const { container } = render(<Slider aria-label="L" value={[150, 175]} min={100} max={200} fill="inverted" />);
    expect(filled(container)).toEqual([[0, 50], [75, 100]]);
  });

  test('track="inverted" (MUI\'s name) gives the same fill', () => {
    const { container } = render(<Slider aria-label="L" value={[20, 80]} track="inverted" />);
    expect(filled(container)).toEqual([[0, 20], [80, 100]]);
  });

  test('a thumb at an end leaves no empty segment', () => {
    const { container } = render(<Slider aria-label="L" value={[0, 60]} fill="inverted" />);
    expect(filled(container)).toEqual([[60, 100]]);
  });
});

describe('keyboard', () => {
  const setup = (props) => {
    const onChange = jest.fn();
    render(<Slider aria-label="Level" defaultValue={50} onChange={onChange} {...props} />);
    return { onChange, thumbs: screen.getAllByRole('slider') };
  };
  const last = (fn) => fn.mock.calls[fn.mock.calls.length - 1][1];

  test.each([
    ['ArrowRight', 51], ['ArrowUp', 51], ['ArrowLeft', 49], ['ArrowDown', 49],
    ['PageUp', 60], ['PageDown', 40], ['Home', 0], ['End', 100],
  ])('%s moves the value to %d', (key, expected) => {
    const { onChange, thumbs } = setup();
    fireEvent.keyDown(thumbs[0], { key });
    expect(last(onChange)).toBe(expected);
  });

  test('vertical uses the same keys (Up increases)', () => {
    const { onChange, thumbs } = setup({ orientation: 'vertical' });
    fireEvent.keyDown(thumbs[0], { key: 'ArrowUp' });
    expect(last(onChange)).toBe(51);
  });

  test('inverted changes the paint, not the keys', () => {
    const { onChange, thumbs } = setup({ fill: 'inverted' });
    fireEvent.keyDown(thumbs[0], { key: 'ArrowRight' });
    expect(last(onChange)).toBe(51);
  });

  test('each range thumb moves on its own', () => {
    const { onChange, thumbs } = setup({ defaultValue: [20, 80] });
    fireEvent.keyDown(thumbs[1], { key: 'ArrowLeft' });
    expect(last(onChange)).toEqual([20, 79]);
    fireEvent.keyDown(thumbs[0], { key: 'Home' });
    expect(last(onChange)).toEqual([0, 79]);
  });
});

describe('ARIA', () => {
  test('each thumb is a slider with min / max / now', () => {
    render(<Slider aria-label="Level" value={30} min={10} max={60} />);
    const t = screen.getByRole('slider', { name: 'Level' });
    expect(t).toHaveAttribute('aria-valuemin', '10');
    expect(t).toHaveAttribute('aria-valuemax', '60');
    expect(t).toHaveAttribute('aria-valuenow', '30');
  });

  test('range thumbs are told apart: minimum / maximum', () => {
    render(<Slider aria-label="Price" value={[20, 80]} />);
    expect(screen.getByRole('slider', { name: 'Price minimum' })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: 'Price maximum' })).toHaveAttribute('aria-valuenow', '80');
  });

  test('...with a visible label, through aria-labelledby', () => {
    render(<Slider label="Price" value={[20, 80]} />);
    expect(screen.getByRole('slider', { name: 'Price minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Price maximum' })).toBeInTheDocument();
  });

  test('...with no name at all, still distinct', () => {
    render(<Slider value={[20, 80]} />);
    expect(screen.getByRole('slider', { name: 'Minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum' })).toBeInTheDocument();
  });

  test('getAriaLabel still wins', () => {
    render(<Slider value={[20, 80]} getAriaLabel={(i) => (i ? 'To' : 'From')} />);
    expect(screen.getByRole('slider', { name: 'From' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'To' })).toBeInTheDocument();
  });

  test('a single thumb keeps the plain name', () => {
    render(<Slider label="Volume" value={20} />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  test('aria-valuetext follows the bubble when a formatter changes it', () => {
    render(<Slider aria-label="Price" value={40} valueLabelFormat={(v) => `$${v}`} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '$40');
  });

  test('...and is left off when the bubble shows the bare number', () => {
    render(<Slider aria-label="Level" value={40} />);
    expect(screen.getByRole('slider')).not.toHaveAttribute('aria-valuetext');
  });

  test('getAriaValueText and aria-valuetext win over the formatter', () => {
    render(<Slider aria-label="P" value={40} valueLabelFormat={(v) => `$${v}`} getAriaValueText={(v) => `${v} dollars`} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '40 dollars');
  });
});

describe('value bubble', () => {
  test('auto (default): opens on focus, closes on blur', () => {
    const { container } = render(<Slider aria-label="L" defaultValue={36} />);
    const bubble = container.querySelector('.MuiSlider-valueLabel');
    expect(bubble).not.toHaveClass('MuiSlider-valueLabelOpen');
    fireEvent.focus(screen.getByRole('slider'));
    expect(bubble).toHaveClass('MuiSlider-valueLabelOpen');
    fireEvent.blur(screen.getByRole('slider'));
    expect(bubble).not.toHaveClass('MuiSlider-valueLabelOpen');
  });

  test('on: always shown, as every Figma variant draws it', () => {
    const { container } = render(<Slider aria-label="L" defaultValue={[20, 80]} valueLabelDisplay="on" />);
    const bubbles = container.querySelectorAll('.MuiSlider-valueLabelOpen');
    expect(bubbles).toHaveLength(2);
    expect([...bubbles].map((b) => b.textContent)).toEqual(['20', '80']);
  });

  test('is hidden from assistive tech (the input carries the value)', () => {
    const { container } = render(<Slider aria-label="L" defaultValue={36} valueLabelDisplay="on" />);
    expect(container.querySelector('.MuiSlider-valueLabel')).toHaveAttribute('aria-hidden', 'true');
  });

  test('vertical puts it on the right (Figma Label-Right) by default', () => {
    const { container } = render(<Slider aria-label="L" defaultValue={36} orientation="vertical" />);
    expect(container.querySelector('.MuiSlider-root')).toHaveClass('omni-sl-vr');
  });
});

describe('axe, every variant', () => {
  const cases = [];
  ['horizontal', 'vertical'].forEach((orientation) => VARIANTS.forEach((v) => cases.push({ orientation, ...v })));
  test.each(cases)('$type $orientation', async ({ orientation, value, fill }) => {
    const { container } = render(
      <div style={{ height: 160 }}>
        <Slider label="Level" value={value} fill={fill} orientation={orientation} valueLabelDisplay="on" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
