# Button Component — Design Token Documentation

> **Audience:** Human developers and agentic AI (Cursor, Copilot, etc.)
> **Standard:** WCAG 2.1 AA
> **Base component:** MUI `Button` with custom design token layer

---

## Overview

The `Button` component wraps MUI's `Button` with a full design system token layer. All colors,
sizing, and states are driven by CSS custom properties — never hardcoded values. There are three
structural variant families (Solid, Outline, Light), one link-style variant (Ghost), and six
content-type modes that change sizing and padding behaviour.

---

## Props Reference

| Prop           | Type      | Default     | Description                                                      |
|----------------|-----------|-------------|------------------------------------------------------------------|
| `variant`      | `string`  | `'primary'` | Visual style. See variant table below.                           |
| `size`         | `string`  | `'medium'`  | `'small'` \| `'medium'` \| `'large'`                            |
| `disabled`     | `boolean` | `false`     | Applies 0.6 opacity, blocks pointer events.                      |
| `fullWidth`    | `boolean` | `false`     | Stretches to container width. Ignored for icon/letter/number/avatar/swatch. |
| `iconOnly`     | `boolean` | `false`     | Icon-only square button. No padding, no typography wrapper.      |
| `letterNumber` | `boolean` | `false`     | Single character (letter or number) square button.               |
| `avatar`       | `boolean` | `false`     | Circular button with an `MuiAvatar` wrapping the child.          |
| `swatch`       | `boolean` | `false`     | Square color-block button, no children rendered.                 |
| `startIcon`    | `node`    | —           | Icon placed before text label.                                   |
| `endIcon`      | `node`    | —           | Icon placed after text label.                                    |
| `sx`           | `object`  | `{}`        | MUI sx override, applied last (after all token styles).          |

---

## Variant → Token Mapping

Colors: `primary` `secondary` `tertiary` `neutral` `info` `success` `warning` `error`

### Solid — `variant="{color}"`

| CSS Property       | Token                              |
|--------------------|------------------------------------|
| `background-color` | `var(--Buttons-{Color}-Button)`    |
| `border`           | `2px solid var(--Buttons-{Color}-Border)` |
| `color` (text)     | `var(--Buttons-{Color}-Text)`      |
| `box-shadow`       | `var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)` |
| `:hover` bg        | `var(--Buttons-{Color}-Hover)`     |
| `:active` bg       | `var(--Buttons-{Color}-Active)`    |
| `:focus-visible`   | `var(--Focus-Visible)` (as bg)     |
| Ripple color       | `var(--Buttons-{Color}-Hover)`     |

### Outline — `variant="{color}-outline"`

| CSS Property       | Token                                     |
|--------------------|-------------------------------------------|
| `background-color` | `transparent`                             |
| `border`           | `2px solid var(--Buttons-{Color}-Border)` |
| `color` (text)     | `var(--Text)`                             |
| `box-shadow`       | `none`                                    |
| `:hover` bg        | `var(--Buttons-Primary-Hover)`            |
| `:active` bg       | `var(--Buttons-Primary-Active)`           |
| `:focus-visible`   | `var(--Focus-Visible)` (as bg)            |
| Ripple color       | `var(--Surface-Dim)`                      |

> ⚠️ Outline hover/active always uses `Primary` tokens regardless of the selected color.
> This is intentional — outline buttons share a neutral interaction surface.

### Light — `variant="{color}-light"`

| CSS Property       | Token                                     |
|--------------------|-------------------------------------------|
| `background-color` | `var(--{Color}-Color-11)`                 |
| `border`           | `2px solid var(--Buttons-{Color}-Border)` |
| `color` (text)     | `var(--Text-{Color}-Color-11)`            |
| `box-shadow`       | `var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)` |
| `:hover` bg        | `var(--Hover-{Color}-Color-11)`           |
| `:active` bg       | `var(--Active-{Color}-Color-11)`          |
| `:focus-visible`   | `var(--Active-{Color}-Color-11)` (as bg)  |
| Ripple color       | `var(--Hover-{Color}-Color-11)`           |

### Ghost — `variant="ghost"` (also `variant="text"`)

| CSS Property           | Token                                      |
|------------------------|--------------------------------------------|
| `background-color`     | `transparent`                              |
| `border`               | `2px solid transparent`                    |
| `color` (text)         | `var(--Hotlink)`                           |
| `text-decoration`      | `underline` (text/letter/number only)      |
| `box-shadow`           | `none`                                     |
| `:hover` bg            | `var(--Background-Hover)`                  |
| `:hover` text-decor    | `none`                                     |
| `:active` bg           | `var(--Background-Active)`                 |
| `:focus-visible` bg    | `var(--Background-Active)`                 |
| Ripple color           | `var(--Background-Hover)`                  |

> Ghost buttons are **not compatible** with `avatar` or `swatch` content types. The component
> silently falls back to `variant="primary"` if that combination is passed.

---

## Size → Token Mapping

| Size     | `min-height`             | `min-width`                                           | Text size | Padding (text)                         |
|----------|--------------------------|-------------------------------------------------------|-----------|----------------------------------------|
| `small`  | `24px`                   | `24px`                                                | `13px`    | `var(--Sizing-Half) var(--Sizing-1)`   |
| `medium` | `var(--Button-Height)`   | `max(var(--Min-Button-Width), var(--Button-Height))`  | `15px`    | `var(--Sizing-Half) var(--Sizing-1)`   |
| `large`  | `56px`                   | `56px`                                                | `17px`    | `var(--Sizing-Half) var(--Sizing-2)`   |

### Sizing modifiers by content type

| Content type    | Shell padding | Inner padding   | `max-width`          | Shape      |
|-----------------|---------------|-----------------|----------------------|------------|
| `text`          | Token-based   | On typography   | none                 | Rounded    |
| `letter/number` | `0`           | `4px` (Box)     | none                 | Square     |
| `icon`          | `0`           | none            | = `min-height`       | Square     |
| `avatar`        | `0`           | none            | = `min-height`       | Circle     |
| `swatch`        | `0`           | none            | = `min-height`       | Square     |

---

## State Tokens (All Variants)

| State           | Token / Rule                                                          |
|-----------------|-----------------------------------------------------------------------|
| Focus ring      | `outline: 2px solid var(--Focus-Visible); outline-offset: 2px`       |
| Disabled        | `opacity: 0.6`, cursor `not-allowed`, pointer-events `none`. Colors unchanged — do not override. |
| Shadow (solid/light) | `var(--Shadow-1), var(--Shadow-2), var(--Effect-Level-3)` maintained on hover |
| Transition      | `background-color 0.15s ease-in-out, border-color 0.15s ease-in-out` |

---

## Icon Behaviour

- Icons passed via `startIcon` / `endIcon` receive margin `4px` from the text. Shell padding adjusts to compensate:
  - Left icon present → left text padding becomes `0`
  - Right icon present → right text padding becomes `0`
- `startIcon` and `endIcon` use `zIndex: 1` to stay above the ripple layer.
- Small buttons and ButtonGroups: icons use `font-size: 1rem`, **not** `1.5rem`.
- Icons inside buttons must always have `aria-hidden="true"` and `alt=""`.

---

## Typography

| Size     | Typography component    |
|----------|-------------------------|
| `small`  | `ButtonSmall`           |
| `medium` | `Button` (typography)   |
| `large`  | `Button` (typography)   |

Text children are automatically wrapped in the correct typography component. Do not manually wrap
children in a typography component — the Button handles this internally.

---

## Accessibility Requirements

### Text contrast (WCAG 1.4.3)
- Text color vs. button background: **≥ 4.5:1** in default, hover, and active states.
- This is enforced by the token system. Do not override text color without re-checking contrast.

### Non-text contrast (WCAG 1.4.11)
- Border vs. page background: **≥ 3:1**
- Focus ring vs. page background: **≥ 3:1** (`var(--Focus-Visible)` is pre-validated)
- Icon/avatar content vs. button background: **≥ 3:1**

### Touch targets (WCAG 2.5.5 / 2.5.8)
- `small`: `32px` total — meets WCAG 2.2 AA minimum.
- `medium`: `var(--Button-Height)` — design system default.
- `large`: `64px` — preferred for touch-primary interfaces.

### ARIA
- The component sets `role="button"` on the root element.
- **Icon-only, swatch, avatar** buttons **require** an `aria-label` describing the action, e.g. `aria-label="Delete item"`.
- Swatch buttons should additionally be wrapped in `<Tooltip>` for a visual label.
- Disabled state uses `opacity` + `pointer-events: none` (not the HTML `disabled` attribute alone), so the element remains in the tab order — add `aria-disabled="true"` if you need to explicitly signal disabled state to AT.

---

## Convenience Exports

All named exports are thin wrappers that pre-set `variant`. Use them to reduce boilerplate.

```jsx
// Solid
import { PrimaryButton, SecondaryButton, ErrorButton } from '@/components/Button';

// Outline
import { PrimaryOutlineButton, NeutralOutlineButton } from '@/components/Button';

// Light
import { PrimaryLightButton, SuccessLightButton } from '@/components/Button';

// Ghost / Text
import { GhostButton, TextButton } from '@/components/Button';

// Content-type aliases (set iconOnly / letterNumber / avatar / swatch)
import { IconButton, LetterButton, AvatarButton, SwatchButton } from '@/components/Button';
```

---

## Annotated Usage Examples

### Standard text button with icon

```jsx
import { Button } from '@/components/Button';
import AddIcon from '@mui/icons-material/Add';

// Solid primary, medium, left icon
<Button
  variant="primary"
  size="medium"
  startIcon={<AddIcon aria-hidden="true" alt="" fontSize="small" />}
>
  Add Item
</Button>
```

### Outline button, right icon

```jsx
<Button
  variant="secondary-outline"
  size="medium"
  endIcon={<EditIcon aria-hidden="true" alt="" fontSize="small" />}
>
  Edit
</Button>
```

### Icon-only button (requires aria-label)

```jsx
<Button
  variant="primary"
  size="medium"
  iconOnly
  aria-label="Delete item"
>
  <DeleteIcon aria-hidden="true" alt="" />
</Button>
```

### Light variant

```jsx
<Button variant="success-light" size="large">
  Confirm
</Button>
```

### Ghost button

```jsx
// Text underlined by default; underline removed on hover/focus/active
<Button variant="ghost" size="medium">
  Learn more
</Button>
```

### Avatar button

```jsx
// Circular, uses first letter of children as the avatar initial
<Button
  variant="primary"
  size="medium"
  avatar
  aria-label="Open profile for Alice"
>
  A
</Button>
```

### Swatch button (wrap in Tooltip)

```jsx
import { Tooltip } from '@mui/material';

<Tooltip title="Select Primary" arrow>
  <Button
    variant="primary"
    size="medium"
    swatch
    aria-label="Select Primary"
  />
</Tooltip>
```

### Disabled state

```jsx
// Do not override colors on disabled — opacity handles the visual affordance
<Button variant="primary" size="medium" disabled>
  Unavailable
</Button>
```

### Full width (text content only)

```jsx
// fullWidth is silently ignored on icon / letter / number / avatar / swatch
<Button variant="primary" size="large" fullWidth>
  Submit
</Button>
```

---

## Do's and Don'ts

### ✅ Do

- Use the **token variable names exactly** as listed — do not resolve them to hex values.
- Always pass `aria-hidden="true"` and `alt=""` on icons placed inside buttons.
- Add `aria-label` to every `iconOnly`, `avatar`, and `swatch` button.
- Wrap `swatch` buttons in `<Tooltip>` to provide a visible label.
- Let the component handle typography wrapping — pass plain strings as `children`.
- Use `small` icons (`fontSize="small"`) with `startIcon` / `endIcon`.
- Match icon `fontSize` to `1rem` in `small` size contexts.

### ❌ Don't

- Don't hardcode colors in `sx` overrides — always use `var(--token-name)`.
- Don't manually wrap `children` in a Typography component — the Button does this.
- Don't use `variant="ghost"` with `avatar` or `swatch` content — it will silently fall back to `primary`.
- Don't set `fullWidth` on icon, letter, number, avatar, or swatch buttons — it is ignored.
- Don't override `opacity`, `cursor`, or `pointer-events` on disabled buttons — the component already handles this correctly.
- Don't use `1.5rem` icon size in small buttons or ButtonGroups — use `1rem`.
- Don't omit the focus ring or change `var(--Focus-Visible)` without a contrast check.
- Don't apply a different `role` — the component already sets `role="button"`.

---

## Token Quick Reference

```
--Buttons-{Color}-Button      Button background (solid)
--Buttons-{Color}-Border      Border color (all variants)
--Buttons-{Color}-Text        Text / icon color (solid)
--Buttons-{Color}-Hover       Hover background (solid)
--Buttons-{Color}-Active      Active background (solid)

--{Color}-Color-11             Light variant background
--Text-{Color}-Color-11        Light variant text color
--Hover-{Color}-Color-11       Light variant hover background
--Active-{Color}-Color-11      Light variant active background

--Hotlink                      Ghost text color
--Background-Hover             Ghost hover background
--Background-Active            Ghost active/focus background

--Text                         Outline text color
--Surface-Dim                  Outline ripple color

--Focus-Visible                Focus ring color (all variants)
--Button-Height                Medium height token
--Min-Button-Width             Medium minimum width token
--Style-Border-Radius          Corner radius
--Shadow-1, --Shadow-2         Drop shadow layers
--Effect-Level-3               Elevation effect
--Sizing-Half, --Sizing-1, --Sizing-2   Padding scale tokens
```

---

## File Structure

```
src/components/Button/
├── Button.js           # Component + all named exports
├── ButtonShowcase.js   # Playground + Accessibility tab
├── Button.stories.js   # Storybook stories
├── Button.test.js      # Jest + jest-axe tests
└── index.js            # Barrel export
```
