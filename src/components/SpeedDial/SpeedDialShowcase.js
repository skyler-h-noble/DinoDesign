// src/components/SpeedDial/SpeedDialShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { SpeedDial } from './SpeedDial';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const ICON_MAP = {
  Edit: <EditIcon sx={{ fontSize: 'inherit' }} />,
  Share: <ShareIcon sx={{ fontSize: 'inherit' }} />,
  Delete: <DeleteIcon sx={{ fontSize: 'inherit' }} />,
  Print: <PrintIcon sx={{ fontSize: 'inherit' }} />,
  Save: <SaveIcon sx={{ fontSize: 'inherit' }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  Copy: <FileCopyIcon sx={{ fontSize: 'inherit' }} />,
  Mail: <MailIcon sx={{ fontSize: 'inherit' }} />,
  Search: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  Home: <HomeIcon sx={{ fontSize: 'inherit' }} />,
  Person: <PersonIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Notifications: <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULT_ACTIONS = [
  { icon: 'Edit', name: 'Edit' },
  { icon: 'Share', name: 'Share' },
  { icon: 'Delete', name: 'Delete' },
  { icon: 'Print', name: 'Print' },
];

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
function SelectInput({ value, onChange, options, label, sx: sxOverride }) {
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
        ...sxOverride,
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
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box
      component="input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0,
        '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
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

export function SpeedDialShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('solid');
  const [color, setColor] = useState('primary');
  const [direction, setDirection] = useState('up');
  const [showTooltips, setShowTooltips] = useState(true);
  const [speed, setSpeed] = useState(50);
  const [actionCount, setActionCount] = useState(4);

  // Per-action config: icon name + tooltip name
  const [actionConfigs, setActionConfigs] = useState(
    DEFAULT_ACTIONS.map((a) => ({ icon: a.icon, name: a.name }))
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const C = COLOR_MAP[color] || 'Primary';
  const [contrastData, setContrastData] = useState({});

  // Sync actionConfigs when actionCount changes
  useEffect(() => {
    setActionConfigs((prev) => {
      const next = [];
      for (let i = 0; i < actionCount; i++) {
        if (prev[i]) {
          next.push(prev[i]);
        } else {
          const fallback = ICON_NAMES[i % ICON_NAMES.length];
          next.push({ icon: fallback, name: fallback });
        }
      }
      return next;
    });
  }, [actionCount]);

  const updateActionConfig = (index, field, value) => {
    setActionConfigs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Build actions array for SpeedDial
  const actions = actionConfigs.slice(0, actionCount).map((cfg, i) => ({
    icon: ICON_MAP[cfg.icon] || ICON_MAP.Edit,
    name: cfg.name || '',
    key: 'action-' + i,
  }));

  const generateCode = () => {
    const lines = [];
    lines.push('const actions = [');
    actions.forEach((a, i) => {
      const cfg = actionConfigs[i];
      lines.push('  { icon: <' + cfg.icon + 'Icon />, name: \'' + (cfg.name || '') + '\' },');
    });
    lines.push('];');
    lines.push('');
    const parts = [];
    parts.push('ariaLabel="Speed Dial"');
    if (variant !== 'solid') parts.push('variant="' + variant + '"');
    if (color !== 'primary') parts.push('color="' + color + '"');
    if (direction !== 'up') parts.push('direction="' + direction + '"');
    if (speed !== 50) parts.push('speed={' + speed + '}');
    if (!showTooltips) parts.push('showTooltips={false}');
    parts.push('actions={actions}');
    lines.push('<SpeedDial');
    parts.forEach((p) => lines.push('  ' + p));
    lines.push('/>');
    return lines.join('\n');
  };

  useEffect(() => {
    const data = {};
    data.background = getCssVar('--Background');
    data.colorButton = getCssVar('--Buttons-' + C + '-Button');
    data.colorText = getCssVar('--Buttons-' + C + '-Text');
    data.colorBorder = getCssVar('--Buttons-' + C + '-Border');
    data.lightButton = getCssVar('--Buttons-' + C + '-Light-Button');
    data.lightText = getCssVar('--Buttons-' + C + '-Light-Text');
    data.lightBorder = getCssVar('--Buttons-' + C + '-Light-Border');
    setContrastData(data);
  }, [variant, color, C]);

  // Preview area dimensions based on direction
  const previewMinHeight = direction === 'left' || direction === 'right' ? 160 : 350;

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Speed Dial</H2>
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
              minHeight: previewMinHeight, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3, overflow: 'visible' }}>

              {/* Interactive SpeedDial */}
              <Box sx={{
                position: 'relative',
                width: direction === 'left' || direction === 'right' ? '100%' : 56,
                height: direction === 'up' || direction === 'down' ? (56 + actionCount * 52 + 40) : 56,
                display: 'flex',
                alignItems: direction === 'up' ? 'flex-end' : direction === 'down' ? 'flex-start' : 'center',
                justifyContent: direction === 'left' ? 'flex-end' : direction === 'right' ? 'flex-start' : 'center',
              }}>
                <SpeedDial
                  variant={variant}
                  color={color}
                  direction={direction}
                  speed={speed}
                  showTooltips={showTooltips}
                  actions={actions}
                  ariaLabel="Speed Dial example"
                />
              </Box>

              <Caption style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>
                Click the FAB to open. {actionCount} action{actionCount !== 1 ? 's' : ''}, {direction} direction.
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

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['solid', 'light'].map((v) => (
                  <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {variant === 'solid'
                  ? 'FAB + actions: --Buttons-{Color}-Button bg.'
                  : 'FAB + actions: --Buttons-{Color}-Light-Button bg.'}
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

            {/* Direction */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DIRECTION</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['up', 'down', 'left', 'right'].map((d) => (
                  <ControlButton key={d} label={cap(d)} selected={direction === d} onClick={() => setDirection(d)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Actions expand {direction} from the FAB.
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Box>
                  <Label>Tooltips</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show labels beside actions.</Caption>
                </Box>
                <Switch checked={showTooltips} onChange={(e) => setShowTooltips(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* Advanced (collapsible) */}
            <Box sx={{ mt: 3 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                  background: 'none', border: 'none', padding: 0, fontFamily: 'inherit',
                  color: 'var(--Text-Quiet)', width: '100%',
                  '&:hover': { color: 'var(--Text)' },
                }}
              >
                <OverlineSmall style={{ color: 'inherit' }}>ADVANCED</OverlineSmall>
                <Box sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</Box>
              </Box>
              {showAdvanced && (
                <>
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <NumberStepper label="Actions" value={actionCount} onChange={setActionCount} min={1} max={6} />
                    <NumberStepper label="Speed (ms)" value={speed} onChange={setSpeed} min={0} max={200} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>
                    Actions: number of child buttons (1–6). Speed: stagger delay per action in ms.
                  </Caption>

                  {/* Per-action config */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      {showTooltips ? 'ACTION ICONS & TOOLTIPS' : 'ACTION ICONS'}
                    </OverlineSmall>
                    <Stack spacing={1.5}>
                      {actionConfigs.slice(0, actionCount).map((cfg, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 16, textAlign: 'right' }}>{i + 1}</Caption>
                          <SelectInput
                            value={cfg.icon}
                            onChange={(val) => updateActionConfig(i, 'icon', val)}
                            options={ICON_NAMES}
                            label={'Action ' + (i + 1) + ' icon'}
                            sx={{ width: 100, flexShrink: 0 }}
                          />
                          {showTooltips && (
                            <TextInput
                              value={cfg.name}
                              onChange={(val) => updateActionConfig(i, 'name', val)}
                              placeholder="Tooltip name"
                            />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {variant} / {color} / {direction}
          </BodySmall>

          <Stack spacing={4}>
            {/* Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>FAB + Action Button Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Icon on button background</BodySmall>
              {variant === 'solid' ? (
                <>
                  <A11yRow label={'Icon: var(--Buttons-' + C + '-Text) vs bg: var(--Buttons-' + C + '-Button)'}
                    ratio={getContrast(contrastData.colorText, contrastData.colorButton)} threshold={3.0}
                    note="Icon/text on FAB readability (WCAG 1.4.11, 3:1 for non-text)" />
                  <A11yRow label={'Border: var(--Buttons-' + C + '-Border) vs var(--Background)'}
                    ratio={getContrast(contrastData.colorBorder, contrastData.background)} threshold={3.0}
                    note="FAB border visibility against page (WCAG 1.4.11, 3:1)" />
                </>
              ) : (
                <>
                  <A11yRow label={'Icon: var(--Buttons-' + C + '-Light-Text) vs bg: var(--Buttons-' + C + '-Light-Button)'}
                    ratio={getContrast(contrastData.lightText, contrastData.lightButton)} threshold={3.0}
                    note="Icon/text on FAB readability (WCAG 1.4.11, 3:1 for non-text)" />
                  <A11yRow label={'Border: var(--Buttons-' + C + '-Light-Border) vs var(--Background)'}
                    ratio={getContrast(contrastData.lightBorder, contrastData.background)} threshold={3.0}
                    note="FAB border visibility against page (WCAG 1.4.11, 3:1)" />
                </>
              )}
            </Box>

            {/* ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>FAB button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-label="Speed Dial", aria-expanded="true|false", aria-haspopup="menu"
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Actions container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    role="menu" — wraps all action buttons.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Action buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    role="menuitem", aria-label="Action Name" — each action is labeled with its tooltip name.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dismiss:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Escape key or clicking outside closes the speed dial. FAB icon rotates 45° to indicate open state.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicators:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    All buttons: 3px solid var(--Focus-Visible) on :focus-visible with 2px offset.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Tooltips:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {showTooltips
                      ? 'Enabled — tooltip labels provide visible text for each action. Placed ' + (direction === 'up' || direction === 'down' ? 'left' : 'top') + ' of actions.'
                      : 'Disabled — actions rely on aria-label only. Consider enabling tooltips for sighted users.'}
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Best Practices */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Action count:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3–6 actions recommended. More than 6 should use a different pattern (e.g. menu, bottom sheet).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Stagger speed:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>30–80ms per action feels natural. 0ms for instant, 100ms+ for dramatic reveal.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Tooltip labels:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Always recommended when icons alone may be ambiguous. Keep labels concise (1–2 words).</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default SpeedDialShowcase;
