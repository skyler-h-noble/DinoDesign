/* THE PAGE KEEPS ITS THEME IN DARK MODE.
 *
 * Every theme.json the studio published says "darkTheme": "Neutral" — a
 * hard-coded value, not the designer's choice. The Provider obeyed it, so in
 * dark mode the root switched from Default to Neutral and a Primary-background
 * system lost its color: Default is what carries the chosen background into
 * dark mode (its own palette at tone 2). The manifest field is now ignored; a
 * darkTheme passed as a prop is still honored.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { OmniDesignProvider, useOmniDesign } from './OmniDesignProvider';

/* Renders the system name once the manifest has been applied, so the checks
   run after theme.json is read rather than against the initial render. */
function Loaded() { const { name } = useOmniDesign(); return <span data-testid="name">{name || ''}</span>; }

const MANIFEST = { name: 'Harbor', defaultTheme: 'Default', defaultSurface: 'Surface', darkTheme: 'Neutral' };

beforeEach(() => {
  global.fetch = jest.fn((url) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(MANIFEST),
    text: () => Promise.resolve(''),
  }));
});
afterEach(() => { delete global.fetch; });

const rootTheme = (container) => container.querySelector('[data-theme]')?.getAttribute('data-theme');

test('a theme.json darkTheme does not switch the root in dark mode', async () => {
  const { container } = render(
    <OmniDesignProvider themeURL="https://example.com/theme.json" defaultDarkMode>
      <Loaded />
    </OmniDesignProvider>,
  );
  await waitFor(() => expect(container.querySelector('[data-testid="name"]').textContent).toBe('Harbor'));
  expect(rootTheme(container)).toBe('Default');
});

test('a darkTheme prop is still honored', async () => {
  const { container } = render(
    <OmniDesignProvider themeURL="https://example.com/theme.json" defaultDarkMode darkTheme="Neutral">
      <Loaded />
    </OmniDesignProvider>,
  );
  await waitFor(() => expect(container.querySelector('[data-testid="name"]').textContent).toBe('Harbor'));
  expect(rootTheme(container)).toBe('Neutral');
});
