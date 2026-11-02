// The other mode's sheet is prefetched only after the page has loaded and the
// browser is idle, so it never competes with the page itself.
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { OmniDesignProvider } from './OmniDesignProvider';

describe('dark-mode prefetch waits for load and idle', () => {
  let idleCallbacks;
  beforeEach(() => {
    idleCallbacks = [];
    window.requestIdleCallback = (cb) => { idleCallbacks.push(cb); return idleCallbacks.length; };
    window.cancelIdleCallback = () => {};
  });
  afterEach(() => { delete window.requestIdleCallback; delete window.cancelIdleCallback; document.head.innerHTML = ''; });

  test('no prefetch until idle, then one link to the dark sheet', async () => {
    render(<OmniDesignProvider lightModeCSS="/styles/Light-Mode.css" darkModeCSS="/styles/Dark-Mode.css"><div>page</div></OmniDesignProvider>);
    const prefetch = () => document.querySelectorAll('link[rel="prefetch"][href="/styles/Dark-Mode.css"]');
    // jsdom has finished loading, so the provider waits only for idle.
    await waitFor(() => expect(idleCallbacks.length).toBeGreaterThan(0));
    expect(prefetch()).toHaveLength(0);
    act(() => idleCallbacks.forEach((cb) => cb()));
    expect(prefetch()).toHaveLength(1);
  });
});
