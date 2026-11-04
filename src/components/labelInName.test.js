// Label in Name (WCAG 2.5.3) guard on Link, Button, Card, Chip and
// BreadcrumbItem: an aria-label / aria-labelledby that replaces visible text is
// warned about in development and corrected in production.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Link } from './Link/Link';
import { Button } from './Button/Button';
import { Card } from './Card/Card';
import { Chip } from './Chip/Chip';
import { BreadcrumbItem } from './Breadcrumbs/Breadcrumbs';
import { Body } from './Typography/Typography';
import {
  labelInName, normalizeName, nameContains, staticText, domText, _resetLabelInNameWarnings,
} from './_labelInName';

const DeleteIcon = () => <svg data-testid="icon"><path d="M0 0" /></svg>;

let warn;
const ORIGINAL_ENV = process.env.NODE_ENV;
beforeEach(() => {
  _resetLabelInNameWarnings();
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
  process.env.NODE_ENV = ORIGINAL_ENV;
});
const asProduction = () => { process.env.NODE_ENV = 'production'; };
const nameWarnings = () => warn.mock.calls.filter((c) => /WCAG 2\.5\.3/.test(String(c[0])));

describe('normalizing and containment', () => {
  test('case, whitespace and punctuation are ignored', () => {
    expect(normalizeName('  Linen   Throw, $40! ')).toBe('linen throw 40');
    expect(nameContains('Add to cart: Linen Throw', 'add to CART')).toBe(true);
    expect(nameContains('Linen Throw, Sale', 'Sale Linen Throw')).toBe(false);
    expect(nameContains('anything', '   ')).toBe(true);
  });

  test('static text reads strings and host elements, not components', () => {
    expect(staticText(['Add ', 2, ' items'])).toBe('Add  2  items');
    expect(staticText(<span>Sale <strong>Linen</strong></span>)).toBe('Sale  Linen');
    expect(staticText(<><svg><title>x</title></svg>Go</>)).toBe('Go');
    expect(staticText(<Body>Text</Body>)).toBeNull();
  });

  test('DOM text skips svg and aria-hidden', () => {
    const el = document.createElement('a');
    el.innerHTML = '<svg><title>Trash</title></svg><span aria-hidden="true">•</span><span>Shop</span>';
    expect(domText(el)).toBe('Shop');
  });
});

describe('zero cost without a label', () => {
  test('labelInName returns null, before reading children', () => {
    const children = { get $$typeof() { throw new Error('children read'); } };
    expect(labelInName('Link', { href: '/' }, children)).toBeNull();
  });

  test('no DOM walk and no warning when no aria-label is passed', () => {
    const walk = jest.spyOn(document, 'createTreeWalker');
    render(
      <>
        <Link href="/a">Shop</Link>
        <Button>Save</Button>
        <Card href="/p"><Body>Linen Throw</Body></Card>
        <Chip label="Sale" onClick={() => {}} />
      </>,
    );
    expect(walk).not.toHaveBeenCalled();
    expect(nameWarnings()).toHaveLength(0);
    walk.mockRestore();
  });
});

describe('aria-label that matches is kept, everywhere', () => {
  test('label containing the visible text stays', () => {
    asProduction();
    render(
      <>
        <Link href="/a" aria-label="Shop all linen">Shop</Link>
        <Button aria-label="Save draft now">Save draft</Button>
      </>,
    );
    expect(screen.getByText('Shop').closest('a')).toHaveAttribute('aria-label', 'Shop all linen');
    expect(screen.getByText('Save draft').closest('button')).toHaveAttribute('aria-label', 'Save draft now');
    expect(nameWarnings()).toHaveLength(0);
  });
});

describe('mismatching aria-label', () => {
  test('development: warns once per component with the fix, label left alone', () => {
    render(
      <>
        <Link href="/a" aria-label="Linen Throw, Sale">Sale Linen Throw</Link>
        <Link href="/b" aria-label="Other">Visible</Link>
      </>,
    );
    expect(screen.getByText('Sale Linen Throw').closest('a')).toHaveAttribute('aria-label', 'Linen Throw, Sale');
    const w = nameWarnings();
    expect(w).toHaveLength(1);
    expect(w[0][0]).toMatch(/<Link>/);
    expect(w[0][0]).toMatch(/Remove aria-label — the visible text already names it/);
  });

  test('production: Link drops it (string children, decided at render)', () => {
    asProduction();
    render(<Link href="/a" aria-label="Linen Throw, Sale">Sale Linen Throw</Link>);
    expect(screen.getByText('Sale Linen Throw').closest('a')).not.toHaveAttribute('aria-label');
    expect(nameWarnings()).toHaveLength(0);
  });

  test('production: Button with text drops it; forwarded ref still works', () => {
    asProduction();
    const ref = React.createRef();
    render(<Button ref={ref} aria-label="Add item">Add to cart</Button>);
    const btn = screen.getByRole('button', { name: 'Add to cart' });
    expect(btn).not.toHaveAttribute('aria-label');
    expect(ref.current).toBe(btn);
  });

  test('production: Button with element children is read from the DOM', () => {
    asProduction();
    const ref = React.createRef();
    render(<Button ref={ref} aria-label="Purchase"><Body component="span">Add to cart</Body></Button>);
    expect(ref.current).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBe(ref.current);
  });

  test('production: link Card drops it and is named by its content', () => {
    asProduction();
    render(
      <Card href="/p/linen" aria-label="Linen Throw, $40">
        <Body>Sale</Body>
        <Body>Linen Throw</Body>
        <Body>$40</Body>
      </Card>,
    );
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('aria-label');
    expect(link).toHaveAccessibleName(/Sale\s*Linen Throw\s*\$40/);
  });

  test('a static (non-interactive) Card is not touched', () => {
    asProduction();
    const { container } = render(<Card aria-label="Region"><Body>Text</Body></Card>);
    expect(container.querySelector('[aria-label="Region"]')).not.toBeNull();
  });

  test('production: pressable Chip and BreadcrumbItem drop it', () => {
    asProduction();
    render(
      <>
        <Chip label="Sale" onClick={() => {}} aria-label="Filter by discount" />
        <BreadcrumbItem href="/shop" aria-label="Back to store">Shop</BreadcrumbItem>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Sale' })).not.toHaveAttribute('aria-label');
    expect(screen.getByText('Shop').closest('a')).not.toHaveAttribute('aria-label');
  });
});

describe('icon-only keeps its label', () => {
  test('iconOnly Button keeps aria-label in production', () => {
    asProduction();
    render(<Button iconOnly aria-label="Delete item"><DeleteIcon /></Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete item');
  });

  test('icon Link (svg only) keeps aria-label in production', () => {
    asProduction();
    render(<Link href="/cart" aria-label="Cart"><DeleteIcon /></Link>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Cart');
  });

  test('Button still errors when icon-only has no name', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button iconOnly><DeleteIcon /></Button>);
    expect(err.mock.calls.some((c) => /no accessible name/.test(String(c[0])))).toBe(true);
    err.mockRestore();
  });
});

describe('aria-labelledby that replaces visible text', () => {
  test('development: warns, attribute unchanged', () => {
    render(
      <>
        <span id="product">Linen Throw</span>
        <Button aria-labelledby="product">Add to cart</Button>
      </>,
    );
    expect(screen.getByText('Add to cart').closest('button')).toHaveAttribute('aria-labelledby', 'product');
    expect(nameWarnings()[0][0]).toMatch(/aria-labelledby/);
  });

  test('production: own id goes first (generated when missing)', () => {
    asProduction();
    render(
      <>
        <span id="product">Linen Throw</span>
        <Button aria-labelledby="product">Add to cart</Button>
      </>,
    );
    const btn = screen.getByText('Add to cart').closest('button');
    expect(btn.id).toMatch(/^omni-name-\d+$/);
    expect(btn).toHaveAttribute('aria-labelledby', btn.id + ' product');
    expect(btn).toHaveAccessibleName('Add to cart Linen Throw');
  });

  test('production: an existing id is reused', () => {
    asProduction();
    render(<><span id="p2">Linen</span><Link id="mine" href="/x" aria-labelledby="p2">Buy</Link></>);
    expect(screen.getByText('Buy').closest('a')).toHaveAttribute('aria-labelledby', 'mine p2');
  });

  test('already includes itself, or points at text containing it: left alone', () => {
    asProduction();
    render(
      <>
        <span id="lbl">Add to cart: Linen Throw</span>
        <Button aria-labelledby="lbl">Add to cart</Button>
        <Button id="self" aria-labelledby="self lbl">Buy</Button>
      </>,
    );
    expect(screen.getByText('Add to cart', { selector: 'button *' }).closest('button')).toHaveAttribute('aria-labelledby', 'lbl');
    expect(screen.getByText('Buy').closest('button')).toHaveAttribute('aria-labelledby', 'self lbl');
    expect(nameWarnings()).toHaveLength(0);
  });
});

describe('axe label-content-name-mismatch', () => {
  /* jsdom has no layout, so axe sees every text node as zero-sized and skips
     the rule. Give elements a box for these two tests, and stub the canvas
     axe uses to spot icon ligatures. */
  let restore;
  /* Every glyph draws ink and widths add up, so axe treats no text as an
     icon ligature. */
  function fakeContext() {
    return {
      canvas: this,
      measureText: (t) => ({ width: 30 * t.length }),
      fillText() {},
      clearRect() {},
      getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, Math.ceil(w) * Math.ceil(h)) * 4).fill(255) }),
    };
  }
  beforeEach(() => {
    const rect = { x: 0, y: 0, top: 0, left: 0, width: 120, height: 24, right: 120, bottom: 24, toJSON() {} };
    const el = Element.prototype;
    const range = Range.prototype;
    const canvas = HTMLCanvasElement.prototype;
    const saved = [el.getBoundingClientRect, el.getClientRects, range.getBoundingClientRect, range.getClientRects, canvas.getContext];
    el.getBoundingClientRect = () => rect;
    el.getClientRects = () => [rect];
    range.getBoundingClientRect = () => rect;
    range.getClientRects = () => [rect];
    canvas.getContext = fakeContext;
    restore = () => {
      [el.getBoundingClientRect, el.getClientRects, range.getBoundingClientRect, range.getClientRects, canvas.getContext] = saved;
    };
  });
  afterEach(() => restore());
  const run = (c) => axe(c, { rules: { 'label-content-name-mismatch': { enabled: true } } });
  const ids = (r) => r.violations.map((v) => v.id);
  const BadInputs = () => (
    <main>
      <Link href="/a" aria-label="Linen Throw, Sale">Sale Linen Throw</Link>
      <Button aria-label="Add item">Add to cart</Button>
      <Card href="/p" aria-label="Product, $40"><Body>Linen Throw</Body><Body>$40</Body></Card>
    </main>
  );

  test('the bad inputs fail axe when left as written (development)', async () => {
    const { container } = render(<BadInputs />);
    expect(ids(await run(container))).toContain('label-content-name-mismatch');
  });

  test('…and pass in a production build', async () => {
    asProduction();
    const { container } = render(<BadInputs />);
    expect(ids(await run(container))).not.toContain('label-content-name-mismatch');
  });
});
