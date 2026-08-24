# `@dynodesign/components` CSS files

This folder ships as `@dynodesign/components/public/styles/` in the published npm package.
The files split into two categories — STATIC and DYNAMIC — and they should be treated very differently.

## DYNAMIC — regenerated per design system

These files contain values specific to one design system (brand colors, fonts, etc.).
They are produced by the **studio's** `exportToCSS.ts` and replaced wholesale on every export.

| File | What's in it |
|---|---|
| `base.css` | Brand-specific font families, button defaults, primary-background mappings |
| `Light-Mode.css` | Full per-brand color palette + per-surface hover/active (light mode) |
| `Dark-Mode.css` | Same as Light-Mode for dark |
| `core.css` | Platform font overrides **and the chosen faces** (`--Set-Font-Family-*`) |
| `typography-tokens.css` | The per-style ramp, sizes, weights and variable-font axes |

**If you copy a fresh studio export into this folder, overwrite these five files.**

## STATIC — lib-owned, do not regenerate

These files have no brand-specific values. They're the same for every consumer of the lib.
**Never overwrite them from a studio export.** They are hand-edited (or generated upstream from a template), checked into the lib repo, and shipped as-is.

| File | What's in it |
|---|---|
| `foundation.css` | Primitive sizing tokens (button/card radius defaults) |
| `styles.css` | Final overrides slot (loads last). Add hand-edited overrides here. |

### `foundations.css` was removed — use `foundation.css`

Two files one character apart, both shipped. `foundations.css` held a strict
SUBSET of `foundation.css` — 44 of its 47 variables, nothing unique — but six
shared names carried DIFFERENT values:

| | foundation.css | foundations.css |
|---|---|---|
| `--Button-Radius` | `4px` | `34px` |
| `--Button-Icon-Radius` | `4px` | `61px` |
| `--Button-Bevel-Px` | `0px` | `4px` |
| `--Button-Bevel-Shadow` | `none` | full inset bevel |

So the two files disagreed about whether a button is a flat square or a bevelled
pill, and which one you got depended on how you imported. Worse, every reference
in the codebase named `foundation.css` while the package `exports` map only
permitted `foundations.css` — so the one file a consumer could import by name
was the one nothing else used.

The three variables missing from the plural version were `--Input-Radius`,
`--Input-Inner-Focus-Visible` and `--Sizing-Negative-2`. `--Input-Radius` is the
base of the `Dropdown-Frame-Radius` chain, so consumers on the plural file had
no input radius at all.

**If you are updating from a version that loaded `foundations.css`, buttons will
change from a 34px bevelled pill to a 4px flat square.** That is the correct
default — it is what every other reference in the lib and every studio export
already assumed — but it is a visible change, not a silent cleanup.

### Why `core.css` and `typography-tokens.css` moved to DYNAMIC

They used to be listed as static, on the grounds that they held no brand
values. That stopped being true: studio exports write the chosen faces
(`--Set-Font-Family-Display` / `-Eyebrow` / `-Header`), the header face's
variable-font axes (`--Font-Slant-Header`, `--Font-Roundness-Header`, …) and
the full per-style ramp into both.

The old wording — overwrite only base/Light/Dark — therefore gave a consumer
the brand's colours but not its fonts or axes, silently. A design system with a
header weight of 857 rendered at 600 because the lib's bundled copy won.

**The checked-in copies here are SEEDS, not the authority.** They define the
same token names with neutral values: faces fall back to what the design system
rendered before faces existed, and `--Font-Variation-Header` is `normal`, so
nothing is applied until a real design system supplies values. That makes them
a safe default for local development and for the showcase — nothing more.

At runtime the authority is the design system's own export. `theme.json` now
carries a `typography` slot alongside `foundation` / `core` / `lightMode` /
`darkMode` / `base` / `styles`, so the Provider fetches the brand's ramp
directly and the bundled copy is never consulted.

## How files are referenced

Consumers of `@dynodesign/components` import these files directly, e.g.:

```js
import '@dynodesign/components/public/styles/Light-Mode.css';
import '@dynodesign/components/public/styles/core.css';
// etc.
```

The list of importable paths is whitelisted by the lib's `package.json` `exports` field.
