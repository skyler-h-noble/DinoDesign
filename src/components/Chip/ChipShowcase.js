// src/components/Chip/ChipShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, TextField, Divider,
  Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel,
  Avatar as MuiAvatar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import * as MuiIcons from '@mui/icons-material';
import { Chip } from './Chip';
import {
  H2, H4, H5, Body, BodySmall, BodyBold, Caption, Label, OverlineSmall
} from '../Typography';

// --- Contrast Calculator -----------------------------------------------------

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
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// --- Contrast Badge ----------------------------------------------------------

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700,
      }}>
        {ratio}:1
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

// --- Accessibility Row -------------------------------------------------------

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)',
    }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}

// --- Touch Target Badge ------------------------------------------------------

function TouchTargetBadge({ value, passes }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Info-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Info-Text)',
        fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
      }}>
        {value}
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Info-Text)' }}>
        {passes ? 'Pass' : '>= 24px'}
      </Caption>
    </Box>
  );
}

function TouchTargetRow({ label, value, passes, note }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)',
    }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <TouchTargetBadge value={value} passes={passes} />
    </Box>
  );
}

// --- Copy Button -------------------------------------------------------------

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton
        size="small" onClick={handleCopy}
        sx={{ color: copied ? '#4ade80' : '#9ca3af', '&:hover': { backgroundColor: '#333', color: '#e5e7eb' } }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </Tooltip>
  );
}

// --- Color Swatch Button -----------------------------------------------------

function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick, tooltip }) {
  const C = cap(color);
  return (
    <Tooltip title={tooltip || C} arrow>
      <Box
        onClick={() => !isDisabled && onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          position: 'relative',
          width: 'var(--Button-Height)',
          height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px',
          opacity: isDisabled ? 0.25 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'transform 0.1s ease, outline 0.1s ease',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {},
          '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}
      >
        {selected && (
          <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />
        )}
      </Box>
    </Tooltip>
  );
}

// --- Control Button ----------------------------------------------------------

function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box
      component="button"
      onClick={() => !isDisabled && onClick()}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        opacity: isDisabled ? 0.4 : 1,
        padding: '4px 12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': !isDisabled ? {
          backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)',
        } : {},
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
      }}
    >
      {label}
    </Box>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function ChipShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [chipText, setChipText] = useState('Chip');
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [selected, setSelected] = useState(false);

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDecType, setStartDecType] = useState('none');   // none | icon | avatar
  const [endDecType, setEndDecType] = useState('none');
  const [startIconName, setStartIconName] = useState('Face');
  const [endIconName, setEndIconName] = useState('Check');
  const [selectionMode, setSelectionMode] = useState('none');  // none | radio | checkbox

  const [contrastData, setContrastData] = useState({});

  // Map style -> variant string
  const getVariant = () => {
    if (style === 'solid') return color;
    if (style === 'outline') return color + '-outline';
    if (style === 'light') return color + '-light';
    return color;
  };

  // Build icon component
  const getIcon = (name) => {
    const IconComp = MuiIcons[name] || MuiIcons['Face'];
    return <IconComp aria-hidden="true" alt="" fontSize="small" />;
  };

  // Build chip props
  const getChipProps = () => {
    const p = {
      variant: getVariant(),
      size,
      label: chipText || 'Chip',
      disabled,
      clickable,
      selected,
    };

    if (selectionMode !== 'none') {
      p.selectionMode = selectionMode;
      p.clickable = true;
      p.onClick = () => setSelected(!selected);
    } else if (clickable) {
      p.onClick = () => {};
    }

    if (deletable) {
      p.onDelete = () => {};
    }

    if (startDecType === 'icon') {
      p.startDecorator = getIcon(startIconName);
    } else if (startDecType === 'avatar') {
      p.startDecorator = <MuiAvatar sx={{ width: 20, height: 20, fontSize: 11 }}>A</MuiAvatar>;
    }

    if (endDecType === 'icon') {
      p.endDecorator = getIcon(endIconName);
    } else if (endDecType === 'avatar') {
      p.endDecorator = <MuiAvatar sx={{ width: 20, height: 20, fontSize: 11 }}>B</MuiAvatar>;
    }

    return p;
  };

  // Generate code string
  const generateCode = () => {
    const p = getChipProps();
    const parts = ['variant="' + p.variant + '"', 'size="' + (deletable ? 'large' : size) + '"'];
    parts.push('label="' + (chipText || 'Chip') + '"');
    if (p.clickable || p.onClick) parts.push('clickable');
    if (p.disabled) parts.push('disabled');
    if (p.selected) parts.push('selected');
    if (p.selectionMode) parts.push('selectionMode="' + p.selectionMode + '"');
    if (p.onDelete) parts.push('onDelete={() => {}}');
    if (startDecType === 'icon') parts.push('startDecorator={<' + startIconName + 'Icon />}');
    if (startDecType === 'avatar') parts.push('startDecorator={<Avatar>A</Avatar>}');
    if (endDecType === 'icon') parts.push('endDecorator={<' + endIconName + 'Icon />}');
    if (endDecType === 'avatar') parts.push('endDecorator={<Avatar>B</Avatar>}');
    return '<Chip ' + parts.join(' ') + ' />';
  };

  // Contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};

    if (style === 'solid' || style === 'light') {
      data.chipBg = getCssVar('--Buttons-' + C + '-Button');
      data.chipText = getCssVar('--Buttons-' + C + '-Text');
      data.chipBorder = style === 'light' ? getCssVar('--Buttons-' + C + '-Border') : null;
      data.hover = getCssVar('--Buttons-' + C + '-Hover');
      data.active = getCssVar('--Buttons-' + C + '-Active');
    } else if (style === 'outline') {
      data.chipBg = getCssVar('--Background');
      data.chipText = getCssVar('--Text');
      data.chipBorder = getCssVar('--Buttons-' + C + '-Border');
      data.hover = getCssVar('--Surface-Dim');
      data.active = getCssVar('--Surface-Dim');
    }

    data.background = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [style, color]);

  const sizeDetails = {
    small:  { height: '24px', touchTarget: '24px', note: '24px visual = 24px touch target' },
    medium: { height: '32px', touchTarget: '32px', note: '32px height, meets WCAG 2.2 AA' },
    large:  { height: '40px', touchTarget: '40px', note: '40px height, required for deletable chips' },
  };

  const effectiveSize = deletable ? 'large' : size;

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Chips</H2>

      <Tabs
        value={mainTab}
        onChange={(e, v) => setMainTab(v)}
        sx={{
          mt: 3, mb: 0,
          borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } },
        }}
      >
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* == PLAYGROUND TAB == */}
      {mainTab === 0 && (
        <Grid container spacing={0} sx={{ minHeight: 600 }}>

          {/* LEFT: Preview */}
          <Grid item xs={12} md={7} sx={{
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'var(--Background)',
            borderRight: '1px solid var(--Border)', minHeight: 200,
          }}>
            {/* Chip preview */}
            <Box sx={{ mb: 3, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chip {...getChipProps()} />
            </Box>

            {/* Size forced notice */}
            {deletable && size !== 'large' && (
              <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1, textAlign: 'center' }}>
                <Caption style={{ color: 'var(--Tags-Info-Text)' }}>
                  Size forced to Large -- delete button requires 24x24 touch target
                </Caption>
              </Box>
            )}

            {/* Code output */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{
                backgroundColor: '#1a1a1a',
                borderRadius: 'var(--Style-Border-Radius)',
                overflow: 'hidden',
                minHeight: 80,
              }}>
                <Box sx={{
                  px: 2, py: 0.75,
                  borderBottom: '1px solid #333',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <Caption style={{ color: '#6b7280', fontFamily: 'monospace' }}>JSX</Caption>
                  <CopyButton code={generateCode()} />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box component="code" sx={{
                    fontFamily: 'monospace', fontSize: '13px',
                    color: '#e5e7eb', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'block',
                  }}>
                    {generateCode()}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Controls */}
          <Grid item xs={12} md={5} sx={{ p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {['solid', 'outline', 'light'].map((s) => (
                  <ControlButton
                    key={s}
                    label={cap(s)}
                    selected={style === s}
                    onClick={() => setStyle(s)}
                  />
                ))}
              </Stack>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton
                    key={c}
                    color={c}
                    selected={color === c}
                    onClick={setColor}
                  />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton
                    key={s}
                    label={cap(s)}
                    selected={size === s}
                    onClick={() => setSize(s)}
                    disabled={deletable && s !== 'large'}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {deletable
                  ? 'Deletable chips require Large size (24x24 delete target)'
                  : sizeDetails[size]?.note
                }
              </Caption>
            </Box>

            {/* Chip text */}
            <Box sx={{ mt: 3 }}>
              <TextField
                label="Chip Text"
                value={chipText}
                onChange={(e) => setChipText(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--Text)',
                    '& fieldset': { borderColor: 'var(--Border)' },
                    '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', '&.Mui-focused': { color: 'var(--Text)' } },
                }}
              />
            </Box>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* Toggles */}
            <Stack spacing={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Label>Clickable</Label>
                <Switch checked={clickable} onChange={(e) => setClickable(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Label>Disabled</Label>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Label>Deletable</Label>
                <Switch
                  checked={deletable}
                  onChange={(e) => {
                    setDeletable(e.target.checked);
                    // Force large when deletable
                    if (e.target.checked) setSize('large');
                  }}
                  size="small"
                />
              </Box>
              {deletable && (
                <Caption style={{ color: 'var(--Tags-Info-Text)', display: 'block', marginTop: 2 }}>
                  Delete button must be 24x24px, chip forced to Large
                </Caption>
              )}
            </Stack>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* Advanced Settings Toggle */}
            <Box
              component="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--Text)',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {showAdvanced ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              Advanced Settings
            </Box>

            {showAdvanced && (
              <Box sx={{ mt: 2 }}>
                {/* Start Decorator */}
                <Box sx={{ mt: 2 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START DECORATOR</OverlineSmall>
                  <Stack direction="row" spacing={1} sx={{ gap: 1 }}>
                    {['none', 'icon', 'avatar'].map((t) => (
                      <ControlButton
                        key={t}
                        label={cap(t)}
                        selected={startDecType === t}
                        onClick={() => setStartDecType(t)}
                      />
                    ))}
                  </Stack>
                  {startDecType === 'icon' && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Icon Name"
                        value={startIconName}
                        onChange={(e) => setStartIconName(e.target.value)}
                        size="small"
                        fullWidth
                        helperText="e.g. Face, Star, Check, Close, Info"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'var(--Text)',
                            '& fieldset': { borderColor: 'var(--Border)' },
                            '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                            '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                          },
                          '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', '&.Mui-focused': { color: 'var(--Text)' } },
                          '& .MuiFormHelperText-root': { color: 'var(--Text-Quiet)' },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* End Decorator */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>END DECORATOR</OverlineSmall>
                  <Stack direction="row" spacing={1} sx={{ gap: 1 }}>
                    {['none', 'icon', 'avatar'].map((t) => (
                      <ControlButton
                        key={t}
                        label={cap(t)}
                        selected={endDecType === t}
                        onClick={() => setEndDecType(t)}
                      />
                    ))}
                  </Stack>
                  {endDecType === 'icon' && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Icon Name"
                        value={endIconName}
                        onChange={(e) => setEndIconName(e.target.value)}
                        size="small"
                        fullWidth
                        helperText="e.g. Check, Close, ArrowDropDown"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'var(--Text)',
                            '& fieldset': { borderColor: 'var(--Border)' },
                            '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                            '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                          },
                          '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', '&.Mui-focused': { color: 'var(--Text)' } },
                          '& .MuiFormHelperText-root': { color: 'var(--Text-Quiet)' },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

                {/* Selection Mode */}
                <Box sx={{ mt: 2 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION MODE</OverlineSmall>
                  <Stack direction="row" spacing={1} sx={{ gap: 1 }}>
                    {['none', 'radio', 'checkbox'].map((m) => (
                      <ControlButton
                        key={m}
                        label={cap(m)}
                        selected={selectionMode === m}
                        onClick={() => {
                          setSelectionMode(m);
                          if (m !== 'none') setClickable(true);
                          setSelected(false);
                        }}
                      />
                    ))}
                  </Stack>
                  {selectionMode !== 'none' && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Label>Selected</Label>
                      <Switch checked={selected} onChange={(e) => setSelected(e.target.checked)} size="small" />
                    </Box>
                  )}
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>
                    {selectionMode === 'radio'
                      ? 'Radio: single selection in a group. Adds role="radio" and aria-checked.'
                      : selectionMode === 'checkbox'
                        ? 'Checkbox: multiple selection. Adds role="checkbox" and aria-checked.'
                        : 'No selection behavior.'
                    }
                  </Caption>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY TAB == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} / {color} / {effectiveSize}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Chip label must maintain >= 4.5:1 contrast against its background
              </BodySmall>
              <A11yRow
                label="Label on Chip Background"
                ratio={getContrast(
                  contrastData.chipText,
                  style === 'outline' ? contrastData.background : contrastData.chipBg
                )}
                threshold={4.5}
                note={style === 'outline'
                  ? 'var(--Text) vs var(--Background)'
                  : 'var(--Buttons-' + cap(color) + '-Text) vs var(--Buttons-' + cap(color) + '-Button)'
                }
              />
              {clickable && (
                <>
                  <A11yRow
                    label="Label on Hover Background"
                    ratio={getContrast(contrastData.chipText, contrastData.hover)}
                    threshold={4.5}
                    note="Contrast maintained in hover state"
                  />
                  <A11yRow
                    label="Label on Active Background"
                    ratio={getContrast(contrastData.chipText, contrastData.active)}
                    threshold={4.5}
                    note="Contrast maintained in active state"
                  />
                </>
              )}
            </Box>

            {/* Chip Visibility */}
            {style !== 'solid' && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Chip Visibility</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                  Chip border must be distinguishable from page background (WCAG 1.4.11)
                </BodySmall>
                <A11yRow
                  label="Border vs. Page Background"
                  ratio={getContrast(contrastData.chipBorder, contrastData.background)}
                  threshold={3.1}
                  note={'var(--Buttons-' + cap(color) + '-Border) vs var(--Background) -- must be >= 3:1'}
                />
              </Box>
            )}

            {/* Focus Visible */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Focus-Visible Indicator</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Focus ring must be visible to keyboard users
              </BodySmall>
              <A11yRow
                label="Focus-Visible outline vs. Background"
                ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                threshold={3.1}
                note="var(--Focus-Visible) vs var(--Background) -- must be >= 3:1 WCAG AA. Always 2px solid, 2px offset."
              />
            </Box>

            {/* Touch Target */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Touch / Click Target Area</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Minimum 24x24px for WCAG 2.2 AA. Small chips use ::after pseudo-element to ensure 24x24 touch area.
              </BodySmall>
              <TouchTargetRow
                label={'Chip height (' + effectiveSize + ')'}
                value={sizeDetails[effectiveSize]?.height}
                passes={true}
                note={sizeDetails[effectiveSize]?.note}
              />
              {effectiveSize === 'small' && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                  <Caption style={{ color: 'var(--Tags-Info-Text)' }}>
                    Small chips are visually 24px but maintain a 24x24px touch target via ::after pseudo-element, meeting WCAG 2.2 AA requirements.
                  </Caption>
                </Box>
              )}
              {deletable && (
                <Box sx={{ mt: 2 }}>
                  <TouchTargetRow
                    label="Delete button target"
                    value="24x24px"
                    passes={true}
                    note="Delete button is always 24x24, requiring the chip to be Large size"
                  />
                </Box>
              )}
            </Box>

            {/* Selection ARIA */}
            {selectionMode !== 'none' && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Selection Mode: {cap(selectionMode)}</H5>
                <Stack spacing={0}>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Role:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      role="{selectionMode}"
                    </Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Checked state:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      aria-checked="{selected ? 'true' : 'false'}"
                    </Caption>
                  </Box>
                  <Box sx={{ py: 1.5 }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Visual indicator:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>
                      2px solid outline ring around chip when selected, using var(--Buttons-Primary-Button)
                    </Caption>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Deletable ARIA */}
            {deletable && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Delete Button Accessibility</H5>
                <Stack spacing={0}>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Delete button has its own focus stop</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>
                      Keyboard users can Tab to the delete button independently
                    </Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Keyboard triggers</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      Enter, Backspace, Delete keys fire onDelete
                    </Caption>
                  </Box>
                  <Box sx={{ py: 1.5 }}>
                    <BodySmall>ARIA label</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      aria-label="Remove" on delete button
                    </Caption>
                  </Box>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default ChipShowcase;
