/**
 * Where a component's content comes from, when the library does not ship it.
 *
 * Icon renders Material Symbols and BrandIcon renders Font Awesome 6 Brands,
 * both by LIGATURE — you type a name and the font draws the glyph. So using
 * either means knowing a name, and the name list is somebody else's site.
 * Before these links the answer to "what can I put here" was to already know.
 *
 * The two lists are DIFFERENT, and crossing them is the mistake worth
 * guarding: sending someone to the Material list for a brand mark sends them
 * somewhere the name does not exist, and the failure is a blank glyph rather
 * than an error.
 */
import { COMPONENT_DOCS } from './components';

const docFor = (name) => COMPONENT_DOCS.find((d) => d.name === name);

describe('doc links', () => {
  it('points Icon at Material Symbols', () => {
    const links = docFor('Icon').links || [];
    expect(links.length).toBe(1);
    expect(links[0].href).toContain('fonts.google.com/icons');
    expect(links[0].label).toMatch(/material symbols/i);
  });

  it('points BrandIcon at Font Awesome Brands, not at Material', () => {
    const links = docFor('BrandIcon').links || [];
    expect(links.length).toBe(1);
    expect(links[0].href).toContain('fontawesome.com');
    expect(links[0].href).not.toContain('fonts.google.com');
  });

  /* Filtered to the free collection. The brand marks are all free, but an
     unfiltered search mixes in Pro results, so the first glyph someone finds
     can be one this font does not carry — and a ligature miss renders blank
     rather than erroring, so it reads as the component being broken. */
  it('filters BrandIcon to the free collection', () => {
    expect(docFor('BrandIcon').links[0].href).toContain('free-collection');
  });

  it('gives the two components different lists', () => {
    expect(docFor('Icon').links[0].href).not.toBe(docFor('BrandIcon').links[0].href);
  });

  /* Every link is absolute and https. A relative href in a doc would resolve
     against the gallery and 404 quietly. */
  it.each(COMPONENT_DOCS.filter((d) => d.links && d.links.length).map((d) => [d.name, d]))(
    '%s has well-formed links', (_name, doc) => {
      for (const l of doc.links) {
        expect(typeof l.label).toBe('string');
        expect(l.label.trim().length).toBeGreaterThan(0);
        expect(l.href).toMatch(/^https:\/\//);
      }
    });
});
