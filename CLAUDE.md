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
Sets `--Background` which components use via `background: var(--Background)`.

---

## Provider Setup

The `DynoDesignProvider` must wrap your entire app. It injects CSS and sets the root attributes:

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
var(--Background)          /* resolves via data-surface — use this in components */
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
//          + '-outline' + '-light' variants | 'ghost' | 'text'
// size: 'small' | 'medium' | 'large'
<Button variant="primary" size="medium" startIcon={<AddIcon />}>
  Save Changes
</Button>
<Button variant="primary-outline">Cancel</Button>
<Button variant="primary-light">Secondary Action</Button>
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

---

## Rules for AI-Generated Code

### ✅ DO
```jsx
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
import { Button, Card, Alert } from './components';
```

### ❌ NEVER DO
```jsx
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
