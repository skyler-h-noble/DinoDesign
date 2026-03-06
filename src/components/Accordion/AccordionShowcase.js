// src/components/Accordion/AccordionShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
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
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}
function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}

export function AccordionShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [disableDivider, setDisableDivider] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const generateCode = () => {
    const gp = ['variant="' + variant + '"'];
    if (!isDefault) gp.push('color="' + color + '"');
    if (size !== 'medium') gp.push('size="' + size + '"');
    if (disableDivider) gp.push('disableDivider');
    const ap = disabled ? ' disabled' : '';
    return '<AccordionGroup ' + gp.join(' ') + '>\n  <Accordion' + ap + '>\n    <AccordionSummary>Section Title</AccordionSummary>\n    <AccordionDetails>Section content goes here.</AccordionDetails>\n  </Accordion>\n</AccordionGroup>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.surface = getCssVar('--Surface');
    data.surfaceDim = getCssVar('--Surface-Dim');
    data.background = getCssVar('--Background');
    data.border = getCssVar('--Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Accordion</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 280, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
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
            </Box>
            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['default', 'solid', 'light'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isDefault
                  ? 'No theme \u2014 border: var(--Border), bg: var(--Background). Closed text: var(--Text-Quiet), open text: var(--Text).'
                  : variant === 'solid'
                    ? 'data-theme="' + getThemeName() + '" data-surface="Surface" \u2014 all tokens resolve from theme.'
                    : 'data-theme="' + getThemeName() + '" \u2014 all tokens resolve from theme.'}
              </Caption>
            </Box>

            {/* Color */}
            {!isDefault && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
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
              <Switch checked={disableDivider} onChange={(e) => setDisableDivider(e.target.checked)} size="small" />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>Disabled Item</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Second accordion is disabled</Caption>
              </Box>
              <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {variant} / {color} / {size}
            {disableDivider ? ' / no dividers' : ''}
            {!isDefault ? ' \u2014 data-theme="' + getThemeName() + '"' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Readability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Summary and content text must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              {isDefault ? (
                <>
                  <A11yRow label="Closed summary: var(--Text-Quiet) vs. var(--Background)"
                    ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                    note="Collapsed accordion header uses quiet color" />
                  <A11yRow label="Open summary: var(--Text) vs. var(--Background)"
                    ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                    note="Expanded accordion header uses standard color" />
                  <A11yRow label="Content: var(--Text) vs. var(--Background)"
                    ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                    note="Accordion details always use standard color" />
                </>
              ) : (
                <>
                  <A11yRow label="var(--Text) vs. var(--Surface)"
                    ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                    note={'Text within data-theme="' + getThemeName() + '"'} />
                </>
              )}
            </Box>

            {/* Container Visibility */}
            {!isDefault && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Container Visibility</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Accordion group must be distinguishable from page (WCAG 1.4.11, 3:1)</BodySmall>
                <A11yRow label="var(--Surface) [themed] vs. page var(--Background)"
                  ratio={getContrast(contrastData.surface, contrastData.background)} threshold={3.0}
                  note={'Surface within data-theme="' + getThemeName() + '" vs page background'} />
              </Box>
            )}

            {/* Interactive States */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Interactive States</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Hover and focus must be visually distinct (WCAG 1.4.11)</BodySmall>
              <A11yRow label="Hover: var(--Surface-Dim) vs. surface"
                ratio={getContrast(contrastData.surfaceDim, isDefault ? contrastData.background : contrastData.surface)} threshold={3.0}
                note="Summary hover background must differ from resting state" />
              <A11yRow label="Focus: var(--Focus-Visible) vs. surface"
                ratio={getContrast(contrastData.focusVisible, isDefault ? contrastData.background : contrastData.surface)} threshold={3.0}
                note="3px inset focus ring against accordion background" />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
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
                {!isDefault && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Theme attribute:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      {'data-theme="' + getThemeName() + '"' + (variant === 'solid' ? ' data-surface="Surface"' : '')}
                    </Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Enter and Space toggle expansion. Tab navigates between summaries. Focus follows WAI-ARIA Accordion pattern.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    outline: 3px solid var(--Focus-Visible), outlineOffset: -3px (inset)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Disabled:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Disabled accordions have opacity 0.5, tabIndex -1, and cursor: not-allowed. Content is preserved but trigger is not focusable.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Expand icon:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Chevron rotates 180° on expand. Custom icon supported via expandIcon prop. Icon inherits text color.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size and Touch Targets</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>8px/12px padding, 13px text. Compact density.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>12px/16px padding, 14px text. Default balanced density.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>16px/20px padding, 16px text. Touch-friendly target area.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default AccordionShowcase;
