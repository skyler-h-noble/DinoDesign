/* theme.json `fonts` are requested as <link>s the moment the manifest is
   read, rather than after foundation.css's @import is parsed. */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { OmniDesignProvider } from './OmniDesignProvider';

const FONT = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
const mockManifest = (m) => {
  global.fetch = jest.fn((url) => Promise.resolve({
    ok: true, json: () => Promise.resolve(m), text: () => Promise.resolve(''),
  }));
};
afterEach(() => { delete global.fetch; document.head.querySelectorAll('link[data-omni="font"]').forEach((l) => l.remove()); });

test('links each listed font once, with preconnects', async () => {
  mockManifest({ name: 'X', fonts: [FONT, FONT, 'https://evil.example/x.css'] });
  render(<OmniDesignProvider themeURL="https://example.com/theme.json"><span /></OmniDesignProvider>);
  await waitFor(() => expect(document.head.querySelectorAll('link[rel="stylesheet"][data-omni="font"]')).toHaveLength(1));
  expect(document.head.querySelector('link[rel="stylesheet"][data-omni="font"]').getAttribute('href')).toBe(FONT);
  expect(document.head.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')).not.toBeNull();
});

test('a manifest without fonts adds nothing', async () => {
  mockManifest({ name: 'Old' });
  render(<OmniDesignProvider themeURL="https://example.com/theme.json"><span /></OmniDesignProvider>);
  await new Promise((r) => setTimeout(r, 50));
  expect(document.head.querySelectorAll('link[data-omni="font"]')).toHaveLength(0);
});
