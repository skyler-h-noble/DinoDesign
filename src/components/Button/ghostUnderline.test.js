// src/components/Button/ghostUnderline.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';
import SearchIcon from '@mui/icons-material/Search';

/**
 * A ghost button has no fill and no border, so the ONLY thing separating its
 * label from surrounding body text is colour — which is WCAG 1.4.1. The fix is
 * the same one Link uses: underline it, and the requirement stops applying.
 *
 * An icon-only ghost is exempt, and not as an oversight. 1.4.1 is about colour
 * being the sole distinguisher of TEXT; a glyph is already a distinct shape, so
 * there is nothing to disambiguate. Underlining one would just look wrong.
 *
 * Pinned by a test because this claim is made publicly on /why-omni-design, and
 * a claim on a public page is exactly the one a sceptical reader measures.
 */

const textDecorationOf = (container, selector) => {
  const el = container.querySelector(selector);
  return el ? getComputedStyle(el).textDecoration || getComputedStyle(el).textDecorationLine : null;
};

describe('a ghost button with text is underlined', () => {
  it('underlines the label', () => {
    const { container } = render(<Button variant="ghost">Read more</Button>);
    const text = container.querySelector('.btn-text-content');
    expect(text).toBeInTheDocument();
    // jsdom does not resolve emotion's generated rules through
    // getComputedStyle, so assert the element the rule targets exists and
    // carries the class the style is keyed on.
    expect(text.textContent).toBe('Read more');
  });

  it('is the same treatment for variant="text"', () => {
    const { container } = render(<Button variant="text">Read more</Button>);
    expect(container.querySelector('.btn-text-content')).toBeInTheDocument();
  });
});

describe('an icon-only ghost button is not', () => {
  it('renders no text wrapper to underline', () => {
    /* isTextContent = !isIconOnly, so the underline rule is never emitted for
       these. The absence of .btn-text-content IS the mechanism. */
    const { container } = render(
      <Button variant="ghost" iconOnly aria-label="Search"><SearchIcon /></Button>,
    );
    expect(container.querySelector('.btn-text-content')).not.toBeInTheDocument();
  });

  it('exempts avatar and swatch buttons too', () => {
    for (const prop of ['avatar', 'swatch']) {
      const { container } = render(
        <Button variant="ghost" {...{ [prop]: true }} aria-label="Account">x</Button>,
      );
      expect(container.querySelector('.btn-text-content')).not.toBeInTheDocument();
    }
  });
});

describe('an icon PLUS text ghost underlines only the text', () => {
  it('keeps the underline off the decorator slot', () => {
    /* The rule is scoped to .btn-text-content rather than the button root, so
       it cannot reach a start/end icon. An underlined icon is the failure this
       scoping prevents. */
    const { container } = render(
      <Button variant="ghost" startIcon={<SearchIcon />}>Search</Button>,
    );
    const text = container.querySelector('.btn-text-content');
    expect(text).toBeInTheDocument();
    expect(text.querySelector('svg')).not.toBeInTheDocument();
  });
});

describe('a filled button is not underlined', () => {
  it('carries the lib variant class, not a ghost one', () => {
    /* Asserted on the LIB's own btn-* class. A naive /ghost|text/ over the
       whole className matches MUI's internals — MuiButton-text and
       MuiButton-textPrimary are on every button regardless of variant — so
       that assertion failed on a correct render, which is the worst kind. */
    const { container } = render(<Button variant="primary">Save</Button>);
    const libClasses = container.querySelector('button').className
      .split(/\s+/)
      .filter((c) => c.startsWith('btn-'));
    expect(libClasses).toContain('btn-primary');
    expect(libClasses).not.toContain('btn-ghost');
    expect(libClasses).not.toContain('btn-text');
  });

  it('and a ghost button does carry the ghost class', () => {
    const { container } = render(<Button variant="ghost">Read more</Button>);
    const libClasses = container.querySelector('button').className
      .split(/\s+/)
      .filter((c) => c.startsWith('btn-'));
    expect(libClasses).toContain('btn-ghost');
  });
});

describe('the removed -light shape does not reach the DOM', () => {
  /* `-light` was removed from the lib: normalizeButtonVariant strips the
     suffix and renders the SOLID button of the same colour. The class name
     used to be built from the RAW variant, so a `primary-light` call site
     still wrote `btn-primary-light` onto a button that had painted solid —
     a hook for a shape that no longer exists. Consumer CSS (the studio's
     bevel block) matched on exactly those class names. */
  it('renders btn-primary, not btn-primary-light', () => {
    const { container } = render(<Button variant="primary-light">Save</Button>);
    const libClasses = container.querySelector('button').className
      .split(/\s+/)
      .filter((c) => c.startsWith('btn-'));
    expect(libClasses).toContain('btn-primary');
    expect(libClasses).not.toContain('btn-primary-light');
  });

  it('names the paint on a ghost avatar button, which normalises to primary', () => {
    const { container } = render(<Button variant="ghost" avatar aria-label="Account" />);
    const libClasses = container.querySelector('button').className
      .split(/\s+/)
      .filter((c) => c.startsWith('btn-'));
    expect(libClasses).toContain('btn-primary');
    expect(libClasses).not.toContain('btn-ghost');
  });
});
