// src/components/Accordion/AccordionShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from './Accordion';
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
const LIGHT_THEME_MAP = {
  default: null, primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const COLOR_TOKEN_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SAMPLE_ITEMS = [
  { title: 'Getting Started', content: 'Follow the installation guide to set up the design system in your project. Import components from the library and start building your interface.' },
  { title: 'Customization', content: 'Use design tokens to customize colors, typography, and spacing. Theme variants allow switching between light and dark modes with consistent contrast ratios.' },
  { title: 'Accessibility', content: 'All components meet WCAG 2.2 AA standards. Focus indicators, keyboard navigation, and ARIA attributes are built in. The Cognitive Multiplier adjusts spacing for users with reading differences.' },
];

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
  const C = COLOR_TOKEN_MAP[color] || cap(color);
  const SOLID_THEMES = {
    primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
    info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
  };
  const LIGHT_THEMES = {
    primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
    info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
  };
  const dataTheme = variant === 'light' ? LIGHT_THEMES[color] : SOLID_THEMES[color];

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

export function AccordionShowcase() {
  const [variant, setVariant]           = useState('default');
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [disableDivider, setDisableDivider] = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [contrastData, setContrastData] = useState({});
  const [bgTheme, setBgTheme] = useState(null);

  const isDefaultVariant = variant === 'default';
  const isDefaultColor   = color === 'default';
  const C = COLOR_TOKEN_MAP[color] || 'Default';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const generateCode = () => {
    const gp = ['variant="' + variant + '"'];
    if (!isDefaultColor) gp.push('color="' + color + '"');
    if (size !== 'medium') gp.push('size="' + size + '"');
    if (disableDivider) gp.push('disableDivider');
    const ap = disabled ? ' disabled' : '';
    return (
      '<AccordionGroup ' + gp.join(' ') + '>\n' +
      '  <Accordion' + ap + '>\n' +
      '    <AccordionSummary>Section Title</AccordionSummary>\n' +
      '    <AccordionDetails>Section content goes here.</AccordionDetails>\n' +
      '  </Accordion>\n' +
      '</AccordionGroup>'
    );
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
    setContrastData(data);
  }, [variant, color, C, isDefaultVariant]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Accordion</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview — wrapped in PreviewSurface for background switcher */}
          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <AccordionGroup variant={variant} color={color} size={size} disableDivider={disableDivider}>
                {SAMPLE_ITEMS.map((item, i) => (
                  <Accordion key={i} disabled={disabled && i === 1} defaultExpanded={i === 0}>
                    <AccordionSummary>{item.title}</AccordionSummary>
                    <AccordionDetails>{item.content}</AccordionDetails>
                  </Accordion>
                ))}
              </AccordionGroup>
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

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['default', 'solid', 'light'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => {
                          setVariant(s);
                          if (s === 'default') setColor('default');
                          else if (color === 'default') setColor('primary');
                        }} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color — hidden for default variant */}
                  {!isDefaultVariant && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {COLORS.filter(c => c !== 'default').map((c) => (
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

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disable Dividers</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Hide borders between items</Caption>
                    </Box>
                    <Switch checked={disableDivider} onChange={(e) => setDisableDivider(e.target.checked)}
                      size="small" aria-label="Disable dividers" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled Item</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Second accordion is disabled</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disable second item" />
                  </Box>
                </Box>
              </TabPanel>

              {/* Accessibility */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {color} / {size}
                    {disableDivider ? ' / no dividers' : ''}
                    {getThemeName() ? ' — data-theme="' + getThemeName() + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Text must have 4.5:1 contrast against the accordion background in all states.
                      </BodySmall>
                      {isDefaultVariant ? (
                        <>
                          <A11yRow label="Resting: var(--Text) vs. var(--Background)"
                            ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                            note="Standard text color on page background" />
                          <A11yRow label="On hover: var(--Text) vs. var(--Hover)"
                            ratio={getContrast(contrastData.text, contrastData.hover)} threshold={4.5}
                            note="Text must remain readable on hover background" />
                          <A11yRow label="On active: var(--Text) vs. var(--Active)"
                            ratio={getContrast(contrastData.text, contrastData.active)} threshold={4.5}
                            note="Text must remain readable on active/pressed background" />
                        </>
                      ) : (
                        <>
                          <A11yRow label="Resting: var(--Text) vs. var(--Surface)"
                            ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                            note={'data-theme="' + getThemeName() + '"'} />
                          <A11yRow label="On hover: var(--Text) vs. var(--Hover)"
                            ratio={getContrast(contrastData.text, contrastData.hover)} threshold={4.5}
                            note="Text must remain readable on hover background" />
                          <A11yRow label="On active: var(--Text) vs. var(--Active)"
                            ratio={getContrast(contrastData.text, contrastData.active)} threshold={4.5}
                            note="Text must remain readable on active/pressed background" />
                        </>
                      )}
                    </Box>

                    {/* Container Visibility */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Container Visibility (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Either the border or the background fill must contrast 3:1 against the page background.
                      </BodySmall>
                      {(() => {
                        const borderRatio  = getContrast(contrastData.border, contrastData.background);
                        const surfaceRatio = getContrast(contrastData.surface, contrastData.background);
                        const borderPasses  = borderRatio  && parseFloat(borderRatio)  >= 3.0;
                        const surfacePasses = surfaceRatio && parseFloat(surfaceRatio) >= 3.0;
                        const bestRatio = borderPasses ? borderRatio : (surfacePasses ? surfaceRatio : borderRatio);
                        const bestLabel = borderPasses
                          ? 'Border: var(--Border) vs. var(--Background)'
                          : (surfacePasses ? 'Surface: var(--Surface) vs. var(--Background)' : 'Border: var(--Border) vs. var(--Background)');
                        const note = borderPasses
                          ? 'Accordion border contrasts 3:1 against page background'
                          : (surfacePasses ? 'Themed surface fill contrasts 3:1 against page background' : 'Neither border nor surface meets 3:1 against page background');
                        return <A11yRow label={bestLabel} ratio={bestRatio} threshold={3.0} note={note} />;
                      })()}
                    </Box>

                    {/* Focus Indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        3px inset focus ring — does not overlap adjacent elements.
                      </BodySmall>
                      <A11yRow
                        label={isDefaultVariant
                          ? 'var(--Focus-Visible) vs. var(--Background)'
                          : 'var(--Focus-Visible) vs. var(--Surface)'}
                        ratio={isDefaultVariant
                          ? getContrast(contrastData.focusVisible, contrastData.background)
                          : getContrast(contrastData.focusVisible, contrastData.surface)}
                        threshold={3.0}
                        note="outline: 3px solid var(--Focus-Visible); outline-offset: -3px" />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        WCAG requires 24px minimum on desktop. iOS recommends 44px, Android 48px.
                      </BodySmall>
                      {[
                        { label: 'Small',  py: 8,  fontSize: 13, lineHeight: 1.4 },
                        { label: 'Medium', py: 12, fontSize: 14, lineHeight: 1.4 },
                        { label: 'Large',  py: 16, fontSize: 16, lineHeight: 1.4 },
                      ].map(({ label, py, fontSize, lineHeight }) => {
                        const height = Math.round(py * 2 + fontSize * lineHeight);
                        const passDesktop = height >= 24;
                        const passIOS     = height >= 44;
                        const passAndroid = height >= 48;
                        return (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall style={{ color: 'var(--Text)' }}>{label} — ~{height}px</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                {py * 2}px padding + {fontSize}px × {lineHeight}{size === label.toLowerCase() ? ' ← current' : ''}
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
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Summary trigger:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<button role="button" aria-expanded="true|false" aria-controls="content-id">'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Content region:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<div role="region" aria-labelledby="header-id">'}
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
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Enter and Space toggle expansion. Tab navigates between summaries.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Focus indicator:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            outline: 3px solid var(--Focus-Visible); outline-offset: -3px
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Disabled:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            opacity: 0.5, tabIndex: -1, cursor: not-allowed. Content preserved, trigger not focusable.
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

export default AccordionShowcase;