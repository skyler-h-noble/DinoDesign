// src/components/Sheet/Sheet.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sheet, DefaultSheet, SolidSheet, LightSheet } from './Sheet';

/* ─── Helpers ─── */
const renderSheet = (props = {}) =>
  render(<Sheet {...props}><span>Content</span></Sheet>);

/* ─── Basic Rendering ─── */
describe('Sheet', () => {
  test('renders children', () => {
    renderSheet();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('renders as div by default', () => {
    const { container } = renderSheet();
    expect(container.querySelector('.sheet').tagName).toBe('DIV');
  });
});

/* ─── data-surface ─── */
describe('data-surface="Container"', () => {
  test('default variant', () => {
    const { container } = renderSheet({ variant: 'default' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  test('solid variant', () => {
    const { container } = renderSheet({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  test('light variant', () => {
    const { container } = renderSheet({ variant: 'light', color: 'primary' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });
});

/* ─── Default variant ─── */
describe('Default variant', () => {
  test('no data-theme', () => {
    const { container } = renderSheet({ variant: 'default' });
    expect(container.querySelector('.sheet')).not.toHaveAttribute('data-theme');
  });

  test('has sheet-default class', () => {
    const { container } = renderSheet({ variant: 'default' });
    expect(container.querySelector('.sheet-default')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'],
    ['info', 'Info-Medium'],
    ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'],
    ['error', 'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSheet({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary-Light'],
    ['secondary', 'Secondary-Light'],
    ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'],
    ['info', 'Info-Light'],
    ['success', 'Success-Light'],
    ['warning', 'Warning-Light'],
    ['error', 'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderSheet({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Variant classes ─── */
describe('Variant classes', () => {
  test('solid class', () => {
    const { container } = renderSheet({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.sheet-solid')).toBeInTheDocument();
  });

  test('light class', () => {
    const { container } = renderSheet({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.sheet-light')).toBeInTheDocument();
  });
});

/* ─── Bordered ─── */
describe('Bordered', () => {
  test('bordered by default', () => {
    const { container } = renderSheet();
    expect(container.querySelector('.sheet-bordered')).toBeInTheDocument();
  });

  test('bordered={false} removes bordered class', () => {
    const { container } = renderSheet({ bordered: false });
    expect(container.querySelector('.sheet-bordered')).not.toBeInTheDocument();
  });
});

/* ─── Rounded ─── */
describe('Rounded', () => {
  test('rounded by default', () => {
    const { container } = renderSheet();
    expect(container.querySelector('.sheet-rounded')).toBeInTheDocument();
  });

  test('rounded={false} removes rounded class', () => {
    const { container } = renderSheet({ rounded: false });
    expect(container.querySelector('.sheet-rounded')).not.toBeInTheDocument();
  });
});

/* ─── Elevation ─── */
describe('Elevation', () => {
  [0, 1, 2, 3].forEach((e) => {
    test('elevation ' + e + ' class', () => {
      const { container } = renderSheet({ elevation: e });
      expect(container.querySelector('.sheet-elevation-' + e)).toBeInTheDocument();
    });
  });
});

/* ─── Component override ─── */
describe('Component override', () => {
  test('renders as section', () => {
    const { container } = renderSheet({ component: 'section' });
    expect(container.querySelector('.sheet').tagName).toBe('SECTION');
  });

  test('renders as aside', () => {
    const { container } = renderSheet({ component: 'aside' });
    expect(container.querySelector('.sheet').tagName).toBe('ASIDE');
  });
});

/* ─── Convenience Exports ─── */
describe('Convenience exports', () => {
  test('DefaultSheet renders default variant', () => {
    const { container } = render(<DefaultSheet><span>T</span></DefaultSheet>);
    expect(container.querySelector('.sheet-default')).toBeInTheDocument();
  });

  test('SolidSheet renders with data-theme', () => {
    const { container } = render(<SolidSheet color="info"><span>T</span></SolidSheet>);
    expect(container.querySelector('[data-theme="Info-Medium"]')).toBeInTheDocument();
  });

  test('LightSheet renders with data-theme', () => {
    const { container } = render(<LightSheet color="error"><span>T</span></LightSheet>);
    expect(container.querySelector('[data-theme="Error-Light"]')).toBeInTheDocument();
  });
});
