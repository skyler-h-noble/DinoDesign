/* THE GALLERY'S OWN MANIFEST HAS TO NAME ITS SYSTEM.
 *
 * BrandedAppBar passes `brand={name || undefined}` from useOmniDesign(), which
 * the Provider reads off the manifest's `name`. With no ?user= param the
 * gallery loads the BUNDLED public/styles/theme.json — and that file had no
 * `name`, so `brand` was undefined and AppBar fell through to its own
 * `companyName = 'Company'` default. The header read "Company" on every local
 * run and on every visit without a user param.
 *
 * The studio's generator does write `name` into theme.json alongside the file
 * URLs, so a hosted system was always fine. Only the copy shipped with the
 * library was missing it — exactly the sort of gap a hosted-only check never
 * sees.
 */
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', '..', 'public', 'styles', 'theme.json');

describe('the bundled theme.json', () => {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  test('names the design system, so the AppBar does not say "Company"', () => {
    expect(typeof manifest.name).toBe('string');
    expect(manifest.name.trim().length).toBeGreaterThan(0);
    expect(manifest.name).not.toBe('Company');
  });

  /* The rest of the slots the Provider loads, in case a hand-edit drops one.
     A missing slot does not fail loudly — the Provider simply never fetches
     that file and the library's own bundled copy wins. */
  test.each(['foundation', 'core', 'lightMode', 'darkMode', 'base', 'styles'])(
    'still declares the %s slot', (slot) => {
      expect(manifest[slot]).toBeTruthy();
    });
});

/* AND SOMETHING HAS TO READ IT.
 *
 * Adding `name` to the manifest fixed nothing on its own: `themeURL` is
 * undefined without a ?user= param, so the Provider is handed individual CSS
 * paths and never fetches public/styles/theme.json at all. The context's
 * `name` stayed null and the header still said "Company".
 *
 * The local case reads the one field it needs directly rather than being given
 * a themeURL — that would make the Provider fetch every slot in the manifest
 * on top of the links already in index.html, duplicating the sheets and
 * reordering a cascade whose order is load-bearing.
 */
describe('the gallery reads that name when no manifest is loaded', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'pages', 'ComponentShowcase.js'), 'utf8');

  test('there is a local-manifest fallback', () => {
    expect(src).toContain('useLocalSystemName');
    expect(src).toContain('/styles/theme.json');
  });

  test('and the AppBar prefers the context name, then the local one', () => {
    expect(src).toContain('brand={name || localName || undefined}');
  });

  /* Pointing themeURL at the local manifest would ALSO make the name appear,
     and would quietly double-load every stylesheet. */
  test('the local case still passes no themeURL', () => {
    expect(src).toContain('userParam ? themeManifestUrl(userParam) : undefined');
  });
});

