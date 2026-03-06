import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, DefaultTable, OutlinedTable, LightTable, SolidTable } from './Table';

const cols = [
  { label: 'Name', field: 'name' },
  { label: 'Value', field: 'value', align: 'right' },
];
const data = [
  { name: 'Alpha', value: 10 },
  { name: 'Beta', value: 20 },
  { name: 'Gamma', value: 30 },
];
const foot = [{ name: 'Total', value: 60 }];

describe('Table', () => {
  test('renders without crashing', () => {
    const { container } = render(<Table columns={cols} rows={data} />);
    expect(container).toBeInTheDocument();
  });

  test('renders header and body cells', () => {
    render(<Table columns={cols} rows={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  test('renders footer rows', () => {
    render(<Table columns={cols} rows={data} footerRows={foot} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('defaults to default variant', () => {
    const { container } = render(<Table columns={cols} rows={data} />);
    expect(container.querySelector('.table-default')).toBeInTheDocument();
  });

  test.each(['outlined', 'light', 'solid'])('applies %s variant', (v) => {
    const { container } = render(
      <Table variant={v} color="primary" columns={cols} rows={data} />
    );
    expect(container.querySelector('.table-' + v)).toBeInTheDocument();
  });

  test('solid applies data-theme', () => {
    const { container } = render(
      <Table variant="solid" color="primary" columns={cols} rows={data} />
    );
    const w = container.querySelector('.table-wrapper');
    expect(w.getAttribute('data-theme')).toBe('Primary-Medium');
  });

  test('stripe odd applies data-surface', () => {
    const { container } = render(
      <Table stripe="odd" columns={cols} rows={data} />
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0].getAttribute('data-surface')).toBe('Surface');
    expect(trs[1].getAttribute('data-surface')).toBe('Surface-Dim');
    expect(trs[2].getAttribute('data-surface')).toBe('Surface');
  });

  test('stripe even applies data-surface', () => {
    const { container } = render(
      <Table stripe="even" columns={cols} rows={data} />
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0].getAttribute('data-surface')).toBe('Surface-Dim');
    expect(trs[1].getAttribute('data-surface')).toBe('Surface');
  });

  test('renders children when no columns', () => {
    render(
      <Table>
        <thead><tr><th>Custom</th></tr></thead>
        <tbody><tr><td>Cell</td></tr></tbody>
      </Table>
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('DefaultTable', () => {
    const { container } = render(<DefaultTable columns={cols} rows={data} />);
    expect(container.querySelector('.table-default')).toBeInTheDocument();
  });
  test('OutlinedTable', () => {
    const { container } = render(
      <OutlinedTable color="primary" columns={cols} rows={data} />
    );
    expect(container.querySelector('.table-outlined')).toBeInTheDocument();
  });
  test('LightTable', () => {
    const { container } = render(
      <LightTable color="primary" columns={cols} rows={data} />
    );
    expect(container.querySelector('.table-light')).toBeInTheDocument();
  });
  test('SolidTable', () => {
    const { container } = render(
      <SolidTable color="primary" columns={cols} rows={data} />
    );
    expect(container.querySelector('.table-solid')).toBeInTheDocument();
  });
});
