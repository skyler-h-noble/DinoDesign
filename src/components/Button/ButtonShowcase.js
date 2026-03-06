// src/components/Button/ButtonShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Button } from './Button';
import {
  H2, H4, H5, Body, BodySmall, BodyBold, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

/* ─── Contrast helpers ─── */
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
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>—</Caption>;
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
function TouchTargetBadge({ value, passes }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Info-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Info-Text)',
        fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>{value}</Box>
    </Box>
  );
}
function TouchTargetRow({ label, value, passes, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <TouchTargetBadge value={value} passes={passes} />
    </Box>
  );
}

/* ─── Showcase helpers ─── */
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
function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={isDisabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: isDisabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: isDisabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => !isDisabled && onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 32, height: 32, borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: isDisabled ? 'not-allowed' : 'pointer', flexShrink: 0,
          opacity: isDisabled ? 0.25 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {} }}>
        {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)' }} />}
      </Box>
    </Tooltip>
  );
}
function TextInput({ value, onChange, placeholder, label: inputLabel, sx: sxOverride }) {
  return (
    <Box>
      {inputLabel && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>{inputLabel}</Caption>}
      <Box component="input" type="text" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        sx={{
          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
          border: '1px solid var(--Border)', borderRadius: '4px',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
          ...sxOverride,
        }}
      />
    </Box>
  );
}

/* ─── Main Showcase ─── */
export function ButtonShowcase() {
  const [mainTab, setMainTab] = useState(0);

  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('primary');
  const [contentType, setContentType] = useState('text');
  const [size, setSize] = useState('medium');
  const [iconPosition, setIconPosition] = useState('left');
  const [buttonText, setButtonText] = useState('Button');
  const [iconName, setIconName] = useState('Add');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const STYLES = ['solid', 'outline', 'light', 'ghost'];
  const CONTENT_TYPES = ['text', 'number', 'letter', 'icon', 'avatar', 'swatch'];

  const isGhost = style === 'ghost';
  const effectiveColor = isGhost ? 'primary' : color;
  const noColorPicker = isGhost;

  const getVariant = () => {
    if (style === 'solid') return effectiveColor;
    if (style === 'outline') return effectiveColor + '-outline';
    if (style === 'light') return effectiveColor + '-light';
    if (style === 'ghost') return 'ghost';
    return effectiveColor;
  };

  const getIconComponent = () => {
    const IconComp = MuiIcons[iconName] || MuiIcons['Add'];
    return <IconComp aria-hidden="true" alt="" fontSize="small" />;
  };

  const getButtonProps = () => {
    const p = { variant: getVariant(), size, disabled, fullWidth };

    if (contentType === 'icon') {
      p.iconOnly = true;
      p.children = getIconComponent();
      return p;
    }
    if (contentType === 'avatar') {
      p.avatar = true;
      p.children = buttonText ? buttonText.charAt(0).toUpperCase() : 'A';
      return p;
    }
    if (contentType === 'swatch') {
      p.swatch = true;
      return p;
    }
    if (contentType === 'letter' || contentType === 'number') {
      p.letterNumber = true;
      p.children = buttonText || (contentType === 'letter' ? 'A' : '1');
      return p;
    }
    // Text
    p.children = loading ? 'Loading...' : (buttonText || 'Button');
    if (iconPosition === 'left' && iconName) p.startIcon = getIconComponent();
    if (iconPosition === 'right' && iconName) p.endIcon = getIconComponent();
    return p;
  };

  const generateCode = () => {
    const p = getButtonProps();
    const parts = ['variant="' + p.variant + '"', 'size="' + p.size + '"'];
    if (p.iconOnly) parts.push('iconOnly');
    if (p.letterNumber) parts.push('letterNumber');
    if (p.avatar) parts.push('avatar');
    if (p.swatch) parts.push('swatch');
    if (p.disabled) parts.push('disabled');
    if (p.fullWidth) parts.push('fullWidth');
    if (p.startIcon) parts.push('startIcon={<' + iconName + 'Icon />}');
    if (p.endIcon) parts.push('endIcon={<' + iconName + 'Icon />}');
    const children = typeof p.children === 'string' ? p.children : '';
    return '<Button ' + parts.join(' ') + '>' + children + '</Button>';
  };

  useEffect(() => {
    const c = cap(effectiveColor);
    const data = {};
    const bg = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    data.background = bg;

    if (style === 'solid') {
      data.buttonBg = getCssVar('--Buttons-' + c + '-Button');
      data.buttonText = getCssVar('--Buttons-' + c + '-Text');
      data.buttonBorder = getCssVar('--Buttons-' + c + '-Border');
      data.hover = getCssVar('--Buttons-' + c + '-Hover');
      data.active = getCssVar('--Buttons-' + c + '-Active');
    } else if (style === 'outline') {
      data.buttonBg = 'transparent';
      data.buttonText = getCssVar('--Text');
      data.buttonBorder = getCssVar('--Buttons-' + c + '-Border');
      data.hover = getCssVar('--Surface-Dim');
      data.active = getCssVar('--Surface-Dim');
    } else if (style === 'light') {
      data.buttonBg = getCssVar('--' + c + '-Color-11');
      data.buttonText = getCssVar('--Text-' + c + '-Color-11');
      data.buttonBorder = getCssVar('--Buttons-' + c + '-Border');
      data.hover = getCssVar('--Hover-' + c + '-Color-11');
      data.active = getCssVar('--Active-' + c + '-Color-11');
    }
    setContrastData(data);
  }, [style, effectiveColor]);

  const sizeDetails = {
    small: { totalHeight: '32px', note: '32px — meets WCAG 2.2 AA minimum.' },
    medium: { totalHeight: 'var(--Button-Height)', note: 'Default design system height.' },
    large: { totalHeight: '64px', note: '64px — touch-friendly.' },
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Buttons</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* ── PLAYGROUND ── */}
      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>
              <Button {...getButtonProps()} />
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre-wrap', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {STYLES.map((s) => {
                  const ghostDisabled = s === 'ghost' && (contentType === 'avatar' || contentType === 'swatch');
                  return (
                    <ControlButton key={s} label={cap(s)} selected={style === s} disabled={ghostDisabled}
                      onClick={() => { setStyle(s); if (s === 'ghost') setColor('primary'); }} />
                  );
                })}
              </Stack>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} disabled={noColorPicker} onClick={setColor} />
                ))}
              </Stack>
            </Box>

            {/* Content type */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT TYPE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {CONTENT_TYPES.map((ct) => (
                  <ControlButton key={ct} label={cap(ct)} selected={contentType === ct}
                    onClick={() => {
                      setContentType(ct);
                      if (ct === 'number') setButtonText('1');
                      else if (ct === 'letter') setButtonText('A');
                      else if (ct === 'text') setButtonText('Button');
                      if ((ct === 'avatar' || ct === 'swatch') && style === 'ghost') setStyle('solid');
                      if (['icon', 'letter', 'number', 'avatar', 'swatch'].includes(ct)) setFullWidth(false);
                    }} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {contentType === 'swatch' ? 'Square color block — use with Tooltip for labels.' :
                 contentType === 'icon' ? 'Icon only — requires aria-label.' :
                 contentType === 'avatar' ? 'Circular with initial letter.' :
                 contentType === 'letter' || contentType === 'number' ? 'Single character in square button.' :
                 'Text label with optional icon.'}
              </Caption>
            </Box>

            {/* Text input (text, letter, number, avatar) */}
            {['text', 'letter', 'number', 'avatar'].includes(contentType) && (
              <Box sx={{ mt: 2 }}>
                <TextInput
                  label={contentType === 'text' ? 'Button Text' : contentType === 'avatar' ? 'Initial' : cap(contentType)}
                  value={buttonText}
                  onChange={setButtonText}
                  placeholder={contentType === 'text' ? 'Button' : contentType === 'letter' ? 'A' : '1'}
                />
              </Box>
            )}

            {/* Icon position (text only) */}
            {contentType === 'text' && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON POSITION</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {[['none', 'None'], ['left', 'Left'], ['right', 'Right']].map(([val, lbl]) => (
                    <ControlButton key={val} label={lbl} selected={iconPosition === val}
                      onClick={() => setIconPosition(val)} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Icon name (icon content or text with icon) */}
            {(contentType === 'icon' || (contentType === 'text' && iconPosition !== 'none')) && (
              <Box sx={{ mt: 2 }}>
                <TextInput
                  label="Icon Name"
                  value={iconName}
                  onChange={setIconName}
                  placeholder="Add"
                />
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                  {'MUI icon name (e.g. Add, Edit, Delete, Save, Send, Star).'}
                </Caption>
              </Box>
            )}

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Toggles */}
            <Box sx={{ mt: 3, borderTop: '1px solid var(--Border)', pt: 2 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Label>Disabled</Label>
                  <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Label>Loading</Label>
                  <Switch checked={loading} onChange={(e) => setLoading(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5,
                  opacity: ['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType) ? 0.4 : 1 }}>
                  <Label>Full Width</Label>
                  <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)} size="small"
                    disabled={['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType)} />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ── ACCESSIBILITY ── */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(style)} · {cap(effectiveColor)} · {cap(size)} · {cap(contentType)}
          </BodySmall>

          {isGhost ? (
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)', mb: 4 }}>
              <H5>Ghost Buttons — Hotlink Style</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Default state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Text uses var(--Hotlink) color, underlined for affordance.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Hover/focus/active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Underline removed. Background: var(--Background-Hover) / var(--Background-Active).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Icons in ghost:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use var(--Hotlink) color. No underline. aria-hidden="true" alt="" required.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus ring:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible), offset 2px.</Caption>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Stack spacing={4}>
              {/* Icon/Avatar/Swatch specific */}
              {['icon', 'avatar', 'swatch'].includes(contentType) && (
                <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                  <H5>{contentType === 'swatch' ? 'Swatch' : contentType === 'avatar' ? 'Avatar' : 'Icon-Only'} Accessibility</H5>
                  <Stack spacing={0}>
                    <A11yRow
                      label="Icon/content vs. background"
                      ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                      threshold={3.0}
                      note={'Non-text elements: ≥ 3:1 contrast (WCAG 1.4.11).'}
                    />
                    <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                      <BodySmall>aria-label required:</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)' }}>
                        {contentType === 'swatch'
                          ? 'Describe the color or action, e.g. aria-label="Select Primary". Wrap in Tooltip for visual label.'
                          : 'Describe the action, e.g. aria-label="Delete item".'}
                      </Caption>
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* Text/Letter/Number */}
              {['text', 'letter', 'number'].includes(contentType) && (
                <>
                  <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                    <H5>Border vs. Page</H5>
                    <A11yRow
                      label="Border vs. background"
                      ratio={getContrast(contrastData.buttonBorder, contrastData.background)}
                      threshold={3.0}
                      note={'Button must be distinguishable from page (≥ 3:1 WCAG 1.4.11).'}
                    />
                  </Box>
                  <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                    <H5>Text on Button</H5>
                    <A11yRow label="Text on default bg"
                      ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                      threshold={4.5} note="≥ 4.5:1 WCAG 1.4.3." />
                    <A11yRow label="Text on hover bg"
                      ratio={getContrast(contrastData.buttonText, contrastData.hover)}
                      threshold={4.5} note="Maintained on hover." />
                    <A11yRow label="Text on active bg"
                      ratio={getContrast(contrastData.buttonText, contrastData.active)}
                      threshold={4.5} note="Maintained on active/focus." />
                  </Box>
                </>
              )}

              {/* Focus — all types */}
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Focus Indicator</H5>
                <A11yRow label="Focus ring vs. background"
                  ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                  threshold={3.0} note="2px solid var(--Focus-Visible), 2px offset. ≥ 3:1 WCAG 1.4.11." />
              </Box>

              {/* Touch target */}
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Touch Target</H5>
                <TouchTargetRow label={'Height (' + size + ')'} value={sizeDetails[size]?.totalHeight} passes={true} note={sizeDetails[size]?.note} />
              </Box>

              {/* ARIA */}
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>ARIA Requirements</H5>
                <Stack spacing={0}>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Role:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="button"</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Icons inside buttons:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-hidden="true" alt=""</Caption>
                  </Box>
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Icon-only / swatch / avatar:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-label="[action]" required</Caption>
                  </Box>
                  <Box sx={{ py: 1.5 }}>
                    <BodySmall>Disabled:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Opacity 0.6, cursor: not-allowed, pointerEvents: none.</Caption>
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

export default ButtonShowcase;