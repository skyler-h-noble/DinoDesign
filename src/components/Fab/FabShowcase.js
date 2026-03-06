// src/components/Fab/FabShowcase.js
import React, { useState } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import NavigationIcon from '@mui/icons-material/Navigation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import MailIcon from '@mui/icons-material/Mail';
import { Fab } from './Fab';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const ICON_MAP = {
  Add: <AddIcon sx={{ fontSize: 'inherit' }} />,
  Edit: <EditIcon sx={{ fontSize: 'inherit' }} />,
  Delete: <DeleteIcon sx={{ fontSize: 'inherit' }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  Share: <ShareIcon sx={{ fontSize: 'inherit' }} />,
  Search: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  Navigation: <NavigationIcon sx={{ fontSize: 'inherit' }} />,
  Cart: <ShoppingCartIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  Home: <HomeIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Mail: <MailIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

/* --- Helpers --- */
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
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box component="input" type="text" value={value}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0, '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = COLOR_MAP[color] || 'Primary';
  return (
    <Tooltip title={cap(color)} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + cap(color)} aria-pressed={selected}
        sx={{ width: 32, height: 32, borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)' }} />}
      </Box>
    </Tooltip>
  );
}

export function FabShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [iconName, setIconName] = useState('Add');
  const [extended, setExtended] = useState(false);
  const [extendedLabel, setExtendedLabel] = useState('Create');
  const [animate, setAnimate] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const C = COLOR_MAP[color] || 'Primary';
  const isSolid = variant === 'solid';
  const iconEl = ICON_MAP[iconName] || ICON_MAP.Add;

  const generateCode = () => {
    const parts = [];
    if (variant !== 'solid') parts.push('variant="' + variant + '"');
    if (color !== 'primary') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    parts.push('icon={<' + iconName + 'Icon />}');
    if (extended) {
      parts.push('extended');
      parts.push('label="' + extendedLabel + '"');
    }
    if (animate) parts.push('animate');
    if (disabled) parts.push('disabled');
    parts.push('ariaLabel="' + (extended ? extendedLabel : iconName) + '"');
    return '<Fab\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Floating Action Button</H2>
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

              <Fab
                variant={variant}
                color={color}
                size={size}
                icon={iconEl}
                extended={extended}
                label={extendedLabel}
                animate={animate}
                disabled={disabled}
                ariaLabel={extended ? extendedLabel : iconName}
              />
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 220 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Variant */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Solid" selected={variant === 'solid'} onClick={() => setVariant('solid')} />
                <ControlButton label="Light" selected={variant === 'light'} onClick={() => setVariant('light')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isSolid
                  ? 'bg: var(--Buttons-{C}-Button), text: var(--Buttons-{C}-Text).'
                  : 'bg: var(--Buttons-{C}-Light-Button), text: var(--Buttons-{C}-Light-Text).'}
              </Caption>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '40px.' : size === 'medium' ? '48px (default).' : '56px.'}
              </Caption>
            </Box>

            {/* Icon */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON</OverlineSmall>
              <TextInput value={iconName} onChange={setIconName} placeholder="Add" sx={{ width: '100%' }} />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                MUI icon name (e.g. Add, Edit, Delete, Favorite, Share, Search, Navigation, Cart, Settings, Home, Star, Mail).
              </Caption>
            </Box>

            {/* Extended */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Extended</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Pill shape with icon + text label.</Caption>
                  </Box>
                  <Switch checked={extended} onChange={(e) => setExtended(e.target.checked)} size="small" />
                </Box>
                {extended && (
                  <Box sx={{ mt: 1 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Label text</Caption>
                    <TextInput value={extendedLabel} onChange={setExtendedLabel} placeholder="Create" sx={{ width: '100%' }} />
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Animation</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Pulse ring effect to draw attention.</Caption>
                  </Box>
                  <Switch checked={animate} onChange={(e) => setAnimate(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Disabled</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>50% opacity, no interaction.</Caption>
                  </Box>
                  <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(variant)} / {cap(color)} / {cap(size)}{extended ? ' / Extended' : ''}{animate ? ' / Animated' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Button role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button role="button" aria-label="…">'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {extended
                      ? 'Extended: visible label text provides accessible name. aria-label reinforces it.'
                      : 'Icon-only: aria-label is required since there is no visible text.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3px solid var(--Focus-Visible) with 2px offset.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Disabled:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    HTML disabled attribute. 50% opacity, cursor: not-allowed. Removed from tab order.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Solid:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    bg: var(--Buttons-{'{C}'}-Button), text: var(--Buttons-{'{C}'}-Text), border: var(--Buttons-{'{C}'}-Border)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Light:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    bg: var(--Buttons-{'{C}'}-Light-Button), text: var(--Buttons-{'{C}'}-Light-Text)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Shadow:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Resting: 0 2px 8px. Hover: 0 4px 12px. Active: scale(0.96).
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>One per screen:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>FABs represent the primary action. Use at most one per view.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Extended for clarity:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use extended variant when the icon alone may be ambiguous.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Animation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use sparingly. Respect prefers-reduced-motion.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Position:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Typically bottom-right corner with position: fixed. Ensure it doesn't overlap critical content.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default FabShowcase;
