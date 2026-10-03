/**
 * A CodeBlock always offers a copy, header or no header.
 *
 * The button lived only in the header, so `showHeader={false}` removed the
 * chrome and took the function with it — a code block you cannot copy, which
 * is the one thing this component exists to replace. It failed quietly: the
 * panel still renders, still shows the code, and nothing about it looks
 * broken until someone reaches for the button that is not there.
 *
 * Figma had the answer already. Its Code Area is a horizontal frame holding
 * the code and then a `copy` frame — 435 + 32 across 467 — with that frame
 * hidden on the variants that keep their header.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

const copies = () => screen.queryAllByRole('button', { name: /copy/i });

describe('CodeBlock copy control', () => {
  it('offers one in the header by default', () => {
    render(<CodeBlock code="npm i" language="bash" />);
    expect(copies()).toHaveLength(1);
  });

  it('still offers one when the header is off', () => {
    render(<CodeBlock code="npm i" showHeader={false} />);
    expect(copies()).toHaveLength(1);
  });

  it('never offers two', () => {
    /* Two buttons that do the same thing read as two different things. */
    for (const showHeader of [true, false]) {
      const { unmount } = render(<CodeBlock code="npm i" showHeader={showHeader} />);
      expect(`showHeader=${showHeader}: ${copies().length}`).toBe(`showHeader=${showHeader}: 1`);
      unmount();
    }
  });

  it('offers none when copying is off, or there is nothing to copy', () => {
    const { unmount } = render(<CodeBlock code="npm i" showHeader={false} showCopy={false} />);
    expect(copies()).toHaveLength(0);
    unmount();
    render(<CodeBlock code="" showHeader={false} />);
    expect(copies()).toHaveLength(0);
  });
});
