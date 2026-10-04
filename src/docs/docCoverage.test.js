/**
 * Every component leads with an example, and every axis has a picture.
 *
 * These are the two things the docs page is for. The summary answers "what is
 * this" with one live instance; the per-prop samples answer "what can it be".
 * Before this gate existed, 29 of 50 components had no lead example and 16 of
 * 152 axes had a sample — and nothing failed, because prose renders fine.
 *
 * A gate rather than a report. The counts were a console.log for as long as
 * the work was in progress, which is exactly how 29 missing examples went
 * unnoticed: a number nobody reads is not a measurement.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { COMPONENT_DOCS } from './components';
import { EXAMPLES, PROP_EXAMPLES } from './examples';

/* A prop wants a picture when it is an enumerated AXIS or a boolean.
   `min`, `max`, event handlers and free strings do not — a sample of
   `min={0}` is a picture of a slider. Counting them made coverage look worse
   than it was and pointed the work at the wrong props. */
const wantsSample = (p) => {
  const t = String(p.type || '');
  if (Array.isArray(p.values) && p.values.length > 1) return true;
  if (/^boolean$/.test(t)) return true;
  if (t.includes("'") && t.includes('|')) return true;  // a union of literals
  return false;
};

const axesOf = (doc) => (doc.props || []).filter(wantsSample).map(p => p.sample || p.name);

describe('doc coverage', () => {
  it('names every component exactly once', () => {
    const names = COMPONENT_DOCS.map(d => d.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    /* CodeBlock had two entries. `docFor` uses `.find`, so the second was
       dead weight that still showed up in every listing. */
    expect(dupes).toEqual([]);
  });

  it('gives every component a lead example', () => {
    const missing = COMPONENT_DOCS
      .map(d => d.name)
      .filter(n => typeof EXAMPLES[n] !== 'function');
    expect(missing).toEqual([]);
  });

  it('gives every axis a sample', () => {
    const gaps = [];
    for (const doc of COMPONENT_DOCS) {
      const have = Object.keys(PROP_EXAMPLES[doc.name] || {});
      for (const axis of axesOf(doc)) {
        if (!have.includes(axis)) gaps.push(`${doc.name}.${axis}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  /* A sample for an axis the doc does not declare is a sample nothing
     renders — PROP_EXAMPLES is keyed by prop, and DocSummary looks each one
     up BY the prop it is beside. A typo here is silent. */
  it('has no sample keyed to a prop the doc does not list', () => {
    const orphans = [];
    for (const doc of COMPONENT_DOCS) {
      const keys = (doc.props || []).map(p => p.sample || p.name);
      for (const k of Object.keys(PROP_EXAMPLES[doc.name] || {})) {
        if (!keys.includes(k)) orphans.push(`${doc.name}.${k}`);
      }
    }
    expect(orphans).toEqual([]);
  });

  it('has no samples for a component with no doc', () => {
    const names = COMPONENT_DOCS.map(d => d.name);
    const stray = Object.keys(PROP_EXAMPLES).filter(c => !names.includes(c));
    expect(stray).toEqual([]);
  });
});

describe('everything renders', () => {
  const cases = [
    ...Object.entries(EXAMPLES).map(([n, fn]) => [`example ${n}`, fn]),
    ...Object.entries(PROP_EXAMPLES).flatMap(([c, s]) =>
      Object.entries(s).map(([p, fn]) => [`${c}.${p}`, fn])),
  ];

  /* Per-case rather than one loop, so a failure names the sample instead of
     reporting that one of 200 threw. */
  it.each(cases)('%s', (_name, fn) => {
    const { container } = render(<div>{fn({ theme: null, surface: 'Surface' })}</div>);
    expect(container).toBeTruthy();
  });
});
