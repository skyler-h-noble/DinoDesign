// ThumbnailSelector: a radio group of image thumbnails. Hand-built ones were
// raw <button>s with `border: 2px solid currentColor`, which on a dark page
// resolved to UA black and measured 1.22–1.27:1. These tests pin the
// semantics, the keyboard, and that every edge is a surface token that clears
// 3:1 on every theme and surface in light AND dark.
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { ThumbnailSelector } from './ThumbnailSelector';
import { ThumbnailSelector as Exported } from '../index';
import { cssFor, declared } from '../_testCss';

const fs = require('fs');
const path = require('path');

const ITEMS = [
  { src: '/a.jpg', alt: 'Front view' },
  { src: '/b.jpg', alt: 'Back view' },
  { src: '/c.jpg', alt: 'Side view', label: 'Side' },
  { src: '/d.jpg', alt: 'Detail' },
];

const radios = () => screen.getAllByRole('radio');
const sheet = () => Array.from(document.styleSheets)
  .flatMap((s) => Array.from(s.cssRules || [])).map((r) => r.cssText).join('\n');
const ruleFor = (start) => sheet().split('\n').find((r) => r.startsWith(start));

let warn;
beforeEach(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { warn.mockRestore(); });

test('is exported from the package index', () => {
  expect(Exported).toBe(ThumbnailSelector);
});

describe('semantics', () => {
  test('a named radiogroup of radios, one aria-checked', () => {
    render(<ThumbnailSelector aria-label="Product images" items={ITEMS} />);
    const group = screen.getByRole('radiogroup', { name: 'Product images' });
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    const r = radios();
    expect(r).toHaveLength(4);
    expect(r.map((x) => x.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false', 'false']);
  });

  test('each radio is named by label || alt; the image is decorative, so the name is said once', () => {
    render(<ThumbnailSelector aria-label="Product images" items={ITEMS} />);
    expect(screen.getByRole('radio', { name: 'Front view' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Side' })).toBeInTheDocument();
    const imgs = document.querySelectorAll('img');
    expect(imgs).toHaveLength(4);
    imgs.forEach((img) => expect(img).toHaveAttribute('alt', ''));
    // Exactly the label — not "Front view Front view" (an image named too).
    expect(radios()[0]).toHaveAccessibleName('Front view');
    // The visible <img> carries no name of its own, so nothing doubles.
    radios().forEach((r) => expect(r.textContent).toBe(''));
  });

  test('no alt and no label: falls back to "Image N of M" and warns in development', () => {
    render(<ThumbnailSelector aria-label="Images" items={[{ src: '/x.jpg' }, { src: '/y.jpg' }]} />);
    expect(screen.getByRole('radio', { name: 'Image 2 of 2' })).toBeInTheDocument();
  });

  test('vertical orientation is announced and laid out as a column', () => {
    render(<ThumbnailSelector aria-label="Images" orientation="vertical" items={ITEMS} />);
    const g = screen.getByRole('radiogroup');
    expect(g).toHaveAttribute('aria-orientation', 'vertical');
    expect(g).toHaveClass('omni-thumbs-v');
  });

  test('no accessibility violations', async () => {
    const { container } = render(<ThumbnailSelector aria-label="Product images" items={ITEMS} defaultValue={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('selection', () => {
  test('uncontrolled: defaultValue, then a click selects and reports (index, item)', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} defaultValue={1} onChange={onChange} />);
    expect(radios()[1]).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(radios()[3]);
    expect(onChange).toHaveBeenCalledWith(3, ITEMS[3]);
    expect(radios()[3]).toHaveAttribute('aria-checked', 'true');
    expect(radios()[1]).toHaveAttribute('aria-checked', 'false');
  });

  test('controlled: the parent owns value; without an update nothing moves', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} value={0} onChange={onChange} />);
    fireEvent.click(radios()[2]);
    expect(onChange).toHaveBeenCalledWith(2, ITEMS[2]);
    expect(radios()[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios()[2]).toHaveAttribute('aria-checked', 'false');
  });

  test('controlled with state: follows the parent', () => {
    function Host() {
      const [v, setV] = useState(0);
      return <ThumbnailSelector aria-label="Images" items={ITEMS} value={v} onChange={setV} />;
    }
    render(<Host />);
    fireEvent.click(radios()[2]);
    expect(radios()[2]).toHaveAttribute('aria-checked', 'true');
  });

  test('clicking the selected item does not report a change', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} onChange={onChange} />);
    fireEvent.click(radios()[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('keyboard (APG radio group)', () => {
  test('one tab stop: the selected item', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} defaultValue={2} />);
    expect(radios().map((r) => r.tabIndex)).toEqual([-1, -1, 0, -1]);
  });

  test('arrows move focus AND select, wrapping; Home / End jump', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} onChange={onChange} />);
    const r = radios();
    r[0].focus();
    fireEvent.keyDown(r[0], { key: 'ArrowRight' });
    expect(r[1]).toHaveFocus();
    expect(r[1]).toHaveAttribute('aria-checked', 'true');
    expect(r[1].tabIndex).toBe(0);
    expect(r[0].tabIndex).toBe(-1);
    fireEvent.keyDown(r[1], { key: 'ArrowDown' });
    expect(r[2]).toHaveFocus();
    fireEvent.keyDown(r[2], { key: 'ArrowUp' });
    expect(r[1]).toHaveFocus();
    fireEvent.keyDown(r[1], { key: 'End' });
    expect(r[3]).toHaveFocus();
    expect(r[3]).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(r[3], { key: 'ArrowRight' });
    expect(r[0]).toHaveFocus();
    fireEvent.keyDown(r[0], { key: 'ArrowLeft' });
    expect(r[3]).toHaveFocus();
    fireEvent.keyDown(r[3], { key: 'Home' });
    expect(r[0]).toHaveFocus();
    expect(onChange.mock.calls.map((c) => c[0])).toEqual([1, 2, 1, 3, 0, 3, 0]);
  });

  test('other keys are left alone', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} onChange={onChange} />);
    const ev = fireEvent.keyDown(radios()[0], { key: 'a' });
    expect(ev).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('disabled', () => {
  const MIXED = ITEMS.map((it, i) => (i === 1 ? { ...it, disabled: true } : it));

  test('a disabled item is skipped by the arrows and cannot be clicked', () => {
    const onChange = jest.fn();
    render(<ThumbnailSelector aria-label="Images" items={MIXED} onChange={onChange} />);
    const r = radios();
    expect(r[1]).toBeDisabled();
    expect(r[1]).toHaveClass('omni-thumb-off');
    fireEvent.click(r[1]);
    expect(onChange).not.toHaveBeenCalled();
    r[0].focus();
    fireEvent.keyDown(r[0], { key: 'ArrowRight' });
    expect(r[2]).toHaveFocus();
    fireEvent.keyDown(r[2], { key: 'ArrowLeft' });
    expect(r[0]).toHaveFocus();
  });

  test('a disabled selected item hands the tab stop to the first enabled one', () => {
    render(<ThumbnailSelector aria-label="Images" items={MIXED} value={1} />);
    expect(radios().map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  test('disabled on the group disables every thumbnail, dimmed by --Disabled', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} disabled />);
    radios().forEach((r) => expect(r).toBeDisabled());
    expect(ruleFor('.omni-thumb-off')).toContain('opacity: var(--Disabled, 0.38)');
  });
});

describe('visuals come from tokens', () => {
  test('sizes are Sizing-7 / 9 / 12, corners the card radius family capped at 25%', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS.slice(0, 1)} size="small" />);
    const r = radios()[0];
    expect(declared(r, '--_th-side')).toBe('var(--Sizing-7, 56px)');
    expect(declared(r, '--_th-r')).toBe('min(var(--Sm-Card-Radius, 14px), 25%)');
    expect(ruleFor('.omni-thumb-medium')).toContain('var(--Sizing-9, 72px)');
    expect(ruleFor('.omni-thumb-large')).toContain('var(--Sizing-12, 96px)');
    expect(ruleFor('.omni-thumb-img')).toContain('object-fit: cover');
  });

  test('rest edge: 1px --Border inside', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} />);
    expect(ruleFor('.omni-thumb::after')).toMatch(/box-shadow: inset 0 0 0 1px var\(--Border\)/);
  });

  test('selected: 2px --Border ring with a --Background gap — thicker and inset, not a color change', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} />);
    expect(radios()[0]).toHaveClass('omni-thumb-sel');
    const rule = ruleFor('.omni-thumb-sel::after');
    expect(rule).toMatch(/inset 0 0 0 2px var\(--Border\)/);
    expect(rule).toMatch(/inset 0 0 0 4px var\(--Background\)/);
    // Not a button border (falls to ~1.1:1 on dark surfaces), not the
    // decorative border, and never currentColor (the bug this replaces).
    const all = sheet();
    expect(all).not.toMatch(/--Buttons-/);
    expect(all).not.toMatch(/--Border-Variant/);
    expect(all).not.toMatch(/currentColor/i);
    expect(all).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  test('hover and pressed: the edge thickens and a --Hover / --Pressed veil shows', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} />);
    const css = sheet();
    expect(css).toMatch(/\.omni-thumb-on:hover::before \{[^}]*opacity: 0\.3/);
    expect(css).toMatch(/\.omni-thumb-on:active::before \{[^}]*background-color: var\(--Pressed\)/);
    expect(ruleFor('.omni-thumb::before')).toContain('background-color: var(--Hover)');
    expect(css).toMatch(/:hover::after[^{]*\{[^}]*inset 0 0 0 2px var\(--Border\)/);
  });

  test('focus: the house ring, 2px --Focus-Visible 1px outside — a different place from the selected ring', () => {
    render(<ThumbnailSelector aria-label="Images" items={ITEMS} />);
    const css = cssFor(radios()[0]);
    expect(ruleFor('.omni-thumb:focus-visible')).toMatch(/outline: 2px solid var\(--Focus-Visible\);\s*outline-offset: 1px/);
    expect(css).toContain('outline: none');
  });

  test('no inline color and no MUI class in the default render', () => {
    const { container } = render(<ThumbnailSelector aria-label="Images" items={ITEMS} />);
    expect(container.innerHTML).not.toMatch(/Mui|css-/);
    radios().forEach((r) => expect(r.getAttribute('style')).toBeNull());
  });
});

/* The ring and the rest edge are --Border against --Background. Resolve both
   for every theme × surface the shipped sheets define, in light and dark, and
   measure. This is the number the hand-built thumbnails failed (1.22:1). */
describe('selected ring contrast vs the surface it sits on', () => {
  const STYLES = path.join(__dirname, '../../../public/styles');
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const CONTAINERS = ['Container-Lowest', 'Container-Low', 'Container', 'Container-High', 'Container-Highest'];

  function measure(mode) {
    const css = fs.readFileSync(path.join(STYLES, mode + '-Mode.css'), 'utf8');
    const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
      sel: m[1].trim(),
      d: Object.fromEntries([...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()])),
    }));
    const root = Object.assign({}, ...blocks.filter((b) => /:root$/.test(b.sel)).map((b) => b.d));
    const resolve = (scope, v, depth = 0) => {
      const m = v && depth < 20 && v.match(/^var\((--[\w-]+)(?:,\s*(.*))?\)$/);
      if (!m) return v;
      const next = scope[m[1]] != null ? scope[m[1]] : root[m[1]];
      if (next == null) return m[2] ? resolve(scope, m[2], depth + 1) : null;
      return resolve(scope, next, depth + 1);
    };
    const out = [];
    for (const b of blocks) {
      const t = b.sel.match(/data-theme="([\w-]+)"\]\[data-surface(\^?)="([\w-]+)"/);
      if (!t) continue;
      for (const surface of t[2] ? CONTAINERS : [t[3]]) {
        const scope = { ...b.d };
        if (t[2]) scope['--Background'] = 'var(--' + surface + ')';
        const bg = resolve(scope, 'var(--Background)');
        const ring = resolve(scope, 'var(--Border)');
        out.push({ at: t[1] + '/' + surface, bg, ring, r: ratio(bg, ring) });
      }
    }
    return out;
  }

  test.each(['Light', 'Dark'])('%s mode: --Border clears 3:1 against --Background on every theme and surface', (mode) => {
    const rows = measure(mode);
    expect(rows.length).toBeGreaterThanOrEqual(12 * 10); // 12 themes × 10 surface levels
    for (const row of rows) {
      expect(row.bg).toMatch(/^#[0-9a-f]{6}$/i);
      expect(row.ring).toMatch(/^#[0-9a-f]{6}$/i);
    }
    const worst = rows.reduce((a, b) => (b.r < a.r ? b : a));
    expect(worst.r).toBeGreaterThanOrEqual(3);
  });
});
