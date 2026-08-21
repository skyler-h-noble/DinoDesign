// src/components/List/ListShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Divider as MuiDivider, Switch, Avatar, TextField,
  Checkbox as MuiCheckbox, Radio as MuiRadio,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { List, ListItem } from './List';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Link } from '../Link';
import { Tag } from '../Tag';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
// Grouped per the Button showcase pattern. Default is its own group at the
// top; Theme covers brand palettes; Semantic covers status colors.
const COLOR_GROUPS = [
  { label: 'Default',  colors: ['default'] },
  { label: 'Theme',    colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
];

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const ICON_REGISTRY = {
  home: HomeIcon, settings: SettingsIcon, inbox: InboxIcon, star: StarIcon,
  folder: FolderIcon, delete: DeleteIcon, edit: EditIcon, chevronright: ChevronRightIcon,
  morevert: MoreVertIcon, info: InfoIcon, bookmark: BookmarkIcon, search: SearchIcon, check: CheckIcon,
};
function resolveIcon(name) {
  if (!name) return null;
  return ICON_REGISTRY[name.toLowerCase().replace(/[^a-z]/g, '')] || null;
}

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function getContrast(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return null;
  const l1 = getLuminance(hex1); const l2 = getLuminance(hex2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// Three-layer sample data so the 1st / 2nd / 3rd-row toggles always have
// content to show. Previously only the AVATAR_ITEMS / IMAGE_ITEMS had
// overline + secondary, so toggling the rows on for the default sample
// items had no visible effect.
const SAMPLE_ITEMS = [
  { overline: 'NAV',      label: 'Home',     secondary: 'Dashboard overview',         icon: HomeIcon     },
  { overline: 'INBOX',    label: 'Inbox',    secondary: '3 unread messages',          icon: InboxIcon    },
  { overline: 'WORK',     label: 'Projects', secondary: 'Active and archived work',   icon: FolderIcon   },
  { overline: 'SETTINGS', label: 'Settings', secondary: 'Preferences and account',    icon: SettingsIcon },
];
// Three-layer text sample data so the full OverlineSmall / SubtitleLarge /
// Body stack is visible. `overline` is the kicker on top, `label` is the
// main title (SubtitleLarge), `secondary` is the Body description.
const AVATAR_ITEMS = [
  { overline: 'TEAM',      label: 'Alice Johnson', secondary: 'Product Designer', initials: 'AJ' },
  { overline: 'TEAM',      label: 'Bob Smith',     secondary: 'Engineer',         initials: 'BS' },
  { overline: 'MARKETING', label: 'Carol Davis',   secondary: 'Marketing Lead',   initials: 'CD' },
  { overline: 'DATA',      label: 'Dan Wilson',    secondary: 'Data Analyst',     initials: 'DW' },
];
const IMAGE_ITEMS = [
  { overline: 'LANDSCAPE', label: 'Mountain Vista', secondary: 'Landscape photography series' },
  { overline: 'URBAN',     label: 'City Lights',    secondary: 'Night-time street shots' },
  { overline: 'COASTAL',   label: 'Ocean Breeze',   secondary: 'Long-exposure shoreline' },
  { overline: 'NATURE',    label: 'Forest Trail',   secondary: 'Hiking and trail walks' },
];

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700 }}>{ratio}:1</Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}
function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Copy failed:', err); }
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton size="small" onClick={handleCopy}
        sx={{ color: copied ? '#4ade80' : '#9ca3af', '&:hover': { backgroundColor: '#333', color: '#e5e7eb' } }}>
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </Tooltip>
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  // 'default' uses the Buttons-Default-* tokens which inherit from the
  // active surface scope — so the swatch paints whatever the current
  // page-level default button color is. Other colors use their explicit
  // palette token (Buttons-Primary, Buttons-Success, etc.).
  const bgVar      = color === 'default' ? 'var(--Buttons-Default-Button)' : ('var(--Buttons-' + C + '-Button)');
  const fgVar      = color === 'default' ? 'var(--Buttons-Default-Text)'   : ('var(--Buttons-' + C + '-Text)');
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: bgVar,
          border: selected ? '2px solid var(--Text)' : '1px solid var(--Border)',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: fgVar, pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}
function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box component="button" onClick={() => !isDisabled && onClick()}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        opacity: isDisabled ? 0.4 : 1, padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': !isDisabled ? { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' } : {},
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function PlaceholderImg({ size }) {
  // Image-slot placeholder. Painted with var(--Border) so the swatch sits
  // visibly between Surface and Container without competing with the
  // text content, with a centered photo icon to signal that something
  // belongs here. The icon uses var(--Background) so it reads against
  // the border-tinted square at any tone.
  const s = size === 'small' ? 28 : size === 'large' ? 40 : 36;
  return (
    <Box sx={{
      width: s + 'px',
      height: s + 'px',
      borderRadius: 'var(--Input-Radius)',
      backgroundColor: 'var(--Border)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--Background)',
    }}>
      <ImageOutlinedIcon sx={{ fontSize: Math.round(s * 0.6) }} />
    </Box>
  );
}

export function ListShowcase() {
  const [mainTab, setMainTab] = useState(0);
  // Variant / color / size pickers were removed — the lib now offers
  // only the default style at a single auto-sizing footprint that grows
  // and shrinks with content. These are pinned at the API level so
  // generateCode and <List> calls below don't need conditional branches.
  const variant     = 'default';
  const color       = 'default';
  const size        = 'medium';
  const [orientation, setOrientation] = useState('vertical');
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Per-row visibility booleans. Defaults: 1st and 2nd rows ON, 3rd row OFF
  // — the most common compact list configuration.
  const [showOverline,  setShowOverline]  = useState(true);
  const [showTitle,     setShowTitle]     = useState(true);
  const [showSecondary, setShowSecondary] = useState(false);
  // Non-clickable mode dividers. Mutually exclusive with the clickable
  // card chrome; the playground only surfaces these when interaction='none'.
  const [bottomBorder,  setBottomBorder]  = useState(false);
  const [rightBorder,   setRightBorder]   = useState(false);
  const [startDecoratorType, setStartDecoratorType] = useState('none');
  const [endDecoratorType, setEndDecoratorType] = useState('none');
  const [startIconName, setStartIconName] = useState('Home');
  const [endIconName, setEndIconName] = useState('ChevronRight');
  const [startIconIsButton, setStartIconIsButton] = useState(false);
  const [endIconIsButton, setEndIconIsButton] = useState(false);
  const [interaction, setInteraction] = useState('none');
  const [contrastData, setContrastData] = useState({});

  const isHorizontal = orientation === 'horizontal';
  const hasStartIcon = startDecoratorType === 'icon';
  const hasEndIcon = endDecoratorType === 'icon';
  const isClickable = interaction === 'clickable';
  // Selectable mode was removed from the playground — checkbox / radio
  // affordances are now passed via the start/end decorator slots, so the
  // showcase no longer needs a separate interaction mode for selection.
  // Pinned to false so accessibility-tab branches that gated on selectable
  // simply don't render.
  const isSelectable = false;
  const selectionType = 'checkbox';
  const selectionMode = 'none';

  const handleInteractionChange = (mode) => {
    setInteraction(mode);
  };
  const handleStartDecoratorChange = (type) => {
    setStartDecoratorType(type);
    if (type !== 'icon') setStartIconIsButton(false);
  };
  const handleEndDecoratorChange = (type) => {
    setEndDecoratorType(type);
    if (type !== 'icon') setEndIconIsButton(false);
  };

  const getStartDecorator = (index) => {
    if (startDecoratorType === 'icon') {
      const Resolved = resolveIcon(startIconName);
      if (Resolved) return <Resolved />;
      return React.createElement(SAMPLE_ITEMS[index % SAMPLE_ITEMS.length].icon);
    }
    if (startDecoratorType === 'avatar') return <Avatar sx={{ bgcolor: 'var(--Buttons-Primary-Button)' }}>{AVATAR_ITEMS[index % AVATAR_ITEMS.length].initials}</Avatar>;
    if (startDecoratorType === 'image')    return <PlaceholderImg index={index} size={size} />;
    if (startDecoratorType === 'checkbox') return <MuiCheckbox sx={{ p: 0, color: 'var(--Border)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} onClick={(e) => e.stopPropagation()} />;
    if (startDecoratorType === 'radio')    return <MuiRadio    sx={{ p: 0, color: 'var(--Border)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} onClick={(e) => e.stopPropagation()} />;
    return undefined;
  };
  const getEndDecorator = (index) => {
    if (endDecoratorType === 'checkbox')   return <MuiCheckbox sx={{ p: 0, color: 'var(--Border)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} onClick={(e) => e.stopPropagation()} />;
    if (endDecoratorType === 'radio')      return <MuiRadio    sx={{ p: 0, color: 'var(--Border)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} onClick={(e) => e.stopPropagation()} />;
    if (endDecoratorType === 'link')       return <Link href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>Open</Link>;
    if (endDecoratorType === 'button')     return <Button size="small" variant="primary-outline" onClick={(e) => e.stopPropagation()}>Action</Button>;
    if (endDecoratorType === 'buttonGroup') return (
      <ButtonGroup size="small">
        <Button size="small" variant="primary-outline" onClick={(e) => e.stopPropagation()}>Edit</Button>
        <Button size="small" variant="primary-outline" onClick={(e) => e.stopPropagation()}>Delete</Button>
      </ButtonGroup>
    );
    if (endDecoratorType === 'tag')        return <Tag color="primary" size="small">Status</Tag>;
    return undefined;
  };

  const getPreviewItems = () => {
    const useAvatarLabels = startDecoratorType === 'avatar';
    const useImageLabels = startDecoratorType === 'image';
    const sourceItems = useAvatarLabels ? AVATAR_ITEMS : useImageLabels ? IMAGE_ITEMS : SAMPLE_ITEMS;
    return sourceItems.map((item, i) => ({
      // Row visibility — when toggled off, pass null so ListItem skips
      // rendering that text layer. The typography style for each row is
      // chosen by the consumer; we never bake style assumptions into the
      // row identity.
      label:     showTitle     ? item.label     : null,
      secondary: showSecondary ? item.secondary : null,
      overline:  showOverline  ? item.overline  : null,
      startDecorator: getStartDecorator(i),
      endDecorator: getEndDecorator(i),
      startDecoratorIsButton: hasStartIcon && startIconIsButton,
      endDecoratorIsButton: hasEndIcon && endIconIsButton,
      startDecoratorAriaLabel: hasStartIcon && startIconIsButton ? (startIconName || 'Action') : undefined,
      endDecoratorAriaLabel: hasEndIcon && endIconIsButton ? (endIconName || 'Action') : undefined,
      // Non-clickable mode dividers — surfaced as ListItem props; the
      // ListItem implementation ignores them when clickable is true.
      bottomBorder: !isClickable && bottomBorder,
      rightBorder:  !isClickable && rightBorder,
    }));
  };

  const generateCode = () => {
    const lines = [];
    const lp = [];
    if (isHorizontal) lp.push('orientation="horizontal"');
    if (isClickable) lp.push('clickable');
    lines.push('<List' + (lp.length ? ' ' + lp.join(' ') : '') + '>');
    const ip = [];
    if (startDecoratorType === 'icon') {
      ip.push(startIconIsButton
        ? 'startDecorator={<' + (startIconName || 'HomeIcon') + ' />} startDecoratorIsButton'
        : 'startDecorator={<' + (startIconName || 'HomeIcon') + ' />}');
    } else if (startDecoratorType !== 'none') {
      ip.push('startDecorator={<' + cap(startDecoratorType) + ' />}');
    }
    if (endDecoratorType === 'icon') {
      ip.push(endIconIsButton
        ? 'endDecorator={<' + (endIconName || 'ChevronRightIcon') + ' />} endDecoratorIsButton'
        : 'endDecorator={<' + (endIconName || 'ChevronRightIcon') + ' />}');
    } else if (endDecoratorType !== 'none') {
      ip.push('endDecorator={<' + cap(endDecoratorType) + ' />}');
    }
    lines.push('  <ListItem' + (ip.length ? ' ' + ip.join(' ') : '') + '>Home</ListItem>');
    lines.push('  <ListItem>Inbox</ListItem>');
    lines.push('  <ListItem>Settings</ListItem>');
    lines.push('</List>');
    return lines.join('\n');
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.surface = getCssVar('--Surface');
    data.surfaceDim = getCssVar('--Surface-Dim');
    data.border = getCssVar('--Border');
    data.background = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>List</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%' }}>
                <List orientation={orientation} clickable={isClickable}
                  items={getPreviewItems()} />
              </Box>
            </Box>
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['vertical', 'horizontal'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>INTERACTION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['none', 'clickable'].map((m) => (
                  <ControlButton key={m} label={cap(m)} selected={interaction === m} onClick={() => handleInteractionChange(m)} />
                ))}
              </Stack>
              {isClickable && (
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                  Items get the card chrome (border + shadow + radius) plus hover, active, and 3px inset focus ring. role="button" with Enter/Space activation.
                </Caption>
              )}
            </Box>

            {/* Row-visibility booleans. The typography style for each row
                is configurable by the consumer (via the overline / children /
                secondary props' inner components), so we don't name the rows
                by typography type — just by position. */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TEXT ROWS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Label>1st row of text</Label>
                <Switch checked={showOverline} onChange={(e) => setShowOverline(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Label>2nd row of text</Label>
                <Switch checked={showTitle} onChange={(e) => setShowTitle(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label>3rd row of text</Label>
                <Switch checked={showSecondary} onChange={(e) => setShowSecondary(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* Non-clickable mode dividers — bottomBorder for vertical
                lists, rightBorder for horizontal. Only visible when the
                row is non-clickable (the clickable mode renders its own
                card chrome — border + shadow — instead of edge dividers). */}
            {!isClickable && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>NON-CLICKABLE DIVIDERS</OverlineSmall>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Label>Bottom border</Label>
                  <Switch checked={bottomBorder} onChange={(e) => setBottomBorder(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label>Right border</Label>
                  <Switch checked={rightBorder} onChange={(e) => setRightBorder(e.target.checked)} size="small" />
                </Box>
              </Box>
            )}

            <MuiDivider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            <Box component="button" onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', border: 'none',
                backgroundColor: 'transparent', color: 'var(--Text)', padding: 0, fontFamily: 'inherit', fontSize: '14px', fontWeight: 600 }}>
              {showAdvanced ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              Decorators
            </Box>

            {showAdvanced && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mt: 1 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START DECORATOR</OverlineSmall>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {['none', 'icon', 'avatar', 'image', 'checkbox', 'radio'].map((t) => (
                      <ControlButton key={t} label={cap(t)} selected={startDecoratorType === t} onClick={() => handleStartDecoratorChange(t)} />
                    ))}
                  </Stack>
                  {hasStartIcon && (
                    <Box sx={{ mt: 2 }}>
                      <TextField size="small" label="Icon name" value={startIconName}
                        onChange={(e) => setStartIconName(e.target.value)}
                        helperText={resolveIcon(startIconName) ? 'Resolved' : 'Available: Home, Inbox, Folder, Settings, Star, Delete, Edit, Search, Bookmark, Info, MoreVert, Check'}
                        FormHelperTextProps={{ sx: { color: resolveIcon(startIconName) ? 'var(--Tags-Success-Text)' : 'var(--Text-Quiet)', fontSize: '11px' } }}
                        sx={{ width: '100%',
                          '& .MuiInputBase-root': { backgroundColor: 'var(--Background)', color: 'var(--Text)', fontSize: '13px' },
                          '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', fontSize: '13px' },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--Border)' } }} />
                      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Label>Icon is clickable (button)</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Wraps in focusable button with hover/focus ring</Caption>
                        </Box>
                        <Switch checked={startIconIsButton} onChange={(e) => setStartIconIsButton(e.target.checked)} size="small" />
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>END DECORATOR</OverlineSmall>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {['none', 'checkbox', 'radio', 'link', 'button', 'buttonGroup', 'tag'].map((t) => (
                      <ControlButton key={t} label={cap(t)} selected={endDecoratorType === t} onClick={() => handleEndDecoratorChange(t)} />
                    ))}
                  </Stack>
                  {hasEndIcon && (
                    <Box sx={{ mt: 2 }}>
                      <TextField size="small" label="Icon name" value={endIconName}
                        onChange={(e) => setEndIconName(e.target.value)}
                        helperText={resolveIcon(endIconName) ? 'Resolved' : 'Available: Home, Inbox, Folder, Settings, Star, Delete, Edit, Search, Bookmark, Info, MoreVert, Check'}
                        FormHelperTextProps={{ sx: { color: resolveIcon(endIconName) ? 'var(--Tags-Success-Text)' : 'var(--Text-Quiet)', fontSize: '11px' } }}
                        sx={{ width: '100%',
                          '& .MuiInputBase-root': { backgroundColor: 'var(--Background)', color: 'var(--Text)', fontSize: '13px' },
                          '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', fontSize: '13px' },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--Border)' } }} />
                      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Label>Icon is clickable (button)</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Wraps in focusable button with hover/focus ring</Caption>
                        </Box>
                        <Switch checked={endIconIsButton} onChange={(e) => setEndIconIsButton(e.target.checked)} size="small" />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {variant}{!isDefault ? ' / ' + color : ''} / {size} / {orientation}
            {isSelectable ? ' / ' + selectionType : ''}
            {isClickable ? ' / clickable' : ''}
            {!isDefault ? ' \u2014 data-theme="' + getThemeName() + '"' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Text must be readable against surface (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="var(--Text) vs. var(--Surface)"
                ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                note={isDefault ? 'Page-level tokens' : 'Resolved from data-theme="' + getThemeName() + '"'} />
            </Box>

            {!isDefault && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Container Visibility</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>List container must be distinguishable from page background (WCAG 1.4.11, 3:1)</BodySmall>
                <A11yRow label="var(--Surface) [themed] vs. page var(--Background)"
                  ratio={getContrast(contrastData.surface, contrastData.background)} threshold={3.0}
                  note={'Surface within data-theme="' + getThemeName() + '" vs page background'} />
                <A11yRow label="var(--Border) [themed] vs. page var(--Background)"
                  ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                  note="Theme border vs page background" />
              </Box>
            )}

            {(isClickable || isSelectable) && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Interactive States</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Hover, active, and focus states must be visually distinct (WCAG 1.4.11)</BodySmall>
                <A11yRow label="Hover: var(--Surface-Dim) vs. var(--Surface)"
                  ratio={getContrast(contrastData.surfaceDim, contrastData.surface)} threshold={3.0}
                  note="Hover background must differ from resting state" />
                <A11yRow label="var(--Text) vs. var(--Surface-Dim) [hover]"
                  ratio={getContrast(contrastData.text, contrastData.surfaceDim)} threshold={4.5}
                  note="Text must remain readable during hover" />
              </Box>
            )}

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {isSelectable
                      ? '<ul role="listbox"' + (selectionMode === 'checkbox' ? ' aria-multiselectable="true"' : '') + '>'
                      : '<ul role="list">'}
                  </Caption>
                </Box>
                {!isDefault && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Theme attribute:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      {'data-theme="' + getThemeName() + '"'}
                    </Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Items:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {isSelectable
                      ? '<li role="option" aria-selected aria-checked' + (selectionMode === 'checkbox' ? '' : '') + '>'
                      : isClickable
                        ? '<li role="button" tabIndex={0}>'
                        : '<li role="listitem">'}
                  </Caption>
                </Box>
                {isSelectable && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Selection control:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>
                      {selectionMode === 'checkbox'
                        ? 'Checkbox with tabIndex={-1} (row handles focus). aria-label="Select {item}".'
                        : 'Radio with tabIndex={-1} (row handles focus). aria-label="Select {item}".'}
                    </Caption>
                  </Box>
                )}
                {(isClickable || isSelectable) && (
                  <>
                    <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                      <BodySmall>Keyboard:</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)' }}>Enter and Space activate. Tab navigates between items. Disabled items removed from tab order.</Caption>
                    </Box>
                    <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                      <BodySmall>Focus indicator:</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>outline: 3px solid var(--Focus-Visible), outlineOffset: -3px (inset)</Caption>
                    </Box>
                  </>
                )}
                {(startIconIsButton || endIconIsButton) && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Icon button decorator:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>
                      {'<button role="button" tabIndex={0} aria-label="...">'} with independent focus ring. stopPropagation prevents row activation.
                    </Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Disabled items:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-disabled="true" (opacity: 0.5, not focusable)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Interaction states:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {isClickable || isSelectable
                      ? 'Hover: var(--Surface-Dim). Active: var(--Background). Focus: 3px inset outline ring.'
                      : 'Static items \u2014 no interactive states. Set Interaction to Clickable or Selectable.'}
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {(isClickable || isSelectable) && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Focus Indicators</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Interactive items must show visible focus (WCAG 2.4.7)</BodySmall>
                <A11yRow label="var(--Focus-Visible) vs. var(--Surface)"
                  ratio={getContrast(contrastData.focusVisible, contrastData.surface)} threshold={3.0}
                  note="Focus ring against list surface background" />
              </Box>
            )}

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size and Touch Targets</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>~28px row height, 13px text. Compact density for desktop.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>~36px row height, 14px text. Default balanced density.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>~40px row height, 16px text. Touch-friendly (meets 24x24px WCAG 2.5.8).</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default ListShowcase;