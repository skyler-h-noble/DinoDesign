// src/components/Radio/RadioShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Radio, RadioGroup } from './Radio';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// 'default' maps to the Default token family; rest match their cap name
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

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

const SAMPLE_OPTIONS = [
  { value: 'option-a', label: 'Option A' },
  { value: 'option-b', label: 'Option B' },
  { value: 'option-c', label: 'Option C', disabled: false },
];

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

// ─── Sub-components (matching AccordionShowcase exactly) ──────────────────────

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

function ColorSwatchButton({ color, selected, onClick, style }) {
  const C = COLOR_TOKEN_MAP[color] || cap(color);
  // For the swatch bg we use the button token of the color
  const swatchTheme = color === 'default' ? undefined : cap(color);

  return (
    <Box
      component="button"
      data-theme={swatchTheme}
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

export function RadioShowcase() {
  const [radioStyle, setRadioStyle]   = useState('outline');   // 'outline' | 'light'
  const [color, setColor]             = useState('default');
  const [size, setSize]               = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [disabled, setDisabled]       = useState(false);
  const [disabledItem, setDisabledItem] = useState(false);
  const [selectedValue, setSelectedValue] = useState('option-a');
  const [bgTheme, setBgTheme]         = useState(null);
  const [contrastData, setContrastData] = useState({});

  // Build the variant string: e.g. 'primary-outline', 'default-light', etc.
  const variant = color + '-' + radioStyle;

  const C = COLOR_TOKEN_MAP[color] || 'Default';

  const generateCode = () => {
    const props = [
      'variant="' + variant + '"',
      'label="Preference"',
    ];
    if (size !== 'medium')        props.push('size="' + size + '"');
    if (orientation !== 'vertical') props.push('orientation="' + orientation + '"');
    if (disabled)                 props.push('disabled');
    return (
      '<RadioGroup\n' +
      '  ' + props.join('\n  ') + '\n' +
      '  options={[\n' +
      '    { value: "a", label: "Option A" },\n' +
      '    { value: "b", label: "Option B" },\n' +
      (disabledItem ? '    { value: "c", label: "Option C", disabled: true },\n' : '    { value: "c", label: "Option C" },\n') +
      '  ]}\n' +
      '  value={value}\n' +
      '  onChange={(e) => setValue(e.target.value)}\n' +
      '/>'
    );
  };

  useEffect(() => {
    setContrastData({
      text:         getCssVar('--Text'),
      textQuiet:    getCssVar('--Text-Quiet'),
      background:   getCssVar('--Background'),
      border:       getCssVar('--Border'),
      focusVisible: getCssVar('--Focus-Visible'),
      btnBorder:    getCssVar('--Buttons-' + C + '-Border'),
      btnBg:        getCssVar('--Buttons-' + C + '-Button'),
    });
  }, [color, radioStyle, C]);

  const sampleOptions = SAMPLE_OPTIONS.map((o, i) => ({
    ...o,
    disabled: disabledItem && i === 2,
  }));

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Radio Group</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <RadioGroup
                variant={variant}
                size={size}
                orientation={orientation}
                disabled={disabled}
                label="Preference"
                options={sampleOptions}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                name="showcase-radio"
              />
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
                      {['outline', 'light'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={radioStyle === s} onClick={() => setRadioStyle(s)} />
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
                          style={radioStyle}
                          selected={color === c}
                          onClick={setColor}
                        />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 6, display: 'block' }}>
                      variant=&quot;{variant}&quot;
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
                      {['vertical', 'horizontal'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled Group</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>All options are disabled</Caption>
                    </Box>
                    <Switch
                      checked={disabled}
                      onChange={(e) => setDisabled(e.target.checked)}
                      size="small"
                      aria-label="Disable group"
                    />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled Item</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Third option is disabled</Caption>
                    </Box>
                    <Switch
                      checked={disabledItem}
                      onChange={(e) => setDisabledItem(e.target.checked)}
                      size="small"
                      aria-label="Disable third option"
                    />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {size} / {orientation}
                    {disabled ? ' / group disabled' : ''}
                    {disabledItem ? ' / item disabled' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Label text must have 4.5:1 contrast against the page background.
                      </BodySmall>
                      <A11yRow
                        label="Label: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)}
                        threshold={4.5}
                        note="Option labels use var(--Text)"
                      />
                      <A11yRow
                        label="Quiet label: var(--Text-Quiet) vs. var(--Background)"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)}
                        threshold={4.5}
                        note="Disabled labels use var(--Text-Quiet) at 0.6 opacity"
                      />
                    </Box>

                    {/* Non-text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Non-Text Contrast (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        The radio circle border must contrast 3:1 against its background.
                      </BodySmall>
                      <A11yRow
                        label={'var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                        ratio={getContrast(contrastData.btnBorder, contrastData.background)}
                        threshold={3.0}
                        note={'Radio circle uses --Buttons-' + C + '-Border as its ring color'}
                      />
                    </Box>

                    {/* Focus Indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        2px focus ring with 2px offset — does not overlap adjacent elements.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 2px solid var(--Focus-Visible); outline-offset: 2px"
                      />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Each radio includes padding to meet minimum touch target requirements.
                        WCAG requires 24px desktop; iOS 44px; Android 48px.
                      </BodySmall>
                      {[
                        { label: 'Small',  box: 16, touch: 28 },
                        { label: 'Medium', box: 20, touch: 32 },
                        { label: 'Large',  box: 24, touch: 40 },
                      ].map(({ label, box, touch }) => {
                        const passDesktop = touch >= 24;
                        const passIOS     = touch >= 44;
                        const passAndroid = touch >= 48;
                        return (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall style={{ color: 'var(--Text)' }}>
                                {label} — {touch}px touch target ({box}px circle)
                                {size === label.toLowerCase() ? ' ← current' : ''}
                              </BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                {(touch - box) / 2}px padding on each side
                              </Caption>
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
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Group container:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<fieldset> with <legend> for the group label'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Each option:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<input type="radio"> with associated <label>'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Disabled:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            disabled attribute on input, opacity 0.6, pointer-events none. tabIndex -1 when group disabled.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Tab enters the group. Arrow keys navigate between options. Space selects.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Focus indicator:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            outline: 2px solid var(--Focus-Visible); outline-offset: 2px
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

export default RadioShowcase;