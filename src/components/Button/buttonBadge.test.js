// src/components/Button/buttonBadge.test.js
//
// Badge has had ONE size since 0.9.0, and warns once per value when the removed
// `size` prop reaches it. Button used to DERIVE a badge size from its own size,
// so every `<Button badge>` tripped that warning for a value the caller never
// wrote — visible only to someone watching the console, which is how it shipped.
//
// These lock the two halves: Button forwards nothing of its own, and still
// forwards what the caller actually passes so the warning keeps working.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button — badge size is the caller’s, never derived', () => {
  let warn;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  const badgeWarnings = () =>
    warn.mock.calls.filter(([first]) => String(first).startsWith('[Badge]'));

  test('a badged button at the default size warns nothing', () => {
    render(<Button badge badgeContent={3}>Inbox</Button>);
    expect(screen.getByRole('button', { name: /inbox/i })).toBeInTheDocument();
    expect(badgeWarnings()).toHaveLength(0);
  });

  test.each(['small', 'medium', 'large'])(
    'button size="%s" does not synthesise a badge size',
    (size) => {
      render(<Button badge badgeContent={1} size={size}>Inbox</Button>);
      expect(badgeWarnings()).toHaveLength(0);
    },
  );

  test('an explicit badgeSize still reaches Badge, so it still warns', () => {
    render(<Button badge badgeContent={1} badgeSize="small">Inbox</Button>);
    expect(badgeWarnings()).toHaveLength(1);
    expect(badgeWarnings()[0][0]).toMatch(/Badge has one size/);
  });
});
