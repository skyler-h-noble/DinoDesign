# CLAUDE.md — OmniDesign (@omni-design/components)

How to build UI with this package. This page is the rules and the
components most pages need.

- **Component API: `docs/API.md`** — every exported component's props
  (type, allowed values, default, meaning), required parent and one example.
  Read the component's section there (search `### Name`) instead of opening
  `dist/`.
- **Do not read `dist/`** to learn a prop. The types and `docs/API.md` come
  from the same source and are checked against the components on every
  build: if a prop is not in `docs/API.md`, the component does not take it.
- Long form on tokens and theming: `docs/REFERENCE.md` — open it only for a
  token or rule not covered here.

## 1. Install

```bash
npm install @omni-design/components @omni-design/icons @mui/material@^7 @emotion/react @emotion/styled
```

Pin MUI to 7: the parts still built on MUI (and any `sx` you pass) are built against it. Icons come from `@omni-design/icons`, not MUI.

## 2. Provider

```jsx
// main.jsx
import { OmniDesignProvider, OMNI_DEFAULT_THEME_URL } from '@omni-design/components';

<OmniDesignProvider
  themeURL={OMNI_DEFAULT_THEME_URL}   // or your design system's theme.json URL
  defaultDarkMode="system"            // start in the device's light/dark mode
  persistDarkMode                     // remember the visitor's toggle across visits
>
  <App />
</OmniDesignProvider>
```

The components carry no colors or fonts of their own; `themeURL` loads them.
Pass nothing and the page renders as bare HTML (the provider warns in dev).

For a faster first paint, let the browser open its connections while your
JavaScript downloads — in `index.html`'s `<head>`:

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

(Or self-host the theme: copy `node_modules/@omni-design/components/public/styles/`
to `public/omni/` and pass `themeURL="/omni/theme.json"` — no CDN round trip.)

The CSS styles no bare elements, so set the body once:

```css
body {
  margin: 0;
  font-family: var(--Font-Family-Body);
  font-size: var(--Body-Medium-Font-Size);
  line-height: var(--Body-Medium-Line-Height);
}
```

## 3. Color comes from two attributes

- `theme` — the palette: `Default` · `Primary` · `Secondary` · `Tertiary` ·
  `Neutral` · `Info` · `Success` · `Warning` · `Error`, plus the bar themes
  `App-Bar` · `Nav-Bar` · `Status`. `Default` is the page background the
  designer picked; the provider puts it on the root. There are no `-Light` /
  `-Medium` / `-Dark` themes.
- `surface` — how light it sits. Page levels, darkest to brightest:
  `Surface-Dimmest` · `Surface-Dim` · `Surface` · `Surface-Bright` ·
  `Surface-Brightest`. Card levels: `Container-Lowest` · `Container-Low` ·
  `Container` · `Container-High` · `Container-Highest`. A pale tint is
  `Surface-Brightest` (what `Primary-Light` used to be); a deep band is
  `Surface-Dimmest`. Light and dark mode live in the stylesheet, not here.

Set them with `<Section theme surface>` (paints the region) or
`<ThemedZone theme surface>` (attributes only, for something that paints
itself). Everything inside — text, headings, borders, buttons — picks the
right contrast-checked colors. Never paint with `background: var(--Surface)`,
`var(--Container)` or a hex: that colors the box but leaves its text and
borders on the parent's tone.

Bars already wear the designer's choice: `AppBar` is `App-Bar`;
`BottomNavigation` and `Toolbar` are `Nav-Bar`. Leave their color props unset.
A bar or side rail you build yourself is
`<ThemedZone theme="App-Bar" surface="Surface">` — never a palette you pick.

If your project has the studio's file for your design system (CLAUDE.md /
DINO-TOKENS.md from the OmniDesign studio), it names that system's background,
bars, buttons and cards. Follow it.

## 4. Phones, light and dark — already handled

- **Phones:** type follows the screen through the theme's CSS — the phone
  ramp below 600px, tablet below 900px (smaller headings; body text is
  semibold on phones by design — do not override it). Do not set
  `data-device`; it only pins a device on purpose. `AppBar` folds its links, and every `endSlot` action
  but the last, into a menu button below 900px. Pass `endSlot` as a fragment
  of buttons, primary action last. Nothing to set up.
- **Light / dark:** with `defaultDarkMode="system"` and `persistDarkMode` on
  the provider (section 2), the page starts in the device's mode and keeps the
  visitor's choice across reloads — do not write your own storage or
  `matchMedia` code. A toggle is three lines; every component and color
  follows, with contrast already checked in both modes:

```jsx
import { useOmniDesign, Button } from '@omni-design/components';
import DarkModeIcon from '@omni-design/icons/DarkMode';
import LightModeIcon from '@omni-design/icons/LightMode';

function ModeToggle() {
  const { isDark, toggleDarkMode } = useOmniDesign();
  return (
    <Button iconOnly variant="ghost" aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleDarkMode}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}
```

- **Contrast and focus are built in.** Every text, border and focus-ring
  color is chosen by the design system to meet WCAG AA on every theme and
  surface, in light and dark. It can only fail if your code overrides a
  color. So confirm it by checking for overrides, not by scanning pixels —
  one search, no browser contrast scripts needed:

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|(color|background|borderColor)\s*:" src/
  ```

  No hits (or only layout styles) means the page passes. Your own images and
  any colors you add yourself are yours to check.

## 5. A page

```jsx
import {
  AppBar, Section, Container, Grid, VStack, Card, Button, Footer,
  DisplayLarge, AutoHeading, Body, BodySmall, Eyebrow, IconBadge,
} from '@omni-design/components';
import HomeIcon from '@omni-design/icons/Home';

<>
  <AppBar brand="Acme"
          navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
          endSlot={<>
            <Button variant="default-outline" size="small">Log in</Button>
            <Button variant="default" size="small">Get started</Button>
          </>} />

  <Section theme="Default" surface="Surface" padding="large">
    <Container maxWidth="md">
      <VStack spacing={2} alignItems="center">
        <Eyebrow>Eyebrow</Eyebrow>
        <DisplayLarge component="h1" style={{ textAlign: 'center' }}>Headline</DisplayLarge>
        <Body color="quiet" style={{ textAlign: 'center' }}>Supporting copy.</Body>
        <Button variant="default" size="large">Primary action</Button>
      </VStack>
    </Container>
  </Section>

  <Section theme="Secondary" surface="Surface" padding="large" id="features">
    <Container maxWidth="lg">
      <AutoHeading>Features</AutoHeading>   {/* h2: one Section deep */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card style={{ height: '100%' }}>
            <IconBadge color="primary"><HomeIcon /></IconBadge>
            <AutoHeading size="h5">Card title</AutoHeading>   {/* h2 tag, h5 look */}
            <BodySmall color="quiet">One sentence.</BodySmall>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Section>

  <Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]}
          copyrightName="Acme" />
</>
```

## 6. Components you will use

| Need | Use | Key props |
| --- | --- | --- |
| Region with a background | `Section` | `theme`, `surface`, `padding` (`small` / `medium` / `large`), `paddingTop`, `as`, `id` |
| Center + max width | `Container` | `maxWidth` (`sm`/`md`/`lg`/`xl`) — layout only, paints nothing |
| Columns | `Grid` | container: `container spacing`; child: `size={{ xs: 12, md: 4 }}` |
| Stacks | `VStack`, `HStack` | `spacing`, `alignItems`, `justifyContent`, `component` — a list is `<VStack component="ul">` with `<HStack component="li">` |
| Site nav | `AppBar` | `brand`, `navLinks` (`{ label, href, current? }` — the system's Tabs as links: the current one is marked and announced, and for `#section` links it follows the section on screen; a menu button below 900px — change with `collapseAt`), `endSlot`, `barColor`. `mode="mobile"` is an app-screen bar (search / title), not a site nav |
| Card | `Card` | pads itself on a `Container` level; `variant` (`solid`/`light`/`dark`), `color`, `elevated`, `clickable`; `href` makes it a real link |
| Button | `Button` | `variant`, `size` (`small`/`medium`/`large`), `startIcon`, `endIcon`, `fullWidth` |
| Tabs that go to places (a nav, not panels) | `Tabs navigation` | each `Tab` takes `href`; the current one gets `aria-current` and the selected marker — links, not tab roles |
| Segmented choice | `ToggleButtonGroup` | `value`, `onChange`; each child `<Button value="…">` (no `variant` on children) |
| Link | `Link` | `href` or `onClick`. Links do not change color on hover (the underline goes) — do not add one |
| Status message | `Alert` | `color` (`info`/`success`/`warning`/`error`), `title` — themes itself |
| Menu | `Dropdown` › `MenuButton` + `Menu` › `MenuItem`, `MenuDivider` | `Menu` without its `Dropdown` renders nothing. It does not portal: inside a scroll area or clipped card use `Popover` |
| Anything floating (account panel, hover card) | `Popover` | `open`, `onClose`, `anchorRef`, `placement`; `role="tooltip"` + `autoFocus={false}` for a hover card |
| Code, a shell command, a copyable URL | `CodeBlock` | `code`, `language`, `wrap`, `maxHeight` — brings its own copy button |
| Section, panel or card title | `AutoHeading` | `size` (`h1`–`h6`, `display-*`) picks the look; the tag (h2, h3…) comes from nesting in `Section` / `HeadingLevel` |
| Text | `DisplayLarge`, `DisplaySmall`, `H1`–`H6`, `Body`, `BodyLarge`, `BodySmall`, `Caption`, `Eyebrow` (the small caps line above a heading; `Overline` is its old name) | `color` (`quiet`, `primary`, `secondary`, `tertiary`, …), `component` (e.g. `component="p"` for a big price) |
| Bold body text | `Subtitle` | Body has no bold — Subtitle is Body at 700 |
| Icon on a tile | `IconBadge` | `color` (any Button color), `variant` (`solid` / `light` / `dark`), `size` (`small` / `medium` / `large`), `shape` |
| Tag | `Chip` | `label`, `startDecorator` (or `icon`), `selected` |
| Person / step number | `Avatar` | `initials`, `color` |
| Form field | `TextField` | `label`, `value`, `onChange`, `type`, `helperText` |
| Footer | `Footer` | `brand`, `columns` (`[{ title, links: [{ label, href }] }]`, up to 3), `copyrightName`, `color` (`default` dark band / `primary` / `white` / `black`) |

Every component has exact TypeScript types: an editor lists the allowed
values for `theme`, `surface`, `variant`, `color` and `size`, and a value
TypeScript rejects is one the component does not support. The shared names
are exported too: `Theme`, `Surface`, `Color`, `ButtonVariant`, `…Props`.
Any component not in this table: `docs/API.md`.

Icons: `@omni-design/icons` — the Material Icons as plain SVG, same names as
`@mui/icons-material` v7 (`import HomeIcon from '@omni-design/icons/Home'`,
plus `…Outlined` / `…Rounded` / `…Sharp` / `…TwoTone`) without MUI's styling
engine. Use names that exist in v7 (e.g. `Eco` is gone; `EnergySavingsLeaf`
replaces it), or the build fails. Use `<Icon color="primary">` to give one a
brand color.

## 7. Rules

- **Use the components.** No raw `<button>`, `<h1>`–`<h6>`, `<p>`, `<a>` when
  a component above covers it. A plain `<div>` is fine for layout only.
- **`style` is for layout only** — margin, max-width, text-align, height. Never
  color, background, border, radius or font. Change appearance with
  `variant`, `color`, `theme` or `surface`.
- **Never write a hex color or a pixel radius.** If no prop gives the look,
  it is a gap in the package — say so rather than inlining it.
- **Button variants:** a color (`default`, `primary`, `secondary`,
  `tertiary`, `neutral`, `info`, `success`, `warning`, `error`,
  `black-white`) plus `-outline`, or `ghost` / `text`. Use `default` — the
  designer's button — unless the design calls for another. Button, Chip and
  Badge have no `-light`.
- **Icon-only buttons:** the button carries the name, the icon none —
  `<Button iconOnly aria-label="Delete item"><DeleteIcon /></Button>`. Name the
  action, not the picture.
- **Section spacing is named.** `padding="small" | "medium" | "large"` (and
  `paddingTop` / `paddingBottom` for one edge, e.g. the first section under the
  header). They come from the spacing tokens and shrink on phones. Do not
  write pixel padding on sections — six sections, six hand-picked rhythms.
- **One `h1` on every page** — the page's title, not just the home page,
  and including the not-found (404) page and empty states. Use
  `<H1>`, or `component="h1"` on a display style
  (`<DisplayLarge component="h1">`). A category, product, cart or checkout
  page whose title is an `H2` has no `h1` at all.
- **Every other title is `<AutoHeading>`** — section, panel, sidebar, card,
  dialog. Its level comes from nesting, so headings cannot skip a level:
  h1 outside any `Section`, h2 inside one, h3 in a `Section` nested in that,
  never past h6. Pick the look with `size` (`<AutoHeading size="h5">`), never
  by choosing a smaller `H*` — an `H3` picked for its look, directly under the
  page's `h1`, is the axe heading-order failure this replaces. For a
  subsection that is not a `Section` (a card's own sub-titles) wrap it in
  `<HeadingLevel>`. A block that only needs a color, not a new level, is a
  `Box`, not a nested `Section`. `H1`–`H6` still render exactly their tag.
- **A link that shows text gets no `aria-label`.** That covers every link:
  `Link`, and a `Card` or `Button` with `href`. Its visible content (an image
  link's badge and product name included) already names it, and a label that
  differs — even reordered, like `"Linen Throw, Sale"` on a link that reads
  "Sale Linen Throw" — fails voice control (axe label-content-name-mismatch).
  Use `aria-label` only on a link with no visible text (an icon), and give the
  image inside a link `alt=""` so the visible text is the whole name. The same
  goes for `aria-labelledby` on anything showing text. `Link`, `Button`, a
  clickable `Card`, `Chip` and `BreadcrumbItem` warn in development when a
  label does not contain their visible text, and drop it in production builds.
- **Cards take their section's color.** Leave `color` / `theme` off cards so
  they inherit the band they sit on. Never rotate colors across a row of cards
  (`color={COLORS[i % n]}`) or give one card a different theme from its
  neighbours — a set of cards is one surface, not a palette sampler. To make
  one card stand out, raise its level (`Container-High`), not its color.
- **Color roles — use all three.** Primary, Secondary and Tertiary are roles,
  each with contrast-checked text, buttons, icons and a whole theme on every
  surface. Do not build a page from one accent and grays. Mostly `Default` and
  `Primary` sections, one or two `Secondary` sections, and `Tertiary` only as
  accents (avatars, an `IconBadge`, a stat) — never a Tertiary section.
  Colored text is the `color` prop (`primary` / `secondary` / `tertiary`), for
  short emphasis, not paragraphs. `Eyebrow` already takes its color from the
  section (Primary → Secondary, Secondary → Tertiary, …) — do not recolor it.
  To separate neighboring sections, alternate the `theme`; neighboring
  `surface` levels can look nearly the same.
- **Build warning you can ignore:** Vite may warn about a large `BrandIcon`
  chunk. It is loaded only when a Footer social link names a brand.
- **Do not import components from `@mui/material`** — the package re-exports
  the ones it supports, themed.

## 8. Floating elements cast black shadows

Shadows come in two sets with the same levels and geometry:

- `--Effect-Level-1` … `-5` — tinted by the surface (`--Dropshadow-Color`).
  For things that sit ON one surface: Card, Box, Chip, inputs, Accordion,
  Alert, a non-sticky `AppBar`, a `Popover` with `disablePortal`.
- `--Effect-Level-1-Neutral` … `-5-Neutral` — pure black. For anything fixed
  or floating over the whole page: Tooltip, Menu, Popover, Snackbar, Dialog,
  Modal, Drawer, Sheet, Fab, the floating Toolbar, and the AppBar while sticky.

Why: a floating element passes over every color on the page, so a shadow
tinted by one surface shows up as a colored halo over the others. The
components above already pick the right set. If a design system predates the
black set, they fall back to the same geometry in black.

## 9. When something is missing

Tag it where you would have used it, so it can be added to the package:

```jsx
// MISSING-LIB-COMPONENT: <Name>
// Needed for: <one line>
```

## 10. Client-side routing

With React Router, Next.js or any client-side router, give the provider the
router's link component. Every component that takes `href` — `Button`, `Card`,
`Link`, `Tab` in `<Tabs navigation>`, `BreadcrumbItem`, and through them
`AppBar`, `Footer` and `AvatarGroup` — then renders it for internal links:
the page changes without a reload, and the link stays a real `<a href>`
(right-click, open in new tab, copy link). No wrapper or `useLinkProps`
helper is needed.

```jsx
// React Router — the provider can sit inside or outside <BrowserRouter>
import { Link as RouterLink } from 'react-router-dom';

<BrowserRouter>
  <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL} linkComponent={RouterLink}>
    <App />   {/* <Button href="/cart">Cart</Button> now routes */}
  </OmniDesignProvider>
</BrowserRouter>
```

```jsx
// Next.js (App Router): in your own 'use client' providers file
'use client';
import NextLink from 'next/link';

export function Providers({ children }) {
  return <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL} linkComponent={NextLink}>{children}</OmniDesignProvider>;
}
```

The link component receives every anchor prop plus `href` and `to` (routers
name it one or the other), and the ref. Without a link component you can pass
`navigate={(href, event) => …}` instead: the library keeps a plain `<a>` and
calls it on an unmodified left click.

These always stay plain `<a>` and let the browser handle them: full URLs
(`https://…`, even on your own site — write internal links as paths),
`mailto:` / `tel:`, `#section` links, `target="_blank"`, `download`, and
cmd / ctrl / shift / middle clicks. To force a full page load on one link
(a path your router does not own), add `reloadDocument`:
`<Link href="/legacy" reloadDocument>`.
