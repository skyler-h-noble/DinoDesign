# Accordion Component — Design Token Documentation

> **Audience:** Human developers and agentic AI (Cursor, Copilot, etc.)
> **Standard:** WCAG 2.1 AA / WAI-ARIA Accordion Pattern
> **Base component:** Custom MUI `Box` composition (no MUI Accordion dependency)

---

## Overview

The Accordion is a four-part compound component: `AccordionGroup` → `Accordion` →
`AccordionSummary` → `AccordionDetails`. All token resolution, theming, and accessibility
attributes flow **down from `AccordionGroup`** via React context. Never use the child
components standalone outside of an `AccordionGroup`.

Three visual variants exist: **Default** (explicit border + background tokens), **Solid**
(color-themed surface), and **Light** (lighter color-themed surface). Solid and Light variants
apply theming via `data-theme` / `data-surface` attributes on the group container — token
resolution for all children then happens automatically through the CSS cascade.

---

## Component Hierarchy

```
AccordionGroup          ← sets variant, color, size, disableDivider via context
  └─ Accordion          ← controls expanded/collapsed state; optional controlled mode
       ├─ AccordionSummary   ← trigger button; receives expand icon
       └─ AccordionDetails   ← content region; mounts/unmounts on expand
```

---

## Props Reference

### `AccordionGroup`

| Prop             | Type      | Default     | Description                                                        |
|------------------|-----------|-------------|---------------------------------------------------------------------|
| `variant`        | `string`  | `'default'` | `'default'` \| `'solid'` \| `'light'`                              |
| `color`          | `string`  | `'primary'` | One of 8 brand colors. Ignored when `variant="default"`.           |
| `size`           | `string`  | `'medium'`  | `'small'` \| `'medium'` \| `'large'`                               |
| `disableDivider` | `boolean` | `false`     | Hides `border-bottom` between accordion items.                     |
| `sx`             | `object`  | `{}`        | MUI sx override applied to the group container.                    |

### `Accordion`

| Prop              | Type       | Default | Description                                                              |
|-------------------|------------|---------|---------------------------------------------------------------------------|
| `expanded`        | `boolean`  | —       | Controlled expanded state. Omit for uncontrolled.                         |
| `defaultExpanded` | `boolean`  | `false` | Initial expanded state (uncontrolled only).                               |
| `onChange`        | `function` | —       | Callback `(nextExpanded: boolean) => void` fired on toggle.               |
| `disabled`        | `boolean`  | `false` | Disables toggle, sets `opacity: 0.5`, removes from tab order.             |
| `sx`              | `object`   | `{}`    | MUI sx override applied to the accordion item wrapper.                    |

### `AccordionSummary`

| Prop         | Type   | Default         | Description                                                         |
|--------------|--------|-----------------|----------------------------------------------------------------------|
| `expandIcon` | `node` | `<ExpandMoreIcon>` | Custom chevron/icon. Receives `transform: rotate(180deg)` on expand. |
| `sx`         | `object` | `{}`          | MUI sx override for the summary button.                              |

### `AccordionDetails`

| Prop | Type     | Default | Description                                   |
|------|----------|---------|-----------------------------------------------|
| `sx` | `object` | `{}`    | MUI sx override for the details content area. |

---

## Variant → Token Mapping

### Default — `variant="default"` (no `data-theme`)

Tokens are resolved from the global (unthemed) scope.

| Element                    | CSS Property       | Token                    |
|----------------------------|--------------------|--------------------------|
| Group container            | `background-color` | `var(--Background)`      |
| Group container            | `border`           | `1px solid var(--Border)` |
| Accordion divider          | `border-bottom`    | `1px solid var(--Border)` |
| Summary — **closed**       | `color`            | `var(--Text-Quiet)`      |
| Summary — **open**         | `color`            | `var(--Text)`            |
| Summary — hover            | `background-color` | `var(--Surface-Dim)`     |
| Details content            | `color`            | `var(--Text)`            |

> The closed → open text color transition (`--Text-Quiet` → `--Text`) is the only state-driven
> token difference between Default and the themed variants. All other interactive states are
> shared across variants.

---

### Solid — `variant="solid"`

The group container receives `data-theme="{ThemeName}"` and `data-surface="Surface"`.
All tokens below resolve from within that theme scope.

| Color       | `data-theme` value |
|-------------|-------------------|
| `primary`   | `Primary`         |
| `secondary` | `Secondary`       |
| `tertiary`  | `Tertiary`        |
| `neutral`   | `Neutral`         |
| `info`      | `Info-Medium`     |
| `success`   | `Success-Medium`  |
| `warning`   | `Warning-Medium`  |
| `error`     | `Error-Medium`    |

| Element           | CSS Property       | Token (resolved within theme) |
|-------------------|--------------------|-------------------------------|
| Group container   | `background-color` | `var(--Surface)`              |
| Group container   | `border`           | `1px solid var(--Border)`     |
| Summary (all)     | `color`            | `var(--Text)`                 |
| Summary — hover   | `background-color` | `var(--Surface-Dim)`          |
| Details content   | `color`            | `var(--Text)`                 |

> The `data-surface="Surface"` attribute is required for Solid and causes the CSS cascade
> to resolve `--Surface`, `--Text`, `--Border`, etc. from the themed surface scope.
> Do not omit it on Solid variants.

---

### Light — `variant="light"`

The group container receives only `data-theme="{ThemeName}"` (no `data-surface`).

| Color       | `data-theme` value |
|-------------|-------------------|
| `primary`   | `Primary-Light`   |
| `secondary` | `Secondary-Light` |
| `tertiary`  | `Tertiary-Light`  |
| `neutral`   | `Neutral-Light`   |
| `info`      | `Info-Light`      |
| `success`   | `Success-Light`   |
| `warning`   | `Warning-Light`   |
| `error`     | `Error-Light`     |

| Element           | CSS Property       | Token (resolved within theme) |
|-------------------|--------------------|-------------------------------|
| Group container   | `background-color` | `var(--Surface)`              |
| Group container   | `border`           | `1px solid var(--Border)`     |
| Summary (all)     | `color`            | `var(--Text)`                 |
| Summary — hover   | `background-color` | `var(--Surface-Dim)`          |
| Details content   | `color`            | `var(--Text)`                 |

> Light uses the same token names as Solid — the difference is solely in the `data-theme`
> value. Lighter-tinted themes resolve to softer `--Surface` values automatically.

---

## Size → Token Mapping

| Size     | Summary padding (y/x)  | Details padding (y/x) | Font size | Icon size |
|----------|------------------------|-----------------------|-----------|-----------|
| `small`  | `8px / 12px`           | `8px / 12px`          | `13px`    | `18px`    |
| `medium` | `12px / 16px`          | `12px / 16px`         | `14px`    | `20px`    |
| `large`  | `16px / 20px`          | `16px / 20px`         | `16px`    | `22px`    |

Details padding is applied as `0 {px} {py} {px}` (no top padding — the summary already
provides visual separation).

---

## State Tokens (All Variants)

| State                  | Token / Rule                                                                  |
|------------------------|-------------------------------------------------------------------------------|
| Summary hover          | `background-color: var(--Surface-Dim)`                                        |
| Focus ring (inset)     | `outline: 3px solid var(--Focus-Visible); outline-offset: -3px`               |
| Disabled               | `opacity: 0.5`, `tabIndex: -1`, `cursor: not-allowed`. Toggle is blocked.     |
| Expand icon — closed   | `transform: rotate(0deg)`                                                     |
| Expand icon — open     | `transform: rotate(180deg)`, transition `0.25s ease`                          |
| Color transition       | `color 0.2s ease, background-color 0.15s ease` on summary                    |

---

## Expand / Collapse Behaviour

- `AccordionDetails` **mounts and unmounts** on expand/collapse (not hidden via CSS).
  If content has initialisation side effects, use `defaultExpanded` to pre-mount.
- Each `Accordion` independently tracks its own expanded state unless `expanded` prop is passed.
- Multiple items can be open simultaneously — there is no exclusive/single-open mode built in.
  If single-open behaviour is needed, control all `expanded` props externally with shared state.
- `onChange(nextExpanded: boolean)` fires after every toggle regardless of controlled/uncontrolled mode.

---

## Accessibility Requirements

### Text contrast (WCAG 1.4.3 — ≥ 4.5:1)

| Variant   | Foreground                 | Background               |
|-----------|----------------------------|--------------------------|
| Default (closed) | `var(--Text-Quiet)`  | `var(--Background)`      |
| Default (open)   | `var(--Text)`        | `var(--Background)`      |
| Solid / Light    | `var(--Text)`        | `var(--Surface)` (themed)|

> `--Text-Quiet` is pre-validated to meet 4.5:1 against `--Background`. Do not substitute a
> lower-contrast token for the closed state.

### Non-text contrast (WCAG 1.4.11 — ≥ 3:1)

| Pair                                            | Purpose                                       |
|-------------------------------------------------|-----------------------------------------------|
| `var(--Surface-Dim)` vs. resting surface        | Hover state must be visually distinct         |
| `var(--Focus-Visible)` vs. accordion background | Inset focus ring must be distinguishable      |
| Themed `var(--Surface)` vs. page `--Background` | Solid/Light containers must stand out on page |

### Keyboard navigation (WAI-ARIA Accordion pattern)

| Key        | Behaviour                                     |
|------------|-----------------------------------------------|
| `Tab`      | Moves focus between summary buttons           |
| `Enter`    | Toggles the focused accordion open/closed     |
| `Space`    | Toggles the focused accordion open/closed     |

The component does not implement optional `Home` / `End` / `ArrowUp` / `ArrowDown` navigation —
add these if building a keyboard-heavy UI.

### ARIA attributes (auto-applied by component)

| Element          | Attribute                                  | Value                        |
|------------------|--------------------------------------------|------------------------------|
| Summary button   | `role`                                     | `"button"`                   |
| Summary button   | `aria-expanded`                            | `true` \| `false`            |
| Summary button   | `aria-controls`                            | `"{id}-content"`             |
| Summary button   | `id`                                       | `"{id}-header"`              |
| Summary button   | `tabIndex`                                 | `-1` when disabled           |
| Details region   | `role`                                     | `"region"`                   |
| Details region   | `id`                                       | `"{id}-content"`             |
| Details region   | `aria-labelledby`                          | `"{id}-header"`              |
| Group container  | `role`                                     | `"presentation"`             |

IDs are auto-generated per `Accordion` instance. Do not pass `id` manually unless you need
stable IDs for external references (e.g. deep linking) — in that case use the `sx` prop to add a
custom wrapper with your own ID.

### Touch targets

| Size     | Approx. total tap height | Notes                                  |
|----------|--------------------------|----------------------------------------|
| `small`  | ~`37px`                  | Compact — adequate for pointer input   |
| `medium` | ~`46px`                  | Default — meets WCAG 2.2 AA minimum    |
| `large`  | ~`56px`                  | Touch-friendly — preferred on mobile   |

---

## Convenience Exports

```jsx
import {
  DefaultAccordionGroup,  // variant="default"
  SolidAccordionGroup,    // variant="solid"
  LightAccordionGroup,    // variant="light"
} from '@/components/Accordion';
```

---

## Annotated Usage Examples

### Default (unthemed)

```jsx
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from '@/components/Accordion';

<AccordionGroup variant="default" size="medium">
  <Accordion defaultExpanded>
    <AccordionSummary>Getting Started</AccordionSummary>
    <AccordionDetails>
      Follow the installation guide to set up the design system.
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary>Customization</AccordionSummary>
    <AccordionDetails>
      Use design tokens to customize colors and spacing.
    </AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### Solid themed (Primary)

```jsx
// Applies data-theme="Primary" data-surface="Surface" to container.
// All --Surface, --Text, --Border tokens resolve from the Primary theme.
<AccordionGroup variant="solid" color="primary" size="medium">
  <Accordion>
    <AccordionSummary>Section Title</AccordionSummary>
    <AccordionDetails>Section content.</AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### Light themed (Success)

```jsx
// Applies data-theme="Success-Light" to container. No data-surface.
<AccordionGroup variant="light" color="success" size="large">
  <Accordion>
    <AccordionSummary>Confirmation</AccordionSummary>
    <AccordionDetails>Your changes have been saved.</AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### Controlled expanded state (single-open pattern)

```jsx
const [openIndex, setOpenIndex] = useState(0);
const items = ['Section A', 'Section B', 'Section C'];

<AccordionGroup variant="default">
  {items.map((title, i) => (
    <Accordion
      key={i}
      expanded={openIndex === i}
      onChange={(isOpen) => setOpenIndex(isOpen ? i : -1)}
    >
      <AccordionSummary>{title}</AccordionSummary>
      <AccordionDetails>Content for {title}.</AccordionDetails>
    </Accordion>
  ))}
</AccordionGroup>
```

### Disabled item

```jsx
// Disabled items retain opacity 0.5, cannot be focused or toggled.
<AccordionGroup variant="default">
  <Accordion>
    <AccordionSummary>Active Section</AccordionSummary>
    <AccordionDetails>Available content.</AccordionDetails>
  </Accordion>
  <Accordion disabled>
    <AccordionSummary>Locked Section</AccordionSummary>
    <AccordionDetails>This content is inaccessible.</AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### No dividers

```jsx
<AccordionGroup variant="light" color="info" disableDivider>
  <Accordion>
    <AccordionSummary>Item One</AccordionSummary>
    <AccordionDetails>No border between items.</AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary>Item Two</AccordionSummary>
    <AccordionDetails>Seamless layout.</AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### Custom expand icon

```jsx
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// The expandIcon prop replaces the default chevron.
// The component still applies rotate(180deg) — account for this in icon choice.
// For Add/Remove style, manage the icon externally using the expanded state.
<Accordion>
  <AccordionSummary expandIcon={<AddIcon aria-hidden="true" />}>
    Custom Icon Section
  </AccordionSummary>
  <AccordionDetails>Content here.</AccordionDetails>
</Accordion>
```

---

## Do's and Don'ts

### ✅ Do

- Always nest `Accordion` → `AccordionSummary` + `AccordionDetails` inside an `AccordionGroup`.
- Use `data-theme` and `data-surface` attributes exactly as the component applies them — do not
  set them manually on child elements.
- Use `defaultExpanded` to pre-open an item on mount (e.g. the first item in a list).
- Use `variant="large"` for mobile-first or touch-primary layouts.
- Pass `disableDivider` only on the group, never target the divider `border-bottom` via `sx` on
  individual `Accordion` items.
- Apply `onChange` for analytics, URL syncing, or single-open patterns — it fires reliably for
  both controlled and uncontrolled modes.

### ❌ Don't

- Don't use `AccordionSummary` or `AccordionDetails` outside an `AccordionGroup` — they rely
  on context that only the group provides.
- Don't set `color` when `variant="default"` — it has no effect and creates misleading code.
- Don't set `data-theme` or `data-surface` directly on `AccordionGroup` via `sx` or `className`
  overrides — pass `variant` and `color` props and let the component manage the attributes.
- Don't hide `AccordionDetails` via `display: none` in `sx` as a workaround for animation —
  the component intentionally unmounts; if you need animation, wrap children in a transition
  library.
- Don't override `opacity` on disabled accordions — the component handles this at `0.5`.
- Don't omit the `expandIcon` `aria-hidden="true"` if supplying a custom icon — the icon is
  purely decorative; the label comes from the summary text.
- Don't hardcode background or text colors in `sx` overrides on `AccordionSummary` or
  `AccordionDetails` — always use tokens so theming works correctly.

---

## Token Quick Reference

```
── Global (Default variant) ──────────────────────────────────────────
--Background          Group container background
--Border              Group outer border + item dividers
--Text                Open summary text; content text
--Text-Quiet          Closed summary text (Default variant only)
--Surface-Dim         Summary hover background (all variants)
--Focus-Visible       Inset focus ring color (all variants)

── Themed (Solid / Light variants) ───────────────────────────────────
--Surface             Group container background (resolves from data-theme)
--Border              Item dividers (resolves from data-theme)
--Text                All summary and content text (resolves from data-theme)
--Surface-Dim         Summary hover background (resolves from data-theme)

── data-theme values ─────────────────────────────────────────────────
Solid:  Primary | Secondary | Tertiary | Neutral |
        Info-Medium | Success-Medium | Warning-Medium | Error-Medium

Light:  Primary-Light | Secondary-Light | Tertiary-Light | Neutral-Light |
        Info-Light | Success-Light | Warning-Light | Error-Light

── data-surface value (Solid only) ───────────────────────────────────
data-surface="Surface"   Required on Solid variant container
```

---

## File Structure

```
src/components/Accordion/
├── Accordion.js          # AccordionGroup, Accordion, AccordionSummary, AccordionDetails + convenience exports
├── AccordionShowcase.js  # Playground + Accessibility tab
├── Accordion.stories.js  # Storybook stories
├── Accordion.test.js     # Jest + jest-axe tests
└── index.js              # Barrel export
```
