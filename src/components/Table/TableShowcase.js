// src/components/Table/TableShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Divider as MuiDivider, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Table } from './Table';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

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

const SAMPLE_COLUMNS = [
  { label: 'Dessert (100g)', field: 'name', width: '40%' },
  { label: 'Calories', field: 'calories', align: 'right' },
  { label: 'Fat (g)', field: 'fat', align: 'right' },
  { label: 'Carbs (g)', field: 'carbs', align: 'right' },
  { label: 'Protein (g)', field: 'protein', align: 'right' },
];
const SAMPLE_ROWS = [
  { name: 'Frozen yoghurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4.3 },
  { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 3.9 },
];
const SAMPLE_FOOTER = [
  { name: 'Total (avg)', calories: 264, fat: 10.1, carbs: 40.2, protein: 4.5 },
];

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
function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box component="button" onClick={() => !isDisabled && onClick()}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        opacity: isDisabled ? 0.4 : 1, padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': !isDisabled ? { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' } : {},
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}

export function TableShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [stripe, setStripe] = useState('none');
  const [stickyHeader, setStickyHeader] = useState(false);
  const [stickyFooter, setStickyFooter] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';
  const showColorPicker = !isDefault;

  const generateCode = () => {
    const parts = [];
    if (variant !== 'default') parts.push('variant="' + variant + '"');
    if (showColorPicker) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (stripe !== 'none') parts.push('stripe="' + stripe + '"');
    if (stickyHeader) parts.push('stickyHeader');
    if (stickyFooter) parts.push('stickyFooter');
    const lines = [];
    lines.push('<Table' + (parts.length ? ' ' + parts.join(' ') : '') + '>');
    lines.push('  <thead>');
    lines.push('    <tr><th>Dessert</th><th>Calories</th><th>Fat (g)</th></tr>');
    lines.push('  </thead>');
    lines.push('  <tbody>');
    lines.push('    <tr><td>Frozen yoghurt</td><td>159</td><td>6</td></tr>');
    lines.push('    <tr><td>Eclair</td><td>262</td><td>16</td></tr>');
    lines.push('  </tbody>');
    if (stickyFooter) {
      lines.push('  <tfoot>');
      lines.push('    <tr><td>Total</td><td>421</td><td>22</td></tr>');
      lines.push('  </tfoot>');
    }
    lines.push('</Table>');
    return lines.join('\n');
  };

  useEffect(() => {
    const data = {};
    const C = cap(color);
    data.text = getCssVar('--Text');
    data.border = getCssVar('--Border');
    data.surface = getCssVar('--Surface');
    data.surfaceDim = getCssVar('--Surface-Dim');
    data.background = getCssVar('--Background');
    if (variant === 'light') {
      data.headerBg = getCssVar('--Buttons-' + C + '-Button');
      data.headerText = getCssVar('--Buttons-' + C + '-Text');
    } else if (variant === 'solid') {
      data.headerBg = getCssVar('--Surface-Dim');
      data.headerText = getCssVar('--Text');
    } else {
      data.headerBg = getCssVar('--Surface');
      data.headerText = getCssVar('--Text');
    }
    if (variant === 'outlined') data.containerBorder = getCssVar('--Buttons-' + C + '-Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Table</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%',
                maxHeight: (stickyHeader || stickyFooter) ? 260 : 'none',
                overflow: (stickyHeader || stickyFooter) ? 'auto' : 'visible' }}>
                <Table variant={variant} color={color} size={size} stripe={stripe}
                  stickyHeader={stickyHeader} stickyFooter={stickyFooter}
                  columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} footerRows={SAMPLE_FOOTER} />
              </Box>
            </Box>
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

          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {['default', 'outlined', 'light', 'solid'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isDefault ? 'No color \u2014 var(--Border), var(--Text), var(--Surface)'
                  : variant === 'outlined' ? 'Container border: var(--Buttons-' + cap(color) + '-Border)'
                  : variant === 'light' ? 'Header: var(--Buttons-' + cap(color) + '-Button/Text)'
                  : 'Wrapper: data-theme="' + cap(color) + '-Medium"'}
              </Caption>
            </Box>

            {showColorPicker && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STRIPING</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['none', 'odd', 'even'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={stripe === s} onClick={() => setStripe(s)} />
                ))}
              </Stack>
              {stripe !== 'none' && (
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                  Striped rows: data-surface="Surface-Dim", others: data-surface="Surface"
                </Caption>
              )}
            </Box>

            <MuiDivider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Label>Sticky Header</Label>
              <Switch checked={stickyHeader} onChange={(e) => setStickyHeader(e.target.checked)} size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Label>Sticky Footer</Label>
              <Switch checked={stickyFooter} onChange={(e) => setStickyFooter(e.target.checked)} size="small" />
            </Box>
            {(stickyHeader || stickyFooter) && (
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Preview is height-constrained to demonstrate sticky behavior.
              </Caption>
            )}
          </Grid>
        </Grid>
      )}

      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {variant}{showColorPicker ? ' / ' + color : ''} / {size}{stripe !== 'none' ? ' / stripe ' + stripe : ''}
          </BodySmall>
          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Table text must be readable against cell backgrounds (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="Header text vs. header background"
                ratio={getContrast(contrastData.headerText, contrastData.headerBg)} threshold={4.5}
                note={variant === 'light' ? 'var(--Buttons-' + cap(color) + '-Text) vs var(--Buttons-' + cap(color) + '-Button)' : 'var(--Text) vs var(--Surface)'} />
              <A11yRow label="Body text vs. Surface"
                ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                note="var(--Text) vs var(--Surface)" />
              {stripe !== 'none' && (
                <A11yRow label="Body text vs. Surface-Dim (stripe)"
                  ratio={getContrast(contrastData.text, contrastData.surfaceDim)} threshold={4.5}
                  note="var(--Text) vs var(--Surface-Dim)" />
              )}
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Border Visibility</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Table borders should be distinguishable (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label="Cell border vs. Surface"
                ratio={getContrast(contrastData.border, contrastData.surface)} threshold={3.0}
                note="var(--Border) vs var(--Surface)" />
              {variant === 'outlined' && (
                <A11yRow label="Container border vs. page background"
                  ratio={getContrast(contrastData.containerBorder, contrastData.background)} threshold={3.0}
                  note={'var(--Buttons-' + cap(color) + '-Border) vs var(--Background)'} />
              )}
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Structure:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'<table> > <thead>/<tbody>/<tfoot> > <tr> > <th>/<td>'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Header cells:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use {'<th>'} in thead for column headers announced by screen readers.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Scrollable containers:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>When sticky is enabled, wrapper uses overflow: auto for keyboard-scrollable content.</Caption>
                </Box>
                {variant === 'solid' && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>Solid theme note:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>{'data-theme="' + cap(color) + '-Medium" applied to wrapper, shifting CSS custom properties.'}</Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Stripe data attributes:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Rows use data-surface="Surface" or "Surface-Dim". Decorative only, no ARIA impact.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size and Density</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>4px/8px padding, 13px body / 12px header. Compact data-dense display.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>8px/12px padding, 14px body / 13px header. Default balanced density.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>12px/16px padding, 16px body / 14px header. Comfortable reading density.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default TableShowcase;
