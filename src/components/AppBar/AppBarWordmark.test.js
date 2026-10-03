/**
 * The wordmark is H3's STYLE, not H3's semantics.
 *
 * It was `fontWeight: 700, fontSize: '18px'` with NO font-family, so it
 * inherited whatever face the bar happened to supply and the brand name came
 * out in a typeface nobody had chosen. H3 reads --Font-Family-Header,
 * --H3-Font-Weight and --Font-Variation-Header, so the wordmark tracks every
 * Google Sans Flex axis the design tunes rather than sitting at the variable
 * font's defaults next to headings that do not.
 *
 * But a wordmark is not a section heading. Rendered as a real <h3> it joins the
 * document outline above the page's own H1, and a screen reader announces the
 * brand as a heading on every screen — a thing that is invisible on the canvas
 * and obvious to anyone navigating by headings.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppBar } from './AppBar';

describe('the AppBar wordmark', () => {
  it('is not a heading', () => {
    render(<AppBar brand="Popsicles" />);
    expect(screen.queryByRole('heading', { name: 'Popsicles' })).toBeNull();
    expect(screen.getByText('Popsicles').tagName).toBe('SPAN');
  });

  it('is a button, not a heading, when it is clickable', () => {
    render(<AppBar brand="Popsicles" onBrandClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Popsicles' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Popsicles' })).toBeNull();
  });

  it('carries no hardcoded size or weight of its own', () => {
    /* The point of using H3 is that the brand's own tokens decide. An inline
       fontSize here would win over them silently and the wordmark would stop
       tracking the type scale — which is exactly how it broke before. */
    const { container } = render(<AppBar brand="Popsicles" />);
    const style = screen.getByText('Popsicles').getAttribute('style') || '';
    expect(`inline font rules: ${/font-size|font-weight/.test(style)}`)
      .toBe('inline font rules: false');
    expect(container).toBeTruthy();
  });
});
