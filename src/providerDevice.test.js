// The provider picks the type ramp from the screen width unless the app owns
// data-device. Without it a phone got desktop type (a 72px display headline).
import React from 'react';
import { render } from '@testing-library/react';
import { OmniDesignProvider } from './OmniDesignProvider';

function mockWidth(width) {
  window.matchMedia = (q) => {
    const max = parseFloat((q.match(/max-width:\s*([\d.]+)px/) || [])[1]);
    return { matches: width <= max, media: q, addEventListener() {}, removeEventListener() {} };
  };
}

const root = document.documentElement;
afterEach(() => {
  ['data-device', 'data-platform', 'data-omni-device'].forEach((a) => root.removeAttribute(a));
  delete window.matchMedia;
});

test('a phone-width screen gets the phone ramp', () => {
  mockWidth(390);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('IOS-Mobile');
  expect(root.getAttribute('data-platform')).toBe('IOS-Mobile');
});

test('a tablet-width screen gets the tablet ramp; desktop gets none', () => {
  mockWidth(800);
  const { unmount } = render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('IOS-Tablet');
  unmount();
  mockWidth(1440);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.hasAttribute('data-device')).toBe(false);
});

test('an app that sets data-device keeps control', () => {
  root.setAttribute('data-device', 'Desktop');
  mockWidth(390);
  render(<OmniDesignProvider><span /></OmniDesignProvider>);
  expect(root.getAttribute('data-device')).toBe('Desktop');
});

test('device={false} leaves it alone', () => {
  mockWidth(390);
  render(<OmniDesignProvider device={false}><span /></OmniDesignProvider>);
  expect(root.hasAttribute('data-device')).toBe(false);
});
