// src/components/Tooltip/Tooltip.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Tooltip, SolidTooltip, LightTooltip, OutlineTooltip } from './Tooltip';
import { axe } from 'jest-axe';

// MUI Tooltip uses Popper; tests use open={true} for synchronous rendering

describe('Tooltip', () => {
  test('renders children', () => {
    render(<Tooltip title="Tip"><button>Trigger</button></Tooltip>);
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  test('shows tooltip content when open', async () => {
    render(
      <Tooltip title="Hello tooltip" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Hello tooltip')).toBeInTheDocument();
    });
  });

  test('hides tooltip when open={false}', () => {
    render(
      <Tooltip title="Hidden" open={false}>
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});

describe('data-theme', () => {
  test('solid primary => data-theme=Primary', async () => {
    render(
      <Tooltip title="Solid" variant="solid" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
    });
  });

  test('solid info => data-theme=Info', async () => {
    render(
      <Tooltip title="Info" variant="solid" color="info" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Info"]')).toBeInTheDocument();
    });
  });

  test('solid success => data-theme=Success', async () => {
    render(
      <Tooltip title="Suc" variant="solid" color="success" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Success"]')).toBeInTheDocument();
    });
  });

  test('solid error => data-theme=Error', async () => {
    render(
      <Tooltip title="Err" variant="solid" color="error" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Error"]')).toBeInTheDocument();
    });
  });

  test('light primary => data-theme=Primary', async () => {
    render(
      <Tooltip title="Light" variant="light" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
    });
  });

  test('light warning => data-theme=Warning-Light', async () => {
    render(
      <Tooltip title="Warn" variant="light" color="warning" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('[data-theme="Warning"]')).toBeInTheDocument();
    });
  });

  test('outline has no data-theme', async () => {
    render(
      <Tooltip title="Outline" variant="outline" color="primary" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Outline')).toBeInTheDocument();
    });
    expect(document.querySelector('.tooltip-content[data-theme]')).not.toBeInTheDocument();
  });
});

describe('Variant classes', () => {
  test('solid class', async () => {
    render(
      <Tooltip title="S" variant="solid" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-solid')).toBeInTheDocument();
    });
  });

  test('light class', async () => {
    render(
      <Tooltip title="L" variant="light" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-light')).toBeInTheDocument();
    });
  });

  test('outline class', async () => {
    render(
      <Tooltip title="O" variant="outline" color="primary" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-outline')).toBeInTheDocument();
    });
  });
});

describe('Size classes', () => {
  test('small', async () => {
    render(
      <Tooltip title="Sm" size="small" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-small')).toBeInTheDocument();
    });
  });

  test('medium', async () => {
    render(
      <Tooltip title="Md" size="medium" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-medium')).toBeInTheDocument();
    });
  });

  test('large', async () => {
    render(
      <Tooltip title="Lg" size="large" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-large')).toBeInTheDocument();
    });
  });
});

describe('Arrow', () => {
  test('renders arrow when arrow=true', async () => {
    const { baseElement } = render(
      <Tooltip title="Arr" arrow open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(baseElement.querySelector('[class*="MuiTooltip-arrow"]')).toBeInTheDocument();
    });
  });

  test('no arrow when arrow=false', async () => {
    const { baseElement } = render(
      <Tooltip title="NoArr" arrow={false} open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('NoArr')).toBeInTheDocument();
    });
    expect(baseElement.querySelector('[class*="MuiTooltip-arrow"]')).not.toBeInTheDocument();
  });
});

describe('Placement', () => {
  test('applies placement via popper', async () => {
    render(
      <Tooltip title="Top" placement="top" open={true}>
        <button>T</button>
      </Tooltip>
    );
    await waitFor(() => {
      expect(screen.getByText('Top')).toBeInTheDocument();
    });
    expect(document.querySelector('[data-popper-placement="top"]')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('SolidTooltip', async () => {
    render(
      <SolidTooltip title="ST" color="primary" open={true}>
        <button>T</button>
      </SolidTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-solid')).toBeInTheDocument();
    });
  });

  test('LightTooltip', async () => {
    render(
      <LightTooltip title="LT" color="primary" open={true}>
        <button>T</button>
      </LightTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-light')).toBeInTheDocument();
    });
  });

  test('OutlineTooltip', async () => {
    render(
      <OutlineTooltip title="OT" color="primary" open={true}>
        <button>T</button>
      </OutlineTooltip>
    );
    await waitFor(() => {
      expect(document.querySelector('.tooltip-outline')).toBeInTheDocument();
    });
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Tooltip — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Tooltip title="Helpful tip"><button>Hover me</button></Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Tooltip title="Helpful tip"><button>Hover me</button></Tooltip>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Tooltip title="Helpful tip"><button>Hover me</button></Tooltip>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/**
 * Elevation comes from the system, not from a literal.
 *
 * Tooltip shipped `boxShadow: '0 2px 8px rgba(0,0,0,0.15)'` — a raw rgba. It
 * had no elevation anywhere else: no group in the studio's COMPONENT_ELEVATIONS
 * and none in Figma's Component-Elevations collection, so there was nothing for
 * it to disagree with and nothing reported it. What it cost: the shadow ignored
 * --Dropshadow-Color, so it did not follow the theme or the surface, and it
 * painted an identical black shadow in dark mode.
 *
 * Level 2 is the resting level of the `AppBar, Toolbars, Menus` group, which
 * Tooltip shares — a transient, anchored, non-blocking floating panel is the
 * Menu's behaviour. There is no Hover level, for the same reason the Accordion
 * has none: a tooltip IS the hover result.
 *
 * Asserted on the SOURCE rather than the rendered node, deliberately. jsdom
 * drops a `var()` it cannot resolve, so `toHaveStyle({ boxShadow:
 * 'var(--Effect-Level-2)' })` reduces the expectation to empty and passes
 * against any value at all — including the rgba this replaced.
 */
describe('Tooltip — elevation is a token', () => {
  // eslint-disable-next-line global-require
  const source = require('fs').readFileSync(require.resolve('./Tooltip.js'), 'utf8');

  it('reads --Effect-Level-2 for its shadow', () => {
    expect(source).toContain("boxShadow: 'var(--Effect-Level-2)'");
  });

  it('hardcodes no rgba/rgb shadow', () => {
    const shadows = source.match(/boxShadow:\s*'[^']*'/g) || [];
    const literal = shadows.filter((d) => /rgba?\(|#[0-9a-f]{3,8}/i.test(d));
    expect(literal).toEqual([]);
  });

  it('does not reach for a Hover elevation', () => {
    // The group is hasHover: false. An Effect-Level-3 here would invent a state
    // the component does not have.
    expect(source).not.toContain('--Effect-Level-3');
  });
});

/**
 * Colour comes from the BUTTONS collection, and the arrow is on by default.
 *
 * Figma's Tooltip (4 Location variants) puts one `Buttons: black-white` pin on
 * an inner `Button-Theme-Tooltip` frame; the bubble and the arrow read
 * Buttons::Button and the label and icon read Buttons::Text. The shadow sits a
 * level up on the component root so it reads the ambient surface rather than
 * the tooltip's own pin.
 *
 * The lib read --Background / --Text instead — the SURFACE. That painted the
 * bubble the colour of whatever it floated over, and left no way to recolour a
 * tooltip at all, since re-pinning a Buttons mode is precisely what the design
 * says you do. Three of those assignments were ternaries whose branches were
 * identical, so `isOutline` chose between two copies of one value.
 *
 * Source assertions, not rendered ones: jsdom discards a `var()` it cannot
 * resolve, so toHaveStyle on any of these passes against any value.
 */
describe('Tooltip — colour source and arrow default', () => {
  const source = require('fs').readFileSync(require.resolve('./Tooltip.js'), 'utf8');

  it('paints the bubble and label from the Buttons collection', () => {
    expect(source).toContain("const tooltipBg = 'var(--Buttons-' + C + '-Button)'");
    expect(source).toContain("const tooltipText = 'var(--Buttons-' + C + '-Text)'");
  });

  it('gives the arrow the bubble’s own fill', () => {
    expect(source).toContain('const arrowColor = tooltipBg;');
  });

  it('no longer reads the surface for its fill or label', () => {
    for (const decl of ['const tooltipBg', 'const tooltipText', 'const arrowColor']) {
      const line = source.split('\n').find((l) => l.trim().startsWith(decl));
      expect(line).toBeTruthy();
      expect(line).not.toMatch(/--Background|--Text\)/);
    }
  });

  it('has no ternary whose branches are identical', () => {
    const dead = source.split('\n').filter((l) => {
      const m = l.match(/\?\s*(.+?)\s*:\s*(.+?);\s*$/);
      return m && m[1].trim() === m[2].trim();
    });
    expect(dead).toEqual([]);
  });

  it('defaults color to black-white, the mode Figma pins', () => {
    expect(source).toContain("color = 'black-white'");
  });

  it('routes the palette through the shared token mapping, not cap()', () => {
    // cap('black-white') is 'Black-white', which is not a token. The design
    // system emits --Buttons-BlackWhite-*.
    expect(source).toContain('const C = seg(color);');
    expect(source).toContain("import { tokenSegment } from '../_shadows'");
  });

  it('defaults the arrow on, because every Figma variant has one', () => {
    expect(source).toContain('arrow = true');
  });

  it('renders by default without crashing on the black-white palette', async () => {
    render(<Tooltip title="hi"><button type="button">t</button></Tooltip>);
    expect(screen.getByRole('button', { name: 't' })).toBeInTheDocument();
  });
});

/**
 * Arrow geometry: two dimensions, from the design system.
 *
 * The arrow was one number — `arrowSize` — set as MUI's `fontSize`, and MUI
 * derives `width: 1em; height: 0.71em` from it, because it draws the arrow as a
 * rotated square (its own comment: "= width / sqrt(2)"). Three consequences,
 * all invisible without measuring:
 *   - the ratio was locked at 1:0.71, where the design draws 2:1 (16x8 medium)
 *   - `arrowSize: 8` rendered an 8px-wide arrow where the design says 16
 *   - width and height could not move independently at all
 *
 * In Figma the height scaled (Tooltip-Arrow 6/8/10) while the width sat on a
 * generic `Sizing-2` — a flat 16 — so the proportion drifted across sizes:
 * 2.67:1 small, 2.00:1 medium, 1.60:1 large. Tooltip-Arrow-Width fixes the
 * ratio at 2:1 by deriving width = 2 x height.
 */
describe('Tooltip — arrow takes width and height separately', () => {
  const source = require('fs').readFileSync(require.resolve('./Tooltip.js'), 'utf8');

  it('no longer drives the arrow through fontSize', () => {
    /* `fontSize` on the arrow slot is what made the two dimensions inseparable.
       The bubble still has one for its type size, and each SIZE_MAP entry has
       one; what must not come back is a fontSize inside the arrow slot. */
    const arrowAt = source.indexOf('arrow: {');
    expect(arrowAt).toBeGreaterThan(-1);
    expect(source.slice(arrowAt)).not.toMatch(/fontSize\s*:/);
  });

  it('has no arrowSize left anywhere', () => {
    expect(source).not.toMatch(/arrowSize\s*[:.]/);
  });

  it('reads both arrow dimensions from the design system', () => {
    for (const t of ['Tooltip-Arrow-Width', 'Tooltip-Arrow-Height', 'Tooltip-Visible-Arrow-Height']) {
      expect(source).toContain(t);
    }
  });

  it('swaps the axes for left/right, as MUI and the design both do', () => {
    expect(source).toContain('const sideways = isSideways(placement);');
    expect(source).toContain('width: sideways ? s.arrowVisible : s.arrowW');
    expect(source).toContain('height: sideways ? s.arrowW : s.arrowVisible');
  });

  it('every size names a width token whose fallback is 2x its height fallback', () => {
    // The fallbacks are the design's numbers, so the 2:1 has to hold in them too
    // or an older design system with no Tooltip tokens renders a drifting arrow.
    const pairs = [['Sm-', 12, 6], ['', 16, 8], ['Lg-', 20, 10]];
    for (const [prefix, w, h] of pairs) {
      expect(source).toContain(`var(--${prefix}Tooltip-Arrow-Width, ${w}px)`);
      expect(source).toContain(`var(--${prefix}Tooltip-Arrow-Height, ${h}px)`);
      expect(w).toBe(h * 2);
    }
  });

  it('applies the design’s gap token to the bubble', () => {
    expect(source).toContain('gap: s.gap');
  });

  it('renders at every size and placement without crashing', () => {
    for (const size of ['small', 'medium', 'large']) {
      for (const placement of ['top', 'bottom', 'left', 'right']) {
        const { unmount } = render(
          <Tooltip title="t" size={size} placement={placement}><button type="button">x</button></Tooltip>,
        );
        unmount();
      }
    }
  });
});

describe('Tooltip — radius is the flat design token', () => {
  const source = require('fs').readFileSync(require.resolve('./Tooltip.js'), 'utf8');

  it('reads --Tooltip-Radius, falling back to the old brand radius', () => {
    expect(source).toContain("borderRadius: 'var(--Tooltip-Radius, var(--Style-Border-Radius))'");
  });

  it('does not read --Style-Border-Radius on its own', () => {
    /* It did, and that is a BRAND value that moves per design system, while the
       design pins the tooltip corner flat at 8. The two disagreed for every
       brand whose radius was not 8 — silently, since both sides resolved. */
    const line = source.split('\n').find((l) => l.includes('borderRadius:'));
    expect(line).toContain('--Tooltip-Radius');
  });
});
