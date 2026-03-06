// src/components/ToggleButtonGroup/ToggleButtonGroupShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { ToggleButtonGroup, ToggleButton } from './ToggleButtonGroup';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
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

// --- Copy Button -------------------------------------------------------------

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Copy failed:', err); }
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

// --- Color Swatch Button -----------------------------------------------------

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box
        onClick={() => onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          cursor: 'pointer',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

// --- Control Button ----------------------------------------------------------

function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px', fontFamily: 'inherit', fontWeight: 500,
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
      }}
    >
      {label}
    </Box>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function ToggleButtonGroupShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('primary');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [isDisabled, setIsDisabled] = useState(false);
  const [exclusive, setExclusive] = useState(true);
  const [orientation, setOrientation] = useState('horizontal');
  const [alignment, setAlignment] = useState('left');
  const [formats, setFormats] = useState([]);
  const [contrastData, setContrastData] = useState({});

  const styles = ['primary', 'light'];

  // Map style + color to variant string
  const getVariant = () => {
    if (style === 'primary') return 'primary';
    return color + '-' + style;
  };

  // Exclusive handler
  const handleAlignment = (e, newAlignment) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  // Multi-select handler
  const handleFormats = (e, newFormats) => {
    setFormats(newFormats);
  };

  // Code snippet
  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (!exclusive) parts.push('exclusive={false}');
    if (orientation === 'vertical') parts.push('orientation="vertical"');
    if (isDisabled) parts.push('disabled');
    parts.push('aria-label="text formatting"');

    const btns = exclusive
      ? '<ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>\n  <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>\n  <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>'
      : '<ToggleButton value="bold"><FormatBoldIcon /></ToggleButton>\n  <ToggleButton value="italic"><FormatItalicIcon /></ToggleButton>\n  <ToggleButton value="underline"><FormatUnderlinedIcon /></ToggleButton>';

    return '<ToggleButtonGroup ' + parts.join(' ') + '>\n  ' + btns + '\n</ToggleButtonGroup>';
  };

  // Contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};
    const bg = getCssVar('--Background');

    if (style === 'primary') {
      data.buttonBg = null; // transparent
      data.text = getCssVar('--Quiet');
      data.border = getCssVar('--Buttons-Primary-Border');
      data.selectedBg = getCssVar('--Buttons-Primary-Button');
      data.selectedText = getCssVar('--Buttons-Primary-Text');
      data.hover = getCssVar('--Buttons-Primary-Hover');
    } else if (style === 'light') {
      data.buttonBg = null; // transparent
      data.text = getCssVar('--Quiet');
      data.border = getCssVar('--Buttons-' + C + '-Light-Border');
      data.selectedBg = getCssVar('--Buttons-' + C + '-Light-Button');
      data.selectedText = getCssVar('--Buttons-' + C + '-Light-Text');
      data.hover = getCssVar('--Buttons-Primary-Hover');
    }

    data.background = bg;
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [style, color]);

  return (
    <Box sx={{ width: '100%' }}>
      <H2 style={{ marginBottom: 8 }}>ToggleButtonGroup</H2>
      <Body color="quiet" style={{ marginBottom: 24 }}>
        Toggle button group with primary and light variants.
        Primary is a single color; light supports all 8 colors.
      </Body>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ borderBottom: '1px solid var(--Border)', mb: 0 }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* LEFT: Preview + Code */}
          <Grid item sx={{
            width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
          }}>
            {/* Preview */}
            <Box sx={{
              p: 4,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)',
              borderBottom: '1px solid var(--Border)',
            }}>
              {exclusive ? (
                <ToggleButtonGroup
                  variant={getVariant()}
                  size={size}
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  disabled={isDisabled}
                  orientation={orientation}
                  aria-label="text alignment"
                >
                  <ToggleButton value="left"><FormatAlignLeftIcon /></ToggleButton>
                  <ToggleButton value="center"><FormatAlignCenterIcon /></ToggleButton>
                  <ToggleButton value="right"><FormatAlignRightIcon /></ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  variant={getVariant()}
                  size={size}
                  value={formats}
                  onChange={handleFormats}
                  disabled={isDisabled}
                  orientation={orientation}
                  aria-label="text formatting"
                >
                  <ToggleButton value="bold"><FormatBoldIcon /></ToggleButton>
                  <ToggleButton value="italic"><FormatItalicIcon /></ToggleButton>
                  <ToggleButton value="underline"><FormatUnderlinedIcon /></ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, borderBottom: '1px solid #333',
              }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                  {generateCode()}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Controls */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto',
          }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {styles.map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={style === s}
                    onClick={() => setStyle(s)} />
                ))}
              </Stack>
            </Box>

            {/* Color (hidden for primary) */}
            {style !== 'primary' && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            {/* Selection mode */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Exclusive" selected={exclusive} onClick={() => setExclusive(true)} />
                <ControlButton label="Multiple" selected={!exclusive} onClick={() => setExclusive(false)} />
              </Stack>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Horizontal" selected={orientation === 'horizontal'} onClick={() => setOrientation('horizontal')} />
                <ControlButton label="Vertical" selected={orientation === 'vertical'} onClick={() => setOrientation('vertical')} />
              </Stack>
            </Box>

            {/* Disabled */}
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<MuiCheckbox checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />}
                label={<BodySmall>Disabled</BodySmall>}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ACCESSIBILITY TAB */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} · {style !== 'primary' ? color + ' · ' : ''}{size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text contrast — default state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Contrast — Default State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Button text must have ≥ 4.5:1 contrast against its background (WCAG 1.4.3 AA)
              </BodySmall>
              <A11yRow
                label="Text vs. Background"
                ratio={getContrast(contrastData.text, contrastData.buttonBg || contrastData.background)}
                threshold={4.5}
                note={style === 'light'
                  ? 'Text vs light button bg'
                  : 'Text vs page background (transparent button bg)'}
              />
            </Box>

            {/* Text contrast — selected state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Contrast — Selected State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Selected button text must have ≥ 4.5:1 contrast against selected background (WCAG 1.4.3 AA)
              </BodySmall>
              <A11yRow
                label="Selected Text vs. Selected Background"
                ratio={getContrast(contrastData.selectedText, contrastData.selectedBg)}
                threshold={4.5}
                note={style === 'primary'
                  ? 'var(--Buttons-Primary-Text) vs var(--Buttons-Primary-Button)'
                  : 'var(--Buttons-{C}-Light-Text) vs var(--Buttons-{C}-Light-Button)'
                }
              />
            </Box>

            {/* Border contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Border Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Border must have ≥ 3:1 contrast against page background (WCAG 1.4.11)
              </BodySmall>
              <A11yRow
                label="Border vs. Background"
                ratio={getContrast(contrastData.border, contrastData.background)}
                threshold={3.1}
                note="var(--Buttons-{C}-Border) vs var(--Background)"
              />
            </Box>

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
                note="var(--Focus-Visible) vs var(--Background), 2px solid, -2px offset (inset)"
              />
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Keyboard Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Group label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ToggleButtonGroup aria-label="text alignment" />'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Button values:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ToggleButton value="left" /> — each button needs a unique value'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Tab to focus group, Space/Enter to toggle, aria-pressed managed by MUI
                  </Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
