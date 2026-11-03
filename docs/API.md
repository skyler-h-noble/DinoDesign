# Component API — @omni-design/components

Every exported component: purpose, props, required parent, one example. GENERATED from `types/` by `scripts/build-api-doc.mjs` — the same files the published .d.ts come from, so this cannot drift from the types. Do not edit by hand. Do not open `dist/` to learn a prop: if it is not here, the component does not take it. Rules (colour, surfaces, layout) are in `CLAUDE.md`.

Read a section, not the file: search for `### Name`. 72 components.

Conventions: every prop is optional unless marked **required**. "+ `<div>`" means the native attributes of that element pass through (id, className, style, aria-*, data-*, on*). Defaults come from the component source.

## Shared types

- `Theme` = `'Default' \| 'Primary' \| 'Secondary' \| 'Tertiary' \| 'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error' \| 'App-Bar' \| 'Nav-Bar' \| 'Status'` — A region's palette. Lighter / darker is a surface level, not a theme.
- `Surface` = `'Surface-Dimmest' \| 'Surface-Dim' \| 'Surface' \| 'Surface-Bright' \| 'Surface-Brightest' \| 'Container-Lowest' \| 'Container-Low' \| 'Container' \| 'Container-High' \| 'Container-Highest'` — Page levels, darkest → brightest, then the card (container) levels.
- `Color` = `'default' \| 'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` — A component's color, lower case. `default` is the designer's button color, not primary.
- `Size` = `'small' \| 'medium' \| 'large'`
- `ButtonVariant` = `` Color \| `${Color}-outline` \| `${Color}-ghost` \| 'black-white' \| 'black-white-outline' \| 'black-white-ghost' \| 'ghost' \| 'text' \| 'outline' \| 'danger' `` — Solid, outline or ghost in any color; plain ghost / text; black-white. No `-light`.
- `TextColor` = `'standard' \| 'default' \| 'inherit' \| 'quiet' \| 'eyebrow' \| 'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` — Body-text colors. `quiet` is muted copy; `eyebrow` is the section's eyebrow rotation.
- `HeadingColor` = `Exclude<TextColor, 'quiet' \| 'eyebrow'>` — Heading colors: TextColor without quiet / eyebrow (headings need only 3:1).
- `TextStyle` = `'display-large' \| 'display-medium' \| 'display-small' \| 'alt-display-large' \| 'alt-display-medium' \| 'alt-display-small' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'subtitle-large' \| 'subtitle' \| 'subtitle-medium' \| 'subtitle-small' \| 'body-large' \| 'body-large-semibold' \| 'body-large-bold' \| 'body' \| 'body-medium' \| 'body-semibold' \| 'body-medium-semibold' \| 'body-bold' \| 'body-medium-bold' \| 'body-small' \| 'body-small-semibold' \| 'body-small-bold' \| 'caption' \| 'caption-bold' \| 'legal' \| 'legal-semibold' \| 'label-extra-small' \| 'label-small' \| 'label' \| 'label-medium' \| 'label-large' \| 'mobile-nav-label' \| 'eyebrow-small' \| 'eyebrow' \| 'eyebrow-medium' \| 'eyebrow-large' \| 'overline-small' \| 'overline' \| 'overline-medium' \| 'overline-large' \| 'number-small' \| 'number-medium' \| 'number-large' \| 'button-extra-small' \| 'button-small' \| 'button' \| 'button-standard'` — Every text style Typography accepts by name (`overline-*` are the old Eyebrow names).
- `IconShape` = `'rounded' \| 'squircle' \| 'circle' \| 'square' \| 'gem' \| 'pentagon' \| 'heptagon' \| 'diamond' \| 'cookie-4' \| 'cookie-6' \| 'cookie-7' \| 'cookie-9' \| 'cookie-12' \| 'sunny' \| 'flower' \| 'puffy' \| 'arch' \| 'cut-corners' \| 'octagon'`
- `AvatarShape` = `'circle' \| 'squircle' \| 'rounded' \| 'cookie-4' \| 'cookie-6' \| 'cookie-7' \| 'cookie-9' \| 'cookie-12' \| 'flower' \| 'gem' \| 'puffy' \| 'bun'`
- `Breakpoint` = `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`
- `Sx` = `Record<string, unknown> \| Array<Record<string, unknown>>` — MUI's `sx` style object. Layout only — never color, background or radius.

Sections: Layout · Text · Buttons · Inputs · Surfaces · Navigation · Data display · App structure

## Layout

### Section
A page region that paints its theme + surface; everything inside picks contrast-checked colors.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `theme` | `Theme` |  | Palette. Omit to inherit the parent's. |
| `surface` | `Surface` | `'Surface'` | How light the region sits. |
| `as` | `ElementType` | `'section'` | Element to render: 'header', 'footer', 'article', … |
| `padding` | `string \| number` |  | CSS padding, e.g. "80px 24px". |
| `edgeTop` | `string` |  | Shaped top edge — a name from EDGE_NAMES (e.g. 'wave'). |
| `edgeBottom` | `string` |  | Shaped bottom edge — a name from EDGE_NAMES. |
| `edgeHeight` | `number` |  | Edge height in px (overrides edgeSize). |
| `edgeSize` | `Size` | `'large'` | Edge depth preset. |
| `edgeAnimate` | `boolean` | `false` | Animate a repeating edge. |
| `edgeSeed` | `number` | `0` | Seed for edges with randomness. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Section theme="Primary" surface="Surface" padding="80px 24px">
  <H2>Title</H2>
</Section>
```

### Container
Centers content at a max width. Layout only — paints nothing.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `maxWidth` | `Breakpoint \| false` | `'lg'` | Max width breakpoint; false = full width. |
| `disableGutters` | `boolean` | `false` | Remove the side padding. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Container maxWidth="md"><Body>Centered.</Body></Container>
```

### Grid
12-column responsive grid (MUI 7 Grid): a container, and children sized per breakpoint.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `container` | `boolean` | `false` | This element is the grid; its children are the cells. |
| `item` | `boolean` | `false` | MUI 5 spelling; no effect — every child of a container is an item. |
| `spacing` | `number \| string` | `2` | Gap in 8px units (container). |
| `size` | `GridSize \| Partial<Record<Breakpoint, GridSize>>` |  | Columns per breakpoint: `{ xs: 12, md: 4 }`, or one number. |
| `xs` | `GridSize` |  | Legacy per-breakpoint columns; prefer `size`. |
| `sm` | `GridSize` |  |  |
| `md` | `GridSize` |  |  |
| `lg` | `GridSize` |  |  |
| `xl` | `GridSize` |  |  |
| `columns` | `number` |  | Total columns. |
| `rowSpacing` | `number \| string` |  |  |
| `columnSpacing` | `number \| string` |  |  |
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` |  |  |
| `alignItems` | `CSSProperties['alignItems']` |  |  |
| `justifyContent` | `CSSProperties['justifyContent']` |  |  |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` |  |  |
| `offset` | `GridSize \| Partial<Record<Breakpoint, GridSize>>` |  | Columns to skip before this cell. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 4 }}><Card>One</Card></Grid>
  <Grid size={{ xs: 12, md: 8 }}><Card>Two</Card></Grid>
</Grid>
```

### VStack · HStack · Stack
Flex stack with token gaps. VStack = column, HStack = row, Stack = column unless `direction`.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `component` | `ElementType` |  | Element to render — a list is component="ul" with HStack component="li" rows. |
| `spacing` | `number \| string` |  | Gap in 8px units, or a CSS length. |
| `gap` | `number \| string` |  | Alias of spacing. |
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `'column'` |  |
| `alignItems` | `CSSProperties['alignItems']` |  |  |
| `justifyContent` | `CSSProperties['justifyContent']` |  |  |
| `flexWrap` | `CSSProperties['flexWrap']` |  |  |
| `divider` | `ReactNode` |  | Element placed between children. |
| `enforceMinGap` | `boolean` | `true` | Never let the gap fall below the minimum-gap token. |
| `minGapToken` | `string` | `'--min-stack-gap'` | The CSS variable used as the minimum gap. |
| `useFlexGap` | `boolean` | `true` |  |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<VStack spacing={2} alignItems="center">
  <H2>Title</H2>
  <HStack spacing={1}><Button>One</Button><Button>Two</Button></HStack>
</VStack>
```

## Text

### Typography
Any text style by name. Prefer the named components below.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  |  |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` | `'body'` | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` | `false` | One line with an ellipsis. |
| `gutterBottom` | `boolean` | `false` | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Typography textStyle="body-semibold">Semibold body.</Typography>
```

### DisplayLarge · DisplayMedium · DisplaySmall · H1 · H2 · H3 · H4 · H5 · H6 · Heading
Display and heading styles, in --Header colors. H1–H6 render h1–h6; Display* render a div — pass `component="h1"` for the page title. Heading = H4.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `HeadingColor` |  | Header color role (3:1). |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<><DisplayLarge component="h1">Headline</DisplayLarge><H2 color="primary">Section</H2></>
```

### AltDisplayLarge · AltDisplayMedium · AltDisplaySmall
Display sizes painted with the brand's Alt-Display color or gradient (`altMode`, or an ancestor's data-alt-display).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `HeadingColor` |  | Header color role (3:1). |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<AltDisplayLarge component="h1" altMode="gradient">Big idea</AltDisplayLarge>
```

### Body · BodySmall · BodyLarge · BodySemibold · BodySmallSemibold · BodyLargeSemibold · BodyBold · BodySmallBold · BodyLargeBold · Body1 · Body2
Body copy, in standard and semibold. Body has no true bold — use Subtitle. `*Bold` names are aliases of semibold. Body1 = Body, Body2 = BodySmall.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<><Body>Normal copy.</Body><BodySmall color="quiet">Muted note.</BodySmall></>
```

### Subtitle · SubtitleSmall · SubtitleMedium · SubtitleLarge · Subtitle1 · Subtitle2
Bold body text (Body at 700), in --Text. Subtitle = SubtitleMedium; Subtitle1 = SubtitleLarge, Subtitle2 = Subtitle.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Subtitle>Card title</Subtitle>
```

### Caption · CaptionBold · Legal · LegalSemibold
Small print: Caption for captions and metadata, Legal for fine print.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Caption color="quiet">Updated 2 hours ago</Caption>
```

### Label · LabelExtraSmall · LabelSmall · LabelLarge · MobileNavLabel
The Label type style as text. For a form field's label use FormLabel.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Label>Shipping</Label>
```

### Eyebrow · EyebrowSmall · EyebrowMedium · EyebrowLarge · Overline · OverlineSmall · OverlineMedium · OverlineLarge
The small line above a heading. Takes its color from the section (Primary→Secondary, …) — do not recolor. Overline* are its old names.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<VStack spacing={1}><Eyebrow>New</Eyebrow><H2>Title</H2></VStack>
```

### NumberSmall · NumberMedium · NumberLarge
Tabular figures for stats and prices.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<NumberLarge component="p">$49</NumberLarge>
```

### ButtonText · ButtonSmall
The button label style as plain text (not a button). ButtonText is Typography's `Button`, renamed so it does not clash with the real Button.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `TextColor` |  | Color role. Never `style={{ color }}`. |
| `component` | `ElementType` |  | Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). |
| `textStyle` | `TextStyle` |  | Text style by name; the named components set it for you. |
| `altMode` | `'default' \| 'colored' \| 'gradient'` |  | Alt Display only: default \| colored \| gradient. |
| `width` | `'fill' \| 'hug' \| (string & {}) \| number` |  | 'fill' = block, full width; 'hug' = inline. |
| `noWrap` | `boolean` |  | One line with an ellipsis. |
| `gutterBottom` | `boolean` |  | Margin below. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<ButtonText>Label</ButtonText>
```

## Buttons

### Button
Triggers an action. Navigation is a Link. Default variant is `default` (the designer's button), not primary. Ref: `HTMLButtonElement`.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `component` | `ElementType` |  | Element to render; an <a> when `href` is set. |
| `type` | `'button' \| 'submit' \| 'reset'` |  | HTML button type; "button" so a Button in a form does not submit it. |
| `tabIndex` | `number` |  |  |
| `variant` | `ButtonVariant` | `'default'` | Color + shape: `primary`, `primary-outline`, `primary-ghost`, `ghost`, `text`. |
| `size` | `Size` | `'medium'` |  |
| `elevated` | `boolean` | `false` | Shadow at rest. |
| `selected` | `boolean` | `false` | Toggled-on state in a group. |
| `fullWidth` | `boolean` | `false` | Stretch to the container (text buttons only). |
| `disabled` | `boolean` | `false` |  |
| `contentType` | `'text' \| 'iconOnly' \| 'letterNumber' \| 'avatar'` |  | text \| iconOnly \| letterNumber \| avatar — or use the booleans below. |
| `iconOnly` | `boolean` | `false` | Square icon button. Needs aria-label. |
| `letterNumber` | `boolean` | `false` | One letter or digit. Needs aria-label. |
| `avatar` | `boolean` | `false` | Circle holding an initial or person icon. |
| `swatch` | `boolean` | `false` | **Deprecated.** A swatch is not a button — use Swatch. |
| `swatchColor` | `string` |  | **Deprecated.** See `swatch`. |
| `startIcon` | `ReactNode` |  | Alias of startDecorator. |
| `endIcon` | `ReactNode` |  | Alias of endDecorator. |
| `startDecorator` | `ReactNode` |  | Icon or avatar before the label. |
| `endDecorator` | `ReactNode` |  | Icon or avatar after the label. |
| `badge` | `boolean` | `false` | Show a Badge on the button. |
| `badgeContent` | `ReactNode` |  |  |
| `badgeVariant` | `Color` | `'error'` |  |
| `badgeSize` | `Size` |  |  |
| `badgeDot` | `boolean` | `false` | Badge as a dot without content. |
| `badgeMax` | `number` | `99` | Numbers above this show as "max+". |
| `badgeAnchorOrigin` | `{ vertical: 'top' \| 'bottom'; horizontal: 'left' \| 'right' }` |  |  |
| `href` | `string` |  | Makes it a link. |
| `children` | `ReactNode` |  |  |
+ `<button>`

```jsx
<HStack spacing={1}>
  <Button variant="default" onClick={() => {}}>Save</Button>
  <Button variant="default-outline">Cancel</Button>
  <Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button>
</HStack>
```

### ToggleButtonGroup
Segmented single/multi choice. Children are `<Button value="…">` with no `variant` (the group sets it).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `value` | `unknown` |  | Selected value (array when `multiple`). |
| `defaultValue` | `unknown` |  |  |
| `onChange` | `(value: any) => void` |  | Called with the new value (not an event). |
| `multiple` | `boolean` |  | Allow several selected. |
| `allowEmpty` | `boolean` | `false` | Allow deselecting the last selected segment. |
| `separated` | `boolean` | `false` | Gaps between segments instead of a joined bar. |
| `variant` | `'outlined' \| 'light' \| 'ghost'` |  | Unselected segments: outlined, light (brighter surface) or ghost. |
| `color` | `Color` |  | Palette of the selected segment. |
| `size` | `Size` |  |  |
| `fullWidth` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `exclusive` | `boolean` |  | **Deprecated.** Use `multiple` (inverted). |
| `children` | `ReactNode` |  |  |
+ `HTML element`

```jsx
<ToggleButtonGroup value={value} onChange={setValue} size="small">
  <Button value="list" size="small">List</Button>
  <Button value="grid" size="small">Grid</Button>
</ToggleButtonGroup>
```

## Inputs

### TextField
Labelled text field (MUI TextField markup). For the full-featured field use TextInput.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `label` | `ReactNode` |  |  |
| `value` | `string \| number` | `''` |  |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` |  |  |
| `placeholder` | `string` |  |  |
| `error` | `boolean` | `false` | Error state. |
| `errorMessage` | `string` | `''` | Message shown in the error state. |
| `disabled` | `boolean` | `false` |  |
| `helperText` | `ReactNode` | `''` |  |
| `variant` | `string` | `'outlined'` |  |
| `size` | `Size` | `'medium'` |  |
| `type` | `HTMLInputTypeAttribute` | `'text'` |  |
| `required` | `boolean` | `false` |  |
| `fullWidth` | `boolean` | `true` |  |
| `startAdornment` | `ReactNode` |  | Node inside the field, before the text. |
| `endAdornment` | `ReactNode` |  | Node inside the field, after the text. |
| `onFocus` | `FocusEventHandler<HTMLInputElement>` |  |  |
| `onBlur` | `FocusEventHandler<HTMLInputElement>` |  |  |
| `name` | `string` |  |  |
| `id` | `string` |  |  |
| `autoComplete` | `string` |  |  |
| `aria-label` | `string` |  |  |
| `aria-labelledby` | `string` |  |  |
| `className` | `string` |  |  |
| `style` | `CSSProperties` |  |  |

```jsx
<TextField label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)} helperText="We never share it." />
```

## Surfaces

### Card
A card on a Container level; pads itself. Use `href` to make the whole card a link.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `variant` | `'solid' \| 'light' \| 'dark'` | `'solid'` | solid = on a Container level; light / dark = a tinted or deep card in `color`. |
| `color` | `Color` | `'default'` | Palette for light / dark variants. |
| `surface` | `Surface` |  | Inner surface override. |
| `size` | `Size` | `'medium'` | Padding scale. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` |  |
| `clickable` | `boolean` | `false` | Hover / pressed states and pointer cursor. |
| `selected` | `boolean` | `false` |  |
| `elevated` | `boolean` | `false` | Casts a shadow. |
| `draggable` | `boolean` | `false` |  |
| `disabled` | `boolean` | `false` |  |
| `href` | `string` |  | Makes the whole card a link. |
| `onClick` | `MouseEventHandler<HTMLElement>` |  |  |
| `children` | `ReactNode` |  |  |
+ `HTML element`

```jsx
<Card elevated>
  <Subtitle>Card title</Subtitle>
  <BodySmall color="quiet">One sentence.</BodySmall>
</Card>
```

## Navigation

### Link
Inline text link. Without `href` it renders a button that runs `onClick`. No hover color change by design.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `href` | `string` |  |  |
| `target` | `string` |  |  |
| `rel` | `string` |  |  |
| `onClick` | `MouseEventHandler<HTMLElement>` |  | Without href, the link renders as a button that runs this. |
| `textStyle` | `TextStyle \| (string & {})` | `'body'` | Text style name, e.g. 'body-small'. |
| `color` | `string` | `'primary'` | Link color role. |
| `disabled` | `boolean` | `false` |  |
| `visited` | `boolean` | `false` | Force the visited color. |
| `children` | `ReactNode` |  |  |
+ `<a>`

```jsx
<Body>Read the <Link href="/docs">docs</Link>.</Body>
```

## Data display

### Icon
Colors and sizes an icon from @omni-design/icons. Decorative (aria-hidden) unless given aria-label.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `Color` | `'default'` | Icon color role. |
| `size` | `'xs' \| Size \| 'xl'` | `'medium'` |  |
| `fontSize` | `string \| number` |  | Explicit size, overrides `size`. |
| `disabled` | `boolean` |  |  |
| `twoTone` | `boolean` | `false` | Two-tone rendering. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Icon color="primary" size="small"><CheckCircleIcon /></Icon>
```

### IconBadge
An icon on a colored tile (feature cards, stats).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `Color` | `'primary'` | Any Button color. |
| `variant` | `'solid' \| 'light' \| 'dark'` | `'solid'` |  |
| `size` | `Size` | `'medium'` |  |
| `shape` | `IconShape` |  | Tile shape. |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<IconBadge color="primary" variant="light"><HomeIcon /></IconBadge>
```

### Chip
Compact tag, filter or choice. Color and selection are separate axes.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `onKeyDown` | `KeyboardEventHandler<HTMLDivElement>` |  |  |
| `onKeyUp` | `KeyboardEventHandler<HTMLDivElement>` |  |  |
| `variant` | `Color` | `'neutral'` | Palette. |
| `label` | `ReactNode` |  | The text (or pass children). |
| `clickable` | `boolean` | `false` | Hover / pressed states; focusable. |
| `disabled` | `boolean` | `false` |  |
| `selected` | `boolean` | `false` |  |
| `selectionMode` | `'radio' \| 'checkbox'` |  | ARIA role when selectable: radio or checkbox. |
| `onDelete` | `MouseEventHandler<HTMLElement>` |  | Shows a delete button that calls this. |
| `onClick` | `MouseEventHandler<HTMLElement>` |  |  |
| `startDecorator` | `ReactNode` |  |  |
| `endDecorator` | `ReactNode` |  |  |
| `icon` | `ReactNode` |  | MUI's name for the start decorator. |
| `size` | `string` |  | **Deprecated.** Chips have one size. |
| `children` | `ReactNode` |  |  |
+ `HTML element`

```jsx
<HStack spacing={1}>
  <Chip label="Design" />
  <Chip label="Selected" variant="primary" selected clickable onClick={() => {}} />
</HStack>
```

### Avatar
A person or a step number: photo, initials or icon.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `src` | `string` |  | Photo URL. |
| `defaultPhoto` | `boolean` | `false` | Show the built-in placeholder photo. |
| `alt` | `string` |  | Alt text for the photo. |
| `initials` | `string` |  |  |
| `icon` | `ReactNode` |  |  |
| `color` | `Color` | `'default'` |  |
| `size` | `'xxs' \| 'xs' \| Size \| 'xl' \| 'xxl'` | `'medium'` |  |
| `customSize` | `number` |  | Exact size in px. |
| `clickable` | `boolean` | `false` |  |
| `onClick` | `MouseEventHandler<HTMLElement>` |  |  |
| `insideButton` | `boolean` | `false` | Sizing for use inside a Button avatar. |
| `shape` | `AvatarShape` |  |  |
+ `HTML element`

```jsx
<HStack spacing={1}><Avatar initials="JD" color="tertiary" /><Avatar src="/me.jpg" alt="Jane Doe" /></HStack>
```

## App structure

### Footer
Site footer: brand, up to three link columns, social links, copyright.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `color` | `'default' \| 'primary' \| 'primary-dark' \| 'white' \| 'black' \| (string & {})` | `'default'` | default = the designer's dark band. |
| `brand` | `ReactNode` |  |  |
| `address` | `{ company?: string; lines?: string[]; email?: string; phone?: string }` |  |  |
| `columns` | `FooterColumn[]` | `[]` | Up to three: `[{ title, links: [{ label, href }] }]`. |
| `socialLinks` | `FooterSocialLink[]` | `[]` | `[{ url, brand: 'github' }]`. |
| `copyright` | `boolean` | `true` | Show the copyright line. |
| `subscribe` | `{ title?: string; onSubscribe?: (email: string) => void }` |  | Email signup block. |
| `copyrightName` | `string` |  |  |
| `copyrightYear` | `number` |  |  |
| `children` | `ReactNode` |  |  |
+ `<div>`

```jsx
<Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} copyrightName="Acme" />
```

### AppBar · DesktopAppBar · MobileAppBar
Site / app top bar on the App-Bar theme. Links fold into a menu button below `collapseAt`. DesktopAppBar / MobileAppBar are its two modes as components.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `mode` | `'desktop' \| 'mobile'` | `'desktop'` | desktop = site nav; mobile = an app-screen bar (search or title). |
| `size` | `Size` | `'medium'` |  |
| `barColor` | `'default' \| 'primary' \| 'primary-light' \| 'white' \| 'black'` | `'default'` | Leave unset: the bar wears the designer's App-Bar choice. |
| `sticky` | `boolean` | `true` | Stays at the top of its scrolling parent (desktop). |
| `surface` | `Surface` | `'Surface'` |  |
| `brand` | `ReactNode` |  |  |
| `onBrandClick` | `MouseEventHandler<HTMLElement>` |  |  |
| `navLinks` | `Array<AppBarLink \| string>` | `[]` | Site links `{ label, href, current? }` (strings work too). |
| `collapseAt` | `number` | `900` | Width in px below which links fold into a menu. |
| `menuType` | `'auto' \| 'hamburger' \| 'expanded' \| 'none'` | `'auto'` | auto \| hamburger (always) \| expanded (tabs) \| none. |
| `showMenu` | `boolean` | `true` |  |
| `onMenuClick` | `MouseEventHandler<HTMLElement>` |  |  |
| `centerSlot` | `ReactNode` |  | Replaces the middle (links / search). |
| `endSlot` | `ReactNode` |  | Right side actions — a fragment of buttons, primary last. |
| `searchPosition` | `'left' \| 'right' \| 'none'` |  |  |
| `searchValue` | `string` |  |  |
| `onSearchChange` | `(event: ChangeEvent<HTMLInputElement>) => void` |  |  |
| `searchPlaceholder` | `string` | `'Search...'` |  |
| `loginType` | `'login' \| 'avatar' \| 'none'` | `'login'` | Right side when no endSlot: login button, avatar, or nothing. |
| `onLogin` | `() => void` |  |  |
| `onSignOut` | `() => void` |  |  |
| `user` | `{ displayName?: string; photoURL?: string } \| null` |  |  |
| `brandType` | `'name' \| 'logo'` | `'name'` |  |
| `companyName` | `string` | `'Company'` |  |
| `rightButtons` | `Array<{ icon: ReactNode; label?: string; raw?: boolean }>` | `[]` |  |
| `showRightButtons` | `boolean` | `false` |  |
| `layout` | `'left-brand' \| 'center-brand' \| 'title'` |  | Figma's AppBar Layout. |
| `title` | `ReactNode` | `'Page Title'` |  |
| `mobileVariant` | `'search' \| 'small' \| 'medium' \| 'large'` | `'search'` | mode="mobile" only. |
| `subtitle` | `ReactNode` | `'Subtitle text'` | mode="mobile" only. |
| `actionIcon` | `ReactNode` |  | mode="mobile" only: trailing action icon. |
| `children` | `ReactNode` |  |  |
| `className` | `string` | `''` |  |

```jsx
<AppBar brand="Acme"
  navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
  endSlot={<><Button variant="default-outline" size="small">Log in</Button><Button variant="default" size="small">Sign up</Button></>} />
```
