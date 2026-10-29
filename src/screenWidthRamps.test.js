// Phone / tablet type ramps come from the theme CSS by screen width, so a web
// page needs no data-device — and the provider no longer sets one.
import React from 'react';
import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OmniDesignProvider } from './OmniDesignProvider';

const css = readFileSync(join(__dirname, '../public/styles/typography-tokens.css'), 'utf8');

test('the bundled theme carries phone and tablet ramps as media queries', () => {
  expect(css).toMatch(/@media \(max-width: 599\.98px\) \{\s*:root:not\(\[data-device\]\) \{[\s\S]*?--Display-Large-Font-Size:\s*48px/);
  expect(css).toContain('@media (min-width: 600px) and (max-width: 899.98px)');
});

test('the provider leaves data-device alone', () => {
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(document.documentElement.hasAttribute('data-device')).toBe(false);
});
