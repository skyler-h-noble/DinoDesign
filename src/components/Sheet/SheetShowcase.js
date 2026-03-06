// src/components/Sheet/SheetShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Sheet } from './Sheet';
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

export function SheetShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [elevation, setElevation] = useState(0);
  const [bordered, setBordered] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };
  const getBorderToken = () => isDefault ? 'var(--Border-Variant)' : 'var(--Border)';

  const generateCode = () => {
    const parts = [];
    if (variant !== 'default') parts.push('variant="' + variant + '"');
    if (!isDefault) parts.push('color="' + color + '"');
    if (elevation > 0) parts.push('elevation={' + elevation + '}');
    if (!bordered) parts.push('bordered={false}');
    if (!rounded) parts.push('rounded={false}');
    const propsStr = parts.length ? ' ' + parts.join(' ') : '';
    return '<Sheet' + propsStr + '>\n  Content goes here\n</Sheet>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.surface = getCssVar('--Surface');
    data.background = getCssVar('--Background');
    data.border = getCssVar('--Border');
    data.borderVariant = getCssVar('--Border-Variant');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Sheet</H2>
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
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Sheet
                  variant={variant}
                  color={color}
                  elevation={elevation}
                  bordered={bordered}
                  rounded={rounded}
                >
                  <Box sx={{ fontWeight: 700, mb: 1 }}>Sheet Title</Box>
                  <Box sx={{ color: 'var(--Text-Quiet)', fontSize: '14px', mb: 2 }}>
                    Sheet is a generic surface container for grouping related content. It supports the design system's variant and color tokens.
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ px: 2, py: 0.5, fontSize: '13px', fontFamily: 'inherit', fontWeight: 600,
                      border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                      backgroundColor: 'transparent', color: 'var(--Text)' }}>Action</Box>
                  </Box>
                </Sheet>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>data-surface="Container"</Caption>
                {!isDefault && <Caption style={{ color: 'var(--Text-Quiet)' }}>data-theme="{getThemeName()}"</Caption>}
                {bordered && <Caption style={{ color: 'var(--Text-Quiet)' }}>border: {getBorderToken()}</Caption>}
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
                  ? 'No theme \u2014 bg: var(--Background), border: var(--Border-Variant).'
                  : variant === 'solid'
                    ? 'data-theme="' + getThemeName() + '" \u2014 bg: var(--Surface), border: var(--Border).'
                    : 'data-theme="' + getThemeName() + '" \u2014 bg: var(--Surface), border: var(--Border).'}
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

            {/* Elevation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ELEVATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {[0, 1, 2, 3].map((e) => (
                  <ControlButton key={e} label={'Level ' + e} selected={elevation === e} onClick={() => setElevation(e)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {elevation === 0 ? 'No shadow.' : 'box-shadow depth ' + elevation + '.'}
              </Caption>
            </Box>

            {/* Bordered */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>Bordered</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                  {isDefault ? '1px solid var(--Border-Variant)' : '1px solid var(--Border)'}
                </Caption>
              </Box>
              <Switch checked={bordered} onChange={(e) => setBordered(e.target.checked)} size="small" />
            </Box>

            {/* Rounded */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>Rounded</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>border-radius: var(--Style-Border-Radius)</Caption>
              </Box>
              <Switch checked={rounded} onChange={(e) => setRounded(e.target.checked)} size="small" />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {variant}
            {!isDefault ? ' / ' + color + ' \u2014 data-theme="' + getThemeName() + '"' : ''}
            {elevation > 0 ? ' / elevation ' + elevation : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Readability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Content text must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              {isDefault ? (
                <>
                  <A11yRow label="var(--Text) vs. var(--Background)"
                    ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                    note="Primary text on default sheet" />
                  <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                    ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                    note="Secondary text on default sheet" />
                </>
              ) : (
                <A11yRow label="var(--Text) vs. var(--Surface)"
                  ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                  note={'Text within data-theme="' + getThemeName() + '"'} />
              )}
            </Box>

            {/* Container Boundary */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Container Boundary</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Sheet must be distinguishable from page (WCAG 1.4.11, 3:1)</BodySmall>
              {bordered ? (
                <A11yRow label={'Border: ' + getBorderToken() + ' vs. var(--Background)'}
                  ratio={getContrast(isDefault ? contrastData.borderVariant : contrastData.border, contrastData.background)} threshold={3.0}
                  note="Border provides container boundary" />
              ) : (
                <A11yRow label="Surface vs. page var(--Background)"
                  ratio={getContrast(isDefault ? contrastData.background : contrastData.surface, contrastData.background)} threshold={3.0}
                  note="Without border, surface color alone must differentiate. Consider adding elevation or border." />
              )}
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>data-surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    data-surface="Container" on all sheets
                  </Caption>
                </Box>
                {!isDefault && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>data-theme:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      data-theme="{getThemeName()}"
                    </Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Semantic element:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Renders as {'<div>'} by default. Use the component prop to change (e.g. component="section", component="aside") for improved document semantics.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Landmark roles:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Sheet is a generic container and does not add ARIA roles. Add role="region" with aria-label when the sheet represents a distinct content area.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Nesting:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Sheets can nest within Cards or other Sheets. Nested themed sheets inherit parent data-theme unless they declare their own. Ensure sufficient contrast between nested surface layers.
                  </Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default SheetShowcase;
