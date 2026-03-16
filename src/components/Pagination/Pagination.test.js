// src/components/Pagination/Pagination.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderPagination = (props = {}) => render(<Pagination count={10} {...props} />);

/* ─── Basic Rendering ─── */
describe('Pagination', () => {
  test('renders', () => {
    const { container } = renderPagination();
    expect(container.querySelector('.pagination')).toBeInTheDocument();
  });

  test('renders as nav element', () => {
    renderPagination();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('has aria-label="Pagination"', () => {
    renderPagination();
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
  });

  test('renders page buttons', () => {
    renderPagination({ count: 5 });
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
  });

  test('renders prev and next buttons', () => {
    renderPagination();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });
});

/* ─── aria-current ─── */
describe('aria-current', () => {
  test('default page has aria-current="page"', () => {
    renderPagination({ defaultPage: 3 });
    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page');
  });

  test('other pages do not have aria-current', () => {
    renderPagination({ defaultPage: 3 });
    expect(screen.getByLabelText('Page 1')).not.toHaveAttribute('aria-current');
    expect(screen.getByLabelText('Page 2')).not.toHaveAttribute('aria-current');
  });

  test('clicking a page updates aria-current', () => {
    renderPagination({ defaultPage: 1 });
    fireEvent.click(screen.getByLabelText('Page 4'));
    expect(screen.getByLabelText('Page 4')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Page 1')).not.toHaveAttribute('aria-current');
  });
});

/* ─── Navigation ─── */
describe('Navigation', () => {
  test('clicking next advances page', () => {
    renderPagination({ defaultPage: 1 });
    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(screen.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page');
  });

  test('clicking previous goes back', () => {
    renderPagination({ defaultPage: 3 });
    fireEvent.click(screen.getByLabelText('Go to previous page'));
    expect(screen.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page');
  });

  test('previous is disabled on page 1', () => {
    renderPagination({ defaultPage: 1 });
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  test('next is disabled on last page', () => {
    renderPagination({ count: 5, defaultPage: 5 });
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });

  test('onChange is called with page number', () => {
    const onChange = jest.fn();
    renderPagination({ defaultPage: 1, onChange });
    fireEvent.click(screen.getByLabelText('Page 5'));
    expect(onChange).toHaveBeenCalledWith(5);
  });
});

/* ─── First / Last buttons ─── */
describe('First / Last buttons', () => {
  test('not rendered by default', () => {
    renderPagination();
    expect(screen.queryByLabelText('Go to first page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to last page')).not.toBeInTheDocument();
  });

  test('rendered when showFirstButton and showLastButton', () => {
    renderPagination({ showFirstButton: true, showLastButton: true });
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  test('first button goes to page 1', () => {
    renderPagination({ defaultPage: 5, showFirstButton: true });
    fireEvent.click(screen.getByLabelText('Go to first page'));
    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
  });

  test('last button goes to last page', () => {
    renderPagination({ count: 10, defaultPage: 1, showLastButton: true });
    fireEvent.click(screen.getByLabelText('Go to last page'));
    expect(screen.getByLabelText('Page 10')).toHaveAttribute('aria-current', 'page');
  });

  test('first button disabled on page 1', () => {
    renderPagination({ defaultPage: 1, showFirstButton: true });
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
  });

  test('last button disabled on last page', () => {
    renderPagination({ count: 10, defaultPage: 10, showLastButton: true });
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
  });
});

/* ─── Ellipsis ─── */
describe('Ellipsis', () => {
  test('renders ellipsis for large page counts', () => {
    const { container } = renderPagination({ count: 20, defaultPage: 10 });
    const ellipses = container.querySelectorAll('.pagination-ellipsis');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  test('ellipsis has aria-hidden', () => {
    const { container } = renderPagination({ count: 20, defaultPage: 10 });
    const ellipsis = container.querySelector('.pagination-ellipsis');
    expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
  });

  test('no ellipsis when count is small', () => {
    const { container } = renderPagination({ count: 5 });
    expect(container.querySelector('.pagination-ellipsis')).not.toBeInTheDocument();
  });
});

/* ─── Variant classes ─── */
describe('Variant classes', () => {
  test('solid variant class', () => {
    const { container } = renderPagination({ variant: 'solid' });
    expect(container.querySelector('.pagination-solid')).toBeInTheDocument();
  });

  test('light variant class', () => {
    const { container } = renderPagination({ variant: 'light' });
    expect(container.querySelector('.pagination-light')).toBeInTheDocument();
  });
});

/* ─── Color classes ─── */
describe('Color classes', () => {
  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  colors.forEach((c) => {
    test(c + ' color class', () => {
      const { container } = renderPagination({ color: c });
      expect(container.querySelector('.pagination-' + c)).toBeInTheDocument();
    });
  });
});

/* ─── Size classes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderPagination({ size: s });
      expect(container.querySelector('.pagination-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Selected class ─── */
describe('Selected state', () => {
  test('selected page has pagination-selected class', () => {
    const { container } = renderPagination({ defaultPage: 3 });
    expect(container.querySelector('.pagination-selected')).toBeInTheDocument();
  });
});

/* ─── Disabled ─── */
describe('Disabled', () => {
  test('all page buttons are disabled', () => {
    renderPagination({ count: 5, disabled: true });
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText('Page ' + i)).toBeDisabled();
    }
  });

  test('prev and next are disabled', () => {
    renderPagination({ disabled: true });
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });
});

/* ─── Controlled mode ─── */
describe('Controlled mode', () => {
  test('respects controlled page prop', () => {
    renderPagination({ page: 5 });
    expect(screen.getByLabelText('Page 5')).toHaveAttribute('aria-current', 'page');
  });
});

/* ─── Defaults ─── */
describe('Defaults', () => {
  test('default variant is solid', () => {
    const { container } = renderPagination();
    expect(container.querySelector('.pagination-solid')).toBeInTheDocument();
  });

  test('default color is primary', () => {
    const { container } = renderPagination();
    expect(container.querySelector('.pagination-primary')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderPagination();
    expect(container.querySelector('.pagination-medium')).toBeInTheDocument();
  });

  test('default page is 1', () => {
    renderPagination();
    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
  });
});

/* ─── Sibling and boundary count ─── */
describe('Sibling and boundary count', () => {
  test('siblingCount=0 shows fewer pages', () => {
    const { container } = renderPagination({ count: 20, defaultPage: 10, siblingCount: 0, boundaryCount: 1 });
    const pages = container.querySelectorAll('.pagination-page');
    // Should show: 1, ..., 10, ..., 20 = fewer than siblingCount=1
    expect(pages.length).toBeLessThanOrEqual(5);
  });

  test('boundaryCount=2 shows more boundary pages', () => {
    const { container } = renderPagination({ count: 20, defaultPage: 10, siblingCount: 1, boundaryCount: 2 });
    // Should include pages 1, 2 at start and 19, 20 at end
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 19')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Pagination — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Pagination count={5} aria-label="Pagination" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Pagination count={5} aria-label="Pagination" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Pagination count={5} aria-label="Pagination" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
