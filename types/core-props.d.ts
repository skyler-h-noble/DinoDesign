// types/core-props.d.ts — the shared vocabulary, and the props of the
// components a page is built from.
//
// The rest of the components' props live in types/props/*.d.ts. Together they
// are the ONE source of truth for the package's component API:
//   - scripts/fix-dts.mjs swaps these in for the signatures tsc infers from
//     the JS (which typed most props `any`, so `varient="primary"` or
//     `theme="Primary-Light"` compiled and failed silently at runtime), and
//     FAILS the build if a component destructures a prop its type does not
//     declare — add a prop to a component, add it here;
//   - scripts/build-api-doc.mjs turns the same JSDoc into docs/API.md.
// The tag format is described at the top of scripts/lib/api-model.mjs.
import type * as React from 'react';

// ─── Shared vocabularies ─────────────────────────────────────────────────────

/** A region's palette. Lighter / darker is a surface level, not a theme. */
export type Theme =
  | 'Default' | 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral'
  | 'Info' | 'Success' | 'Warning' | 'Error'
  | 'App-Bar' | 'Nav-Bar' | 'Status';

/** Page levels, darkest → brightest, then the card (container) levels. */
export type Surface =
  | 'Surface-Dimmest' | 'Surface-Dim' | 'Surface' | 'Surface-Bright' | 'Surface-Brightest'
  | 'Container-Lowest' | 'Container-Low' | 'Container' | 'Container-High' | 'Container-Highest';

/** A component's color, lower case. `default` is the designer's button color, not primary. */
export type Color =
  | 'default' | 'primary' | 'secondary' | 'tertiary' | 'neutral'
  | 'info' | 'success' | 'warning' | 'error';

export type Size = 'small' | 'medium' | 'large';

/** Solid, outline or ghost in any color; plain ghost / text; black-white. No `-light`. */
export type ButtonVariant =
  | Color | `${Color}-outline` | `${Color}-ghost`
  | 'black-white' | 'black-white-outline' | 'black-white-ghost'
  | 'ghost' | 'text' | 'outline' | 'danger';

/** Body-text colors. `quiet` is muted copy; `eyebrow` is the section's eyebrow rotation. */
export type TextColor =
  | 'standard' | 'default' | 'inherit' | 'quiet' | 'eyebrow'
  | 'primary' | 'secondary' | 'tertiary' | 'neutral'
  | 'info' | 'success' | 'warning' | 'error';

/** Heading colors: TextColor without quiet / eyebrow (headings need only 3:1). */
export type HeadingColor = Exclude<TextColor, 'quiet' | 'eyebrow'>;

export type IconShape =
  | 'rounded' | 'squircle' | 'circle' | 'square' | 'gem' | 'pentagon' | 'heptagon' | 'diamond'
  | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9' | 'cookie-12' | 'sunny' | 'flower' | 'puffy'
  | 'arch' | 'cut-corners' | 'octagon';

export type AvatarShape =
  | 'circle' | 'squircle' | 'rounded' | 'cookie-4' | 'cookie-6' | 'cookie-7' | 'cookie-9'
  | 'cookie-12' | 'flower' | 'gem' | 'puffy' | 'bun';

/** Every text style Typography accepts by name (`overline-*` are the old Eyebrow names). */
export type TextStyle =
  | 'display-large' | 'display-medium' | 'display-small'
  | 'alt-display-large' | 'alt-display-medium' | 'alt-display-small'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle-large' | 'subtitle' | 'subtitle-medium' | 'subtitle-small'
  | 'body-large' | 'body-large-semibold' | 'body-large-bold'
  | 'body' | 'body-medium' | 'body-semibold' | 'body-medium-semibold' | 'body-bold' | 'body-medium-bold'
  | 'body-small' | 'body-small-semibold' | 'body-small-bold'
  | 'caption' | 'caption-bold' | 'legal' | 'legal-semibold'
  | 'label-extra-small' | 'label-small' | 'label' | 'label-medium' | 'label-large' | 'mobile-nav-label'
  | 'eyebrow-small' | 'eyebrow' | 'eyebrow-medium' | 'eyebrow-large'
  | 'overline-small' | 'overline' | 'overline-medium' | 'overline-large'
  | 'number-small' | 'number-medium' | 'number-large'
  | 'button-extra-small' | 'button-small' | 'button' | 'button-standard';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type GridSize = number | 'auto' | 'grow';
/** MUI's `sx` style object. Layout only — never color, background or radius. */
export type Sx = Record<string, unknown> | Array<Record<string, unknown>>;

/** Native attributes a component forwards — id, aria-*, onClick, role… —
 *  minus names the component defines itself. */
export type Native<E = HTMLElement, Own extends PropertyKey = never> =
  Omit<React.HTMLAttributes<E>, 'color' | 'title' | 'translate' | Own>;

// ─── Layout ──────────────────────────────────────────────────────────────────

/**
 * A page region that paints its theme + surface; everything inside picks contrast-checked colors.
 * @category Layout
 * @exports Section
 * @example
 * <Section theme="Primary" surface="Surface" padding="80px 24px">
 *   <H2>Title</H2>
 * </Section>
 */
export interface SectionProps extends Native {
  /** Palette. Omit to inherit the parent's. */
  theme?: Theme;
  /** How light the region sits. */
  surface?: Surface;
  /** Element to render: 'header', 'footer', 'article', … */
  as?: React.ElementType;
  /** CSS padding, e.g. "80px 24px". */
  padding?: string | number;
  /** Shaped top edge — a name from EDGE_NAMES (e.g. 'wave'). */
  edgeTop?: string;
  /** Shaped bottom edge — a name from EDGE_NAMES. */
  edgeBottom?: string;
  /** Edge height in px (overrides edgeSize). */
  edgeHeight?: number;
  /** Edge depth preset. */
  edgeSize?: Size;
  /** Animate a repeating edge. */
  edgeAnimate?: boolean;
  /** Seed for edges with randomness. */
  edgeSeed?: number;
  children?: React.ReactNode;
}

/**
 * Centers content at a max width. Layout only — paints nothing.
 * @category Layout
 * @exports Container
 * @source Container/Container.mui#ContainerMui
 * @example
 * <Container maxWidth="md"><Body>Centered.</Body></Container>
 */
export interface ContainerProps extends Native {
  /** Max width breakpoint; false = full width. */
  maxWidth?: Breakpoint | false;
  /** Remove the side padding. */
  disableGutters?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * 12-column responsive grid (MUI 7 Grid): a container, and children sized per breakpoint.
 * @category Layout
 * @exports Grid
 * @source Grid/Grid.mui#GridMui
 * @example
 * <Grid container spacing={3}>
 *   <Grid size={{ xs: 12, md: 4 }}><Card>One</Card></Grid>
 *   <Grid size={{ xs: 12, md: 8 }}><Card>Two</Card></Grid>
 * </Grid>
 */
export interface GridProps extends Native {
  /** This element is the grid; its children are the cells. */
  container?: boolean;
  /** MUI 5 spelling; no effect — every child of a container is an item. */
  item?: boolean;
  /** Gap in 8px units (container). */
  spacing?: number | string;
  /** Columns per breakpoint: `{ xs: 12, md: 4 }`, or one number. */
  size?: GridSize | Partial<Record<Breakpoint, GridSize>>;
  /** Legacy per-breakpoint columns; prefer `size`. */
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  /** Total columns. */
  columns?: number;
  rowSpacing?: number | string;
  columnSpacing?: number | string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Columns to skip before this cell. */
  offset?: GridSize | Partial<Record<Breakpoint, GridSize>>;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Flex stack with token gaps. VStack = column, HStack = row, Stack = column unless `direction`.
 * @category Layout
 * @exports VStack HStack Stack
 * @source Stack/Stack.mui#OmniStackMui
 * @example
 * <VStack spacing={2} alignItems="center">
 *   <H2>Title</H2>
 *   <HStack spacing={1}><Button>One</Button><Button>Two</Button></HStack>
 * </VStack>
 */
export interface StackProps extends Native {
  /** Element to render — a list is component="ul" with HStack component="li" rows. */
  component?: React.ElementType;
  /** Gap in 8px units, or a CSS length. */
  spacing?: number | string;
  /** Alias of spacing. */
  gap?: number | string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  flexWrap?: React.CSSProperties['flexWrap'];
  /** Element placed between children. */
  divider?: React.ReactNode;
  /** Never let the gap fall below the minimum-gap token. */
  enforceMinGap?: boolean;
  /** The CSS variable used as the minimum gap. */
  minGapToken?: string;
  useFlexGap?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Surfaces ────────────────────────────────────────────────────────────────

/**
 * A card on a Container level; pads itself. Use `href` to make the whole card a link.
 * @category Surfaces
 * @exports Card
 * @example
 * <Card elevated>
 *   <Subtitle>Card title</Subtitle>
 *   <BodySmall color="quiet">One sentence.</BodySmall>
 * </Card>
 */
export interface CardProps extends Native<HTMLElement, 'onClick'> {
  /** solid = on a Container level; light / dark = a tinted or deep card in `color`. */
  variant?: 'solid' | 'light' | 'dark';
  /** Palette for light / dark variants. */
  color?: Color;
  /** Inner surface override. */
  surface?: Surface;
  /** Padding scale. */
  size?: Size;
  orientation?: 'vertical' | 'horizontal';
  /** Hover / pressed states and pointer cursor. */
  clickable?: boolean;
  selected?: boolean;
  /** Casts a shadow. */
  elevated?: boolean;
  draggable?: boolean;
  disabled?: boolean;
  /** Makes the whole card a link. */
  href?: string;
  /** Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router. */
  reloadDocument?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

/**
 * Triggers an action. Navigation is a Link. Default variant is `default` (the designer's button), not primary.
 * @category Buttons
 * @exports Button
 * @ref HTMLButtonElement
 * @example
 * <HStack spacing={1}>
 *   <Button variant="default" onClick={() => {}}>Save</Button>
 *   <Button variant="default-outline">Cancel</Button>
 *   <Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button>
 * </HStack>
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'title'> {
  /** Element to render; an <a> when `href` is set. */
  component?: React.ElementType;
  /** HTML button type; "button" so a Button in a form does not submit it. */
  type?: 'button' | 'submit' | 'reset';
  tabIndex?: number;
  /** Color + shape: `primary`, `primary-outline`, `primary-ghost`, `ghost`, `text`. */
  variant?: ButtonVariant;
  size?: Size;
  /** Shadow at rest. */
  elevated?: boolean;
  /** Toggled-on state in a group. */
  selected?: boolean;
  /** Stretch to the container (text buttons only). */
  fullWidth?: boolean;
  disabled?: boolean;
  /** text | iconOnly | letterNumber | avatar — or use the booleans below. */
  contentType?: 'text' | 'iconOnly' | 'letterNumber' | 'avatar';
  /** Square icon button. Needs aria-label. */
  iconOnly?: boolean;
  /** One letter or digit. Needs aria-label. */
  letterNumber?: boolean;
  /** Circle holding an initial or person icon. */
  avatar?: boolean;
  /** @deprecated A swatch is not a button — use Swatch. */
  swatch?: boolean;
  /** @deprecated See `swatch`. */
  swatchColor?: string;
  /** Alias of startDecorator. */
  startIcon?: React.ReactNode;
  /** Alias of endDecorator. */
  endIcon?: React.ReactNode;
  /** Icon or avatar before the label. */
  startDecorator?: React.ReactNode;
  /** Icon or avatar after the label. */
  endDecorator?: React.ReactNode;
  /** Show a Badge on the button. */
  badge?: boolean;
  badgeContent?: React.ReactNode;
  badgeVariant?: Color;
  badgeSize?: Size;
  /** Badge as a dot without content. */
  badgeDot?: boolean;
  /** Numbers above this show as "max+". */
  badgeMax?: number;
  badgeAnchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
  /** Makes it a link. */
  href?: string;
  /** Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router. */
  reloadDocument?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Segmented single/multi choice. Children are `<Button value="…">` with no `variant` (the group sets it).
 * @category Buttons
 * @exports ToggleButtonGroup
 * @example
 * <ToggleButtonGroup value={value} onChange={setValue} size="small">
 *   <Button value="list" size="small">List</Button>
 *   <Button value="grid" size="small">Grid</Button>
 * </ToggleButtonGroup>
 */
export interface ToggleButtonGroupProps extends Native<HTMLElement, 'onChange' | 'defaultValue'> {
  /** Selected value (array when `multiple`). */
  value?: unknown;
  defaultValue?: unknown;
  /** Called with the new value (not an event). */
  onChange?: (value: any) => void;
  /** Allow several selected. */
  multiple?: boolean;
  /** Allow deselecting the last selected segment. */
  allowEmpty?: boolean;
  /** Gaps between segments instead of a joined bar. */
  separated?: boolean;
  /** Unselected segments: outlined, light (brighter surface) or ghost. */
  variant?: 'outlined' | 'light' | 'ghost';
  /** Palette of the selected segment. */
  color?: Color;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  /** @deprecated Use `multiple` (inverted). */
  exclusive?: boolean;
  children?: React.ReactNode;
}

/**
 * Inline text link. Without `href` it renders a button that runs `onClick`. No hover color change by design. An `aria-label` must contain the visible text (voice control); omit it when the link has text.
 * @category Navigation
 * @exports Link
 * @example
 * <Body>Read the <Link href="/docs">docs</Link>.</Body>
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  href?: string;
  target?: string;
  rel?: string;
  /** Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router. */
  reloadDocument?: boolean;
  /** Without href, the link renders as a button that runs this. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Text style name, e.g. 'body-small'. */
  textStyle?: TextStyle | (string & {});
  /** Link color role. */
  color?: string;
  disabled?: boolean;
  /** Force the visited color. */
  visited?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Text ────────────────────────────────────────────────────────────────────

interface TypographyBase extends Native {
  /** Element to render (keep one h1 per page: `<DisplayLarge component="h1">`). */
  component?: React.ElementType;
  /** Text style by name; the named components set it for you. */
  textStyle?: TextStyle;
  /** Alt Display only: default | colored | gradient. */
  altMode?: 'default' | 'colored' | 'gradient';
  /** 'fill' = block, full width; 'hug' = inline. */
  width?: 'fill' | 'hug' | (string & {}) | number;
  /** One line with an ellipsis. */
  noWrap?: boolean;
  /** Margin below. */
  gutterBottom?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}
/** Shared props of every body-sized text component. */
export interface TextProps extends TypographyBase {
  /** Color role. Never `style={{ color }}`. */
  color?: TextColor;
}
/** Shared props of every heading-sized text component. */
export interface HeadingProps extends TypographyBase {
  /** Header color role (3:1). */
  color?: HeadingColor;
}

/**
 * Any text style by name. Prefer the named components below.
 * @category Text
 * @exports Typography
 * @example
 * <Typography textStyle="body-semibold">Semibold body.</Typography>
 */
export interface TypographyProps extends TypographyBase {
  color?: TextColor;
}

/**
 * Display and heading styles, in --Header colors. H1–H6 render h1–h6; Display* render a div — pass `component="h1"` for the page title. Every page has exactly one h1 (category, product and cart pages too); sections below it are H2, then H3. Heading = H4.
 * @category Text
 * @exports DisplayLarge DisplayMedium DisplaySmall H1 H2 H3 H4 H5 H6 Heading
 * @example
 * <><DisplayLarge component="h1">Headline</DisplayLarge><H2 color="primary">Section</H2></>
 */
export interface HeadingTextProps extends HeadingProps {}

/**
 * Display sizes painted with the brand's Alt-Display color or gradient (`altMode`, or an ancestor's data-alt-display).
 * @category Text
 * @exports AltDisplayLarge AltDisplayMedium AltDisplaySmall
 * @example
 * <AltDisplayLarge component="h1" altMode="gradient">Big idea</AltDisplayLarge>
 */
export interface AltDisplayProps extends HeadingProps {}

/**
 * Body copy, in standard and semibold. Body has no true bold — use Subtitle. `*Bold` names are aliases of semibold. Body1 = Body, Body2 = BodySmall.
 * @category Text
 * @exports Body BodySmall BodyLarge BodySemibold BodySmallSemibold BodyLargeSemibold BodyBold BodySmallBold BodyLargeBold Body1 Body2
 * @example
 * <><Body>Normal copy.</Body><BodySmall color="quiet">Muted note.</BodySmall></>
 */
export interface BodyProps extends TextProps {}

/**
 * Bold body text (Body at 700), in --Text. Subtitle = SubtitleMedium; Subtitle1 = SubtitleLarge, Subtitle2 = Subtitle.
 * @category Text
 * @exports Subtitle SubtitleSmall SubtitleMedium SubtitleLarge Subtitle1 Subtitle2
 * @example
 * <Subtitle>Card title</Subtitle>
 */
export interface SubtitleProps extends TextProps {}

/**
 * Small print: Caption for captions and metadata, Legal for fine print.
 * @category Text
 * @exports Caption CaptionBold Legal LegalSemibold
 * @example
 * <Caption color="quiet">Updated 2 hours ago</Caption>
 */
export interface CaptionProps extends TextProps {}

/**
 * The Label type style as text. For a form field's label use FormLabel.
 * @category Text
 * @exports Label LabelExtraSmall LabelSmall LabelLarge MobileNavLabel
 * @example
 * <Label>Shipping</Label>
 */
export interface LabelTextProps extends TextProps {}

/**
 * The small line above a heading. Takes its color from the section (Primary→Secondary, …) — do not recolor. Overline* are its old names.
 * @category Text
 * @exports Eyebrow EyebrowSmall EyebrowMedium EyebrowLarge Overline OverlineSmall OverlineMedium OverlineLarge
 * @example
 * <VStack spacing={1}><Eyebrow>New</Eyebrow><H2>Title</H2></VStack>
 */
export interface EyebrowProps extends TextProps {}

/**
 * Tabular figures for stats and prices.
 * @category Text
 * @exports NumberSmall NumberMedium NumberLarge
 * @example
 * <NumberLarge component="p">$49</NumberLarge>
 */
export interface NumberTextProps extends TextProps {}

/**
 * The button label style as plain text (not a button). ButtonText is Typography's `Button`, renamed so it does not clash with the real Button.
 * @category Text
 * @exports ButtonText ButtonSmall
 * @example
 * <ButtonText>Label</ButtonText>
 */
export interface ButtonTextProps extends TextProps {}

// ─── Data display ────────────────────────────────────────────────────────────

/**
 * Colors and sizes an icon from @omni-design/icons. Decorative (aria-hidden) unless given aria-label.
 * @category Data display
 * @exports Icon
 * @example
 * <Icon color="primary" size="small"><CheckCircleIcon /></Icon>
 */
export interface IconProps extends Native {
  /** Icon color role. */
  color?: Color;
  size?: 'xs' | Size | 'xl';
  /** Explicit size, overrides `size`. */
  fontSize?: string | number;
  disabled?: boolean;
  /** Two-tone rendering. */
  twoTone?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * An icon on a colored tile (feature cards, stats).
 * @category Data display
 * @exports IconBadge
 * @source IconBadge/IconBadge.mui#IconBadgeEmotion
 * @example
 * <IconBadge color="primary" variant="light"><HomeIcon /></IconBadge>
 */
export interface IconBadgeProps extends Native {
  /** Any Button color. */
  color?: Color;
  variant?: 'solid' | 'light' | 'dark';
  size?: Size;
  /** Tile shape. */
  shape?: IconShape;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Compact tag, filter or choice. Color and selection are separate axes.
 * @category Data display
 * @exports Chip
 * @example
 * <HStack spacing={1}>
 *   <Chip label="Design" />
 *   <Chip label="Selected" variant="primary" selected clickable onClick={() => {}} />
 * </HStack>
 */
export interface ChipProps extends Native<HTMLElement, 'onClick'> {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  /** Palette. */
  variant?: Color;
  /** The text (or pass children). */
  label?: React.ReactNode;
  /** Hover / pressed states; focusable. */
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  /** ARIA role when selectable: radio or checkbox. */
  selectionMode?: 'radio' | 'checkbox';
  /** Shows a delete button that calls this. */
  onDelete?: React.MouseEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** MUI's name for the start decorator. */
  icon?: React.ReactNode;
  /** @deprecated Chips have one size. */
  size?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A person or a step number: photo, initials or icon.
 * @category Data display
 * @exports Avatar
 * @example
 * <HStack spacing={1}><Avatar initials="JD" color="tertiary" /><Avatar src="/me.jpg" alt="Jane Doe" /></HStack>
 */
export interface AvatarProps extends Native<HTMLElement, 'onClick'> {
  /** Photo URL. */
  src?: string;
  /** Show the built-in placeholder photo. */
  defaultPhoto?: boolean;
  /** Alt text for the photo. */
  alt?: string;
  initials?: string;
  icon?: React.ReactNode;
  color?: Color;
  size?: 'xxs' | 'xs' | Size | 'xl' | 'xxl';
  /** Exact size in px. */
  customSize?: number;
  clickable?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Sizing for use inside a Button avatar. */
  insideButton?: boolean;
  shape?: AvatarShape;
  sx?: Sx;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

/**
 * Labelled text field (MUI TextField markup). For the full-featured field use TextInput.
 * @category Inputs
 * @exports TextField
 * @source TextField/TextField#TextFieldStatic
 * @example
 * <TextField label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)} helperText="We never share it." />
 */
export interface TextFieldProps {
  label?: React.ReactNode;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  /** Error state. */
  error?: boolean;
  /** Message shown in the error state. */
  errorMessage?: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  variant?: string;
  size?: Size;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  fullWidth?: boolean;
  /** Node inside the field, before the text. */
  startAdornment?: React.ReactNode;
  /** Node inside the field, after the text. */
  endAdornment?: React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  id?: string;
  autoComplete?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: Sx;
}

// ─── Page chrome ─────────────────────────────────────────────────────────────

export interface FooterLink { label: React.ReactNode; href?: string; onClick?: React.MouseEventHandler<HTMLElement>; }
export interface FooterColumn { title: React.ReactNode; links: FooterLink[]; }
export interface FooterSocialLink {
  url: string;
  label?: string;
  name?: string;
  /** A Font Awesome brand name: 'github', 'x-twitter', 'linkedin'… */
  brand?: string;
  icon?: React.ReactNode;
}
/**
 * Site footer: brand, up to three link columns, social links, copyright.
 * @category App structure
 * @exports Footer
 * @example
 * <Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} copyrightName="Acme" />
 */
export interface FooterProps extends Native {
  /** default = the designer's dark band. */
  color?: 'default' | 'primary' | 'primary-dark' | 'white' | 'black' | (string & {});
  brand?: React.ReactNode;
  address?: { company?: string; lines?: string[]; email?: string; phone?: string };
  /** Up to three: `[{ title, links: [{ label, href }] }]`. */
  columns?: FooterColumn[];
  /** `[{ url, brand: 'github' }]`. */
  socialLinks?: FooterSocialLink[];
  /** Show the copyright line. */
  copyright?: boolean;
  /** Email signup block. */
  subscribe?: { title?: string; onSubscribe?: (email: string) => void };
  copyrightName?: string;
  copyrightYear?: number;
  children?: React.ReactNode;
}

export interface AppBarLink {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Marks this link as the current page or section (aria-current + the selected marker). */
  current?: boolean;
}
/**
 * Site / app top bar on the App-Bar theme. Links fold into a menu button below `collapseAt`. DesktopAppBar / MobileAppBar are its two modes as components.
 * @category App structure
 * @exports AppBar DesktopAppBar MobileAppBar
 * @source AppBar/AppBar#AppBar
 * @source AppBar/AppBar#DesktopAppBar
 * @source AppBar/AppBar#MobileAppBar
 * @example
 * <AppBar brand="Acme"
 *   navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
 *   endSlot={<><Button variant="default-outline" size="small">Log in</Button><Button variant="default" size="small">Sign up</Button></>} />
 */
export interface AppBarProps {
  /** desktop = site nav; mobile = an app-screen bar (search or title). */
  mode?: 'desktop' | 'mobile';
  size?: Size;
  /** Leave unset: the bar wears the designer's App-Bar choice. */
  barColor?: 'default' | 'primary' | 'primary-light' | 'white' | 'black';
  /** Stays at the top of its scrolling parent (desktop). */
  sticky?: boolean;
  surface?: Surface;
  brand?: React.ReactNode;
  onBrandClick?: React.MouseEventHandler<HTMLElement>;
  /** Site links `{ label, href, current? }` (strings work too). */
  navLinks?: Array<AppBarLink | string>;
  /** Width in px below which links fold into a menu. */
  collapseAt?: number;
  /** auto | hamburger (always) | expanded (tabs) | none. */
  menuType?: 'auto' | 'hamburger' | 'expanded' | 'none';
  showMenu?: boolean;
  onMenuClick?: React.MouseEventHandler<HTMLElement>;
  /** Replaces the middle (links / search). */
  centerSlot?: React.ReactNode;
  /** Right side actions — a fragment of buttons, primary last. */
  endSlot?: React.ReactNode;
  searchPosition?: 'left' | 'right' | 'none';
  searchValue?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  /** Right side when no endSlot: login button, avatar, or nothing. */
  loginType?: 'login' | 'avatar' | 'none';
  onLogin?: () => void;
  onSignOut?: () => void;
  user?: { displayName?: string; photoURL?: string } | null;
  brandType?: 'name' | 'logo';
  companyName?: string;
  rightButtons?: Array<{ icon: React.ReactNode; label?: string; raw?: boolean }>;
  showRightButtons?: boolean;
  /** Figma's AppBar Layout. */
  layout?: 'left-brand' | 'center-brand' | 'title';
  title?: React.ReactNode;
  /** mode="mobile" only. */
  mobileVariant?: 'search' | 'small' | 'medium' | 'large';
  /** mode="mobile" only. */
  subtitle?: React.ReactNode;
  /** mode="mobile" only: trailing action icon. */
  actionIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  sx?: Sx;
}
