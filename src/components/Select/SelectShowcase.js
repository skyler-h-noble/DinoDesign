// src/components/Select/SelectShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel, Avatar as MuiAvatar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Select } from './Select';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const ICON_MAP = {
  Search: <SearchIcon sx={{ fontSize: 18 }} />,
  Person: <PersonIcon sx={{ fontSize: 18 }} />,
  Mail: <MailIcon sx={{ fontSize: 18 }} />,
  Star: <StarIcon sx={{ fontSize: 18 }} />,
  Home: <HomeIcon sx={{ fontSize: 18 }} />,
  Settings: <SettingsIcon sx={{ fontSize: 18 }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 18 }} />,
  Notifications: <NotificationsIcon sx={{ fontSize: 18 }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULT_OPTIONS = ['None', 'Ten', 'Twenty', 'Thirty', 'Forty'];
const COLOR_OPTIONS = [
  { value: '#e53935', label: 'Red', color: '#e53935' },
  { value: '#1e88e5', label: 'Blue', color: '#1e88e5' },
  { value: '#43a047', label: 'Green', color: '#43a047' },
  { value: '#fb8c00', label: 'Orange', color: '#fb8c00' },
  { value: '#8e24aa', label: 'Purple', color: '#8e24aa' },
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
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
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
function CheckboxControl({ label, checked, onChange, caption }) {
  return (
    <Box sx={{ py: 0.5 }}>
      <FormControlLabel
        control={<MuiCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} size="small"
          sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} />}
        label={<Label>{label}</Label>} sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </Box>
  );
}

export function SelectShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');

  // Controls
  const [mode, setMode] = useState('standard');
  const [labelPosition, setLabelPosition] = useState('top');
  const [size, setSize] = useState('medium');
  const [selectionStyle, setSelectionStyle] = useState('default');
  const [disabled, setDisabled] = useState(false);
  const [showDividers, setShowDividers] = useState(false);
  const [showColorLabels, setShowColorLabels] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [labelText, setLabelText] = useState('Category');
  const [optCount, setOptCount] = useState(5);
  const [optLabels, setOptLabels] = useState(DEFAULT_OPTIONS.map((l) => l));

  // Decoration
  const [decoType, setDecoType] = useState('none');
  const [decoIcon, setDecoIcon] = useState('Search');
  const [decoInitials, setDecoInitials] = useState('AB');

  // Sync options
  useEffect(() => {
    setOptLabels((prev) => {
      const next = [];
      const defaults = ['None', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      for (let i = 0; i < optCount; i++) {
        next.push(prev[i] || defaults[i] || 'Option ' + (i + 1));
      }
      return next;
    });
  }, [optCount]);

  const updateOptLabel = (i, val) => {
    setOptLabels((prev) => { const n = [...prev]; n[i] = val; return n; });
  };

  // Build options
  const options = mode === 'color'
    ? COLOR_OPTIONS.slice(0, optCount)
    : optLabels.slice(0, optCount).map((l) => ({ value: l, label: l }));

  // Build decoration
  const startDecoration = decoType === 'icon'
    ? (ICON_MAP[decoIcon] || ICON_MAP.Search)
    : decoType === 'avatar'
      ? <MuiAvatar sx={{ width: 24, height: 24, fontSize: '11px', backgroundColor: 'var(--Buttons-Default-Button)', color: 'var(--Buttons-Default-Text)' }}>{decoInitials}</MuiAvatar>
      : undefined;

  // Reset value on mode change
  useEffect(() => { setSelectedValue(''); }, [mode]);

  const generateCode = () => {
    const parts = [];
    if (mode !== 'standard') parts.push('mode="' + mode + '"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (selectionStyle !== 'default') parts.push('selectionStyle="' + selectionStyle + '"');
    if (labelPosition !== 'none') parts.push('label="' + labelText + '"');
    if (decoType === 'icon') parts.push('startDecoration={<' + decoIcon + 'Icon />}');
    if (decoType === 'avatar') parts.push('startDecoration={<Avatar>' + decoInitials + '</Avatar>}');
    if (disabled) parts.push('disabled');
    if (showDividers) parts.push('showDividers');
    if (!showColorLabels && mode === 'color') parts.push('showColorLabels={false}');
    if (fullWidth) parts.push('fullWidth');
    parts.push('options={[' + options.map((o) => '"' + (typeof o === 'string' ? o : o.label) + '"').join(', ') + ']}');
    return '<Select\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Select</H2>
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
              minHeight: 350, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <Select
                  key={'sel-' + mode + '-' + labelPosition + '-' + size + '-' + selectionStyle + '-' + optCount + '-' + decoType + '-' + showDividers + '-' + showColorLabels}
                  mode={mode}
                  options={options}
                  value={selectedValue}
                  onChange={setSelectedValue}
                  label={labelPosition !== 'none' ? labelText : undefined}
                  labelPosition={labelPosition}
                  size={size}
                  selectionStyle={selectionStyle}
                  showDividers={showDividers}
                  showColorLabels={showColorLabels}
                  startDecoration={startDecoration}
                  disabled={disabled}
                  fullWidth
                />
              </Box>
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

            {/* Mode */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MODE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Standard" selected={mode === 'standard'} onClick={() => setMode('standard')} />
                <ControlButton label="Color" selected={mode === 'color'} onClick={() => setMode('color')} />
              </Stack>
            </Box>

            {/* Label position */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['top', 'floating', 'none'].map((lp) => (
                  <ControlButton key={lp} label={cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
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
                {labelPosition === 'floating' ? 'Floating label adds extra height to accommodate label inside.' : 'Standard height per size.'}
              </Caption>
            </Box>

            {/* Selection style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['default', 'light', 'solid'].map((ss) => (
                  <ControlButton key={ss} label={cap(ss)} selected={selectionStyle === ss} onClick={() => setSelectionStyle(ss)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {selectionStyle === 'default' ? 'Border outline on selected option.' :
                 selectionStyle === 'light' ? 'Light background fill on selected.' :
                 'Solid background fill on selected.'}
              </Caption>
            </Box>

            {/* Toggles */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Label>Disabled</Label>
                  <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Dividers</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Horizontal line between each option.</Caption>
                  </Box>
                  <Switch checked={showDividers} onChange={(e) => setShowDividers(e.target.checked)} size="small" />
                </Box>
                {mode === 'color' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                    <Box>
                      <Label>Color Labels</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show text next to swatches. Hidden labels use aria-label for screen readers.</Caption>
                    </Box>
                    <Switch checked={showColorLabels} onChange={(e) => setShowColorLabels(e.target.checked)} size="small" />
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Advanced Settings */}
            <Box sx={{ mt: 3 }}>
              <Box component="button" type="button" onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, width: '100%',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: 600,
                  color: 'var(--Text)', p: 0, mb: advancedOpen ? 2 : 0,
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                <Box component="span" sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</Box>
                Advanced Settings
              </Box>

              {advancedOpen && (
                <Stack spacing={2.5}>
                  {/* Label text */}
                  {labelPosition !== 'none' && (
                    <Box>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Label Text</Caption>
                      <TextInput value={labelText} onChange={setLabelText} placeholder="Category" sx={{ width: '100%' }} />
                    </Box>
                  )}

                  {/* Option count + labels */}
                  {mode === 'standard' && (
                    <Box>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
                      <NumberStepper label="Count" value={optCount} onChange={setOptCount} min={2} max={10} />
                      <Stack spacing={1} sx={{ mt: 1.5 }}>
                        {optLabels.slice(0, optCount).map((lbl, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                            <TextInput value={lbl} onChange={(val) => updateOptLabel(i, val)} placeholder={'Option ' + (i + 1)} />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {mode === 'color' && (
                    <Box>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR OPTIONS</OverlineSmall>
                      <NumberStepper label="Count" value={optCount} onChange={setOptCount} min={2} max={5} />
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                        Preset color swatches: Red, Blue, Green, Orange, Purple.
                      </Caption>
                    </Box>
                  )}

                  {/* Start decoration */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START DECORATION</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['none', 'icon', 'avatar'].map((dt) => (
                        <ControlButton key={dt} label={cap(dt)} selected={decoType === dt} onClick={() => setDecoType(dt)} />
                      ))}
                    </Stack>

                    {decoType === 'icon' && (
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0 }}>Icon</Caption>
                        <SelectInput value={decoIcon} onChange={setDecoIcon} options={ICON_NAMES} label="Decoration icon" />
                      </Box>
                    )}

                    {decoType === 'avatar' && (
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0 }}>Initials</Caption>
                        <TextInput value={decoInitials} onChange={setDecoInitials} placeholder="AB" sx={{ width: 60 }} />
                      </Box>
                    )}
                  </Box>
                </Stack>
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
            {cap(mode)} · {cap(labelPosition)} label · {cap(size)} · {cap(selectionStyle)} selection
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Trigger:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="combobox" aria-expanded aria-haspopup="listbox"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dropdown:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'role="listbox" with role="option" children, aria-selected.'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Enter/Space toggle. Escape closes. Arrow keys open.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible), 2px offset on trigger.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Trigger border:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>Default: inherit. Focused/open: var(--Buttons-Default-Border).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected (default):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>border: var(--Buttons-Default-Border) · text: var(--Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected (light):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Light-Button) · text: var(--Buttons-Default-Light-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected (solid):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Button) · text: var(--Buttons-Default-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Unselected:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>text: var(--Text-Quiet)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Hover / Active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Hover) / var(--Active)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Always provide a label (top or floating) for accessibility. aria-label used as fallback.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Floating label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Taller height to accommodate label inside. Label shrinks on focus/filled.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Color mode:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Shows color swatches alongside labels. Selected swatch gets stronger border.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default SelectShowcase;