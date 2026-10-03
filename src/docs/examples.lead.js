// @ts-nocheck
/**
 * The lead example for the components that had none.
 *
 * Every summary now opens with a live instance. Before this, 29 of the 50
 * components led with prose — and a prop table tells you what a component
 * HAS, never what it IS. Recognition is the one thing an example gives that
 * nothing else on the page can.
 *
 * The overlay components are the interesting case. The original rule was that
 * Modal, Drawer, Snackbar and friends get NO example, because showing one
 * needs open state and a portal and a half-working example teaches a shape
 * that does not run. That reasoning is right about a FORCED-OPEN overlay
 * rendered inline; it does not hold for a real trigger. So each one here owns
 * its state and opens for real — which is both honest and the thing a reader
 * wants to try. They are the only interactive examples on the page, and that
 * is a property of overlays rather than an exception to the rule.
 *
 * Imported from each component's OWN module, never the barrel — see the cycle
 * note in examples.js.
 */
import React, { useRef, useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Autocomplete } from '../components/Autocomplete';
import { BottomNavigation } from '../components/BottomNavigation';
import { CodeBlock } from '../components/CodeBlock';
import { Dialog } from '../components/Dialog';
import { Drawer } from '../components/Drawer';
import { DropZone } from '../components/DropZone';
import { IconBadge } from '../components/IconBadge';
import { List } from '../components/List';
import { Loader } from '../components/Loader';
import { Dropdown, MenuButton, Menu, MenuItem, MenuDivider } from '../components/Menu';
import { Modal } from '../components/Modal';
import { Paper } from '../components/Paper';
import { Popover } from '../components/Popover';
import { Rail } from '../components/Rail';
import { Ratio } from '../components/Ratio';
import { SearchField } from '../components/SearchField';
import { Select } from '../components/Select';
import { Sidebar } from '../components/Sidebar';
import { Snackbar } from '../components/Snackbar';
import { StateMessage } from '../components/StateMessage';
import { Stepper, Step } from '../components/Stepper';
import { Swatch } from '../components/Swatch';
import { Table } from '../components/Table';
import { Tag } from '../components/Tag';
import { TextField } from '../components/TextField';
import { Toolbar } from '../components/Toolbar';
import { Tooltip } from '../components/Tooltip';
import { OmniTreeView } from '../components/TreeView';
import { Button } from '../components/Button';
import { Body, H3 } from '../components/Typography';
import { VStack } from '../components/Stack';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

/* Shared sample data. One set per shape, reused by the axis samples too, so a
   reader comparing two of a component's axes is comparing the same content
   and only the axis differs. */
export const NAV_ITEMS = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <FavoriteIcon />, label: 'Favorites', badge: 3 },
  { icon: <PersonIcon />, label: 'Profile' },
  { icon: <SettingsIcon />, label: 'Settings' },
];
export const LIST_ITEMS = [
  { label: 'Home' }, { label: 'Inbox' }, { label: 'Projects' }, { label: 'Settings' },
];
export const TABLE_COLUMNS = [
  { label: 'Dessert', field: 'name', width: '50%' },
  { label: 'Calories', field: 'calories', align: 'right' },
  { label: 'Fat (g)', field: 'fat', align: 'right' },
];
export const TABLE_ROWS = [
  { name: 'Frozen yoghurt', calories: 159, fat: 6 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9 },
  { name: 'Eclair', calories: 262, fat: 16 },
];
export const SELECT_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];
export const TOOLBAR_ITEMS = [
  { icon: <FormatBoldIcon />, label: 'Bold' },
  { icon: <FormatItalicIcon />, label: 'Italic' },
  { icon: <FormatUnderlinedIcon />, label: 'Underline' },
];
export const TREE_ITEMS = [
  { id: 'src', label: 'src', children: [
    { id: 'components', label: 'components', children: [
      { id: 'button', label: 'Button.js' },
      { id: 'card', label: 'Card.js' },
    ] },
    { id: 'index', label: 'index.js' },
  ] },
  { id: 'readme', label: 'README.md' },
];

/* A bounded frame for the components that fill their container.
   A rail, a bar or a sidebar has no natural size — dropped into the centred
   example slot it either collapses or runs to the full page width, and
   neither shows what the component looks like in use. */
const Frame = ({ w = 320, h, children }) => (
  <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
    {children}
  </div>
);

/* ── Overlays: each owns its own open state ───────────────────────────────
   Hooks cannot live in the example function itself — these entries are plain
   functions called during render, not components. Each overlay therefore gets
   a real component to hold the state. */

const ModalDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Rename project">
        <VStack gap="var(--Sizing-2)">
          <Body>Modals take the whole screen's attention, so they owe the reader a way out.</Body>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </VStack>
      </Modal>
    </>
  );
};

const DialogDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Discard changes?"
        actions={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Keep editing</Button>
          <Button variant="error" onClick={() => setOpen(false)}>Discard</Button>
        </>}
      >
        <Body>This cannot be undone.</Body>
      </Dialog>
    </>
  );
};

const DrawerDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <VStack gap="var(--Sizing-2)" style={{ padding: 'var(--Sizing-3)', minWidth: 240 }}>
          <H3>Filters</H3>
          <List items={LIST_ITEMS} clickable />
          <Button onClick={() => setOpen(false)}>Close</Button>
        </VStack>
      </Drawer>
    </>
  );
};

const SnackbarDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show snackbar</Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        color="success"
        autoHideDuration={4000}
      >
        Project saved.
      </Snackbar>
    </>
  );
};

const PopoverDemo = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen(o => !o)}>Open popover</Button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} width={260}>
        <VStack gap="var(--Sizing-1)" style={{ padding: 'var(--Sizing-2)' }}>
          <Body>A panel anchored to the thing that opened it, rendered through a portal so no ancestor can clip it.</Body>
        </VStack>
      </Popover>
    </>
  );
};

export const LEAD_EXAMPLES = {
  /* The bar is the whole component, so it is shown at a width where its
     regions are distinguishable rather than centred as an object. */
  AppBar: () => (
    <Frame w="100%">
      <AppBar
        navLinks={[{ label: 'Work' }, { label: 'Studio' }, { label: 'Contact' }]}
      />
    </Frame>
  ),

  Autocomplete: () => (
    <Frame>
      <Autocomplete
        label="Theme"
        options={['Light', 'Dark', 'System', 'High contrast']}
        placeholder="Type to search"
      />
    </Frame>
  ),

  BottomNavigation: () => (
    <Frame w={360}>
      <BottomNavigation items={NAV_ITEMS.slice(0, 4)} defaultValue={0} />
    </Frame>
  ),

  /* Its own copy button, and the dark region follows the brand's neutrals
     rather than a hardcoded #1e1e1e. */
  CodeBlock: () => (
    <Frame w="100%">
      <CodeBlock code={'npm install @omni-design/components'} language="bash" />
    </Frame>
  ),

  Dialog: () => <DialogDemo />,
  Drawer: () => <DrawerDemo />,

  DropZone: () => (
    <Frame w={360}>
      <DropZone label="Drop a file here" sublabel="PNG or SVG, up to 2 MB" />
    </Frame>
  ),

  IconBadge: () => <IconBadge color="primary"><NotificationsIcon /></IconBadge>,

  List: () => <Frame><List items={LIST_ITEMS} clickable /></Frame>,

  Loader: () => <Loader message="Loading projects…" />,

  /* The compound component in full. `Menu` alone reads the default context,
     whose `open` is false, so it renders nothing — the Dropdown root is what
     supplies the state. */
  Menu: () => (
    <Dropdown>
      <MenuButton>Actions</MenuButton>
      <Menu>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </Dropdown>
  ),

  Modal: () => <ModalDemo />,

  Paper: () => (
    <Paper surface="Container">
      <VStack gap="var(--Sizing-1)" style={{ padding: 'var(--Sizing-3)', minWidth: 220 }}>
        <H3>Paper</H3>
        <Body>A surface at one container level, with the elevation that level implies.</Body>
      </VStack>
    </Paper>
  ),

  Popover: () => <PopoverDemo />,

  /* Needs a height: a rail fills its container vertically and has no
     intrinsic one. */
  Rail: () => <Frame w={88} h={320}><Rail items={NAV_ITEMS} defaultValue={0} /></Frame>,

  Ratio: () => <Frame w={240}><Ratio ratio="16:9" /></Frame>,

  SearchField: () => <Frame><SearchField placeholder="Search projects…" /></Frame>,

  Select: () => (
    <Frame><Select label="Appearance" options={SELECT_OPTIONS} defaultValue="system" /></Frame>
  ),

  /* `permanent`, because the default `temporary` variant is a closed overlay
     and would show nothing at all. */
  Sidebar: () => (
    <Frame w={280} h={320}>
      <Sidebar variant="permanent" open items={LIST_ITEMS} width={280} />
    </Frame>
  ),

  Snackbar: () => <SnackbarDemo />,

  StateMessage: () => (
    <Frame w={360}>
      <StateMessage
        type="empty"
        title="No projects yet"
        body="Create one to get started."
        action={<Button size="small">New project</Button>}
      />
    </Frame>
  ),

  Stepper: () => (
    <Frame w={360}>
      <Stepper activeStep={1}>
        <Step label="Colors" />
        <Step label="Type" />
        <Step label="Export" />
      </Stepper>
    </Frame>
  ),

  /* An arbitrary CSS colour, not a palette name — a swatch's colour is data
     the user picked, which is the whole reason the component exists. */
  Swatch: () => <Swatch color="#70947b" label="Primary" />,

  Table: () => (
    <Frame w="100%"><Table columns={TABLE_COLUMNS} rows={TABLE_ROWS} /></Frame>
  ),

  Tag: () => <Tag color="primary">Beta</Tag>,

  TextField: () => (
    <Frame><TextField label="Project name" placeholder="Untitled" /></Frame>
  ),

  Toolbar: () => <Toolbar items={TOOLBAR_ITEMS} defaultValue={0} />,

  /* Interactive by nature — it appears on hover and focus, so there is
     nothing to force open. */
  Tooltip: () => (
    <Tooltip title="Rename this project">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),

  TreeView: () => (
    <Frame><OmniTreeView items={TREE_ITEMS} defaultExpanded={['src', 'components']} /></Frame>
  ),
};
