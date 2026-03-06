// src/components/Box/BoxShowcase.js
import React, { useState } from 'react';
import {
  Box as MuiBox, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from './Box';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLOR_FAMILIES = ['Primary', 'Secondary', 'Tertiary', 'Neutral', 'Info', 'Success', 'Warning', 'Error'];
const TONES = [
  { suffix: '', label: 'Base' },
  { suffix: '-Light', label: 'Light' },
  { suffix: '-Medium', label: 'Medium' },
  { suffix: '-Dark', label: 'Dark' },
];

// Build all 32 color options
const ALL_COLORS = [];
TONES.forEach((tone) => {
  COLOR_FAMILIES.forEach((family) => {
    ALL_COLORS.push({
      value: family + tone.suffix,
      family,
      tone: tone.label,
      label: family + (tone.suffix ? ' ' + tone.label : ''),
    });
  });
});

const PADDINGS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const RADII = ['none', 'sm', 'md', 'lg', 'full'];
const ELEVATIONS = [0, 1, 2, 3, 4];

/* --- Helpers --- */
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
    <MuiBox component="button" onClick={onClick}
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
    </MuiBox>
  );
}
function CheckboxControl({ label, checked, onChange, caption }) {
  return (
    <MuiBox sx={{ py: 0.5 }}>
      <FormControlLabel
        control={<MuiCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} size="small"
          sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} />}
        label={<Label>{label}</Label>} sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </MuiBox>
  );
}

export function BoxShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [color, setColor] = useState('Primary');
  const [activeTone, setActiveTone] = useState('Base');
  const [padding, setPadding] = useState('md');
  const [borderRadius, setBorderRadius] = useState('md');
  const [elevation, setElevation] = useState(1);
  const [border, setBorder] = useState(true);

  // Build selected color value
  const toneObj = TONES.find((t) => t.label === activeTone) || TONES[0];
  const selectedColor = color + toneObj.suffix;
  const selectedLabel = color + (toneObj.suffix ? ' ' + activeTone : '');

  const generateCode = () => {
    const parts = [];
    parts.push('color="' + selectedColor + '"');
    if (padding !== 'md') parts.push('padding="' + padding + '"');
    if (borderRadius !== 'md') parts.push('borderRadius="' + borderRadius + '"');
    if (elevation !== 0) parts.push('elevation={' + elevation + '}');
    if (border) parts.push('border');
    const p = parts.length ? '\n  ' + parts.join('\n  ') + '\n' : '';
    return '<Box' + p + '>\n  Content goes here\n</Box>';
  };

  return (
    <MuiBox sx={{ pb: 8 }}>
      <H2>Box</H2>
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
            <MuiBox sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 4 }}>

              {/* Main preview */}
              <Box
                color={selectedColor}
                padding={padding}
                borderRadius={borderRadius}
                elevation={elevation}
                border={border}
                sx={{ width: '100%', maxWidth: 400, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
              </Box>
            </MuiBox>

            {/* Code */}
            <MuiBox sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </MuiBox>
              <MuiBox sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
                <MuiBox component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</MuiBox>
              </MuiBox>
            </MuiBox>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Color Family */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR FAMILY</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLOR_FAMILIES.map((f) => (
                  <ControlButton key={f} label={f} selected={color === f} onClick={() => setColor(f)} />
                ))}
              </Stack>
            </MuiBox>

            {/* Tone */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TONE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {TONES.map((t) => (
                  <ControlButton key={t.label} label={t.label} selected={activeTone === t.label} onClick={() => setActiveTone(t.label)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                data-theme="{selectedColor}"
              </Caption>
            </MuiBox>

            {/* Padding */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PADDING</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {PADDINGS.map((p) => (
                  <ControlButton key={p} label={p === 'none' ? 'None' : p.toUpperCase()} selected={padding === p} onClick={() => setPadding(p)} />
                ))}
              </Stack>
            </MuiBox>

            {/* Border Radius */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BORDER RADIUS</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {RADII.map((r) => (
                  <ControlButton key={r} label={cap(r)} selected={borderRadius === r} onClick={() => setBorderRadius(r)} />
                ))}
              </Stack>
            </MuiBox>

            {/* Elevation */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ELEVATION</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {ELEVATIONS.map((e) => (
                  <ControlButton key={e} label={e === 0 ? 'None' : String(e)} selected={elevation === e} onClick={() => setElevation(e)} />
                ))}
              </Stack>
            </MuiBox>

            {/* Border */}
            <MuiBox sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <CheckboxControl label="Border" checked={border} onChange={setBorder}
                caption="1px solid var(--Border)." />
            </MuiBox>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <MuiBox sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {selectedLabel} · padding {padding} · radius {borderRadius} · elevation {elevation}
          </BodySmall>

          <Stack spacing={4}>
            <MuiBox sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Theme Scoping</H5>
              <Stack spacing={0}>
                <MuiBox sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>data-theme:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Sets the color context. All children inherit scoped CSS variables (--Background, --Text, --Border, --Buttons-*, etc.).
                  </Caption>
                </MuiBox>
                <MuiBox sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Nesting:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Boxes can nest. Inner data-theme overrides outer. Components inside automatically use the nearest theme scope.
                  </Caption>
                </MuiBox>
                <MuiBox sx={{ py: 1.5 }}>
                  <BodySmall>No color prop:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When color is omitted, Box renders as a plain container with no data-theme — inherits from parent context.
                  </Caption>
                </MuiBox>
              </Stack>
            </MuiBox>

            <MuiBox sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Color Reference (32 options)</H5>
              <Stack spacing={0}>
                {TONES.map((tone, ti) => (
                  <MuiBox key={tone.label}>
                    <MuiBox sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                      <BodySmall style={{ fontWeight: 600 }}>{tone.label} tone:</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                        {COLOR_FAMILIES.map((f) => f + tone.suffix).join(', ')}
                      </Caption>
                    </MuiBox>
                  </MuiBox>
                ))}
              </Stack>
            </MuiBox>

            <MuiBox sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Tokens Resolved per Theme</H5>
              <Stack spacing={0}>
                {[
                  { token: 'var(--Background)', desc: 'Box background color' },
                  { token: 'var(--Text)', desc: 'Text color for all children' },
                  { token: 'var(--Text-Quiet)', desc: 'Secondary/muted text' },
                  { token: 'var(--Border)', desc: 'Border color' },
                  { token: 'var(--Hover)', desc: 'Hover state backgrounds' },
                  { token: 'var(--Buttons-Primary-*)', desc: 'Button tokens inherit theme' },
                ].map(({ token, desc }, i, arr) => (
                  <MuiBox key={token} sx={{ py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                    <BodySmall>{desc}</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{token}</Caption>
                  </MuiBox>
                ))}
              </Stack>
            </MuiBox>

            <MuiBox sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <MuiBox sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Use for sections:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Hero areas, feature sections, cards, callouts — any region needing a distinct color context.</Caption>
                </MuiBox>
                <MuiBox sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Contrast:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Dark tones provide light text, light tones dark text — all handled by the theme scope automatically.</Caption>
                </MuiBox>
                <MuiBox sx={{ py: 1.5 }}>
                  <BodySmall>Semantic HTML:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use the component prop for semantic elements: component="section", component="aside", component="article".</Caption>
                </MuiBox>
              </Stack>
            </MuiBox>
          </Stack>
        </MuiBox>
      )}
    </MuiBox>
  );
}

export default BoxShowcase;