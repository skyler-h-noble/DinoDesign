/**
 * Every Accessibility tab says what its numbers are a verdict ON.
 *
 * The ratios are measured against the component as configured in the
 * PLAYGROUND, not against the component in general, and the two readings lead
 * opposite ways. A FAIL means "this combination fails" — something the user
 * chose and can change; read as "this component fails" it becomes a bug
 * report against the library for a configuration nobody shipped. And a PASS
 * on the default says nothing about the eight palettes nobody looked at.
 *
 * A tab that states no scope invites both mistakes, so the note is not
 * optional — hence a test rather than a convention. It is a source check
 * because the alternative is mounting 54 showcases and driving each to its
 * third tab.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', 'components');

function showcases() {
  const out = [];
  for (const dir of fs.readdirSync(ROOT)) {
    const d = path.join(ROOT, dir);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('Showcase.js')) out.push(path.join(d, f));
    }
  }
  return out;
}

const withA11yTab = showcases().filter((f) =>
  fs.readFileSync(f, 'utf8').includes('<Tab>Accessibility</Tab>'));

describe('A11yScopeNote', () => {
  it('finds the showcases to check', () => {
    /* Guards the guard: a glob that matched nothing would make the test below
       pass by having no cases. */
    expect(withA11yTab.length).toBeGreaterThan(40);
  });

  it.each(withA11yTab.map((f) => [path.basename(f), f]))('%s renders it', (_name, file) => {
    const src = fs.readFileSync(file, 'utf8');
    expect(src).toContain('<A11yScopeNote />');
    expect(src).toMatch(/import \{[^}]*A11yScopeNote[^}]*\} from '(?:\.\.\/)+a11yPanel';/);
  });

  /* TabsShowcase builds example JSX as a STRING, including
     '<TabPanel value={1}>'. A first pass at this inserted the note into that
     string, which broke the file — so the note must never appear inside one. */
  it('never lands inside a generated-code string', () => {
    const bad = [];
    for (const f of withA11yTab) {
      for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.includes('A11yScopeNote') && (t.startsWith("'") || t.startsWith('"'))) {
          bad.push(path.basename(f));
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
