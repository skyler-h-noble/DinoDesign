// src/components/_ghost.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Ghost, useGhost } from './_ghost';
import { Body, H2 } from './Typography';
import { Avatar } from './Avatar/Avatar';
import { Icon } from './Icon/Icon';

const Probe = () => <span data-testid="probe">{useGhost() ? 'ghosting' : 'real'}</span>;

describe('Ghost marks a region, not each element', () => {
  it('reaches any depth without a prop at the call site', () => {
    /* The whole reason it is context: a prop would have to be threaded through
       every intermediate component, and the one you forget stays REAL inside a
       ghosting card — which reads as a rendering bug, not a missed prop. */
    render(
      <Ghost>
        <div><div><div><Probe /></div></div></div>
      </Ghost>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('ghosting');
  });

  it('renders children untouched when inactive', () => {
    render(<Ghost active={false}><Probe /></Ghost>);
    expect(screen.getByTestId('probe')).toHaveTextContent('real');
  });

  it('adds no wrapper element when inactive', () => {
    // A wrapper that appears only sometimes changes the layout between states,
    // which is the reflow this component exists to avoid.
    const { container } = render(<Ghost active={false}><span>hi</span></Ghost>);
    expect(container.querySelector('[data-ghost]')).not.toBeInTheDocument();
  });
});

describe('the text keeps its box', () => {
  it('does not remove the content', () => {
    /* Deleting the text would collapse the box and the layout would jump when
       the real content arrived. It is transparent, not absent. */
    const { container } = render(<Ghost><Body>Some real copy</Body></Ghost>);
    expect(container.textContent).toContain('Some real copy');
  });

  it('paints the block from --Border-Variant, and nothing else', () => {
    /* Asserted on the style object rather than the rendered node: jsdom does
       not resolve custom properties, so a getComputedStyle check here would
       pass against any value — including none. The token name is the thing
       that must not drift, so that is what is asserted. */
    const { ghostBlockSx } = require('./_ghost');
    expect(ghostBlockSx().backgroundColor).toBe('var(--Border-Variant)');
  });

  it('makes the ink transparent rather than hiding the element', () => {
    const { ghostBlockSx } = require('./_ghost');
    const sx = ghostBlockSx();
    expect(sx.color).toBe('transparent');
    expect(sx.display).toBeUndefined();
    expect(sx.visibility).toBeUndefined();
  });

  it('works for every typography level, not just Body', () => {
    const { container } = render(<Ghost><H2>Heading</H2><Body>Copy</Body></Ghost>);
    expect(container.querySelectorAll('.typography')).toHaveLength(2);
  });
});

describe('accessibility', () => {
  /* Doing only half of this is how a skeleton gets announced as a page of
     blank paragraphs: the placeholder text is still in the DOM. */
  it('marks the region busy', () => {
    const { container } = render(<Ghost><Body>copy</Body></Ghost>);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('hides the placeholder content from assistive tech', () => {
    const { container } = render(<Ghost><Body>copy</Body></Ghost>);
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden.textContent).toContain('copy');
  });

  it('announces what is happening', () => {
    render(<Ghost label="Loading invoices"><Body>copy</Body></Ghost>);
    expect(screen.getByText('Loading invoices')).toBeInTheDocument();
  });
});

describe('leaves that ghost', () => {
  it('Avatar keeps its circle', () => {
    const { container } = render(<Ghost><Avatar initials="JD" /></Ghost>);
    expect(container.querySelector('.avatar')).toBeInTheDocument();
  });

  it('Icon keeps its footprint', () => {
    const { container } = render(<Ghost><Icon size="medium"><svg /></Icon></Ghost>);
    expect(container.querySelector('.icon')).toBeInTheDocument();
  });
});

describe('the animation is guarded', () => {
  it('ships a reduced-motion branch', () => {
    /* A full page of sweeping blocks is a vestibular trigger. jsdom cannot
       evaluate the media query, so this asserts the branch is EMITTED — which
       is the part that can be deleted by accident. */
    const { ghostBlockSx } = require('./_ghost');
    const sx = ghostBlockSx({ animate: true });
    expect(sx['@media (prefers-reduced-motion: reduce)']).toEqual({
      backgroundImage: 'none',
      animation: 'none',
    });
  });

  it('can be switched off entirely', () => {
    const { ghostBlockSx } = require('./_ghost');
    expect(ghostBlockSx({ animate: false }).animation).toBeUndefined();
  });

  it('never sets opacity on the block', () => {
    /* --Border-Variant already carries its alpha (variantHex8 returns 8
       digits). An opacity here multiplies the adaptive tuning away, worst on
       the brands that were already at the 0.20 floor. */
    const { ghostBlockSx } = require('./_ghost');
    expect(ghostBlockSx()).not.toHaveProperty('opacity');
  });
});
