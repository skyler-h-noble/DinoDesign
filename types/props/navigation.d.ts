// types/props/navigation.d.ts — props for the navigation components: tabs,
// breadcrumbs, pagination, menus, bars, rails, steppers, trees.
//
// Several of these are COMPOUND components that read their state from a
// parent through context (Menu from Dropdown, Tab from Tabs, Step from
// Stepper). Rendered outside that parent they fall back to a default context
// and render nothing or the wrong thing, with no error — so @parent is stated
// on every child part. Format: see scripts/lib/api-model.mjs.
import type * as React from 'react';
import type { Theme, Surface, Color, Size, ButtonVariant, Sx, Native, ButtonProps } from '../core-props';

/** A Tab / TabPanel key: the Tab's index unless you pass `value`. */
export type TabValue = string | number;

// ─── Tabs ────────────────────────────────────────────────────────────────────

/**
 * Switches between panels (role="tab"), or with `navigation` a <nav> of links that marks the current page. Holds the selected value for its TabList and TabPanels.
 * @category Navigation
 * @exports Tabs
 * @example
 * <Tabs value={value} onChange={setValue}>
 *   <TabList>
 *     <Tab value="a">Overview</Tab>
 *     <Tab value="b">Details</Tab>
 *   </TabList>
 *   <TabPanel value="a"><Body>Overview panel.</Body></TabPanel>
 *   <TabPanel value="b"><Body>Details panel.</Body></TabPanel>
 * </Tabs>
 */
export interface TabsProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** Selected tab (controlled). */
  value?: TabValue;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: TabValue;
  /** Called with the newly selected Tab's value (not an event). */
  onChange?: (value: TabValue) => void;
  /** standard = indicator only; solid / light / dark paint the list in `color`'s theme. */
  variant?: 'standard' | 'solid' | 'light' | 'dark';
  /** Indicator color (standard) or theme (solid / light / dark). */
  color?: Color;
  size?: Size;
  /** 'vertical' = 'vertical-right'. */
  orientation?: 'horizontal' | 'vertical' | 'vertical-left' | 'vertical-right';
  /** @deprecated Use overflow="scroll". */
  scrollable?: boolean;
  /** When tabs do not fit: none, scroll (arrow buttons), more (… menu; horizontal only). */
  overflow?: 'none' | 'scroll' | 'more';
  /** The 1px rule the tabs sit on. Turn off where the container already separates. */
  baseline?: boolean;
  /** A site nav: renders <nav> of links; each Tab takes `href`, the selected one gets aria-current. */
  navigation?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The row of Tabs. Adds keyboard arrows, scrolling and the overflow menu.
 * @category Navigation
 * @exports TabList
 * @parent Inside `<Tabs>`.
 * @example
 * <Tabs><TabList><Tab>One</Tab><Tab>Two</Tab></TabList></Tabs>
 */
export interface TabListProps extends Native<HTMLDivElement> {
  /** @deprecated Retired — the list is square; renders square and warns. */
  rounded?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One tab: a button, or a link when its Tabs has `navigation`.
 * @category Navigation
 * @exports Tab
 * @parent Inside `<TabList>` inside `<Tabs>`.
 * @example
 * <Tabs navigation value="home">
 *   <TabList>
 *     <Tab value="home" href="/">Home</Tab>
 *     <Tab value="docs" href="/docs" startDecorator={<MenuBookIcon />}>Docs</Tab>
 *   </TabList>
 * </Tabs>
 */
export interface TabProps extends Native<HTMLButtonElement> {
  /** Key matched against Tabs `value` and TabPanel `value`; defaults to the tab's index. */
  value?: TabValue;
  /** Link target — only with `<Tabs navigation>` (ignored with a warning otherwise). */
  href?: string;
  /** Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router. */
  reloadDocument?: boolean;
  disabled?: boolean;
  /** Icon before the label. */
  startDecorator?: React.ReactNode;
  /** Icon or Badge after the label. */
  endDecorator?: React.ReactNode;
  /** Icon only — give the Tab an aria-label. */
  iconOnly?: boolean;
  /** Internal: set by TabList. Do not pass. */
  _index?: number;
  /** Internal: set by TabList. Do not pass. */
  _overflowed?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The content shown while the Tab with the same `value` is selected.
 * @category Navigation
 * @exports TabPanel
 * @parent Inside `<Tabs>` (beside the TabList).
 * @example
 * <Tabs defaultValue="a">
 *   <TabList><Tab value="a">A</Tab></TabList>
 *   <TabPanel value="a"><Body>Panel A</Body></TabPanel>
 * </Tabs>
 */
export interface TabPanelProps extends Native<HTMLDivElement> {
  /** The Tab value this panel belongs to. */
  value?: TabValue;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

/**
 * Trail of the page's ancestors. Children are Links (or BreadcrumbItems); the last is the current page.
 * @category Navigation
 * @exports Breadcrumbs
 * @example
 * <Breadcrumbs>
 *   <Link href="/">Home</Link>
 *   <Link href="/shop">Shop</Link>
 *   <BodySmall>Shoes</BodySmall>
 * </Breadcrumbs>
 */
export interface BreadcrumbsProps extends Native<HTMLElement> {
  /** slanted (/), bar (|), ellipsis, or any node drawn as given. */
  separator?: 'slanted' | 'bar' | 'ellipsis' | (string & {}) | React.ReactElement;
  size?: Size;
  /** Collapse the middle crumbs into a "…" menu past `maxItems`. */
  condense?: boolean;
  /** Crumbs shown before condensing. */
  maxItems?: number;
  /** Crumbs kept before the "…". */
  itemsBeforeCollapse?: number;
  /** Crumbs kept after the "…". */
  itemsAfterCollapse?: number;
  /** At ≤600px show only "← Parent". */
  backOnlyMobile?: boolean;
  /** Called when the "…" is pressed. */
  onExpand?: () => void;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One crumb: a link with `href`, plain text without. Optional — a Link works too.
 * @category Navigation
 * @exports BreadcrumbItem
 * @parent Inside `<Breadcrumbs>`.
 * @example
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem>Settings</BreadcrumbItem>
 * </Breadcrumbs>
 */
export interface BreadcrumbItemProps extends Native<HTMLAnchorElement> {
  href?: string;
  /** Follow `href` with a full page load even when OmniDesignProvider has a `linkComponent` / `navigate` router. */
  reloadDocument?: boolean;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

/**
 * Page number controls for a paged list or table. Pages are 1-based.
 * @category Navigation
 * @exports Pagination
 * @example
 * <Pagination count={12} page={page} onChange={setPage} />
 */
export interface PaginationProps extends Native<HTMLElement, 'onChange'> {
  /** Theme zone for the bar (data-theme). */
  theme?: Theme;
  /** Surface level for the bar (data-surface). */
  surface?: Surface;
  /** Total pages. */
  count?: number;
  /** Current page, 1-based (controlled). */
  page?: number;
  /** Initial page (uncontrolled). */
  defaultPage?: number;
  /** Called with the new page number. */
  onChange?: (page: number) => void;
  /** Palette of the current page. */
  color?: Color;
  size?: Size;
  /** Pages shown each side of the current one. */
  siblingCount?: number;
  /** Pages always shown at each end. */
  boundaryCount?: number;
  disabled?: boolean;
  /** Show the first-page button. */
  showFirstButton?: boolean;
  /** Show the last-page button. */
  showLastButton?: boolean;
  sx?: Sx;
}

// ─── Menu ────────────────────────────────────────────────────────────────────

/**
 * Root of a menu: holds open state for its MenuButton and Menu. The panel does NOT portal — inside a scroll area or clipped card use Popover instead.
 * @category Navigation
 * @exports Dropdown
 * @example
 * <Dropdown>
 *   <MenuButton>Actions</MenuButton>
 *   <Menu>
 *     <MenuItem onClick={() => {}}>Profile</MenuItem>
 *     <MenuDivider />
 *     <MenuItem disabled>Settings</MenuItem>
 *   </Menu>
 * </Dropdown>
 */
export interface DropdownProps extends Native<HTMLDivElement> {
  /** Menu panel style: outline (bordered), solid or light (themed in `color`). */
  variant?: 'outline' | 'solid' | 'light';
  /** Palette of the button, border and selection. */
  color?: Color;
  /** Sizes the button, rows and panel width. */
  size?: Size;
  /** Open state (controlled). */
  open?: boolean;
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * The Button that opens its Dropdown's Menu (chevron and ARIA wired). Takes every Button prop.
 * @category Navigation
 * @exports MenuButton
 * @parent Inside `<Dropdown>`.
 * @example
 * <Dropdown><MenuButton variant="default">Sort</MenuButton><Menu><MenuItem>Newest</MenuItem></Menu></Dropdown>
 */
export interface MenuButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Defaults to the Dropdown color's outline. */
  variant?: ButtonVariant;
}

/**
 * The menu panel. Renders nothing outside a `<Dropdown>` (its open state lives there). Does not portal.
 * @category Navigation
 * @exports Menu
 * @parent Inside `<Dropdown>`, after its MenuButton.
 * @example
 * <Dropdown><MenuButton>More</MenuButton><Menu placement="bottom-end"><MenuItem>Rename</MenuItem></Menu></Dropdown>
 */
export interface MenuProps extends Native<HTMLDivElement> {
  /** Which edge of the button the panel lines up with. */
  placement?: 'bottom-start' | 'bottom-end';
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One menu row (role="menuitem"). Clicking runs `onClick` and closes the menu.
 * @category Navigation
 * @exports MenuItem
 * @parent Inside `<Menu>`.
 * @example
 * <Dropdown>
 *   <MenuButton>File</MenuButton>
 *   <Menu><MenuItem startDecorator={<EditIcon />} onClick={() => {}} selected>Edit</MenuItem></Menu>
 * </Dropdown>
 */
export interface MenuItemProps extends Omit<Native<HTMLDivElement>, 'onClick'> {
  /** Runs on click / Enter (no event argument); the menu then closes. */
  onClick?: () => void;
  /** Marks the current choice (leading bar, aria-current). */
  selected?: boolean;
  disabled?: boolean;
  /** Rule under the row. */
  divider?: boolean;
  /** Icon before the label. */
  startDecorator?: React.ReactNode;
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * A rule between groups of menu items.
 * @category Navigation
 * @exports MenuDivider
 * @parent Inside `<Menu>`.
 * @example
 * <Dropdown><MenuButton>Menu</MenuButton><Menu><MenuItem>A</MenuItem><MenuDivider /><MenuItem>B</MenuItem></Menu></Dropdown>
 */
export interface MenuDividerProps extends Native<HTMLHRElement> {
  sx?: Sx;
}

// ─── Bars ────────────────────────────────────────────────────────────────────

export interface BottomNavigationItem {
  key?: React.Key;
  icon?: React.ReactNode;
  label?: string;
  /** Accessible name when there is no label. */
  ariaLabel?: string;
  disabled?: boolean;
}
export interface BottomNavigationFabAction {
  icon?: React.ReactNode;
  /** Accessible name (and speed-dial name). */
  label?: string;
  onClick?: () => void;
  /** Turns the FAB into a speed dial of these actions. */
  actions?: Array<{ key?: React.Key; icon?: React.ReactNode; label?: string; onClick?: () => void }>;
  /** Keep the speed dial's labels in place (scaled previews). */
  disablePortal?: boolean;
}

/**
 * Phone bottom bar of 3–5 destinations, on the designer's Nav-Bar theme. Leave `barColor` unset.
 * @category Navigation
 * @exports BottomNavigation
 * @example
 * <BottomNavigation value={value} onChange={setValue}
 *   items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <SearchIcon />, label: 'Search' }, { icon: <PersonIcon />, label: 'Profile' }]} />
 */
export interface BottomNavigationProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** The destinations. */
  items?: BottomNavigationItem[];
  /** Selected index (controlled). */
  value?: number;
  defaultValue?: number;
  /** Called with the selected index. */
  onChange?: (index: number) => void;
  /** Labels under the icons. */
  showLabels?: boolean;
  /** fixed = square edge-to-edge band; floating = pill. A FAB makes it floating. */
  variant?: 'fixed' | 'floating';
  /** The bar's direction (vertical = a rail of actions). */
  orientation?: 'horizontal' | 'vertical';
  /** default = the Nav-Bar theme (the designer's pick). */
  barColor?: Color;
  /** Surface level override. */
  surface?: Surface;
  /** Adds a FAB (or speed dial with `actions`). */
  fabAction?: BottomNavigationFabAction;
  /** center = raised on the bar's top edge; end = beside the bar. */
  fabPosition?: 'center' | 'end';
  /** Pinned to the viewport (positioning, not appearance). */
  fixed?: boolean;
  sx?: Sx;
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

/**
 * Progress through ordered steps. Steps before `activeStep` are complete.
 * @category Navigation
 * @exports Stepper
 * @example
 * <Stepper activeStep={1}>
 *   <Step label="Cart" />
 *   <Step label="Shipping" />
 *   <Step label="Pay" />
 * </Stepper>
 */
export interface StepperProps extends Native<HTMLOListElement> {
  /** Theme zone (data-theme). */
  theme?: Theme;
  /** Surface level (data-surface). */
  surface?: Surface;
  orientation?: 'horizontal' | 'vertical';
  size?: Size;
  /** Palette of the current / completed circles. */
  color?: Color;
  /** 0-based index of the current step. */
  activeStep?: number;
  /** Steps are buttons that call onStepClick. */
  clickable?: boolean;
  /** Called with the clicked step's 0-based index. */
  onStepClick?: (index: number) => void;
  /** Dashed connectors after the current step. */
  dashedIncomplete?: boolean;
  /** count = numbered circles; noCount = plain dots. */
  variant?: 'count' | 'noCount';
  /** Label under or beside each circle; unset follows orientation. */
  labelPosition?: 'bottom' | 'right';
  sx?: Sx;
  children?: React.ReactNode;
}

/**
 * One step. Shows its number (or `icon`) and its label.
 * @category Navigation
 * @exports Step
 * @parent Inside `<Stepper>`.
 * @example
 * <Stepper activeStep={0}><Step label="Account" icon={<PersonIcon />} /><Step label="Done" /></Stepper>
 */
export interface StepProps extends Native<HTMLLIElement> {
  /** Replaces the number in the circle. */
  icon?: React.ReactNode;
  /** The step's name (or pass children). */
  label?: React.ReactNode;
  disabled?: boolean;
  /** Internal: set by Stepper. Do not pass. */
  _index?: number;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Link groups ─────────────────────────────────────────────────────────────

/**
 * A row of Links with separators (footer or legal links), as a list.
 * @category Navigation
 * @exports LinkGroup
 * @example
 * <LinkGroup aria-label="Legal">
 *   <Link href="/privacy">Privacy</Link>
 *   <Link href="/terms">Terms</Link>
 * </LinkGroup>
 */
export interface LinkGroupProps extends Native<HTMLUListElement> {
  /** Drawn between links. */
  separator?: React.ReactNode;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Rail ────────────────────────────────────────────────────────────────────

export interface RailItemData {
  icon?: React.ReactNode;
  /** Shown in place of the icon. */
  avatar?: React.ReactNode;
  label?: string;
  /** true = a dot; a number or node = a count. */
  badge?: boolean | React.ReactNode;
  disabled?: boolean;
}
export interface RailSection {
  /** Eyebrow when open, a short rule when closed. */
  title?: React.ReactNode;
  items: RailItemData[];
}

/**
 * Side navigation rail for apps (icon + label per destination), optionally expandable. Pair with Drawer for a slide-out.
 * @category Navigation
 * @exports Rail
 * @example
 * <Rail value={value} onChange={setValue} brand={<Avatar initials="A" />}
 *   items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <InboxIcon />, label: 'Inbox', badge: 3 }]} />
 */
export interface RailProps extends Native<HTMLDivElement, 'onChange' | 'defaultValue'> {
  /** Destinations (use `sections` for grouped). */
  items?: RailItemData[];
  /** Grouped destinations; indexes run across sections. */
  sections?: RailSection[];
  /** Selected index (controlled). */
  value?: number;
  defaultValue?: number;
  /** Called with the selected index. */
  onChange?: (index: number) => void;
  /** Adds a toggle between collapsed and expanded. */
  expandable?: boolean;
  /** Open width: px number or CSS length. ('partial' / 'full' are retired.) */
  expandedWidth?: number | string;
  defaultExpanded?: boolean;
  /** A FAB at the top: `{ icon, label, onClick }`. */
  fabAction?: { icon?: React.ReactNode; label?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> };
  /** Brand mark at the top (non-expandable rail). */
  brand?: React.ReactNode;
  /** contained = block round icon + label when selected; outside = circle round the icon only. */
  labelStyle?: 'contained' | 'outside';
  /** Palette of the selected item. */
  variant?: Color | 'black-white';
  size?: Size;
  sx?: Sx;
}

/**
 * One rail item. Rail renders these itself — use directly only to show a single item.
 * @category Navigation
 * @exports RailItem
 * @parent Normally rendered by `<Rail>` from `items`.
 * @example
 * <RailItem item={{ icon: <HomeIcon />, label: 'Home' }} selected onClick={() => {}} />
 */
export interface RailItemProps {
  item: RailItemData;
  selected?: boolean;
  /** Expanded-rail layout (icon and label in a row). */
  expanded?: boolean;
  /** Collapsed layout of an expandable rail. */
  compact?: boolean;
  labelStyle?: 'contained' | 'outside';
  variant?: Color | 'black-white';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * A section heading in a rail. Rail renders these from `sections[].title`.
 * @category Navigation
 * @exports RailSectionTitle
 * @parent Normally rendered by `<Rail>`.
 * @example
 * <RailSectionTitle title="Projects" expanded />
 */
export interface RailSectionTitleProps {
  title?: React.ReactNode;
  /** Eyebrow when true; a short rule when false. */
  expanded?: boolean;
}

// ─── Retired app frames ──────────────────────────────────────────────────────

export interface SidebarItem {
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  tooltip?: string;
  /** Rule under the item. */
  divider?: boolean;
  submenu?: Array<{ label: React.ReactNode; icon?: React.ReactNode }>;
}

/**
 * RETIRED (removed next major; warns). Use Rail for side navigation and Drawer for a slide-out.
 * @category Navigation
 * @exports Sidebar
 * @example
 * <Sidebar open={open} onClose={() => setOpen(false)} items={[{ label: 'Home', icon: <HomeIcon /> }]} />
 */
export interface SidebarProps extends Native<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  items?: SidebarItem[];
  /** Called with the clicked item (or submenu item). */
  onItemClick?: (item: SidebarItem | { label: React.ReactNode; icon?: React.ReactNode }) => void;
  /** Width in px. */
  width?: number;
  /** temporary closes on item click. */
  variant?: 'standard' | 'permanent' | 'temporary';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: Sx;
}

export interface MainLayoutNavItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
}

/**
 * RETIRED (removed next major; warns). Use AppBar for the top bar and Rail (+ Drawer) for side navigation.
 * @category Navigation
 * @exports MainLayout
 * @example
 * <MainLayout title="My App" navItems={[{ label: 'Home', icon: <HomeIcon />, path: '/' }]}><Body>Content</Body></MainLayout>
 */
export interface MainLayoutProps extends Native<HTMLDivElement> {
  /** Navigation layout (phones always use top). */
  layout?: 'side' | 'rail' | 'top' | 'side-rail';
  navItems?: MainLayoutNavItem[];
  /** App title in the top bar. */
  title?: React.ReactNode;
  /** Shows a layout switcher; called with the chosen layout. */
  onLayoutChange?: (layout: 'side' | 'rail' | 'side-rail') => void;
  /** Called with the clicked nav item. */
  onNavigate?: (item: MainLayoutNavItem) => void;
  sx?: Sx;
  children?: React.ReactNode;
}

// ─── Carousel ────────────────────────────────────────────────────────────────

/**
 * Slide position dots for a carousel; arrow keys move along them.
 * @category Navigation
 * @exports CarouselDots
 * @example
 * <CarouselDots count={5} value={page} onChange={setPage} />
 */
export interface CarouselDotsProps extends Native<HTMLDivElement, 'onChange'> {
  /** Number of slides. */
  count?: number;
  /** Current slide, 0-based. */
  value?: number;
  /** Called with the chosen slide index. */
  onChange?: (index: number) => void;
  /** Palette of the current dot. */
  color?: Color;
  disabled?: boolean;
  sx?: Sx;
}

/**
 * One dot button. CarouselDots renders these — use directly only for a custom row.
 * @category Navigation
 * @exports CarouselDot
 * @ref HTMLButtonElement
 * @example
 * <CarouselDot selected aria-label="Slide 1 of 3" onClick={() => {}} />
 */
export interface CarouselDotProps extends Native<HTMLButtonElement> {
  selected?: boolean;
  color?: Color;
  disabled?: boolean;
  sx?: Sx;
}

// ─── Tree ────────────────────────────────────────────────────────────────────

export interface TreeItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** A MiniSwatch color before the label. */
  swatch?: string;
  /** Trailing slot (e.g. a Badge). */
  badge?: React.ReactNode;
  /** false drops the chevron space. */
  toggle?: boolean;
  /** false drops the line under the row. */
  divider?: boolean;
  disabled?: boolean;
  className?: string;
  sx?: Sx;
  children?: TreeItem[];
}

/**
 * Hierarchical list (files, sections) with WAI-ARIA tree keyboard support. SolidTreeView / LightTreeView preset `variant`; DynoTreeView is the old name.
 * @category Navigation
 * @exports OmniTreeView DynoTreeView
 * @example
 * <OmniTreeView aria-label="Files" defaultExpandedItems={['src']}
 *   items={[{ id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] }]}
 *   onSelectedItemsChange={(e, id) => setValue(id)} />
 */
export interface OmniTreeViewProps extends Native<HTMLUListElement> {
  /** Palette for solid / light. */
  color?: Color;
  /** default = no theme; solid / light = themed in `color`. */
  variant?: 'default' | 'solid' | 'light';
  /** @deprecated Use `variant`. */
  selectionStyle?: 'default' | 'solid' | 'light';
  surface?: Surface;
  density?: 'default' | 'compact';
  /** How children appear when a branch opens. */
  animation?: 'none' | 'slide' | 'spring';
  /** The tree. Defaults to a demo tree — always pass your own. */
  items?: TreeItem[];
  selectionMode?: 'single' | 'multi';
  /** Checkboxes on rows. */
  checkboxSelection?: boolean;
  disableSelection?: boolean;
  /** Keep disabled rows reachable by keyboard. */
  disabledItemsFocusable?: boolean;
  /** Initially expanded ids (uncontrolled). */
  defaultExpandedItems?: string[];
  /** Expanded ids (controlled). */
  expandedItems?: string[];
  onExpandedItemsChange?: (event: React.SyntheticEvent, ids: string[]) => void;
  /** Selected id, or ids when selectionMode="multi" (controlled). */
  selectedItems?: string | string[] | null;
  /** Called with the selected id (single) or ids (multi). */
  onSelectedItemsChange?: (event: React.SyntheticEvent, value: string | string[] | null) => void;
  onItemExpansionToggle?: (event: React.SyntheticEvent, id: string, expanded: boolean) => void;
  onItemSelectionToggle?: (event: React.SyntheticEvent, id: string, selected: boolean) => void;
  /** Replace the chevrons. */
  slots?: { collapseIcon?: React.ElementType; expandIcon?: React.ElementType };
  sx?: Sx;
}

/**
 * OmniTreeView with `variant` preset to solid / light (a passed `variant` still wins).
 * @category Navigation
 * @exports SolidTreeView LightTreeView
 * @source TreeView/TreeView#OmniTreeView
 * @example
 * <LightTreeView aria-label="Docs" color="primary" items={[{ id: 'a', label: 'Intro' }]} />
 */
export interface PresetTreeViewProps extends OmniTreeViewProps {}

/**
 * One tree row with its own toggle, for building a tree by hand. OmniTreeView covers most trees from `items`.
 * @category Navigation
 * @exports TreeBranch
 * @example
 * <TreeBranch label="src" level={1} toggle="on" onToggle={() => {}}>
 *   <TreeBranch label="App.tsx" level={2} />
 * </TreeBranch>
 */
export interface TreeBranchProps extends Native<HTMLDivElement> {
  label?: React.ReactNode;
  /** Icon in the slot before the label. */
  icon?: React.ReactNode;
  /** Nesting depth (sets the indent); level 6 never toggles. */
  level?: number;
  /** on = open (children shown), off = closed, none = a leaf. */
  toggle?: 'on' | 'off' | 'none';
  /** Called with the next toggle state. */
  onToggle?: (next: 'on' | 'off') => void;
  disabled?: boolean;
  /** Only small exists today. */
  size?: 'small';
  sx?: Sx;
  children?: React.ReactNode;
}
