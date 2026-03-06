// src/components/ButtonGroup/ButtonGroupShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  TextField, Switch, Divider, Tooltip, IconButton as MuiIconButton, Slider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';
import {
  H2, H4, H5, Body, BodySmall, BodyBold, Caption, Label, OverlineSmall
} from '../Typography';

// ─── Contrast Calculator ──────────────────────────────────────────────────────

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

// ─── Contrast Badge ───────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>—</Caption>;
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
        {passes ? '✓ Pass' : '✗ Fail'}
      </Caption>
    </Box>
  );
}

// ─── Accessibility Row ────────────────────────────────────────────────────────

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

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton
        size="small"
        onClick={handleCopy}
        sx={{
          margin: 0,
          color: copied ? '#4ade80' : '#9ca3af',
          '&:hover': { backgroundColor: '#333', color: '#e5e7eb' },
        }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </Tooltip>
  );
}

// ─── Color Swatch Button ──────────────────────────────────────────────────────

function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick, tooltip }) {
  const C = color.charAt(0).toUpperCase() + color.slice(1);
  return (
    <Tooltip title={tooltip || C} arrow>
      <Box
        onClick={() => !isDisabled && onClick(color)}
        role="button"
        aria-label={`Select ${C} color`}
        aria-pressed={selected}
        sx={{
          position: 'relative',
          width: 'var(--Button-Height)',
          height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: `var(--Buttons-${C}-Button)`,
          border: selected
            ? '2px solid var(--Text)'
            : '2px solid transparent',
          outline: selected
            ? '2px solid var(--Focus-Visible)'
            : '2px solid transparent',
          outlineOffset: '1px',
          opacity: isDisabled ? 0.25 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'transform 0.1s ease, outline 0.1s ease',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {},
          '&:focus-visible': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        }}
      >
        {selected && (
          <CheckIcon
            sx={{
              fontSize: 24,
              color: `var(--Buttons-${C}-Text)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Control Button ───────────────────────────────────────────────────────────

function ControlButton({ label, selected, onClick }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': {
          backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)',
        },
        '&:focus-visible': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
      }}
    >
      {label}
    </Box>
  );
}

// ─── Default button labels ───────────────────────────────────────────────────

const TEXT_LABELS = ['One', 'Two', 'Three', 'Four', 'Five'];
const ICON_COMPONENTS = [AddIcon, EditIcon, DeleteIcon, SaveIcon, SendIcon];

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function ButtonGroupShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('primary');
  const [color, setColor] = useState('primary');
  const [contentType, setContentType] = useState('text');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('horizontal');
  const [spacing, setSpacing] = useState(0);
  const [buttonCount, setButtonCount] = useState(3);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  const styles = ['primary', 'outline', 'light', 'ghost'];
  const contentTypes = ['text', 'icon'];

  // Primary style: only primary color. Ghost: no color.
  const effectiveColor = style === 'ghost' ? 'primary'
    : style === 'primary' ? 'primary'
    : color;

  // Map style → Button variant
  const getVariant = () => {
    if (style === 'primary') return 'primary';
    if (style === 'outline') return `${color}-outline`;
    if (style === 'light') return `${color}-light`;
    if (style === 'ghost') return 'ghost';
    return color;
  };

  // Build child buttons for preview
  const renderButtons = () => {
    const buttons = [];
    for (let i = 0; i < buttonCount; i++) {
      if (contentType === 'icon') {
        const IconComp = ICON_COMPONENTS[i % ICON_COMPONENTS.length];
        buttons.push(
          <Button key={i} iconOnly aria-label={TEXT_LABELS[i]}>
            <IconComp aria-hidden="true" alt="" />
          </Button>
        );
      } else {
        buttons.push(
          <Button key={i}>{TEXT_LABELS[i]}</Button>
        );
      }
    }
    return buttons;
  };

  // Build group props
  const getGroupProps = () => ({
    variant: getVariant(),
    size,
    orientation,
    spacing,
    disabled,
    fullWidth,
    'aria-label': 'button group preview',
  });

  // Generate code string
  const generateCode = () => {
    const parts = [`variant="${getVariant()}"`, `size="${size}"`];
    if (orientation === 'vertical') parts.push('orientation="vertical"');
    if (spacing > 0) parts.push(`spacing={${spacing}}`);
    if (disabled) parts.push('disabled');
    if (fullWidth) parts.push('fullWidth');
    parts.push('aria-label="…"');

    const childLines = [];
    for (let i = 0; i < buttonCount; i++) {
      if (contentType === 'icon') {
        childLines.push(`  <Button iconOnly aria-label="${TEXT_LABELS[i]}"><Icon /></Button>`);
      } else {
        childLines.push(`  <Button>${TEXT_LABELS[i]}</Button>`);
      }
    }

    return `<ButtonGroup ${parts.join(' ')}>\n${childLines.join('\n')}\n</ButtonGroup>`;
  };

  // Calculate contrast data for accessibility tab
  useEffect(() => {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const c = cap(effectiveColor);
    const data = {};

    const bg = getCssVar('--Background');
    const focusVisible = getCssVar('--Focus-Visible');

    if (style === 'primary') {
      data.buttonBg = getCssVar(`--Buttons-${c}-Button`);
      data.buttonText = getCssVar(`--Buttons-${c}-Text`);
      data.buttonBorder = getCssVar(`--Buttons-${c}-Border`);
      data.hover = getCssVar(`--Buttons-${c}-Hover`);
      data.active = getCssVar(`--Buttons-${c}-Active`);
    } else if (style === 'outline') {
      data.buttonBg = 'transparent';
      data.buttonText = getCssVar('--Text');
      data.buttonBorder = getCssVar(`--Buttons-${c}-Border`);
      data.hover = getCssVar('--Surface-Dim');
      data.active = getCssVar('--Surface-Dim');
    } else if (style === 'light') {
      data.buttonBg = getCssVar(`--Colors-${c}-Color-11`);
      data.buttonText = getCssVar(`--Text-${c}-Color-11`);
      data.buttonBorder = getCssVar(`--Buttons-${c}-Border`);
      data.hover = getCssVar(`--Hover-${c}-Color-11`);
      data.active = getCssVar(`--Active-${c}-Color-11`);
    }

    data.background = bg;
    data.focusVisible = focusVisible;
    setContrastData(data);
  }, [style, effectiveColor]);

  // Size info
  const sizeDetails = {
    small:  { totalHeight: '32px',  note: '32px total height ✓ WCAG 2.2 AA' },
    medium: { totalHeight: 'calc(var(--Button-Height) + 0px)', note: 'Default design system height' },
    large:  { totalHeight: '64px',  note: '64px total height' },
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Button Group</H2>

      {/* Top-level tabs */}
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

      {/* ── PLAYGROUND TAB ── */}
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
            {/* ButtonGroup preview */}
            <Box sx={{
              mb: 3,
              width: '100%',
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '28px',
            }}>
              <ButtonGroup {...getGroupProps()}>
                {renderButtons()}
              </ButtonGroup>
            </Box>

            {/* Code output */}
            <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{
                backgroundColor: '#1a1a1a',
                borderRadius: 'var(--Style-Border-Radius)',
                overflow: 'hidden',
                minHeight: 100,
              }}>
                <Box sx={{
                  px: 2, py: 0.75,
                  borderBottom: '1px solid #333',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <Caption style={{ color: '#6b7280', fontFamily: 'monospace' }}>JSX</Caption>
                  <CopyButton code={generateCode()} />
                </Box>
                <Box sx={{ p: 2, overflow: 'auto' }}>
                  <Box component="code" sx={{
                    fontFamily: 'monospace', fontSize: '13px',
                    color: '#e5e7eb', whiteSpace: 'pre', display: 'block',
                  }}>
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
              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="flex-start" sx={{ gap: 1 }}>
                {styles.map((s) => (
                  <ControlButton
                    key={s}
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    selected={style === s}
                    onClick={() => {
                      setStyle(s);
                      if (s === 'primary' || s === 'ghost') setColor('primary');
                    }}
                  />
                ))}
              </Stack>
              {style === 'ghost' && (
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                  Ghost buttons use no color selection
                </Caption>
              )}
              {style === 'primary' && (
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                  Primary style only available in primary color
                </Caption>
              )}
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" alignItems="flex-start" sx={{ gap: 1 }}>
                {colors.map((c) => {
                  const isDisabled = style === 'ghost' || (style === 'primary' && c !== 'primary');
                  return (
                    <ColorSwatchButton
                      key={c}
                      color={c}
                      selected={color === c}
                      disabled={isDisabled}
                      onClick={setColor}
                      tooltip={
                        style === 'ghost' ? 'Ghost uses no color'
                        : style === 'primary' ? 'Primary style: primary color only'
                        : undefined
                      }
                    />
                  );
                })}
              </Stack>
            </Box>

            {/* Content type */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="flex-start" sx={{ gap: 1 }}>
                {contentTypes.map((ct) => (
                  <ControlButton
                    key={ct}
                    label={ct.charAt(0).toUpperCase() + ct.slice(1)}
                    selected={contentType === ct}
                    onClick={() => {
                      setContentType(ct);
                      if (ct === 'icon') setFullWidth(false);
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton
                    key={s}
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    selected={size === s}
                    onClick={() => setSize(s)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {['horizontal', 'vertical'].map((o) => (
                  <ControlButton
                    key={o}
                    label={o.charAt(0).toUpperCase() + o.slice(1)}
                    selected={orientation === o}
                    onClick={() => setOrientation(o)}
                  />
                ))}
              </Stack>
            </Box>

            {/* Spacing */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SPACING</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {[0, 0.5, 1, 2].map((s) => (
                  <ControlButton
                    key={s}
                    label={s === 0 ? 'Connected' : `${s}`}
                    selected={spacing === s}
                    onClick={() => setSpacing(s)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {spacing === 0
                  ? 'Borders collapse, only first/last buttons get border radius'
                  : `${spacing * 8}px gap between buttons, all keep full radius`}
              </Caption>
            </Box>

            {/* Button Count */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BUTTONS</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {[2, 3, 4, 5].map((n) => (
                  <ControlButton
                    key={n}
                    label={`${n}`}
                    selected={buttonCount === n}
                    onClick={() => setButtonCount(n)}
                  />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* Toggles */}
            <Stack spacing={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Label>Disabled</Label>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, opacity: contentType === 'icon' ? 0.4 : 1 }}>
                <Label>Full Width</Label>
                <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)} size="small" disabled={contentType === 'icon'} />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* ── ACCESSIBILITY TAB ── */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} · {effectiveColor} · {size} · {orientation}
          </BodySmall>

          {/* Ghost button group accessibility */}
          {style === 'ghost' ? (
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)', mb: 4 }}>
              <H5>Ghost Button Group</H5>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                  <BodyBold style={{ color: 'var(--Tags-Info-Text)' }}>Text treated as Hotlink</BodyBold>
                  <Body style={{ color: 'var(--Tags-Info-Text)', marginTop: 4 }}>
                    Ghost button group children use <code>var(--Hotlink)</code> color and underline in their default state.
                  </Body>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Hover background</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Background-Hover) — solid ripple color, not an overlay</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Active / Focus background</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Background-Active) — solid ripple color</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus-Visible outline</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible), offset 2px — required for keyboard users</Caption>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Stack spacing={4}>
              {/* Icon-Only Group Requirements */}
              {contentType === 'icon' && (
                <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                  <H5>Icon-Only Button Group Accessibility</H5>
                  <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                    Icon button groups have different requirements than text button groups
                  </BodySmall>
                  <Stack spacing={2}>
                    <A11yRow
                      label="Icon Color vs. Background"
                      ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                      threshold={3.1}
                      note="Icon must have ≥ 3:1 contrast to background (lower than text requirement)"
                    />
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                      <BodyBold style={{ color: 'var(--Tags-Info-Text)' }}>Required: aria-label on each button</BodyBold>
                      <Body style={{ color: 'var(--Tags-Info-Text)', marginTop: 4 }}>
                        Each icon-only button MUST have an aria-label describing its action (e.g., aria-label="Bold")
                      </Body>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                      <BodyBold style={{ color: 'var(--Tags-Info-Text)' }}>Icon element attributes</BodyBold>
                      <Body style={{ color: 'var(--Tags-Info-Text)', marginTop: 4 }}>
                        Icon elements inside buttons should have aria-hidden="true" and alt="" to prevent duplicate announcements
                      </Body>
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* Text Button Group Requirements */}
              {contentType === 'text' && (
                <>
                  {/* Contrast to Background */}
                  <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                    <H5>Contrast to Background</H5>
                    <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                      The button border must be distinguishable from the page background
                    </BodySmall>
                    <A11yRow
                      label="Border vs. Background"
                      ratio={getContrast(contrastData.buttonBorder, contrastData.background)}
                      threshold={3.1}
                      note={`var(--Buttons-${effectiveColor.charAt(0).toUpperCase() + effectiveColor.slice(1)}-Border) vs var(--Background) — must be ≥ 3:1 WCAG AA`}
                    />
                  </Box>

                  {/* Text on Button */}
                  <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                    <H5>Text on Button</H5>
                    <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                      Button text must maintain ≥ 4.5:1 contrast in all interactive states
                    </BodySmall>
                    <A11yRow
                      label="Text on Default Background"
                      ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                      threshold={4.5}
                      note="Must be ≥ 4.5:1 WCAG AA"
                    />
                    <A11yRow
                      label="Text on Hover Background"
                      ratio={getContrast(contrastData.buttonText, contrastData.hover)}
                      threshold={4.5}
                      note="Contrast maintained on hover state"
                    />
                    <A11yRow
                      label="Text on Active / Focus Background"
                      ratio={getContrast(contrastData.buttonText, contrastData.active)}
                      threshold={4.5}
                      note="Contrast maintained on active and focus states"
                    />
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                      <Caption style={{ color: 'var(--Tags-Info-Text)' }}>
                        ✓ All button variants are designed to maintain constant 4.5:1 text contrast in all states
                      </Caption>
                    </Box>
                  </Box>
                </>
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
                  note="var(--Focus-Visible) vs var(--Background) — must be ≥ 3:1 WCAG AA · Always 2px solid, 2px offset"
                />
              </Box>

              {/* Group-specific ARIA */}
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>ARIA & Group Requirements</H5>
                <Stack spacing={0}>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Group container:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="group" aria-label="[descriptive label]"</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Each child button:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="button"</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Icons inside buttons:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-hidden="true" alt=""</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Icon-only buttons:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-label="[descriptive action]" required</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Disabled state:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-disabled="true" — does not remove from tab order</Caption>
                  </Box>
                  <Box sx={{ py: 1.5 }}>
                    <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>Tab navigates between buttons in the group sequentially</Caption>
                  </Box>
                </Stack>
              </Box>

              {/* Connected mode accessibility */}
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Connected Mode (spacing=0)</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                  When buttons are visually connected, additional considerations apply
                </BodySmall>
                <Stack spacing={0}>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Border collapse</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Adjacent borders collapse via negative margin (-2px). Hovered/focused buttons get z-index:1 to appear above neighbors.</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Border radius</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Only first and last buttons retain border radius on their outer edges. Middle buttons have 0px radius on all sides.</Caption>
                  </Box>
                  <Box sx={{ py: 1.5 }}>
                    <BodySmall>Focus visibility</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Focus outline (2px solid, 2px offset) renders above adjacent buttons via z-index elevation.</Caption>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ButtonGroupShowcase;