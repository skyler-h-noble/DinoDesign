# @omni-design/components

React components for an OmniDesign design system. The components carry no
colors, fonts or radii of their own — they read them from your design
system's CSS, so the same code renders in any brand, in light or dark, with
text and controls that meet WCAG contrast on every background.

Design systems are made in the OmniDesign studio, which also produces the
matching Figma library.

## Install

```bash
npm install @omni-design/components @omni-design/icons @mui/material@^7 @emotion/react @emotion/styled
```

MUI 7 is required. Icons come from `@omni-design/icons` (the Material Icons
as plain SVG, same names), not `@mui/icons-material`. Filled icons:
`import HomeIcon from '@omni-design/icons/Home'`. Other styles are one module
each: `import { HomeOutlined } from '@omni-design/icons/outlined'` (`/rounded`,
`/sharp`, `/twotone`). The per-icon `@omni-design/icons/HomeOutlined` paths
were removed in 0.2.0.

Using Claude Code? Copy the package's slash commands (`/OmniCheck`,
`/ScanComponents`, `/ShareComponent`) into the project — Claude Code does not
read `node_modules`:

```bash
npx omni-check --install-commands   # writes them to .claude/commands/
```

**Dark mode and images:** photos are dimmed 30% in dark mode so they do not
glare; logos never are. SVGs, images inside a `header`, `footer` or `nav`, and
images marked `data-logo` or `data-no-dim` (or inside a `data-no-dim` region)
stay at full brightness.

## Use

```jsx
import { OmniDesignProvider, OMNI_DEFAULT_THEME_URL, Section, H2, Body, Button } from '@omni-design/components';

export default function App() {
  return (
    <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>
      <Section theme="Primary" surface="Surface" padding="medium">
        <H2>Hello</H2>
        <Body>Every color here comes from the design system.</Body>
        <Button variant="default">Get started</Button>
      </Section>
    </OmniDesignProvider>
  );
}
```

`OMNI_DEFAULT_THEME_URL` is the package's own theme. For your brand, pass
your design system's `theme.json` URL from the studio instead. The studio also
gives you a CLAUDE.md for that system — its page background, bars, buttons and
cards — to put next to this package's in your project.

## Fast first paint: the theme in `index.html`

With `themeURL` alone the browser downloads your JavaScript, then theme.json,
then the theme's CSS, and only then paints — the provider keeps the page
hidden until the theme has applied, so nothing flashes unstyled. The Vite
plugin moves the CSS into the HTML so it downloads alongside the JavaScript:

```js
// vite.config.js
import { omniTheme, OMNI_DEFAULT_THEME_URL } from '@omni-design/components/vite';

export default defineConfig({
  plugins: [react(), omniTheme({ themeURL: OMNI_DEFAULT_THEME_URL })], // same URL as the provider
});
```

Keep `themeURL` on `<OmniDesignProvider>`: it finds the theme in the page,
skips theme.json and never downloads a sheet twice. By default the plugin
links the published CSS from the page's head, so it downloads alongside your
JavaScript and stays live — a design system regenerated in the studio reaches
the site on the next visit, no rebuild. `omniTheme({ themeURL, copy: true })`
instead copies a snapshot into your build (hashed files served by your host,
every Google Font family in one URL): a little faster, but rebuild to pick up
a regenerated system. A small inline script picks light or
dark before the first paint (saved toggle, else the device — `dark: 'system'`,
the default; use `'light'` or `'dark'` to match a provider without
`defaultDarkMode="system"`).

**Only the themes you use.** On `vite build` the plugin reads your code for
the themes it names — `data-theme="Primary"`, `color="error"`,
`variant="warning-outline"`, any string that names a theme — plus the ones lib
components pick on their own (AppBar's App-Bar, CodeBlock's Neutral), and
loads only those themes' colors. Each theme is about a twelfth of the color
sheet, so a site that uses five of the twelve downloads well under half of it.
It stays live, adds no JavaScript to your pages and nothing to set up. `vite`
dev always loads every theme. A theme your code only knows at run time (a name
from a CMS) is loaded the moment the page uses it; to have it from the first
paint, list it: `omniTheme({ themeURL, themes: ['Info'] })`. `trim: false`
turns it off. Needs a design system published from the studio after Nov 8,
2026 — older ones load in full, as before. Figma always has every theme.

Measured on a store app (150 ms latency, 1.6 Mbps, 4× CPU, median of 3): first
styled paint 1.9–2.6 s with `themeURL` alone, 1.3 s with the plugin — live (1.34 s) or `copy: true` (1.31 s) — on every
page (Lighthouse mobile home 82 → 87). Without Vite, `npx omni-theme-links <theme.json URL>` prints the same
block to paste into `<head>` (add `--copy public/omni` to self-host the files).

## Client-side routing

Pass your router's link component to the provider and every component with an
`href` (Button, Card, Link, Tabs in navigation mode, Breadcrumbs, and the
AppBar / Footer links built from them) navigates through it — no page reload,
and still a real, right-clickable `<a href>`:

```jsx
import { Link as RouterLink } from 'react-router-dom';   // or: import NextLink from 'next/link'

<OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL} linkComponent={RouterLink}>
  <Button href="/cart">Cart</Button>
</OmniDesignProvider>
```

External links (`https://…`, `mailto:`, `tel:`), `#section` links,
`target="_blank"` and `download` stay plain anchors, as do cmd / ctrl / middle
clicks. Add `reloadDocument` to a component to force a full page load. If you
would rather not hand over a component, `navigate={(href, event) => …}` is
called on plain left clicks instead. Details: [`CLAUDE.md`](./CLAUDE.md),
section 10.

## Accessibility check: `omni-check` (optional)

The design system owns contrast, focus and states. What it cannot own is how a
page is put together, so the package ships a checker for that. It is a tool to
run when you want an audit, not a required build step.

> It visits pages as a new visitor, so a page that needs app state (a filled
> cart, a signed-in user) is checked in its empty state. If the computer sleeps
> during a run, pages time out and are listed as not checked; run it again.

```bash
npm run build && npx omni-check --routes /,/cart,/checkout
```

Run it once and let the output stream (it prints a line per page; 30 pages
take 2-3 minutes) — piping it through `tail` hides that progress until the end.

It serves your build folder (`dist/`, `build/` or `out/`, or pass a folder or
a URL), follows the links from the start page (or `--routes /,/cart`), and runs
axe-core on every page in light and dark mode at 1280px and 390px, in a Chrome,
Chromium or Edge already on your machine (`CHROME_PATH` to pick one; it never
downloads a browser). Each failure is printed with its element and the fix; the
last line is `omni-check: 0 issues` when clean, and the exit code is 1 when not,
for CI. `--json` for a machine-readable report. Needs Node 22+.

Light and dark run in separate browser contexts (separate localStorage), one
page at a time, and every page is bounded: `--page-timeout` (default 60s) for
one page, `--max-time` (default 600s) for the run. A page that times out or
fails to load is listed as not checked and the exit code is 2. omni-check
starts its own headless browser on a temp profile and closes exactly that
browser when it finishes, times out or is stopped with Ctrl-C. To stop a run,
stop omni-check itself — never kill Chrome by name.

Two common failures are designed out in the components themselves:
`<AutoHeading>` takes its level from nesting in `Section` / `HeadingLevel`, so
section titles cannot skip a level; and `Link`, `Button`, clickable `Card`,
`Chip` and `BreadcrumbItem` drop an `aria-label` that does not contain their
visible text in production builds (and warn in development).

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — the short guide: setup, the components you
  will use, the rules. Written for AI coding tools and just as useful for
  people.
- [`docs/API.md`](./docs/API.md) — the component API: every exported
  component's props, defaults, required parent and an example. Generated
  from the same source as the TypeScript types, so it matches them. Read
  this instead of opening `dist/`.
- [`docs/REFERENCE.md`](./docs/REFERENCE.md) — tokens, theming and rules in
  full.

TypeScript types ship with the package, for every component.

## Developing this package

```bash
npm start            # component gallery at http://localhost:3000
npm test             # unit tests
npm run build:lib    # dist/ + type declarations + docs/API.md (from types/)
npm run test:types   # compiles a strict TypeScript consumer page against dist/types,
                     # checks no component's props are `any`, and that docs/API.md is current
```
