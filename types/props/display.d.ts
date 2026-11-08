// types/props/display.d.ts — surfaces, stack variants, and data display
// (lists, tables, badges, tags, avatar groups).
//
// Part of the component API's source of truth: see the header of
// types/core-props.d.ts and the tag format in scripts/lib/api-model.mjs.
import type * as React from 'react';
import type { Color, Size, Surface, Theme, Sx, Native, StackProps, CardProps, AvatarShape, IconShape, Breakpoint } from '../core-props';

// ─── Surfaces ────────────────────────────────────────────────────────────────

/**
 * A Card that is clickable and shows `selected` — a choice among cards. Same props as Card.
 * @category Surfaces
 * @exports SelectableCard
 * @source Card/Card#Card
 * @example
 * <SelectableCard selected={checked} onClick={() => setChecked(!checked)}><Subtitle>Pro plan</Subtitle></SelectableCard>
 */
export interface SelectableCardProps extends CardProps {}

/**
 * Card regions: CardContent (padded body), CardActions (button row), CardOverflow (full-bleed media), CardCover (background layer).
 * @category Surfaces
 * @exports CardContent CardActions CardOverflow CardCover
 * @parent Inside `<Card>` (reads its size / orientation).
 * @example
 * <Card>
 *   <CardContent><Subtitle>Title</Subtitle></CardContent>
 *   <CardActions><Button size="small">Open</Button></CardActions>
 * </Card>
 */
export interface CardPartProps extends Native<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * A plain surface on a Container level (MUI Paper markup). For content cards prefer Card.
 * @category Surfaces
 * @exports Paper
 * @example
 * <Paper surface="Container-High"><Body>Panel</Body></Paper>
 */
export interface PaperProps extends Native<HTMLDivElement> {
  /** Container level; higher levels cast a larger shadow. */
  surface?: Extract<Surface, `Container${string}`>;
  /** Border instead of a shadow (shorthand for variant="outlined"). */
  outlined?: boolean;
  variant?: 'elevation' | 'outlined';
  /** Square corners. */
  square?: boolean;
  /** Element to render. */
  component?: React.ElementType;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A region that sets theme + surface (paints --Background), with optional radius, elevation and aspect ratio — Figma's Box. Use for a non-card block.
 * @category Layout
 * @exports Box
 * @source Box/Box.mui#BoxMui
 * @example
 * <Box theme="Secondary" surface="Surface-Bright" radius="medium" elevation={2}><Body>Callout</Body></Box>
 */
export interface BoxProps extends Native<HTMLDivElement> {
  theme?: Theme;
  surface?: Surface;
  /** Corner from the Card radius tokens. */
  radius?: 'none' | Size;
  /** Shadow level 0–5. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Aspect ratio: a RATIO_NAMES name ('16:9') or a number (width / height). */
  ratio?: RatioName | number;
  /** Element to render. */
  component?: React.ElementType;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Stack variants ──────────────────────────────────────────────────────────

/**
 * Preset stacks: OmniStack (= Stack), CenteredStack (column, centered), SpaceBetweenStack (row, spread), WrapStack / GridStack (wrapping row), InsetStack (16px side padding), ScrollStack (scrolls vertically). DynoStack is OmniStack's old name.
 * @category Layout
 * @exports OmniStack DynoStack CenteredStack SpaceBetweenStack WrapStack GridStack InsetStack ScrollStack
 * @source Stack/Stack.mui#OmniStackMui
 * @example
 * <SpaceBetweenStack><Subtitle>Total</Subtitle><Body>$49</Body></SpaceBetweenStack>
 */
export interface OmniStackProps extends StackProps {}

/**
 * Column on small screens, row from `breakpoint` up.
 * @category Layout
 * @exports ResponsiveStack
 * @source Stack/Stack#ResponsiveStack
 * @source Stack/Stack.mui#OmniStackMui
 * @example
 * <ResponsiveStack spacing={2} breakpoint="md"><Card>One</Card><Card>Two</Card></ResponsiveStack>
 */
export interface ResponsiveStackProps extends StackProps {
  /** Breakpoint at which the stack turns into a row. */
  breakpoint?: Exclude<Breakpoint, 'xs'>;
}

/**
 * A full-width 1px --Border line between stack rows. For a themed rule use Divider.
 * @category Layout
 * @exports StackDivider
 * @example
 * <VStack><Body>One</Body><StackDivider /><Body>Two</Body></VStack>
 */
export interface StackDividerProps extends Native<HTMLDivElement> {
  sx?: Sx;
}

// ─── Media slot ──────────────────────────────────────────────────────────────

/** An aspect ratio name, as listed in RATIO_NAMES. */
export type RatioName =
  | '1:1' | '3:4' | '4:3' | '16:9' | '9:16' | '2:3' | '3:2' | '1:2' | '2:1' | '9:21' | '21:9'
  | '5:7' | '7:5' | '4:5' | '5:4' | '5:3' | '3:5' | '16:10' | '10:16'
  | 'Golden-Horizontal' | 'Golden-Vertical';

/**
 * A bare media slot that holds an aspect ratio (image, video, map). No states — wrap it in a Card or Link to make it clickable.
 * @category Media
 * @exports Ratio
 * @example
 * <Ratio ratio="16:9" placeholder />
 */
export interface RatioProps extends Native<HTMLDivElement, 'onClick'> {
  ratio?: RatioName;
  /** Palette of the inner surface. */
  color?: Color;
  /** Inner padding step. */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** width = fill the parent's width; height = fill its (definite) height. */
  fit?: 'width' | 'height';
  /** Show the image placeholder while empty. */
  placeholder?: boolean;
  /** The first image a visitor sees: an <img> inside loads at once with high
   *  priority. Off by default. */
  priority?: boolean;
  /** CSS max width, e.g. 320 or "40%". */
  maxWidth?: number | string;
  maxHeight?: number | string;
  /** Element to render. */
  component?: React.ElementType;
  /** Cut the slot to a system shape (round shapes want ratio="1:1"). */
  shape?: IconShape | AvatarShape | (string & {});
  /** @deprecated Removed — Ratio has one style. Use Card or Box for a framed block. */
  variant?: string;
  /** @deprecated Removed — wrap in a Card / Button / Link. */
  elevated?: boolean;
  /** @deprecated Removed — wrap in a Card / Button / Link. */
  clickable?: boolean;
  /** @deprecated Removed — wrap in a Card / Button / Link. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Data display ────────────────────────────────────────────────────────────

/**
 * A decorative separator line (role="separator"); with children or `indicatorText`, a line with a centered pill label.
 * @category Data display
 * @exports Divider
 * @example
 * <VStack spacing={2}><Body>Above</Body><Divider>or</Divider><Body>Below</Body></VStack>
 */
export interface DividerProps extends Native<HTMLDivElement> {
  /** Palette; only paints when colored (a palette name implies it). `default` draws Border-Variant. */
  color?: Color;
  /** Draw the line in `color` rather than the decorative border. */
  colored?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** Line weight: 0.5 / 1 / 2px. */
  size?: Size;
  /** Pill label text (children work too). */
  indicatorText?: React.ReactNode;
  /** @deprecated The pill has one style; "light" was removed. */
  indicatorStyle?: 'outline' | 'light';
  /** Where the pill sits along the line. */
  textAlign?: 'center' | 'left' | 'right' | 'start' | 'end' | 'top' | 'bottom';
  sx?: Sx;
  children?: React.ReactNode;
}

/** One row of List's `items` data. */
export interface ListItemData {
  label?: React.ReactNode;
  children?: React.ReactNode;
  secondary?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** @deprecated Use eyebrow. */
  overline?: React.ReactNode;
  image?: string | boolean | React.ReactNode;
  imageAlt?: string;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  startDecoratorIsButton?: boolean;
  endDecoratorIsButton?: boolean;
  onStartDecoratorAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onEndDecoratorAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startDecoratorAriaLabel?: string;
  endDecoratorAriaLabel?: string;
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  bottomBorder?: boolean;
  rightBorder?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * A list of rows, from `items` data or `<ListItem>` children; optional checkbox / radio selection and loading / empty / error states.
 * @category Data display
 * @exports List
 * @example
 * <List items={[{ label: 'Inbox', secondary: '3 new' }, { label: 'Sent' }]} dividers />
 */
export interface ListProps extends Native<HTMLUListElement> {
  /** Rows as data (alternative to ListItem children). */
  items?: ListItemData[];
  /** default = no fill; solid / light paint the `color` theme. */
  variant?: 'default' | 'solid' | 'light';
  color?: Exclude<Color, 'default'>;
  size?: Size;
  orientation?: 'vertical' | 'horizontal';
  /** Separator between rows. */
  dividers?: boolean;
  /** Rows become options (listbox). */
  selectionMode?: 'none' | 'checkbox' | 'radio';
  /** Ghosted placeholder rows while data loads. */
  loading?: boolean;
  /** Placeholder rows shown while loading. */
  skeletonRows?: number;
  /** Shown when `items` is empty — usually a StateMessage. */
  empty?: React.ReactNode;
  /** Shown instead of rows — usually a StateMessage. */
  error?: React.ReactNode;
  /** Indexes of selected `items` (controlled). */
  selectedIndices?: number[];
  /** Called with the new selected indexes. */
  onSelectionChange?: (selectedIndices: number[]) => void;
  /** Every row gets card chrome and hover / pressed states. */
  clickable?: boolean;
  /** Element to render. */
  component?: React.ElementType;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One list row: title (children), secondary line, eyebrow, image and start / end decorators.
 * @category Data display
 * @exports ListItem
 * @parent Inside `<List>`.
 * @example
 * <List>
 *   <ListItem startDecorator={<Icon size="small"><InboxIcon /></Icon>} secondary="3 new" onClick={() => {}}>Inbox</ListItem>
 * </List>
 */
export interface ListItemProps extends Native<HTMLLIElement, 'onClick' | 'onSelect'> {
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
  /** Make the start decorator its own icon button. */
  startDecoratorIsButton?: boolean;
  endDecoratorIsButton?: boolean;
  onStartDecoratorAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onEndDecoratorAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name of a decorator button — name the action. */
  startDecoratorAriaLabel?: string;
  endDecoratorAriaLabel?: string;
  size?: Size;
  variant?: 'default' | 'solid' | 'light';
  color?: Color;
  /** Small line above the title. */
  eyebrow?: React.ReactNode;
  /** @deprecated Use eyebrow. */
  overline?: React.ReactNode;
  /** Supporting line below the title. */
  secondary?: React.ReactNode;
  /** 80px square at the start: a URL, a node, or true for a placeholder. */
  image?: string | boolean | React.ReactNode;
  /** Alt text for a URL image; empty when decorative. */
  imageAlt?: string;
  /** Hover / pressed states and card chrome (implied by onClick). */
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  /** Show a checkbox / radio mark; the row becomes an option. */
  selectionMode?: 'none' | 'checkbox' | 'radio';
  /** Called when a selectable row is chosen. */
  onSelect?: (event: React.SyntheticEvent) => void;
  onClick?: (event: React.SyntheticEvent) => void;
  /** Hairline below (non-clickable vertical lists). */
  bottomBorder?: boolean;
  /** Hairline to the right (non-clickable horizontal lists). */
  rightBorder?: boolean;
  /** Element to render; 'div' when not a direct child of a <ul>. */
  component?: React.ElementType;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A list row's decorator slot; an icon button when `isButton`. ListItem builds these from start/endDecorator — use directly only in custom rows.
 * @category Data display
 * @exports ListItemDecorator
 * @parent Inside a `<ListItem>` row.
 * @example
 * <ListItemDecorator isButton ariaLabel="Delete item" onAction={() => {}}><DeleteIcon /></ListItemDecorator>
 */
export interface ListItemDecoratorProps {
  size?: Size;
  /** Render as an icon-only ghost Button. */
  isButton?: boolean;
  /** Click handler when `isButton`. */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name when `isButton` — name the action. */
  ariaLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** A Table column: `field` (or `key`) reads the cell from an object row. */
export interface TableColumn {
  label?: React.ReactNode;
  /** Alias of label. */
  header?: React.ReactNode;
  field?: string;
  key?: string;
  /** CSS width of the column. */
  width?: number | string;
}

/**
 * Data table from `columns` + `rows` (or raw thead/tbody children), with striping, sticky header/footer and loading / empty / error states.
 * @category Data display
 * @exports Table
 * @example
 * <Table columns={[{ label: 'Name', field: 'name' }, { label: 'Role', field: 'role' }]}
 *   rows={[{ name: 'Ada', role: 'Engineer' }, { name: 'Lin', role: 'Designer' }]} stripe="odd" />
 */
export interface TableProps extends Native<HTMLDivElement> {
  columns?: Array<TableColumn | string>;
  /** Objects keyed by column field, or arrays of cells. */
  rows?: Array<Record<string, React.ReactNode> | React.ReactNode[]>;
  /** Rows in a <tfoot> (totals). */
  footerRows?: Array<Record<string, React.ReactNode> | React.ReactNode[]>;
  /** default | outlined (border) | light (tinted header) | solid (themed). */
  variant?: 'default' | 'outlined' | 'light' | 'solid';
  color?: Exclude<Color, 'default'>;
  /** Ghosted rows while data loads. */
  loading?: boolean;
  skeletonRows?: number;
  /** Shown when `rows` is empty — usually a StateMessage. */
  empty?: React.ReactNode;
  /** Shown instead of rows — usually a StateMessage. */
  error?: React.ReactNode;
  /** Cell padding and type size. */
  size?: Size;
  /** Alternate row surfaces. */
  stripe?: 'none' | 'odd' | 'even';
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A count or status dot anchored to the corner of its child (icon, avatar, button).
 * @category Feedback
 * @exports Badge
 * @example
 * <Badge badgeContent={4}><Icon><NotificationsIcon /></Icon></Badge>
 */
export interface BadgeProps extends Native<HTMLSpanElement> {
  /** Palette (solid only; `-outline` / `-light` warn and render solid). */
  variant?: Exclude<Color, 'default'>;
  /** standard = counter; status = 8px dot. */
  type?: 'standard' | 'status';
  /** The number or text. */
  badgeContent?: React.ReactNode;
  /** Counts above this show as "max+". */
  max?: number;
  /** Show a 0 count. */
  showZero?: boolean;
  /** Hide the badge (animates out). */
  invisible?: boolean;
  /** Same as type="status". */
  dot?: boolean;
  /** circular = inset for a round child (avatar). */
  overlap?: 'rectangular' | 'circular';
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
  /** @deprecated Badge has one size. */
  size?: string;
  sx?: Sx;
  children?: React.ReactNode;
}

/** One person in AvatarGroup's `people`. A name or detail adds a hover card. */
export interface AvatarGroupPerson {
  key?: React.Key;
  name?: string;
  detail?: React.ReactNode;
  src?: string;
  initials?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}

/**
 * Overlapping avatars with a "+N" overflow. `people` data gives buttons, hover cards and an overflow list; Avatar children give a static row.
 * @category Data display
 * @exports AvatarGroup
 * @example
 * <AvatarGroup max={3} people={[{ name: 'Ada Lovelace', initials: 'AL' }, { name: 'Lin Wu', initials: 'LW' }, { name: 'Sam Roe', initials: 'SR' }, { name: 'Kai Ito', initials: 'KI' }]} />
 */
export interface AvatarGroupProps extends Native<HTMLDivElement> {
  /** People as data (alternative to Avatar children). */
  people?: AvatarGroupPerson[];
  /** Avatars shown before "+N". */
  max?: number;
  size?: Size;
  /** Overlap step in px (negative overlaps). */
  spacing?: number;
  /** Called with the person whose avatar was pressed. */
  onPersonClick?: (person: AvatarGroupPerson) => void;
  /** Called with the hidden people when "+N" is pressed. */
  onOverflowClick?: (hidden: AvatarGroupPerson[]) => void;
  /** Button variant of clickable avatars. */
  buttonVariant?: 'ghost' | 'text' | (string & {});
  /** Shape of every avatar. */
  shape?: AvatarShape;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A small uppercase status / category label (non-interactive). For filters or removable tags use Chip.
 * @category Data display
 * @exports Tag
 * @example
 * <HStack spacing={1}><Tag color="success">Active</Tag><Tag color="warning" shape="pill">Beta</Tag></HStack>
 */
export interface TagProps extends Native<HTMLSpanElement> {
  color?: Color;
  /** hug = fit the label; fill = full width. */
  width?: 'hug' | 'fill';
  /** Corner override; unset follows the brand's --Tag-Radius. */
  shape?: 'square' | 'rounded' | 'squircle' | 'pill';
  /** @deprecated Tags are always uppercase. */
  allCaps?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * Tag with its color preset.
 * @category Data display
 * @exports PrimaryTag SecondaryTag TertiaryTag NeutralTag InfoTag SuccessTag WarningTag ErrorTag
 * @example
 * <ErrorTag>Overdue</ErrorTag>
 */
export interface PresetTagProps extends Omit<TagProps, 'color'> {}
