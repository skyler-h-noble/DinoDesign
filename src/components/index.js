// src/components/index.js
/**
 * Component Library - Complete Exports
 * All components are real implementations, no stubs!
 */

// ========== DESIGN FOUNDATION ==========
export { 
  Typography, 
  CAP_HEIGHT_TRIM,
  Heading, 
  DisplayLarge,
  DisplayMedium,
  AltDisplayLarge,
  AltDisplayMedium,
  AltDisplaySmall,
  DisplaySmall,
  H1, 
  H2, 
  H3, 
  H4, 
  H5, 
  H6, 
  Body,
  Body1, 
  Body2, 
  BodySemibold,
  BodyBold,
  BodySmall,
  BodySmallSemibold,
  BodySmallBold,
  BodyLarge,
  BodyLargeSemibold,
  BodyLargeBold,
  Caption,
  CaptionBold,
  Subtitle,
  Subtitle1, 
  Subtitle2,
  SubtitleSmall,
  SubtitleMedium,
  SubtitleLarge,
  Legal,
  LegalSemibold,
  Label,
  LabelExtraSmall,
  MobileNavLabel,
  LabelSmall,
  LabelLarge,
  Eyebrow,
  EyebrowSmall,
  EyebrowMedium,
  EyebrowLarge,
  // Overline — former name for Eyebrow, kept as an alias.
  Overline,
  OverlineSmall,
  OverlineMedium,
  OverlineLarge,
  NumberSmall,
  NumberMedium,
  NumberLarge,
  Button as ButtonText,
  ButtonSmall,
} from './Typography';
export { Colors } from './Colors';
export { Spacing } from './Spacing';
export { Icon, IconShowcase } from './Icon';
/* Brand marks — GitHub, LinkedIn, Figma. Separate from Icon on purpose: Icon
   renders the design system's OWN vocabulary (Material Symbols, taking the
   brand's icon color and ramp), while a brand mark is somebody else's
   artwork, cannot be derived, and carries a trademark. Path data is imported
   by name at the call site from @fortawesome/free-brands-svg-icons, so a
   bundler ships only the marks used rather than all 610. */
export { BrandIcon } from './BrandIcon';
export { Swatch } from './Swatch';
/* No showcase: MiniSwatch has nothing to play with on its own. It is the chip
   inside a menu row, documented where it appears — Select and Menu. */
export { MiniSwatch } from './MiniSwatch';
export { IconBadge } from './IconBadge';
export { IconBadgeShowcase } from './IconBadge/IconBadgeShowcase';

// ========== BUTTONS ==========
export { Button } from './Button';
export { ButtonGroup } from './ButtonGroup';
export { Fab, FabShowcase } from './Fab';
export { Rail, RailShowcase } from './Rail';
export { Toolbar, ToolbarShowcase } from './Toolbar';
export { NumberField, NumberFieldShowcase } from './NumberField';
export { ToggleButton } from './ToggleButton';
// The GROUP is a separate component from the standalone ToggleButton: it owns
// the selection state, so a segmented control comes from here rather than from
// wiring individual buttons together.
export {
  ToggleButtonGroup,
  DefaultToggleButtonGroup,
  PrimaryToggleButtonGroup,
  SecondaryToggleButtonGroup,
  TertiaryToggleButtonGroup,
  NeutralToggleButtonGroup,
  BlackWhiteToggleButtonGroup,
  InfoToggleButtonGroup,
  SuccessToggleButtonGroup,
  WarningToggleButtonGroup,
  ErrorToggleButtonGroup,
} from './ToggleButtonGroup/ToggleButtonGroup';

// ========== INPUTS & FORMS ==========
// Canonical input: full-featured component with variants, validation,
// adornments, surface awareness. Exported as `TextInput` (the preferred name).
// The underlying file is still `./Input/Input.js` for now.
export { Input as TextInput } from './Input';

// DEPRECATED — kept for backward compat. New code should use `TextInput`
// (the canonical export above). These are thinner wrappers around MUI
// TextField; `TextInput` has every feature they do plus more.
export {
  TextField,
  EmailTextField,
  PasswordTextField,
  SearchTextField,
  NumberTextField,
  PhoneTextField,
  URLTextField,
  TextArea,
  TextFieldGroup
} from './TextField';

/* The first two pieces of the design's Forms system. FormLabel is the first
   thing here to read the LABEL type style — every other form component renders
   its label through Body/BodySmall at a literal size, so a brand re-picking its
   label scale moved the design file and not the library. */
export { FormLabel, FORM_LABEL_MARKERS } from './FormLabel';
export { TextAreaField } from './TextAreaField';

export { Select, SelectShowcase } from './Select';
export { Autocomplete, AutocompleteShowcase } from './Autocomplete';
export { Checkbox } from './Checkbox';
export { Radio, RadioGroup, RadioInput } from './Radio';
export { Player, formatTime } from './Player';
export { SwitchInput } from './Switch';
export { SliderInput, RangeSlider } from './Slider';
export { RatingInput } from './Rating';
export { SearchField, SearchFieldShowcase } from './SearchField';

// ========== CHIPS & TAGS ==========
export { Chip } from './Chip';
/* Tag was absent from this index entirely — not renamed, not deprecated, just
   never exported, while src/components/Tag/ carried the component, its tests,
   its stories and a showcase. Nothing consuming the package could reach it, and
   the section heading above said "TAGS" the whole time. */
export {
  Tag,
  TAG_COLORS,
  TAG_COLOR_TOKEN_MAP,
  PrimaryTag,
  SecondaryTag,
  TertiaryTag,
  NeutralTag,
  InfoTag,
  SuccessTag,
  WarningTag,
  ErrorTag,
  TagShowcase,
} from './Tag';

// ========== LAYOUT ==========
export {
  OmniStack,
  Stack,
  HStack,
  VStack,
  CenteredStack,
  SpaceBetweenStack,
  WrapStack,
  ResponsiveStack,
  GridStack,
  StackDivider,
  InsetStack,
  ScrollStack,
  StackShowcase,
} from './Stack';
export { Box, BoxShowcase } from './Box';
export { Container } from './Container';
export { Grid } from './Grid';
export { Section, SectionShowcase } from './Section';
export { Ratio, RatioShowcase, RATIO_NAMES } from './Ratio';

// ========== NAVIGATION ==========
export { Tabs, TabList, Tab, TabPanel, TabsShowcase, useTabsContext } from './Tabs';
export { Breadcrumbs, BreadcrumbItem, BreadcrumbsShowcase } from './Breadcrumbs';
export { Pagination, PaginationShowcase } from './Pagination';
export { Dropdown, MenuButton, Menu, MenuItem, MenuDivider, MenuShowcase } from './Menu';
export { BottomNavigation, BottomNavigationShowcase } from './BottomNavigation';
export { Stepper, Step, StepperShowcase, useStepperContext } from './Stepper';
export { SpeedDial, SpeedDialShowcase } from './SpeedDial';

// ========== SURFACES & CARDS ==========
export { Card, SelectableCard } from './Card';
export { Gradient, LinearGradient, RadialGradient, MeshGradient, MeshCardGradient } from './Gradient';
export { Paper } from './Paper';

// ========== DIALOGS & MODALS ==========
export { Popover } from './Popover';
export { Dialog, AlertDialog, FormDialog, DialogShowcase } from './Dialog';
export { Modal } from './Modal';
export { Drawer, DrawerClose, DrawerHeader, DrawerContent, DrawerShowcase } from './Drawer';
export { DropZone } from './DropZone';

// ========== FEEDBACK ==========
export { Alert, AlertShowcase } from './Alert';
export { Snackbar, SnackbarShowcase } from './Snackbar';
export { CircularProgress, CircularProgressShowcase } from './CircularProgress';
export { LinearProgress, LinearProgressShowcase } from './LinearProgress';
/* Loader, same story as Tag — present in the tree with tests, missing from the
   index. It is NOT a duplicate of the two Progress components above: those are
   a determinate bar and ring, while Loader covers the skeleton and overlay
   shapes (SkeletonLoader, SkeletonCard, DotsLoader, PageLoader, OverlayLoader)
   that nothing else in the package provides. */
export {
  Loader,
  LinearLoader,
  SkeletonLoader,
  DotsLoader,
  PageLoader,
  SkeletonCard,
  OverlayLoader,
} from './Loader';

// ========== DATA DISPLAY ==========
export { Avatar, AvatarGroup, AvatarShowcase, DEFAULT_AVATAR_SRC } from './Avatar';
export { Badge, BadgeShowcase } from './Badge';
export { Divider } from './Divider';
export { List, ListItem, ListItemDecorator } from './List';
export { Table } from './Table';
export { Tooltip } from './Tooltip';

// ========== APP STRUCTURE ==========
export { AppBar, DesktopAppBar, MobileAppBar, AppBarShowcase } from './AppBar';
/* `Header` was removed. It was a SECOND app bar — built on MUI's AppBar and
   MUI's Typography rather than the library's, with four literal
   rgba(0,0,0,0.1) shadows and three raw --Primary-Color-11 hovers, none of
   which follow a brand. AppBar is the real one: it sets data-theme="App-Bar",
   maps bar colors to theme + surface pairs, takes SHADOW_LEVEL_1, and
   composes SearchField, Tabs, Drawer and Button.

   Nothing imported it — verified across all thirteen projects depending on
   this package, including both portfolio sites. The Omni design site had
   written its OWN local Header rather than reach for this one, which is the
   clearest evidence it was not serving a real need.

   A marketing-site header is a legitimate thing to want and is NOT what this
   was; if one is built it should sit on AppBar. Tracked on the backlog. */
export { Footer, FooterShowcase } from './Footer';
export { Copyright, CopyrightShowcase } from './Copyright';
export { CurvedText, CurvedTextShowcase } from './CurvedText';
export { BevelText, BevelTextShowcase } from './BevelText';
export { Sidebar } from './Sidebar';
export { MainLayout } from './MainLayout';
export { Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from './Accordion';

// ========== TREE VIEW ==========
export {
  OmniTreeView,
  SolidTreeView,
  LightTreeView,
  DEFAULT_ITEMS,
  TreeBranch,
  TreeViewShowcase,
} from './TreeView';

// ========== UTILITIES & LINKS ==========
export { Link } from './Link';
export { SettingsPanel } from './SettingsPanel';

// ========== CONVENIENCE ALIASES ==========
// Radio is already exported above as a direct named export — no alias needed.
export { SwitchInput as Switch } from './Switch';
export { SliderInput as Slider } from './Slider';
export { RatingInput as Rating } from './Rating';

// ========== PROVIDER ==========
export { OmniDesignProvider, useOmniDesign, ThemedZone, Surfaced } from '../OmniDesignProvider';

export default {};

// Back-compat: these components were DynoStack / DynoTreeView before the
// OmniDesign rename. Old imports keep working; write the Omni names.
export { OmniStack as DynoStack } from './Stack/Stack';
export { OmniTreeView as DynoTreeView } from './TreeView/TreeView';

// A code block on its own dark region. The dark comes from
// data-theme="Neutral" + data-surface="Surface-Dimmest", not a literal color,
// so it follows the system's neutrals in both modes.
export { CodeBlock, CopyButton } from './CodeBlock/CodeBlock';

// ========== DATA VISUALISATION ==========
// Single-series charts on the surface-paired tokens: --Icons-Primary for the
// mark, --Border-Variant for tracks and gridlines, --Text / --Quiet for labels.
// They re-theme with data-surface, which the --Chart-1..10 palette (for
// MULTI-series charts) deliberately does not.
//
// `geometry` is exported too: it is pure math with no React or DOM, shared with
// the Figma plugin so the two renderers cannot disagree about where a slice
// ends or how a curve bends.
export { BarChart, LineChart, PieChart, CHART_TOKENS, CHART_LABEL_TYPE } from './Charts';
export * as chartGeometry from './Charts/geometry';

/* What a region shows instead of data. A slot on Table and List rather than a
   state variant on either — see StateMessage.js. */
export { StateMessage } from './StateMessage';

/* Loading placeholders — a state of the real components, not a separate
   skeleton. See _ghost.js for why. */
export { Ghost, useGhost, ghostBlockSx } from './_ghost';
/* ── Component reference ──────────────────────────────────────────────────────
   The written docs for each component — props, theming, tokens, states,
   composition, accessibility and the gotchas each one invites. Shipped rather
   than kept in the studio so a consumer's agent can READ what a component
   expects instead of inferring it from prop names, which is where most wrong
   output starts. The gallery renders the same data. */
export {
  COMPONENT_DOCS,
  FOUNDATIONS,
  renderFoundations,
  renderColorSystem,
  /* The British spellings were the published names, so they stay exported as
     aliases. Renaming them outright would break an import for a cosmetic win,
     and a package that moves a public symbol to fix its own spelling teaches
     consumers that the export list is not a promise. */
  renderColorSystem as renderColourSystem,
  renderComponentDoc,
  COLOR_COLLECTIONS,
  /* @deprecated British spelling, kept so published imports keep resolving. */
  COLOR_COLLECTIONS as COLOUR_COLLECTIONS,
  docsSlug,
  componentDocsUrl,
  componentDocsIndexUrl,
  DOCS_ORIGIN,
  EXAMPLES,
  hasExample,
} from '../docs';
