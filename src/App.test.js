// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

/* This was the untouched Create React App boilerplate — `renders learn react
 * link`, looking for text from CRA's starter page that this app has never
 * rendered. It could not have passed, and nobody saw it fail: the suite died
 * earlier on a module-resolution error (react-router 7 declares
 * main: ./dist/main.js, a file it does not ship, and CRA's Jest resolver reads
 * `main` rather than the exports map), so it reported "failed to run" instead
 * of "failed". Two problems stacked, and the outer one hid the inner one.
 *
 * What the app actually is: the component showcase, routed. */
describe('App', () => {
  test('mounts the showcase without crashing', () => {
    render(<App />);
    /* The showcase renders the nav at more than one breakpoint, so ask for
       at least one rather than exactly one. */
    expect(screen.getAllByLabelText('Component navigation').length).toBeGreaterThan(0);
  });

  test('renders inside the design-system cascade', () => {
    /* The showcase is wrapped by OmniDesignProvider, so something in the tree
       must carry a data-surface — that is what tells us the provider mounted
       rather than the raw components rendering unthemed. */
    const { container } = render(<App />);
    expect(container.querySelector('[data-surface]')).toBeInTheDocument();
  });
});
