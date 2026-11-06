// src/components/SkipLink/SkipLink.stories.js
import React from 'react';
import { SkipLink } from './SkipLink';

export default { title: 'Navigation/SkipLink', component: SkipLink };

/* Click into the canvas, then press Tab: the link appears top-left. Enter
   moves focus to the main region. */
export const Default = {
  render: () => (
    <>
      <SkipLink />
      <nav aria-label="Main" style={{ padding: 16 }}><a href="#a">Home</a> · <a href="#b">Shop</a></nav>
      <main id="main" style={{ padding: 16 }}><h1>Main content</h1></main>
    </>
  ),
};

export const CustomTarget = {
  render: () => (
    <>
      <SkipLink href="#results">Skip to results</SkipLink>
      <div id="results" style={{ padding: 16 }}>Results</div>
    </>
  ),
};
