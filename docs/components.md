# Dyno Design System — Component Reference

## Component Manifest

| Component | Category | Variants | Colors | Sizes | WCAG AA |
|---|---|---|---|---|---|
| [Button](#button) | Inputs | solid, outline, light, ghost | 8 | 3 | ✅ |
| [ButtonGroup](#buttongroup) | Inputs | solid, outline, light, ghost | 8 | 3 | ✅ |
| [Checkbox](#checkbox) | Inputs | — | 8 | 3 | ✅ |
| [Input](#input) | Inputs | standard, floating label | 1 | 3 | ✅ |
| [Chip](#chip) | Display | solid, outline | 8 | 3 | ✅ |
| [Stack](#stack) | Layout | 11 sub-variants | — | — | ✅ |
| [Tabs](#tabs) | Navigation | solid, outline, light, ghost | 8 | 3 | ✅ |
| [Card](#card) | Layout | default, solid, light | 8 | — | ✅ |

### Color palette (applies to all `color` props)

`primary` · `secondary` · `tertiary` · `neutral` · `info` · `success` · `warning` · `error`

### Accessibility baseline

All components meet WCAG 2.1 AA. Plain and Ghost variants are excluded from
Checkbox because they fail WCAG 1.4.11 non-text contrast at ≥ 3:1. Focus rings
use `var(--Focus-Visible)` consistently across all interactive components.

---

## Button

Solid, outline, and light variants across all 8 brand colors. Ghost is a
special chromeless variant for low-emphasis actions.

### Import

```jsx
import { Button } from '@dyno/components';
```

### Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `color` | string | `'primary'` | `primary` `secondary` `tertiary` `neutral` `info` `success` `warning` `error` |
| `variant` | string | `'solid'` | `solid` `outline` `light` `ghost` |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `disabled` | boolean | `false` | — |
| `fullWidth` | boolean | `false` | — |
| `startIcon` | node | — | Any React node |
| `endIcon` | node | — | Any React node |
| `onClick` | function | — | — |
| `data-theme` | string | — | Overrides inherited theme |
| `aria-label` | string | — | Required for icon-only buttons |

### CSS variables consumed

```
--Buttons-{Color}-Button    background (solid) / border (outline)
--Buttons-{Color}-Text      foreground text
--Buttons-{Color}-Border    border color
--Buttons-{Color}-Hover     hover background
--Buttons-{Color}-Active    active/pressed background
--Focus-Visible             focus ring outline
```

### Examples

```jsx
// Solid (default)
<Button color="primary">Save</Button>

// Outline
<Button color="secondary" variant="outline">Cancel</Button>

// Light — tinted background, useful on colored surfaces
<Button color="success" variant="light">Confirm</Button>

// Ghost — no background, no border; acts like a hotlink
<Button variant="ghost">Learn more</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="large">Large</Button>

// Icon-only — aria-label required
<Button color="primary" startIcon={<DeleteIcon />} aria-label="Delete item" />

// Full-width
<Button color="primary" fullWidth>Submit</Button>

// Disabled
<Button color="primary" disabled>Unavailable</Button>
```

### Accessibility notes

- Icon-only buttons must have `aria-label`.
- `disabled` sets `aria-disabled="true"` and keeps the button in tab order.
- Focus ring always uses `outline: 2px solid var(--Focus-Visible)` with
  `outline-offset: 2px`.

---

## ButtonGroup

Groups two or more Buttons with consistent variant and size. Supports both
spaced and connected (border-collapsing) layouts.

### Import

```jsx
import { ButtonGroup, Button } from '@dyno/components';
```

### Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `'solid'` | Same as Button |
| `color` | string | `'primary'` | Same as Button |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `orientation` | string | `'horizontal'` | `horizontal` `vertical` |
| `spacing` | number | `0` | `0` = connected, `> 0` = gap in MUI spacing units |
| `disabled` | boolean | `false` | — |
| `fullWidth` | boolean | `false` | — |
| `aria-label` | string | — | Describes the group |

Variant and color props on `ButtonGroup` are passed down to all child `Button`
components. Individual child buttons can override with their own `color` or
`variant` props.

### Examples

```jsx
// Connected solid group
<ButtonGroup color="primary" aria-label="text formatting">
  <Button startIcon={<BoldIcon />} aria-label="Bold" />
  <Button startIcon={<ItalicIcon />} aria-label="Italic" />
  <Button startIcon={<UnderlineIcon />} aria-label="Underline" />
</ButtonGroup>

// Spaced outline group
<ButtonGroup variant="outline" color="neutral" spacing={1} aria-label="view options">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>

// Vertical
<ButtonGroup orientation="vertical" color="secondary">
  <Button>Top</Button>
  <Button>Middle</Button>
  <Button>Bottom</Button>
</ButtonGroup>
```

### Accessibility notes

- Always provide `aria-label` on the group describing its purpose.
- In connected mode (`spacing=0`), borders collapse via negative margin; hovered
  and focused buttons get `z-index: 1` to appear above neighbors.
- Border radius is only applied to the outer edges of first and last buttons.
- Tab navigates sequentially through all buttons.

---

## Checkbox

Single checkbox or group, with optional description. Excludes Plain and Ghost
variants as they fail WCAG 1.4.11 at 3:1 non-text contrast.

### Import

```jsx
import {
  Checkbox,
  CheckboxGroup,
  CheckboxWithDescription,
  IndeterminateCheckbox,
} from '@dyno/components';
```

### Checkbox Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `label` | string | — | — |
| `checked` | boolean | `false` | — |
| `onChange` | function | — | `(event) => void` |
| `color` | string | `'primary'` | Same as Button |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `disabled` | boolean | `false` | — |
| `indeterminate` | boolean | `false` | — |
| `required` | boolean | `false` | — |

### CheckboxGroup Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `options` | array | — | `[{ label, value, disabled? }]` |
| `value` | array | `[]` | Selected values |
| `onChange` | function | — | `(values: string[]) => void` |
| `color` | string | `'primary'` | Same as Button |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `direction` | string | `'vertical'` | `vertical` `horizontal` |
| `disabled` | boolean | `false` | — |

### CheckboxWithDescription Props

Extends Checkbox with a secondary description line below the label.

| Prop | Type | Default |
|---|---|---|
| `label` | string | — |
| `description` | string | — |
| `checked` | boolean | `false` |
| `onChange` | function | — |
| `color` | string | `'primary'` |
| `disabled` | boolean | `false` |

### IndeterminateCheckbox Props

| Prop | Type | Default |
|---|---|---|
| `label` | string | — |
| `checked` | boolean | `false` |
| `indeterminate` | boolean | `false` |
| `onChange` | function | — |
| `disabled` | boolean | `false` |

### CSS variables consumed

```
--Buttons-{Color}-Button    checked fill
--Buttons-{Color}-Border    checked border
--Buttons-{Color}-Text      checkmark icon
--Border                    unchecked border
--Container-Low             hover background
--Text                      label text
--Quiet                     description text (CheckboxWithDescription)
--Focus-Visible             focus ring
```

### Examples

```jsx
// Basic
<Checkbox
  label="Accept terms and conditions"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Error color
<Checkbox label="Required item" color="error" checked={false} />

// Group — vertical (default)
<CheckboxGroup
  options={[
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Push', value: 'push', disabled: true },
  ]}
  value={selected}
  onChange={setSelected}
  color="primary"
/>

// Group — horizontal
<CheckboxGroup
  options={options}
  value={selected}
  onChange={setSelected}
  direction="horizontal"
/>

// With description
<CheckboxWithDescription
  label="Marketing emails"
  description="Receive product updates and promotions"
  checked={marketing}
  onChange={(e) => setMarketing(e.target.checked)}
/>

// Indeterminate (select-all pattern)
<IndeterminateCheckbox
  label="Select all"
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onChange={handleSelectAll}
/>
```

---

## Input

Text input field. Supports standard (label above) and floating (label inside)
label positions, three sizes, and validation states.

### Import

```jsx
import { Input } from '@dyno/components';
```

### Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `label` | string | — | — |
| `value` | string | — | — |
| `onChange` | function | — | `(event) => void` |
| `placeholder` | string | — | — |
| `labelPosition` | string | `'standard'` | `standard` `floating` |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `type` | string | `'text'` | Any HTML input type |
| `validationState` | string | — | `success` `warning` `error` |
| `helperText` | string | — | Shown below input |
| `disabled` | boolean | `false` | — |
| `required` | boolean | `false` | — |
| `fullWidth` | boolean | `true` | — |
| `startAdornment` | node | — | Icon or text before input |
| `endAdornment` | node | — | Icon or text after input |
| `data-surface` | string | `'Container-Lowest'` | Must match parent surface |

### CSS variables consumed

```
--Border                    default border
--Buttons-Primary-Border    focused border
--Buttons-Error-Border      error border
--Buttons-Success-Border    success border
--Buttons-Warning-Border    warning border
--Text                      input text, label (focused/filled)
--Quiet                     placeholder, label (unfocused/empty)
--Container-Lowest          input background
--Focus-Visible             focus ring
```

### Important: data-surface must match

The Input sets `data-surface="Container-Lowest"` on its internal root by default.
This must match the surface of its parent — if the Input sits inside a
`Container-High` card, pass `data-surface="Container-High"` so the background
variable resolves correctly.

```jsx
// Inside a default card
<Input label="Name" value={name} onChange={setName} />

// Inside a Container-High surface
<Input
  label="Name"
  value={name}
  onChange={setName}
  data-surface="Container-High"
/>
```

### Examples

```jsx
// Standard label
<Input label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

// Floating label
<Input label="Password" labelPosition="floating" type="password" value={pw} onChange={setPw} />

// Validation states
<Input label="Username" validationState="success" helperText="Username is available" value={u} />
<Input label="Username" validationState="error" helperText="Already taken" value={u} />
<Input label="Username" validationState="warning" helperText="Username may be taken" value={u} />

// With adornments
<Input
  label="Search"
  startAdornment={<SearchIcon />}
  endAdornment={<ClearIcon />}
  value={query}
  onChange={setQuery}
/>

// Sizes
<Input label="Small" size="small" value={v} />
<Input label="Large" size="large" value={v} />
```

### Accessibility notes

- Label is always rendered in the DOM — never use `placeholder` as a substitute.
- Helper text and validation messages are linked to the input via `aria-describedby`.
- Error state adds `aria-invalid="true"`.

---

## Chip

Non-interactive tags and interactive action chips. Solid and outline styles for
both. Excludes Plain and Ghost variants (fail WCAG 1.4.11).

### Import

```jsx
import { Chip } from '@dyno/components';
```

### Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `label` | string | — | — |
| `color` | string | `'primary'` | Same as Button |
| `variant` | string | `'solid'` | `solid` `outline` |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `clickable` | boolean | `false` | — |
| `deletable` | boolean | `false` | — |
| `onDelete` | function | — | Called when delete icon clicked |
| `onClick` | function | — | Required when `clickable={true}` |
| `icon` | node | — | Leading icon |
| `selected` | boolean | `false` | Visual selected state for clickable chips |
| `disabled` | boolean | `false` | — |

### CSS variables consumed

**Non-clickable solid:** `--Tags-{Color}-BG`, `--Tags-{Color}-Text`

**Non-clickable outline:** `--Tags-{Color}-BG` (border), `--Text`

**Clickable solid:** `--Buttons-{Color}-Button`, `--Buttons-{Color}-Text`,
`--Buttons-{Color}-Hover`, `--Buttons-{Color}-Active`

**Clickable outline:** `--Buttons-{Color}-Border`, `--Text`,
`--Buttons-{Color}-Outline-Hover`, `--Buttons-{Color}-Outline-Active`

### Examples

```jsx
// Non-clickable tag — status indicator
<Chip label="Active" color="success" />
<Chip label="Pending" color="warning" variant="outline" />
<Chip label="Archived" color="neutral" />

// Clickable — filter chip
<Chip
  label="Design"
  color="primary"
  clickable
  selected={selected}
  onClick={() => setSelected(!selected)}
/>

// Deletable
<Chip
  label="React"
  color="info"
  deletable
  onDelete={() => removeTag('react')}
/>

// With icon
<Chip label="Verified" color="success" icon={<CheckIcon />} />

// Sizes
<Chip label="Small" size="small" color="primary" />
<Chip label="Large" size="large" color="secondary" />
```

### Accessibility notes

- Non-clickable chips have `role="status"` by default.
- Clickable chips use `role="button"` and are keyboard operable (Enter / Space).
- Delete button within a chip has `aria-label="Remove {label}"`.

---

## Stack

Flexible layout primitive for arranging children in a row or column with
consistent spacing. Eleven named sub-variants cover the most common layout
patterns.

### Import

```jsx
import {
  Stack,
  HStack,
  VStack,
  CenteredStack,
  SpaceBetweenStack,
  ResponsiveStack,
  GridStack,
  StackDivider,
  InsetStack,
  ScrollStack,
  WrapStack,
} from '@dyno/components';
```

### Stack Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `direction` | string | `'column'` | `row` `column` `row-reverse` `column-reverse` |
| `spacing` | number | `2` | MUI spacing units (multiples of 8px) |
| `alignItems` | string | `'stretch'` | Any CSS `align-items` value |
| `justifyContent` | string | `'flex-start'` | Any CSS `justify-content` value |
| `wrap` | boolean | `false` | Enables `flex-wrap: wrap` |
| `divider` | node | — | Rendered between each child |
| `fullWidth` | boolean | `false` | `width: 100%` |
| `fullHeight` | boolean | `false` | `height: 100%` |

### Named sub-variants

| Component | Equivalent |
|---|---|
| `HStack` | `<Stack direction="row">` |
| `VStack` | `<Stack direction="column">` |
| `CenteredStack` | Row, centered both axes |
| `SpaceBetweenStack` | Row, `justifyContent="space-between"` |
| `WrapStack` | Row with `wrap={true}` |
| `GridStack` | CSS grid wrapper with configurable columns |
| `ScrollStack` | Column with `overflow-y: auto` |
| `InsetStack` | Column with padding inset |
| `StackDivider` | `<Divider>` for use as a `divider` prop value |
| `ResponsiveStack` | Column on mobile, row on desktop |

### Examples

```jsx
// Row of buttons with gap
<HStack spacing={2}>
  <Button color="primary">Save</Button>
  <Button color="neutral" variant="outline">Cancel</Button>
</HStack>

// Form fields
<VStack spacing={3}>
  <Input label="First name" />
  <Input label="Last name" />
  <Input label="Email" />
</VStack>

// Space-between header
<SpaceBetweenStack>
  <Heading>Dashboard</Heading>
  <Button color="primary">New item</Button>
</SpaceBetweenStack>

// Dividers between items
<VStack spacing={0} divider={<StackDivider />}>
  <ListItem />
  <ListItem />
  <ListItem />
</VStack>

// Responsive — column on mobile, row on desktop
<ResponsiveStack spacing={3}>
  <Card>...</Card>
  <Card>...</Card>
</ResponsiveStack>

// Wrapping chips/tags
<WrapStack spacing={1}>
  {tags.map(tag => <Chip key={tag} label={tag} color="primary" />)}
</WrapStack>
```

---

## Tabs

Tabbed navigation and content panels. Supports the same variant × color matrix
as Button.

### Import

```jsx
import { Tabs, TabPanel } from '@dyno/components';
```

### Tabs Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `tabs` | array | — | `[{ label, value, icon?, disabled? }]` |
| `value` | string \| number | — | Active tab value |
| `onChange` | function | — | `(value) => void` |
| `variant` | string | `'solid'` | `solid` `outline` `light` `ghost` `underline` `pill` `segment` |
| `color` | string | `'primary'` | Same as Button |
| `size` | string | `'medium'` | `small` `medium` `large` |
| `orientation` | string | `'horizontal'` | `horizontal` `vertical` |
| `fullWidth` | boolean | `false` | Tabs fill container width |
| `scrollable` | boolean | `false` | Horizontal scroll for overflow |

### TabPanel Props

| Prop | Type | Default |
|---|---|---|
| `value` | string \| number | — |
| `activeValue` | string \| number | — |
| `children` | node | — |
| `keepMounted` | boolean | `false` |

### CSS variables consumed

```
--Buttons-{Color}-Button    active tab background (solid)
--Buttons-{Color}-Text      active tab text (solid)
--Buttons-{Color}-Border    active indicator (underline/outline)
--Buttons-{Color}-Hover     hover state
--Text                      inactive tab text
--Quiet                     inactive tab text (ghost/underline)
--Border                    tab group border
--Focus-Visible             focus ring
```

### Examples

```jsx
const [tab, setTab] = useState('overview');

// Solid tabs
<Tabs
  tabs={[
    { label: 'Overview', value: 'overview' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Settings', value: 'settings' },
  ]}
  value={tab}
  onChange={setTab}
  color="primary"
/>

// Underline style
<Tabs tabs={tabs} value={tab} onChange={setTab} variant="underline" />

// Pill style
<Tabs tabs={tabs} value={tab} onChange={setTab} variant="pill" color="secondary" />

// With panels
<Tabs tabs={tabs} value={tab} onChange={setTab} />
<TabPanel value="overview" activeValue={tab}>
  <p>Overview content</p>
</TabPanel>
<TabPanel value="analytics" activeValue={tab}>
  <p>Analytics content</p>
</TabPanel>

// With icons
<Tabs
  tabs={[
    { label: 'Home', value: 'home', icon: <HomeIcon /> },
    { label: 'Profile', value: 'profile', icon: <PersonIcon /> },
  ]}
  value={tab}
  onChange={setTab}
/>

// Vertical tabs
<HStack spacing={0} alignItems="flex-start">
  <Tabs
    orientation="vertical"
    tabs={tabs}
    value={tab}
    onChange={setTab}
  />
  <TabPanel value={tab} activeValue={tab}>...</TabPanel>
</HStack>
```

### Accessibility notes

- Tabs use `role="tablist"` / `role="tab"` / `role="tabpanel"` markup.
- Arrow keys navigate between tabs when a tab has focus.
- Active tab has `aria-selected="true"`.
- `TabPanel` is linked to its tab via `aria-labelledby`.

---

## Card

Surface container for grouped content. Sets `data-theme` and `data-surface` so
all child components automatically inherit the correct color context.

### Import

```jsx
import { Card } from '@dyno/components';
```

### Props

| Prop | Type | Default | Options |
|---|---|---|---|
| `color` | string | `'neutral'` | Same as Button |
| `variant` | string | `'default'` | `default` `solid` `light` |
| `surface` | string | — | Overrides the resolved surface type |
| `elevation` | number | `2` | `0` – `5` maps to `--Effect-Level-{n}` |
| `padding` | string | `'medium'` | `none` `small` `medium` `large` |
| `radius` | string | `'medium'` | `none` `small` `medium` `large` `full` |
| `data-theme` | string | — | Explicit theme override |
| `data-surface` | string | — | Explicit surface override |
| `onClick` | function | — | Makes card interactive/clickable |
| `selected` | boolean | `false` | Visual selected state |
| `disabled` | boolean | `false` | — |
| `header` | node | — | Rendered in card header slot |
| `footer` | node | — | Rendered in card footer slot |
| `media` | node | — | Full-width media slot (image, video) |

### Variant → data-theme mapping

| variant | color | Resolved data-theme |
|---|---|---|
| `solid` | `primary` | `Primary` |
| `solid` | `secondary` | `Secondary` |
| `light` | `primary` | `Primary-Light` |
| `light` | `secondary` | `Secondary-Light` |
| `default` | any | Inherited from nearest ancestor |

### CSS variables consumed

```
--Container          card background (default/light variants)
--Background         solid variant background
--Text               heading and body text
--Quiet              secondary text
--Border             card border (when elevation=0)
--Effect-Level-{n}   box shadow
--Style-Border-Radius border radius
```

### Examples

```jsx
// Default — inherits theme from parent
<Card>
  <p>Simple content card</p>
</Card>

// Solid Primary — sets its own theme context
<Card variant="solid" color="primary">
  <Button color="primary">Action</Button>
</Card>

// Light Secondary
<Card variant="light" color="secondary" padding="large">
  <VStack spacing={2}>
    <Input label="Name" />
    <Button color="secondary" fullWidth>Submit</Button>
  </VStack>
</Card>

// Elevated
<Card elevation={4}>
  <p>Floating card</p>
</Card>

// With header and footer slots
<Card
  header={<HStack spacing={1}><Avatar /><span>Jane Smith</span></HStack>}
  footer={<HStack spacing={1}><Button variant="outline" color="neutral">Dismiss</Button><Button color="primary">Reply</Button></HStack>}
>
  <p>Card body content goes here.</p>
</Card>

// Clickable / selectable card
<Card onClick={() => setSelected(id)} selected={selectedId === id}>
  <p>Click to select</p>
</Card>

// Nested themes — inner card gets its own context
<Card variant="solid" color="primary">
  <Card variant="default" surface="Container-High">
    <Button color="primary">Inherits Primary-Light context</Button>
  </Card>
</Card>
```

### Theme inheritance behavior

When `variant="default"`, Card uses DOM traversal to find the nearest ancestor
with a `data-theme` attribute and inherits it. This means a default card placed
inside a Primary solid card will automatically use the Primary token set without
any explicit props.

When `variant="solid"` or `variant="light"`, Card sets its own `data-theme`
based on the `color` prop regardless of the surrounding context.

An explicit `data-theme` prop always wins over both.

### Accessibility notes

- Clickable cards have `role="button"` and `tabIndex={0}`.
- Clickable cards are keyboard operable (Enter / Space).
- Selected state sets `aria-pressed="true"` on clickable cards.
- Disabled clickable cards set `aria-disabled="true"`.
