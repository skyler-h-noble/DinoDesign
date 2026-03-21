// src/components/Tag/Tag.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Tag, TAG_COLORS, TAG_COLOR_TOKEN_MAP,
  PrimaryTag, SecondaryTag, TertiaryTag, NeutralTag,
  InfoTag, SuccessTag, WarningTag, ErrorTag, BlackTag, WhiteTag,
} from './Tag';
import { axe } from 'jest-axe';

// ─── Basic rendering ──────────────────────────────────────────────────────────

describe('Tag', () => {
  test('renders children', () => {
    render(<Tag>NEW</Tag>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('renders as a span element', () => {
    const { container } = render(<Tag>Label</Tag>);
    expect(container.querySelector('span.tag')).toBeInTheDocument();
  });

  test('default color is primary', () => {
    const { container } = render(<Tag>Label</Tag>);
    expect(container.querySelector('.tag-primary')).toBeInTheDocument();
  });

  test('applies correct color class', () => {
    const { container } = render(<Tag color="success">Live</Tag>);
    expect(container.querySelector('.tag-success')).toBeInTheDocument();
  });

  test('passes className through', () => {
    const { container } = render(<Tag className="my-tag">Label</Tag>);
    expect(container.querySelector('.my-tag')).toBeInTheDocument();
  });
});

// ─── All colors render ────────────────────────────────────────────────────────

describe('All colors', () => {
  TAG_COLORS.forEach((color) => {
    test('renders color: ' + color, () => {
      const { container } = render(<Tag color={color}>{color}</Tag>);
      expect(container.querySelector('.tag-' + color)).toBeInTheDocument();
      expect(screen.getByText(color)).toBeInTheDocument();
    });
  });
});

// ─── Token map ────────────────────────────────────────────────────────────────

describe('TAG_COLOR_TOKEN_MAP', () => {
  test('has entry for all TAG_COLORS', () => {
    TAG_COLORS.forEach((color) => {
      expect(TAG_COLOR_TOKEN_MAP[color]).toBeTruthy();
    });
  });

  test('primary maps to Primary', () => {
    expect(TAG_COLOR_TOKEN_MAP.primary).toBe('Primary');
  });

  test('black maps to Black', () => {
    expect(TAG_COLOR_TOKEN_MAP.black).toBe('Black');
  });

  test('white maps to White', () => {
    expect(TAG_COLOR_TOKEN_MAP.white).toBe('White');
  });
});

// ─── Convenience exports ──────────────────────────────────────────────────────

describe('Convenience exports', () => {
  const cases = [
    [PrimaryTag,   'tag-primary'],
    [SecondaryTag, 'tag-secondary'],
    [TertiaryTag,  'tag-tertiary'],
    [NeutralTag,   'tag-neutral'],
    [InfoTag,      'tag-info'],
    [SuccessTag,   'tag-success'],
    [WarningTag,   'tag-warning'],
    [ErrorTag,     'tag-error'],
    [BlackTag,     'tag-black'],
    [WhiteTag,     'tag-white'],
  ];

  cases.forEach(([Component, className]) => {
    test(className + ' renders', () => {
      const { container } = render(<Component>Label</Component>);
      expect(container.querySelector('.' + className)).toBeInTheDocument();
    });
  });
});

// ─── Inline rendering ─────────────────────────────────────────────────────────

describe('Inline rendering', () => {
  test('renders inline with surrounding text', () => {
    render(
      <p>
        Feature <Tag color="primary">NEW</Tag> is available
      </p>
    );
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('multiple tags render side by side', () => {
    render(
      <div>
        <Tag color="success">LIVE</Tag>
        <Tag color="warning">DRAFT</Tag>
        <Tag color="error">DEPRECATED</Tag>
      </div>
    );
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
    expect(screen.getByText('DEPRECATED')).toBeInTheDocument();
  });
});

// ─── sx override ─────────────────────────────────────────────────────────────

describe('sx override', () => {
  test('accepts sx prop without error', () => {
    expect(() =>
      render(<Tag sx={{ opacity: 0.5 }}>Label</Tag>)
    ).not.toThrow();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Tag — Accessibility (jest-axe)', () => {
  test('has no violations with default props', async () => {
    const { container } = render(<Tag>NEW</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations for all colors', async () => {
    const { container } = render(
      <div>
        {TAG_COLORS.map((c) => (
          <Tag key={c} color={c}>{TAG_COLOR_TOKEN_MAP[c]}</Tag>
        ))}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations inline with text', async () => {
    const { container } = render(
      <p>
        Design Tokens <Tag color="primary">NEW</Tag> are available.
      </p>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Tag color="primary">PRIMARY</Tag>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
