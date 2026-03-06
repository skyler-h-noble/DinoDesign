// src/components/Card/Card.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Card, CardContent, CardOverflow, CardCover, CardActions,
  DefaultCard, SolidCard, LightCard,
} from './Card';

/* ─── Helpers ─── */
const renderCard = (props = {}, children) =>
  render(
    <Card {...props}>
      <CardContent>{children || <span>Content</span>}</CardContent>
    </Card>
  );

/* ─── data-surface ─── */
describe('data-surface="Container"', () => {
  test('default variant has data-surface="Container"', () => {
    const { container } = renderCard({ variant: 'default' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  test('solid variant has data-surface="Container"', () => {
    const { container } = renderCard({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });

  test('light variant has data-surface="Container"', () => {
    const { container } = renderCard({ variant: 'light', color: 'primary' });
    expect(container.querySelector('[data-surface="Container"]')).toBeInTheDocument();
  });
});

/* ─── Default variant ─── */
describe('Default variant', () => {
  test('no data-theme', () => {
    const { container } = renderCard({ variant: 'default' });
    expect(container.querySelector('.card')).not.toHaveAttribute('data-theme');
  });

  test('has card-default class', () => {
    const { container } = renderCard({ variant: 'default' });
    expect(container.querySelector('.card-default')).toBeInTheDocument();
  });
});

/* ─── Default border logic ─── */
describe('Default border — Border-Variant vs Border', () => {
  test('non-clickable default uses Border-Variant class', () => {
    const { container } = renderCard({ variant: 'default', clickable: false });
    const card = container.querySelector('.card');
    expect(card).not.toHaveClass('card-clickable');
  });

  test('clickable default upgrades to card-clickable', () => {
    const { container } = renderCard({ variant: 'default', clickable: true });
    expect(container.querySelector('.card-clickable')).toBeInTheDocument();
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
      const { container } = renderCard({ variant: 'solid', color });
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
      const { container } = renderCard({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Variant classes ─── */
describe('Variant classes', () => {
  test('solid class', () => {
    const { container } = renderCard({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.card-solid')).toBeInTheDocument();
  });

  test('light class', () => {
    const { container } = renderCard({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.card-light')).toBeInTheDocument();
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderCard({ size: s });
      expect(container.querySelector('.card-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Orientation ─── */
describe('Orientation classes', () => {
  test('vertical class (default)', () => {
    const { container } = renderCard();
    expect(container.querySelector('.card-vertical')).toBeInTheDocument();
  });

  test('horizontal class', () => {
    const { container } = renderCard({ orientation: 'horizontal' });
    expect(container.querySelector('.card-horizontal')).toBeInTheDocument();
  });
});

/* ─── Clickable ─── */
describe('Clickable', () => {
  test('clickable card has role=button', () => {
    const { container } = renderCard({ clickable: true });
    expect(container.querySelector('[role="button"]')).toBeInTheDocument();
  });

  test('clickable card has tabIndex=0', () => {
    const { container } = renderCard({ clickable: true });
    expect(container.querySelector('[tabindex="0"]')).toBeInTheDocument();
  });

  test('non-clickable card has no role=button', () => {
    const { container } = renderCard();
    expect(container.querySelector('[role="button"]')).not.toBeInTheDocument();
  });

  test('onClick fires on click', () => {
    const onClick = jest.fn();
    renderCard({ clickable: true, onClick });
    fireEvent.click(screen.getByText('Content'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Enter activates clickable card', () => {
    const onClick = jest.fn();
    const { container } = renderCard({ clickable: true, onClick });
    const card = container.querySelector('.card');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Space activates clickable card', () => {
    const onClick = jest.fn();
    const { container } = renderCard({ clickable: true, onClick });
    const card = container.querySelector('.card');
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

/* ─── Link card ─── */
describe('Link card', () => {
  test('href renders as anchor', () => {
    const { container } = renderCard({ href: 'https://example.com' });
    const card = container.querySelector('.card');
    expect(card.tagName).toBe('A');
    expect(card).toHaveAttribute('href', 'https://example.com');
  });
});

/* ─── Sub-components ─── */
describe('Sub-components render', () => {
  test('CardContent', () => {
    render(
      <Card><CardContent><span>Inner</span></CardContent></Card>
    );
    expect(screen.getByText('Inner')).toBeInTheDocument();
  });

  test('CardOverflow', () => {
    const { container } = render(
      <Card><CardOverflow><span>Overflow</span></CardOverflow></Card>
    );
    expect(container.querySelector('.card-overflow')).toBeInTheDocument();
    expect(screen.getByText('Overflow')).toBeInTheDocument();
  });

  test('CardCover', () => {
    const { container } = render(
      <Card><CardCover><span>Cover</span></CardCover></Card>
    );
    expect(container.querySelector('.card-cover')).toBeInTheDocument();
    expect(screen.getByText('Cover')).toBeInTheDocument();
  });

  test('CardActions', () => {
    const { container } = render(
      <Card><CardActions><button>Act</button></CardActions></Card>
    );
    expect(container.querySelector('.card-actions')).toBeInTheDocument();
    expect(screen.getByText('Act')).toBeInTheDocument();
  });
});

/* ─── Convenience Exports ─── */
describe('Convenience exports', () => {
  test('DefaultCard renders default variant', () => {
    const { container } = render(
      <DefaultCard><CardContent>T</CardContent></DefaultCard>
    );
    expect(container.querySelector('.card-default')).toBeInTheDocument();
  });

  test('SolidCard renders with data-theme', () => {
    const { container } = render(
      <SolidCard color="info"><CardContent>T</CardContent></SolidCard>
    );
    expect(container.querySelector('[data-theme="Info-Medium"]')).toBeInTheDocument();
  });

  test('LightCard renders with data-theme', () => {
    const { container } = render(
      <LightCard color="error"><CardContent>T</CardContent></LightCard>
    );
    expect(container.querySelector('[data-theme="Error-Light"]')).toBeInTheDocument();
  });
});
