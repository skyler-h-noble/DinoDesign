# Dyno Design System — Token System

## Overview

The Dyno token system is a layered CSS variable cascade that maps raw color values
through semantic tokens to component-ready variables. Every visual property a
component uses is a CSS variable — no hardcoded values anywhere in the component
library. This means swapping a brand only requires replacing the token CSS files;
component code never changes.

---

## The Four-Layer Cascade

```
Layer 1: base.css          — raw primitives (colors, spacing, typography)
Layer 2: light-mode.css    — maps primitives → semantic tokens  (light)
         dark-mode.css     — maps primitives → semantic tokens  (dark)
Layer 3: themes.css        — maps semantic tokens → surface/component variables
                             via [data-theme] + [data-surface] selectors
Layer 4: Component          — reads final CSS variables at render time
```

Each layer builds on the previous. Only Layer 2 (the mode file) is swapped at
runtime when the user toggles dark mode. Everything else is static.

---

## Layer 1 — Primitives (base.css)

Raw color scales, spacing, radius, and typography values. Never referenced
directly by components — always aliased through the layers above.

```css
/* Color scale — 13 steps per hue */
--Primary-Color-1:  #210009;
--Primary-Color-2:  #370A20;
...
--Primary-Color-13: #FEF8FA;

/* Spacing */
--Sizing-1: 8px;
--Sizing-2: 16px;
--Sizing-3: 24px;

/* Radius */
--Card-Radius: 12px;
--Button-Radius: 8px;

/* Effects */
--Effect-Level-0: none;
--Effect-Level-1: 0 1px 2px 0 rgba(0,0,0,0.05);
--Effect-Level-2: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
```

---

## Layer 2 — Mode (light-mode.css / dark-mode.css)

Maps primitive color scales to background-specific semantic tokens. One file is
active at a time — swapped by `DynoDesignProvider` when dark mode is toggled.

Tokens are scoped per background level (Background-1 through Background-13),
where lower numbers are darker and higher numbers are lighter in light mode.

```css
/* Example — Primary color at Background-13 (lightest surface) */
--Primary-Buttons-Surfaces-Background-13-Button:      var(--Primary-Color-5);
--Primary-Buttons-Surfaces-Background-13-Button-Text: var(--Primary-Color-1);
--Primary-Buttons-Surfaces-Background-13-Border:      var(--Primary-Color-5);
--Primary-Buttons-Surfaces-Background-13-Hover:       var(--Primary-Color-4);
--Primary-Buttons-Surfaces-Background-13-Active:      var(--Primary-Color-3);

/* Surfaces */
--Primary-Background-13-Surface:        var(--Primary-Color-13);
--Primary-Background-13-Surface-Dim:    var(--Primary-Color-12);
--Primary-Background-13-Surface-Bright: var(--Primary-Color-13);

/* Containers */
--Primary-Background-13-Container:         var(--Primary-Color-12);
--Primary-Background-13-Container-Low:     var(--Primary-Color-13);
--Primary-Background-13-Container-Lowest:  var(--Primary-Color-13);
--Primary-Background-13-Container-High:    var(--Primary-Color-11);
--Primary-Background-13-Container-Highest: var(--Primary-Color-10);
```

---

## Layer 3 — Themes (themes.css)

Maps background-specific tokens to the final component-level CSS variables that
components actually consume. Scoped to `[data-theme]` + `[data-surface]`
attribute combinations.

### The Surface Model

Every surface-rendering component sets two HTML attributes:

| Attribute | Purpose | Example values |
|---|---|---|
| `data-theme` | Which color theme | `Default`, `Primary`, `Primary-Light`, `Neutral-Dark` |
| `data-surface` | Which surface type | `Surface`, `Container`, `Container-High` |

These two attributes together determine which CSS variables are in scope for all
child components.

### Available Themes

| Theme | Background level | Use case |
|---|---|---|
| `Default` | 13 (lightest) | App default, white/near-white backgrounds |
| `Primary-Light` | 13 | Light tinted primary background |
| `Primary` | 11 | Medium primary background |
| `Secondary-Light` | 13 | Light tinted secondary background |
| `Secondary` | 11 | Medium secondary background |
| `Tertiary-Light` | 13 | Light tinted tertiary background |
| `Tertiary` | 11 | Medium tertiary background |
| `Neutral-Light` | 13 | Light neutral background |
| `Neutral` | 11 | Medium neutral background |
| `Primary-Dark` | 3 | Dark primary background |
| `Secondary-Dark` | 3 | Dark secondary background |
| `Tertiary-Dark` | 3 | Dark tertiary background |
| `Neutral-Dark` | 3 | Dark neutral background |

### Available Surfaces

| Surface | Effect level | Use case |
|---|---|---|
| `Surface` | Level 1 | Base page/section background |
| `Surface-Dim` | Level 1 | Slightly dimmed surface |
| `Surface-Bright` | Level 1 | Slightly brightened surface |
| `Container` | Level 2 | Cards, panels, dialogs |
| `Container-Low` | Level 2 | Slightly recessed container |
| `Container-Lowest` | Level 2 | Most recessed container |
| `Container-High` | Level 2 | Slightly elevated container |
| `Container-Highest` | Level 2 | Most elevated container |

### What themes.css defines per theme + surface combination

```css
[data-theme="Default"][data-surface^="Surface"],
[data-theme="Default"] [data-surface^="Surface"] {
  /* Backgrounds */
  --Background:     var(--Surface);
  --Surface:        var(--Primary-Background-13-Surface);
  --Surface-Dim:    var(--Primary-Background-13-Surface-Dim);
  --Surface-Bright: var(--Primary-Background-13-Surface-Bright);

  /* Typography */
  --Text:           var(--Text-Surfaces-Primary-Color-13);
  --Text-Quiet:     var(--Quiet-Surfaces-Primary-Color-13);
  --Border:         var(--Border-Surfaces-Primary-Color-13);
  --Border-Variant: var(--Border-Variant-Surfaces-Primary-Color-13);

  /* Buttons — all 8 colors × 5 states */
  --Buttons-Primary-Button:  var(--Buttons-Primary-Surfaces-Background-13-Button);
  --Buttons-Primary-Text:    var(--Buttons-Primary-Surfaces-Background-13-Text);
  --Buttons-Primary-Border:  var(--Buttons-Primary-Surfaces-Background-13-Border);
  --Buttons-Primary-Hover:   var(--Buttons-Primary-Surfaces-Background-13-Hover);
  --Buttons-Primary-Active:  var(--Buttons-Primary-Surfaces-Background-13-Active);
  /* ...Secondary, Tertiary, Neutral, Info, Success, Warning, Error... */

  /* Icons */
  --Icons-Primary:   var(--Icon-Surfaces-Primary-Color-13);
  --Icons-Neutral:   var(--Icon-Surfaces-Neutral-Color-13);
  /* ...etc... */
}

[data-theme="Default"][data-surface^="Container"],
[data-theme="Default"] [data-surface^="Container"] {
  /* Containers */
  --Background:          var(--Container);
  --Container:           var(--Primary-Background-13-Container);
  --Container-Low:       var(--Primary-Background-13-Container-Low);
  --Container-Lowest:    var(--Primary-Background-13-Container-Lowest);
  --Container-High:      var(--Primary-Background-13-Container-High);
  --Container-Highest:   var(--Primary-Background-13-Container-Highest);

  /* Typography, buttons, icons — same pattern as Surface but Container-specific values */
}
```

---

## Layer 4 — Components

Components only ever reference the final CSS variables — never raw colors or
background-specific tokens. This is what makes them fully theme-adaptive.

```jsx
// Button reads final variables — works under any theme/surface
<button style={{
  background:   'var(--Buttons-Primary-Button)',
  color:        'var(--Buttons-Primary-Text)',
  border:       '1px solid var(--Buttons-Primary-Border)',
}}>
  Click me
</button>

// On hover (CSS)
// background: var(--Buttons-Primary-Hover)
// On active
// background: var(--Buttons-Primary-Active)
```

---

## Full Token Chain Example

Tracing `--Buttons-Primary-Button` under `data-theme="Default"` in light mode:

```
Component reads:
  var(--Buttons-Primary-Button)
    ↓ themes.css [data-theme="Default"]
  var(--Buttons-Primary-Surfaces-Background-13-Button)
    ↓ light-mode.css
  var(--Primary-Color-5)
    ↓ base.css
  #90385F
```

The same component under `data-theme="Primary-Dark"` in dark mode resolves to a
completely different hex value — the component code is identical.

---

## The Hover/Active State Chain

Hover and Active states follow the same cascade. In `light-mode.css`:

```css
/* Hover — blend(Color-5, #000000, 12%) */
--Primary-Buttons-Surfaces-Background-13-Hover: var(--Primary-Color-4);

/* Active — blend(Color-5, #000000, 25%) */
--Primary-Buttons-Surfaces-Background-13-Active: var(--Primary-Color-3);
```

Blend formula:
```
blend(baseColor, overlayColor, opacity)
  result = baseColor × (1 - opacity) + overlayColor × opacity
```

---

## Effects

Box shadows are also tokenized and assigned per surface type:

```css
[data-surface^="Surface"]   { --Effects: var(--Effect-Level-1); }
[data-surface^="Container"] { --Effects: var(--Effect-Level-2); }
```

Components apply effects via `box-shadow: var(--Effects)`.

---

## Using the System in a Consumer App

### Setup (once at app root)

```jsx
import { DynoDesignProvider } from '@dyno/components';

function App() {
  return (
    <DynoDesignProvider themeURL="https://your-theme-cdn.com/brand">
      <YourApp />
    </DynoDesignProvider>
  );
}
```

### Using components

Components automatically inherit the theme from their nearest `data-theme`
ancestor. No manual theme wiring required.

```jsx
import { Card, Button } from '@dyno/components';

// Inherits theme from DynoDesignProvider
<Card>
  <Button color="primary">Click me</Button>
</Card>

// Explicit theme override on Card
<Card variant="solid" color="primary">
  <Button color="secondary">Click me</Button>
</Card>
```

### Manual surface control (advanced)

For layouts that need explicit surface nesting:

```jsx
<div data-theme="Primary" data-surface="Surface">
  <div data-theme="Primary" data-surface="Container">
    <Button color="primary" />
  </div>
</div>
```

---

## Generating a Custom Brand

Dino generates a complete token CSS package from a brand image:

1. Upload image → Dino extracts color palette
2. Builds 13-step color scales per hue (Primary, Secondary, Tertiary, Neutral)
3. Generates `base.css`, `light-mode.css`, `dark-mode.css`, `themes.css`
4. Publishes to a `themeURL` with a `theme.json` manifest
5. Consumer points `DynoDesignProvider` at the new `themeURL`
6. All components re-skin automatically — zero code changes

The `theme.json` manifest:

```json
{
  "foundation": "base.css",
  "lightMode":  "light-mode.css",
  "darkMode":   "dark-mode.css",
  "styles":     "themes.css",
  "defaultTheme":   "Default",
  "defaultStyle":   "Modern",
  "defaultSurface": "Surface",
  "darkTheme":      "Neutral-Dark"
}
```
