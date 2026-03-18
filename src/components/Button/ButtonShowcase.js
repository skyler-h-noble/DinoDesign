// src/components/Button/ButtonShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Button } from './Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const STYLES = ['solid', 'outline', 'ghost'];
const CONTENT_TYPES = ['text', 'number', 'letter', 'icon', 'avatar', 'swatch'];

/* ── Contrast helpers ── */
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
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>{ratio}:1</Box>
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
    <Button iconOnly variant="ghost" size="small" onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'} title={copied ? 'Copied!' : 'Copy code'}
      sx={{ color: copied ? '#4ade80' : '#9ca3af' }}>
      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
    </Button>
  );
}

function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Button
      variant={selected ? 'primary' : 'primary-outline'}
      size="small"
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </Button>
  );
}

function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick, isOutlineMode }) {
  const C = cap(color);
  return (
    <Box
      component="button"
      onClick={() => !isDisabled && onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: isOutlineMode ? 'transparent' : 'var(--Buttons-' + C + '-Button)',
        border: isOutlineMode
          ? (selected ? '2px solid var(--Text)' : '2px solid var(--Buttons-' + C + '-Border)')
          : (selected ? '2px solid var(--Text)' : '2px solid transparent'),
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: isDisabled ? 'not-allowed' : 'pointer', flexShrink: 0,
        opacity: isDisabled ? 0.25 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease',
        '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {},
      }}>
      {selected && (
        <CheckIcon sx={{
          fontSize: 16,
          color: isOutlineMode ? 'var(--Buttons-' + C + '-Border)' : 'var(--Buttons-' + C + '-Text)',
          pointerEvents: 'none',
        }} />
      )}
    </Box>
  );
}

function TextInput({ value, onChange, placeholder, label: inputLabel }) {
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
        }}
      />
    </Box>
  );
}

/* ── Main Showcase ── */
export function ButtonShowcase() {
  const [style, setStyle]               = useState('solid');
  const [color, setColor]               = useState('default');
  const [contentType, setContentType]   = useState('text');
  const [size, setSize]                 = useState('medium');
  const [iconPosition, setIconPosition] = useState('left');
  const [buttonText, setButtonText]     = useState('Button');
  const [iconName, setIconName]         = useState('Add');
  const [disabled, setDisabled]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fullWidth, setFullWidth]       = useState(false);
  const [contrastData, setContrastData] = useState({});
  const [bgTheme, setBgTheme]           = useState(null);

  const isGhost = style === 'ghost';
  const effectiveColor = isGhost ? 'primary' : color;
  const noColorPicker = isGhost;

  const sizeDetails = {
    small:  { totalHeight: '32px',              note: '32px — meets WCAG 2.2 AA minimum.' },
    medium: { totalHeight: 'var(--Button-Height)', note: 'Default design system height.' },
    large:  { totalHeight: '64px',              note: '64px — touch-friendly.' },
  };

  const getVariant = () => {
    if (style === 'solid')   return effectiveColor;
    if (style === 'outline') return effectiveColor + '-outline';
    if (style === 'ghost')   return 'ghost';
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
    p.children = loading ? 'Loading...' : (buttonText || 'Button');
    if (iconPosition === 'left'  && iconName) p.startIcon = getIconComponent();
    if (iconPosition === 'right' && iconName) p.endIcon   = getIconComponent();
    return p;
  };

  const generateCode = () => {
    const p = getButtonProps();
    const parts = ['variant="' + p.variant + '"', 'size="' + p.size + '"'];
    if (p.iconOnly)    parts.push('iconOnly');
    if (p.letterNumber) parts.push('letterNumber');
    if (p.avatar)      parts.push('avatar');
    if (p.swatch)      parts.push('swatch');
    if (p.disabled)    parts.push('disabled');
    if (p.fullWidth)   parts.push('fullWidth');
    if (p.startIcon)   parts.push('startIcon={<' + iconName + 'Icon />}');
    if (p.endIcon)     parts.push('endIcon={<' + iconName + 'Icon />}');
    const children = typeof p.children === 'string' ? p.children : '';
    return '<Button ' + parts.join(' ') + '>' + children + '</Button>';
  };

  useEffect(() => {
    const C = cap(effectiveColor);
    const data = {};
    data.background   = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    if (style === 'solid') {
      data.buttonBg     = getCssVar('--Buttons-' + C + '-Button');
      data.buttonText   = getCssVar('--Buttons-' + C + '-Text');
      data.buttonBorder = getCssVar('--Buttons-' + C + '-Border');
      data.hover        = getCssVar('--Buttons-' + C + '-Hover');
      data.active       = getCssVar('--Buttons-' + C + '-Active');
    } else if (style === 'outline') {
      data.buttonBg     = 'transparent';
      data.buttonText   = getCssVar('--Text');
      data.buttonBorder = getCssVar('--Buttons-' + C + '-Border');
      data.hover        = getCssVar('--Surface-Dim');
      data.active       = getCssVar('--Surface-Dim');
    }
    setContrastData(data);
  }, [style, effectiveColor]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Buttons</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Button {...getButtonProps()} />
          </PreviewSurface>

          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>

            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker value={bgTheme} onChange={setBgTheme} />
                  </Box>

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {STYLES.map((s) => {
                        const ghostDisabled = s === 'ghost' && (contentType === 'avatar' || contentType === 'swatch');
                        return (
                          <ControlButton key={s} label={cap(s)} selected={style === s} disabled={ghostDisabled}
                            onClick={() => { setStyle(s); if (s === 'ghost') setColor('default'); }} />
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {COLORS.map((c) => (
                        <ColorSwatchButton key={c} color={c} selected={color === c}
                          disabled={noColorPicker} onClick={setColor} isOutlineMode={style === 'outline'} />
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
                      {contentType === 'swatch'  ? 'Square color block — use with Tooltip for labels.' :
                       contentType === 'icon'    ? 'Icon only — requires aria-label.' :
                       contentType === 'avatar'  ? 'Circular with initial letter.' :
                       contentType === 'letter' || contentType === 'number' ? 'Single character in square button.' :
                       'Text label with optional icon.'}
                    </Caption>
                  </Box>

                  {/* Button text input */}
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
                      <Stack direction="row" spacing={1}>
                        {[['none', 'None'], ['left', 'Left'], ['right', 'Right']].map(([val, lbl]) => (
                          <ControlButton key={val} label={lbl} selected={iconPosition === val}
                            onClick={() => setIconPosition(val)} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Icon name */}
                  {(contentType === 'icon' || (contentType === 'text' && iconPosition !== 'none')) && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        MUI icon name (e.g. Add, Edit, Delete, Save, Send, Star)
                      </Caption>
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
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {sizeDetails[size]?.note}
                    </Caption>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Button is non-interactive</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Loading</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Shows loading state</Caption>
                    </Box>
                    <Switch checked={loading} onChange={(e) => setLoading(e.target.checked)}
                      size="small" aria-label="Loading" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: ['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType) ? 0.4 : 1 }}>
                    <Box>
                      <Label>Full Width</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretches to container width</Caption>
                    </Box>
                    <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}
                      size="small" aria-label="Full width"
                      disabled={['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType)} />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {cap(style)} / {cap(effectiveColor)} / {cap(size)} / {cap(contentType)}
                  </BodySmall>

                  <Stack spacing={3}>

                    {isGhost ? (
                      <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                        <H5>Ghost — Hotlink style</H5>
                        <Stack spacing={0}>
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Default state:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>Text uses var(--Hotlink), underlined for affordance.</Caption>
                          </Box>
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Hover / focus / active:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>Underline removed. Background: var(--Background-Hover) / var(--Background-Active).</Caption>
                          </Box>
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Icons in ghost:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>Use var(--Hotlink). aria-hidden="true" alt="" required.</Caption>
                          </Box>
                          <Box sx={{ py: 1.5 }}>
                            <BodySmall>Focus ring:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>2px solid var(--Focus-Visible), offset 2px</Caption>
                          </Box>
                        </Stack>
                      </Box>
                    ) : (
                      <>
                        {/* Icon / Avatar / Swatch */}
                        {['icon', 'avatar', 'swatch'].includes(contentType) && (
                          <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                            <H5>{contentType === 'swatch' ? 'Swatch' : contentType === 'avatar' ? 'Avatar' : 'Icon-only'} accessibility</H5>
                            <Stack spacing={0}>
                              <A11yRow
                                label="Icon / content vs. background"
                                ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                                threshold={3.0}
                                note="Non-text elements: 3:1 minimum (WCAG 1.4.11)" />
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

                        {/* Text / Letter / Number */}
                        {['text', 'letter', 'number'].includes(contentType) && (
                          <>
                            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                              <H5>Border vs. page (WCAG 1.4.11 — 3:1)</H5>
                              <A11yRow
                                label="Border vs. background"
                                ratio={getContrast(contrastData.buttonBorder, contrastData.background)}
                                threshold={3.0}
                                note="Button must be distinguishable from the page" />
                            </Box>

                            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                              <H5>Text on button (WCAG 1.4.3 — 4.5:1)</H5>
                              <A11yRow label="Resting: text vs. button background"
                                ratio={getContrast(contrastData.buttonText, contrastData.buttonBg === 'transparent' ? contrastData.background : contrastData.buttonBg)}
                                threshold={4.5} note="4.5:1 minimum" />
                              <A11yRow label="On hover"
                                ratio={getContrast(contrastData.buttonText, contrastData.hover)}
                                threshold={4.5} note="Maintained on hover" />
                              <A11yRow label="On active"
                                ratio={getContrast(contrastData.buttonText, contrastData.active)}
                                threshold={4.5} note="Maintained on active / focus" />
                            </Box>
                          </>
                        )}

                        {/* Focus */}
                        <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                          <H5>Focus indicator (WCAG 2.4.11 — 3:1)</H5>
                          <A11yRow label="var(--Focus-Visible) vs. var(--Background)"
                            ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                            threshold={3.0} note="2px solid var(--Focus-Visible), offset 2px" />
                        </Box>

                        {/* Touch target */}
                        <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                          <H5>Touch target area (WCAG 2.5.5)</H5>
                          {[
                            { label: 'Small',  height: 32 },
                            { label: 'Medium', height: 40 },
                            { label: 'Large',  height: 64 },
                          ].map(({ label, height }) => {
                            const passDesktop = height >= 24;
                            const passIOS     = height >= 44;
                            const passAndroid = height >= 48;
                            return (
                              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                                <BodySmall style={{ color: 'var(--Text)' }}>{label} — {height}px{size === label.toLowerCase() ? ' ← current' : ''}</BodySmall>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                    backgroundColor: passDesktop ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
                                    color: passDesktop ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
                                    Desktop {passDesktop ? '✓' : '✗'}
                                  </Box>
                                  <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                    backgroundColor: passIOS ? 'var(--Tags-Success-BG)' : 'var(--Tags-Warning-BG)',
                                    color: passIOS ? 'var(--Tags-Success-Text)' : 'var(--Tags-Warning-Text)' }}>
                                    iOS {passIOS ? '✓' : '~'}
                                  </Box>
                                  <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                    backgroundColor: passAndroid ? 'var(--Tags-Success-BG)' : 'var(--Tags-Warning-BG)',
                                    color: passAndroid ? 'var(--Tags-Success-Text)' : 'var(--Tags-Warning-Text)' }}>
                                    Android {passAndroid ? '✓' : '~'}
                                  </Box>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>

                        {/* ARIA */}
                        <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                          <H5>ARIA and semantics</H5>
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
                              <Caption style={{ color: 'var(--Text-Quiet)' }}>opacity: 0.6, cursor: not-allowed, pointerEvents: none</Caption>
                            </Box>
                          </Stack>
                        </Box>

                      </>
                    )}
                  </Stack>
                </Box>
              </TabPanel>
            </Tabs>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ButtonShowcase;