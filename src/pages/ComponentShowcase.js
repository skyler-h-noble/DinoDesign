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
  DynoTreeView,
} from '../components';
import { DynoDesignProvider } from '../DynoDesignProvider';
import { useAuth } from '../AuthProvider';
import { NotificationProvider } from '../components/NotificationProvider';
import { NotificationBell } from '../components/NotificationBell';
import { OverridesProvider } from '../components/OverridesProvider';
import { LoginDialog } from '../components/LoginDialog';
import { useThemeMode } from '../theme/useThemeMode';

const SUPABASE_STORAGE_BASE = 'https://aqpmdqlhffjakkznxudv.supabase.co/storage/v1/object/public/design-system';

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
    ],
  },
  {
    id: 'surfaces',
    label: 'Surfaces',
    children: [
      { id: 'card', label: 'Card' },
      { id: 'gradient', label: 'Gradient' },
      { id: 'box', label: 'Box' },
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
];

function ShowcaseInner() {
  const { user, signOut } = useAuth();
  const { mode, switchMode } = useThemeMode('light');
  const [activeSection, setActiveSection] = useState('buttons');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Theme URL from ?user= param
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get('user');
  const userId = user?.uid || userParam;
  const themeURL = userId ? SUPABASE_STORAGE_BASE + '/' + userId : undefined;

  const handleTreeSelect = useCallback((event, itemId) => {
    if (itemId && !NAV_ITEMS.some((cat) => cat.id === itemId)) {
      setActiveSection(itemId);
      setMobileOpen(false);
    }
  }, []);

  const sidebarContent = (
    <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
      <DynoTreeView
        items={NAV_ITEMS}
        variant="default"
        color="default"
        selectedItems={activeSection}
        onSelectedItemsChange={handleTreeSelect}
        defaultExpandedItems={['inputs']}
        animation="slide"
        aria-label="Component navigation"
        sx={{ border: 'none', borderRadius: 0 }}
      />
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
    <DynoDesignProvider
      themeURL={themeURL}
      defaultTheme="Default"
      defaultSurface="Surface"
      defaultStyle="Modern"
    >
    <NotificationProvider>
    <OverridesProvider dsId={userId}>
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar
        mode="desktop"
        barColor="default"
        onMenuClick={() => setMobileOpen(!mobileOpen)}
        user={user}
        onLogin={() => setLoginOpen(true)}
        onSignOut={signOut}
        showRightButtons={!!user}
        rightButtons={user ? [
          { icon: <NotificationBell />, label: 'Notifications', raw: true },
        ] : []}
        sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999999 }}
      />

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

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
            {activeSection === 'rating' && <RatingShowcase />}
            {activeSection === 'numberfield' && <NumberFieldShowcase />}
            {activeSection === 'searchfield' && <SearchFieldShowcase />}
            {activeSection === 'transferlist' && <TransferListShowcase />}

            {/* ============ LAYOUT ============ */}
            {activeSection === 'stack' && <StackShowcase />}

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
    </OverridesProvider>
    </NotificationProvider>
    </DynoDesignProvider>
  );
}

export function ComponentShowcase() {
  return (
      <ShowcaseInner />
  );
}

export default ComponentShowcase;