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

**If you copy a fresh studio export into this folder, only overwrite these three files.**

## STATIC — lib-owned, do not regenerate

These files have no brand-specific values. They're the same for every consumer of the lib.
**Never overwrite them from a studio export.** They are hand-edited (or generated upstream from a template), checked into the lib repo, and shipped as-is.

| File | What's in it |
|---|---|
| `core.css` | Platform font overrides referencing brand tokens via `var()` |
| `foundation.css` | Primitive sizing tokens (button/card radius defaults) |
| `foundations.css` | Alternate / legacy primitives — reconcile with `foundation.css` when convenient |
| `styles.css` | Final overrides slot (loads last). Add hand-edited overrides here. |
| `typography-tokens.css` | Platform-scaled type sizes (Desktop / IOS-Mobile / etc.) — no brand refs |

## How files are referenced

Consumers of `@dynodesign/components` import these files directly, e.g.:

```js
import '@dynodesign/components/public/styles/Light-Mode.css';
import '@dynodesign/components/public/styles/core.css';
// etc.
```

The list of importable paths is whitelisted by the lib's `package.json` `exports` field.
