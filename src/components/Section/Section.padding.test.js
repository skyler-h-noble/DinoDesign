/* Named section padding: one rhythm for every section, from the Sizing scale,
   shrinking on tablets and phones. A raw CSS value still works. */
import React from 'react';
import { render } from '@testing-library/react';
import { Section } from './Section';
import { getStaticStyles } from '../_staticStyles';

const el = (ui) => render(ui).container.firstChild;
const sheet = () => getStaticStyles();

test('a named size sets classes, not an inline padding', () => {
  const s = el(<Section padding="medium">x</Section>);
  expect(s).toHaveClass('omni-section-py-medium', 'omni-section-px');
  expect(s.style.padding).toBe('');
});

test('one edge can take its own size', () => {
  const s = el(<Section padding="medium" paddingTop="small">x</Section>);
  expect(s).toHaveClass('omni-section-py-medium', 'omni-section-pt-small');
});

test('a raw value is still applied inline', () => {
  const s = el(<Section padding="80px 24px">x</Section>);
  expect(s.style.padding).toBe('80px 24px');
  expect(s.className).toBe('');
});

test('className is kept alongside the size', () => {
  expect(el(<Section padding="large" className="hero">x</Section>)).toHaveClass('hero', 'omni-section-py-large');
});

test('the sizes come from Sizing tokens and shrink on phones', () => {
  const css = sheet();
  expect(css).toContain('.omni-section-py-medium{padding-top:var(--Sizing-8, 64px);padding-bottom:var(--Sizing-8, 64px)}');
  const phone = css.slice(css.indexOf('@media (max-width:599.98px)'));
  expect(phone).toContain('.omni-section-py-medium{padding-top:var(--Sizing-5, 40px)');
  expect(phone).toContain('padding-left:var(--Sizing-2, 16px)');
});

test('in every block, one-edge rules come after every section-size rule', () => {
  const css = sheet();
  const blocks = [css.split('@media')[0], ...css.split('@media').slice(1)];
  blocks.forEach((b) => {
    const lastPy = b.lastIndexOf('.omni-section-py-');
    const firstPt = b.indexOf('.omni-section-pt-');
    if (firstPt >= 0) expect(firstPt).toBeGreaterThan(lastPy);
  });
});
