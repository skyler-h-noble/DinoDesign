// src/components/Divider/Divider.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Divider,
  DefaultDivider,
  PrimaryDivider,
  InfoDivider,
  ErrorDivider,
} from './Divider';

describe('Divider Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Divider />);
    expect(container).toBeInTheDocument();
  });

  test('renders horizontal by default', () => {
    const { container } = render(<Divider />);
    const el = container.querySelector('[role="separator"]');
    expect(el).toBeInTheDocument();
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
  });

  test('renders vertical orientation', () => {
    const { container } = render(
      <div style={{ display: 'flex', height: 100 }}>
        <Divider orientation="vertical" />
      </div>
    );
    const el = container.querySelector('[role="separator"]');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  test('applies default color class', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('.divider-default')).toBeInTheDocument();
  });

  test.each([
    ['primary'], ['secondary'], ['tertiary'], ['neutral'],
    ['info'], ['success'], ['warning'], ['error'],
  ])('applies %s color class', (color) => {
    const { container } = render(<Divider color={color} />);
    expect(container.querySelector('.divider-' + color)).toBeInTheDocument();
  });

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(<Divider size={size} />);
    expect(container).toBeInTheDocument();
  });

  test('renders indicator text', () => {
    render(<Divider indicatorText="OR" color="primary" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  test('renders children as indicator', () => {
    render(<Divider color="primary">Section Break</Divider>);
    expect(screen.getByText('Section Break')).toBeInTheDocument();
  });

  test('adds divider-indicator class when indicator present', () => {
    const { container } = render(<Divider indicatorText="OR" color="primary" />);
    expect(container.querySelector('.divider-indicator')).toBeInTheDocument();
  });
});

describe('Convenience Exports', () => {
  test('DefaultDivider renders', () => {
    const { container } = render(<DefaultDivider />);
    expect(container.querySelector('.divider-default')).toBeInTheDocument();
  });

  test('PrimaryDivider renders', () => {
    const { container } = render(<PrimaryDivider />);
    expect(container.querySelector('.divider-primary')).toBeInTheDocument();
  });

  test('InfoDivider renders', () => {
    const { container } = render(<InfoDivider />);
    expect(container.querySelector('.divider-info')).toBeInTheDocument();
  });

  test('ErrorDivider renders', () => {
    const { container } = render(<ErrorDivider />);
    expect(container.querySelector('.divider-error')).toBeInTheDocument();
  });
});
