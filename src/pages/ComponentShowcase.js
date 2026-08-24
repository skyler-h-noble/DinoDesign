// src/pages/ComponentShowcase.js

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Drawer,
} from '@mui/material';

import * as MuiIcons from '@mui/icons-material';
import { ButtonShowcase } from '../components/Button/ButtonShowcase';
import { ButtonGroupShowcase } from '../components/ButtonGroup/ButtonGroupShowcase';
import { InputShowcase } from '../components/Input/InputShowcase';
import { CheckboxShowcase } from '../components/Checkbox/CheckboxShowcase';
import { RadioShowcase } from '../components/Radio/RadioShowcase';
import { SliderShowcase } from '../components/Slider/SliderShowcase';
import { SwitchShowcase } from '../components/Switch/SwitchShowcase';
import { ToggleButtonGroupShowcase } from '../components/ToggleButtonGroup/ToggleButtonGroupShowcase';
import { BadgeShowcase } from '../components/Badge/BadgeShowcase';
import { ChipShowcase } from '../components/Chip/ChipShowcase';
import { DividerShowcase } from '../components/Divider/DividerShowcase';
import { TableShowcase } from '../components/Table/TableShowcase';
import { ListShowcase } from '../components/List/ListShowcase';
import { TooltipShowcase } from '../components/Tooltip/TooltipShowcase';
import { TypographyShowcase } from '../components/Typography/TypographyShowcase';
import { AccordionShowcase } from '../components/Accordion/AccordionShowcase';
import { SheetShowcase } from '../components/Sheet/SheetShowcase';
import { LinkShowcase } from '../components/Link/LinkShowcase';
import { BreadcrumbsShowcase } from '../components/Breadcrumbs/BreadcrumbsShowcase';
import { MenuShowcase } from '../components/Menu/MenuShowcase';
import { StepperShowcase } from '../components/Stepper/StepperShowcase';
import { CardShowcase } from '../components/Card/CardShowcase';
import { GradientShowcase } from '../components/Gradient/GradientShowcase';
import { TabsShowcase } from '../components/Tabs/TabsShowcase';
import { DrawerShowcase } from '../components/Drawer/DrawerShowcase';
import { SnackbarShowcase } from '../components/Snackbar/SnackbarShowcase';
import { CircularProgressShowcase } from '../components/CircularProgress/CircularProgressShowcase';
import { LinearProgressShowcase } from '../components/LinearProgress/LinearProgressShowcase';
import { AlertShowcase } from '../components/Alert/AlertShowcase';
import { PaginationShowcase } from '../components/Pagination/PaginationShowcase';
import { SpeedDialShowcase } from '../components/SpeedDial/SpeedDialShowcase';
import { IconShowcase } from '../components/Icon/IconShowcase';
import { DialogShowcase } from '../components/Dialog/DialogShowcase';
import { AppBarShowcase } from '../components/AppBar/AppBarShowcase';
import { BottomNavigationShowcase } from '../components/BottomNavigation/BottomNavigationShowcase';
import { SearchFieldShowcase } from '../components/SearchField/SearchFieldShowcase';
import { BoxShowcase } from '../components/Box/BoxShowcase';
import { FabShowcase } from '../components/Fab/FabShowcase';
import { RailShowcase } from '../components/Rail/RailShowcase';
import { SelectShowcase } from '../components/Select/SelectShowcase';
import { ToolbarShowcase } from '../components/Toolbar/ToolbarShowcase';
import { NumberFieldShowcase } from '../components/NumberField/NumberFieldShowcase';
import { TransferListShowcase } from '../components/TransferList/TransferListShowcase';
import { RatingShowcase } from '../components/Rating/RatingShowcase';
import { ModalShowcase } from '../components/Modal/ModalShowcase';
import { AvatarShowcase } from '../components/Avatar/AvatarShowcase';
import { AutocompleteShowcase } from '../components/Autocomplete/AutocompleteShowcase';
import { TreeViewShowcase } from '../components/TreeView/TreeViewShowcase';
import { StackShowcase } from '../components/Stack/StackShowcase';
import { TagShowcase } from '../components/Tag/TagShowcase';
import { SectionShowcase } from '../components/Section/SectionShowcase';
import { RatioShowcase } from '../components/Ratio/RatioShowcase';
import { FooterShowcase } from '../components/Footer/FooterShowcase';
import { CopyrightShowcase } from '../components/Copyright/CopyrightShowcase';
import { CurvedTextShowcase } from '../components/CurvedText/CurvedTextShowcase';
import { BevelTextShowcase } from '../components/BevelText/BevelTextShowcase';

import {
  Button,
  Input,
  Card,
  Paper,
  Select,
  Autocomplete,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Rating,
  Alert,
  CircularProgress,
  Snackbar,
  Modal,
  Avatar,
  Badge,
  Chip,
  Divider,
  List as ListComponent,
  Link,
  Table,
  Tooltip,
  Breadcrumbs,
  Menu,
  Stepper,
  Sheet,
  Tabs,
  Accordion,
  SettingsPanel,
  AppBar,
  Footer,
  Typography,
  Spacing,
  Fab,
  OmniTreeView,
} from '../components';
import { OmniDesignProvider, useOmniDesign } from '../OmniDesignProvider';
import { NotificationProvider } from '../components/NotificationProvider';
import { NotificationBell } from '../components/NotificationBell';
import { useThemeMode } from '../theme/useThemeMode';

// Firebase Storage public-read URL for a design system's theme.json. The
// studio (dinodesign-studio) uploads each generated file to
// design-systems/{uuid}/{filename} in the dino-design bucket, and theme.json
// in turn lists absolute Firebase URLs for every CSS file — so we only need
// to construct the manifest URL here; the Provider follows the rest.
const FIREBASE_STORAGE_BUCKET = 'dino-design.firebasestorage.app';
const FIREBASE_STORAGE_ROOT   = 'design-systems';
function themeFileUrl(userId, filename) {
  const path = `${FIREBASE_STORAGE_ROOT}/${userId}/${filename}`;
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
}

const themeManifestUrl = (userId) => themeFileUrl(userId, 'theme.json');

// theme.json does not list typography-tokens.css yet, but the studio uploads
// it alongside the rest. Point at it directly so the showcase renders the
// design system's OWN type ramp — without it the lib's bundled copy wins on
// [data-platform] and silently replaces the brand's sizes and weights.
// Once the manifest gains a "typography" key the Provider picks it up on its
// own and this prop can go.
const themeTypographyUrl = (userId) => themeFileUrl(userId, 'typography-tokens.css');

const DRAWER_WIDTH = 320;

const NAV_ITEMS = [
  {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'typography', label: 'Typography' },
      { id: 'icons', label: 'Icons' },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    children: [
      { id: 'buttons', label: 'Button' },
      { id: 'fab', label: 'FAB' },
      { id: 'buttongroup', label: 'Button Group' },
      { id: 'togglebuttongroup', label: 'Toggle Button Group' },
      { id: 'input', label: 'Input' },
      { id: 'select', label: 'Select' },
      { id: 'autocomplete', label: 'Autocomplete' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio Group' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
      { id: 'numberfield', label: 'Number Field' },
      { id: 'rating', label: 'Rating' },
      { id: 'searchfield', label: 'Search Field' },
      { id: 'transferlist', label: 'Transfer List' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    children: [
      { id: 'stack', label: 'Stack' },
      { id: 'section', label: 'Section' },
    ],
  },
  {
    id: 'surfaces',
    label: 'Surfaces',
    children: [
      { id: 'card', label: 'Card' },
      { id: 'gradient', label: 'Gradient' },
      { id: 'box', label: 'Box' },
      { id: 'ratio', label: 'Ratio' },
      { id: 'sheet', label: 'Sheet' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'treeview', label: 'Tree View' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    children: [
      { id: 'alert', label: 'Alert' },
      { id: 'circularprogress', label: 'Circular Progress' },
      { id: 'linearprogress', label: 'Linear Progress' },
      { id: 'snackbar', label: 'Snackbar' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'modal', label: 'Modal' },
    ],
  },
  {
    id: 'datadisplay',
    label: 'Data Display',
    children: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'chip', label: 'Chip' },
      { id: 'tag', label: 'Tag' },
      { id: 'divider', label: 'Divider' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
      { id: 'tooltip', label: 'Tooltip' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    children: [
      { id: 'link', label: 'Link' },
      { id: 'appbar', label: 'App Bar' },
      { id: 'footer', label: 'Footer' },
      { id: 'copyright', label: 'Copyright' },
      { id: 'bottomnav', label: 'Bottom Navigation' },
      { id: 'toolbar', label: 'Toolbar' },
      { id: 'rail', label: 'Rail' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'menu', label: 'Menu' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'speeddial', label: 'Speed Dial' },
    ],
  },
  {
    id: 'decorative',
    label: 'Decorative',
    children: [
      { id: 'curvedtext', label: 'Curved Display Text' },
      { id: 'beveltext', label: 'Bevel Display Text' },
    ],
  },
];

function ShowcaseInner() {
  const { mode, switchMode } = useThemeMode('light');
  const [activeSection, setActiveSection] = useState('buttons');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter nav items by search query — keep categories whose label OR whose
  // child labels match. When a query is active, every matching category is
  // also forced expanded so matches stay visible.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNavItems = !normalizedQuery
    ? NAV_ITEMS
    : NAV_ITEMS
        .map((cat) => {
          const catMatches = cat.label.toLowerCase().includes(normalizedQuery);
          const matchingChildren = cat.children?.filter((c) => c.label.toLowerCase().includes(normalizedQuery)) || [];
          if (catMatches) return cat; // whole category visible
          if (matchingChildren.length) return { ...cat, children: matchingChildren };
          return null;
        })
        .filter(Boolean);
  const expandedItems = normalizedQuery
    ? filteredNavItems.map((cat) => cat.id)
    : undefined;

  // Theme URL from ?user= param (auth removed — themes load by URL param only)
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get('user');
  const themeURL = userParam ? themeManifestUrl(userParam) : undefined;
  const typographyCSS = userParam ? themeTypographyUrl(userParam) : undefined;

  // No ?user= — render whatever is sitting in public/styles, so you can drop a
  // studio export in that folder and see it without uploading anything.
  //
  // index.html already <link>s foundation / base / core / typography-tokens /
  // styles, but NOT the mode sheets: those swap on the dark-mode toggle, so
  // they have to go through the Provider's mode slot. Without this the local
  // folder rendered with no palette at all — every colour token unresolved.
  const localLightModeCSS = userParam ? undefined : '/styles/Light-Mode.css';
  const localDarkModeCSS  = userParam ? undefined : '/styles/Dark-Mode.css';

  const handleTreeSelect = useCallback((event, itemId) => {
    if (itemId && !NAV_ITEMS.some((cat) => cat.id === itemId)) {
      setActiveSection(itemId);
      setMobileOpen(false);
    }
  }, []);

  const sidebarContent = (
    <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
      {filteredNavItems.length === 0 ? (
        <Box sx={{ p: 2, color: 'var(--Quiet)', fontSize: '14px' }}>
          No components match "{searchQuery}"
        </Box>
      ) : (
        <OmniTreeView
          // Re-mount when query changes so the new expandedItems take effect
          key={normalizedQuery || 'all'}
          items={filteredNavItems}
          variant="default"
          color="default"
          selectedItems={activeSection}
          onSelectedItemsChange={handleTreeSelect}
          defaultExpandedItems={expandedItems || ['inputs']}
          animation="slide"
          aria-label="Component navigation"
          sx={{ border: 'none', borderRadius: 0 }}
        />
      )}
    </Box>
  );

  const drawerPaperSx = {
    width: DRAWER_WIDTH,
    background: 'var(--Background)',
    color: 'var(--Text)',
    borderRight: '1px solid var(--Border)',
    pt: 9.5,
    boxSizing: 'border-box',
  };

  return (
    <OmniDesignProvider
      themeURL={themeURL}
      typographyCSS={typographyCSS}
      lightModeCSS={localLightModeCSS}
      darkModeCSS={localDarkModeCSS}
      defaultTheme="Default"
      defaultSurface="Surface"
      defaultStyle="Modern"
    >
    <NotificationProvider>
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* App Bar — brand is pulled from the loaded theme.json manifest via
          the OmniDesignProvider context, so it shows the design system's name
          (e.g. "Acme") instead of the static "Company" default. */}
      <BrandedAppBar
        onMenuClick={() => setMobileOpen(!mobileOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Container */}
      <Box sx={{ display: 'flex', flex: 1, mt: 7.5 }}>

        {/* Desktop Sidebar — hidden below md */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
          PaperProps={{ 'data-surface': 'Surface-Dim' }}
        >
          {sidebarContent}
        </Drawer>

        {/* Mobile Sidebar — shown below md */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
          PaperProps={{ 'data-surface': 'Surface-Dim' }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{
          flex: 1, minWidth: 0, overflow: 'hidden',
          px: 3, py: 2,
          backgroundColor: 'var(--Surface)',
        }}>
          <Box sx={{ maxWidth: '100%' }}>

            {/* ============ FOUNDATIONS ============ */}
            {activeSection === 'typography' && <TypographyShowcase />}
            {activeSection === 'icons' && <IconShowcase />}

            {/* ============ INPUTS ============ */}
            {activeSection === 'buttons' && <ButtonShowcase />}
            {activeSection === 'fab' && <FabShowcase />}
            {activeSection === 'buttongroup' && <ButtonGroupShowcase />}
            {activeSection === 'select' && <SelectShowcase />}
            {activeSection === 'autocomplete' && <AutocompleteShowcase />}
            {activeSection === 'checkbox' && <CheckboxShowcase />}
            {activeSection === 'radio' && <RadioShowcase />}
            {activeSection === 'input' && <InputShowcase />}
            {activeSection === 'slider' && <SliderShowcase />}
            {activeSection === 'switch' && <SwitchShowcase />}
            {activeSection === 'togglebuttongroup' && <ToggleButtonGroupShowcase />}
            {activeSection === 'rating' && <RatingShowcase />}
            {activeSection === 'numberfield' && <NumberFieldShowcase />}
            {activeSection === 'searchfield' && <SearchFieldShowcase />}
            {activeSection === 'transferlist' && <TransferListShowcase />}

            {/* ============ LAYOUT ============ */}
            {activeSection === 'stack' && <StackShowcase />}
            {activeSection === 'section' && <SectionShowcase />}
            {activeSection === 'ratio' && <RatioShowcase />}

            {/* ============ SURFACES ============ */}
            {activeSection === 'card' && <CardShowcase />}
            {activeSection === 'gradient' && <GradientShowcase />}
            {activeSection === 'box' && <BoxShowcase />}
            {activeSection === 'sheet' && <SheetShowcase />}
            {activeSection === 'accordion' && <AccordionShowcase />}
            {activeSection === 'treeview' && <TreeViewShowcase />}

            {/* ============ FEEDBACK ============ */}
            {activeSection === 'alert' && <AlertShowcase />}
            {activeSection === 'circularprogress' && <CircularProgressShowcase />}
            {activeSection === 'linearprogress' && <LinearProgressShowcase />}
            {activeSection === 'snackbar' && <SnackbarShowcase />}
            {activeSection === 'dialog' && <DialogShowcase />}
            {activeSection === 'modal' && <ModalShowcase />}

            {/* ============ DATA DISPLAY ============ */}
            {activeSection === 'avatar' && <AvatarShowcase />}
            {activeSection === 'badge' && <BadgeShowcase />}
            {activeSection === 'chip' && <ChipShowcase />}
            {activeSection === 'tag' && <TagShowcase />}
            {activeSection === 'divider' && <DividerShowcase />}
            {activeSection === 'list' && <ListShowcase />}
            {activeSection === 'table' && <TableShowcase />}
            {activeSection === 'tooltip' && <TooltipShowcase />}

            {/* ============ NAVIGATION ============ */}
            {activeSection === 'link' && <LinkShowcase />}
            {activeSection === 'appbar' && <AppBarShowcase />}
            {activeSection === 'footer' && <FooterShowcase />}
            {activeSection === 'copyright' && <CopyrightShowcase />}
            {activeSection === 'curvedtext' && <CurvedTextShowcase />}
            {activeSection === 'beveltext' && <BevelTextShowcase />}
            {activeSection === 'bottomnav' && <BottomNavigationShowcase />}
            {activeSection === 'toolbar' && <ToolbarShowcase />}
            {activeSection === 'rail' && <RailShowcase />}
            {activeSection === 'breadcrumbs' && <BreadcrumbsShowcase />}
            {activeSection === 'pagination' && <PaginationShowcase />}
            {activeSection === 'tabs' && <TabsShowcase />}
            {activeSection === 'stepper' && <StepperShowcase />}
            {activeSection === 'menu' && <MenuShowcase />}
            {activeSection === 'drawer' && <DrawerShowcase />}
            {activeSection === 'speeddial' && <SpeedDialShowcase />}

          </Box>
        </Box>
      </Box>

      {/* Settings Panel */}
      <SettingsPanel />
    </Box>
    </NotificationProvider>
    </OmniDesignProvider>
  );
}

/**
 * AppBar wrapper that reads the loaded design system's name from the
 * OmniDesignProvider context (populated from theme.json's `name` field) and
 * passes it as `brand`. Falls back to the default "Company" rendering when
 * no name is available (no themeURL or older manifests without `name`).
 */
function BrandedAppBar({ onMenuClick, searchQuery, onSearchChange }) {
  const { name } = useOmniDesign();
  return (
    <AppBar
      mode="desktop"
      barColor="default"
      brand={name || undefined}
      onMenuClick={onMenuClick}
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search components..."
      showRightButtons
      rightButtons={[
        { icon: <NotificationBell />, label: 'Notifications', raw: true },
      ]}
      sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999999 }}
    />
  );
}

export function ComponentShowcase() {
  return (
      <ShowcaseInner />
  );
}

export default ComponentShowcase;