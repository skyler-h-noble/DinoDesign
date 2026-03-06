// src/components/List/List.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { List, DefaultList, SolidList, LightList } from './List';

const items = [
  { label: 'Home' }, { label: 'Inbox' }, { label: 'Projects' }, { label: 'Settings' },
];

describe('List', () => {
  test('renders all items', () => {
    render(<List items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  test('defaults to role list', () => {
    const { container } = render(<List items={items} />);
    expect(container.querySelector('[role="list"]')).toBeInTheDocument();
  });
  test('applies solid variant class', () => {
    const { container } = render(<List variant="solid" color="primary" items={items} />);
    expect(container.querySelector('.list-solid')).toBeInTheDocument();
  });
  test('applies light variant class', () => {
    const { container } = render(<List variant="light" color="primary" items={items} />);
    expect(container.querySelector('.list-light')).toBeInTheDocument();
  });
});

describe('data-theme', () => {
  test('solid primary => data-theme=Primary', () => {
    const { container } = render(<List variant="solid" color="primary" items={items} />);
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });
  test('solid info => data-theme=Info-Medium', () => {
    const { container } = render(<List variant="solid" color="info" items={items} />);
    expect(container.querySelector('[data-theme="Info-Medium"]')).toBeInTheDocument();
  });
  test('solid success => data-theme=Success-Medium', () => {
    const { container } = render(<List variant="solid" color="success" items={items} />);
    expect(container.querySelector('[data-theme="Success-Medium"]')).toBeInTheDocument();
  });
  test('solid error => data-theme=Error-Medium', () => {
    const { container } = render(<List variant="solid" color="error" items={items} />);
    expect(container.querySelector('[data-theme="Error-Medium"]')).toBeInTheDocument();
  });
  test('light primary => data-theme=Primary-Light', () => {
    const { container } = render(<List variant="light" color="primary" items={items} />);
    expect(container.querySelector('[data-theme="Primary-Light"]')).toBeInTheDocument();
  });
  test('light warning => data-theme=Warning-Light', () => {
    const { container } = render(<List variant="light" color="warning" items={items} />);
    expect(container.querySelector('[data-theme="Warning-Light"]')).toBeInTheDocument();
  });
  test('default has no data-theme', () => {
    const { container } = render(<List items={items} />);
    expect(container.querySelector('[data-theme]')).toBeNull();
  });
});

describe('Clickable Items', () => {
  test('get role button and tabIndex 0', () => {
    const { container } = render(<List clickable items={items} />);
    expect(container.querySelectorAll('[role="button"]').length).toBe(4);
    expect(container.querySelectorAll('[tabindex="0"]').length).toBe(4);
  });
  test('fires onClick', () => {
    const fn = jest.fn();
    render(<List items={[{ label: 'Click', clickable: true, onClick: fn }]} />);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('Enter activates', () => {
    const fn = jest.fn();
    const { container } = render(<List items={[{ label: 'Key', clickable: true, onClick: fn }]} />);
    fireEvent.keyDown(container.querySelector('[role="button"]'), { key: 'Enter' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('Space activates', () => {
    const fn = jest.fn();
    const { container } = render(<List items={[{ label: 'Key', clickable: true, onClick: fn }]} />);
    fireEvent.keyDown(container.querySelector('[role="button"]'), { key: ' ' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('disabled not focusable', () => {
    const { container } = render(<List clickable items={[{ label: 'Off', disabled: true }]} />);
    const el = container.querySelector('.list-item-disabled');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('tabindex')).toBeNull();
  });
});

describe('Checkbox Selection', () => {
  test('listbox with multiselectable', () => {
    const { container } = render(
      <List selectionMode="checkbox" items={items} selectedIndices={[]} onSelectionChange={() => {}} />
    );
    const lb = container.querySelector('[role="listbox"]');
    expect(lb.getAttribute('aria-multiselectable')).toBe('true');
  });
  test('options have aria-selected and aria-checked', () => {
    const { container } = render(
      <List selectionMode="checkbox" items={items} selectedIndices={[0]} onSelectionChange={() => {}} />
    );
    const opts = container.querySelectorAll('[role="option"]');
    expect(opts[0].getAttribute('aria-selected')).toBe('true');
    expect(opts[0].getAttribute('aria-checked')).toBe('true');
    expect(opts[1].getAttribute('aria-selected')).toBe('false');
  });
  test('renders checkboxes', () => {
    const { container } = render(
      <List selectionMode="checkbox" items={items} selectedIndices={[]} onSelectionChange={() => {}} />
    );
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(4);
  });
  test('toggle calls onSelectionChange', () => {
    const fn = jest.fn();
    render(<List selectionMode="checkbox" items={items} selectedIndices={[0]} onSelectionChange={fn} />);
    fireEvent.click(screen.getByText('Inbox'));
    expect(fn).toHaveBeenCalledWith([0, 1]);
  });
});

describe('Radio Selection', () => {
  test('listbox without multiselectable', () => {
    const { container } = render(
      <List selectionMode="radio" items={items} selectedIndices={[1]} onSelectionChange={() => {}} />
    );
    expect(container.querySelector('[role="listbox"]').getAttribute('aria-multiselectable')).toBeNull();
  });
  test('renders radios', () => {
    const { container } = render(
      <List selectionMode="radio" items={items} selectedIndices={[0]} onSelectionChange={() => {}} />
    );
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(4);
  });
  test('select replaces previous', () => {
    const fn = jest.fn();
    render(<List selectionMode="radio" items={items} selectedIndices={[0]} onSelectionChange={fn} />);
    fireEvent.click(screen.getByText('Inbox'));
    expect(fn).toHaveBeenCalledWith([1]);
  });
});

describe('Icon Button Decorators', () => {
  test('renders with role and aria-label', () => {
    const { container } = render(
      <List items={[{ label: 'Test', endDecorator: <span>X</span>,
        endDecoratorIsButton: true, endDecoratorAriaLabel: 'Remove' }]} />
    );
    const btn = container.querySelector('.list-item-decorator-button');
    expect(btn.getAttribute('aria-label')).toBe('Remove');
  });
  test('click does not propagate to row', () => {
    const rowFn = jest.fn();
    const btnFn = jest.fn();
    const { container } = render(
      <List items={[{ label: 'Test', clickable: true, onClick: rowFn,
        endDecorator: <span>X</span>, endDecoratorIsButton: true, onEndDecoratorAction: btnFn }]} />
    );
    fireEvent.click(container.querySelector('.list-item-decorator-button'));
    expect(btnFn).toHaveBeenCalledTimes(1);
    expect(rowFn).not.toHaveBeenCalled();
  });
});

describe('Convenience Exports', () => {
  test('DefaultList', () => {
    const { container } = render(<DefaultList items={items} />);
    expect(container.querySelector('.list-default')).toBeInTheDocument();
  });
  test('SolidList', () => {
    const { container } = render(<SolidList color="primary" items={items} />);
    expect(container.querySelector('.list-solid')).toBeInTheDocument();
  });
  test('LightList', () => {
    const { container } = render(<LightList color="primary" items={items} />);
    expect(container.querySelector('.list-light')).toBeInTheDocument();
  });
});