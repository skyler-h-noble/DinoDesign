// src/components/Switch/SwitchShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Switch } from './Switch';
import { Button } from '../Button/Button';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

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
function bestOf(a, b) {
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;
  return parseFloat(a) >= parseFloat(b) ? a : b;
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_TOKEN_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};

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

function ColorSwatchButton({ color, selected, onClick }) {
  const C = COLOR_TOKEN_MAP[color] || cap(color);
  const dataTheme = SOLID_THEME_MAP[color];
  return (
    <Box component="button" data-theme={dataTheme} data-surface="Surface"
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

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function SwitchShowcase() {
  const [style, setStyle]           = useState('solid');
  const [color, setColor]           = useState('primary');
  const [size, setSize]             = useState('medium');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isChecked, setIsChecked]   = useState(true);
  const [contrastData, setContrastData] = useState({});

  const getVariant = () => style === 'solid' ? color : color + '-' + style;

  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (isChecked)  parts.push('defaultChecked');
    if (isDisabled) parts.push('disabled');
    parts.push('label="Notifications"');
    return '<Switch ' + parts.join(' ') + ' />';
  };

  const sizeDetails = {
    small:  { track: '26×14px' },
    medium: { track: '34×18px' },
    large:  { track: '42×22px' },
  };

  useEffect(() => {
    const C = cap(color);
    const data = {};
    data.background   = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    data.thumbOff     = getCssVar('--Quiet');

    if (style === 'solid') {
      data.thumbOn         = getCssVar('--Buttons-' + C + '-Button');
      data.trackOn         = getCssVar('--Buttons-' + C + '-Border');
      data.trackOnBorder   = null;
      data.trackOff        = getCssVar('--Border-Variant');
      data.trackOffBorder  = null;
    } else if (style === 'outline') {
      data.thumbOn         = getCssVar('--Buttons-' + C + '-Border');
      data.trackOn         = null;
      data.trackOnBorder   = getCssVar('--Buttons-' + C + '-Border');
      data.trackOff        = null;
      data.trackOffBorder  = getCssVar('--Border-Variant');
    }
    setContrastData(data);
  }, [style, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Switch</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview */}
          <Box sx={{
            p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 160, backgroundColor: 'var(--Background)',
            borderBottom: '1px solid var(--Border)',
          }}>
            <Switch
              variant={getVariant()}
              size={size}
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isDisabled}
              label="Notifications"
            />
          </Box>

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
                    <Stack direction="row" spacing={1}>
                      {['solid', 'outline'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={style === s} onClick={() => setStyle(s)} />
                      ))}
                    </Stack>
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

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Checked</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Toggle the switch state</Caption>
                    </Box>
                    <Switch checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}
                      size="small" aria-label="Toggle checked state" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Disable the switch</Caption>
                    </Box>
                    <Switch checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)}
                      size="small" aria-label="Toggle disabled state" />
                  </Box>
                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    Based on current settings: {style} / {color} / {size}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Thumb vs Track ON */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Thumb vs. Track — ON (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Thumb must be distinguishable from the track when checked.
                      </BodySmall>
                      <A11yRow
                        label="Thumb vs. Track (ON)"
                        ratio={style === 'outline'
                          ? getContrast(contrastData.thumbOn, contrastData.trackOnBorder)
                          : bestOf(getContrast(contrastData.thumbOn, contrastData.trackOn), getContrast(contrastData.thumbOn, contrastData.trackOnBorder))}
                        threshold={3.0}
                        note={style === 'outline' ? 'Thumb vs track border — outline has transparent fill' : 'Best of fill vs border'} />
                    </Box>

                    {/* Thumb vs Track OFF */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Thumb vs. Track — OFF (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Thumb uses var(--Quiet) in the OFF state — must contrast 3:1 against the track.
                      </BodySmall>
                      <A11yRow
                        label="var(--Quiet) thumb vs. track (OFF)"
                        ratio={style === 'outline'
                          ? bestOf(getContrast(contrastData.thumbOff, contrastData.trackOff), getContrast(contrastData.thumbOff, contrastData.trackOffBorder))
                          : getContrast(contrastData.thumbOff, contrastData.trackOff)}
                        threshold={3.0}
                        note="Thumb must be distinguishable from the unchecked track" />
                    </Box>

                    {/* Track vs Background ON */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Track vs. Background — ON (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        The track must be distinguishable from the page background when checked.
                      </BodySmall>
                      <A11yRow
                        label="Track (ON) vs. var(--Background)"
                        ratio={bestOf(getContrast(contrastData.trackOn, contrastData.background), getContrast(contrastData.trackOnBorder, contrastData.background))}
                        threshold={3.0}
                        note="Best of track fill vs track border against page background" />
                    </Box>

                    {/* Focus indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        2px solid var(--Focus-Visible), 2px offset around the thumb.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="Focus ring must contrast 3:1 against the page background" />
                    </Box>

                    {/* Touch target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        WCAG requires 24×24px minimum on desktop. iOS recommends 44px, Android 48px.
                      </BodySmall>
                      {[
                        { label: 'Small',  w: 26, h: 24 },
                        { label: 'Medium', w: 34, h: 24 },
                        { label: 'Large',  w: 42, h: 24 },
                      ].map(({ label, w, h }) => {
                        const passDesktop = h >= 24 && w >= 24;
                        const passIOS     = h >= 44 && w >= 44;
                        const passAndroid = h >= 48 && w >= 48;
                        return (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall style={{ color: 'var(--Text)' }}>{label} — {w}×{h}px</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                track {sizeDetails[label.toLowerCase()]?.track}, min-height root container
                                {size === label.toLowerCase() ? ' ← current' : ''}
                              </Caption>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
                      <H5>ARIA &amp; Label Requirements</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>With visible label:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<Switch label="Notifications" />'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Without visible label:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<Switch aria-label="Enable notifications" />'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Space to toggle, Tab to focus. Role: checkbox with aria-checked.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Disabled:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            opacity: 0.6, pointer-events: none. Still in tab order for screen readers.
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

export default SwitchShowcase;