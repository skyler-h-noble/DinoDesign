// src/components/Icon/IconShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

// Filled icons
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';

// Outlined
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/Search';
import StarOutlinedIcon from '@mui/icons-material/StarOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Rounded
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

// TwoTone
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

// Sharp
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';

import { Icon } from './Icon';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const STYLES = ['filled', 'outlined', 'rounded', 'twotone', 'sharp'];
const STYLE_LABELS = { filled: 'Filled', outlined: 'Outlined', rounded: 'Rounded', twotone: 'Two Tone', sharp: 'Sharp' };

// Icon registry by name and style
const ICON_NAMES = ['Home', 'Favorite', 'Delete', 'Settings', 'Search', 'Star', 'Person', 'Notifications', 'Visibility', 'ShoppingCart', 'Lock', 'Info'];

const ICON_REGISTRY = {
  Home: { filled: HomeIcon, outlined: HomeOutlinedIcon, rounded: HomeRoundedIcon, twotone: HomeTwoToneIcon, sharp: HomeSharpIcon },
  Favorite: { filled: FavoriteIcon, outlined: FavoriteOutlinedIcon, rounded: FavoriteRoundedIcon, twotone: FavoriteTwoToneIcon, sharp: FavoriteSharpIcon },
  Delete: { filled: DeleteIcon, outlined: DeleteOutlinedIcon, rounded: DeleteRoundedIcon, twotone: DeleteTwoToneIcon, sharp: DeleteSharpIcon },
  Settings: { filled: SettingsIcon, outlined: SettingsOutlinedIcon, rounded: SettingsRoundedIcon, twotone: SettingsTwoToneIcon, sharp: SettingsSharpIcon },
  Search: { filled: SearchIcon, outlined: SearchOutlinedIcon, rounded: SearchRoundedIcon, twotone: SearchTwoToneIcon, sharp: SearchSharpIcon },
  Star: { filled: StarIcon, outlined: StarOutlinedIcon, rounded: StarRoundedIcon, twotone: StarTwoToneIcon, sharp: StarSharpIcon },
  Person: { filled: PersonIcon, outlined: PersonOutlinedIcon, rounded: PersonRoundedIcon, twotone: PersonTwoToneIcon, sharp: PersonSharpIcon },
  Notifications: { filled: NotificationsIcon, outlined: NotificationsOutlinedIcon, rounded: NotificationsRoundedIcon, twotone: NotificationsTwoToneIcon, sharp: NotificationsSharpIcon },
  Visibility: { filled: VisibilityIcon, outlined: VisibilityOutlinedIcon, rounded: VisibilityRoundedIcon, twotone: VisibilityTwoToneIcon, sharp: VisibilitySharpIcon },
  ShoppingCart: { filled: ShoppingCartIcon, outlined: ShoppingCartOutlinedIcon, rounded: ShoppingCartRoundedIcon, twotone: ShoppingCartTwoToneIcon, sharp: ShoppingCartSharpIcon },
  Lock: { filled: LockIcon, outlined: LockOutlinedIcon, rounded: LockRoundedIcon, twotone: LockTwoToneIcon, sharp: LockSharpIcon },
  Info: { filled: InfoIcon, outlined: InfoOutlinedIcon, rounded: InfoRoundedIcon, twotone: InfoTwoToneIcon, sharp: InfoSharpIcon },
};

function getIconComponent(name, style) {
  return ICON_REGISTRY[name]?.[style] || ICON_REGISTRY[name]?.filled || HomeIcon;
}

function getIconSuffix(style) {
  switch (style) {
    case 'outlined': return 'Outlined';
    case 'rounded': return 'Rounded';
    case 'twotone': return 'TwoTone';
    case 'sharp': return 'Sharp';
    default: return '';
  }
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
function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function TextInput({ value, onChange, placeholder, type, sx: sxOverride }) {
  return (
    <Box
      component="input"
      type={type || 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{
        padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0, width: 80,
        '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}
function SelectInput({ value, onChange, options, label }) {
  return (
    <Box
      component="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      sx={{
        padding: '4px 6px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        cursor: 'pointer', '&:focus': { borderColor: 'var(--Focus-Visible)' },
      }}
    >
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </Box>
  );
}

export function IconShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [style, setStyle] = useState('filled');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [customSize, setCustomSize] = useState('40');
  const [disabled, setDisabled] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Home');

  const [contrastData, setContrastData] = useState({});
  const C = COLOR_LABEL_MAP[color] || 'Default';
  const isTwoTone = style === 'twotone';

  const resolvedFontSize = size === 'custom'
    ? (parseInt(customSize, 10) || 40) + 'px'
    : size === 'small' ? '20px' : size === 'large' ? '36px' : '24px';

  const IconComp = getIconComponent(selectedIcon, style);
  const suffix = getIconSuffix(style);
  const importName = selectedIcon + suffix + 'Icon';

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size === 'custom') {
      parts.push('size="custom"');
      parts.push('fontSize={' + (parseInt(customSize, 10) || 40) + '}');
    } else if (size !== 'medium') {
      parts.push('size="' + size + '"');
    }
    if (isTwoTone) parts.push('twoTone');
    if (disabled) parts.push('disabled');
    const p = parts.length ? ' ' + parts.join(' ') : '';
    return 'import ' + importName + ' from \'@mui/icons-material/' + selectedIcon + (suffix || '') + '\';\n\n<Icon' + p + '>\n  <' + importName + ' />\n</Icon>';
  };

  useEffect(() => {
    const data = {};
    data.background = getCssVar('--Background');
    data.iconColor = getCssVar('--Icons-' + C);
    data.iconVariant = getCssVar('--Icons-Variant-' + C);
    setContrastData(data);
  }, [color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Icon</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 4 }}>

              {/* Main preview */}
              <Box sx={{ textAlign: 'center' }}>
                <Icon
                  color={color}
                  size={size}
                  fontSize={size === 'custom' ? parseInt(customSize, 10) || 40 : undefined}
                  disabled={disabled}
                  twoTone={isTwoTone}
                >
                  <IconComp />
                </Icon>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 12 }}>
                  {selectedIcon}{suffix} · {resolvedFontSize} · {isTwoTone ? 'var(--Icons-Variant-' + C + ')' : 'var(--Icons-' + C + ')'}
                </Caption>
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 180 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Icon name */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON</OverlineSmall>
              <TextInput
                value={selectedIcon}
                onChange={setSelectedIcon}
                placeholder="Home"
                sx={{ width: '100%' }}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                MUI icon name (e.g. Home, Favorite, Delete, Settings, Search, Star, Person, Notifications, Visibility, ShoppingCart, Lock, Info).
              </Caption>
            </Box>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {STYLES.map((s) => (
                  <ControlButton key={s} label={STYLE_LABELS[s]} selected={style === s} onClick={() => setStyle(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isTwoTone
                  ? 'Primary fill: var(--Icons-{Color}). Secondary fill: var(--Icons-Variant-{Color}).'
                  : 'Color: var(--Icons-{Color}).'}
              </Caption>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => {
                  const CC = COLOR_LABEL_MAP[c];
                  const isSel = color === c;
                  return (
                    <Tooltip key={c} title={cap(c)} arrow>
                      <Box
                        onClick={() => setColor(c)}
                        role="button"
                        aria-label={'Select ' + cap(c)}
                        aria-pressed={isSel}
                        sx={{
                          width: 32, height: 32, borderRadius: '4px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--Icons-' + CC + ')',
                          border: isSel ? '2px solid var(--Text)' : '2px solid var(--Border)',
                          outline: isSel ? '2px solid var(--Focus-Visible)' : 'none',
                          outlineOffset: '1px',
                          '&:hover': { transform: 'scale(1.1)' },
                          transition: 'transform 0.1s',
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: 18 }} />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large', 'custom'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              {size === 'custom' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                  <TextInput
                    value={customSize}
                    onChange={setCustomSize}
                    type="number"
                    placeholder="40"
                  />
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>px</Caption>
                </Box>
              )}
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '20px.' : size === 'medium' ? '24px (default).' : size === 'large' ? '36px.' : (parseInt(customSize, 10) || 40) + 'px custom.'}
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Box>
                  <Label>Disabled</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Reduces opacity to 0.38.</Caption>
                </Box>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {STYLE_LABELS[style]} / {cap(color)} / {size === 'custom' ? customSize + 'px' : size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Icon Color Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Icon color against page background</BodySmall>
              <A11yRow label={'var(--Icons-' + C + ') vs var(--Background)'}
                ratio={getContrast(contrastData.iconColor, contrastData.background)} threshold={3.0}
                note="Non-text contrast for icons (WCAG 1.4.11, 3:1)" />
              {isTwoTone && (
                <A11yRow label={'var(--Icons-Variant-' + C + ') vs var(--Background)'}
                  ratio={getContrast(contrastData.iconVariant, contrastData.background)} threshold={3.0}
                  note="Two-tone secondary fill contrast (WCAG 1.4.11, 3:1)" />
              )}
            </Box>

            {/* ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Decorative icons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-hidden="true" — default. Icon is invisible to screen readers.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Meaningful icons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Pass aria-label="Description" — sets role="img" and announces the label.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Disabled state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Opacity reduced to 0.38. Does not change ARIA state — disabled is a visual cue only. If the icon is a button, disable the wrapping button element.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Two-tone note:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Two-tone icons use a secondary fill (var(--Icons-Variant-{'{Color}'})) that should meet 3:1 non-text contrast against the background for visual clarity.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>20px — inline text, compact UI.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium (default)</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>24px — standard UI use.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>36px — emphasis, empty states, hero areas.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Custom</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Any pixel value via fontSize prop. Ensure touch targets remain at least 24×24px (WCAG 2.5.8).</Caption>
                </Box>
              </Stack>
            </Box>

            {/* Token Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                {COLORS.map((c, i) => {
                  const CC = COLOR_LABEL_MAP[c];
                  return (
                    <Box key={c} sx={{ py: 1.5, borderBottom: i < COLORS.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '2px', backgroundColor: 'var(--Icons-' + CC + ')', flexShrink: 0 }} />
                        <BodySmall>{cap(c)}</BodySmall>
                      </Box>
                      <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                        var(--Icons-{CC}) · Variant: var(--Icons-Variant-{CC})
                      </Caption>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default IconShowcase;