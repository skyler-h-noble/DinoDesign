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
<div data-theme="Primary-Light">   // light teal context
<div data-theme="Neutral-Dark">    // dark grey context
<div data-theme="App-Bar">         // navigation bar context
<div data-theme="Success-Light">   // semantic success context
```

**Valid themes:**
- Light: `Default`, `Primary-Light`, `Primary`, `Secondary-Light`, `Secondary`, `Tertiary-Light`, `Tertiary`, `Neutral-Light`, `Neutral`
- Semantic light: `Error-Light`, `Success-Light`, `Warning-Light`, `Info-Light`
- Dark: `Primary-Dark`, `Secondary-Dark`, `Tertiary-Dark`, `Neutral-Dark`, `Error-Dark`, `Success-Dark`, `Warning-Dark`, `Info-Dark`
- Navigation: `App-Bar`, `Nav-Bar`, `Status`

### `data-style` — sets the shape language
```jsx
<div data-style="Professional">   // 4px border-radius
<div data-style="Modern">         // 8px border-radius
<div data-style="Bold">           // 16px border-radius
<div data-style="Playful">        // 40px border-radius
```
Set once on the root. Cascades to every component automatically.

### `data-surface` — sets background depth
```jsx
<div data-surface="Surface">           // base page background
<div data-surface="Surface-Dim">       // slightly recessed
<div data-surface="Surface-Bright">    // elevated (AppBar)
<div data-surface="Container">         // card background
<div data-surface="Container-Low">     // inset card
<div data-surface="Container-Lowest">  // inputs, deepest
<div data-surface="Container-High">    // modal, highest card
```

`data-surface` is the **only** way to change a region's background. Setting
it exposes the full set of paired tokens — `--Background`, `--Text`,
`--Quiet`, `--Header`, `--Border`, `--Border-Variant`, `--Hover`, `--Active`,
`--Hotlink`, and the per-palette `--Buttons-*-Border/Highlight/Lowlight`
overrides — all tuned for that surface's tone. Every nested component reads
those automatically.

```jsx
// ✅ Right — declare the surface, every nested token auto-resolves
<section data-theme="Primary-Light" data-surface="Surface">
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
<ThemedZone theme="Success-Light" surface="Surface">
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
var(--Header)              /* headings */
var(--Hotlink)             /* links */
```

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

### Typography
```css
var(--Set-Font-Family-Header)
var(--Set-Font-Family-Header-Weight)
var(--Set-Font-Family-Body)
var(--Set-Font-Family-Body-Weight)
var(--Set-Font-Family-Body-Semibold-Weight)
var(--Set-Font-Family-Body-Bold-Weight)
var(--Set-Font-Family-Decorative)
```

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

### Eyebrow vs Overline — one concept, two names

This trips people up, so read it before writing an eyebrow style. **Eyebrow is
the FACE and the COLOUR role; Overline is the TYPE STYLE.** The sizes are
published under Overline, everything else under Eyebrow:

```css
color:          var(--Eyebrow);                     /* per theme AND per surface */
font-family:    var(--Font-Family-Eyebrow);
font-weight:    var(--Font-Weight-Eyebrow);
font-size:      var(--Overline-Medium-Font-Size);   /* NOT --Eyebrow-Font-Size */
letter-spacing: var(--Overline-Medium-Letter-Spacing);
```

`--Eyebrow-Font-Size` and `--Eyebrow-Letter-Spacing` do not exist and never
have. Reaching for them fails silently — the declaration falls back to whatever
literal you wrote, so the text renders at the wrong size with no error.

Steps are `--Overline-{Small,Medium,Large}-*` at 12 / 13 / 15px, with tracking
loosening as the size drops.

`--Eyebrow` is not a muted `--Text`. It is a rotation off the surface's own
palette — Primary borrows Secondary, Secondary borrows Tertiary, Tertiary and
Neutral borrow Primary, and the state themes borrow black or white — so
substituting `--Quiet` throws the rotation away and paints every eyebrow the
same grey.

### Typography `color` prop — not `style={{ color }}`

All typography components (`H1`–`H6`, `Body`, `BodySmall`, `BodyLarge`,
`Caption`, `Overline`, `Label`, `Subtitle`) accept a `color` prop that maps
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
  Body, BodySmall, BodyLarge, Label, Caption, Overline,

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
<ThemedZone theme="Success-Light" surface="Surface">
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
<Section as="footer" theme="Neutral-Dark" surface="Surface">…</Section>
```

Use `<ThemedZone>` for the case where you want the attributes but NOT the
background paint (e.g., wrapping an `AppBar` whose own root paints itself).

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
<div data-theme="Success-Light" data-surface="Surface">

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
        <ThemedZone theme="Warning-Light" surface="Surface">
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