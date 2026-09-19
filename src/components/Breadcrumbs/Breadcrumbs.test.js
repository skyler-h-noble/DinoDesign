// src/components/Breadcrumbs/Breadcrumbs.test.js
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const CRUMBS = ['Home', 'Products', 'Electronics', 'Computers', 'Laptops', 'MacBook Pro'];

const renderBreadcrumbs = (props = {}, items = CRUMBS) =>
  render(
    <Breadcrumbs {...props}>
      {items.map((label, i) => (
        <BreadcrumbItem key={label} href={i < items.length - 1 ? '#' : undefined}>
          {label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );

/* ─── Basic Rendering ─── */
describe('Breadcrumbs', () => {
  test('renders all crumb items', () => {
    renderBreadcrumbs();
    CRUMBS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('renders as nav element', () => {
    const { container } = renderBreadcrumbs();
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  test('has aria-label="Breadcrumb"', () => {
    const { container } = renderBreadcrumbs();
    expect(container.querySelector('nav')).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  test('uses ordered list', () => {
    const { container } = renderBreadcrumbs();
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  test('items are list items', () => {
    const { container } = renderBreadcrumbs();
    const listItems = container.querySelectorAll('li.breadcrumb-item');
    expect(listItems.length).toBe(CRUMBS.length);
  });
});

/* ─── Current Page ─── */
describe('Current page (last item)', () => {
  test('last item has aria-current="page"', () => {
    const { container } = renderBreadcrumbs();
    const items = container.querySelectorAll('.breadcrumb-item');
    const lastItem = items[items.length - 1];
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  test('last item has breadcrumb-current class', () => {
    const { container } = renderBreadcrumbs();
    expect(container.querySelector('.breadcrumb-current')).toBeInTheDocument();
  });

  test('non-last items do not have aria-current', () => {
    const { container } = renderBreadcrumbs();
    const items = container.querySelectorAll('.breadcrumb-item');
    for (let i = 0; i < items.length - 1; i++) {
      expect(items[i]).not.toHaveAttribute('aria-current');
    }
  });
});

/* ─── Separators ─── */
describe('Separators', () => {
  test('default separator is /', () => {
    const { container } = renderBreadcrumbs();
    const seps = container.querySelectorAll('.breadcrumb-separator');
    expect(seps.length).toBe(CRUMBS.length - 1);
    expect(seps[0].textContent).toBe('/');
  });

  test('custom string separator', () => {
    const { container } = renderBreadcrumbs({ separator: '>' });
    const seps = container.querySelectorAll('.breadcrumb-separator');
    expect(seps[0].textContent).toBe('>');
  });

  test('custom React node separator', () => {
    const { container } = renderBreadcrumbs({ separator: <span data-testid="custom-sep">→</span> });
    const seps = container.querySelectorAll('.breadcrumb-separator');
    expect(seps[0].querySelector('[data-testid="custom-sep"]')).toBeInTheDocument();
  });

  test('separators are aria-hidden', () => {
    const { container } = renderBreadcrumbs();
    const seps = container.querySelectorAll('.breadcrumb-separator');
    seps.forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('separators have role=presentation', () => {
    const { container } = renderBreadcrumbs();
    const seps = container.querySelectorAll('.breadcrumb-separator');
    seps.forEach((sep) => {
      expect(sep).toHaveAttribute('role', 'presentation');
    });
  });
});

/* ─── Sizes ─── */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderBreadcrumbs({ size: s });
      expect(container.querySelector('.breadcrumbs-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Condense ─── */
describe('Condense', () => {
  test('does not condense when items <= maxItems', () => {
    renderBreadcrumbs({ condense: true, maxItems: 4 }, ['Home', 'Products', 'Detail']);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
    expect(screen.queryByLabelText('Show full breadcrumb trail')).not.toBeInTheDocument();
  });

  test('condenses when items > maxItems', () => {
    renderBreadcrumbs({ condense: true, maxItems: 4 });
    // First item visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    // Last item visible
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    // Middle items hidden
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    expect(screen.queryByText('Computers')).not.toBeInTheDocument();
    // Ellipsis button present
    expect(screen.getByLabelText('Show full breadcrumb trail')).toBeInTheDocument();
  });

  test('clicking ellipsis expands all items', () => {
    renderBreadcrumbs({ condense: true, maxItems: 4 });
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Show full breadcrumb trail'));
    // All items now visible
    CRUMBS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    // Ellipsis gone
    expect(screen.queryByLabelText('Show full breadcrumb trail')).not.toBeInTheDocument();
  });

  test('ellipsis has aria-label', () => {
    renderBreadcrumbs({ condense: true, maxItems: 4 });
    const btn = screen.getByLabelText('Show full breadcrumb trail');
    expect(btn.tagName).toBe('BUTTON');
  });
});

/* ─── Back Only Mobile ─── */
describe('Back only mobile', () => {
  test('mobile back element exists when backOnlyMobile is true', () => {
    const { container } = renderBreadcrumbs({ backOnlyMobile: true });
    expect(container.querySelector('.breadcrumbs-back-mobile')).toBeInTheDocument();
  });

  test('mobile back element does not exist when backOnlyMobile is false', () => {
    const { container } = renderBreadcrumbs({ backOnlyMobile: false });
    expect(container.querySelector('.breadcrumbs-back-mobile')).not.toBeInTheDocument();
  });

  test('mobile back shows parent (second to last) item', () => {
    const { container } = renderBreadcrumbs({ backOnlyMobile: true });
    const backEl = container.querySelector('.breadcrumbs-back-mobile');
    expect(backEl.textContent).toContain('Laptops');
  });

  test('mobile back contains ← arrow', () => {
    const { container } = renderBreadcrumbs({ backOnlyMobile: true });
    const backEl = container.querySelector('.breadcrumbs-back-mobile');
    expect(backEl.textContent).toContain('←');
  });
});

/* ─── BreadcrumbItem ─── */
describe('BreadcrumbItem', () => {
  test('renders as anchor when href provided', () => {
    render(<BreadcrumbItem href="#">Link Crumb</BreadcrumbItem>);
    const el = screen.getByText('Link Crumb');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '#');
  });

  test('renders as span when no href', () => {
    render(<BreadcrumbItem>Current Page</BreadcrumbItem>);
    const el = screen.getByText('Current Page');
    expect(el.tagName).toBe('SPAN');
    expect(el).not.toHaveAttribute('href');
  });

  test('link item has underline', () => {
    render(<BreadcrumbItem href="#">Underlined</BreadcrumbItem>);
    const el = screen.getByText('Underlined');
    expect(el).toHaveClass('breadcrumb-link');
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default size is medium', () => {
    const { container } = renderBreadcrumbs();
    expect(container.querySelector('.breadcrumbs-medium')).toBeInTheDocument();
  });

  test('default separator is /', () => {
    const { container } = renderBreadcrumbs();
    const sep = container.querySelector('.breadcrumb-separator');
    expect(sep.textContent).toBe('/');
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Breadcrumbs — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Breadcrumbs><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Page</BreadcrumbItem></Breadcrumbs>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Breadcrumbs><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Page</BreadcrumbItem></Breadcrumbs>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Breadcrumbs><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Page</BreadcrumbItem></Breadcrumbs>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* The separator channel is ONE value at every size.
 *
 * It was 6 / 8 / 10 in literal pixels — 6 and 10 are not on the Sizing scale,
 * so neither could ever be a token. The gap sits on the CONTAINER, so it
 * applies either side of every separator; what that channel tracks is the
 * text (14 / 16 / 18), and a half-text channel targets 7 / 8 / 9, all of which
 * snap to --Sizing-1.
 *
 * Checkbox's 4 / 8 / 12 was the tempting thing to copy and would have been
 * wrong: that ramp is keyed to a CONTROL's box size, and 12px either side of a
 * separator is a 24px channel that breaks a trail into separate words.
 */
describe('the separator gap does not scale with size', () => {
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  test.each(['small', 'medium', 'large'])('%s uses var(--Sizing-1)', (size) => {
    const { container } = render(
      <Breadcrumbs size={size}>
        <span>Home</span><span>Products</span><span>Shoes</span>
      </Breadcrumbs>
    );
    const list = container.querySelector('ol, ul') || container.firstChild;
    expect(cssFor(list)).toContain('var(--Sizing-1)');
  });

  test('and carries no hardcoded pixel gap', () => {
    const { container } = render(
      <Breadcrumbs size="large"><span>A</span><span>B</span></Breadcrumbs>
    );
    const list = container.querySelector('ol, ul') || container.firstChild;
    expect(cssFor(list)).not.toMatch(/gap:\s*(6|10)px/);
  });
});

/* The current page is marked by WEIGHT, not colour alone.
 *
 * The design sets `Type=current` in SemiBold and `Type=default` in Regular.
 * Weight survives greyscale and colour-blindness, so it carries the meaning
 * even where the colour difference does not — and it is the one signal that
 * still reads once the underline is the only other cue.
 *
 * From the token, not a literal 600: a brand that re-picks its semibold has
 * to move this with it.
 */
describe('the current crumb is semibold', () => {
  const cssFor = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  test('reads the semibold token, not a hardcoded weight', () => {
    const { container } = render(
      <Breadcrumbs><span>Home</span><span>Products</span><span>Shoes</span></Breadcrumbs>
    );
    const current = container.querySelector('.breadcrumb-current');
    expect(current).toBeInTheDocument();
    expect(cssFor(current)).toContain('--Body-Medium-Semibold-Font-Weight');
  });

  /* Colour splits the two roles as well as weight: the crumbs that ARE links
     take the link role, the current page takes --Text. It used to paint the
     links --Quiet, the muted-TEXT role — legible, but not announcing itself as
     a link. The current page keeps --Text rather than the design's Hotlink: it
     is not a link, and in a system where every hotlink is underlined, a
     hotlink-coloured item with no underline is a colour with nothing behind
     it. */
  test('links take the link role, the current page takes --Text', () => {
    const { container } = render(
      <Breadcrumbs><span>Home</span><span>Products</span><span>Shoes</span></Breadcrumbs>
    );
    const first = container.querySelectorAll('.breadcrumb-item')[0];
    const current = container.querySelector('.breadcrumb-current');
    expect(cssFor(first)).toContain('var(--Link, var(--Hotlink))');
    expect(cssFor(first)).not.toContain('var(--Quiet)');
    expect(cssFor(current)).toContain('var(--Text)');
  });

  test('and the other crumbs are not bolded', () => {
    const { container } = render(
      <Breadcrumbs><span>Home</span><span>Products</span><span>Shoes</span></Breadcrumbs>
    );
    const first = container.querySelectorAll('.breadcrumb-item')[0];
    expect(first.className).not.toContain('breadcrumb-current');
    expect(cssFor(first)).not.toContain('Semibold-Font-Weight');
  });
});
