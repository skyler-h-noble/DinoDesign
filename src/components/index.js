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

export { Select, SelectShowcase } from './Select';
export { Autocomplete, AutocompleteShowcase } from './Autocomplete';
export { Checkbox } from './Checkbox';
export { Radio, RadioGroup, RadioInput } from './Radio';
export { SwitchInput } from './Switch';
export { SliderInput, RangeSlider } from './Slider';
export { RatingInput } from './Rating';
export { SearchField, SearchFieldShowcase } from './SearchField';

// ========== CHIPS & TAGS ==========
export { Chip } from './Chip';

// ========== LAYOUT ==========
export {
  DynoStack,
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

// ========== DATA DISPLAY ==========
export { Avatar, AvatarGroup, AvatarShowcase, DEFAULT_AVATAR_SRC } from './Avatar';
export { Badge, BadgeShowcase } from './Badge';
export { Divider } from './Divider';
export { List, ListItem, ListItemDecorator } from './List';
export { Table } from './Table';
export { Tooltip } from './Tooltip';

// ========== APP STRUCTURE ==========
export { AppBar, DesktopAppBar, MobileAppBar, AppBarShowcase } from './AppBar';
export { Header } from './Header';
export { Footer, FooterShowcase } from './Footer';
export { Copyright, CopyrightShowcase } from './Copyright';
export { CurvedText, CurvedTextShowcase } from './CurvedText';
export { BevelText, BevelTextShowcase } from './BevelText';
export { Sidebar } from './Sidebar';
export { MainLayout } from './MainLayout';
export { Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from './Accordion';

// ========== TREE VIEW ==========
export {
  DynoTreeView,
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
export { DynoDesignProvider, useDynoDesign, ThemedZone, Surfaced } from '../DynoDesignProvider';

export default {};