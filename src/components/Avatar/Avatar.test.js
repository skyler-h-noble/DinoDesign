// src/components/Avatar/Avatar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup';
import { axe } from 'jest-axe';
import { declared, stateRules } from '../_testCss';

const renderAvatar = (props = {}) => render(<Avatar {...props} />);

/* --- Basic --- */
describe('Avatar', () => {
  test('renders', () => {
    const { container } = renderAvatar();
    expect(container.querySelector('.avatar')).toBeInTheDocument();
  });
  test('has aria-label', () => {
    renderAvatar({ initials: 'AB' });
    expect(screen.getByLabelText('AB')).toBeInTheDocument();
  });
});

/* --- Content types --- */
describe('Content', () => {
  test('shows initials', () => {
    renderAvatar({ initials: 'JD' });
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
  test('initials truncated to 2 chars', () => {
    renderAvatar({ initials: 'ABC' });
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
  test('initials uppercased', () => {
    renderAvatar({ initials: 'ab' });
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
  // A bare <Avatar /> is the PHOTO variant — the lib ships a default photo and
  // that is the design's default style. The icon fallback is what you get when
  // the photo is explicitly suppressed.
  // A bare avatar is Figma's Default style: the person glyph.
  test('bare avatar shows the glyph', () => {
    const { container } = renderAvatar();
    expect(container.querySelector('.avatar-fallback')).toBeInTheDocument();
  });
  test('defaultPhoto shows the built-in sample photo', () => {
    const { container } = renderAvatar({ defaultPhoto: true });
    expect(container.querySelector('.avatar-image')).toBeInTheDocument();
  });
  test('image class when src provided', () => {
    const { container } = renderAvatar({ src: 'test.jpg' });
    expect(container.querySelector('.avatar-image')).toBeInTheDocument();
  });
  test('renders img element', () => {
    renderAvatar({ src: 'test.jpg', alt: 'Test user' });
    expect(screen.getByAltText('Test user')).toBeInTheDocument();
  });
});

/* --- Colors --- */
describe('Colors', () => {
  ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].forEach((c) => {
    test(c + ' class', () => {
      const { container } = renderAvatar({ color: c, initials: 'A' });
      expect(container.querySelector('.avatar-' + c)).toBeInTheDocument();
    });
  });
});

/* --- Sizes --- */
describe('Sizes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' class', () => {
      const { container } = renderAvatar({ size: s, initials: 'A' });
      expect(container.querySelector('.avatar-' + s)).toBeInTheDocument();
    });
  });
});

/* --- Clickable --- */
describe('Clickable', () => {
  test('clickable class', () => {
    const { container } = renderAvatar({ clickable: true, initials: 'A' });
    expect(container.querySelector('.avatar-clickable')).toBeInTheDocument();
  });
  test('renders as button when clickable', () => {
    renderAvatar({ clickable: true, initials: 'A' });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('renders as img role when not clickable', () => {
    renderAvatar({ initials: 'A' });
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  test('onClick fires', () => {
    const onClick = jest.fn();
    renderAvatar({ clickable: true, initials: 'A', onClick });
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
  test('not clickable by default', () => {
    const { container } = renderAvatar({ initials: 'A' });
    expect(container.querySelector('.avatar-clickable')).not.toBeInTheDocument();
  });
});

/* --- AvatarGroup --- */
describe('AvatarGroup', () => {
  test('renders children', () => {
    render(
      <AvatarGroup>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
  test('shows overflow count', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
      </AvatarGroup>
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
  test('has group role', () => {
    render(<AvatarGroup><Avatar initials="A" /></AvatarGroup>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Avatar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Avatar alt="Test User" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Avatar alt="Test User" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Avatar alt="Test User" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* AvatarGroup overlap: a quarter of the avatar; capped so a clickable avatar
   always shows 24px (WCAG 2.5.8). jsdom drops nothing here — read the rule. */
describe('AvatarGroup overlap', () => {
  const stepOf = (container) => {
    const g = container.querySelector('.avatar-group');
    // The step is the second avatar's margin, followed down to its value.
    const m = stateRules(g.children[1]).base.match(/margin-left:\s*(-?[\d.]+)px/);
    return m ? Number(m[1]) : null;
  };
  const three = (props = {}) => [1, 2, 3].map((i) => <Avatar key={i} initials={'A' + i} {...props} />);

  test('display-only: a quarter of the size (32 → −8, 24 → −6)', () => {
    expect(stepOf(render(<AvatarGroup size="medium">{three()}</AvatarGroup>).container)).toBe(-8);
    expect(stepOf(render(<AvatarGroup size="small">{three()}</AvatarGroup>).container)).toBe(-6);
  });

  test('clickable: each avatar shows at least 24px', () => {
    // 24px: edge to edge.
    expect(stepOf(render(<AvatarGroup size="small">{three({ onClick: () => {} })}</AvatarGroup>).container)).toBe(0);
    // 16px: a gap of 8.
    expect(stepOf(render(<AvatarGroup size="xxs">{three({ onClick: () => {} })}</AvatarGroup>).container)).toBe(8);
    // 40px: the quarter (−10) already leaves 30 showing.
    expect(stepOf(render(<AvatarGroup size="large">{three({ onClick: () => {} })}</AvatarGroup>).container)).toBe(-10);
  });

  test('an explicit spacing is still capped for a clickable group', () => {
    expect(stepOf(render(<AvatarGroup size="medium" spacing={-20}>{three({ clickable: true })}</AvatarGroup>).container)).toBe(-8);
  });
});

describe('Avatar shape', () => {
  test('a shaped photo fills the shape, with an outline for its border', () => {
    const { container } = render(<Avatar shape="cookie-9" src="/me.jpg" alt="Lise" />);
    expect(container.querySelector('.avatar-shaped .avatar-shape-fill img')).toHaveAttribute('src', '/me.jpg');
    expect(container.querySelector('.avatar-shaped svg path')).toHaveAttribute('fill', 'none');
  });

  test('shaped initials are smaller than round ones', () => {
    const { container } = render(<Avatar shape="cookie-9" initials="LN" size="xs" />);
    expect(container.querySelector('.avatar-initials').textContent).toBe('LN');
    // 8px at xs (round initials are 12) — read as declared, since jsdom does
    // not resolve var().
    const el = container.querySelector('.omni-av-shinit');
    expect(declared(el, 'font-size')).toBe('var(--_av-fs)');
    expect(declared(el, '--_av-fs')).toBe('var(--Avatar-Shape-Initials, 8px)');
  });

  test('the default style is a person knocked out of the filled shape', () => {
    const { container } = render(<Avatar shape="flower" />);
    expect(container.querySelector('.avatar-fallback svg[data-testid="PersonIcon"]')).not.toBeNull();
  });

  test('circle, or an unknown shape, is the round avatar', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Avatar shape="burst" initials="LN" />);
    expect(container.querySelector('.avatar-shaped')).toBeNull();
    warn.mockRestore();
  });
});
