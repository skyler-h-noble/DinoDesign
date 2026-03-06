// src/components/Breadcrumbs/Breadcrumbs.test.js
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

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
