// The provider picks the device type ramp from the screen width — guarded:
// only once the theme has loaded, and only if the ramp resolves a body font.
import React from 'react';
import { render } from '@testing-library/react';
import { OmniDesignProvider } from './OmniDesignProvider';

const root = document.documentElement;

function mockWidth(width) {
  window.matchMedia = (q) => {
    const max = parseFloat((q.match(/max-width:\s*([\d.]+)px/) || [])[1]);
    return { matches: width <= max, media: q, addEventListener() {}, removeEventListener() {} };
  };
}

/* A theme whose device ramps resolve a body font (what the hooks provide). */
function themeWithPlatformFonts() {
  // jsdom resolves custom properties from inline style, not from stylesheets.
  root.style.setProperty('--Font-Family-Body', 'Poppins, sans-serif');
}

afterEach(() => {
  ['data-device', 'data-platform', 'data-omni-device'].forEach((a) => root.removeAttribute(a));
  root.style.removeProperty('--Font-Family-Body');
  delete window.matchMedia;
});

test('auto by default: a phone-width screen gets the phone ramp', () => {
  themeWithPlatformFonts();
  mockWidth(390);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('IOS-Mobile');
  expect(root.getAttribute('data-platform')).toBe('IOS-Mobile');
});

test('a tablet-width screen gets the tablet ramp; desktop gets none', () => {
  themeWithPlatformFonts();
  mockWidth(800);
  const { unmount } = render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('IOS-Tablet');
  unmount();
  mockWidth(1440);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.hasAttribute('data-device')).toBe(false);
});

test('guard: a theme whose phone ramp resolves no body font stays on desktop', () => {
  mockWidth(390); // no theme: --Font-Family-Body resolves to nothing
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.hasAttribute('data-device')).toBe(false);
});

test('an app that sets data-device keeps control', () => {
  themeWithPlatformFonts();
  root.setAttribute('data-device', 'Desktop');
  mockWidth(390);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('Desktop');
});

test('device={false} leaves it alone', () => {
  themeWithPlatformFonts();
  mockWidth(390);
  render(<OmniDesignProvider device={false}><span /></OmniDesignProvider>);
  expect(root.hasAttribute('data-device')).toBe(false);
});
