// src/components/BottomNavigation/BottomNavigationShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import RadioIcon from '@mui/icons-material/Radio';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { BottomNavigation } from './BottomNavigation';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const ICON_MAP = {
  Home: <HomeIcon sx={{ fontSize: 'inherit' }} />,
  Explore: <ExploreIcon sx={{ fontSize: 'inherit' }} />,
  Radio: <RadioIcon sx={{ fontSize: 'inherit' }} />,
  Library: <LibraryMusicIcon sx={{ fontSize: 'inherit' }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  Person: <PersonIcon sx={{ fontSize: 'inherit' }} />,
  Search: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  Notifications: <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
  Cart: <ShoppingCartIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Bookmark: <BookmarkIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULT_ITEMS = [
  { icon: 'Home', label: 'Home' },
  { icon: 'Explore', label: 'Browse' },
  { icon: 'Radio', label: 'Radio' },
  { icon: 'Library', label: 'Library' },
];

const BAR_COLORS = [
  { value: 'default', label: 'Default', desc: 'data-theme="Nav-Bar"' },
  { value: 'primary', label: 'Primary', desc: 'data-theme="Primary"' },
  { value: 'primary-light', label: 'Primary Light', desc: 'data-theme="Primary-Light"' },
  { value: 'primary-medium', label: 'Primary Medium', desc: 'data-theme="Primary-Medium"' },
  { value: 'primary-dark', label: 'Primary Dark', desc: 'data-theme="Primary-Dark"' },
  { value: 'white', label: 'White', desc: 'data-theme="White"' },
  { value: 'black', label: 'Black', desc: 'data-theme="Black"' },
];

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
function ControlButton({ label, selected, onClick, disabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={disabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: disabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
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
function SelectInput({ value, onChange, options, label }) {
  return (
    <Box component="select" value={value}
      onChange={(e) => onChange(e.target.value)} aria-label={label}
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
function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 90 }}>{label}</Caption>
      <button type="button" onClick={() => { if (value > min) onChange(value - 1); }} disabled={value <= min}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value <= min ? 0.4 : 1, fontFamily: 'inherit' }}>−</button>
      <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 24, textAlign: 'center' }}>{value}</Box>
      <button type="button" onClick={() => { if (value < max) onChange(value + 1); }} disabled={value >= max}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value >= max ? 0.4 : 1, fontFamily: 'inherit' }}>+</button>
    </Box>
  );
}
function CheckboxControl({ label, checked, onChange, caption, disabled }) {
  return (
    <Box sx={{ py: 0.5, opacity: disabled ? 0.4 : 1 }}>
      <FormControlLabel
        control={<MuiCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} size="small" disabled={disabled}
          sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} />}
        label={<Label>{label}</Label>} sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </Box>
  );
}

export function BottomNavigationShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [activeNav, setActiveNav] = useState(0);

  const [fixed, setFixed] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [labelOrientation, setLabelOrientation] = useState('vertical');
  const [backfill, setBackfill] = useState(true);
  const [barColor, setBarColor] = useState('default');

  const [itemCount, setItemCount] = useState(4);
  const [itemConfigs, setItemConfigs] = useState(
    DEFAULT_ITEMS.map((a) => ({ icon: a.icon, label: a.label }))
  );

  const canHorizontal = itemCount <= 4;

  useEffect(() => {
    if (itemCount > 4 && labelOrientation === 'horizontal') {
      setLabelOrientation('vertical');
    }
  }, [itemCount, labelOrientation]);

  useEffect(() => {
    setItemConfigs((prev) => {
      const next = [];
      const extras = [
        { icon: 'Favorite', label: 'Favorites' },
        { icon: 'Person', label: 'Profile' },
      ];
      for (let i = 0; i < itemCount; i++) {
        if (prev[i]) {
          next.push(prev[i]);
        } else {
          const fallback = extras[i - DEFAULT_ITEMS.length] || { icon: ICON_NAMES[i % ICON_NAMES.length], label: ICON_NAMES[i % ICON_NAMES.length] };
          next.push(fallback);
        }
      }
      return next;
    });
    setActiveNav((prev) => Math.min(prev, itemCount - 1));
  }, [itemCount]);

  const updateItemConfig = (index, field, value) => {
    setItemConfigs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const items = itemConfigs.slice(0, itemCount).map((cfg) => ({
    icon: ICON_MAP[cfg.icon] || ICON_MAP.Home,
    label: cfg.label,
  }));

  const generateCode = () => {
    const lines = [];
    lines.push('const items = [');
    items.forEach((item, i) => {
      const cfg = itemConfigs[i];
      lines.push('  { icon: <' + cfg.icon + 'Icon />, label: \'' + cfg.label + '\' },');
    });
    lines.push('];');
    lines.push('');
    const parts = [];
    parts.push('items={items}');
    if (barColor !== 'default') parts.push('barColor="' + barColor + '"');
    if (!showLabels) parts.push('showLabels={false}');
    if (showLabels && labelOrientation === 'horizontal' && canHorizontal) parts.push('labelOrientation="horizontal"');
    if (!backfill) parts.push('backfill={false}');
    if (!fixed) parts.push('fixed={false}');
    lines.push('<BottomNavigation');
    parts.forEach((p) => lines.push('  ' + p));
    lines.push('/>');
    return lines.join('\n');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Bottom Navigation</H2>
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

              <Box sx={{ width: '100%', maxWidth: 500, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <BottomNavigation
                  key={'bn-' + itemCount + '-' + labelOrientation + '-' + backfill + '-' + showLabels + '-' + barColor}
                  items={items}
                  value={activeNav}
                  onChange={setActiveNav}
                  showLabels={showLabels}
                  labelOrientation={labelOrientation}
                  backfill={backfill}
                  barColor={barColor}
                  fixed={false}
                />
              </Box>

              <Caption style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>
                {itemCount} items · {showLabels ? (labelOrientation === 'horizontal' && canHorizontal ? 'Horizontal labels' : 'Vertical labels') : 'Icons only'}
                {backfill ? ' · Backfill' : ''} · {(BAR_COLORS.find((c) => c.value === barColor) || BAR_COLORS[0]).label}
              </Caption>
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

            {/* Bar Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BAR COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {BAR_COLORS.map((c) => (
                  <ControlButton key={c.value} label={c.label} selected={barColor === c.value} onClick={() => setBarColor(c.value)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {(BAR_COLORS.find((c) => c.value === barColor) || BAR_COLORS[0]).desc} · data-surface="Surface-Dim" · bg: var(--Background)
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0}>
                <CheckboxControl label="Fixed" checked={fixed} onChange={setFixed}
                  caption="Position fixed to bottom of viewport." />
                <CheckboxControl label="Labels" checked={showLabels} onChange={setShowLabels}
                  caption="Show text labels with icons." />
                <CheckboxControl label="Selected Backfill" checked={backfill} onChange={setBackfill}
                  caption="Pill on selected: bg var(--Buttons-Primary-Button), border var(--Buttons-Primary-Border), icon var(--Buttons-Primary-Text)." />
              </Stack>
            </Box>

            {/* Label orientation */}
            {showLabels && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL ORIENTATION</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  <ControlButton label="Vertical" selected={labelOrientation === 'vertical'} onClick={() => setLabelOrientation('vertical')} />
                  <ControlButton label="Horizontal" selected={labelOrientation === 'horizontal' && canHorizontal}
                    onClick={() => { if (canHorizontal) setLabelOrientation('horizontal'); }}
                    disabled={!canHorizontal} />
                </Stack>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                  {!canHorizontal
                    ? 'Horizontal is only available with 4 or fewer items. Reduce item count to enable.'
                    : labelOrientation === 'vertical'
                      ? 'Icon above label (default). Label below pill.'
                      : 'Icon beside label. Label inside pill when backfill is on.'}
                </Caption>
              </Box>
            )}

            {/* Navigation Items */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>NAVIGATION ITEMS</OverlineSmall>
              <NumberStepper label="Count" value={itemCount} onChange={setItemCount} min={3} max={6} />

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {itemConfigs.slice(0, itemCount).map((cfg, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 16, textAlign: 'right' }}>{i + 1}</Caption>
                    <SelectInput
                      value={cfg.icon}
                      onChange={(val) => updateItemConfig(i, 'icon', val)}
                      options={ICON_NAMES}
                      label={'Item ' + (i + 1) + ' icon'}
                    />
                    {showLabels && (
                      <TextInput
                        value={cfg.label}
                        onChange={(val) => updateItemConfig(i, 'label', val)}
                        placeholder="Label"
                      />
                    )}
                  </Box>
                ))}
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
            {itemCount} items · {showLabels ? 'Labels ' + labelOrientation : 'Icons only'}
            {backfill ? ' · Backfill' : ''} · {(BAR_COLORS.find((c) => c.value === barColor) || BAR_COLORS[0]).label}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Landmark:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<nav role="navigation" aria-label="Bottom navigation">'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Tab list:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="tablist"</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Tab items:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="tab", aria-selected, aria-label</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3px solid var(--Focus-Visible) on :focus-visible.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Bar:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>Always: data-surface="Surface-Dim" · bg: var(--Background). Theme set by data-theme (Nav-Bar, Primary, Primary-Light, etc.).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Unselected icon/label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Text-Quiet)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected (no backfill):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected backfill pill:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    bg: var(--Buttons-Primary-Button) · border: 1px solid var(--Buttons-Primary-Border) · icon/text: var(--Buttons-Primary-Text)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Backfill + horizontal label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>Label inside pill: var(--Buttons-Primary-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Backfill + vertical label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>Label below pill: var(--Text)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Item count:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3–5 recommended. 6 maximum.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Horizontal layout:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Only available with 4 or fewer items.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Labels:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Always recommended for clarity.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Fixed:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Add bottom padding to main content to avoid overlap.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default BottomNavigationShowcase;
