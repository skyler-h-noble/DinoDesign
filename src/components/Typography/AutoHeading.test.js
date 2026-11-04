// AutoHeading / HeadingLevel / Section — the level comes from nesting, the look
// from `size`, so titles cannot skip a level (axe heading-order).
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AutoHeading, H1, H3, Heading, AUTO_HEADING_SIZES } from './Typography';
import { HeadingLevel, useHeadingLevel } from '../_headingLevel';
import { Section } from '../Section/Section';
import { Card } from '../Card/Card';
import * as pkg from '../index';

const tag = (text) => screen.getByText(text).tagName;

describe('AutoHeading — level from nesting', () => {
  test('outside any Section it is the page title: h1', () => {
    render(<AutoHeading>Page</AutoHeading>);
    expect(tag('Page')).toBe('H1');
  });

  test('each nested Section adds one level: h1 → h2 → h3', () => {
    render(
      <>
        <AutoHeading>Top</AutoHeading>
        <Section>
          <AutoHeading>Band</AutoHeading>
          <Section>
            <AutoHeading>Panel</AutoHeading>
          </Section>
        </Section>
      </>,
    );
    expect(tag('Top')).toBe('H1');
    expect(tag('Band')).toBe('H2');
    expect(tag('Panel')).toBe('H3');
  });

  test('siblings share a level', () => {
    render(
      <Section>
        <AutoHeading>One</AutoHeading>
        <Card><AutoHeading>Two</AutoHeading></Card>
        <Section><AutoHeading>Deeper</AutoHeading></Section>
        <AutoHeading>Three</AutoHeading>
      </Section>,
    );
    expect(tag('One')).toBe('H2');
    expect(tag('Two')).toBe('H2');
    expect(tag('Three')).toBe('H2');
    expect(tag('Deeper')).toBe('H3');
  });

  test('sibling Sections are the same level, not cumulative', () => {
    render(
      <>
        <Section><AutoHeading>A</AutoHeading></Section>
        <Section><AutoHeading>B</AutoHeading></Section>
      </>,
    );
    expect(tag('A')).toBe('H2');
    expect(tag('B')).toBe('H2');
  });

  test('caps at h6', () => {
    render(
      <Section><Section><Section><Section><Section><Section><Section>
        <AutoHeading>Deep</AutoHeading>
      </Section></Section></Section></Section></Section></Section></Section>,
    );
    expect(tag('Deep')).toBe('H6');
  });

  test('HeadingLevel adds one without painting; level= sets it outright', () => {
    const { container } = render(
      <Section>
        <AutoHeading>Checkout</AutoHeading>
        <HeadingLevel><AutoHeading>Shipping</AutoHeading></HeadingLevel>
        <HeadingLevel level={5}><AutoHeading>Fine print</AutoHeading></HeadingLevel>
      </Section>,
    );
    expect(tag('Checkout')).toBe('H2');
    expect(tag('Shipping')).toBe('H3');
    expect(tag('Fine print')).toBe('H5');
    // HeadingLevel renders no element of its own.
    expect(container.querySelectorAll('section > div')).toHaveLength(0);
  });

  test('useHeadingLevel reads the level', () => {
    function Probe() { return <span>level {useHeadingLevel()}</span>; }
    render(<Section><Section><Probe /></Section></Section>);
    expect(screen.getByText('level 3')).toBeInTheDocument();
  });
});

describe('AutoHeading — look is independent of level', () => {
  test('defaults to the style of its level', () => {
    render(<Section><AutoHeading>Band</AutoHeading></Section>);
    expect(screen.getByText('Band')).toHaveClass('omni-type-h2');
  });

  test('size picks the look; the tag stays the level', () => {
    render(
      <Section>
        <AutoHeading size="h5">Small look</AutoHeading>
        <AutoHeading size="display-large">Big look</AutoHeading>
      </Section>,
    );
    const small = screen.getByText('Small look');
    expect(small.tagName).toBe('H2');
    expect(small).toHaveClass('omni-type-h5');
    const big = screen.getByText('Big look');
    expect(big.tagName).toBe('H2');
    expect(big).toHaveClass('omni-type-display-large');
  });

  test('component cannot override the level', () => {
    render(<Section><AutoHeading component="div">Still h2</AutoHeading></Section>);
    expect(tag('Still h2')).toBe('H2');
  });

  test('color and other Typography props pass through', () => {
    render(<AutoHeading color="primary" id="t">Colored</AutoHeading>);
    const el = screen.getByText('Colored');
    expect(el).toHaveClass('omni-type-ch-primary');
    expect(el).toHaveAttribute('id', 't');
  });

  test('sizes list covers display and h1–h6', () => {
    expect(AUTO_HEADING_SIZES).toEqual(['display-large', 'display-medium', 'display-small', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  });
});

describe('explicit headings are unchanged', () => {
  test('H1–H6 render their own tag inside nested Sections', () => {
    render(
      <Section><Section>
        <H1>Explicit one</H1>
        <H3>Explicit three</H3>
        <Heading>Heading is H4</Heading>
      </Section></Section>,
    );
    expect(tag('Explicit one')).toBe('H1');
    expect(tag('Explicit three')).toBe('H3');
    expect(tag('Heading is H4')).toBe('H4');
  });

  test('Section renders no extra element for the level', () => {
    const { container } = render(<Section data-testid="s"><span>x</span></Section>);
    expect(container.querySelector('section').firstChild.tagName).toBe('SPAN');
  });

  test('exported from the package', () => {
    expect(pkg.AutoHeading).toBe(AutoHeading);
    expect(pkg.HeadingLevel).toBe(HeadingLevel);
    expect(pkg.useHeadingLevel).toBe(useHeadingLevel);
    expect(pkg.Heading).toBe(pkg.H4);
  });
});

describe('axe heading-order', () => {
  const run = (container) => axe(container, { runOnly: { type: 'rule', values: ['heading-order'] } });

  test('a store page built from AutoHeading passes', async () => {
    const { container } = render(
      <main>
        <Section>
          <H1>Shop</H1>
          <aside>
            <AutoHeading size="h5">Filters</AutoHeading>
          </aside>
          <Card><AutoHeading size="h4">Order summary</AutoHeading></Card>
          <Section>
            <AutoHeading>Shipping</AutoHeading>
            <HeadingLevel><AutoHeading size="h6">Address</AutoHeading></HeadingLevel>
          </Section>
        </Section>
        <Section><AutoHeading>Related</AutoHeading></Section>
      </main>,
    );
    expect(tag('Filters')).toBe('H2');
    expect(tag('Order summary')).toBe('H2');
    expect(tag('Shipping')).toBe('H3');
    expect(tag('Address')).toBe('H4');
    expect(await run(container)).toHaveNoViolations();
  });

  test('the same page with H3 picked for its look fails (what AutoHeading prevents)', async () => {
    const { container } = render(
      <main>
        <Section>
          <H1>Shop</H1>
          <H3>Filters</H3>
        </Section>
      </main>,
    );
    const results = await run(container);
    expect(results.violations.map((v) => v.id)).toContain('heading-order');
  });
});
