// src/components/ButtonGroup/ButtonGroupShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const LIGHT_THEME_MAP = {
  default:   'Default-Light',
  primary:   'Primary-Light',
  secondary: 'Secondary-Light',
  tertiary:  'Tertiary-Light',
  neutral:   'Neutral-Light',
  info:      'Info-Light',
  success:   'Success-Light',
  warning:   'Warning-Light',
  error:     'Error-Light',
};

const COLOR_TOKEN_MAP = {
  default:   'Default',
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info',
  success:   'Success',
  warning:   'Warning',
  error:     'Error',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function getContrast(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return null;
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
      }}>{ratio}:1</Box>
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

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const C = COLOR_TOKEN_MAP[color] || cap(color);
  const dataTheme = variant === 'light' ? LIGHT_THEME_MAP[color] : (color !== 'default' ? C : undefined);

  return (
    <Box
      component="button"
      data-theme={dataTheme}
      data-surface="Surface"
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height, 36px)',
        height: 'var(--Button-Height, 36px)',
        borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s ease',
        '&:hover': { transform: 'scale(1.1)' },
      }}
    >
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function ButtonGroupShowcase() {
  const [variant, setVariant]           = useState('outlined');
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [orientation, setOrientation]   = useState('horizontal');
  const [spacing, setSpacing]           = useState(0);
  const [disabled, setDisabled]         = useState(false);
  const [fullWidth, setFullWidth]       = useState(false);
  const [selectedBtn, setSelectedBtn]   = useState('week');
  const [bgTheme, setBgTheme]           = useState(null);
  const [contrastData, setContrastData] = useState({});

  const C           = COLOR_TOKEN_MAP[color] || 'Default';
  const isLight     = variant === 'light';
  const lightTheme  = LIGHT_THEME_MAP[color];

  const generateCode = () => {
    const gp = ['variant="' + variant + '"'];
    if (color !== 'default')              gp.push('color="' + color + '"');
    if (size !== 'medium')                gp.push('size="' + size + '"');
    if (orientation !== 'horizontal')     gp.push('orientation="' + orientation + '"');
    if (spacing > 0)                      gp.push('spacing={' + spacing + '}');
    if (disabled)                         gp.push('disabled');
    if (fullWidth)                        gp.push('fullWidth');
    gp.push('value={selected}');
    gp.push('onChange={setSelected}');
    return (
      '<ButtonGroup ' + gp.join(' ') + '>\n' +
      '  <Button value="day">Day</Button>\n' +
      '  <Button value="week">Week</Button>\n' +
      '  <Button value="month">Month</Button>\n' +
      '</ButtonGroup>'
    );
  };

  useEffect(() => {
    setContrastData({
      text:         getCssVar('--Text'),
      textQuiet:    getCssVar('--Text-Quiet'),
      background:   getCssVar('--Background'),
      border:       getCssVar('--Border'),
      focusVisible: getCssVar('--Focus-Visible'),
      hover:        getCssVar('--Hover'),
      active:       getCssVar('--Active'),
      btnBorder:    getCssVar('--Buttons-' + C + '-Border'),
      btnBg:        getCssVar('--Buttons-' + C + '-Button'),
      btnText:      getCssVar('--Buttons-' + C + '-Text'),
    });
  }, [variant, color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Button Group</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <ButtonGroup
                variant={variant}
                color={color}
                size={size}
                orientation={orientation}
                spacing={spacing}
                disabled={disabled}
                fullWidth={fullWidth}
                value={selectedBtn}
                onChange={setSelectedBtn}
                aria-label="Time range selector"
              >
                <Button value="day">Day</Button>
                <Button value="week">Week</Button>
                <Button value="month">Month</Button>
              </ButtonGroup>
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
              <Box component="code" sx={{
                fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                overflowWrap: 'break-word', maxWidth: '100%', display: 'block',
              }}>
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
                      {['outlined', 'light', 'ghost'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                    {isLight && (
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                        Unselected buttons: data-theme=&quot;{lightTheme}&quot; data-surface=&quot;Surface&quot;
                      </Caption>
                    )}
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {COLORS.map((c) => (
                        <ColorSwatchButton
                          key={c}
                          color={c}
                          variant={variant}
                          selected={color === c}
                          onClick={setColor}
                        />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 6, display: 'block' }}>
                      Container border: var(--Buttons-{C}-Border)
                      {' · '}Selected bg: var(--Buttons-{C}-Button)
                    </Caption>
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

                  {/* Orientation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['horizontal', 'vertical'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Spacing */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      SPACING — {spacing === 0 ? 'Connected (0)' : spacing + ' unit gap'}
                    </OverlineSmall>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="input"
                        type="range"
                        min={0}
                        max={3}
                        step={0.5}
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                        sx={{ flex: 1, accentColor: 'var(--Primary-Color-10)' }}
                      />
                      <Caption style={{ color: 'var(--Text)', minWidth: 24, textAlign: 'right' }}>
                        {spacing}
                      </Caption>
                    </Box>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                      0 = connected (borders collapse). {'>'} 0 = gap between buttons, full border radius on all.
                    </Caption>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>All buttons disabled</Caption>
                    </Box>
                    <Switch
                      checked={disabled}
                      onChange={(e) => setDisabled(e.target.checked)}
                      size="small"
                      aria-label="Disable button group"
                    />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Full Width</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretch to container width</Caption>
                    </Box>
                    <Switch
                      checked={fullWidth}
                      onChange={(e) => setFullWidth(e.target.checked)}
                      size="small"
                      aria-label="Full width"
                    />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {color} / {size}
                    {orientation !== 'horizontal' ? ' / ' + orientation : ''}
                    {spacing > 0 ? ' / spacing ' + spacing : ' / connected'}
                    {isLight ? ' — unselected: data-theme="' + lightTheme + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        All button text must have 4.5:1 contrast against its background in every state.
                      </BodySmall>
                      <A11yRow
                        label={'Selected: var(--Buttons-' + C + '-Text) vs. var(--Buttons-' + C + '-Button)'}
                        ratio={getContrast(contrastData.btnText, contrastData.btnBg)}
                        threshold={4.5}
                        note={'Selected button fill: var(--Buttons-' + C + '-Button)'}
                      />
                      <A11yRow
                        label="Unselected: var(--Text-Quiet) vs. var(--Background)"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)}
                        threshold={4.5}
                        note="Unselected buttons use transparent bg over page background"
                      />
                      <A11yRow
                        label="Hover: var(--Text) vs. var(--Hover)"
                        ratio={getContrast(contrastData.text, contrastData.hover)}
                        threshold={4.5}
                        note="Hover state text changes to var(--Text)"
                      />
                      <A11yRow
                        label="Active: var(--Text) vs. var(--Active)"
                        ratio={getContrast(contrastData.text, contrastData.active)}
                        threshold={4.5}
                        note="Pressed/active state"
                      />
                    </Box>

                    {/* Non-text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Non-Text Contrast (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        The container border and button dividers must contrast 3:1 against the page background.
                      </BodySmall>
                      <A11yRow
                        label={'Container border: var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                        ratio={getContrast(contrastData.btnBorder, contrastData.background)}
                        threshold={3.0}
                        note={'Outlined and light variants use --Buttons-' + C + '-Border'}
                      />
                      <A11yRow
                        label="Divider: var(--Border) vs. var(--Background)"
                        ratio={getContrast(contrastData.border, contrastData.background)}
                        threshold={3.0}
                        note="Ghost variant uses no container border"
                      />
                    </Box>

                    {/* Focus Indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        2px focus ring with 2px offset on each button — does not overlap adjacent elements.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 2px solid var(--Focus-Visible); outline-offset: 2px; z-index: 2"
                      />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        WCAG requires 24px minimum desktop. iOS recommends 44px, Android 48px.
                      </BodySmall>
                      {[
                        { label: 'Small',  height: 32 },
                        { label: 'Medium', height: 40 },
                        { label: 'Large',  height: 56 },
                      ].map(({ label, height }) => {
                        const passDesktop = height >= 24;
                        const passIOS     = height >= 44;
                        const passAndroid = height >= 48;
                        return (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall style={{ color: 'var(--Text)' }}>
                                {label} — {height}px{size === label.toLowerCase() ? ' ← current' : ''}
                              </BodySmall>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {[['Desktop', passDesktop, 'Success'], ['iOS', passIOS, 'Warning'], ['Android', passAndroid, 'Warning']].map(([platform, passes, tag]) => (
                                <Box key={platform} sx={{
                                  px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                  backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-' + tag + '-BG)',
                                  color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-' + tag + '-Text)',
                                }}>
                                  {platform} {passes ? '✓' : '~'}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* ARIA */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Group container',  value: '<div role="group" aria-label="…">' },
                          { label: 'Each button',      value: '<button aria-pressed="true|false">' },
                          { label: 'Selection',        value: 'aria-pressed="true" on the active button' },
                          { label: 'Disabled',         value: 'disabled attr on all buttons when group is disabled' },
                          { label: 'Keyboard',         value: 'Tab navigates between buttons. Space/Enter activates.' },
                          { label: 'Focus indicator',  value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px' },
                          ...(variant !== 'ghost' ? [{ label: 'Light theme attr', value: isLight ? 'data-theme="' + lightTheme + '" data-surface="Surface" on unselected buttons' : 'Not applicable for ' + variant + ' variant' }] : []),
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                          </Box>
                        ))}
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

export default ButtonGroupShowcase;