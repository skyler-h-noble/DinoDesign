# CLAUDE.md — OmniDesign (@omni-design/components)

How to build UI with this package. This page is enough for most pages; the
long form is `docs/REFERENCE.md` in this package — open it only for a
component or token not covered here.

## 1. Install

```bash
npm install @omni-design/components @mui/material@^7 @mui/icons-material@^7 @emotion/react @emotion/styled
```

Pin MUI to 7. MUI 9 removed icons this package imports, and the build fails.

## 2. Provider

```jsx
// main.jsx
import { OmniDesignProvider, OMNI_DEFAULT_THEME_URL } from '@omni-design/components';

<OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>   {/* or your design system's theme.json URL */}
  <App />
</OmniDesignProvider>
```

The components carry no colors or fonts of their own; `themeURL` loads them.
Pass nothing and the page renders as bare HTML (the provider warns in dev).

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

- `theme` — `Default` · `Primary` · `Secondary` · `Tertiary` · `Neutral` ·
  `Info` · `Success` · `Warning` · `Error`. There are no `-Light` / `-Dark`
  themes.
- `surface` — page levels `Surface-Dimmest` · `Surface-Dim` · `Surface` ·
  `Surface-Bright` · `Surface-Brightest`; containers `Container-Lowest` …
  `Container-Highest`. Light and dark live here.

Set them with `<Section theme surface>` (paints the region) or
`<ThemedZone theme surface>` (attributes only). Everything inside — text,
headings, borders, buttons — picks the right contrast-checked colors.

## 4. A page

```jsx
import {
  AppBar, Section, Container, Grid, VStack, HStack, Card, Button, Link, Footer,
  DisplayLarge, H2, Subtitle, Body, BodySmall, Eyebrow, IconBadge,
} from '@omni-design/components';
import HomeIcon from '@mui/icons-material/Home';

<>
  <AppBar mode="desktop" brand="Acme"
          centerSlot={<HStack spacing={3}><Link href="#features">Features</Link></HStack>}
          endSlot={<Button variant="default" size="small">Get started</Button>} />

  <Section theme="Default" surface="Surface" padding="80px 24px">
    <Container maxWidth="md">
      <VStack spacing={2} alignItems="center" style={{ textAlign: 'center' }}>
        <Eyebrow>Eyebrow</Eyebrow>
        <DisplayLarge component="h1">Headline</DisplayLarge>
        <Body color="quiet">Supporting copy.</Body>
        <Button variant="default" size="large">Primary action</Button>
      </VStack>
    </Container>
  </Section>

  <Section theme="Secondary" surface="Surface" padding="80px 24px" id="features">
    <Container maxWidth="lg">
      <H2>Features</H2>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card style={{ height: '100%' }}>
            <IconBadge color="primary"><HomeIcon /></IconBadge>
            <Subtitle>Card title</Subtitle>
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

## 5. Components you will use

| Need | Use | Key props |
| --- | --- | --- |
| Region with a background | `Section` | `theme`, `surface`, `padding`, `as`, `id` |
| Center + max width | `Container` | `maxWidth` (`sm`/`md`/`lg`/`xl`) — layout only, paints nothing |
| Columns | `Grid` | container: `container spacing`; child: `size={{ xs: 12, md: 4 }}` |
| Stacks | `VStack`, `HStack` | `spacing`, `alignItems`, `justifyContent` |
| Top bar | `AppBar` | `mode` (`desktop`/`mobile` — pick per breakpoint, it does not switch itself), `brand`, `centerSlot`, `endSlot`, `barColor` |
| Card | `Card` | pads itself; `variant` (`solid`/`light`/`dark`), `color`, `elevated`, `clickable` |
| Button | `Button` | `variant`, `size` (`small`/`medium`/`large`), `startIcon`, `endIcon`, `fullWidth` |
| Segmented choice | `ToggleButtonGroup` | `value`, `onChange`; each child `<Button value="…">` (no `variant` on children) |
| Link | `Link` | `href` or `onClick` |
| Text | `DisplayLarge`, `H1`–`H6`, `Body`, `BodyLarge`, `BodySmall`, `Caption`, `Eyebrow` | `color` (`quiet`, `primary`, `secondary`, …), `component` |
| Bold body text | `Subtitle` | Body has no bold — Subtitle is Body at 700 |
| Icon on a tile | `IconBadge` | `color`, `variant`, `size`, `shape` |
| Tag | `Chip` | `label`, `startDecorator` (or `icon`), `selected` |
| Person / step number | `Avatar` | `initials`, `color` |
| Form field | `TextField` | `label`, `value`, `onChange`, `type`, `helperText` |
| Footer | `Footer` | `brand`, `columns`, `copyrightName` |

Icons: `@mui/icons-material` (MUI 7) — use names that exist in v7 (e.g. `Eco`
is gone; `EnergySavingsLeaf` replaces it), or the build fails. Use
`<Icon color="primary">` to give one a brand color.

## 6. Rules

- **Use the components.** No raw `<button>`, `<h1>`–`<h6>`, `<p>`, `<a>` when
  a component above covers it. A plain `<div>` is fine for layout only.
- **`style` is for layout only** — margin, max-width, text-align, height. Never
  color, background, border, radius or font. Change appearance with
  `variant`, `color`, `theme` or `surface`.
- **Never write a hex color or a pixel radius.** If no prop gives the look,
  it is a gap in the package — say so rather than inlining it.
- **Button variants:** a color (`default`, `primary`, `secondary`,
  `tertiary`, `neutral`, `info`, `success`, `warning`, `error`,
  `black-white`) plus `-outline`, or `ghost` / `text`. Use `default` unless the
  design calls for another. There is no `-light`.
- **Color balance:** mostly one theme, one or two `Secondary` sections, and
  `Tertiary` only as accents (avatars, an icon) — never a Tertiary section.
- **Do not import components from `@mui/material`** — the package re-exports
  the ones it supports, themed.

## 7. When something is missing

Tag it where you would have used it, so it can be added to the package:

```jsx
// MISSING-LIB-COMPONENT: <Name>
// Needed for: <one line>
```
