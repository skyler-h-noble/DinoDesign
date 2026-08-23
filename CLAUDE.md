# CLAUDE.md — DynoDesign Component Library

This file tells AI coding tools (Claude Code, Cursor, Copilot, etc.) exactly how to use this design system correctly. Read this before generating any UI code.

---

## What This Is

A React component library where **all visual styling comes from CSS tokens**, not hardcoded values. Colors, spacing, border radius, shadows, and typography are all resolved at runtime from CSS custom properties set by `data-theme`, `data-style`, and `data-surface` attributes.

**Never write inline hex colors. Never hardcode border-radius. Never use MUI's `sx` prop for colors. Always use token variables.**

---

## Project Structure

```
my-project/
├── public/styles/
│   ├── foundation.css   ← primitives, spacing, reset (loads 1st)
│   ├── core.css         ← component base styles (loads 2nd)
│   ├── Light-Mode.css   ← light color tokens + [data-theme] selectors (loads 3rd)
│   ├── Dark-Mode.css    ← dark color tokens + [data-theme] selectors (loads 3rd, swaps with light)
│   ├── base.css         ← data-style, data-surface rules (loads 4th)
│   └── styles.css       ← overrides (loads last)
└── src/
    ├── DynoDesignProvider.js   ← CSS injector + context + hook
    ├── App.js
    ├── index.js
    └── components/             ← 49 components, all token-driven
```

---

## The Three Attributes — Learn These First

Every component's visual output is driven by three HTML attributes on ancestor elements:

### `data-theme` — sets the color context
```jsx
<div data-theme="Primary">                                  // primary context
<div data-theme="Neutral" data-surface="Surface-Dimmest">   // black context
<div data-theme="App-Bar">                                  // navigation bar
<div data-theme="Success">                                  // semantic success
```

**Valid themes — there are nine:**

`Default` · `Primary` · `Secondary` · `Tertiary` · `Neutral` · `Info` ·
`Success` · `Warning` · `Error`

Plus three a component sets for itself rather than something you choose:
`App-Bar`, `Nav-Bar`, `Status`.

**That is the whole list.** Lightness and darkness are NOT themes — they are
the surface axis. These do not exist and resolve to nothing:

| you might reach for | write this instead |
| --- | --- |
| `data-theme="White"` | `data-theme="Neutral" data-surface="Surface-Brightest"` |
| `data-theme="Black"` | `data-theme="Neutral" data-surface="Surface-Dimmest"` |
| `data-theme="Primary-Light"` | `data-theme="Primary" data-surface="Surface-Brightest"` |
| `data-theme="Primary-Dark"` | `data-theme="Primary" data-surface="Surface-Dimmest"` |
| any `*-Light` / `*-Dark` | the theme, plus a bright or dim surface |

A `data-theme` with no matching block paints nothing and reports nothing —
the element simply inherits whatever surrounded it. Nothing errors, so this
is worth getting right the first time.

### `data-style` — sets the shape language
```jsx
<div data-style="Professional">   // 4px border-radius
<div data-style="Modern">         // 8px border-radius
<div data-style="Bold">           // 16px border-radius
<div data-style="Playful">        // 40px border-radius
```
Set once on the root. Cascades to every component automatically.

### `data-surface` — sets background depth AND lightness

Five page surfaces, darkest to brightest:

```jsx
<div data-surface="Surface-Dimmest">   // darkest — black under Neutral
<div data-surface="Surface-Dim">       // slightly recessed
<div data-surface="Surface">           // base page background
<div data-surface="Surface-Bright">    // elevated (AppBar)
<div data-surface="Surface-Brightest"> // brightest — white under Neutral
```

Five container levels for things that sit ON a surface:

```jsx
<div data-surface="Container-Lowest">  // inputs, deepest
<div data-surface="Container-Low">     // inset card
<div data-surface="Container">         // card background
<div data-surface="Container-High">    // modal, highest card
<div data-surface="Container-Highest">
```

This axis is where light and dark live. `Neutral` + `Surface-Dimmest` is a
pure-black region with white text; `Neutral` + `Surface-Brightest` is the
white one.

`data-surface` is the **only** way to change a region's background. Setting
it exposes the full set of paired tokens — `--Background`, `--Text`,
`--Quiet`, `--Header`, `--Border`, `--Border-Variant`, `--Hover`, `--Active`,
`--Hotlink`, and the per-palette `--Buttons-*-Border/Highlight/Lowlight`
overrides — all tuned for that surface's tone. Every nested component reads
those automatically.

```jsx
// ✅ Right — declare the surface, every nested token auto-resolves
<section data-theme="Primary" data-surface="Surface-Bright">
  <H2>Title</H2>           {/* gets --Header */}
  <Body>Body copy</Body>   {/* gets --Text */}
  <Button variant="primary">Save</Button>  {/* gets --Buttons-Primary-* */}
</section>
```

```jsx
// ❌ Wrong — paints the box but leaves text/border/quiet on the parent's
// tone, so contrast breaks the moment the surface flips dark or moves to a
// different Color-N. Never write these:
<div style={{ background: 'var(--Surface)' }}>
<div style={{ background: 'var(--Container)' }}>
<div style={{ background: 'var(--Surface-Dim)' }}>
<div style={{ background: 'var(--Primary-Color-11)' }}>
<div style={{ background: '#f0ebe0' }}>
```

Components that need to paint a background read `var(--Background)` (which
`data-surface` resolves for them). User code does **not** write
`var(--Background)` either — it sets `data-surface` on the element and lets
the cascade do the rest.

---

## MUI Integration

`@dynodesign/components` is built on MUI. The `DynoDesignProvider` handles all MUI `ThemeProvider` wiring internally — **you never configure MUI directly**. DynoDesign's CSS custom properties drive all visual values; MUI is purely structural.

**MUI peer dependencies must be installed in the consuming app:**
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

**Never use MUI's theming system to set colors — always use DynoDesign tokens:**
```jsx
// ✅ Correct — token-driven
style={{ background: 'var(--Buttons-Primary-Button)', color: 'var(--Buttons-Primary-Text)' }}

// ❌ Wrong — bypasses the token system
sx={{ bgcolor: 'primary.main', color: 'white' }}
```

---

## Provider Setup

The `DynoDesignProvider` must wrap your entire app. It injects CSS, configures MUI ThemeProvider, and sets the root attributes:

```jsx
// src/App.js
import { DynoDesignProvider } from './DynoDesignProvider';

function App({ foundationCSS, coreCSS, lightModeCSS, darkModeCSS, baseCSS, stylesCSS }) {
  return (
    <DynoDesignProvider
      foundationCSS={foundationCSS}
      coreCSS={coreCSS}
      lightModeCSS={lightModeCSS}
      darkModeCSS={darkModeCSS}
      baseCSS={baseCSS}
      stylesCSS={stylesCSS}
      defaultTheme="Default"
      defaultSurface="Surface"
      defaultStyle="Modern"
    >
      {/* your app */}
    </DynoDesignProvider>
  );
}
```

### Accessing theme state in any child component:
```jsx
import { useDynoDesign } from './DynoDesignProvider';

function MyComponent() {
  const { theme, style, isDark, toggleDarkMode, setTheme, setStyle } = useDynoDesign();
  // ...
}
```

### Themed sub-zones (AppBar, alerts, nav):
```jsx
import { ThemedZone, Surfaced } from './DynoDesignProvider';

// AppBar gets its own dark themed zone
<ThemedZone theme="App-Bar" surface="Surface-Bright" as="header">
  <AppBar />
</ThemedZone>

// Semantic alert zones
<ThemedZone theme="Success" surface="Surface-Bright">
  <Alert />
</ThemedZone>

// Card at a specific depth — no theme change, just surface
<Surfaced surface="Container">
  <Card />
</Surfaced>
```

---

## Token Reference — Use These, Not Hex Values

### Background & Surface
```css
var(--Background)          /* what data-surface resolves to. Components read this.
                              User code: prefer setting data-surface on the
                              element instead of writing background here. */

/* Source vars — DO NOT write these in styles. They exist so the cascade can
   resolve --Background. Setting data-surface="Surface" exposes --Surface as
   --Background; data-surface="Container" exposes --Container; etc. */
var(--Surface)
var(--Surface-Dim)
var(--Surface-Bright)
var(--Container)
var(--Container-Low)
var(--Container-Lowest)    /* inputs live here */
var(--Container-High)      /* modals live here */
```

### Text
```css
var(--Text)                /* primary body text */
var(--Text-Quiet)          /* secondary / muted text */
var(--Header)              /* Display and H1-H3 only - see below */
var(--Hotlink)             /* links */
```

`--Header` is a DISPLAY role, not a heading role. `<DisplayLarge>`,
`<DisplaySmall>` and `<H1>`-`<H3>` default to it; `<H4>`-`<H6>` default to
`--Text`. At H4 and below the type is body-sized and usually sits inline with
body copy, so a second tone reads as an inconsistency rather than as another
level of hierarchy. Both defaults are applied by the component - don't pass a
`color` prop to restate either one.

### Borders & States
```css
var(--Border)
var(--Border-Variant)      /* subtle borders */
var(--Hover)               /* hover overlay */
var(--Active)              /* pressed state overlay */
var(--Focus-Visible)       /* keyboard focus ring */
```

### Buttons — 9 color families
```css
/* Replace {Color} with: Primary | Secondary | Tertiary | Neutral |
                          Info | Success | Warning | Error | Default  */
var(--Buttons-{Color}-Button)   /* fill color */
var(--Buttons-{Color}-Text)     /* label color */
var(--Buttons-{Color}-Border)   /* border + thumb color */
var(--Buttons-{Color}-Hover)    /* hover fill */
var(--Buttons-{Color}-Active)   /* pressed fill */

/* Light variants */
var(--Buttons-{Color}-Light-Button)
var(--Buttons-{Color}-Light-Text)
var(--Buttons-{Color}-Light-Hover)
var(--Buttons-{Color}-Light-Active)
```

### Icons
```css
/* Replace {Family} with: Default | Primary | Secondary | Tertiary |
                           Neutral | Info | Success | Warning | Error */
var(--Icons-{Family})            /* icon fill */
var(--Icons-{Family}-Variant)    /* two-tone secondary fill */
```

### Style & Shape
```css
var(--Style-Border-Radius)       /* set by data-style — use everywhere */
var(--Shadow-1)                  /* subtle shadow */
var(--Shadow-2)                  /* elevated shadow */
var(--Style-Gradient-Color-1)
var(--Style-Gradient-Color-2)
var(--Style-Gradient-Angle)
```

### Typography — the four faces

A design system publishes four faces, not two. Each has a `--Set-Font-Family-*`
input and a `--Font-Family-*` token that components actually read:

```css
/* What components read */
var(--Font-Family-Display)   /* the expressive face — display-large/medium/small */
var(--Font-Family-Header)    /* h1–h6, and the only face carrying variable axes */
var(--Font-Family-Eyebrow)   /* eyebrow labels; defaults to the OS UI stack */
var(--Font-Family-Body)      /* everything else */

/* Per-face weights */
var(--Font-Weight-Display)
var(--Font-Weight-Header)
var(--Font-Weight-Eyebrow)
var(--Font-Weight-Body)

/* The generator's inputs — you set these, you don't read them */
var(--Set-Font-Family-Header)
var(--Set-Font-Family-Header-Weight)
var(--Set-Font-Family-Display)
var(--Set-Font-Family-Eyebrow)
var(--Set-Font-Family-Body)
var(--Set-Font-Family-Body-Weight)
var(--Set-Font-Family-Body-Semibold-Weight)
var(--Set-Font-Family-Body-Bold-Weight)
var(--Set-Font-Family-Decorative)   /* legacy alias of the Display face */
```

Every step of every ramp also publishes its own `--{Style}-Font-Family` and
`--{Style}-Text-Transform`, so a single style can be re-pointed without moving
the whole face.

### Body has two weights — Subtitle is the bold one

The Body ramp publishes exactly two weights at each size, and no bold:

```css
--Body-{Small,Medium,Large}-Font-Weight            /* standard — var(--Font-Weight-Body) */
--Body-{Small,Medium,Large}-Semibold-Font-Weight   /* 600 */
```

**For bold at body sizes, use Subtitle.** It is Body at 700 — same face, same
sizes, same line height, same letter-spacing — so a third weight on Body would
publish the same three styles under two names:

| You want | Use | Reads |
| --- | --- | --- |
| body, normal | `<Body>` | `--Body-Medium-Font-Weight` |
| body, semibold | `<Typography variant="body-semibold">` | `--Body-Medium-Semibold-Font-Weight` |
| body, **bold** | `<Subtitle>` | `--Subtitle-Medium-Font-Weight` (700) |
| bold, one step down | `<Typography variant="subtitle-small">` | `--Subtitle-Small-Font-Weight` |
| bold, one step up | `<SubtitleLarge>` | `--Subtitle-Large-Font-Weight` |

Three things that bite when you make that swap:

**Subtitle defaults to `--Header`, Body defaults to `--Text`.** Swapping `<Body>`
for `<Subtitle>` to gain weight also changes the colour. Pass
`color="standard"` to keep `--Text`.

**`variant="body-bold"` is an alias, not a bold.** The `-bold` body keys still
resolve so old markup doesn't break, but they land on the *semibold* style. If
you asked for `body-large-bold` and got 600, that is why — reach for Subtitle.

**`--Body-Bold-Font-Weight` (700) exists, but it is not a type style.** It is a
face-level weight for bolding body-face text outside the ramp (`Link` uses it).
Don't build a Body-Bold ramp out of it — the sizes and leading that make
Subtitle a real style aren't there.

`SubtitleLarge` and `Subtitle` (the medium step) are named exports;
`subtitle-small` is reachable only through `<Typography variant>`.

### Variable-font axes — Header only

When the Header face is a variable font (e.g. Google Sans Flex), the system
publishes its axes as tokens and composes them into one value:

```css
var(--Font-Width-Header)          /* wdth */
var(--Font-Optical-Size-Header)   /* opsz */
var(--Font-Slant-Header)          /* slnt — negative leans right */
var(--Font-Grade-Header)          /* GRAD */
var(--Font-Roundness-Header)      /* ROND — 100 is fully rounded */

var(--Font-Variation-Header)      /* the composed font-variation-settings value */
```

`H1`–`H6` apply `--Font-Variation-Header` themselves. If you hand-roll a
heading, set `font-variation-settings: var(--Font-Variation-Header)` — reaching
for the individual axis tokens one at a time just re-derives it.

**`wght` is deliberately absent from the composed value.** `font-weight`
already carries it, and declaring the weight in both places lets the two
disagree. Set weight with `font-weight` / `--Font-Weight-Header`.

Display, Eyebrow, and Body have no axis tokens — only the Header face does.

### Page setup — the system styles NO bare elements

Loading the CSS changes nothing on its own. There is no `body`, `html`, `p`,
`h1` or `*` rule in any of the six files — only custom properties and opt-in
`.typography-*` classes. That is deliberate: a design system that restyled
`body` just by being imported would change a page nobody asked it to change.

So set the page defaults yourself, once:

```css
body {
  font-family: var(--Font-Family-Body);
  font-size:   var(--Body-Medium-Font-Size);
  font-weight: var(--Font-Weight-Body);
  line-height: var(--Body-Medium-Line-Height);
}
```

Colour is separate. `--Text` and `--Background` are only defined under
`[data-theme]`, so a bare `body` cannot resolve them — either theme the body
(`<body data-theme="Default" data-surface="Surface">`) or leave colour to the
themed regions inside it. Type tokens have no such requirement; they resolve at
`:root`.

The alternative to a `body` rule is `class="typography-body"` on the elements
that want it — same tokens, explicit rather than global.

**`data-platform` is OPTIONAL.** `core.css` defines every `--Font-Family-*` at
`:root`, so text resolves without it. `typography-tokens.css` additionally
publishes per-platform ramps under `[data-platform="Desktop"|"IOS-Mobile"|
"IOS-Tablet"|"Android"]`; set the attribute only when you want a platform's
ramp instead of the default. Text rendering with the wrong family is almost
never a missing `data-platform` — check that `core.css` is loaded first.

### Eyebrow — the style formerly called Overline

The component is `<Eyebrow>` (`textStyle="eyebrow"`), in three steps:
`eyebrow-small` / `eyebrow` / `eyebrow-large`. `<Overline>` and
`textStyle="overline"` still resolve to it, so existing code keeps working, but
Eyebrow is the name to write.

The rename now reaches the size tokens too, so an eyebrow is spelled one way
in every property:

```css
color:          var(--Eyebrow);                     /* per theme AND per surface */
font-family:    var(--Font-Family-Eyebrow);
font-weight:    var(--Font-Weight-Eyebrow);
font-size:      var(--Eyebrow-Medium-Font-Size);   /* NOT --Eyebrow-Font-Size */
letter-spacing: var(--Eyebrow-Medium-Letter-Spacing);
```

`--Eyebrow-Font-Size` and `--Eyebrow-Letter-Spacing` — with no step — do not
exist and never have. Sizes are per STEP. Reaching for the bare name fails
silently: the declaration falls back to whatever literal you wrote, so the text
renders at the wrong size with no error.

Steps are `--Eyebrow-{Small,Medium,Large}-*` at 12 / 13 / 15px, with tracking
loosening as the size drops. Use `<Eyebrow>` and the tokens resolve themselves;
the token names only matter when you hand-roll one.

`--Overline-{Small,Medium,Large}-*` is still emitted as an alias pointing at
the Eyebrow token, because a design system's CSS is frozen once published and
consumers upgrade the lib on their own schedule. Read the Eyebrow name; the
components already fall back to the Overline one for systems generated before
the rename.

`--Eyebrow` is not a muted `--Text`. It is a rotation off the surface's own
palette — Primary borrows Secondary, Secondary borrows Tertiary, Tertiary and
Neutral borrow Primary, and the state themes borrow black or white — so
substituting `--Quiet` throws the rotation away and paints every eyebrow the
same grey.

### Cap-height trim — Figma's "cap height to baseline"

Figma's vertical-trim setting has a CSS equivalent, and the lib ships it as
`CAP_HEIGHT_TRIM`:

```jsx
import { CAP_HEIGHT_TRIM } from './components';

<Box sx={{ paddingTop: '2px', ...CAP_HEIGHT_TRIM }}>LABEL</Box>
```

It cuts the text box to the cap height on top and the alphabetic baseline
underneath, so a label centres on its letterforms instead of on the font's
line box — which carries ascender and descender space that a button label or
an avatar's initials never use. `Button` and `Avatar` apply it already.

It is progressive enhancement: the rules sit inside
`@supports (text-box-edge: cap alphabetic)`, so a browser without `text-box`
renders exactly as it did before. That is why any optical padding you use to
fake the same effect goes OUTSIDE the spread — the block zeroes the padding
itself wherever the real trim applies.

Don't hand-write `text-box-trim` / `text-box-edge` in a component; spread the
constant so every trimmed surface trims to the same two edges.

### Avatar initials wear the Eyebrow style

`Avatar` renders its initials in the Eyebrow face, weight and tracking — not
Legal or Number. The eyebrow ramp is three steps and the avatar ramp is eight,
so the step picked per size sets weight and tracking only; the size comes from
the avatar's own map. The eyebrow's trailing letter-spacing is cancelled with a
negative `margin-inline-end`, without which the initials sit visibly left of
centre in the circle.

### Typography `color` prop — not `style={{ color }}`

All typography components (`H1`–`H6`, `DisplayLarge`/`DisplayMedium`/
`DisplaySmall`, `Body`, `BodySmall`, `BodyLarge`, `Caption`, `Eyebrow`,
`Label`, `Subtitle`) accept a `color` prop that maps
to the right brand token. **Do not write `style={{ color: 'var(--Text-…)' }}`
on typography** — set the prop instead:

```jsx
<Body color="quiet">…</Body>        // var(--Text-Quiet)
<Body color="primary">…</Body>      // var(--Text-Primary)
<Body color="secondary">…</Body>    // var(--Text-Secondary)
<Body color="success">…</Body>      // semantic tokens
```

Available values: `standard` (default), `quiet`, `primary`, `secondary`,
`tertiary`, `neutral`, `info`, `success`, `warning`, `error`. Same list for
headings.

---

## Component Imports

All 49 components import from `./components` (or `@dynodesign/components` if installed as a package):

```jsx
import {
  // Typography
  Typography, H1, H2, H3, H4, H5, H6,
  DisplayLarge, DisplayMedium, DisplaySmall,
  Body, BodySmall, BodyLarge, BodySemibold, Label, Caption,
  Subtitle, SubtitleSmall, SubtitleLarge,
  Eyebrow, EyebrowSmall, EyebrowLarge,   // Overline* still exports as an alias
  CAP_HEIGHT_TRIM,                       // sx spread — cap-height/baseline trim

  // Buttons
  Button, ButtonGroup, ButtonIcon, Fab, Rail, Toolbar,
  ToggleButton, ToggleButtonGroup, NumberField,

  // Inputs
  TextField, TextInput, Select, Autocomplete,
  Checkbox, RadioGroup, SwitchInput, SliderInput,
  RatingInput, SearchField,

  // Chips
  Chip,

  // Layout
  Stack, HStack, VStack, Box, Container, Grid,

  // Navigation
  Tabs, TabList, Tab, TabPanel,
  Breadcrumbs, Pagination, Dropdown, Menu, MenuItem,
  BottomNavigation, Stepper, SpeedDial,

  // Surfaces
  Card, Paper,

  // Dialogs
  Dialog, Modal, Drawer,

  // Feedback
  Alert, Snackbar, CircularProgress, LinearProgress,

  // Data Display
  Avatar, AvatarGroup, Badge, Divider, List, Table, Tooltip,

  // App Structure
  AppBar, Header, Footer, Sidebar, MainLayout, Accordion,

  // Utilities
  Link, Skeleton, Backdrop,
} from './components';
```

---

## Component Prop Patterns

### Button
```jsx
// variant: 'primary' | 'secondary' | 'tertiary' | 'neutral' |
//          'info' | 'success' | 'warning' | 'error' |
//          'black-white' |
//          + '-outline' + '-light' variants | 'ghost' | 'text'
//          ('black-white' has solid + outline only — see below)
// size: 'small' | 'medium' | 'large'
<Button variant="primary" size="medium" startIcon={<AddIcon />}>
  Save Changes
</Button>
<Button variant="primary-outline">Cancel</Button>
<Button variant="primary-light">Secondary Action</Button>

// black-white resolves itself against whatever it is placed on: black on a
// light surface, white on a dark one, with a label that always clears 4.5:1.
// Works on every theme and surface with no prop change.
<Button variant="black-white">Works anywhere</Button>
<Button variant="black-white-outline">Also anywhere</Button>
// No 'black-white-light': that variant reads --<Color>-Color-11, and
// black-white is a resolved pair rather than a palette, so it has no tones.
```

### ButtonGroup
```jsx
// Purely presentational — visually groups Buttons (shared border, spacing).
// Does NOT manage selection. Each child Button owns its own onClick + variant.
// Props: variant, size, disabled, orientation, spacing, fullWidth
//   (variant/size on the group are inherited as defaults by children)
//
// For a segmented selector, drive the selected state in the parent and
// flip each child's variant between solid and -outline:
<ButtonGroup variant="primary" size="small">
  <Button
    variant={mode === 'light' ? 'primary' : 'primary-outline'}
    onClick={() => setMode('light')}
  >Light</Button>
  <Button
    variant={mode === 'dark' ? 'primary' : 'primary-outline'}
    onClick={() => setMode('dark')}
  >Dark</Button>
</ButtonGroup>

// ❌ Do NOT pass `value` / `onChange` to ButtonGroup — it has no controlled
//    selection API. Use ToggleButtonGroup if you want managed selection.
```

### Card
```jsx
// Always sets data-surface="Container" internally
// variant: 'default' | 'solid' | 'light'
<Card variant="default" color="primary">
  <CardContent>...</CardContent>
  <CardActions>...</CardActions>
</Card>
```

### Alert
```jsx
// variant: 'standard' | 'outline' | 'light' | 'solid'
// color: 8 brand colors
// Wrap in ThemedZone for semantic coloring:
<ThemedZone theme="Success" surface="Surface-Bright">
  <Alert variant="light" color="success">
    Operation completed successfully.
  </Alert>
</ThemedZone>
```

### Switch
```jsx
// variant: '{color}' | '{color}-outline' | '{color}-light'
// size: 'small' | 'medium' | 'large'
<SwitchInput variant="primary" label="Enable notifications" />
```

### TextField / Input
```jsx
// data-surface="Container-Lowest" set internally
<TextField
  label="Email"
  variant="primary-outline"
  size="medium"
  validation="error"
  validationMessage="Invalid email address"
/>
```

### AppBar
```jsx
// Always wrap in ThemedZone — AppBar has its own themed zone
<ThemedZone theme="App-Bar" surface="Surface-Bright" as="header">
  <AppBar
    mode="desktop"
    barColor="default"
    companyName="My App"
    navLinks={['Home', 'About', 'Contact']}
  />
</ThemedZone>
```

### Section — paint a region with the design system
```jsx
// Section bundles data-theme + data-surface + background paint into one
// component. Use it for page sections, footers, hero, sticky-nav wrappers.
<Section theme="Primary" surface="Surface" padding="80px 24px">
  <H2>…</H2>
</Section>

// Inherit surface from parent (no theme switch):
<Section padding="48px 24px">…</Section>

// Render as a different element:
<Section as="footer" theme="Neutral" surface="Surface-Dimmest">…</Section>
```

Use `<ThemedZone>` for the case where you want the attributes but NOT the
background paint (e.g., wrapping an `AppBar` whose own root paints itself).

## The 60/30/10 pass — do this on any page you render

A page built entirely from `data-theme="Primary"` is *correct* and looks
monotonous. The system gives you three brand palettes and most generated pages
use one. So after the markup is right, do a second pass for colour BALANCE:

| share | role | where it lives |
| --- | --- | --- |
| ~60% | Primary | the dominant sections, the default surface |
| ~30% | Secondary | one or two whole sections, switched by `data-theme` |
| ~10% | Tertiary | accents only — avatars, a left border, a single stat block |

The ratio is of VISUAL AREA, not of element count. One full-bleed Secondary
section outweighs twenty Tertiary avatars, which is the point: Tertiary is a
seasoning and should never be a section background.

### How to scan a rendered page

Read it as blocks of area, top to bottom, and count what each one paints:

1. List every region that sets `data-theme` (or `<Section theme=…>`) and note
   its rough height. That is the 60/30 split, and it is the only part that
   moves the ratio much.
2. If everything is one theme, convert ONE mid-page section to Secondary.
   Prefer a section that is already conceptually a break — testimonials, stats,
   a pricing band — over splitting a continuous narrative.
3. Then place Tertiary in the small stuff, using the two moves below.

Do not chase exact percentages. 60/30/10 is a target, and anything in the
region of "mostly one, a clear second, a glint of a third" reads correctly.

### Tertiary move 1 — avatars

Avatars are the highest-value Tertiary slot on most pages: they repeat, they
are small, and they are already visually separate from the text around them.

```jsx
<Avatar initials={initials(name)} alt={name} color="tertiary" />
```

Pass `color`, don't restyle. The component owns its size, shape and contrast,
and the initials wear the Eyebrow style (see *Avatar initials wear the Eyebrow
style* above).

### Tertiary move 2 — a left border on NON-CLICKABLE cards

A card that the user can click already earns its emphasis from hover: it lifts,
it shadows, its border brightens. Adding a colour bar to it competes with that
and reads as a second affordance.

A card that is purely informational has no such signal, so it is the right
place for a Tertiary edge:

```css
.stat {
  background: var(--Container);
  border: 1px solid var(--Border-Variant);
  /* Declared AFTER the shorthand so it only replaces the left edge. */
  border-left: 4px solid var(--Tertiary-Color-8);
  border-radius: var(--Card-Radius);
}
```

Two things that are easy to get wrong:

**Order matters.** `border-left` must come after the `border` shorthand or the
shorthand overwrites it and the accent silently disappears.

**Clickable cards get nothing.** If the card has an `onClick`, an `<a>` wrapper,
or a hover transform, leave its border alone.

### Which cards get the accent — the standalone ones

Do not put a left border on every card in a grid. Repeating it across a
uniform set turns a 10% accent into a 30% one and flattens the hierarchy the
border was meant to create.

Apply it to cards that are already different from their neighbours:

- a lone card that isn't part of a set
- a summary or total that sits apart from the rows above it
- the one card in a group that differs in kind (a callout among plain items)

If every card in a region would qualify, that region does not need the accent —
switch the whole region's `data-theme` instead and let the surface carry it.

### What NOT to reach for

- **Do not** paint a section `data-theme="Tertiary"` to hit the 10%. That makes
  it 30%+ and there is no palette left for accents.
- **Do not** use `color="tertiary"` on body text to add colour. Text carries a
  4.5:1 requirement and a recoloured paragraph reads as a link.
- **Do not** hand-write a hex to "balance" a page. Every share of the ratio is
  an existing token; if the colour you want isn't one, the ratio is not the
  problem.

### Footer & Copyright
```jsx
// Footer = configurable 1–4 column footer with optional social row +
// subscribe area + auto Copyright strip. First column is always the
// company address / contact.
<Footer
  brand={<Logo />}
  address={{
    company: 'My Company',
    lines: ['123 Main St', 'San Francisco, CA'],
    email: 'hi@example.com',
    phone: '+1 555 555 5555',
  }}
  columns={[                             // up to 3 more columns
    { title: 'Product', links: [{ label: 'Features', href: '/features' }] },
    { title: 'Company', links: [{ label: 'About', href: '/about' }] },
  ]}
  socialLinks={[                         // optional
    { icon: <TwitterIcon />, url: 'https://twitter.com/x', label: 'Twitter' },
  ]}
  subscribe={{                           // optional
    title: 'Stay in the loop',
    onSubscribe: (email) => api.subscribe(email),
  }}
  copyrightName="My Company"
/>

// Copyright = standalone copyright strip (used internally by Footer too).
<Copyright companyName="My Company" year={2026} />
```

Footer/Copyright are hardcoded to `--Primary-Color-2` body / `--Primary-
Color-1` copyright strip for now. Long term they'll auto-derive from the
user's chosen background tone.

---

## Flagging Missing Components

The library has gaps. If a piece of UI you need isn't already in the import
list above — don't invent it inline. Surface it so it can be added to the
library for every consumer.

Use this exact comment format above the spot where the missing piece would
live (the literal `MISSING-LIB-COMPONENT` tag is greppable, so reviews and the
`/ScanComponents` slash command can find it):

```tsx
// MISSING-LIB-COMPONENT: <ComponentName>
// Needed for: <one line on the use case>
// Proposed API: <props sketch>
// Lib-track: open an issue / PR against @dynodesign/components
```

Then either:

- **Trivial, one-off**: inline a minimal implementation under the tag so the
  feature isn't blocked.
- **Reusable** (used in 2+ places, has its own state, portals, or needs
  keyboard a11y): stop and tell the user. Confirm whether to add it to the
  lib first, or inline with a tracked follow-up.

After tagging and implementing (either path), **ask the user** if they want
to share the component back with DynoDesign for review:

> "I've tagged `<ComponentName>` as a missing lib component. Want me to
> submit a proposal to the DynoDesign admin dashboard for review? If they
> accept it, your inline copy can be replaced in a future package update."

If the user says yes, run `/ShareComponent <ComponentName>` (see below). If
no, leave the tag in place — the next contributor or a future
`/ScanComponents` pass will surface it again.

### Scanning for outstanding gaps

Two Claude Code slash commands ship with this package:

- `/ScanComponents` — runs `grep -rn "MISSING-LIB-COMPONENT" src/` and groups
  the results by file, so you can see what's been tagged across the codebase
  at a glance.
- `/ShareComponent [Name]` — generates a submission package (proposed API +
  inline implementation + source pointer) for a tagged component, asks the
  user to confirm, then POSTs it to the DynoDesign admin dashboard for
  review.

To install them in your project after `npm install @dynodesign/components`:

```bash
mkdir -p .claude/commands
cp node_modules/@dynodesign/components/.claude/commands/*.md \
  .claude/commands/
```

Then restart Claude Code and type `/ScanComponents` or `/ShareComponent`.
(The same scan works from a plain shell without Claude Code:
`grep -rn "MISSING-LIB-COMPONENT" src/`.)

Empty `/ScanComponents` result → codebase is fully covered. Matches → those
are the components the library still needs to grow.

---

## Rules for AI-Generated Code

### ✅ DO
```jsx
// Always use DynoDesign components for layout and interaction — never raw HTML
<HStack spacing={2}>            // instead of <div style={{ display: 'flex', gap: 16 }}>
<Button variant="outline" color="default">  // instead of <button style={{ border: '1px solid var(--Border)' }}>
<Body>                          // instead of <p> or <span>
<BodySmall>                     // instead of <span style={{ fontSize: 14 }}>
<Caption>                       // instead of <small> or <span style={{ fontSize: 12 }}>
<H2>                            // instead of <h2>

// Use token variables for all colors
style={{ background: 'var(--Buttons-Primary-Button)', color: 'var(--Buttons-Primary-Text)' }}

// Use data-theme for color context zones
<div data-theme="Success" data-surface="Surface-Bright">

// After the markup is right, run the 60/30/10 pass — a page built entirely
// from one palette is correct and monotonous. See "The 60/30/10 pass" above.
<Section theme="Secondary" surface="Surface">    // one section carries the 30
<Avatar initials="LN" color="tertiary" />        // accents carry the 10
style={{ borderLeft: '4px solid var(--Tertiary-Color-8)' }}  // non-clickable cards only

// Use data-surface for background depth
<div data-surface="Container">

// Use var(--Style-Border-Radius) for all border radius
style={{ borderRadius: 'var(--Style-Border-Radius)' }}

// Use var(--Background) as the background in components
style={{ background: 'var(--Background)' }}

// Import components from the library
import { Button, Card, Alert, H2, Body, HStack } from './components';
```

### ❌ NEVER DO
```jsx
// Never use raw HTML elements when a DynoDesign component exists
<button style={...}>                    // ← use <Button>
<div style={{ display: 'flex' }}>       // ← use <HStack> or <VStack>
<span style={{ fontSize: 14 }}>        // ← use <BodySmall>, <Label>, <Caption>
<p>                                     // ← use <Body>
<h2>                                    // ← use <H2>

// Never override a component's colors with style — change the variant instead
<Button style={{ background: '...', color: '...' }}>   // ← use variant="primary"
<H2 style={{ color: '...' }}>                          // ← H2 sets --Header itself
<Body style={{ color: 'var(--Quiet)' }}>               // ← use quiet variant or <Caption>
<Card style={{ background: 'var(--Container-High)' }}> // ← Card sets data-surface itself

// Never paint a background with a surface var directly — use data-surface
style={{ background: 'var(--Surface)' }}      // ← <div data-surface="Surface">
style={{ background: 'var(--Container)' }}    // ← <div data-surface="Container">
style={{ background: 'var(--Surface-Dim)' }}  // ← <div data-surface="Surface-Dim">

// Never hardcode hex colors
style={{ background: '#006b5a', color: '#ffffff' }}

// Never hardcode border-radius
style={{ borderRadius: '8px' }}

// Never use MUI sx prop for colors
sx={{ bgcolor: 'primary.main', color: 'white' }}

// Never use Tailwind color classes
className="bg-teal-600 text-white"

// Never import MUI components directly without wrapping in DynoDesign tokens
import Button from '@mui/material/Button'; // ← bypasses the token system
```

---

## Correct Page Structure

```jsx
function MyPage() {
  return (
    // Root: set by DynoDesignProvider — don't add data-theme here again
    <main data-surface="Surface-Dim" style={{ minHeight: '100vh' }}>

      {/* AppBar always gets its own themed zone */}
      <ThemedZone theme="App-Bar" surface="Surface-Bright" as="header">
        <AppBar mode="desktop" companyName="My App" />
      </ThemedZone>

      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Cards use Container surface */}
        <Surfaced surface="Container">
          <Card>
            <CardContent>
              <H2>Page Title</H2>
              <Body>Content goes here.</Body>
            </CardContent>
            <CardActions>
              <Button variant="primary">Save</Button>
              <Button variant="primary-outline">Cancel</Button>
            </CardActions>
          </Card>
        </Surfaced>

        {/* Semantic alert zones */}
        <ThemedZone theme="Warning" surface="Surface-Bright">
          <Alert variant="light" color="warning">
            Please review before continuing.
          </Alert>
        </ThemedZone>

      </div>
    </main>
  );
}
```

---

## Dark Mode

```jsx
// Toggle dark mode from any component inside the Provider
const { isDark, toggleDarkMode } = useDynoDesign();

<button onClick={toggleDarkMode}>
  {isDark ? 'Switch to Light' : 'Switch to Dark'}
</button>
```

Dark mode swaps `Light-Mode.css` for `Dark-Mode.css` — all token values update automatically. No component code changes needed.

---

## CSS Load Order (do not change)

```
1. foundation.css   — primitives
2. core.css         — component base styles
3. Light-Mode.css   — OR Dark-Mode.css (never both)
4. base.css         — data-style / data-surface rules
5. styles.css       — final overrides
```

The `DynoDesignProvider` manages this automatically. Do not add `<link>` tags for these files in `index.html` — the Provider handles injection.

---

*Repo: https://github.com/skyler-h-noble/DinoDesign*