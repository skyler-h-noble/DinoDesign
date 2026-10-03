import React from 'react';
import { render } from '@testing-library/react';
import { COMPONENT_DOCS } from './components';
import { EXAMPLES, PROP_EXAMPLES } from './examples';

/* A prop wants a picture when it is an enumerated AXIS or a boolean.
   min/max, event handlers and free strings do not — a sample of `min={0}`
   shows a slider. Counting them made coverage look worse than it is and
   pointed the work at the wrong props. */
const wantsSample = (p) => {
  const t = String(p.type || '');
  if (Array.isArray(p.values) && p.values.length > 1) return true;
  if (/^boolean$/.test(t)) return true;
  if (t.includes("'") && t.includes('|')) return true;   // a union of literals
  return false;
};

it('coverage', () => {
  const lead = new Set(Object.keys(EXAMPLES));
  const names = COMPONENT_DOCS.map(d => d.name).sort();
  const noLead = names.filter(n => !lead.has(n));
  console.log('DOCS:', names.length, '| LEAD:', names.length - noLead.length,
              '| NO LEAD:', noLead.length);
  console.log('NO_LEAD:', noLead.join(','));
  const rows = [];
  let want = 0, have = 0;
  for (const d of COMPONENT_DOCS) {
    const got = Object.keys(PROP_EXAMPLES[d.name] || {});
    const axes = (d.props || []).filter(wantsSample).map(p => p.sample || p.name);
    const miss = axes.filter(k => !got.includes(k));
    want += axes.length; have += axes.length - miss.length;
    if (miss.length) rows.push(`${d.name} [${axes.length - miss.length}/${axes.length}] MISSING=${miss.join(' ')}`);
  }
  console.log(`AXES: ${have}/${want}`);
  console.log('AXIS_GAPS:\n' + rows.join('\n'));
});

it('every sample renders', () => {
  const errs = [];
  for (const [comp, samples] of Object.entries(PROP_EXAMPLES)) {
    for (const [prop, fn] of Object.entries(samples)) {
      try { render(<div>{fn({ theme: null, surface: 'Surface' })}</div>); }
      catch (e) { errs.push(`${comp}.${prop}: ${e.message.split('\n')[0]}`); }
    }
  }
  for (const [comp, fn] of Object.entries(EXAMPLES)) {
    try { render(<div>{fn({ theme: null, surface: 'Surface' })}</div>); }
    catch (e) { errs.push(`EXAMPLE ${comp}: ${e.message.split('\n')[0]}`); }
  }
  expect(errs).toEqual([]);
});
