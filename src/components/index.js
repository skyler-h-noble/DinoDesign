// src/components/index.js
/**
 * Component Library - Complete Exports
 * All components are real implementations, no stubs!
 */

// ========== DESIGN FOUNDATION ==========
export { 
  Typography, 
  Heading, 
  DisplayLarge,
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
  SubtitleLarge,
  Legal,
  LegalSemibold,
  Label,
  LabelExtraSmall,
  LabelSmall,
  LabelLarge,
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

// ========== BUTTONS ==========
export { Button } from './Button';
export { ButtonGroup } from './ButtonGroup';
export { ButtonIcon } from './ButtonIcon';
export { Fab, FabShowcase } from './Fab';
export { Rail, RailShowcase } from './Rail';
export { Toolbar, ToolbarShowcase } from './Toolbar';
export { NumberField, NumberFieldShowcase } from './NumberField';
export { ToggleButton } from './ToggleButton';

// ========== INPUTS & FORMS ==========
// TextField - all variants exist
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

// TextInput variants
export { TextInput, EmailInput, PasswordInput, TextArea as TextAreaInput } from './TextInput';

export { Select, SelectShowcase } from './Select';
export { Autocomplete, AutocompleteShowcase } from './Autocomplete';
export { Checkbox } from './Checkbox';
export { RadioGroup, RadioInput } from './Radio';
export { SwitchInput } from './Switch';
export { SliderInput, RangeSlider } from './Slider';
export { RatingInput } from './Rating';
export { SearchField, SearchFieldShowcase } from './SearchField';

// ========== CHIPS & TAGS ==========
export { Chip } from './Chip';

// ========== LAYOUT ==========
export { Stack, HStack, VStack, CenteredStack, SpaceBetweenStack, ResponsiveStack, GridStack, StackDivider, InsetStack, ScrollStack, WrapStack } from './Stack';
export { Box, BoxShowcase } from './Box';
export { Container } from './Container';
export { Grid } from './Grid';

// ========== NAVIGATION ==========
// Tabs - all variants exist
export { Tabs, TabList, Tab, TabPanel, TabsShowcase, useTabsContext } from './Tabs';

export { Breadcrumbs, BreadcrumbItem, BreadcrumbsShowcase } from './Breadcrumbs';
export { Pagination, PaginationShowcase } from './Pagination';
export { Dropdown, MenuButton, Menu, MenuItem, MenuDivider, MenuShowcase } from './Menu';
export { BottomNavigation, BottomNavigationShowcase } from './BottomNavigation';
export { Stepper, Step, StepperShowcase, useStepperContext } from './Stepper';

export { SpeedDial, SpeedDialShowcase } from './SpeedDial';

// ========== SURFACES & CARDS ==========
export { Card, SelectableCard} from './Card';
export { Paper } from './Paper';


// ========== DIALOGS & MODALS ==========
export { Dialog, AlertDialog, FormDialog, DialogShowcase } from './Dialog';
export { Modal } from './Modal';
export { Drawer, DrawerClose, DrawerHeader, DrawerContent, DrawerShowcase } from './Drawer';

// ========== FEEDBACK ==========
export { Alert, AlertShowcase } from './Alert';
export { Snackbar, SnackbarShowcase } from './Snackbar';
export { CircularProgress, CircularProgressShowcase } from './CircularProgress';
export { LinearProgress, LinearProgressShowcase } from './LinearProgress';

// ========== DATA DISPLAY ==========
export { Avatar, AvatarGroup, AvatarShowcase } from './Avatar';
export { Badge, BadgeShowcase } from './Badge';
export { Divider } from './Divider';
export { List } from './List';
export { Table } from './Table';
export { Tooltip } from './Tooltip';

// ========== APP STRUCTURE ==========
export { AppBar, DesktopAppBar, MobileAppBar, AppBarShowcase } from './AppBar';
export { Header } from './Header';
export { Footer } from './Footer';
export { Sidebar } from './Sidebar';
export { MainLayout } from './MainLayout';
export { Accordion } from './Accordion';

// ========== UTILITIES & LINKS ==========
export { Link } from './Link';
export { SettingsPanel } from './SettingsPanel';

// ========== CONVENIENCE ALIASES ==========
// Export common alternative names for easier imports
export { RadioInput as Radio } from './Radio';
export { SwitchInput as Switch } from './Switch';
export { SliderInput as Slider } from './Slider';
export { RatingInput as Rating } from './Rating';

export default {};