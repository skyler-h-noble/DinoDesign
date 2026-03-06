// src/components/List/ListShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Divider as MuiDivider, Switch, Avatar, TextField,
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
import { List, ListItem } from './List';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

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

const SAMPLE_ITEMS = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Inbox', icon: InboxIcon },
  { label: 'Projects', icon: FolderIcon },
  { label: 'Settings', icon: SettingsIcon },
];
const AVATAR_ITEMS = [
  { label: 'Alice Johnson', secondary: 'Product Designer', initials: 'AJ' },
  { label: 'Bob Smith', secondary: 'Engineer', initials: 'BS' },
  { label: 'Carol Davis', secondary: 'Marketing Lead', initials: 'CD' },
  { label: 'Dan Wilson', secondary: 'Data Analyst', initials: 'DW' },
];
const IMAGE_ITEMS = [
  { label: 'Mountain Vista', secondary: 'Landscape photography' },
  { label: 'City Lights', secondary: 'Urban collection' },
  { label: 'Ocean Breeze', secondary: 'Coastal series' },
  { label: 'Forest Trail', secondary: 'Nature walks' },
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
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
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
function PlaceholderImg({ index, size }) {
  const s = size === 'small' ? 28 : size === 'large' ? 40 : 36;
  const hues = [200, 140, 280, 30];
  return (
    <Box sx={{ width: s + 'px', height: s + 'px', borderRadius: '4px',
      background: 'linear-gradient(135deg, hsl(' + hues[index % 4] + ', 60%, 70%), hsl(' + (hues[index % 4] + 40) + ', 50%, 50%))',
      flexShrink: 0 }} />
  );
}

export function ListShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [showDividers, setShowDividers] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDecoratorType, setStartDecoratorType] = useState('none');
  const [endDecoratorType, setEndDecoratorType] = useState('none');
  const [startIconName, setStartIconName] = useState('Home');
  const [endIconName, setEndIconName] = useState('ChevronRight');
  const [startIconIsButton, setStartIconIsButton] = useState(false);
  const [endIconIsButton, setEndIconIsButton] = useState(false);
  const [interaction, setInteraction] = useState('none');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';
  const isHorizontal = orientation === 'horizontal';
  const hasStartIcon = startDecoratorType === 'icon';
  const hasEndIcon = endDecoratorType === 'icon';
  const isClickable = interaction === 'clickable';
  const isSelectable = interaction === 'selectable';
  const selectionMode = isSelectable ? selectionType : 'none';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const handleInteractionChange = (mode) => {
    setInteraction(mode);
    setSelectedIndices([]);
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
    if (startDecoratorType === 'image') return <PlaceholderImg index={index} size={size} />;
    return undefined;
  };
  const getEndDecorator = (index) => {
    if (endDecoratorType === 'icon') {
      const Resolved = resolveIcon(endIconName);
      if (Resolved) return <Resolved />;
      return <ChevronRightIcon />;
    }
    if (endDecoratorType === 'avatar') return <Avatar sx={{ bgcolor: 'var(--Buttons-Info-Button)', fontSize: '12px' }}><StarIcon sx={{ fontSize: 16 }} /></Avatar>;
    if (endDecoratorType === 'image') return <PlaceholderImg index={index + 2} size={size} />;
    return undefined;
  };

  const getPreviewItems = () => {
    const useAvatarLabels = startDecoratorType === 'avatar';
    const useImageLabels = startDecoratorType === 'image';
    const sourceItems = useAvatarLabels ? AVATAR_ITEMS : useImageLabels ? IMAGE_ITEMS : SAMPLE_ITEMS;
    return sourceItems.map((item, i) => ({
      label: item.label,
      secondary: item.secondary,
      startDecorator: getStartDecorator(i),
      endDecorator: getEndDecorator(i),
      startDecoratorIsButton: hasStartIcon && startIconIsButton,
      endDecoratorIsButton: hasEndIcon && endIconIsButton,
      startDecoratorAriaLabel: hasStartIcon && startIconIsButton ? (startIconName || 'Action') : undefined,
      endDecoratorAriaLabel: hasEndIcon && endIconIsButton ? (endIconName || 'Action') : undefined,
    }));
  };

  const generateCode = () => {
    const lines = [];
    const lp = [];
    if (variant !== 'default') lp.push('variant="' + variant + '"');
    if (!isDefault) lp.push('color="' + color + '"');
    if (size !== 'medium') lp.push('size="' + size + '"');
    if (isHorizontal) lp.push('orientation="horizontal"');
    if (showDividers) lp.push('dividers');
    if (isSelectable) lp.push('selectionMode="' + selectionType + '"');
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
  }, [variant, color]);

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
              <Box sx={{ width: '100%', maxWidth: isHorizontal ? '100%' : 320 }}>
                <List variant={variant} color={color} size={size} orientation={orientation}
                  dividers={showDividers} selectionMode={selectionMode} clickable={isClickable}
                  selectedIndices={selectedIndices} onSelectionChange={setSelectedIndices}
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
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {['default', 'solid', 'light'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isDefault
                  ? 'No theme \u2014 uses page-level var(--Text), var(--Border), var(--Background)'
                  : 'data-theme="' + getThemeName() + '" \u2014 all tokens resolve from theme'}
              </Caption>
            </Box>

            {!isDefault && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

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
                {['none', 'clickable', 'selectable'].map((m) => (
                  <ControlButton key={m} label={cap(m)} selected={interaction === m} onClick={() => handleInteractionChange(m)} />
                ))}
              </Stack>
              {isClickable && (
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                  Items get hover, active, and 3px inset focus ring. role="button" with Enter/Space activation.
                </Caption>
              )}
              {isSelectable && (
                <Box sx={{ mt: 2 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION TYPE</OverlineSmall>
                  <Stack direction="row" spacing={1}>
                    {['checkbox', 'radio'].map((t) => (
                      <ControlButton key={t} label={cap(t)} selected={selectionType === t} onClick={() => { setSelectionType(t); setSelectedIndices([]); }} />
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    {selectionType === 'checkbox'
                      ? 'Multi-select: click items to toggle. Container role="listbox" aria-multiselectable.'
                      : 'Single-select: click to choose one. Container role="listbox".'}
                  </Caption>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>Dividers</Label>
              <Switch checked={showDividers} onChange={(e) => setShowDividers(e.target.checked)} size="small" />
            </Box>

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
                    {['none', 'icon', 'avatar', 'image'].map((t) => (
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
                    {['none', 'icon', 'avatar', 'image'].map((t) => (
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
            {showDividers ? ' / dividers' : ''}{isSelectable ? ' / ' + selectionType : ''}
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