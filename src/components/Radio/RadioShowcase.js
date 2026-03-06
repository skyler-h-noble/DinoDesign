// src/components/Radio/RadioShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  TextField, Switch, Divider, Tooltip, IconButton as MuiIconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Radio, RadioGroup } from './Radio';
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
          outlineOffset: '1px', cursor: 'pointer',
          transition: 'transform 0.1s ease',
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

// --- Playground TextField ----------------------------------------------------

function PlaygroundTextField({ value, onChange, placeholder }) {
  return (
    <TextField
      value={value} onChange={onChange} placeholder={placeholder}
      size="small" fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': { borderColor: 'var(--Border)' },
          '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
        },
      }}
    />
  );
}

// --- Main Showcase -----------------------------------------------------------

export function RadioShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('outline');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [selectedValue, setSelectedValue] = useState('option1');
  const [contrastData, setContrastData] = useState({});

  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  const styles = ['outline', 'light'];

  const options = [
    { label: 'Selected', value: 'option1' },
    { label: 'Unselected', value: 'option2' },
    { label: 'Disabled', value: 'option3', disabled: true },
  ];

  // Map style + color to variant string
  const getVariant = () => {
    return color + '-' + style;
  };

  // Build RadioGroup props for preview
  const getGroupProps = () => ({
    variant: getVariant(),
    size,
    label: 'Select an option',
    options,
    value: selectedValue,
    onChange: (e) => setSelectedValue(e.target.value),
    orientation,
  });

  // Generate code string
  const generateCode = () => {
    const parts = [
      'variant="' + getVariant() + '"',
      'size="' + size + '"',
      'label="Select an option"',
    ];
    if (orientation !== 'vertical') parts.push('orientation="' + orientation + '"');
    const optStr = '{[\n    { label: "Selected", value: "option1" },\n    { label: "Unselected", value: "option2" },\n    { label: "Disabled", value: "option3", disabled: true },\n  ]}';
    return '<RadioGroup\n  ' + parts.join('\n  ') + '\n  options=' + optStr + '\n/>';
  };

  // Calculate contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};
    const bg = getCssVar('--Background');
    const focusVisible = getCssVar('--Focus-Visible');

    if (style === 'outline') {
      data.dot = getCssVar('--Buttons-' + C + '-Border');
      data.border = getCssVar('--Buttons-' + C + '-Border');
      data.radioBg = bg;
    } else if (style === 'light') {
      data.dot = getCssVar('--Text-' + C + '-Color-11');
      data.border = getCssVar('--Buttons-' + C + '-Border');
      data.radioBg = getCssVar('--' + C + '-Color-11');
    }
    data.background = bg;
    data.focusVisible = focusVisible;
    setContrastData(data);
  }, [style, color]);

  const sizeDetails = {
    small:  { boxSize: '16px', dotSize: '8px', touchTarget: '28px', note: '28px touch target via padding' },
    medium: { boxSize: '20px', dotSize: '10px', touchTarget: '32px', note: '32px touch target meets WCAG 2.2 AA' },
    large:  { boxSize: '24px', dotSize: '12px', touchTarget: '40px', note: '40px touch target exceeds WCAG 2.2 AA' },
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Radio</H2>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{
          mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } },
        }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
      {mainTab === 0 && (
        <Grid container spacing={0} sx={{ minHeight: 600, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

          {/* LEFT: Preview */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'var(--Background)',
            borderRight: '1px solid var(--Border)', minHeight: 200, minWidth: 0, overflow: 'hidden',
          }}>
            <Box sx={{ mb: 3, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RadioGroup {...getGroupProps()} />
            </Box>

            {/* Code output */}
            <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: 'var(--Style-Border-Radius)', overflow: 'hidden', minHeight: 60 }}>
                <Box sx={{ px: 2, py: 0.75, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Caption style={{ color: '#6b7280', fontFamily: 'monospace' }}>JSX</Caption>
                  <CopyButton code={generateCode()} />
                </Box>
                <Box sx={{ p: 2, overflow: 'auto' }}>
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                    {generateCode()}
                  </Box>
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

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {colors.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['vertical', 'horizontal'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />
          </Grid>
        </Grid>
      )}

      {/* ACCESSIBILITY TAB */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} · {color} · {size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Radio border contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Radio Border Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The radio circle border must be distinguishable from the page background
              </BodySmall>
              <A11yRow
                label="Border vs. Background"
                ratio={getContrast(contrastData.border, contrastData.background)}
                threshold={3.1}
                note={'var(--Buttons-' + cap(color) + '-Border) vs var(--Background) must be >= 3:1 WCAG AA'}
              />
            </Box>

            {/* Selected dot contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Selected Dot Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The inner dot must be visible against its background when selected
              </BodySmall>
              <A11yRow
                label="Dot vs. Radio Background"
                ratio={getContrast(contrastData.dot, contrastData.radioBg || contrastData.background)}
                threshold={3.1}
                note="Non-text contrast: dot must have >= 3:1 against its background"
              />
              <A11yRow
                label="Dot vs. Page Background"
                ratio={getContrast(contrastData.dot, contrastData.background)}
                threshold={3.1}
                note="Dot visible against the page background (outline variant)"
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
                note="var(--Focus-Visible) vs var(--Background) must be >= 3:1 WCAG AA, 2px solid, 2px offset"
              />
            </Box>

            {/* Touch Target */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Touch / Click Target Area</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Minimum 24x24px for WCAG 2.2 AA. Padding around the radio circle creates the full touch target.
              </BodySmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Radio circle size ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>{sizeDetails[size]?.boxSize}</Caption>
                </Box>
                <Caption style={{ color: 'var(--Tags-Success-Text)', fontWeight: 700 }}>{sizeDetails[size]?.boxSize}</Caption>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Touch target with padding ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>{sizeDetails[size]?.note}</Caption>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', backgroundColor: 'var(--Tags-Success-BG)', color: 'var(--Tags-Success-Text)', fontSize: '11px', fontWeight: 700 }}>
                  {sizeDetails[size]?.touchTarget} Pass
                </Box>
              </Box>
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Label Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>RadioGroup with label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<RadioGroup label="..." /> — FormLabel as legend in fieldset'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>RadioGroup without label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-label="[descriptive text]" required on RadioGroup
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Individual radio with label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<Radio label="..." /> — FormControlLabel provides association'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Tab to group, Arrow keys to move between options, Space to select
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Disabled state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-disabled="true" — opacity 0.6, pointer-events none
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

export default RadioShowcase;
