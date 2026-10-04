/**
 * Button forwards its ref.
 *
 * Two consumers need it and both failed silently without it: MUI's Tooltip
 * positions against its child via a ref, and Popover reads
 * getBoundingClientRect off the `anchorRef` it is given. A plain function
 * component gives them null, so the tooltip and the panel had nothing to
 * anchor to — React warned "Function components cannot be given refs" and
 * everything else carried on.
 *
 * The library's own TooltipShowcase had been paying that cost: it wraps a raw
 * MUI Button hand-styled with brand tokens, which is the project's one rule
 * broken inside the project. It was not a styling choice; it was the only way
 * to get a ref.
 */
import React, { useRef, useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { Tooltip } from '../Tooltip/Tooltip';

describe('Button ref forwarding', () => {
  it('gives the ref the real button element', () => {
    const ref = React.createRef();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current.textContent).toContain('Save');
  });

  it('is measurable, which is what an anchor needs', () => {
    const ref = React.createRef();
    render(<Button ref={ref}>Save</Button>);
    /* The actual requirement: Popover calls this on its anchorRef. On a null
       ref it throws; the value in jsdom is zeroes, which is fine — what is
       being asserted is that there is an element to ask. */
    expect(typeof ref.current.getBoundingClientRect).toBe('function');
    expect(ref.current.getBoundingClientRect()).toBeTruthy();
  });

  it('works as a callback ref too', () => {
    let seen = null;
    render(<Button ref={(el) => { seen = el; }}>Save</Button>);
    expect(seen).toBeInstanceOf(HTMLButtonElement);
  });

  /* The regression that matters: a Tooltip wrapping the lib's own Button
     should not warn. This asserts on console.error rather than on the
     tooltip's position, because the warning is the observable — the ref
     being null is what MUI complains about. */
  it('does not warn when used as a Tooltip child', () => {
    const errors = [];
    const spy = jest.spyOn(console, 'error').mockImplementation((...a) => errors.push(String(a[0])));
    try {
      render(<Tooltip title="Rename"><Button>Hover me</Button></Tooltip>);
    } finally {
      spy.mockRestore();
    }
    const refWarnings = errors.filter(e =>
      /cannot be given refs|element that can hold a ref/.test(e));
    expect(refWarnings).toEqual([]);
  });

  it('still renders its variants, which forwardRef could have broken', () => {
    render(<Button variant="success-outline">Approve</Button>);
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
  });
});
