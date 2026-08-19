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
/* Color scale — 12 steps per hue */
--Primary-Color-1:  #210009;
--Primary-Color-2:  #370A20;
...
--Primary-Color-12: #FEF8FA;

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

Tokens are scoped per background level (Background-1 through Background-12),
where lower numbers are darker and higher numbers are lighter in light mode.

The scale is **12 tones**, at fixed lightness values:

```
Color-1  2  3  4  5  6  7  8  9  10 11 12
L =  1  10 19 28 37 58 71 81 90 95 98 99
```

Because the lightness of a tone is fixed, a given tone index behaves the same
way in every palette — which is why several rules below can key on the tone
index alone rather than measuring each colour.

```css
/* Example — Primary color at Background-12 (lightest surface) */
--Primary-Buttons-Surfaces-Background-12-Button:      var(--Primary-Color-5);
--Primary-Buttons-Surfaces-Background-12-Button-Text: var(--Primary-Color-1);
--Primary-Buttons-Surfaces-Background-12-Border:      var(--Primary-Color-5);
--Primary-Buttons-Surfaces-Background-12-Hover:       var(--Primary-Color-4);
--Primary-Buttons-Surfaces-Background-12-Pressed:     var(--Primary-Color-3);

/* Surfaces */
--Primary-Background-12-Surface:        var(--Primary-Color-12);
--Primary-Background-12-Surface-Dim:    var(--Primary-Color-11);
--Primary-Background-12-Surface-Bright: var(--Primary-Color-12);

/* Containers */
--Primary-Background-12-Container:         var(--Primary-Color-11);
--Primary-Background-12-Container-Low:     var(--Primary-Color-12);
--Primary-Background-12-Container-Lowest:  var(--Primary-Color-12);
--Primary-Background-12-Container-High:    var(--Primary-Color-10);
--Primary-Background-12-Container-Highest: var(--Primary-Color-9);
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
  --Surface:        var(--Primary-Background-12-Surface);
  --Surface-Dim:    var(--Primary-Background-12-Surface-Dim);
  --Surface-Bright: var(--Primary-Background-12-Surface-Bright);

  /* Typography */
  --Text:           var(--Text-Surfaces-Primary-Color-12);
  --Text-Quiet:     var(--Quiet-Surfaces-Primary-Color-12);
  --Border:         var(--Border-Surfaces-Primary-Color-12);
  --Border-Variant: var(--Border-Variant-Surfaces-Primary-Color-12);
  --Eyebrow:        var(--Text-Surfaces-Secondary-Color-12);

  /* Buttons — 10 roles x 7 slots */
  --Buttons-Primary-Button:    var(--Buttons-Primary-Surfaces-Background-12-Button);
  --Buttons-Primary-Text:      var(--Buttons-Primary-Surfaces-Background-12-Text);
  --Buttons-Primary-Border:    var(--Buttons-Primary-Surfaces-Background-12-Border);
  --Buttons-Primary-Hover:     var(--Buttons-Primary-Surfaces-Background-12-Hover);
  --Buttons-Primary-Pressed:   var(--Buttons-Primary-Surfaces-Background-12-Pressed);
  --Buttons-Primary-Highlight: 180, 149, 198;   /* bevel — RGB triplet */
  --Buttons-Primary-Lowlight:  48, 28, 60;      /* bevel — RGB triplet */
  /* ...Secondary, Tertiary, Neutral, Info, Success, Warning, Error, BlackWhite... */

  /* Icons */
  --Icons-Primary:   var(--Icon-Surfaces-Primary-Color-12);
  --Icons-Neutral:   var(--Icon-Surfaces-Neutral-Color-12);
  /* ...etc... */
}

[data-theme="Default"][data-surface^="Container"],
[data-theme="Default"] [data-surface^="Container"] {
  /* Containers */
  --Background:          var(--Container);
  --Container:           var(--Primary-Background-12-Container);
  --Container-Low:       var(--Primary-Background-12-Container-Low);
  --Container-Lowest:    var(--Primary-Background-12-Container-Lowest);
  --Container-High:      var(--Primary-Background-12-Container-High);
  --Container-Highest:   var(--Primary-Background-12-Container-Highest);

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
// On press
// background: var(--Buttons-Primary-Pressed)
```

---

## Full Token Chain Example

Tracing `--Buttons-Primary-Button` under `data-theme="Default"` in light mode:

```
Component reads:
  var(--Buttons-Primary-Button)
    ↓ themes.css [data-theme="Default"]
  var(--Buttons-Primary-Surfaces-Background-12-Button)
    ↓ light-mode.css
  var(--Primary-Color-5)
    ↓ base.css
  #90385F
```

The same component under `data-theme="Primary-Dark"` in dark mode resolves to a
completely different hex value — the component code is identical.

---

## Buttons

### Roles and slots

Ten roles — `Default, Primary, Secondary, Tertiary, Neutral, Info, Success,
Warning, Error, BlackWhite` — each with seven slots:

```css
--Buttons-<Role>-Button      /* fill */
--Buttons-<Role>-Text        /* label, derived FROM the fill */
--Buttons-<Role>-Border      /* the fill — a solid button's edge is its own colour */
--Buttons-<Role>-Hover
--Buttons-<Role>-Pressed
--Buttons-<Role>-Highlight   /* bevel — RGB TRIPLET, not hex */
--Buttons-<Role>-Lowlight    /* bevel — RGB TRIPLET, not hex */
```

Highlight and Lowlight are bare `R, G, B` triplets because the components wrap
them: `rgb(var(--Buttons-Primary-Highlight))`. Emitting hex there is valid CSS
that silently produces no bevel.

### Which tone each role sits on

| Role | Light mode | Dark mode |
|---|---|---|
| Primary | the brand's extracted tone | **Light-mode Color-8** |
| Secondary / Tertiary | the extracted tone, exactly | Light-mode Color-8 |
| Neutral | Color-8 | Light-mode Color-8 |
| Info / Success / Warning / Error | **Color-5, fixed** | Light-mode Color-8 |

Dark-mode buttons deliberately reach across the mode boundary and use the
**light** ramp's Color-8. Every palette then measures 9.5–10.4:1 against its
(dark) label.

State buttons are pinned to Color-5 because the tone decides the label:

```
Color-5   white 7.2:1 ✓   black 2.8:1 ✗
Color-6   white 3.4:1 ✗   black 6.0:1 ✓
```

A state colour should mean the same thing in every brand, so it must not move.

### `black-white`

A button that resolves itself against whatever it is placed on — black on a
light surface, white on a dark one — with no prop change:

```jsx
<Button variant="black-white">Works on any theme or surface</Button>
<Button variant="black-white-outline">Also anywhere</Button>
```

The face is chosen by the **background's tone**: white on tones 1–5, black from
6 up. Labels measure ~20.5:1 throughout.

There is no `black-white-light`. That variant reads `--<Color>-Color-11`, and
black-white is a resolved pair rather than a palette, so it has no tones.

---

## The Hover/Pressed State Chain

> The token is `Pressed`. It was once `Active`; nothing reads `-Active` any
> more, and a stale `--Buttons-<Color>-Active` declaration resolves to nothing
> — leaving a button with no pressed feedback at all.

States are **not** a fixed blend. Each is a step along the palette, and the
direction is chosen by the button's own **label**:

### Direction — decided by the LABEL

**The state moves away from the text sitting on it.**

- Label **lighter** than the fill (light text) → step **darker**
- Label **darker** than the fill (dark text) → step **lighter**

The label is read from `Text.Surfaces.{palette}.Color-N` — the token the button
actually renders — and compared to the fill by relative luminance.

> Keying on the tone index instead (1-5 darker, 6-12 lighter) assumes every
> palette's text table flips at tone 6. Measured, 23 of 24 palette/mode
> combinations do — and the exception is where it broke: an olive primary whose
> Color-6 carries a *light* label, so "lighter" stepped into the text and took a
> 4.54:1 button to 2.17:1.

### Pressed

| Fill tone | Pressed |
| --- | --- |
| 2-11 | one full tone in the direction above |
| **1** | **half a step lighter** |
| **12** | `Color-11` — darker, inverted |

**Both ends invert, because neither has headroom.** Tone 12 is already
near-white, so stepping lighter goes nowhere. Tone 1 used to step to `#000000`,
which from a fill already at `#040404` is 1.02:1 against itself — no feedback at
all.

Tone 1 moves only **half** a step because `Color-1 → Color-2` is L=1 → L=10, a
tenfold luminance change; the same step at the light end is L=98 → L=99. A full
step there reads as the button changing colour rather than responding.

```
before   #040404 → hover #020202 (Δ1.012)  pressed #000000 (Δ1.023)
after    #040404 → hover #0a0a0a (Δ1.036)  pressed #101010 (Δ1.077)
```

### Hover — a 50% blend of the fill and its Pressed value

Hover sits between the resting fill and Pressed, so the two states read as one
progression rather than two unrelated colours.

### The guarantee

Because the state always moves away from the label, **if the resting pair passes,
the states pass.** It holds for every tone but the two endpoints, where the
inversion costs a little and both stay far above 4.5 (Color-1: 15.79 → 14.63;
Color-12: 9.66 → 9.37).

**Source of truth:** `staticTokenStructures.ts` → `buildHoverForPalette()`.
Mirrored in the CSS writer, the Figma export and the studio preview — all four
must agree. Full derivation: `docs/hover-active-calculation.md` in the studio.

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

### How the CSS loads

The Provider reads `theme.json` and inserts each brand sheet as a
`<link rel="stylesheet">` tag (URL sources) or `<style>` tag (raw CSS
strings). Sheets load in cascade order — `foundation → core → mode →
base → styles` — and the browser blocks paint until each `<link>` is
applied.

While loading, the Provider's root element carries
`data-dyno-css="loading"` and is `visibility: hidden`. It flips to
`"ready"` once every sheet resolves. Consumers can read the same value
via `useDynoDesign().cssStatus` to render a fallback during a slow
network load.

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
