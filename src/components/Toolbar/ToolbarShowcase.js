// src/components/Toolbar/ToolbarShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PanToolIcon from '@mui/icons-material/PanTool';
import MicIcon from '@mui/icons-material/Mic';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Toolbar } from './Toolbar';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const ICON_MAP = {
  Undo: <UndoIcon />, Redo: <RedoIcon />, Add: <AddIcon />,
  Bold: <FormatBoldIcon />, Italic: <FormatItalicIcon />,
  Underline: <FormatUnderlinedIcon />, TextColor: <FormatColorTextIcon />,
  Highlight: <FormatColorFillIcon />, Text: <TextFieldsIcon />,
  More: <MoreVertIcon />, Back: <ArrowBackIcon />, Forward: <ArrowForwardIcon />,
  Hand: <PanToolIcon />, Mic: <MicIcon />, Screen: <ScreenShareIcon />,
  Save: <SaveIcon />, Delete: <DeleteIcon />, Edit: <EditIcon />,
  Search: <SearchIcon />, Settings: <SettingsIcon />, Home: <HomeIcon />,
  Star: <StarIcon />, Favorite: <FavoriteIcon />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULT_ICONS = [
  { icon: 'Undo', label: 'Undo' },
  { icon: 'Redo', label: 'Redo' },
  { icon: 'Add', label: 'Add' },
  { icon: 'Text', label: 'Text' },
  { icon: 'More', label: 'More' },
];

const BAR_COLORS = ['default', 'primary', 'primary-light', 'primary-medium', 'primary-dark', 'white', 'black'];
const BAR_LABELS = {
  default: 'Default', primary: 'Primary', 'primary-light': 'Primary Light',
  'primary-medium': 'Primary Medium', 'primary-dark': 'Primary Dark',
  white: 'White', black: 'Black',
};

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

export function ToolbarShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const [toolbarMode, setToolbarMode] = useState('icon');
  const [orientation, setOrientation] = useState('horizontal');
  const [barColor, setBarColor] = useState('default');
  const [showFab, setShowFab] = useState(false);
  const [fabIcon, setFabIcon] = useState('Add');

  // Basic mode
  const [leftLabel, setLeftLabel] = useState('Back');
  const [rightLabel, setRightLabel] = useState('Next');

  // Basic mode is horizontal only
  useEffect(() => {
    if (toolbarMode === 'basic' && orientation === 'vertical') setOrientation('horizontal');
  }, [toolbarMode]);

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [iconCount, setIconCount] = useState(5);
  const [iconConfigs, setIconConfigs] = useState(DEFAULT_ICONS.map((i) => ({ ...i })));

  useEffect(() => {
    setIconConfigs((prev) => {
      const next = [];
      const extras = [
        { icon: 'Bold', label: 'Bold' }, { icon: 'Italic', label: 'Italic' },
        { icon: 'Save', label: 'Save' }, { icon: 'Delete', label: 'Delete' },
        { icon: 'Search', label: 'Search' }, { icon: 'Settings', label: 'Settings' },
      ];
      for (let i = 0; i < iconCount; i++) {
        next.push(prev[i] || extras[i - DEFAULT_ICONS.length] || { icon: ICON_NAMES[i % ICON_NAMES.length], label: ICON_NAMES[i % ICON_NAMES.length] });
      }
      return next;
    });
  }, [iconCount]);

  const updateConfig = (i, field, val) => {
    setIconConfigs((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
  };

  const canShowFab = iconCount <= 4 && toolbarMode === 'icon';

  const items = iconConfigs.slice(0, iconCount).map((cfg) => ({
    icon: ICON_MAP[cfg.icon] || ICON_MAP.Add,
    label: cfg.label,
  }));

  const fabObj = showFab && canShowFab ? {
    icon: ICON_MAP[fabIcon] || ICON_MAP.Add,
    label: fabIcon,
  } : undefined;

  const basicLeft = { label: leftLabel, icon: <ArrowBackIcon /> };
  const basicRight = { label: rightLabel, icon: <ArrowForwardIcon /> };

  const generateCode = () => {
    const parts = [];
    if (toolbarMode !== 'icon') parts.push('mode="' + toolbarMode + '"');
    if (orientation !== 'horizontal') parts.push('orientation="' + orientation + '"');
    if (barColor !== 'default') parts.push('barColor="' + barColor + '"');
    if (toolbarMode === 'icon') {
      parts.push('items={[/* ' + iconCount + ' icon items */]}');
      if (showFab && canShowFab) parts.push('fab={{ icon: <' + fabIcon + 'Icon />, label: "' + fabIcon + '" }}');
    } else {
      parts.push('basicLeft={{ label: "' + leftLabel + '", icon: <ArrowBackIcon /> }}');
      parts.push('basicRight={{ label: "' + rightLabel + '", icon: <ArrowForwardIcon /> }}');
    }
    return '<Toolbar\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Toolbar</H2>
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

              <Toolbar
                key={'tb-' + toolbarMode + '-' + orientation + '-' + barColor + '-' + iconCount + '-' + showFab}
                mode={toolbarMode}
                orientation={orientation}
                barColor={barColor}
                items={items}
                value={selectedIcon}
                onChange={setSelectedIcon}
                fab={fabObj}
                basicLeft={basicLeft}
                basicRight={basicRight}
              />
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
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
                <ControlButton label="Icon" selected={toolbarMode === 'icon'} onClick={() => setToolbarMode('icon')} />
                <ControlButton label="Basic" selected={toolbarMode === 'basic'} onClick={() => setToolbarMode('basic')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {toolbarMode === 'icon' ? 'Icon toggle buttons. Click to select/deselect.' : 'Two action buttons: outlined (left) + solid (right).'}
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Horizontal" selected={orientation === 'horizontal'} onClick={() => setOrientation('horizontal')} />
                <ControlButton label="Vertical" selected={orientation === 'vertical'} onClick={() => setOrientation('vertical')}
                  disabled={toolbarMode === 'basic'} />
              </Stack>
            </Box>

            {/* Bar Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BAR COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {BAR_COLORS.map((bc) => (
                  <ControlButton key={bc} label={BAR_LABELS[bc]} selected={barColor === bc} onClick={() => setBarColor(bc)} />
                ))}
              </Stack>
            </Box>

            {/* FAB — icon mode only, ≤4 items */}
            {toolbarMode === 'icon' && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>FAB Button</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                      {canShowFab ? 'Adds an action button at the end.' : 'Available only with 4 or fewer icon buttons.'}
                    </Caption>
                  </Box>
                  <Switch checked={showFab} onChange={(e) => setShowFab(e.target.checked)} size="small" disabled={!canShowFab} />
                </Box>
                {showFab && canShowFab && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0 }}>Icon</Caption>
                    <SelectInput value={fabIcon} onChange={setFabIcon} options={ICON_NAMES} label="FAB icon" />
                  </Box>
                )}
              </Box>
            )}

            {/* Basic mode inputs */}
            {toolbarMode === 'basic' && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BUTTON LABELS</OverlineSmall>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', width: 60, flexShrink: 0 }}>Left</Caption>
                    <TextInput value={leftLabel} onChange={setLeftLabel} placeholder="Back" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', width: 60, flexShrink: 0 }}>Right</Caption>
                    <TextInput value={rightLabel} onChange={setRightLabel} placeholder="Next" />
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Advanced Settings */}
            {toolbarMode === 'icon' && (
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
                    <Box>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON BUTTONS</OverlineSmall>
                      <NumberStepper label="Count" value={iconCount} onChange={(v) => { setIconCount(v); if (v > 4) setShowFab(false); }} min={2} max={8} />
                    </Box>
                    <Stack spacing={1}>
                      {iconConfigs.slice(0, iconCount).map((cfg, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                          <SelectInput value={cfg.icon} onChange={(val) => updateConfig(i, 'icon', val)} options={ICON_NAMES} label={'Icon ' + (i + 1)} />
                          <TextInput value={cfg.label} onChange={(val) => updateConfig(i, 'label', val)} placeholder="Label" />
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(toolbarMode)} · {cap(orientation)} · {BAR_LABELS[barColor]}{showFab && canShowFab ? ' · FAB' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="toolbar" aria-orientation="' + orientation + '" aria-label="Toolbar"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Icon buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="radio" aria-checked="true|false" aria-label="[action]"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Basic buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Standard button elements with visible text labels. aria-label matches visible text.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible), 2px offset on all interactive elements.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Toolbar surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>data-theme per barColor · data-surface="Surface" · bg: var(--Background)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected icon:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Button) · icon: var(--Buttons-Default-Text) · border: var(--Buttons-Default-Border)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Unselected:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>icon: var(--Text-Quiet)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Basic left (outline):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: transparent · border: var(--Buttons-Default-Border) · text: var(--Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Basic right (solid):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Button) · text: var(--Buttons-Default-Text)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Orientation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Vertical for side panels (drawing tools). Horizontal for top/bottom bars (formatting, navigation).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>FAB:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Only available with 4 or fewer buttons. Keeps toolbar compact. Same tokens as selected state.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Basic mode:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use for simple navigation (Back/Next, Cancel/Save). Left is always outline, right is always solid.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default ToolbarShowcase;
