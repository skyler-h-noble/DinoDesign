# Component API — @omni-design/components

Every exported component: purpose, props, required parent, one example. GENERATED from `types/` by `scripts/build-api-doc.mjs` — the same files the published .d.ts come from, so this cannot drift from the types. Do not edit by hand. Do not open `dist/` to learn a prop: if it is not here, the component does not take it. Rules (color, surfaces, layout) are in `CLAUDE.md`.

Read a section, not the file: search for `### Name`. 237 components.

Format: `` `name?: type` = default — meaning``. No `?` means required. "+ `children`" means it takes children; "+ `<div>`" means the native attributes of that element pass through (id, className, style, aria-*, data-*, on*). Defaults come from the component source.

## Shared types

- `Theme` = `'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error' | 'App-Bar' | 'Nav-Bar' | 'Status'` — A region's palette. Lighter / darker is a surface level, not a theme.
- `Surface` = `'Surface-Dimmest' | 'Surface-Dim' | 'Surface' | 'Surface-Bright' | 'Surface-Brightest' | 'Container-Lowest' | 'Container-Low' | 'Container' | 'Container-High' | 'Container-Highest'` — Page levels, darkest → brightest, then the card (container) levels.
- `Color` = `'default' | 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'` — A component's color, lower case. `default` is the designer's button color, not primary.
- `Size` = `'small' | 'medium' | 'large'`
- `ButtonVariant` = `` Color | `${Color}-outline` | `${Color}-ghost` | 'black-white' | 'black-white-outline' | 'black-white-ghost' | 'ghost' | 'text' | 'outline' | 'danger' `` — Solid, outline or ghost in any color; plain ghost / text; black-white. No `-light`.
- `TextColor` = `'standard' | 'default' | 'inherit' | 'quiet' | 'eyebrow' | 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'` — Body-text colors. `quiet` is muted copy; `eyebrow` is the section's eyebrow rotation.
- `HeadingColor` = `Exclude<TextColor, 'quiet' | 'eyebrow'>` — Heading colors: TextColor without quiet / eyebrow (headings need only 3:1).
- `TextStyle` = `'display-large' | 'display-medium' | 'display-small' | 'alt-display-large' | 'alt-display-medium' | 'alt-display-small' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle-large' | 'subtitle' | 'subtitle-medium' | 'subtitle-small' | 'body-large' | 'body-large-semibold' | 'body-large-bold' | 'body' | 'body-medium' | 'body-semibold' | 'body-medium-semibold' | 'body-bold' | 'body-medium-bold' | 'body-small' | 'body-small-semibold' | 'body-small-bold' | 'caption' | 'caption-bold' | 'legal' | 'legal-semibold' | 'label-extra-small' | 'label-small' | 'label' | 'label-medium' | 'label-large' | 'mobile-nav-label' | 'eyebrow-small' | 'eyebrow' | 'eyebrow-medium' | 'eyebrow-large' | 'overline-small' | 'overline' | 'overline-medium' | 'overline-large' | 'number-small' | 'number-medium' | 'number-large' | 'button-extra-small' | 'button-small' | 'button' | 'button-standard'` — Every text style Typography accepts by name (`overline-*` are the old Eyebrow names).
- `IconShape` = `'rounded' | 'squircle' | 'circle' | 'square' | 'gem' | 'pentagon' | 'heptagon' | 'diamond' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'sunny' | 'flower' | 'puffy' | 'arch' | 'cut-corners' | 'octagon'`
- `AvatarShape` = `'circle' | 'squircle' | 'rounded' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'flower' | 'gem' | 'puffy' | 'bun'`
- `Breakpoint` = `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `Sx` = `Record<string, unknown> | Array<Record<string, unknown>>` — MUI's `sx` style object. Layout only — never color, background or radius.

## Helper types

- `AlertColor` = `'info' | 'success' | 'warning' | 'error'`
- `AppBarLink` = `{ label: ReactNode; href?: string; onClick?: MouseEventHandler<HTMLElement>; current?: boolean }`
- `AutocompleteOption` = `string | { label: string; [key: string]: unknown }`
- `AutoHeadingSize` = `'display-large' | 'display-medium' | 'display-small' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`
- `AvatarGroupPerson` = `{ key?: Key; name?: string; detail?: ReactNode; src?: string; initials?: string; href?: string; onClick?: MouseEventHandler<HTMLElement>; disabled?: boolean }`
- `BevelCustom` = `{ angle?: number; depth?: number; softness?: number; bevel?: boolean; shadow?: boolean; shadowDistance?: number; shadowBlur?: number; shadowOpacity?: number }`
- `BevelPreset` = `'Classic' | 'Carved' | 'Embossed' | 'Stamp' | 'Night Cut' | 'Shadow Only' | 'custom'`
- `BevelTheme` = `'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'`
- `BottomNavigationFabAction` = `{ icon?: ReactNode; label?: string; onClick?: () => void; actions?: Array<{ key?: Key; icon?: ReactNode; label?: string; onClick?: () => void }>; disablePortal?: boolean }`
- `BottomNavigationItem` = `{ key?: Key; icon?: ReactNode; label?: string; ariaLabel?: string; disabled?: boolean }`
- `BrandIconDefinition` = `{ icon: [number, number, string[], string, string | string[]] }`
- `ButtonColor` = `Color | 'black-white'`
- `ChartDatum` = `number | { value: number; label?: string }`
- `CloseReason` = `'backdropClick' | 'escapeKeyDown'`
- `FooterColumn` = `{ title: ReactNode; links: FooterLink[] }`
- `FooterLink` = `{ label: ReactNode; href?: string; onClick?: MouseEventHandler<HTMLElement> }`
- `FooterSocialLink` = `{ url: string; label?: string; name?: string; brand?: string; icon?: ReactNode }`
- `LabelPlacement` = `'end' | 'start' | 'top' | 'bottom'`
- `ListItemData` = `{ label?: ReactNode; children?: ReactNode; secondary?: ReactNode; eyebrow?: ReactNode; overline?: ReactNode; image?: string | boolean | ReactNode; imageAlt?: string; startDecorator?: ReactNode; endDecorator?: ReactNode; startDecoratorIsButton?: boolean; endDecoratorIsButton?: boolean; onStartDecoratorAction?: (event: MouseEvent<HTMLButtonElement>) => void; onEndDecoratorAction?: (event: MouseEvent<HTMLButtonElement>) => void; startDecoratorAriaLabel?: string; endDecoratorAriaLabel?: string; clickable?: boolean; disabled?: boolean; selected?: boolean; bottomBorder?: boolean; rightBorder?: boolean; onClick?: MouseEventHandler<HTMLElement> }`
- `MainLayoutNavItem` = `{ label: string; icon?: ReactNode; path?: string }`
- `MoreInfo` = `{ label: string; text?: ReactNode; href?: string; onClick?: MouseEventHandler<HTMLElement> }`
- `RadioOption` = `{ value: string; label: ReactNode; disabled?: boolean }`
- `RailItemData` = `{ icon?: ReactNode; avatar?: ReactNode; label?: string; badge?: boolean | ReactNode; disabled?: boolean }`
- `RailSection` = `{ title?: ReactNode; items: RailItemData[] }`
- `RatioName` = `| '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | '2:3' | '3:2' | '1:2' | '2:1' | '9:21' | '21:9' | '5:7' | '7:5' | '4:5' | '5:4' | '5:3' | '3:5' | '16:10' | '10:16' | 'Golden-Horizontal' | 'Golden-Vertical'`
- `SectionPadding` = `'none' | 'small' | 'medium' | 'large'`
- `SelectOption` = `string | { value: string | number; label: ReactNode; /** Small picture before the label (also shown in the closed field). */ icon?: ReactNode; /** CSS color for mode="color" swatches. */ color?: string; disabled?: boolean; }`
- `SelectOptionGroup` = `{ label: ReactNode; options: SelectOption[] }`
- `ShapeName` = `| 'rounded' | 'squircle' | 'circle' | 'oval' | 'pill' | 'arch' | 'semicircle' | 'heart' | 'ghost' | 'bun' | 'square' | 'slanted' | 'triangle' | 'arrow' | 'fan' | 'diamond' | 'clamshell' | 'pentagon' | 'gem' | 'heptagon' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'sunny' | 'very-sunny' | 'clover-4' | 'clover-8' | 'flower' | 'puffy' | 'puffy-diamond' | 'burst' | 'soft-burst' | 'boom' | 'soft-boom' | 'pixel-circle' | 'pixel-triangle' | 'cut-corners' | 'cut-two' | 'octagon' | 'one-corner' | 'notch' | 'scallop'`
- `SidebarItem` = `{ label: ReactNode; icon?: ReactNode; badge?: ReactNode; tooltip?: string; divider?: boolean; submenu?: Array<{ label: ReactNode; icon?: ReactNode }> }`
- `SliderMark` = `{ value: number; label?: ReactNode }`
- `SpeedDialAction` = `{ name?: string; icon?: ReactNode; onClick?: (index: number) => void; key?: Key; className?: string }`
- `TableColumn` = `{ label?: ReactNode; header?: ReactNode; field?: string; key?: string; width?: number | string }`
- `TabValue` = `string | number`
- `TextFieldGroupField` = `{ id: string | number }`
- `ToolbarItem` = `{ icon: ReactNode; label: string; key?: Key }`
- `TreeItem` = `{ id: string; label: ReactNode; icon?: ReactNode; swatch?: string; badge?: ReactNode; toggle?: boolean; divider?: boolean; disabled?: boolean; className?: string; sx?: Sx; children?: TreeItem[] }`

Sections: Provider · Layout · Text · Buttons · Inputs · Selection · Dates · Surfaces · Navigation · Overlays · Feedback · Data display · Media · Charts · App structure · Utilities

## Provider

### OmniDesignProvider
Loads a design system's CSS and puts theme / style / surface / dark mode on the root. Wrap the app once.

- `themeURL?: string` — Theme folder or theme.json URL (OMNI_DEFAULT_THEME_URL for the package's own). Without it the page renders unstyled.
- `foundationCSS?: string` — foundation.css — URL or raw CSS. The per-file props are for local dev; prefer themeURL.
- `coreCSS?: string`
- `typographyCSS?: string`
- `lightModeCSS?: string`
- `darkModeCSS?: string`
- `baseCSS?: string`
- `stylesCSS?: string` — styles.css, loaded last.
- `defaultTheme?: Theme` = `'Default'` — Root data-theme; overrides theme.json.
- `defaultStyle?: 'Professional' | 'Modern' | 'Bold' | 'Playful'` = `'Modern'` — Root data-style (shape language); overrides theme.json.
- `defaultSurface?: Surface` = `'Surface'` — Root data-surface; overrides theme.json.
- `surfaceStyle?: 'light-tonal' | 'grey-professional' | 'dark-professional'` — Preset root theme + surface; wins over defaultTheme / defaultSurface.
- `defaultDarkMode?: boolean | 'system'` = `false` — Initial dark mode (uncontrolled). `'system'` follows the device's light/dark setting, live, until the user toggles.
- `persistDarkMode?: boolean | string` = `false` — Remember the user's toggle in localStorage and restore it next visit. `true` uses the key `omni-dark-mode`; a string is the key.
- `darkTheme?: Theme | null` = `null` — Root data-theme in dark mode; unset keeps the light theme.
- `darkMode?: boolean` — Controlled dark mode; pair with onDarkModeChange.
- `onDarkModeChange?: (dark: boolean) => void` — Called with the requested dark-mode value when toggled while controlled.
- `className?: string`
- `style?: CSSProperties`
- `fullHeight?: boolean` = `true` — min-height: 100vh on the root.
- `linkComponent?: ElementType` — The router's link (react-router's Link, Next's Link). Internal hrefs on Button, Card, Link, Tab, BreadcrumbItem render through it, receiving `to` and `href`.
- `navigate?: (href: string, event: MouseEvent) => void` — Called on a plain left click of an internal href instead of a page load. Ignored for full URLs, mailto:/tel:, #anchors, target and download.
+ `children`

```jsx
<OmniDesignProvider themeURL="https://example.com/acme/theme.json">
  <Body>App</Body>
</OmniDesignProvider>
```

### ThemedZone
Sets data-theme / data-surface without painting — for something that paints itself (a bar you build). To paint a region use Section.

- `theme?: Theme`
- `surface?: Surface`
- `as?: ElementType` = `'div'` — Element to render.
+ `children`, `<div>`

```jsx
<ThemedZone theme="App-Bar" surface="Surface" as="header">
  <H6>Brand</H6>
</ThemedZone>
```

### Surfaced
Sets only data-surface (keeps the inherited theme), without painting.

- `surface?: Surface`
- `as?: ElementType` = `'div'` — Element to render.
+ `children`, `<div>`

```jsx
<Surfaced surface="Container-High"><Body>Text tuned for that level.</Body></Surfaced>
```

## Layout

### Section
A page region that paints its theme + surface; everything inside picks contrast-checked colors.

- `theme?: Theme` — Palette. Omit to inherit the parent's.
- `surface?: Surface` = `'Surface'` — How light the region sits.
- `as?: ElementType` = `'section'` — Element to render: 'header', 'footer', 'article', …
- `padding?: SectionPadding | (string & {}) | number` — Named rhythm — `small` (40 / 32 on phones), `medium` (64 / 40), `large` (96 / 56), sides 24 / 16 — from the Sizing tokens; use these so sections share one rhythm. Or any CSS padding for a one-off.
- `paddingTop?: SectionPadding` — Named size for the top edge only, e.g. the first section under the header.
- `paddingBottom?: SectionPadding` — Named size for the bottom edge only.
- `edgeTop?: string` — Shaped top edge — a name from EDGE_NAMES (e.g. 'wave').
- `edgeBottom?: string` — Shaped bottom edge — a name from EDGE_NAMES.
- `edgeHeight?: number` — Edge height in px (overrides edgeSize).
- `edgeSize?: Size` = `'large'` — Edge depth preset.
- `edgeAnimate?: boolean` = `false` — Animate a repeating edge.
- `edgeSeed?: number` = `0` — Seed for edges with randomness.
+ `children`, `<div>`

```jsx
<Section theme="Primary" surface="Surface" padding="large">
  <H2>Title</H2>
</Section>
```

### Container
Centers content at a max width. Layout only — paints nothing.

- `maxWidth?: Breakpoint | false` = `'lg'` — Max width breakpoint; false = full width.
- `disableGutters?: boolean` = `false` — Remove the side padding.
+ `children`, `<div>`

```jsx
<Container maxWidth="md"><Body>Centered.</Body></Container>
```

### Grid
12-column responsive grid (MUI 7 Grid): a container, and children sized per breakpoint.

- `container?: boolean` = `false` — This element is the grid; its children are the cells.
- `item?: boolean` = `false` — MUI 5 spelling; no effect — every child of a container is an item.
- `spacing?: number | string` = `2` — Gap in 8px units (container).
- `size?: GridSize | Partial<Record<Breakpoint, GridSize>>` — Columns per breakpoint: `{ xs: 12, md: 4 }`, or one number.
- `xs?: GridSize` — Legacy per-breakpoint columns; prefer `size`.
- `sm?: GridSize`
- `md?: GridSize`
- `lg?: GridSize`
- `xl?: GridSize`
- `columns?: number` — Total columns.
- `rowSpacing?: number | string`
- `columnSpacing?: number | string`
- `direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'`
- `alignItems?: CSSProperties['alignItems']`
- `justifyContent?: CSSProperties['justifyContent']`
- `wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'`
- `offset?: GridSize | Partial<Record<Breakpoint, GridSize>>` — Columns to skip before this cell.
+ `children`, `<div>`

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 4 }}><Card>One</Card></Grid>
  <Grid size={{ xs: 12, md: 8 }}><Card>Two</Card></Grid>
</Grid>
```

### VStack · HStack · Stack
Flex stack with token gaps. VStack = column, HStack = row, Stack = column unless `direction`.

- `component?: ElementType` — Element to render — a list is component="ul" with HStack component="li" rows.
- `spacing?: number | string` — Gap in 8px units, or a CSS length.
- `gap?: number | string` — Alias of spacing.
- `direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'` = `'column'`
- `alignItems?: CSSProperties['alignItems']`
- `justifyContent?: CSSProperties['justifyContent']`
- `flexWrap?: CSSProperties['flexWrap']`
- `divider?: ReactNode` — Element placed between children.
- `enforceMinGap?: boolean` = `true` — Never let the gap fall below the minimum-gap token.
- `minGapToken?: string` = `'--min-stack-gap'` — The CSS variable used as the minimum gap.
- `useFlexGap?: boolean` = `true`
+ `children`, `<div>`

```jsx
<VStack spacing={2} alignItems="center">
  <H2>Title</H2>
  <HStack spacing={1}><Button>One</Button><Button>Two</Button></HStack>
</VStack>
```

### Box
A region that sets theme + surface (paints --Background), with optional radius, elevation and aspect ratio — Figma's Box. Use for a non-card block.

- `theme?: Theme`
- `surface?: Surface`
- `radius?: 'none' | Size` = `'none'` — Corner from the Card radius tokens.
- `elevation?: 0 | 1 | 2 | 3 | 4 | 5` = `0` — Shadow level 0–5.
- `ratio?: RatioName | number` — Aspect ratio: a RATIO_NAMES name ('16:9') or a number (width / height).
- `component?: ElementType` = `'div'` — Element to render.
+ `children`, `<div>`

```jsx
<Box theme="Secondary" surface="Surface-Bright" radius="medium" elevation={2}><Body>Callout</Body></Box>
```

### OmniStack · DynoStack · CenteredStack · SpaceBetweenStack · WrapStack · GridStack · InsetStack · ScrollStack
Preset stacks: OmniStack (= Stack), CenteredStack (column, centered), SpaceBetweenStack (row, spread), WrapStack / GridStack (wrapping row), InsetStack (16px side padding), ScrollStack (scrolls vertically). DynoStack is OmniStack's old name.

Props: same as `VStack`.

```jsx
<SpaceBetweenStack><Subtitle>Total</Subtitle><Body>$49</Body></SpaceBetweenStack>
```

### ResponsiveStack
Column on small screens, row from `breakpoint` up.

- `breakpoint?: Exclude<Breakpoint, 'xs'>` = `'sm'` — Breakpoint at which the stack turns into a row.
- `component?: ElementType` — Element to render — a list is component="ul" with HStack component="li" rows.
- `spacing?: number | string` — Gap in 8px units, or a CSS length.
- `gap?: number | string` — Alias of spacing.
- `direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'` = `'column'`
- `alignItems?: CSSProperties['alignItems']`
- `justifyContent?: CSSProperties['justifyContent']`
- `flexWrap?: CSSProperties['flexWrap']`
- `divider?: ReactNode` — Element placed between children.
- `enforceMinGap?: boolean` = `true` — Never let the gap fall below the minimum-gap token.
- `minGapToken?: string` = `'--min-stack-gap'` — The CSS variable used as the minimum gap.
- `useFlexGap?: boolean` = `true`
+ `children`, `<div>`

```jsx
<ResponsiveStack spacing={2} breakpoint="md"><Card>One</Card><Card>Two</Card></ResponsiveStack>
```

### StackDivider
A full-width 1px --Border line between stack rows. For a themed rule use Divider.

- `sx?: Sx`
+ `<div>`

```jsx
<VStack><Body>One</Body><StackDivider /><Body>Two</Body></VStack>
```

## Text

### Typography
Any text style by name. Prefer the named components below.

- `color?: TextColor`
- `component?: ElementType` — Element to render (keep one h1 per page: `<DisplayLarge component="h1">`).
- `textStyle?: TextStyle` = `'body'` — Text style by name; the named components set it for you.
- `altMode?: 'default' | 'colored' | 'gradient'` — Alt Display only: default | colored | gradient.
- `width?: 'fill' | 'hug' | (string & {}) | number` — 'fill' = block, full width; 'hug' = inline.
- `noWrap?: boolean` = `false` — One line with an ellipsis.
- `gutterBottom?: boolean` = `false` — Margin below.
+ `children`, `<div>`

```jsx
<Typography textStyle="body-semibold">Semibold body.</Typography>
```

### DisplayLarge · DisplayMedium · DisplaySmall · H1 · H2 · H3 · H4 · H5 · H6 · Heading
Display and heading styles, in --Header colors. H1–H6 render h1–h6; Display* render a div — pass `component="h1"` for the page title. Every page has exactly one h1 (category, product and cart pages too); for titles below it use AutoHeading, whose level comes from nesting. Heading = H4.

- `color?: HeadingColor` — Header color role (3:1).
- `component?: ElementType` — Element to render (keep one h1 per page: `<DisplayLarge component="h1">`).
- `textStyle?: TextStyle` — Text style by name; the named components set it for you.
- `altMode?: 'default' | 'colored' | 'gradient'` — Alt Display only: default | colored | gradient.
- `width?: 'fill' | 'hug' | (string & {}) | number` — 'fill' = block, full width; 'hug' = inline.
- `noWrap?: boolean` — One line with an ellipsis.
- `gutterBottom?: boolean` — Margin below.
+ `children`, `<div>`

```jsx
<><DisplayLarge component="h1">Headline</DisplayLarge><H2 color="primary">Section</H2></>
```

### AutoHeading
A title whose level comes from nesting, not from its look: h1 outside any Section, one level deeper inside each `Section` / `HeadingLevel` (h2 in a page band, h3 in a Section nested in one), capped at h6 — so titles cannot skip a level. Use it for every section, panel and card title; keep the page title an explicit `H1` (or `component="h1"`). Pick the look with `size`.

- `size?: AutoHeadingSize` — The look. Defaults to the style of the level it renders (h2 → 'h2'); the tag stays the level.
- `color?: HeadingColor` — Header color role (3:1).
- `width?: 'fill' | 'hug' | (string & {}) | number` — 'fill' = block, full width; 'hug' = inline.
- `noWrap?: boolean` — One line with an ellipsis.
- `gutterBottom?: boolean` — Margin below.
+ `children`, `<h1–h6>`

```jsx
<Section padding="large">
  <AutoHeading>Featured</AutoHeading>
  <Card><AutoHeading size="h5">Order summary</AutoHeading></Card>
</Section>
```

### HeadingLevel
Makes the AutoHeadings inside it one level deeper without painting anything — for a subsection that is not a Section (a card's sub-titles, a sidebar). `level` sets the level outright.

- `level?: 1 | 2 | 3 | 4 | 5 | 6` — Set the level (1–6) for the titles inside, instead of one deeper than outside.
+ `children`

```jsx
<Card>
  <AutoHeading>Checkout</AutoHeading>
  <HeadingLevel><AutoHeading>Shipping</AutoHeading></HeadingLevel>
</Card>
```

### AltDisplayLarge · AltDisplayMedium · AltDisplaySmall
Display sizes painted with the brand's Alt-Display color or gradient (`altMode`, or an ancestor's data-alt-display).

Props: same as `DisplayLarge`.

```jsx
<AltDisplayLarge component="h1" altMode="gradient">Big idea</AltDisplayLarge>
```

### Body · BodySmall · BodyLarge · BodySemibold · BodySmallSemibold · BodyLargeSemibold · BodyBold · BodySmallBold · BodyLargeBold · Body1 · Body2
Body copy, in standard and semibold. Body has no true bold — use Subtitle. `*Bold` names are aliases of semibold. Body1 = Body, Body2 = BodySmall.

- `color?: TextColor` — Color role. Never `style={{ color }}`.
- `component?: ElementType` — Element to render (keep one h1 per page: `<DisplayLarge component="h1">`).
- `textStyle?: TextStyle` — Text style by name; the named components set it for you.
- `altMode?: 'default' | 'colored' | 'gradient'` — Alt Display only: default | colored | gradient.
- `width?: 'fill' | 'hug' | (string & {}) | number` — 'fill' = block, full width; 'hug' = inline.
- `noWrap?: boolean` — One line with an ellipsis.
- `gutterBottom?: boolean` — Margin below.
+ `children`, `<div>`

```jsx
<><Body>Normal copy.</Body><BodySmall color="quiet">Muted note.</BodySmall></>
```

### Subtitle · SubtitleSmall · SubtitleMedium · SubtitleLarge · Subtitle1 · Subtitle2
Bold body text (Body at 700), in --Text. Subtitle = SubtitleMedium; Subtitle1 = SubtitleLarge, Subtitle2 = Subtitle.

Props: same as `Body`.

```jsx
<Subtitle>Card title</Subtitle>
```

### Caption · CaptionBold · Legal · LegalSemibold
Small print: Caption for captions and metadata, Legal for fine print.

Props: same as `Body`.

```jsx
<Caption color="quiet">Updated 2 hours ago</Caption>
```

### Label · LabelExtraSmall · LabelSmall · LabelLarge · MobileNavLabel
The Label type style as text. For a form field's label use FormLabel.

Props: same as `Body`.

```jsx
<Label>Shipping</Label>
```

### Eyebrow · EyebrowSmall · EyebrowMedium · EyebrowLarge · Overline · OverlineSmall · OverlineMedium · OverlineLarge
The small line above a heading. Takes its color from the section (Primary→Secondary, …) — do not recolor. Overline* are its old names.

Props: same as `Body`.

```jsx
<VStack spacing={1}><Eyebrow>New</Eyebrow><H2>Title</H2></VStack>
```

### NumberSmall · NumberMedium · NumberLarge
Tabular figures for stats and prices.

Props: same as `Body`.

```jsx
<NumberLarge component="p">$49</NumberLarge>
```

### ButtonText · ButtonSmall
The button label style as plain text (not a button). ButtonText is Typography's `Button`, renamed so it does not clash with the real Button.

Props: same as `Body`.

```jsx
<ButtonText>Label</ButtonText>
```

## Buttons

### Button
Triggers an action. Navigation is a Link. Default variant is `default` (the designer's button), not primary. Ref: `HTMLButtonElement`.

- `component?: ElementType` — Element to render; an <a> when `href` is set.
- `type?: 'button' | 'submit' | 'reset'` — HTML button type; "button" so a Button in a form does not submit it.
- `tabIndex?: number`
- `variant?: ButtonVariant` = `'default'` — Color + shape: `primary`, `primary-outline`, `primary-ghost`, `ghost`, `text`.
- `size?: Size` = `'medium'`
- `elevated?: boolean` = `false` — Shadow at rest.
- `selected?: boolean` = `false` — Toggled-on state in a group.
- `fullWidth?: boolean` = `false` — Stretch to the container (text buttons only).
- `disabled?: boolean` = `false`
- `contentType?: 'text' | 'iconOnly' | 'letterNumber' | 'avatar'` — text | iconOnly | letterNumber | avatar — or use the booleans below.
- `iconOnly?: boolean` = `false` — Square icon button. Needs aria-label.
- `letterNumber?: boolean` = `false` — One letter or digit. Needs aria-label.
- `avatar?: boolean` = `false` — Circle holding an initial or person icon.
- `swatch?: boolean` = `false` — **Deprecated.** A swatch is not a button — use Swatch.
- `swatchColor?: string` — **Deprecated.** See `swatch`.
- `startIcon?: ReactNode` — Alias of startDecorator.
- `endIcon?: ReactNode` — Alias of endDecorator.
- `startDecorator?: ReactNode` — Icon or avatar before the label.
- `endDecorator?: ReactNode` — Icon or avatar after the label.
- `badge?: boolean` = `false` — Show a Badge on the button.
- `badgeContent?: ReactNode`
- `badgeVariant?: Color` = `'error'`
- `badgeSize?: Size`
- `badgeDot?: boolean` = `false` — Badge as a dot without content.
- `badgeMax?: number` = `99` — Numbers above this show as "max+".
- `badgeAnchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' }`
- `href?: string` — Makes it a link.
- `reloadDocument?: boolean` = `false` — Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router.
+ `children`, `<button>`

```jsx
<HStack spacing={1}>
  <Button variant="default" onClick={() => {}}>Save</Button>
  <Button variant="default-outline">Cancel</Button>
  <Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button>
</HStack>
```

### ToggleButtonGroup
Segmented single/multi choice. Children are `<Button value="…">` with no `variant` (the group sets it).

- `value?: unknown` — Selected value (array when `multiple`).
- `defaultValue?: unknown`
- `onChange?: (value: any) => void` — Called with the new value (not an event).
- `multiple?: boolean` — Allow several selected.
- `allowEmpty?: boolean` = `false` — Allow deselecting the last selected segment.
- `separated?: boolean` = `false` — Gaps between segments instead of a joined bar.
- `variant?: 'outlined' | 'light' | 'ghost'` — Unselected segments: outlined, light (brighter surface) or ghost.
- `color?: Color` — Palette of the selected segment.
- `size?: Size`
- `fullWidth?: boolean`
- `disabled?: boolean`
- `exclusive?: boolean` — **Deprecated.** Use `multiple` (inverted).
+ `children`, `HTML element`

```jsx
<ToggleButtonGroup value={value} onChange={setValue} size="small">
  <Button value="list" size="small">List</Button>
  <Button value="grid" size="small">Grid</Button>
</ToggleButtonGroup>
```

### ToggleButton
A single pressed / not-pressed button (aria-pressed), e.g. Bold in an editor. A row of exclusive options is ToggleButtonGroup. Ref: `HTMLButtonElement`.

- `selected?: boolean` = `false`
- `onChange?: (event: MouseEvent<HTMLButtonElement>, value: string | number | undefined) => void` — Called with the event and this button's value.
- `onClick?: (event: MouseEvent<HTMLButtonElement>, value: string | number | undefined) => void` — Called first; preventDefault() skips onChange.
- `value?: string | number`
- `color?: 'standard' | Color` = `'standard'` — MUI's palette name; only sets a class.
- `size?: Size` = `'medium'`
- `fullWidth?: boolean` = `false`
- `disabled?: boolean` = `false`
- `disableFocusRipple?: boolean` — MUI compatibility; no effect (there is no ripple).
- `disableRipple?: boolean` — MUI compatibility; no effect (there is no ripple).
- `tabIndex?: number` = `0`
+ `children`, `<button>`

```jsx
<ToggleButton value="bold" selected={checked} onChange={() => setChecked(!checked)} aria-label="Bold"><FormatBoldIcon /></ToggleButton>
```

### DefaultToggleButtonGroup · PrimaryToggleButtonGroup · SecondaryToggleButtonGroup · TertiaryToggleButtonGroup · NeutralToggleButtonGroup · BlackWhiteToggleButtonGroup · InfoToggleButtonGroup · SuccessToggleButtonGroup · WarningToggleButtonGroup · ErrorToggleButtonGroup
ToggleButtonGroup with its `color` fixed, one export per Buttons mode.

+ all `ToggleButtonGroup` props

```jsx
<PrimaryToggleButtonGroup value={value} onChange={setValue}>
  <Button value="day">Day</Button>
  <Button value="week">Week</Button>
</PrimaryToggleButtonGroup>
```

### ButtonGroup
A row of related actions, each Button with its own onClick; separated by default. For a selected-one-of-many control use ToggleButtonGroup.

- `variant?: 'outlined' | 'light' | 'ghost'` = `'outlined'` — Segment shape; light lifts unselected segments to a brighter surface.
- `color?: ButtonColor` = `'default'`
- `size?: Size` = `'medium'`
- `disabled?: boolean` = `false`
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'`
- `separated?: boolean` = `true` — false (joined) is ToggleButtonGroup's look; here it warns and stays separated.
- `spacing?: number | string` — Explicit gap (overrides the platform spacer).
- `fit?: 'hug' | 'fill' | 'equal'` — hug = each button its own width; fill = share the container; equal = all as wide as the widest.
- `fullWidth?: boolean` = `false` — Alias of fit="fill".
- `equalWidth?: boolean` = `false` — Alias of fit="equal".
- `multiple?: boolean` = `false` — **Deprecated.** Selection moved to ToggleButtonGroup.
- `allowEmpty?: boolean` = `true` — **Deprecated.** Selection moved to ToggleButtonGroup.
- `value?: unknown` — **Deprecated.** Selection moved to ToggleButtonGroup.
- `defaultValue?: unknown` — **Deprecated.** Selection moved to ToggleButtonGroup.
- `onChange?: (value: string | number | Array<string | number> | null, event: MouseEvent<HTMLButtonElement>) => void` — **Deprecated.** Selection moved to ToggleButtonGroup. Called with (next, event).
- `aria-label?: string` — Names the group (adds role="group").
+ `children`, `<div>`

```jsx
<ButtonGroup aria-label="Text alignment">
  <Button onClick={() => {}}>Left</Button>
  <Button onClick={() => {}}>Center</Button>
</ButtonGroup>
```

### Fab
Floating action button: the one primary action on a screen. `default` resolves to the Tertiary palette. Needs a name (`label` or `ariaLabel`). Ref: `HTMLButtonElement`.

- `icon?: ReactNode` — The icon (default: a plus). Same as `children`.
- `label?: ReactNode` — Text shown when `extended`; also the accessible name.
- `variant?: 'solid'` = `'solid'` — **Deprecated.** Only `solid` exists; others warn.
- `color?: Color` = `'default'`
- `size?: Size` = `'medium'`
- `extended?: boolean` = `false` — Pill with icon + `label`.
- `animate?: boolean` = `false` — Gentle pulse (off under reduced motion).
- `disabled?: boolean` = `false`
- `onClick?: MouseEventHandler<HTMLButtonElement>`
- `ariaLabel?: string` — Accessible name; falls back to `label`.
+ `children`, `<button>`

```jsx
<Fab ariaLabel="Compose message"><EditIcon /></Fab>
```

### ShapeButton
Expressive icon button in a shape that can morph to another when selected / hovered / pressed. Needs `label` or aria-label. Ref: `HTMLButtonElement`.

- `shape?: AvatarShape` = `'circle'` — Resting shape (one of AVATAR_SHAPES).
- `morphTo?: 'circle' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'flower' | 'puffy' | 'sunny' | 'very-sunny' | 'clover-4' | 'clover-8' | 'soft-burst' | 'soft-boom' | 'heart'` — Shape to morph into (one of MORPH_TARGET_SHAPES).
- `morphOn?: 'selected' | 'hover' | 'press'` = `'selected'` — What triggers the morph.
- `selected?: boolean` = `false`
- `label?: ReactNode` — Text below the shape; also the name.
- `imageSrc?: string` — Image masked to the shape instead of a fill.
- `imageAlt?: string` = `''`
- `color?: Color` = `'primary'`
- `size?: Size` = `'medium'`
- `disabled?: boolean` = `false`
- `onClick?: MouseEventHandler<HTMLButtonElement>`
- `children?: ReactNode` — The icon.
+ `<button>`

```jsx
<ShapeButton shape="cookie-6" morphTo="circle" selected={checked} onClick={() => setChecked(!checked)} aria-label="Add to favorites"><FavoriteIcon /></ShapeButton>
```

### SpeedDial
A FAB that fans out a few related actions. Controlled with `open` + onOpen/onClose, or uncontrolled.

- `actions?: SpeedDialAction[]` = `[]` — `[{ name, icon, onClick(index), key? }]`.
- `variant?: 'solid'` = `'solid'` — **Deprecated.** Only `solid` exists; others warn.
- `color?: Color` = `'default'`
- `direction?: 'up' | 'down' | 'left' | 'right'` = `'up'` — Which way the actions fan out.
- `size?: Size` = `'medium'`
- `speed?: number` = `50` — Stagger between actions, in ms.
- `openOnHover?: boolean` = `true` — Open on hover (pointer devices only).
- `showTooltips?: boolean` = `true` — Tooltips with each action's name.
- `disablePortal?: boolean` = `false` — Render labels in place instead of on document.body (scaled previews).
- `open?: boolean` — Controlled open state.
- `onOpen?: () => void`
- `onClose?: () => void`
- `icon?: ReactNode` — Main button icon (default: a plus that rotates).
- `ariaLabel?: string` = `'Speed Dial'` — Accessible name of the main button.
- `disabled?: boolean` = `false`
+ `<div>`

```jsx
<SpeedDial ariaLabel="Create"
  actions={[{ name: 'Note', icon: <NoteAddIcon />, onClick: () => {} }, { name: 'Photo', icon: <PhotoCameraIcon />, onClick: () => {} }]} />
```

### Toolbar
A bar of icon actions, one selectable at a time (selection is the item INDEX). Unset `color` wears the designer's Nav-Bar theme.

- `items?: ToolbarItem[]` = `[]` — `[{ icon, label, key? }]` — label is the item's accessible name.
- `value?: number | null` — Selected item index; null for none.
- `defaultValue?: number | null`
- `onChange?: (index: number | null) => void` — Called with the new index, or null when the selected item is clicked again.
- `type?: 'floating' | 'contextual'` = `'floating'` — floating = shadowed pill; contextual = flat, inline.
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'`
- `color?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'primary-light' | 'white' | 'black'` — Theme; leave unset for Nav-Bar. Legacy primary-light / white / black still resolve.
- `surface?: 'Surface-Dimmest' | 'Surface-Dim' | 'Surface' | 'Surface-Bright' | 'Surface-Brightest'` — Lightness level (page levels only).
- `fab?: { icon?: ReactNode; label?: string; onClick?: MouseEventHandler<HTMLButtonElement>; color?: Color; size?: Size }` — A Fab beside a floating toolbar.
+ `<div>`

```jsx
<Toolbar value={value} onChange={setValue}
  items={[{ icon: <FormatBoldIcon />, label: 'Bold' }, { icon: <FormatItalicIcon />, label: 'Italic' }]} />
```

## Inputs

### TextField
Labelled text field (MUI TextField markup). For the full-featured field use TextInput.

- `label?: ReactNode`
- `value?: string | number` = `''`
- `onChange?: ChangeEventHandler<HTMLInputElement>`
- `placeholder?: string`
- `error?: boolean` = `false` — Error state.
- `errorMessage?: string` = `''` — Message shown in the error state.
- `disabled?: boolean` = `false`
- `helperText?: ReactNode` = `''`
- `variant?: string` = `'outlined'`
- `size?: Size` = `'medium'`
- `type?: HTMLInputTypeAttribute` = `'text'`
- `required?: boolean` = `false`
- `fullWidth?: boolean` = `true`
- `startAdornment?: ReactNode` — Node inside the field, before the text.
- `endAdornment?: ReactNode` — Node inside the field, after the text.
- `onFocus?: FocusEventHandler<HTMLInputElement>`
- `onBlur?: FocusEventHandler<HTMLInputElement>`
- `name?: string`
- `id?: string`
- `autoComplete?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `className?: string`
- `style?: CSSProperties`

```jsx
<TextField label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)} helperText="We never share it." />
```

### TextInput
The full-featured text field: label (top / left / floating), helper text, validation, adornments, prefix/suffix, multiline.

- `variant?: 'default'` = `'default'` — **Deprecated.** Removed — a field has one edge. Use `validation` for colored edges.
- `size?: Size` = `'medium'`
- `label?: ReactNode`
- `labelPosition?: 'standard' | 'floating' | 'left'` = `'standard'` — standard = above the field; floating = inside, rises on focus; left = beside it.
- `labelType?: 'default' | 'required' | 'optional'` = `'default'` — Required / optional marker on the label.
- `placeholder?: string`
- `helperText?: ReactNode` — Quiet hint under the field.
- `validation?: 'error' | 'warning' | 'success' | 'info'` — Colors the edge and shows `validationMessage` with an icon.
- `validationMessage?: ReactNode`
- `disabled?: boolean` = `false`
- `id?: string` — Generated when omitted, so the label always points at the field.
- `value?: string | number`
- `defaultValue?: string | number`
- `onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>`
- `name?: string`
- `type?: HTMLInputTypeAttribute` = `'text'` — HTML input type.
- `multiline?: boolean` = `false` — Render a <textarea>.
- `rows?: number`
- `maxRows?: number` — With a start/end adornment, the textarea grows up to this many rows (default 8).
- `resize?: 'none' | 'vertical' | 'both' | 'horizontal' | 'block' | 'inline'` — Textarea resize grip. Defaults to vertical, or none (auto-grow) with adornments.
- `startAdornment?: ReactNode` — Icon or button inside the field, before the text.
- `endAdornment?: ReactNode` — Icon or button inside the field, after the text (e.g. an InputDecorator).
- `prefix?: ReactNode` — Text set tight before the value: "$".
- `suffix?: ReactNode` — Text set tight after the value: "%".
- `fullWidth?: boolean` = `false`
- `` inputProps?: InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string> `` = `{}` — Attributes for the inner <input> / <textarea>.
- `onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>`
- `onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>`
+ `<div>`

```jsx
<TextInput label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)}
  helperText="We never share it." validation="error" validationMessage="Enter a valid email." />
```

### InputDecorator
A square ghost button for a field's end adornment (show password, clear, copy). Icon-only children need aria-label. Ref: `HTMLButtonElement`.

Props: same as `Button`.

```jsx
<TextInput label="Password" type="password"
  endAdornment={<InputDecorator aria-label="Show password"><VisibilityIcon /></InputDecorator>} />
```

### EmailTextField · PasswordTextField · SearchTextField · NumberTextField · PhoneTextField · URLTextField
TextField preset with a type, label and placeholder already set. Every TextField prop works.

Props: same as `TextField`.

```jsx
<><EmailTextField value={text} onChange={(e) => setText(e.target.value)} /><PasswordTextField /></>
```

### TextArea
Multi-line text: TextInput with `multiline`. Takes every TextInput prop, plus TextField's error / errorMessage.

- `error?: boolean` = `false` — Same as validation="error".
- `errorMessage?: string` = `''` — Message for `error`.
- `variant?: 'default'` — **Deprecated.** Removed — a field has one edge. Use `validation` for colored edges.
- `size?: Size`
- `label?: ReactNode`
- `labelPosition?: 'standard' | 'floating' | 'left'` — standard = above the field; floating = inside, rises on focus; left = beside it.
- `labelType?: 'default' | 'required' | 'optional'` — Required / optional marker on the label.
- `placeholder?: string`
- `helperText?: ReactNode` — Quiet hint under the field.
- `validation?: 'error' | 'warning' | 'success' | 'info'` — Colors the edge and shows `validationMessage` with an icon.
- `validationMessage?: ReactNode`
- `disabled?: boolean`
- `id?: string` — Generated when omitted, so the label always points at the field.
- `value?: string | number`
- `defaultValue?: string | number`
- `onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>`
- `name?: string`
- `type?: HTMLInputTypeAttribute` — HTML input type.
- `multiline?: boolean` — Render a <textarea>.
- `rows?: number` = `4`
- `maxRows?: number` — With a start/end adornment, the textarea grows up to this many rows (default 8).
- `resize?: 'none' | 'vertical' | 'both' | 'horizontal' | 'block' | 'inline'` — Textarea resize grip. Defaults to vertical, or none (auto-grow) with adornments.
- `startAdornment?: ReactNode` — Icon or button inside the field, before the text.
- `endAdornment?: ReactNode` — Icon or button inside the field, after the text (e.g. an InputDecorator).
- `prefix?: ReactNode` — Text set tight before the value: "$".
- `suffix?: ReactNode` — Text set tight after the value: "%".
- `fullWidth?: boolean` = `true`
- `` inputProps?: InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string> `` — Attributes for the inner <input> / <textarea>.
- `onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>`
- `onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>`
+ `<div>`

```jsx
<TextArea label="Message" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
```

### TextFieldGroup
A column of TextFields rendered from data.

- `fields?: TextFieldGroupField[]` = `[]` — TextField props, each with an `id`.
- `spacing?: number` = `2` — Gap as a --Spacing-N step.
+ `<div>`

```jsx
<TextFieldGroup fields={[{ id: 'first', label: 'First name' }, { id: 'last', label: 'Last name' }]} />
```

### TextAreaField
A labelled textarea: FormLabel + TextArea, with the requirement announced on the field. Other props go to the TextArea.

- `labelPosition?: 'top' | 'left' | 'floating' | 'none'` = `'top'` — none = no visible label (a string label becomes aria-label).
- `type?: 'default' | 'required' | 'optional'` = `'default'` — Label marker: required / optional.
- `moreInfo?: MoreInfo` — `{ label, text?, href?, onClick? }` — label names the field for screen readers.
+ all `TextArea` props

```jsx
<TextAreaField label="Notes" type="optional" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
```

### SearchField
A search box with a clear button. onChange gets the string, not the event; Enter calls onSubmit.

- `value?: string`
- `defaultValue?: string` = `''`
- `onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `onFocus?: FocusEventHandler<HTMLInputElement>`
- `onBlur?: FocusEventHandler<HTMLInputElement>`
- `onClear?: () => void` — After the clear button empties the field.
- `onSubmit?: (value: string, event: KeyboardEvent<HTMLInputElement>) => void` — On Enter.
- `placeholder?: string` = `'Search\u2026'`
- `size?: Size` = `'medium'`
- `color?: Color` = `'default'` — Edge palette while active.
- `showClearButton?: boolean` = `true`
- `disabled?: boolean` = `false`
- `ariaLabel?: string` = `'Search'` — Accessible name of the input.
+ `<div>`

```jsx
<SearchField value={text} onChange={(v) => setText(v)} onSubmit={(v) => console.log(v)} ariaLabel="Search products" />
```

### NumberField
Numeric stepper field with − / + buttons and arrow-key stepping, clamped to min/max. onChange gets the number.

- `value?: number`
- `defaultValue?: number` = `0`
- `onChange?: (value: number) => void` — Called with the clamped number.
- `min?: number`
- `max?: number`
- `step?: number` = `1`
- `variant?: 'outlined' | 'spinner'` = `'outlined'` — outlined = buttons beside the field; spinner = stacked arrows.
- `style?: string` — **Deprecated.** Has no effect; kept so old call sites compile.
- `color?: string` — **Deprecated.** Has no effect; kept so old call sites compile.
- `size?: Size` = `'medium'`
- `label?: ReactNode`
- `labelPosition?: 'top' | 'left' | 'floating' | 'none'` = `'top'`
- `placeholder?: string`
- `helperText?: ReactNode`
- `type?: 'default' | 'required' | 'optional'` = `'default'` — Label marker: required / optional.
- `moreInfo?: MoreInfo` — `{ label, text?, href?, onClick? }` — label names the field for screen readers.
- `validation?: 'error' | 'warning' | 'success' | 'info'`
- `validationMessage?: ReactNode`
- `disabled?: boolean` = `false`
- `fullWidth?: boolean` = `false`
+ `<div>`

```jsx
<NumberField label="Quantity" min={1} max={10} value={value} onChange={(n) => setValue(n)} />
```

### FieldButton
The small square button beside a field (NumberField's steppers). Give icon children an aria-label. Ref: `HTMLButtonElement`.

- `variant?: 'ghost' | 'outline'` = `'ghost'` — ghost = surface fill; outline = the palette's button fill and edge.
- `color?: Color | 'black-white'` = `'default'`
- `size?: Size` = `'medium'`
+ `<button>`

```jsx
<FieldButton aria-label="Increase"><AddIcon /></FieldButton>
```

### FormLabel
A field label (the Label type style) with required / optional marker and a more-info link. For a group of controls use as="legend" (or FieldGroup).

- `htmlFor?: string` — id of the control it names. Required with as="label".
- `id?: string` — id for the label itself, for controls named via aria-labelledby.
- `type?: 'default' | 'required' | 'optional'` = `'default'`
- `as?: 'label' | 'legend'` = `'label'` — label for one control; legend for a fieldset.
- `moreInfo?: MoreInfo` — `{ label, text?, href?, onClick? }` — label names the field for screen readers.
- `disabled?: boolean` = `false`
+ `children`, `<div>`

```jsx
<FormLabel htmlFor="email" type="required">Email</FormLabel>
```

### InputMessage
A validation message chip (icon + text) on its state's theme.

- `type?: 'error' | 'warning' | 'success' | 'info'` = `'error'`
- `withIcon?: boolean` = `true`
+ `children`, `<div>`

```jsx
<InputMessage type="error">Enter a valid email.</InputMessage>
```

### FormHelper
The line under a field: helper text and/or a validation message. Pair with useFormHelperIds for aria-describedby.

- `helperText?: ReactNode`
- `showHelper?: boolean` = `true`
- `validation?: 'none' | 'error' | 'warning' | 'success' | 'info'` = `'none'`
- `validationMessage?: ReactNode`
- `withIcon?: boolean` = `true`
- `helperId?: string` — id for the helper text (aria-describedby target).
- `messageId?: string` — id for the validation message.
+ `<div>`

```jsx
<FormHelper helperText="8+ characters." validation="error" validationMessage="Too short." />
```

### FieldGroup
A fieldset of related controls (radios, checkboxes) with a legend, helper and validation for the set.

- `label?: ReactNode` — The legend.
- `type?: 'default' | 'required' | 'optional'` = `'default'`
- `moreInfo?: MoreInfo` — `{ label, text?, href?, onClick? }` — label names the field for screen readers.
- `helperText?: ReactNode`
- `showHelper?: boolean` = `true`
- `validation?: 'none' | 'error' | 'warning' | 'success' | 'info'` = `'none'`
- `validationMessage?: ReactNode`
- `orientation?: 'vertical' | 'horizontal'` = `'vertical'`
- `disabled?: boolean` = `false`
+ `children`, `HTML element`

```jsx
<FieldGroup label="Delivery" type="required">
  <Radio name="delivery" value="std" label="Standard" />
  <Radio name="delivery" value="exp" label="Express" />
</FieldGroup>
```

### Select
A dropdown picker with a portalled list (escapes clipping). onChange gets the value, not an event. mode="color" shows swatches.

- `options?: Array<SelectOption | SelectOptionGroup>` = `[]` — Strings, `{ value, label, icon?, color?, disabled? }`, or groups `{ label, options }`.
- `value?: string | number`
- `defaultValue?: string | number` = `''`
- `onChange?: (value: string | number) => void` — Called with the chosen option's value.
- `label?: ReactNode`
- `labelPosition?: 'top' | 'left' | 'floating' | 'none'` = `'top'`
- `size?: Size` = `'medium'`
- `variant?: 'outline' | 'light'` = `'outline'` — **Deprecated.** 'light' was removed and never did anything.
- `color?: Color` = `'default'` — Palette of the selected / hovered row in the list.
- `selectionStyle?: 'default' | 'solid' | 'light'` = `'default'` — Selected-row style. 'light' was removed.
- `mode?: 'standard' | 'color'` = `'standard'` — standard = text options; color = swatch options (option.color).
- `placeholder?: string` = `'Select\u2026'`
- `showDividers?: boolean` = `false` — Divider between options.
- `showColorLabels?: boolean` = `true` — mode="color": show the label beside each swatch.
- `startDecoration?: ReactNode` — Icon or avatar at the start of the field.
- `disabled?: boolean` = `false`
- `fullWidth?: boolean` = `false`
- `minWidth?: number` = `140` — Trigger min width in px.
+ `<div>`

```jsx
<Select label="Size" value={value} onChange={setValue}
  options={[{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, 'Large']} />
```

### Autocomplete
A text field that filters a list of options as you type. onChange gets the option (or null); freeSolo accepts any text.

- `options?: AutocompleteOption[]` = `[]` — Strings or `{ label, ... }` objects.
- `value?: AutocompleteOption | null`
- `defaultValue?: AutocompleteOption | null` = `null`
- `onChange?: (option: AutocompleteOption | null) => void` — Called with the chosen option, or null when cleared.
- `inputValue?: string` — The typed text (controlled).
- `onInputChange?: (text: string) => void`
- `label?: ReactNode`
- `labelPosition?: 'top' | 'floating' | 'none'` = `'top'`
- `placeholder?: string` = `'Type to search'`
- `helperText?: ReactNode`
- `size?: Size` = `'medium'`
- `variant?: 'outline' | 'light'` = `'outline'` — **Deprecated.** 'light' was removed and never did anything.
- `color?: Color` = `'primary'` — Palette of the highlighted option.
- `loading?: boolean` = `false` — Show a spinner in the list.
- `loadingText?: ReactNode` = `'Loading\u2026'`
- `noOptionsText?: ReactNode` = `'No options'`
- `freeSolo?: boolean` = `false` — Accept text that matches no option.
- `clearable?: boolean` = `true` — Show a clear button.
- `disabled?: boolean` = `false`
- `fullWidth?: boolean` = `false`
+ `<div>`

```jsx
<Autocomplete label="Country" options={['Canada', 'France', 'Japan']} value={value} onChange={setValue} />
```

### DropZone
A file drop target that also opens the file picker on click or Enter. onFiles gets a File[].

- `onFiles?: (files: File[]) => void`
- `accept?: string` — File input accept string: "image/*,.pdf".
- `multiple?: boolean` = `false`
- `size?: Size` = `'medium'`
- `disabled?: boolean` = `false`
- `icon?: ReactNode` — Replaces the upload icon.
- `label?: ReactNode`
- `sublabel?: ReactNode`
- `children?: ReactNode` — Replaces the default icon + labels.
+ `<div>`

```jsx
<DropZone accept="image/*" multiple onFiles={(files) => console.log(files)} label="Drop images here" sublabel="or click to browse" />
```

### Swatch
A color chip. With onClick it is a toggle button (aria-pressed); without, a display swatch.

- `color?: string` — Any CSS color — user data, not a theme token.
- `label?: ReactNode` — The color's name, shown under the chip and used as its accessible name.
- `size?: Size` = `'medium'`
- `fit?: 'fixed' | 'fill'` = `'fixed'` — fixed = its own width; fill = stretch to the slot.
- `selected?: boolean` = `false`
- `disabled?: boolean` = `false`
- `radio?: boolean` = `false` — Mark selection with a radio instead of a check (clickable swatches only).
- `onClick?: MouseEventHandler<HTMLElement>` — Makes it clickable.
+ `HTML element`

```jsx
<Swatch color="rebeccapurple" label="Purple" selected={checked} onClick={() => setChecked(!checked)} />
```

### SwatchField
A Swatch with a field label (top / bottom / left / right). Other props go to the Swatch.

- `label?: ReactNode` — The field label; omit for the swatch alone.
- `labelPosition?: 'top' | 'bottom' | 'left' | 'right'` = `'top'`
- `swatchLabel?: ReactNode` — The Swatch's own label (the color's name).
+ all `Swatch` props

```jsx
<SwatchField label="Accent" swatchLabel="Teal" color="teal" onClick={() => {}} />
```

### MiniSwatch
The tiny decorative color chip inside a menu or select row (aria-hidden).

- `color?: string` — Any CSS color.
- `sx?: Sx`
+ `<div>`

```jsx
<MiniSwatch color="tomato" />
```

## Selection

### Checkbox
An on/off choice among independent options. For one setting that applies immediately use Switch.

- `variant?: ButtonColor` = `'default'` — Color only — a Checkbox has one look. The old -outline / -light / -solid shapes warn and render solid.
- `indeterminate?: boolean` = `false` — Shows the mixed (–) state; aria-checked="mixed".
- `error?: boolean` = `false` — Error border + aria-invalid. Pair with a FormHelper message.
- `aria-describedby?: string`
- `slotProps?: { input?: InputHTMLAttributes<HTMLInputElement> }` — Input slot overrides, as MUI's slotProps.input.
- `color?: string` = `'primary'` — **Deprecated.** MUI's palette prop; only names a class. Use `variant`.
- `label?: ReactNode` — Text beside the control; also its accessible name.
- `labelPlacement?: LabelPlacement` = `'end'`
- `size?: Size` = `'medium'`
- `checked?: boolean` — Controlled state.
- `defaultChecked?: boolean` — Uncontrolled initial state.
- `disabled?: boolean` = `false`
- `onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void` — Called with the event and the new checked state.
- `name?: string`
- `value?: string | number`
- `id?: string`
- `inputRef?: Ref<HTMLInputElement>`
- `autoFocus?: boolean`
- `required?: boolean` = `false`
- `readOnly?: boolean`
- `tabIndex?: number`
- `onFocus?: FocusEventHandler<HTMLElement>`
- `onBlur?: FocusEventHandler<HTMLElement>`
- `inputProps?: InputHTMLAttributes<HTMLInputElement>` = `{}` — Extra attributes for the <input>.
- `aria-label?: string` — Name the control when there is no visible label.
- `aria-labelledby?: string`
+ `<span>`

```jsx
<Checkbox label="Email me updates" checked={checked} onChange={(e, next) => setChecked(next)} />
```

### Radio · RadioInput
One choice from a set. Usually rendered by RadioGroup from `options`; a standalone Radio joins the nearest RadioGroup. RadioInput is its old name.

- `theme?: Theme` — Sets data-theme on the control.
- `surface?: Surface` — Sets data-surface on the control.
- `color?: ButtonColor` = `'default'`
- `aria-describedby?: string`
- `slotProps?: { input?: InputHTMLAttributes<HTMLInputElement> }` — Input slot overrides, as MUI's slotProps.input.
- `label?: ReactNode` — Text beside the control; also its accessible name.
- `labelPlacement?: LabelPlacement` = `'end'`
- `size?: Size` = `'medium'`
- `checked?: boolean` — Controlled state.
- `defaultChecked?: boolean` — Uncontrolled initial state.
- `disabled?: boolean` = `false`
- `onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void` — Called with the event and the new checked state.
- `name?: string`
- `value?: string | number`
- `id?: string`
- `inputRef?: Ref<HTMLInputElement>`
- `autoFocus?: boolean`
- `required?: boolean` = `false`
- `readOnly?: boolean`
- `tabIndex?: number`
- `onFocus?: FocusEventHandler<HTMLElement>`
- `onBlur?: FocusEventHandler<HTMLElement>`
- `inputProps?: InputHTMLAttributes<HTMLInputElement>` = `{}` — Extra attributes for the <input>.
- `aria-label?: string` — Name the control when there is no visible label.
- `aria-labelledby?: string`
+ `<span>`

```jsx
<Radio label="Express" value="express" checked={value === 'express'} onChange={() => setValue('express')} />
```

### RadioGroup
A labelled set of radios (a fieldset with a legend) built from `options`. Controlled (`value`) or uncontrolled (`defaultValue`).

- `label?: ReactNode` — The legend.
- `options?: RadioOption[]` = `[]` — `[{ value, label, disabled? }]`.
- `value?: string`
- `defaultValue?: string`
- `onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void` — Called with the event and the chosen option's value.
- `color?: ButtonColor` = `'default'`
- `size?: Size` = `'medium'`
- `orientation?: 'vertical' | 'horizontal'` = `'vertical'`
- `labelPlacement?: LabelPlacement` = `'end'` — Passed to every radio.
- `disabled?: boolean` = `false`
- `spacing?: number | string` = `1` — Gap: a number is 8px units, a string is a CSS length.
- `name?: string` — Group name; generated when omitted.
+ `<div>`

```jsx
<RadioGroup label="Shipping" value={value} onChange={(e, next) => setValue(next)}
  options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />
```

### SwitchInput · Switch
A setting that takes effect immediately (role="switch"). Switch and SwitchInput are the same component.

- `` variant?: Color | `${Color}-outline` `` = `'default'` — Color of the on state; `{color}-outline` for the outline track. `-light` warns and renders solid.
- `icon?: ReactNode` — Glyph in the thumb both ways; false hides the default check / close glyphs.
- `iconOn?: ReactNode` — Glyph in the thumb when on.
- `iconOff?: ReactNode` — Glyph in the thumb when off.
- `color?: string` = `'primary'` — **Deprecated.** MUI's palette prop; only names a class. Use `variant`.
- `label?: ReactNode` — Text beside the control; also its accessible name.
- `labelPlacement?: LabelPlacement` = `'end'`
- `size?: Size` = `'medium'`
- `checked?: boolean` — Controlled state.
- `defaultChecked?: boolean` — Uncontrolled initial state.
- `disabled?: boolean` = `false`
- `onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void` — Called with the event and the new checked state.
- `name?: string`
- `value?: string | number`
- `id?: string`
- `inputRef?: Ref<HTMLInputElement>`
- `autoFocus?: boolean`
- `required?: boolean` = `false`
- `readOnly?: boolean`
- `tabIndex?: number`
- `onFocus?: FocusEventHandler<HTMLElement>`
- `onBlur?: FocusEventHandler<HTMLElement>`
- `inputProps?: InputHTMLAttributes<HTMLInputElement>` — Extra attributes for the <input>.
- `aria-label?: string` — Name the control when there is no visible label.
- `aria-labelledby?: string`
+ `<span>`

```jsx
<Switch label="Dark mode" checked={checked} onChange={(e, next) => setChecked(next)} />
```

### SliderInput · Slider · RangeSlider
Pick a number (or a range: pass an array `value`). SliderInput and RangeSlider are the same component — a range is just a two-number value. Figma's Type maps to `value` + `fill`: single = a number, double = `[low, high]`, `-inverted` = `fill="inverted"`; Orientation = `orientation`. A range's thumbs are named "… minimum" / "… maximum" unless `getAriaLabel` names them.

- `theme?: Theme` — Sets data-theme on the control.
- `surface?: Surface` — Sets data-surface on the control.
- `variant?: Color` = `'default'` — Fill color.
- `size?: Size` = `'medium'`
- `value?: number | number[]` — A number, or [low, high] for a range.
- `defaultValue?: number | number[]`
- `onChange?: (event: Event | SyntheticEvent, value: number | number[], activeThumb: number) => void` — While dragging: event, new value, index of the moved thumb.
- `onChangeCommitted?: (event: Event | SyntheticEvent, value: number | number[]) => void` — On release: the final value.
- `min?: number` = `0`
- `max?: number` = `100`
- `step?: number | null` = `1` — null = snap only to the `marks` values.
- `marks?: boolean | SliderMark[]` = `false` — true = a tick per step; or `[{ value, label? }]` for the values worth labelling.
- `valueLabelDisplay?: 'auto' | 'on' | 'off'` = `'auto'` — auto = while hovered / dragged / focused; on = always, as Figma draws it.
- `valueLabelPosition?: 'top' | 'bottom' | 'left' | 'right'` — top / bottom (horizontal), left / right (vertical).
- `valueLabelFormat?: string | ((value: number, index: number) => ReactNode)` = `Identity` — Text of the value label, or a formatter. A formatter's text is also the aria-valuetext.
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'` — Figma's Orientation. Vertical runs bottom (min) to top (max); give it a height.
- `fill?: 'standard' | 'inverted' | 'normal'` — Fill from the start to the thumb, or between a range's thumbs (standard); the other side(s) (inverted).
- `track?: 'standard' | 'inverted' | 'normal' | false` = `'standard'` — MUI's name for `fill`. false is retired and renders standard.
- `disabled?: boolean` = `false`
- `label?: ReactNode` — Visible label; also the accessible name.
- `labelPosition?: 'top' | 'bottom'` = `'top'`
- `name?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-valuetext?: string`
- `getAriaLabel?: (index: number) => string` — Per-thumb accessible name (ranges).
- `getAriaValueText?: (value: number, index: number) => string`
- `scale?: (value: number) => number` = `Identity` — Map the linear value before display (e.g. log scale).
- `disableSwap?: boolean` = `false` — Stop thumbs crossing each other.
- `shiftStep?: number` = `10` — Step for Shift+Arrow and PageUp/Down.
- `tabIndex?: number`
- `slotProps?: { input?: InputHTMLAttributes<HTMLInputElement> }`
+ `<span>`

```jsx
<><Slider label="Volume" value={value} onChange={(e, next) => setValue(next)} />
<RangeSlider label="Price" defaultValue={[20, 80]} min={0} max={100} />
<Slider label="Treble" defaultValue={36} orientation="vertical" fill="inverted" style={{ height: 140 }} /></>
```

### RatingInput · Rating
Five-star rating; click the current value again to clear it.

- `theme?: Theme` — Sets data-theme.
- `surface?: Surface` — Sets data-surface.
- `value?: number | null` — Stars, 0–5; null = no rating.
- `defaultValue?: number | null`
- `onChange?: (value: number | null) => void` — Called with the new value (not an event); null when cleared.
- `max?: number` — **Deprecated.** Always five stars; other values warn.
- `precision?: 1 | 0.5` = `1` — 1 = whole stars, 0.5 = halves.
- `color?: Color` = `'default'`
- `size?: Size` = `'medium'`
- `readOnly?: boolean` = `false` — Display only.
- `disabled?: boolean` = `false`
- `emptyLabel?: string` = `'No rating'` — Announced when there is no rating.
- `label?: ReactNode`
- `labelPosition?: 'top' | 'bottom'` = `'top'`
+ `<div>`

```jsx
<Rating label="Your rating" value={value} onChange={setValue} precision={0.5} />
```

## Dates

### DatePicker
Inline month calendar for one date or a range (`selectionMode="range"`, value `[start, end]`). Keyboard: arrows, Home/End, PageUp/Down.

- `value?: Date | null | [Date | null, Date | null]` = `null` — A Date (single) or [start, end] (range); null for none.
- `onChange?: (value: Date | [Date, Date | null]) => void` — Called with the Date, or [start, end] in range mode (end null after the first click).
- `selectionMode?: 'single' | 'range'` = `'single'`
- `defaultMonth?: Date` — First month shown (uncontrolled).
- `month?: Date` — Shown month (controlled).
- `onMonthChange?: (month: Date) => void` — Called with the first day of the newly shown month.
- `minDate?: Date`
- `maxDate?: Date`
- `isDateDisabled?: (date: Date) => boolean` — Return true to disable a day.
- `today?: Date` — Override "today" (tests, time zones).
- `weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6` = `0` — 0 = Sunday … 6 = Saturday.
- `color?: Color` = `'default'`
- `locale?: string` — BCP 47 locale for month and weekday names.
+ `<div>`

```jsx
<DatePicker value={value} onChange={setValue} minDate={new Date(2026, 0, 1)} />
```

### DayCell
One day of a calendar — the building block DatePicker draws; use it to build a custom calendar. Ref: `HTMLButtonElement`.

- `day?: ReactNode` — The number shown.
- `selection?: 'default' | 'today' | 'selected' | 'range-start' | 'range-middle' | 'range-end'` = `'default'` — Range ends get a half band, range-middle a full one; today is a ring.
- `color?: Color` = `'default'`
- `disabled?: boolean` = `false`
- `focusable?: boolean` = `true` — false = tabIndex -1 (roving focus).
- `onClick?: MouseEventHandler<HTMLButtonElement>`
- `cellProps?: HTMLAttributes<HTMLDivElement>` = `{}` — Attributes for the 36px cell wrapper (e.g. role="gridcell"); the rest go to the button.
+ `<button>`

```jsx
<DayCell day={14} selection="selected" onClick={() => {}} aria-label="14 March 2026" />
```

## Surfaces

### Card
A card on a Container level; pads itself. Use `href` to make the whole card a link. A linked card is named by its content — never add `aria-label` to it. Leave `color` unset so cards take their section's theme; never vary it across a row of cards.

- `variant?: 'solid' | 'light' | 'dark'` = `'solid'` — solid = on a Container level; light / dark = a tinted or deep card in `color`.
- `color?: Color` = `'default'` — Palette for light / dark variants.
- `surface?: Surface` — Inner surface override.
- `size?: Size` = `'medium'` — Padding scale.
- `orientation?: 'vertical' | 'horizontal'` = `'vertical'`
- `clickable?: boolean` = `false` — Hover / pressed states and pointer cursor.
- `selected?: boolean` = `false`
- `elevated?: boolean` = `false` — Casts a shadow.
- `draggable?: boolean` = `false`
- `disabled?: boolean` = `false`
- `href?: string` — Makes the whole card a link.
- `reloadDocument?: boolean` = `false` — Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router.
- `onClick?: MouseEventHandler<HTMLElement>`
+ `children`, `HTML element`

```jsx
<Card elevated>
  <Subtitle>Card title</Subtitle>
  <BodySmall color="quiet">One sentence.</BodySmall>
</Card>
```

### SelectableCard
A Card that is clickable and shows `selected` — a choice among cards. Same props as Card.

Props: same as `Card`.

```jsx
<SelectableCard selected={checked} onClick={() => setChecked(!checked)}><Subtitle>Pro plan</Subtitle></SelectableCard>
```

### CardContent · CardActions · CardOverflow · CardCover
Card regions: CardContent (padded body), CardActions (button row), CardOverflow (full-bleed media), CardCover (background layer). **Parent:** Inside `<Card>` (reads its size / orientation).

+ `children`, `<div>`

```jsx
<Card>
  <CardContent><Subtitle>Title</Subtitle></CardContent>
  <CardActions><Button size="small">Open</Button></CardActions>
</Card>
```

### Paper
A plain surface on a Container level (MUI Paper markup). For content cards prefer Card.

- `` surface?: Extract<Surface, `Container${string}`> `` = `'Container'` — Container level; higher levels cast a larger shadow.
- `outlined?: boolean` = `false` — Border instead of a shadow (shorthand for variant="outlined").
- `variant?: 'elevation' | 'outlined'`
- `square?: boolean` — Square corners.
- `component?: ElementType` — Element to render.
+ `children`, `<div>`

```jsx
<Paper surface="Container-High"><Body>Panel</Body></Paper>
```

## Navigation

### Link
Inline text link. Without `href` it renders a button that runs `onClick`. No hover color change by design. Never add `aria-label` to a link that shows text — its content names it; any different label (even reordered) fails voice control.

- `href?: string`
- `target?: string`
- `rel?: string`
- `reloadDocument?: boolean` = `false` — Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router.
- `onClick?: MouseEventHandler<HTMLElement>` — Without href, the link renders as a button that runs this.
- `textStyle?: TextStyle | (string & {})` = `'body'` — Text style name, e.g. 'body-small'.
- `color?: string` = `'primary'` — Link color role.
- `disabled?: boolean` = `false`
- `visited?: boolean` = `false` — Force the visited color.
+ `children`, `<a>`

```jsx
<Body>Read the <Link href="/docs">docs</Link>.</Body>
```

### SkipLink
"Skip to main content": hidden until a keyboard user tabs to it, then shown top-left above everything with the lib's focus ring. Put `<SkipLink />` FIRST in the app (before the AppBar) and give the main region the id it points at: `<Section as="main" id="main">` or `<main id="main">`. Activating it moves focus to that region. Never hand-build one.

- `href?: string` = `'#main'` — The in-page target, `#` + the main region's id.
- `children?: ReactNode` = `'Skip to main content'` — The link text.
+ `<a>`

```jsx
<><SkipLink /><AppBar brand="Acme" /><Section as="main" id="main"><H1>Shop</H1></Section></>
```

### Tabs
Switches between panels (role="tab"), or with `navigation` a <nav> of links that marks the current page. Holds the selected value for its TabList and TabPanels.

- `value?: TabValue` — Selected tab (controlled).
- `defaultValue?: TabValue` = `0` — Initially selected tab (uncontrolled).
- `onChange?: (value: TabValue) => void` — Called with the newly selected Tab's value (not an event).
- `variant?: 'standard' | 'solid' | 'light' | 'dark'` = `'standard'` — standard = indicator only; solid / light / dark paint the list in `color`'s theme.
- `color?: Color` = `'default'` — Indicator color (standard) or theme (solid / light / dark).
- `size?: Size` = `'medium'`
- `orientation?: 'horizontal' | 'vertical' | 'vertical-left' | 'vertical-right'` = `'horizontal'` — 'vertical' = 'vertical-right'.
- `scrollable?: boolean` = `false` — **Deprecated.** Use overflow="scroll".
- `overflow?: 'none' | 'scroll' | 'more'` — When tabs do not fit: none, scroll (arrow buttons), more (… menu; horizontal only).
- `baseline?: boolean` = `true` — The 1px rule the tabs sit on. Turn off where the container already separates.
- `navigation?: boolean` = `false` — A site nav: renders <nav> of links; each Tab takes `href`, the selected one gets aria-current.
+ `children`, `<div>`

```jsx
<Tabs value={value} onChange={setValue}>
  <TabList>
    <Tab value="a">Overview</Tab>
    <Tab value="b">Details</Tab>
  </TabList>
  <TabPanel value="a"><Body>Overview panel.</Body></TabPanel>
  <TabPanel value="b"><Body>Details panel.</Body></TabPanel>
</Tabs>
```

### TabList
The row of Tabs. Adds keyboard arrows, scrolling and the overflow menu. **Parent:** Inside `<Tabs>`.

- `rounded?: boolean` — **Deprecated.** Retired — the list is square; renders square and warns.
+ `children`, `<div>`

```jsx
<Tabs><TabList><Tab>One</Tab><Tab>Two</Tab></TabList></Tabs>
```

### Tab
One tab: a button, or a link when its Tabs has `navigation`. **Parent:** Inside `<TabList>` inside `<Tabs>`.

- `value?: TabValue` — Key matched against Tabs `value` and TabPanel `value`; defaults to the tab's index.
- `href?: string` — Link target — only with `<Tabs navigation>` (ignored with a warning otherwise).
- `reloadDocument?: boolean` = `false` — Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router.
- `disabled?: boolean` = `false`
- `startDecorator?: ReactNode` — Icon before the label.
- `endDecorator?: ReactNode` — Icon or Badge after the label.
- `iconOnly?: boolean` = `false` — Icon only — give the Tab an aria-label.
+ `children`, `<button>`

```jsx
<Tabs navigation value="home">
  <TabList>
    <Tab value="home" href="/">Home</Tab>
    <Tab value="docs" href="/docs" startDecorator={<MenuBookIcon />}>Docs</Tab>
  </TabList>
</Tabs>
```

### TabPanel
The content shown while the Tab with the same `value` is selected. **Parent:** Inside `<Tabs>` (beside the TabList).

- `value?: TabValue` — The Tab value this panel belongs to.
+ `children`, `<div>`

```jsx
<Tabs defaultValue="a">
  <TabList><Tab value="a">A</Tab></TabList>
  <TabPanel value="a"><Body>Panel A</Body></TabPanel>
</Tabs>
```

### Breadcrumbs
Trail of the page's ancestors. Children are Links (or BreadcrumbItems); the last is the current page.

- `separator?: 'slanted' | 'bar' | 'ellipsis' | (string & {}) | ReactElement` = `'slanted'` — slanted (/), bar (|), ellipsis, or any node drawn as given.
- `size?: Size` = `'medium'`
- `condense?: boolean` = `false` — Collapse the middle crumbs into a "…" menu past `maxItems`.
- `maxItems?: number` = `4` — Crumbs shown before condensing.
- `itemsBeforeCollapse?: number` = `1` — Crumbs kept before the "…".
- `itemsAfterCollapse?: number` = `1` — Crumbs kept after the "…".
- `backOnlyMobile?: boolean` = `false` — At ≤600px show only "← Parent".
- `onExpand?: () => void` — Called when the "…" is pressed.
+ `children`, `HTML element`

```jsx
<Breadcrumbs>
  <Link href="/">Home</Link>
  <Link href="/shop">Shop</Link>
  <BodySmall>Shoes</BodySmall>
</Breadcrumbs>
```

### BreadcrumbItem
One crumb: a link with `href`, plain text without. Optional — a Link works too. **Parent:** Inside `<Breadcrumbs>`.

- `href?: string`
- `reloadDocument?: boolean` = `false` — Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router.
+ `children`, `<a>`

```jsx
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem>Settings</BreadcrumbItem>
</Breadcrumbs>
```

### Pagination
Page number controls for a paged list or table. Pages are 1-based.

- `theme?: Theme` — Theme zone for the bar (data-theme).
- `surface?: Surface` — Surface level for the bar (data-surface).
- `count?: number` = `10` — Total pages.
- `page?: number` — Current page, 1-based (controlled).
- `defaultPage?: number` = `1` — Initial page (uncontrolled).
- `onChange?: (page: number) => void` — Called with the new page number.
- `color?: Color` = `'default'` — Palette of the current page.
- `size?: Size` = `'medium'`
- `siblingCount?: number` = `1` — Pages shown each side of the current one.
- `boundaryCount?: number` = `1` — Pages always shown at each end.
- `disabled?: boolean` = `false`
- `showFirstButton?: boolean` = `false` — Show the first-page button.
- `showLastButton?: boolean` = `false` — Show the last-page button.
+ `HTML element`

```jsx
<Pagination count={12} page={page} onChange={setPage} />
```

### Dropdown
Root of a menu: holds open state for its MenuButton and Menu. The panel does NOT portal — inside a scroll area or clipped card use Popover instead.

- `variant?: 'outline' | 'solid' | 'light'` = `'outline'` — Menu panel style: outline (bordered), solid or light (themed in `color`).
- `color?: Color` = `'default'` — Palette of the button, border and selection.
- `size?: Size` = `'medium'` — Sizes the button, rows and panel width.
- `open?: boolean` — Open state (controlled).
- `onOpenChange?: (open: boolean) => void` — Called with the next open state.
+ `children`, `<div>`

```jsx
<Dropdown>
  <MenuButton>Actions</MenuButton>
  <Menu>
    <MenuItem onClick={() => {}}>Profile</MenuItem>
    <MenuDivider />
    <MenuItem disabled>Settings</MenuItem>
  </Menu>
</Dropdown>
```

### MenuButton
The Button that opens its Dropdown's Menu (chevron and ARIA wired). Takes every Button prop. **Parent:** Inside `<Dropdown>`.

- `variant?: ButtonVariant` — Defaults to the Dropdown color's outline.
+ all `Button` props

```jsx
<Dropdown><MenuButton variant="default">Sort</MenuButton><Menu><MenuItem>Newest</MenuItem></Menu></Dropdown>
```

### Menu
The menu panel. Renders nothing outside a `<Dropdown>` (its open state lives there). Does not portal. **Parent:** Inside `<Dropdown>`, after its MenuButton.

- `placement?: 'bottom-start' | 'bottom-end'` = `'bottom-start'` — Which edge of the button the panel lines up with.
+ `children`, `<div>`

```jsx
<Dropdown><MenuButton>More</MenuButton><Menu placement="bottom-end"><MenuItem>Rename</MenuItem></Menu></Dropdown>
```

### MenuItem
One menu row (role="menuitem"). Clicking runs `onClick` and closes the menu. **Parent:** Inside `<Menu>`.

- `onClick?: () => void` — Runs on click / Enter (no event argument); the menu then closes.
- `selected?: boolean` = `false` — Marks the current choice (leading bar, aria-current).
- `disabled?: boolean` = `false`
- `divider?: boolean` = `true` — Rule under the row.
- `startDecorator?: ReactNode` — Icon before the label.
+ `children`, `<div>`

```jsx
<Dropdown>
  <MenuButton>File</MenuButton>
  <Menu><MenuItem startDecorator={<EditIcon />} onClick={() => {}} selected>Edit</MenuItem></Menu>
</Dropdown>
```

### MenuDivider
A rule between groups of menu items. **Parent:** Inside `<Menu>`.

- `sx?: Sx`
+ `<hr>`

```jsx
<Dropdown><MenuButton>Menu</MenuButton><Menu><MenuItem>A</MenuItem><MenuDivider /><MenuItem>B</MenuItem></Menu></Dropdown>
```

### BottomNavigation
Phone bottom bar of 3–5 destinations, on the designer's Nav-Bar theme. Leave `barColor` unset.

- `items?: BottomNavigationItem[]` = `[]` — The destinations.
- `value?: number` — Selected index (controlled).
- `defaultValue?: number` = `0`
- `onChange?: (index: number) => void` — Called with the selected index.
- `showLabels?: boolean` = `true` — Labels under the icons.
- `variant?: 'fixed' | 'floating'` = `'fixed'` — fixed = square edge-to-edge band; floating = pill. A FAB makes it floating.
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'` — The bar's direction (vertical = a rail of actions).
- `barColor?: Color` = `'default'` — default = the Nav-Bar theme (the designer's pick).
- `surface?: Surface` — Surface level override.
- `fabAction?: BottomNavigationFabAction` — Adds a FAB (or speed dial with `actions`).
- `fabPosition?: 'center' | 'end'` = `'end'` — center = raised on the bar's top edge; end = beside the bar.
- `fixed?: boolean` = `true` — Pinned to the viewport (positioning, not appearance).
+ `<div>`

```jsx
<BottomNavigation value={value} onChange={setValue}
  items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <SearchIcon />, label: 'Search' }, { icon: <PersonIcon />, label: 'Profile' }]} />
```

### Stepper
Progress through ordered steps. Steps before `activeStep` are complete.

- `theme?: Theme` — Theme zone (data-theme).
- `surface?: Surface` — Surface level (data-surface).
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'`
- `size?: Size` = `'medium'`
- `color?: Color` = `'default'` — Palette of the current / completed circles.
- `activeStep?: number` = `0` — 0-based index of the current step.
- `clickable?: boolean` = `false` — Steps are buttons that call onStepClick.
- `onStepClick?: (index: number) => void` — Called with the clicked step's 0-based index.
- `dashedIncomplete?: boolean` = `false` — Dashed connectors after the current step.
- `variant?: 'count' | 'noCount'` = `'count'` — count = numbered circles; noCount = plain dots.
- `labelPosition?: 'bottom' | 'right'` — Label under or beside each circle; unset follows orientation.
+ `children`, `<ol>`

```jsx
<Stepper activeStep={1}>
  <Step label="Cart" />
  <Step label="Shipping" />
  <Step label="Pay" />
</Stepper>
```

### Step
One step. Shows its number (or `icon`) and its label. **Parent:** Inside `<Stepper>`.

- `icon?: ReactNode` — Replaces the number in the circle.
- `label?: ReactNode` — The step's name (or pass children).
- `disabled?: boolean` = `false`
+ `children`, `<li>`

```jsx
<Stepper activeStep={0}><Step label="Account" icon={<PersonIcon />} /><Step label="Done" /></Stepper>
```

### LinkGroup
A row of Links with separators (footer or legal links), as a list.

- `separator?: ReactNode` = `'|'` — Drawn between links.
+ `children`, `<ul>`

```jsx
<LinkGroup aria-label="Legal">
  <Link href="/privacy">Privacy</Link>
  <Link href="/terms">Terms</Link>
</LinkGroup>
```

### Rail
Side navigation rail for apps (icon + label per destination), optionally expandable. Pair with Drawer for a slide-out.

- `items?: RailItemData[]` = `[]` — Destinations (use `sections` for grouped).
- `sections?: RailSection[]` — Grouped destinations; indexes run across sections.
- `value?: number` — Selected index (controlled).
- `defaultValue?: number` = `0`
- `onChange?: (index: number) => void` — Called with the selected index.
- `expandable?: boolean` = `false` — Adds a toggle between collapsed and expanded.
- `expandedWidth?: number | string` = `EXPANDED_WIDTH` — Open width: px number or CSS length. ('partial' / 'full' are retired.)
- `defaultExpanded?: boolean` = `false`
- `fabAction?: { icon?: ReactNode; label?: string; onClick?: MouseEventHandler<HTMLButtonElement> }` — A FAB at the top: `{ icon, label, onClick }`.
- `brand?: ReactNode` — Brand mark at the top (non-expandable rail).
- `labelStyle?: 'contained' | 'outside'` = `'contained'` — contained = block round icon + label when selected; outside = circle round the icon only.
- `variant?: Color | 'black-white'` = `'default'` — Palette of the selected item.
- `size?: Size` = `'medium'`
+ `<div>`

```jsx
<Rail value={value} onChange={setValue} brand={<Avatar initials="A" />}
  items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <InboxIcon />, label: 'Inbox', badge: 3 }]} />
```

### RailItem
One rail item. Rail renders these itself — use directly only to show a single item. **Parent:** Normally rendered by `<Rail>` from `items`.

- `item: RailItemData`
- `selected?: boolean`
- `expanded?: boolean` — Expanded-rail layout (icon and label in a row).
- `compact?: boolean` = `false` — Collapsed layout of an expandable rail.
- `labelStyle?: 'contained' | 'outside'`
- `variant?: Color | 'black-white'` = `'default'`
- `onClick?: MouseEventHandler<HTMLButtonElement>`

```jsx
<RailItem item={{ icon: <HomeIcon />, label: 'Home' }} selected onClick={() => {}} />
```

### RailSectionTitle
A section heading in a rail. Rail renders these from `sections[].title`. **Parent:** Normally rendered by `<Rail>`.

- `title?: ReactNode`
- `expanded?: boolean` — Eyebrow when true; a short rule when false.

```jsx
<RailSectionTitle title="Projects" expanded />
```

### Sidebar
RETIRED (removed next major; warns). Use Rail for side navigation and Drawer for a slide-out.

- `open?: boolean`
- `onClose?: () => void`
- `items?: SidebarItem[]` = `[]`
- `onItemClick?: (item: SidebarItem | { label: ReactNode; icon?: ReactNode }) => void` — Called with the clicked item (or submenu item).
- `width?: number` = `280` — Width in px.
- `variant?: 'standard' | 'permanent' | 'temporary'` = `'temporary'` — temporary closes on item click.
- `header?: ReactNode`
- `footer?: ReactNode`
+ `<div>`

```jsx
<Sidebar open={open} onClose={() => setOpen(false)} items={[{ label: 'Home', icon: <HomeIcon /> }]} />
```

### MainLayout
RETIRED (removed next major; warns). Use AppBar for the top bar and Rail (+ Drawer) for side navigation.

- `layout?: 'side' | 'rail' | 'top' | 'side-rail'` = `'side'` — Navigation layout (phones always use top).
- `navItems?: MainLayoutNavItem[]`
- `title?: ReactNode` = `'My App'` — App title in the top bar.
- `onLayoutChange?: (layout: 'side' | 'rail' | 'side-rail') => void` — Shows a layout switcher; called with the chosen layout.
- `onNavigate?: (item: MainLayoutNavItem) => void` — Called with the clicked nav item.
+ `children`, `<div>`

```jsx
<MainLayout title="My App" navItems={[{ label: 'Home', icon: <HomeIcon />, path: '/' }]}><Body>Content</Body></MainLayout>
```

### CarouselDots
Slide position dots for a carousel; arrow keys move along them.

- `count?: number` = `0` — Number of slides.
- `value?: number` = `0` — Current slide, 0-based.
- `onChange?: (index: number) => void` — Called with the chosen slide index.
- `color?: Color` = `'default'` — Palette of the current dot.
- `disabled?: boolean` = `false`
+ `<div>`

```jsx
<CarouselDots count={5} value={page} onChange={setPage} />
```

### CarouselDot
One dot button. CarouselDots renders these — use directly only for a custom row. Ref: `HTMLButtonElement`.

- `selected?: boolean` = `false`
- `color?: Color` = `'default'`
- `disabled?: boolean` = `false`
+ `<button>`

```jsx
<CarouselDot selected aria-label="Slide 1 of 3" onClick={() => {}} />
```

### OmniTreeView · DynoTreeView
Hierarchical list (files, sections) with WAI-ARIA tree keyboard support. SolidTreeView / LightTreeView preset `variant`; DynoTreeView is the old name.

- `color?: Color` = `'default'` — Palette for solid / light.
- `variant?: 'default' | 'solid' | 'light'` = `'solid'` — default = no theme; solid / light = themed in `color`.
- `selectionStyle?: 'default' | 'solid' | 'light'` — **Deprecated.** Use `variant`.
- `surface?: Surface`
- `density?: 'default' | 'compact'` = `'default'`
- `animation?: 'none' | 'slide' | 'spring'` = `'slide'` — How children appear when a branch opens.
- `items?: TreeItem[]` = `DEFAULT_ITEMS` — The tree. Defaults to a demo tree — always pass your own.
- `selectionMode?: 'single' | 'multi'` = `'single'`
- `checkboxSelection?: boolean` = `false` — Checkboxes on rows.
- `disableSelection?: boolean` = `false`
- `disabledItemsFocusable?: boolean` = `false` — Keep disabled rows reachable by keyboard.
- `defaultExpandedItems?: string[]` — Initially expanded ids (uncontrolled).
- `expandedItems?: string[]` — Expanded ids (controlled).
- `onExpandedItemsChange?: (event: SyntheticEvent, ids: string[]) => void`
- `selectedItems?: string | string[] | null` — Selected id, or ids when selectionMode="multi" (controlled).
- `onSelectedItemsChange?: (event: SyntheticEvent, value: string | string[] | null) => void` — Called with the selected id (single) or ids (multi).
- `onItemExpansionToggle?: (event: SyntheticEvent, id: string, expanded: boolean) => void`
- `onItemSelectionToggle?: (event: SyntheticEvent, id: string, selected: boolean) => void`
- `slots?: { collapseIcon?: ElementType; expandIcon?: ElementType }` — Replace the chevrons.
+ `<ul>`

```jsx
<OmniTreeView aria-label="Files" defaultExpandedItems={['src']}
  items={[{ id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] }]}
  onSelectedItemsChange={(e, id) => setValue(id)} />
```

### SolidTreeView · LightTreeView
OmniTreeView with `variant` preset to solid / light (a passed `variant` still wins).

Props: same as `OmniTreeView`.

```jsx
<LightTreeView aria-label="Docs" color="primary" items={[{ id: 'a', label: 'Intro' }]} />
```

### TreeBranch
One tree row with its own toggle, for building a tree by hand. OmniTreeView covers most trees from `items`.

- `label?: ReactNode`
- `icon?: ReactNode` — Icon in the slot before the label.
- `level?: number` = `0` — Nesting depth (sets the indent); level 6 never toggles.
- `toggle?: 'on' | 'off' | 'none'` = `'none'` — on = open (children shown), off = closed, none = a leaf.
- `onToggle?: (next: 'on' | 'off') => void` — Called with the next toggle state.
- `disabled?: boolean` = `false`
- `size?: 'small'` = `'small'` — Only small exists today.
+ `children`, `<div>`

```jsx
<TreeBranch label="src" level={1} toggle="on" onToggle={() => {}}>
  <TreeBranch label="App.tsx" level={2} />
</TreeBranch>
```

## Overlays

### AccordionGroup
Wraps one or more Accordions and sets their look: connected (spacing 0) or separate segments.

- `variant?: 'solid' | 'light' | 'dark'` = `'solid'` — solid = Container level; light / dark = brightest / dimmest surface of `color`.
- `surface?: Surface` — Explicit surface; wins over the variant mapping.
- `color?: Color` = `'default'` — Theme of the group.
- `size?: Size` = `'medium'` — Title and body type scale.
- `spacing?: 0 | 0.5 | 1 | 1.5 | 2 | number` = `0` — Gap between segments in 8px units; 0 joins them into one block.
+ `children`, `<div>`

```jsx
<AccordionGroup>
  <Accordion>
    <AccordionSummary>Shipping</AccordionSummary>
    <AccordionDetails><Body>Ships in 2 days.</Body></AccordionDetails>
  </Accordion>
</AccordionGroup>
```

### Accordion
One expandable section. Works alone or inside AccordionGroup. **Parent:** Children: `AccordionSummary` then `AccordionDetails`.

- `expanded?: boolean` — Controlled open state.
- `defaultExpanded?: boolean` = `false` — Uncontrolled initial state.
- `onChange?: (expanded: boolean) => void` — Called with the new open state (not an event).
- `disabled?: boolean` = `false`
+ `children`, `<div>`

```jsx
<Accordion expanded={open} onChange={setOpen}>
  <AccordionSummary>Returns</AccordionSummary>
  <AccordionDetails><Body>30 days.</Body></AccordionDetails>
</Accordion>
```

### AccordionSummary
The clickable header row of an Accordion (a button that toggles it). **Parent:** Inside `<Accordion>`.

- `startDecorator?: ReactNode`
- `endDecorator?: ReactNode`
- `eyebrow?: ReactNode` — Small line above the title.
- `overline?: ReactNode` — **Deprecated.** Use `eyebrow`.
- `secondary?: ReactNode` — Second line under the title.
- `expandIcon?: ReactNode` — Replaces the chevron.
+ `children`, `<button>`

```jsx
<Accordion>
  <AccordionSummary eyebrow="Step 1" secondary="Pick a plan" startDecorator={<PaymentIcon />}>Billing</AccordionSummary>
  <AccordionDetails><Body>Details.</Body></AccordionDetails>
</Accordion>
```

### AccordionDetails
The collapsible body of an Accordion. **Parent:** Inside `<Accordion>`, after `AccordionSummary`.

- `sx?: Sx` = `{}`
+ `children`, `<div>`

```jsx
<Accordion>
  <AccordionSummary>FAQ</AccordionSummary>
  <AccordionDetails><Body>Answer.</Body></AccordionDetails>
</Accordion>
```

### Popover
Floating panel anchored to an element, portalled so no scroll area or clipped card cuts it off. Use for account menus, hover cards, anything that floats.

- `open?: boolean` = `false`
- `onClose?: () => void` — Outside click, Escape, or Tab out of the panel.
- `anchorRef?: RefObject<HTMLElement | null>` — Element to position against.
- `anchorEl?: HTMLElement | null` — The anchor element itself, when there is no ref.
- `placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start' | 'top'` = `'bottom-end'` — Flips to the other side at the viewport edge.
- `arrow?: boolean` = `false` — A small arrow pointing at the anchor.
- `theme?: Theme` = `'Default'`
- `surface?: Surface` = `'Surface-Bright'`
- `width?: number | string` = `320` — px or CSS length; 'auto' hugs the content.
- `maxHeight?: number | string` = `400` — Scrolls past this height.
- `aria-label?: string` — The panel's accessible name.
- `aria-labelledby?: string`
- `role?: 'dialog' | 'tooltip'` = `'dialog'` — 'tooltip' for a hover card (with autoFocus={false}).
- `autoFocus?: boolean` = `true` — Move focus in on open and back on close. false for hover cards.
- `id?: string` — For aria-describedby on the trigger.
- `onMouseEnter?: MouseEventHandler<HTMLDivElement>`
- `onMouseLeave?: MouseEventHandler<HTMLDivElement>`
- `disablePortal?: boolean` = `false` — Render in place with no anchor positioning (docs and samples only).
- `className?: string` = `''`
+ `children`

```jsx
<>
  <Button ref={anchorRef} variant="default-outline" onClick={() => setOpen(!open)}>Account</Button>
  <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} aria-label="Account" arrow>
    <Body>Signed in as Jane.</Body>
  </Popover>
</>
```

### Dialog
Modal dialog with a title, body and action row; traps focus, closes on Escape / backdrop (unless `alert`).

- `open?: boolean` = `false`
- `onClose?: (event: SyntheticEvent | {}, reason?: CloseReason) => void` — Called with the event and why it closed.
- `title?: ReactNode`
- `actions?: ReactNode` — The button row.
- `maxWidth?: 'dialog' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false` = `'dialog'` — 'dialog' = the design's 560px; xs–xl are MUI's wider widths.
- `fullScreen?: boolean` = `false`
- `scroll?: 'body' | 'paper'` = `'body'` — 'paper' scrolls inside the dialog.
- `alert?: boolean` = `false` — role="alertdialog": no close icon, no Escape, no backdrop close.
- `nonModal?: boolean` = `false` — No backdrop and no focus trap.
- `transition?: 'fade' | 'grow' | 'zoom' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'` — Enter animation (fade when unset).
- `transitionDuration?: number` = `300` — ms.
- `titleId?: string` = `'dialog-title'` — id of the title, for aria-labelledby.
- `contentId?: string` = `'dialog-description'` — id of the body, for aria-describedby.
- `PaperProps?: Record<string, unknown>` = `{}` — Props for the dialog panel (className, style).
- `disableAutoFocus?: boolean` = `false`
- `disableRestoreFocus?: boolean` = `false`
- `disableScrollLock?: boolean` = `false`
- `keepMounted?: boolean` — MUI escape hatches — passing one renders MUI's Dialog.
- `disablePortal?: boolean`
- `hideBackdrop?: boolean`
- `disableEscapeKeyDown?: boolean`
- `fullWidth?: boolean`
+ `children`, `<div>`

```jsx
<Dialog open={open} onClose={() => setOpen(false)} title="Delete project?"
  actions={<><Button variant="default-outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="error">Delete</Button></>}>
  <Body>This cannot be undone.</Body>
</Dialog>
```

### AlertDialog
Confirm / cancel dialog (role="alertdialog"). Both buttons close it unless their handler is given.

- `confirmText?: ReactNode` = `'Confirm'`
- `cancelText?: ReactNode` = `'Cancel'`
- `onConfirm?: MouseEventHandler<HTMLButtonElement>` — Confirm button click; defaults to onClose.
- `onCancel?: MouseEventHandler<HTMLButtonElement>` — Cancel button click; defaults to onClose.
+ all `Dialog` props

```jsx
<AlertDialog open={open} onClose={() => setOpen(false)} title="Discard changes?" confirmText="Discard" onConfirm={() => setOpen(false)}>
  <Body>Your edits will be lost.</Body>
</AlertDialog>
```

### FormDialog
Dialog with Cancel / Submit buttons for a short form. `onSubmit` is the Submit button's click, not a form submit event.

- `submitText?: ReactNode` = `'Submit'`
- `cancelText?: ReactNode` = `'Cancel'`
- `onSubmit?: MouseEventHandler<HTMLButtonElement>` — Submit button click.
+ all `Dialog` props

```jsx
<FormDialog open={open} onClose={() => setOpen(false)} title="Rename" onSubmit={() => setOpen(false)}>
  <TextField label="Name" value={text} onChange={(e) => setText(e.target.value)} />
</FormDialog>
```

### Modal
Modal panel with eyebrow, title, body and actions; themeable (`variant` + `color`). For a standard confirm, Dialog.

- `open?: boolean`
- `onClose?: (event?: SyntheticEvent) => void` — Close button, Escape, or backdrop click.
- `title?: ReactNode`
- `eyebrow?: ReactNode` — Small line above the title.
- `actions?: ReactNode` — The button row.
- `variant?: 'default' | 'solid' | 'soft'` = `'default'` — default = page theme on Container-High; solid = `color` theme on Container-High; soft = `color` theme on Surface-Brightest.
- `color?: Exclude<Color, 'default'>` = `'primary'` — Palette for solid / soft.
- `size?: Size` = `'medium'` — Max width: 400 / 560 / 720px.
- `layout?: 'center' | 'fullscreen'` = `'center'`
- `transition?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'zoom'` = `'fade'`
- `transitionSpeed?: number` = `250` — ms (150–600).
- `closeOnBackdrop?: boolean` = `true` — Clicking the backdrop closes it.
- `showCloseButton?: boolean` = `true`
+ `children`, `<div>`

```jsx
<Modal open={open} onClose={() => setOpen(false)} title="Welcome" actions={<Button onClick={() => setOpen(false)}>Got it</Button>}>
  <Body>Here is what is new.</Body>
</Modal>
```

### Drawer
Panel that slides in from a screen edge (navigation, filters). Compose with DrawerHeader / DrawerContent / DrawerClose.

- `open?: boolean` = `false`
- `onClose?: () => void` — Escape or backdrop click.
- `size?: Size` = `'medium'` — Width (or height for top / bottom): 240 / 320 / 420px.
- `anchor?: 'left' | 'right' | 'top' | 'bottom'` = `'left'`
- `hideBackdrop?: boolean` = `false`
- `surface?: Surface` = `'Surface-Dim'` — The panel's surface level.
+ `children`, `<div>`

```jsx
<Drawer open={open} onClose={() => setOpen(false)} anchor="left">
  <DrawerHeader><Subtitle>Menu</Subtitle><DrawerClose onClick={() => setOpen(false)} /></DrawerHeader>
  <DrawerContent><Link href="/">Home</Link></DrawerContent>
</Drawer>
```

### DrawerClose
The Drawer's close button (an icon-only ghost Button named "Close drawer"). **Parent:** Inside `<Drawer>`, usually in `<DrawerHeader>`.

- `onClick?: MouseEventHandler<HTMLButtonElement>`
- `sx?: Sx`
+ `<div>`

```jsx
<DrawerClose onClick={() => setOpen(false)} />
```

### DrawerHeader · DrawerContent
Drawer regions: DrawerHeader (title row) and DrawerContent (scrolling body). **Parent:** Inside `<Drawer>`.

- `sx?: Sx`
+ `children`, `<div>`

```jsx
<DrawerContent><Body>Filters</Body></DrawerContent>
```

### Sheet
Bottom sheet: a Drawer from the bottom, 640px max, rounded top. For phone-style secondary content.

- `open?: boolean` = `false`
- `onClose?: () => void`
- `surface?: Surface` = `'Container'` — The sheet's surface level.
- `hideBackdrop?: boolean` = `false`
+ `children`, `<div>`

```jsx
<Sheet open={open} onClose={() => setOpen(false)}><Subtitle>Share</Subtitle></Sheet>
```

### Tooltip
Short label on hover / focus of its child. One solid style; for a light hover panel use Popover role="tooltip".

- `children?: ReactNode` — The trigger. A non-element is wrapped in a span; a disabled button needs a span wrapper.
- `title?: ReactNode` — The tooltip content. Empty = no tooltip.
- `icon?: ReactNode` — Leading icon.
- `trailingIcon?: ReactNode`
- `action?: ReactNode` — Trailing node, e.g. a close button.
- `variant?: 'solid'` = `'solid'` — **Deprecated.** Only 'solid' exists; others render solid and warn.
- `color?: Color | 'black-white'` = `'black-white'` — Buttons palette of the bubble.
- `size?: Size` = `'medium'`
- `placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'` = `'bottom'`
- `arrow?: boolean` = `true`
- `open?: boolean` — Controlled visibility; unset = hover / focus.
- `enterDelay?: number` = `100` — ms before showing.
- `leaveDelay?: number` = `0` — ms before hiding.
- `enterNextDelay?: number`
- `enterTouchDelay?: number`
- `leaveTouchDelay?: number`
- `describeChild?: boolean` = `false` — The title describes the child (aria-describedby) instead of naming it.
- `inline?: boolean` = `false` — Draw beside the child without a portal (scaled previews). Shown when `open`.
- `disableFocusListener?: boolean`
- `disableHoverListener?: boolean`
- `disableInteractive?: boolean`
- `disableTouchListener?: boolean`
- `onOpen?: (event: SyntheticEvent) => void`
- `onClose?: (event: SyntheticEvent) => void`
- `id?: string`
- `PopperProps?: { disablePortal?: boolean; container?: Element | null; className?: string; style?: CSSProperties }` — disablePortal / container / className / style for the popper.
- `className?: string` = `''`

```jsx
<Tooltip title="Delete item"><Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button></Tooltip>
```

## Feedback

### Badge
A count or status dot anchored to the corner of its child (icon, avatar, button).

- `variant?: Exclude<Color, 'default'>` = `'error'` — Palette (solid only; `-outline` / `-light` warn and render solid).
- `type?: 'standard' | 'status'` = `'standard'` — standard = counter; status = 8px dot.
- `badgeContent?: ReactNode` — The number or text.
- `max?: number` = `99` — Counts above this show as "max+".
- `showZero?: boolean` = `false` — Show a 0 count.
- `invisible?: boolean` = `false` — Hide the badge (animates out).
- `dot?: boolean` = `false` — Same as type="status".
- `overlap?: 'rectangular' | 'circular'` = `'rectangular'` — circular = inset for a round child (avatar).
- `anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' }`
- `size?: string` — **Deprecated.** Badge has one size.
+ `children`, `<span>`

```jsx
<Badge badgeContent={4}><Icon><NotificationsIcon /></Icon></Badge>
```

### Alert
Inline status message (role="alert") in one of four states, with the state's icon. Themes itself.

- `children?: ReactNode` — The body.
- `title?: ReactNode` — Header text; makes it two rows.
- `variant?: 'light' | 'solid'` = `'light'` — light = Surface-Brightest; solid = the state's Surface.
- `surface?: Surface` — Override the surface level.
- `color?: AlertColor` = `'info'` — Other values render as info and warn.
- `size?: Size` = `'medium'`
- `startDecorator?: ReactNode` — Replaces the state icon; false for none.
- `endDecorator?: ReactNode` — Icon, link or button at the end.
+ `<div>`

```jsx
<Alert color="success" title="Saved">Your changes are live.</Alert>
```

### Snackbar
Toast: a floating message at a screen edge, optionally auto-hiding. Shows a close button when `onClose` is set.

- `open?: boolean` = `false`
- `onClose?: (event: SyntheticEvent | {}, reason: 'timeout' | 'escapeKeyDown' | 'closeClick') => void` — Timeout, Escape, or the close button.
- `variant?: 'light' | 'solid'` = `'light'` — 'solid' is retired: renders light and warns.
- `surface?: Surface`
- `color?: Color` = `'default'`
- `size?: Size` = `'medium'` — Text size.
- `anchor?: 'top-right' | 'top-middle' | 'bottom-right' | 'bottom-middle' | 'top' | 'bottom'` = `'bottom'` — 'top' / 'bottom' are the middle positions.
- `autoHideDuration?: number` — ms; calls onClose(_, 'timeout').
- `startDecorator?: ReactNode`
- `endDecorator?: ReactNode`
- `action?: ReactNode` — A button, e.g. Undo.
+ `children`, `<div>`

```jsx
<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} color="success">Message sent</Snackbar>
```

### CircularProgress
Progress ring (role="progressbar"): with `value` (0–100) a static arc, without it spinning.

- `value?: number` — 0–100; omit for indeterminate.
- `color?: Color` = `'default'`
- `size?: Size | number` = `'medium'` — 24 / 40 / 80px, or a diameter in px.
- `thickness?: number` — Ring width in px (default scales with size).
- `showValue?: boolean` = `false` — Percentage in the center.
- `children?: ReactNode` — Center content instead of the percentage.
+ `<div>`

```jsx
<CircularProgress value={60} showValue aria-label="Upload" />
```

### LinearProgress
Progress bar (role="progressbar"): with `value` (0–100) determinate, without it sliding.

- `value?: number` — 0–100; omit for indeterminate.
- `color?: Color` = `'default'`
- `size?: Size` = `'medium'` — Bar height: 4 / 6 / 8px.
- `showValue?: boolean` = `false` — Percentage under the bar.
+ `<div>`

```jsx
<LinearProgress value={40} aria-label="Upload" />
```

### Loader
Loading indicator with an optional message, in six styles. For measurable progress use CircularProgress / LinearProgress.

- `theme?: Theme` — Theme the message text reads from.
- `surface?: Surface`
- `type?: 'spinner' | 'orbit' | 'bounce' | 'ripple' | 'dual-ring' | 'bars'` = `'spinner'`
- `multicolor?: boolean` = `false` — Primary / Secondary / Tertiary pieces (not for spinner).
- `size?: Size | number` = `'medium'` — 24 / 32 / 56px, or px.
- `color?: Color` = `'primary'`
- `message?: ReactNode` = `'Loading...'` — Text under the loader; empty for none.
+ `<div>`

```jsx
<Loader type="dual-ring" message="Loading orders" />
```

### LinearLoader
Thin progress bar with a label and percentage.

- `value?: number` — 0–100; omit for indeterminate.
- `label?: ReactNode`
+ `<div>`

```jsx
<LinearLoader value={70} label="Importing" />
```

### SkeletonLoader
Stack of placeholder blocks. For placeholders shaped like real content prefer Ghost.

- `rows?: number` = `3`
- `height?: number | string` = `100` — Each block's height (px or CSS length).
- `spacing?: number | string` = `2` — Gap in 8px units, or a CSS length.
+ `<div>`

```jsx
<SkeletonLoader rows={3} height={48} />
```

### DotsLoader
Three bouncing dots with a message.

- `message?: ReactNode` = `'Loading'`
- `sx?: Sx` = `{}`
+ `<div>`

```jsx
<DotsLoader message="Thinking" />
```

### PageLoader
Full-page centered Loader.

- `message?: ReactNode` = `'Loading page...'`
- `size?: Size | number` = `60` — Loader size in px or a Size.
+ `<div>`

```jsx
<PageLoader message="Loading dashboard" />
```

### SkeletonCard
Placeholder card: an image block and text lines.

- `lines?: number` = `3` — Text lines.
- `showImage?: boolean` = `true` — Show the 200px image block.
+ `<div>`

```jsx
<SkeletonCard lines={2} />
```

### OverlayLoader
Wraps content and veils it with a Loader while `isLoading`.

- `isLoading?: boolean` = `false`
- `message?: ReactNode` = `'Loading...'`
+ `children`, `<div>`

```jsx
<OverlayLoader isLoading={checked} message="Saving"><Card>Form</Card></OverlayLoader>
```

### Ghost
Marks a region as loading: the real components inside render as placeholders of their own shape (aria-busy, content hidden from screen readers).

- `active?: boolean` = `true` — Ghost while true; render normally when false.
- `animate?: boolean` = `true` — Shimmer sweep; false for static blocks.
- `label?: string` = `'Loading'` — Announced while loading.
+ `children`, `<div>`

```jsx
<Ghost active={checked} label="Loading profile"><H3>Jane Doe</H3><Body>Designer</Body></Ghost>
```

### StateMessage
What a region shows instead of data: empty, no results, or an error (error is role="alert"). Also Table / List's `empty` / `error` slot.

- `type?: 'empty' | 'no-results' | 'error'` = `'empty'` — Picks the default icon and role.
- `icon?: ReactNode` — Replaces the type's icon.
- `title?: ReactNode` — *Needed** — the headline (warns without one).
- `body?: ReactNode` — One or two sentences.
- `action?: ReactNode` — A Button — the way forward.
- `size?: Size` = `'medium'`
+ `<div>`

```jsx
<StateMessage type="no-results" title="No matches" body="Try a different filter." action={<Button variant="default-outline">Clear filters</Button>} />
```

## Data display

### Icon
Colors and sizes an icon from @omni-design/icons. Decorative (aria-hidden) unless given aria-label.

- `color?: Color` = `'default'` — Icon color role.
- `size?: 'xs' | Size | 'xl'` = `'medium'`
- `fontSize?: string | number` — Explicit size, overrides `size`.
- `disabled?: boolean`
- `twoTone?: boolean` = `false` — Two-tone rendering.
+ `children`, `<div>`

```jsx
<Icon color="primary" size="small"><CheckCircleIcon /></Icon>
```

### IconBadge
An icon on a colored tile (feature cards, stats).

- `color?: Color` = `'primary'` — Any Button color.
- `variant?: 'solid' | 'light' | 'dark'` = `'solid'`
- `size?: Size` = `'medium'`
- `shape?: IconShape` — Tile shape.
+ `children`, `<div>`

```jsx
<IconBadge color="primary" variant="light"><HomeIcon /></IconBadge>
```

### Chip
Compact tag, filter or choice. Color and selection are separate axes.

- `onKeyDown?: KeyboardEventHandler<HTMLDivElement>`
- `onKeyUp?: KeyboardEventHandler<HTMLDivElement>`
- `variant?: Color` = `'neutral'` — Palette.
- `label?: ReactNode` — The text (or pass children).
- `clickable?: boolean` = `false` — Hover / pressed states; focusable.
- `disabled?: boolean` = `false`
- `selected?: boolean` = `false`
- `selectionMode?: 'radio' | 'checkbox'` — ARIA role when selectable: radio or checkbox.
- `onDelete?: MouseEventHandler<HTMLElement>` — Shows a delete button that calls this.
- `onClick?: MouseEventHandler<HTMLElement>`
- `startDecorator?: ReactNode`
- `endDecorator?: ReactNode`
- `icon?: ReactNode` — MUI's name for the start decorator.
- `size?: string` — **Deprecated.** Chips have one size.
+ `children`, `HTML element`

```jsx
<HStack spacing={1}>
  <Chip label="Design" />
  <Chip label="Selected" variant="primary" selected clickable onClick={() => {}} />
</HStack>
```

### Avatar
A person or a step number: photo, initials or icon.

- `src?: string` — Photo URL.
- `defaultPhoto?: boolean` = `false` — Show the built-in placeholder photo.
- `alt?: string` — Alt text for the photo.
- `initials?: string`
- `icon?: ReactNode`
- `color?: Color` = `'default'`
- `size?: 'xxs' | 'xs' | Size | 'xl' | 'xxl'` = `'medium'`
- `customSize?: number` — Exact size in px.
- `clickable?: boolean` = `false`
- `onClick?: MouseEventHandler<HTMLElement>`
- `insideButton?: boolean` = `false` — Sizing for use inside a Button avatar.
- `shape?: AvatarShape`
+ `HTML element`

```jsx
<HStack spacing={1}><Avatar initials="JD" color="tertiary" /><Avatar src="/me.jpg" alt="Jane Doe" /></HStack>
```

### Divider
A decorative separator line (role="separator"); with children or `indicatorText`, a line with a centered pill label.

- `color?: Color` = `'default'` — Palette; only paints when colored (a palette name implies it). `default` draws Border-Variant.
- `colored?: boolean` — Draw the line in `color` rather than the decorative border.
- `orientation?: 'horizontal' | 'vertical'` = `'horizontal'`
- `size?: Size` = `'small'` — Line weight: 0.5 / 1 / 2px.
- `indicatorText?: ReactNode` — Pill label text (children work too).
- `indicatorStyle?: 'outline' | 'light'` = `'outline'` — **Deprecated.** The pill has one style; "light" was removed.
- `textAlign?: 'center' | 'left' | 'right' | 'start' | 'end' | 'top' | 'bottom'` = `'center'` — Where the pill sits along the line.
+ `children`, `<div>`

```jsx
<VStack spacing={2}><Body>Above</Body><Divider>or</Divider><Body>Below</Body></VStack>
```

### List
A list of rows, from `items` data or `<ListItem>` children; optional checkbox / radio selection and loading / empty / error states.

- `items?: ListItemData[]` — Rows as data (alternative to ListItem children).
- `variant?: 'default' | 'solid' | 'light'` = `'default'` — default = no fill; solid / light paint the `color` theme.
- `color?: Exclude<Color, 'default'>` = `'primary'`
- `size?: Size` = `'medium'`
- `orientation?: 'vertical' | 'horizontal'` = `'vertical'`
- `dividers?: boolean` = `false` — Separator between rows.
- `selectionMode?: 'none' | 'checkbox' | 'radio'` = `'none'` — Rows become options (listbox).
- `loading?: boolean` = `false` — Ghosted placeholder rows while data loads.
- `skeletonRows?: number` = `3` — Placeholder rows shown while loading.
- `empty?: ReactNode` — Shown when `items` is empty — usually a StateMessage.
- `error?: ReactNode` — Shown instead of rows — usually a StateMessage.
- `selectedIndices?: number[]` = `[]` — Indexes of selected `items` (controlled).
- `onSelectionChange?: (selectedIndices: number[]) => void` — Called with the new selected indexes.
- `clickable?: boolean` = `false` — Every row gets card chrome and hover / pressed states.
- `component?: ElementType` = `'ul'` — Element to render.
+ `children`, `<ul>`

```jsx
<List items={[{ label: 'Inbox', secondary: '3 new' }, { label: 'Sent' }]} dividers />
```

### ListItem
One list row: title (children), secondary line, eyebrow, image and start / end decorators. **Parent:** Inside `<List>`.

- `startDecorator?: ReactNode`
- `endDecorator?: ReactNode`
- `startDecoratorIsButton?: boolean` = `false` — Make the start decorator its own icon button.
- `endDecoratorIsButton?: boolean` = `false`
- `onStartDecoratorAction?: (event: MouseEvent<HTMLButtonElement>) => void`
- `onEndDecoratorAction?: (event: MouseEvent<HTMLButtonElement>) => void`
- `startDecoratorAriaLabel?: string` — Accessible name of a decorator button — name the action.
- `endDecoratorAriaLabel?: string`
- `size?: Size` = `'medium'`
- `variant?: 'default' | 'solid' | 'light'` = `'default'`
- `color?: Color`
- `eyebrow?: ReactNode` — Small line above the title.
- `overline?: ReactNode` — **Deprecated.** Use eyebrow.
- `secondary?: ReactNode` — Supporting line below the title.
- `image?: string | boolean | ReactNode` — 80px square at the start: a URL, a node, or true for a placeholder.
- `imageAlt?: string` = `''` — Alt text for a URL image; empty when decorative.
- `clickable?: boolean` = `false` — Hover / pressed states and card chrome (implied by onClick).
- `disabled?: boolean` = `false`
- `selected?: boolean` = `false`
- `selectionMode?: 'none' | 'checkbox' | 'radio'` = `'none'` — Show a checkbox / radio mark; the row becomes an option.
- `onSelect?: (event: SyntheticEvent) => void` — Called when a selectable row is chosen.
- `onClick?: (event: SyntheticEvent) => void`
- `bottomBorder?: boolean` = `false` — Hairline below (non-clickable vertical lists).
- `rightBorder?: boolean` = `false` — Hairline to the right (non-clickable horizontal lists).
- `component?: ElementType` = `'li'` — Element to render; 'div' when not a direct child of a <ul>.
+ `children`, `<li>`

```jsx
<List>
  <ListItem startDecorator={<Icon size="small"><InboxIcon /></Icon>} secondary="3 new" onClick={() => {}}>Inbox</ListItem>
</List>
```

### ListItemDecorator
A list row's decorator slot; an icon button when `isButton`. ListItem builds these from start/endDecorator — use directly only in custom rows. **Parent:** Inside a `<ListItem>` row.

- `size?: Size` = `'medium'`
- `isButton?: boolean` = `false` — Render as an icon-only ghost Button.
- `onAction?: (event: MouseEvent<HTMLButtonElement>) => void` — Click handler when `isButton`.
- `ariaLabel?: string` — Accessible name when `isButton` — name the action.
- `disabled?: boolean` = `false`
+ `children`

```jsx
<ListItemDecorator isButton ariaLabel="Delete item" onAction={() => {}}><DeleteIcon /></ListItemDecorator>
```

### Table
Data table from `columns` + `rows` (or raw thead/tbody children), with striping, sticky header/footer and loading / empty / error states.

- `columns?: Array<TableColumn | string>`
- `rows?: Array<Record<string, ReactNode> | ReactNode[]>` — Objects keyed by column field, or arrays of cells.
- `footerRows?: Array<Record<string, ReactNode> | ReactNode[]>` — Rows in a <tfoot> (totals).
- `variant?: 'default' | 'outlined' | 'light' | 'solid'` = `'default'` — default | outlined (border) | light (tinted header) | solid (themed).
- `color?: Exclude<Color, 'default'>` = `'primary'`
- `loading?: boolean` = `false` — Ghosted rows while data loads.
- `skeletonRows?: number` = `3`
- `empty?: ReactNode` — Shown when `rows` is empty — usually a StateMessage.
- `error?: ReactNode` — Shown instead of rows — usually a StateMessage.
- `size?: Size` = `'medium'` — Cell padding and type size.
- `stripe?: 'none' | 'odd' | 'even'` = `'none'` — Alternate row surfaces.
- `stickyHeader?: boolean` = `false`
- `stickyFooter?: boolean` = `false`
+ `children`, `<div>`

```jsx
<Table columns={[{ label: 'Name', field: 'name' }, { label: 'Role', field: 'role' }]}
  rows={[{ name: 'Ada', role: 'Engineer' }, { name: 'Lin', role: 'Designer' }]} stripe="odd" />
```

### AvatarGroup
Overlapping avatars with a "+N" overflow. `people` data gives buttons, hover cards and an overflow list; Avatar children give a static row.

- `people?: AvatarGroupPerson[]` — People as data (alternative to Avatar children).
- `max?: number` = `5` — Avatars shown before "+N".
- `size?: Size` = `'medium'`
- `spacing?: number` — Overlap step in px (negative overlaps).
- `onPersonClick?: (person: AvatarGroupPerson) => void` — Called with the person whose avatar was pressed.
- `onOverflowClick?: (hidden: AvatarGroupPerson[]) => void` — Called with the hidden people when "+N" is pressed.
- `buttonVariant?: 'ghost' | 'text' | (string & {})` = `'ghost'` — Button variant of clickable avatars.
- `shape?: AvatarShape` — Shape of every avatar.
+ `children`, `<div>`

```jsx
<AvatarGroup max={3} people={[{ name: 'Ada Lovelace', initials: 'AL' }, { name: 'Lin Wu', initials: 'LW' }, { name: 'Sam Roe', initials: 'SR' }, { name: 'Kai Ito', initials: 'KI' }]} />
```

### Tag
A small uppercase status / category label (non-interactive). For filters or removable tags use Chip.

- `color?: Color` = `'default'`
- `width?: 'hug' | 'fill'` = `'hug'` — hug = fit the label; fill = full width.
- `shape?: 'square' | 'rounded' | 'squircle' | 'pill'` — Corner override; unset follows the brand's --Tag-Radius.
- `allCaps?: boolean` — **Deprecated.** Tags are always uppercase.
+ `children`, `<span>`

```jsx
<HStack spacing={1}><Tag color="success">Active</Tag><Tag color="warning" shape="pill">Beta</Tag></HStack>
```

### PrimaryTag · SecondaryTag · TertiaryTag · NeutralTag · InfoTag · SuccessTag · WarningTag · ErrorTag
Tag with its color preset.

+ all `Tag` props

```jsx
<ErrorTag>Overdue</ErrorTag>
```

## Media

### Ratio
A bare media slot that holds an aspect ratio (image, video, map). No states — wrap it in a Card or Link to make it clickable.

- `ratio?: RatioName` = `'1:1'`
- `color?: Color` = `'default'` — Palette of the inner surface.
- `padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` = `'none'` — Inner padding step.
- `fit?: 'width' | 'height'` = `'width'` — width = fill the parent's width; height = fill its (definite) height.
- `placeholder?: boolean` = `false` — Show the image placeholder while empty.
- `maxWidth?: number | string` — CSS max width, e.g. 320 or "40%".
- `maxHeight?: number | string`
- `component?: ElementType` = `'div'` — Element to render.
- `shape?: IconShape | AvatarShape | (string & {})` — Cut the slot to a system shape (round shapes want ratio="1:1").
- `variant?: string` = `'default'` — **Deprecated.** Removed — Ratio has one style. Use Card or Box for a framed block.
- `elevated?: boolean` = `false` — **Deprecated.** Removed — wrap in a Card / Button / Link.
- `clickable?: boolean` = `false` — **Deprecated.** Removed — wrap in a Card / Button / Link.
- `onClick?: MouseEventHandler<HTMLElement>` — **Deprecated.** Removed — wrap in a Card / Button / Link.
+ `children`, `<div>`

```jsx
<Ratio ratio="16:9" placeholder />
```

### BrandIcon
A company mark (GitHub, LinkedIn, Figma…) from Font Awesome Brands. Not for UI icons — those are Icon. Unknown names render nothing.

- `name?: string` — Lowercase hyphenated Font Awesome name: 'github', 'x-twitter', 'linkedin'.
- `icon?: BrandIconDefinition` — An icon object instead of a name.
- `size?: string | number` = `'1em'` — Width and height (CSS length).
- `color?: string` = `'currentColor'` — Fill. Inherits the text color by default.
- `title?: string` — Accessible name; without it the mark is aria-hidden.
+ `<svg>`

```jsx
<BrandIcon name="github" title="GitHub" />
```

### Quote
Pull quote / testimonial: the words in Header type, attribution with optional photo.

- `children?: ReactNode` — The quoted words.
- `cite?: ReactNode` — Who said it.
- `detail?: ReactNode` — Role or company under the name.
- `avatarSrc?: string` — Photo beside the attribution.
- `avatarInitials?: string` — Initials when there is no photo.
- `size?: Size` = `'medium'` — Text scale: H5 / H4 / H3.
- `align?: 'start' | 'center'` = `'start'`
- `mark?: boolean` = `true` — Show the decorative quotation mark.
- `markColor?: Color` = `'primary'` — Icon color of the mark.
+ `<div>`

```jsx
<Quote cite="Priya Shah" detail="Studio Lead, Northwind">It changed how we ship.</Quote>
```

### Shape
Clips content to a shape: image frames, accents, stickers. Not for buttons/cards; nothing focusable inside (the mask clips focus rings).

- `shape?: ShapeName` = `'circle'`
- `children?: ReactNode` — An img / video fills the shape; other content sits in its safe area.
- `width?: number | string` = `96` — px number or CSS length.
- `height?: number | string` — Defaults to width (square).
- `color?: Color` — Makes it a themed surface; without it the shape paints nothing.
- `variant?: 'solid' | 'light' | 'dark'` = `'solid'` — With color: solid = Surface, light = Surface-Brightest, dark = Surface-Dimmest.
- `decorative?: boolean` = `false` — aria-hidden (pure ornament).
- `component?: ElementType` = `'div'` — Element to render.
+ `<div>`

```jsx
<Shape shape="soft-burst" color="warning" width={64}>NEW</Shape>
```

### ImagePlaceholder
Where an image will go: a tinted box with a photo glyph. Fills its parent — size the parent. Decorative unless given role="img" + aria-label.

- `sx?: Sx`
+ `<div>`

```jsx
<Ratio ratio="16:9"><ImagePlaceholder /></Ratio>
```

### Player
Audio player UI: artwork, title, scrubber, play/pause, optional skip / previous / next. You own the audio; this only draws and reports.

- `title?: ReactNode`
- `subtitle?: ReactNode`
- `imageSrc?: string` — Artwork URL.
- `imageAlt?: string`
- `avatarSrc?: string` — Older name for imageSrc.
- `avatarInitials?: string` — **Deprecated.** Ignored — a track has artwork, not initials. Use imageSrc.
- `position?: number` — Seconds (controlled).
- `defaultPosition?: number` = `0` — Seconds (uncontrolled start).
- `duration?: number` = `0` — Track length in seconds.
- `onSeek?: (seconds: number) => void` — Called with the new position in seconds. No onSeek = not scrubbable.
- `playing?: boolean` — Controlled play state.
- `defaultPlaying?: boolean` = `false`
- `onPlayPause?: (playing: boolean) => void` — Called with the requested play state.
- `onPrevious?: MouseEventHandler<HTMLButtonElement>` — Shows a previous-track button.
- `onNext?: MouseEventHandler<HTMLButtonElement>` — Shows a next-track button.
- `onSkip?: (deltaSeconds: number) => void` — Shows back / forward buttons; called with -skipSeconds or +skipSeconds.
- `skipSeconds?: number` = `10`
- `variant?: Color` = `'default'` — Color of the play button and scrubber.
- `size?: Size` = `'medium'`
- `disabled?: boolean` = `false`
- `showTime?: boolean` = `true` — Elapsed / remaining times under the scrubber.
+ `<div>`

```jsx
<Player title="Episode 12" subtitle="The Design Pod" duration={1830}
  playing={checked} onPlayPause={setChecked} position={page} onSeek={setPage} />
```

### CurvedText
Display text along one or more arcs (SVG), optionally bevelled. Decorative brand moments, not body copy.

- `text?: string` = `'Your Brand. Perfected.'`
- `curves?: Array<{ arc: number; radius: number; direction?: 'up' | 'down' }>` — Several arcs for a wave; overrides arc / radius / direction.
- `arc?: number` = `160` — Single curve: degrees of arc.
- `radius?: number` = `300` — Single curve: radius in px.
- `direction?: 'up' | 'down'` = `'up'`
- `rotation?: number` = `0` — Degrees to rotate the whole block.
- `autoCrop?: boolean` = `true` — Crop the viewBox to the drawn text.
- `textStyle?: 'display-large' | 'display-small'` = `'display-large'` — Typography token set.
- `fontSize?: number` — px override.
- `fontFamily?: string`
- `fontWeight?: number | string`
- `letterSpacing?: number | string | null` — px override.
- `color?: string` = `'var(--Text, #1a1a1a)'` — CSS color or token.
- `bevel?: boolean` = `false` — Simple bevel in bevelTheme's button colors.
- `bevelTheme?: BevelTheme` = `'Primary'`
- `bevelPreset?: BevelPreset` — Named bevel; overrides `bevel`.
- `bevelCustom?: BevelCustom` — Overrides when bevelPreset="custom".
+ `<svg>`

```jsx
<CurvedText text="Fresh every morning" arc={120} radius={240} />
```

### BevelText
Straight display text with an inset bevel and optional drop shadow, colored from a theme's button tokens.

- `text?: string` = `'DinoDesign'`
- `theme?: BevelTheme` = `'Primary'`
- `preset?: BevelPreset` = `'Classic'`
- `custom?: BevelCustom` — Overrides when preset="custom".
- `textStyle?: 'display-large' | 'display-small'` = `'display-large'`
- `fontSize?: number | string`
- `fontFamily?: string`
- `fontWeight?: number | string`
- `letterSpacing?: number | string`
+ `<svg>`

```jsx
<BevelText text="Grand Opening" theme="Secondary" preset="Embossed" />
```

## Charts

### BarChart
Single-series bars in a track, themed by the surface it sits on. Ships a hidden data table for screen readers.

- `showTrack?: boolean` = `true` — Track behind each bar.
- `rounded?: boolean` = `true` — Round bar ends.
- `showValues?: boolean` = `false` — Value above each bar.
- `showLabels?: boolean` = `true` — Category labels under the bars.
- `height?: number` = `200` — px.
- `gapRatio?: number` = `0.4` — Gap between bars as a fraction of a slot (0–1).
- `data?: ChartDatum[]` = `[]` — Numbers, or `{ value, label }` objects.
- `interactive?: boolean` = `true` — Hover / focus readout per point.
- `animate?: boolean` = `true` — Grow / draw in on mount (respects reduced motion).
- `label?: string` — Caption of the screen-reader data table.
+ `HTML element`

```jsx
<BarChart data={[{ value: 12, label: 'Mon' }, { value: 18, label: 'Tue' }, { value: 9, label: 'Wed' }]} label="Orders per day" />
```

### LineChart
One series as a line (smooth or straight) with optional area fill.

- `curve?: 'smooth' | 'straight'` = `'smooth'`
- `gradient?: boolean` = `true` — Fill the area under the line.
- `fromZero?: boolean` = `false` — Anchor the value axis at zero.
- `showGrid?: boolean` = `false` — Horizontal gridlines at round values.
- `showLabels?: boolean` = `false` — Category labels on the x axis.
- `height?: number` = `200` — px.
- `strokeWidth?: number` = `3` — Line width in px.
- `tension?: number` = `0` — Curve tension for smooth (0 = Catmull-Rom).
- `data?: ChartDatum[]` = `[]` — Numbers, or `{ value, label }` objects.
- `interactive?: boolean` = `true` — Hover / focus readout per point.
- `animate?: boolean` = `true` — Grow / draw in on mount (respects reduced motion).
- `label?: string` — Caption of the screen-reader data table.
+ `HTML element`

```jsx
<LineChart data={[4, 7, 5, 9, 12]} label="Weekly signups" showGrid />
```

### PieChart
Parts of a whole; `donut` for a ring. Wedges cycle the icon palettes.

- `donut?: boolean` = `false`
- `donutRatio?: number` = `0.6` — Inner radius as a fraction of the outer.
- `colors?: Array<'Primary' | 'Secondary' | 'Tertiary' | 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'>` = `CHART_PALETTES` — Palette per wedge, cycled.
- `separatorWidth?: number` = `2` — Gap between wedges in px.
- `size?: number` = `200` — Diameter in px.
- `showLabels?: boolean` = `false` — Labels inside wedges.
- `data?: ChartDatum[]` = `[]` — Numbers, or `{ value, label }` objects.
- `interactive?: boolean` = `true` — Hover / focus readout per point.
- `animate?: boolean` = `true` — Grow / draw in on mount (respects reduced motion).
- `label?: string` — Caption of the screen-reader data table.
+ `HTML element`

```jsx
<PieChart donut data={[{ value: 60, label: 'Direct' }, { value: 25, label: 'Search' }, { value: 15, label: 'Social' }]} label="Traffic sources" />
```

## App structure

### Footer
Site footer: brand, up to three link columns, social links, copyright.

- `color?: 'default' | 'primary' | 'primary-dark' | 'white' | 'black' | (string & {})` = `'default'` — default = the designer's dark band.
- `brand?: ReactNode`
- `address?: { company?: string; lines?: string[]; email?: string; phone?: string }`
- `columns?: FooterColumn[]` = `[]` — Up to three: `[{ title, links: [{ label, href }] }]`.
- `socialLinks?: FooterSocialLink[]` = `[]` — `[{ url, brand: 'github' }]`.
- `copyright?: boolean` = `true` — Show the copyright line.
- `subscribe?: { title?: string; onSubscribe?: (email: string) => void }` — Email signup block.
- `copyrightName?: string`
- `copyrightYear?: number`
+ `children`, `<div>`

```jsx
<Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} copyrightName="Acme" />
```

### AppBar · DesktopAppBar · MobileAppBar
Site / app top bar on the App-Bar theme. Links fold into a menu button below `collapseAt`. DesktopAppBar / MobileAppBar are its two modes as components.

- `mode?: 'desktop' | 'mobile'` = `'desktop'` — desktop = site nav; mobile = an app-screen bar (search or title).
- `size?: Size` = `'medium'`
- `barColor?: 'default' | 'primary' | 'primary-light' | 'white' | 'black'` = `'default'` — Leave unset: the bar wears the designer's App-Bar choice.
- `sticky?: boolean` = `true` — Stays at the top of its scrolling parent (desktop).
- `surface?: Surface` = `'Surface'`
- `brand?: ReactNode`
- `onBrandClick?: MouseEventHandler<HTMLElement>`
- `navLinks?: Array<AppBarLink | string>` = `[]` — Site links `{ label, href, current? }` (strings work too).
- `collapseAt?: number` = `900` — Width in px below which links fold into a menu.
- `menuType?: 'auto' | 'hamburger' | 'expanded' | 'none'` = `'auto'` — auto | hamburger (always) | expanded (tabs) | none.
- `showMenu?: boolean` = `true`
- `onMenuClick?: MouseEventHandler<HTMLElement>`
- `centerSlot?: ReactNode` — Replaces the middle (links / search).
- `endSlot?: ReactNode` — Right side actions — a fragment of buttons, primary last.
- `searchPosition?: 'left' | 'right' | 'none'`
- `searchValue?: string`
- `onSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void`
- `searchPlaceholder?: string` = `'Search...'`
- `loginType?: 'login' | 'avatar' | 'none'` = `'login'` — Right side when no endSlot: login button, avatar, or nothing.
- `onLogin?: () => void`
- `onSignOut?: () => void`
- `user?: { displayName?: string; photoURL?: string } | null`
- `brandType?: 'name' | 'logo'` = `'name'`
- `companyName?: string` = `'Company'`
- `rightButtons?: Array<{ icon: ReactNode; label?: string; raw?: boolean }>` = `[]`
- `showRightButtons?: boolean` = `false`
- `layout?: 'left-brand' | 'center-brand' | 'title'` — Figma's AppBar Layout.
- `title?: ReactNode` = `'Page Title'`
- `mobileVariant?: 'search' | 'small' | 'medium' | 'large'` = `'search'` — mode="mobile" only.
- `subtitle?: ReactNode` = `'Subtitle text'` — mode="mobile" only.
- `actionIcon?: ReactNode` — mode="mobile" only: trailing action icon.
- `className?: string` = `''`
+ `children`

```jsx
<AppBar brand="Acme"
  navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
  endSlot={<><Button variant="default-outline" size="small">Log in</Button><Button variant="default" size="small">Sign up</Button></>} />
```

### Copyright
The "© year Company. All rights reserved." strip under a footer. Footer already includes one.

- `color?: 'default' | 'primary' | 'primary-dark' | 'white' | 'black'` = `'default'` — Same presets as Footer: default = Neutral at Surface-Dimmest.
- `companyName?: string` = `''`
- `year?: number` = `new Date().getFullYear()`
- `rights?: string` = `'All rights reserved'` — Trailing sentence; '' omits it.
- `children?: ReactNode` — Replaces the whole text.
+ `<div>`

```jsx
<Copyright companyName="Acme" />
```

## Utilities

### CodeBlock
Code, a shell command or a copyable URL on a dark Neutral region, with its own copy button. Do not override its background.

- `code?: string` = `''` — The text shown and copied.
- `language?: string` = `'JSX'` — Header label: 'bash', 'JSX', 'CSS', 'URL'.
- `showCopy?: boolean` = `true`
- `showHeader?: boolean` = `true`
- `copyInHeader?: boolean` — Copy button in the header (defaults to showHeader).
- `copyInBody?: boolean` — Copy button in the code area (defaults to !showHeader).
- `maxHeight?: number | string` — Cap the code area and scroll past it (CSS length or px).
- `wrap?: boolean` = `false` — Wrap long lines instead of scrolling.
+ `<div>`

```jsx
<CodeBlock code="npm install @omni-design/components" language="bash" />
```

### CopyButton
The icon button that copies text and confirms — CodeBlock's, on its own.

- `code: string` — The text to copy.
- `label?: string` = `'Copy code'` — Accessible name.

```jsx
<CopyButton code="https://example.com/invite/abc" label="Copy link" />
```

### Colors
Gallery page showing the design system's color palette. A docs/showcase view; takes no props.

```jsx
<Colors />
```

### Spacing
Gallery page showing the spacing and sizing scales. A docs/showcase view; takes no props.

```jsx
<Spacing />
```

### SettingsPanel
The gallery's settings panel (platform, style, mode). Reads the provider; takes no props.

```jsx
<SettingsPanel />
```
