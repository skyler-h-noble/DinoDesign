// src/components/Alert/AlertShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Alert } from './Alert';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { H2, H5, BodySmall, Caption, Label, OverlineSmall } from '../Typography';

// ─── Constants ────────────────────────────────────────────────────────────────

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// Dynamically get a MUI icon component by name
function getMuiIcon(name) {
  if (!name) return null;
  const clean = name.replace(/\s/g, '');
  return MuiIcons[clean + 'Icon'] || MuiIcons[clean] || null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {ratio}:1
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)' }}>
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

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// Color swatches using data-theme so var(--Background) shows the tinted surface
function ColorSwatchButton({ color, selected, onClick, variant }) {
  const C = COLOR_LABEL_MAP[color] || cap(color);
  const dataTheme = variant === 'light' ? LIGHT_THEME_MAP[color] : SOLID_THEME_MAP[color];
  return (
    <Box component="button"
      data-theme={dataTheme} data-surface="Surface"
      onClick={() => onClick(color)} aria-label={'Select ' + C} aria-pressed={selected} title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function AlertShowcase() {
  const [variant, setVariant]   = useState('outline');
  const [color, setColor]       = useState('default');
  const [size, setSize]         = useState('medium');
  const [message, setMessage]   = useState('This is an alert — check it out!');

  // Start decorator
  const [startType, setStartType]   = useState('icon'); // none | icon
  const [startIconName, setStartIconName] = useState('Info');

  // End decorator
  const [endType, setEndType]       = useState('none'); // none | icon | link | button
  const [endIconName, setEndIconName]     = useState('Close');
  const [endText, setEndText]       = useState('Dismiss');

  const [contrastData, setContrastData] = useState({});

  const isOutline = variant === 'outline';
  const C = COLOR_LABEL_MAP[color] || 'Primary';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  // Icon color matches the alert's themed surface — var(--Icons-{C})
  const iconColor = isOutline ? 'var(--Icons-' + C + ')' : 'var(--Icons-' + C + ')';

  const buildStartDecorator = () => {
    if (startType === 'none') return undefined;
    const IconComp = getMuiIcon(startIconName);
    if (!IconComp) return undefined;
    return (
      <Box sx={{ color: iconColor, display: 'inline-flex', fontSize: 'inherit' }}>
        <IconComp sx={{ fontSize: 'inherit' }} />
      </Box>
    );
  };

  const buildEndDecorator = () => {
    if (endType === 'none') return undefined;
    if (endType === 'icon') {
      const IconComp = getMuiIcon(endIconName);
      if (!IconComp) return undefined;
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', color: 'var(--Quiet)', fontSize: '18px', flexShrink: 0 }}>
          <IconComp sx={{ fontSize: 'inherit' }} />
        </Box>
      );
    }
    if (endType === 'link') {
      return (
        <Box component="a" href="#" onClick={(e) => e.preventDefault()}
          sx={{
            color: 'var(--Text-Primary)', fontSize: '13px', fontWeight: 600,
            textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap',
            '&:hover': { textDecoration: 'none' },
            '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
          }}>
          {endText || 'Learn more'}
        </Box>
      );
    }
    // button
    return (
      <Box component="button"
        sx={{
          display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
          fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
          borderRadius: '4px', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          color: 'var(--Buttons-' + C + '-Text)',
          '&:hover': { backgroundColor: 'var(--Buttons-' + C + '-Hover)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}>
        {endText || 'Action'}
      </Box>
    );
  };

  const generateCode = () => {
    const parts = [];
    parts.push('variant="' + variant + '"');
    if (!isOutline) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (startType === 'icon') parts.push('startDecorator={<' + startIconName + 'Icon sx={{ fontSize: \'inherit\', color: \'var(--Icons-' + C + ')\' }} />}');
    if (endType === 'icon') parts.push('endDecorator={<' + endIconName + 'Icon />}');
    else if (endType === 'link') parts.push('endDecorator={<a href="#">' + (endText || 'Learn more') + '</a>}');
    else if (endType === 'button') parts.push('endDecorator={<button>' + (endText || 'Action') + '</button>}');
    const p = parts.length ? '\n  ' + parts.join('\n  ') + '\n' : '';
    return '<Alert' + p + '>\n  ' + message + '\n</Alert>';
  };

  useEffect(() => {
    const data = {};
    data.text        = getCssVar('--Text');
    data.background  = getCssVar('--Background');
    data.border      = getCssVar('--Border');
    data.colorBorder = getCssVar('--Buttons-' + C + '-Border');
    setContrastData(data);
  }, [variant, color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Alert</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview */}
          <PreviewSurface minHeight={80} sx={{ p: 3, alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%' }}>
              <Alert
                variant={variant}
                color={color}
                size={size}
                startDecorator={buildStartDecorator()}
                endDecorator={buildEndDecorator()}
              >
                {message}
              </Alert>
            </Box>
          </PreviewSurface>

          {/* JSX Code */}
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

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['outline', 'light', 'solid'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color — hidden for outline */}
                  {!isOutline && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {COLORS.map((c) => (
                          <ColorSwatchButton key={c} color={c} variant={variant} selected={color === c} onClick={setColor} />
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

                  {/* Message */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MESSAGE</OverlineSmall>
                    <Box component="input" type="text" value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Alert message text"
                      sx={{
                        width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                        border: '1px solid var(--Border)', borderRadius: '4px',
                        backgroundColor: 'var(--Background)', color: 'var(--Text)', boxSizing: 'border-box',
                        '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
                      }} />
                  </Box>

                  {/* Start Decorator */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START ICON</OverlineSmall>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                      {['none', 'icon'].map((t) => (
                        <ControlButton key={t} label={cap(t)} selected={startType === t} onClick={() => setStartType(t)} />
                      ))}
                    </Stack>
                    {startType === 'icon' && (
                      <>
                        <Box component="input" type="text" value={startIconName}
                          onChange={(e) => setStartIconName(e.target.value)}
                          placeholder="e.g. Info, CheckCircle, Warning"
                          sx={{
                            width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                            border: '1px solid var(--Border)', borderRadius: '4px',
                            backgroundColor: 'var(--Background)', color: 'var(--Text)', boxSizing: 'border-box',
                            '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
                          }} />
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                          Icon color: var(--Icons-{C}) — matches alert theme.{' '}
                          <Box component="a" href="https://mui.com/material-ui/material-icons/" target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: 'var(--Text-Primary)', textDecoration: 'underline' }}>
                            Browse MUI Icons ↗
                          </Box>
                        </Caption>
                      </>
                    )}
                  </Box>

                  {/* End Decorator */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>END DECORATOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, mb: 1.5 }}>
                      {['none', 'icon', 'link', 'button'].map((t) => (
                        <ControlButton key={t} label={cap(t)} selected={endType === t} onClick={() => setEndType(t)} />
                      ))}
                    </Stack>
                    {endType === 'icon' && (
                      <Box component="input" type="text" value={endIconName}
                        onChange={(e) => setEndIconName(e.target.value)}
                        placeholder="e.g. Close, Delete, ArrowForward"
                        sx={{
                          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                          border: '1px solid var(--Border)', borderRadius: '4px',
                          backgroundColor: 'var(--Background)', color: 'var(--Text)', boxSizing: 'border-box',
                          '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
                        }} />
                    )}
                    {(endType === 'link' || endType === 'button') && (
                      <Box component="input" type="text" value={endText}
                        onChange={(e) => setEndText(e.target.value)}
                        placeholder={endType === 'link' ? 'Link text' : 'Button text'}
                        sx={{
                          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                          border: '1px solid var(--Border)', borderRadius: '4px',
                          backgroundColor: 'var(--Background)', color: 'var(--Text)', boxSizing: 'border-box',
                          '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
                        }} />
                    )}
                  </Box>
                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {color} / {size}
                    {getThemeName() ? ' — data-theme="' + getThemeName() + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Visual Contrast (WCAG 1.4.3 / 1.4.11)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Text (4.5:1) and borders/containers (3:1) against the page background.
                      </BodySmall>
                      <A11yRow label="Text: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                        note="Alert message text readability (WCAG 1.4.3)" />
                      {variant === 'outline' && (
                        <A11yRow label={'Border: var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                          ratio={getContrast(contrastData.colorBorder, contrastData.background)} threshold={3.0}
                          note="Outline border visibility (WCAG 1.4.11)" />
                      )}
                      {(variant === 'light' || variant === 'solid') && (
                        <A11yRow label="Outer border: var(--Border) vs. var(--Background)"
                          ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                          note="Container border — page-level --Border outside themed area (WCAG 1.4.11)" />
                      )}
                    </Box>

                    {/* ARIA */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Alert role:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<div role="alert">'} — announces content on render. Implicit aria-live="assertive".
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Structure:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            {(variant === 'light' || variant === 'solid')
                              ? 'Outer (role="alert", border) → inner (data-theme="' + getThemeName() + '", data-surface="Surface") → content slots.'
                              : 'Single container (role="alert") → content slots.'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Icon color:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            color: var(--Icons-{C}) — resolves within the alert's data-theme context.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Start decorator:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Decorative icon — not announced separately. Add aria-label to Alert if icon conveys meaning.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>End decorator:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Icon button needs aria-label. Link uses standard semantics. Button needs visible label. All have 3px focus ring.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Not a dialog:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Alerts are passive — no focus trap. Use role="alertdialog" for interrupting messages requiring action.
                          </Caption>
                        </Box>
                      </Stack>
                    </Box>

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

export default AlertShowcase;