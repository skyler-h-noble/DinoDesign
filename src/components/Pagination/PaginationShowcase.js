// src/components/Pagination/PaginationShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Pagination } from './Pagination';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
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
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
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
function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 90 }}>{label}</Caption>
      <button
        type="button"
        onClick={() => { if (value > min) onChange(value - 1); }}
        disabled={value <= min}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value <= min ? 0.4 : 1, fontFamily: 'inherit',
        }}
      >
        −
      </button>
      <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 24, textAlign: 'center' }}>{value}</Box>
      <button
        type="button"
        onClick={() => { if (value < max) onChange(value + 1); }}
        disabled={value >= max}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value >= max ? 0.4 : 1, fontFamily: 'inherit',
        }}
      >
        +
      </button>
    </Box>
  );
}

export function PaginationShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [disabled, setDisabled] = useState(false);
  const [showFirstLast, setShowFirstLast] = useState(false);

  // Advanced settings
  const [count, setCount] = useState(10);
  const [defaultPage, setDefaultPage] = useState(1);
  const [siblingCount, setSiblingCount] = useState(1);
  const [boundaryCount, setBoundaryCount] = useState(1);

  // Live page state for preview
  const [currentPage, setCurrentPage] = useState(1);

  const [contrastData, setContrastData] = useState({});

  const C = COLOR_MAP[color] || 'Primary';

  // Reset currentPage when count changes
  useEffect(() => {
    if (currentPage > count) setCurrentPage(Math.max(1, count));
  }, [count, currentPage]);

  // Reset to defaultPage
  useEffect(() => {
    if (defaultPage >= 1 && defaultPage <= count) setCurrentPage(defaultPage);
  }, [defaultPage, count]);

  const generateCode = () => {
    const parts = [];
    parts.push('count={' + count + '}');
    if (variant !== 'solid') parts.push('variant="' + variant + '"');
    if (color !== 'primary') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (defaultPage !== 1) parts.push('defaultPage={' + defaultPage + '}');
    if (siblingCount !== 1) parts.push('siblingCount={' + siblingCount + '}');
    if (boundaryCount !== 1) parts.push('boundaryCount={' + boundaryCount + '}');
    if (showFirstLast) { parts.push('showFirstButton'); parts.push('showLastButton'); }
    if (disabled) parts.push('disabled');
    return '<Pagination\n  ' + parts.join('\n  ') + '\n  onChange={(page) => console.log(page)}\n/>';
  };

  useEffect(() => {
    const data = {};
    data.background = getCssVar('--Background');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.colorButton = getCssVar('--Buttons-' + C + '-Button');
    data.colorText = getCssVar('--Buttons-' + C + '-Text');
    data.colorBorder = getCssVar('--Buttons-' + C + '-Border');
    data.border = getCssVar('--Border');
    data.lightButton = getCssVar('--Buttons-' + C + '-Light-Button');
    data.lightText = getCssVar('--Buttons-' + C + '-Light-Text');
    data.lightBorder = getCssVar('--Buttons-' + C + '-Light-Border');
    setContrastData(data);
  }, [variant, color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Pagination</H2>
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
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 4 }}>

              {/* Main interactive preview */}
              <Box sx={{ textAlign: 'center' }}>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                  Page {currentPage} of {count}
                </Caption>
                <Pagination
                  key={'p-' + count + '-' + siblingCount + '-' + boundaryCount}
                  variant={variant}
                  color={color}
                  size={size}
                  count={count}
                  page={currentPage}
                  onChange={setCurrentPage}
                  siblingCount={siblingCount}
                  boundaryCount={boundaryCount}
                  disabled={disabled}
                  showFirstButton={showFirstLast}
                  showLastButton={showFirstLast}
                />
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 180 }}>
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
                {['solid', 'light'].map((v) => (
                  <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {variant === 'solid'
                  ? 'Selected: --Buttons-{Color}-Button bg. Unselected: outlined.'
                  : 'Selected: --Buttons-{Color}-Light-Button bg. Unselected: outlined.'}
              </Caption>
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
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '28px visible, 24×24 min touch area.' : size === 'medium' ? '32px buttons.' : '40px buttons.'}
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Disabled</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>All buttons disabled.</Caption>
                  </Box>
                  <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>First / Last Buttons</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show jump-to-first and jump-to-last.</Caption>
                  </Box>
                  <Switch checked={showFirstLast} onChange={(e) => setShowFirstLast(e.target.checked)} size="small" />
                </Box>
              </Stack>
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ADVANCED</OverlineSmall>
              <Stack spacing={1.5}>
                <NumberStepper label="Count" value={count} onChange={setCount} min={1} max={100} />
                <NumberStepper label="Default Page" value={defaultPage} onChange={setDefaultPage} min={1} max={count} />
                <NumberStepper label="Sibling Count" value={siblingCount} onChange={setSiblingCount} min={0} max={5} />
                <NumberStepper label="Boundary Count" value={boundaryCount} onChange={setBoundaryCount} min={0} max={5} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>
                Sibling: pages shown around current. Boundary: pages always shown at start/end.
              </Caption>
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
          </BodySmall>

          <Stack spacing={4}>
            {/* Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Selected Page Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Text on selected button background</BodySmall>
              {variant === 'solid' ? (
                <>
                  <A11yRow label={'Text: var(--Buttons-' + C + '-Text) vs bg: var(--Buttons-' + C + '-Button)'}
                    ratio={getContrast(contrastData.colorText, contrastData.colorButton)} threshold={4.5}
                    note="Selected page text readability (WCAG 1.4.3, 4.5:1)" />
                  <A11yRow label={'Border: var(--Buttons-' + C + '-Border) vs var(--Background)'}
                    ratio={getContrast(contrastData.colorBorder, contrastData.background)} threshold={3.0}
                    note="Selected button border visibility (WCAG 1.4.11, 3:1)" />
                </>
              ) : (
                <>
                  <A11yRow label={'Text: var(--Buttons-' + C + '-Light-Text) vs bg: var(--Buttons-' + C + '-Light-Button)'}
                    ratio={getContrast(contrastData.lightText, contrastData.lightButton)} threshold={4.5}
                    note="Selected page text readability (WCAG 1.4.3, 4.5:1)" />
                  <A11yRow label={'Border: var(--Buttons-' + C + '-Light-Border) vs var(--Background)'}
                    ratio={getContrast(contrastData.lightBorder, contrastData.background)} threshold={3.0}
                    note="Selected button border visibility (WCAG 1.4.11, 3:1)" />
                </>
              )}
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Unselected Page Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Outlined unselected buttons</BodySmall>
              <A11yRow label="Text: var(--Text-Quiet) vs var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Unselected page number readability (WCAG 1.4.3, 4.5:1)" />
              <A11yRow label="Border: var(--Border) vs var(--Background)"
                ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                note="Unselected outline border visibility (WCAG 1.4.11, 3:1)" />
            </Box>

            {/* ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Navigation landmark:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<nav aria-label="Pagination">'} — wraps the pagination in a labeled navigation region.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Page buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button aria-label="Page N" aria-current="page">'} — selected page gets aria-current="page". Each button has a descriptive label.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Arrow buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Previous/Next: aria-label="Go to previous/next page". First/Last (optional): aria-label="Go to first/last page". Disabled when at boundary.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Ellipsis:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-hidden="true" — decorative separator, not interactive, hidden from screen readers.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Touch targets:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {size === 'small'
                      ? 'Small: 28px visible, 24×24 min touch target via ::after pseudo-element (WCAG 2.5.8).'
                      : size === 'medium'
                        ? 'Medium: 32×32px buttons meet 24×24 WCAG minimum.'
                        : 'Large: 40×40px buttons exceed 24×24 WCAG minimum.'}
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>28px visible, 24×24 touch target, 13px text, 16px icons, 6px radius.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>32px, 14px text, 18px icons, 8px radius.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>40px, 16px text, 20px icons, 8px radius.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default PaginationShowcase;
