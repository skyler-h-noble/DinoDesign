// src/components/Breadcrumbs/BreadcrumbsShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

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
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box component="input" type="text" value={value}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0, '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}
function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 90 }}>{label}</Caption>
      <button type="button" onClick={() => { if (value > min) onChange(value - 1); }} disabled={value <= min}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value <= min ? 0.4 : 1, fontFamily: 'inherit' }}>−</button>
      <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 24, textAlign: 'center' }}>{value}</Box>
      <button type="button" onClick={() => { if (value < max) onChange(value + 1); }} disabled={value >= max}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value >= max ? 0.4 : 1, fontFamily: 'inherit' }}>+</button>
    </Box>
  );
}

export function BreadcrumbsShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [size, setSize] = useState('medium');
  const [separator, setSeparator] = useState('/');
  const [condense, setCondense] = useState(false);
  const [backOnlyMobile, setBackOnlyMobile] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const [crumbCount, setCrumbCount] = useState(6);
  const [crumbLabels, setCrumbLabels] = useState(['Home', 'Products', 'Electronics', 'Computers', 'Laptops', 'MacBook Pro']);

  // Sync labels when count changes
  useEffect(() => {
    setCrumbLabels((prev) => {
      const next = [];
      const defaults = ['Home', 'Products', 'Electronics', 'Computers', 'Laptops', 'MacBook Pro', 'Details', 'Reviews'];
      for (let i = 0; i < crumbCount; i++) {
        next.push(prev[i] || defaults[i] || 'Page ' + (i + 1));
      }
      return next;
    });
  }, [crumbCount]);

  const updateLabel = (index, val) => {
    setCrumbLabels((prev) => { const n = [...prev]; n[index] = val; return n; });
  };

  const activeCrumbs = crumbLabels.slice(0, crumbCount).map((label, i) => ({
    label,
    href: i < crumbCount - 1 ? '#' : undefined,
  }));

  const generateCode = () => {
    const parts = [];
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (separator !== '/') parts.push('separator="' + separator + '"');
    if (condense) parts.push('condense maxItems={4}');
    if (backOnlyMobile) parts.push('backOnlyMobile');
    const propsStr = parts.length ? ' ' + parts.join(' ') : '';
    const crumbLines = activeCrumbs.map((c) =>
      c.href
        ? '  <BreadcrumbItem href="#">' + c.label + '</BreadcrumbItem>'
        : '  <BreadcrumbItem>' + c.label + '</BreadcrumbItem>'
    ).join('\n');
    return '<Breadcrumbs' + propsStr + '>\n' + crumbLines + '\n</Breadcrumbs>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.link = getCssVar('--Link');
    data.linkHover = getCssVar('--Link-Hover');
    data.background = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Breadcrumbs</H2>
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
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Breadcrumbs
                size={size}
                separator={separator}
                condense={condense}
                backOnlyMobile={backOnlyMobile}
              >
                {activeCrumbs.map((c) => (
                  <BreadcrumbItem key={c.label} href={c.href}>
                    {c.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>

              {backOnlyMobile && (
                <Box sx={{ mt: 3, p: 2, border: '1px dashed var(--Border)', borderRadius: 'var(--Style-Border-Radius)', width: '100%' }}>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>Mobile preview (≤600px)</Caption>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: size === 'small' ? 'var(--Body-Small-Font-Size)' : size === 'large' ? 'var(--Body-Large-Font-Size)' : 'var(--Body-Font-Size)', color: 'var(--Link)' }}>
                    <Box component="span" aria-hidden="true" sx={{ fontSize: '1.1em', lineHeight: 1 }}>←</Box>
                    <Box component="a" href="#" sx={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      {activeCrumbs.length >= 2 ? activeCrumbs[activeCrumbs.length - 2].label : 'Back'}
                    </Box>
                  </Box>
                </Box>
              )}
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

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Scales font-size and gap between items.
              </Caption>
            </Box>

            {/* Separator */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SEPARATOR</OverlineSmall>
              <TextInput value={separator} onChange={setSeparator} placeholder="/" sx={{ width: 80 }} />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {'Any character or string (e.g. /, ›, >, —, |).'}
              </Caption>
            </Box>

            {/* Advanced Settings */}
            <Box sx={{ mt: 3 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, width: '100%',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: 600,
                  color: 'var(--Text)', p: 0, mb: advancedOpen ? 2 : 0,
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                <Box component="span" sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</Box>
                Advanced Settings
              </Box>

              {advancedOpen && (
                <Stack spacing={2.5} sx={{ pl: 0 }}>
                  {/* Breadcrumb count */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BREADCRUMBS</OverlineSmall>
                    <NumberStepper label="Count" value={crumbCount} onChange={setCrumbCount} min={2} max={8} />
                  </Box>

                  {/* Per-breadcrumb labels */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BREADCRUMB LABELS</OverlineSmall>
                    <Stack spacing={1}>
                      {crumbLabels.slice(0, crumbCount).map((lbl, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                          <TextInput value={lbl} onChange={(val) => updateLabel(i, val)} placeholder={'Page ' + (i + 1)} />
                          {i === crumbCount - 1 && (
                            <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0 }}>current</Caption>
                          )}
                        </Box>
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      Last item has no link (current page).
                    </Caption>
                  </Box>

                  {/* Condense */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Condense</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                        Collapse middle crumbs into "…" when items exceed maxItems (4).
                      </Caption>
                    </Box>
                    <Switch checked={condense} onChange={(e) => setCondense(e.target.checked)} size="small" />
                  </Box>

                  {/* Back Only Mobile */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Back Only on Mobile</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                        At ≤600px, hides full trail and shows "← Parent" link.
                      </Caption>
                    </Box>
                    <Switch checked={backOnlyMobile} onChange={(e) => setBackOnlyMobile(e.target.checked)} size="small" />
                  </Box>
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {size}
            {condense ? ' / condensed' : ''}
            {backOnlyMobile ? ' / back-only mobile' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Breadcrumb text and links must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Link crumbs and separators use var(--Text-Quiet)" />
              <A11yRow label="var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Current page crumb (last item, bold)" />
              <A11yRow label="var(--Link-Hover) vs. var(--Background)"
                ratio={getContrast(contrastData.linkHover, contrastData.background)} threshold={4.5}
                note="Hover state for crumb links" />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Navigation landmark:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<nav aria-label="Breadcrumb">'} — uses native nav element with descriptive label.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Ordered list:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ol>'} wraps crumb {'<li>'} items — screen readers announce "list of N items" and item position.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Current page:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Last item receives aria-current="page". Rendered without link and with fontWeight 600.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Separators:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Rendered as {'<li role="presentation" aria-hidden="true">'}. Hidden from assistive technology — screen readers navigate the ordered list items directly.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Ellipsis (condensed):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {'<button aria-label="Show full breadcrumb trail">'} — focusable, keyboard-activatable expand control. Reveals hidden middle crumbs on click.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Links: outline: 3px solid var(--Focus-Visible), outlineOffset: 2px, borderRadius: 2px.
                    Ellipsis button: outlineOffset: 1px.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Back-only mobile:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    At ≤600px, full trail is hidden via CSS (display: none) and replaced with a single "← Parent" link. Both views exist in the DOM — screen readers on mobile devices receive the back link while the full trail is visually hidden. Consider aria-hidden on the full trail in production for clean AT navigation.
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
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Body-Small-Font-Size), 6px gap.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Body-Font-Size), 8px gap.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Body-Large-Font-Size), 10px gap.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default BreadcrumbsShowcase;