// src/components/Autocomplete/AutocompleteShowcase.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Autocomplete } from './Autocomplete';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const SOLID_THEME_MAP = {
  default: null, primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const OUTLINE_THEME_MAP = {
  default: null, primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const COLOR_TOKEN_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const DEFAULT_OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Brazil', value: 'br' },
  { label: 'India', value: 'in' },
  { label: 'Mexico', value: 'mx' },
];

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

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const SOLID_THEMES = {
    primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
    info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
  };
  const OUTLINE_THEMES = {
    primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
    info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
  };
  const dataTheme = variant === 'solid' ? SOLID_THEMES[color] : OUTLINE_THEMES[color];
  const C = COLOR_TOKEN_MAP[color] || cap(color);

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

export function AutocompleteShowcase() {
  const [acValue, setAcValue]           = useState(null);
  const [style, setStyle]               = useState('default');   // 'default' = Outline, 'solid' = Solid
  const [color, setColor]               = useState('default');
  const [labelPosition, setLabelPosition] = useState('top');
  const [size, setSize]                 = useState('medium');
  const [asyncMode, setAsyncMode]       = useState(false);
  const [freeSolo, setFreeSolo]         = useState(false);
  const [clearableFlag, setClearableFlag] = useState(true);
  const [isDisabled, setIsDisabled]     = useState(false);
  const [contrastData, setContrastData] = useState({});
  const [bgTheme, setBgTheme]           = useState(null);

  // Async simulation
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);

  const isDefaultColor = color === 'default';
  const C = COLOR_TOKEN_MAP[color] || 'Default';

  const getThemeName = () => {
    if (style === 'solid') return SOLID_THEME_MAP[color] || '';
    return OUTLINE_THEME_MAP[color] || '';
  };

  const handleAsyncInput = useCallback((val) => {
    if (!asyncMode) return;
    if (!val) { setAsyncOptions([]); return; }
    setAsyncLoading(true);
    const timeout = setTimeout(() => {
      const results = DEFAULT_OPTIONS.filter((o) =>
        o.label.toLowerCase().includes(val.toLowerCase())
      );
      setAsyncOptions(results);
      setAsyncLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [asyncMode]);

  const options = asyncMode ? asyncOptions : DEFAULT_OPTIONS;

  const generateCode = () => {
    const parts = [];
    if (style !== 'default') parts.push('style="' + style + '"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    if (labelPosition !== 'none') parts.push('label="Country"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (asyncMode) parts.push('loading={isLoading}');
    if (freeSolo) parts.push('freeSolo');
    if (!clearableFlag) parts.push('clearable={false}');
    if (isDisabled) parts.push('disabled');
    parts.push('options={countries}');
    parts.push('onChange={(val) => setValue(val)}');
    return '<Autocomplete\n  ' + parts.join('\n  ') + '\n/>';
  };

  useEffect(() => {
    const data = {};
    data.text         = getCssVar('--Text');
    data.textQuiet    = getCssVar('--Text-Quiet');
    data.background   = getCssVar('--Background');
    data.surface      = getCssVar('--Surface');
    data.border       = getCssVar('--Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    data.hover        = getCssVar('--Hover');
    data.active       = getCssVar('--Active');
    data.buttonBg     = getCssVar('--Buttons-Default-Button');
    data.buttonText   = getCssVar('--Buttons-Default-Text');
    setContrastData(data);
  }, [style, color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Autocomplete</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview */}
          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 320 }}>
              <Autocomplete
                key={'ac-' + style + '-' + color + '-' + labelPosition + '-' + size + '-' + asyncMode + '-' + freeSolo + '-' + clearableFlag}
                options={options}
                value={acValue}
                onChange={setAcValue}
                onInputChange={asyncMode ? handleAsyncInput : undefined}
                label={labelPosition !== 'none' ? 'Country' : undefined}
                labelPosition={labelPosition}
                placeholder="Type to search"
                size={size}
                style={style}
                loading={asyncLoading}
                freeSolo={freeSolo}
                clearable={clearableFlag}
                disabled={isDisabled}
                fullWidth
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

              {/* Playground */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker value={bgTheme} onChange={setBgTheme} />
                  </Box>

                  {/* Style — Outline and Solid only */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Outline" selected={style === 'default'} onClick={() => setStyle('default')} />
                      <ControlButton label="Solid"   selected={style === 'solid'}   onClick={() => setStyle('solid')} />
                    </Stack>
                  </Box>

                  {/* Color — Default first */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {/* Default swatch — plain background, no data-theme */}
                      <Box component="button"
                        onClick={() => setColor('default')} aria-label="Select Default" aria-pressed={color === 'default'} title="Default"
                        sx={{
                          width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
                          backgroundColor: 'var(--Background)',
                          border: color === 'default' ? '2px solid var(--Text)' : '2px solid var(--Border)',
                          outline: color === 'default' ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
                          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
                        }}>
                        {color === 'default' && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
                      </Box>
                      {COLORS.filter(c => c !== 'default').map((c) => (
                        <ColorSwatchButton key={c} color={c} variant={style} selected={color === c} onClick={setColor} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Label position */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['top', 'floating', 'none'].map((lp) => (
                        <ControlButton key={lp} label={cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
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
                      <Label>Async Loading</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Simulates 800ms network delay</Caption>
                    </Box>
                    <Switch checked={asyncMode} onChange={(e) => { setAsyncMode(e.target.checked); setAsyncOptions([]); }}
                      size="small" aria-label="Async loading" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Free Solo</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Allow values beyond the option list</Caption>
                    </Box>
                    <Switch checked={freeSolo} onChange={(e) => setFreeSolo(e.target.checked)}
                      size="small" aria-label="Free solo" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Clearable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show × button to clear value</Caption>
                    </Box>
                    <Switch checked={clearableFlag} onChange={(e) => setClearableFlag(e.target.checked)}
                      size="small" aria-label="Clearable" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Component is non-interactive</Caption>
                    </Box>
                    <Switch checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                </Box>
              </TabPanel>

              {/* Accessibility */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {style === 'default' ? 'Outline' : 'Solid'} / {color} / {size}
                    {asyncMode ? ' / async' : ''}
                    {freeSolo ? ' / free solo' : ''}
                    {getThemeName() ? ' — data-theme="' + getThemeName() + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Input text and option labels must have 4.5:1 contrast in all states.
                      </BodySmall>
                      <A11yRow label="Resting: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                        note="Standard input text on background" />
                      <A11yRow label="Quiet text: var(--Text-Quiet) vs. var(--Background)"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                        note="Placeholder and unselected option text" />
                      <A11yRow label="On hover: var(--Text) vs. var(--Hover)"
                        ratio={getContrast(contrastData.text, contrastData.hover)} threshold={4.5}
                        note="Option text on hover background" />
                      {style === 'solid' && (
                        <A11yRow label="Selected solid: var(--Buttons-Default-Text) vs. var(--Buttons-Default-Button)"
                          ratio={getContrast(contrastData.buttonText, contrastData.buttonBg)} threshold={4.5}
                          note="Text on solid selected option background" />
                      )}
                    </Box>

                    {/* Container Visibility */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Container Visibility (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        The input border must contrast 3:1 against the page background.
                      </BodySmall>
                      <A11yRow label="Border: var(--Buttons-Default-Border) vs. var(--Background)"
                        ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                        note="Active/focused input border against page background" />
                    </Box>

                    {/* Focus Indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Focus ring on the input and the clear/chevron buttons.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 2px solid var(--Focus-Visible); outline-offset: 2px" />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        WCAG requires 24px minimum on desktop. iOS recommends 44px, Android 48px.
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
                              <BodySmall style={{ color: 'var(--Text)' }}>{label} — {height}px{size === label.toLowerCase() ? ' ← current' : ''}</BodySmall>
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
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Input:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'role="combobox" aria-expanded aria-haspopup="listbox" aria-autocomplete="list"'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Dropdown:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'role="listbox" with role="option" aria-selected children'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            ArrowDown/Up navigate options. Enter selects. Escape closes. Type to filter.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Surface:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            data-surface="Container-Lowest"
                          </Caption>
                        </Box>
                        {getThemeName() && (
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Theme attribute:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                              {'data-theme="' + getThemeName() + '"'}
                            </Caption>
                          </Box>
                        )}
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Disabled:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            opacity: 0.5, input disabled, cursor: not-allowed. Chevron non-interactive.
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

export default AutocompleteShowcase;