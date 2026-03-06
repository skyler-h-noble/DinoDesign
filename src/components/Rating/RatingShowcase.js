// src/components/Rating/RatingShowcase.js
import React, { useState } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Rating } from './Rating';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

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
function ControlButton({ label, selected, onClick, disabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={disabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: disabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = COLOR_MAP[color] || 'Default';
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 32, height: 32, borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)' }} />}
      </Box>
    </Tooltip>
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

export function RatingShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [ratingValue, setRatingValue] = useState(3);

  const [color, setColor] = useState('default');
  const [size, setSize] = useState('medium');
  const [mode, setMode] = useState('controlled');
  const [precision, setPrecision] = useState(1);
  const [maxStars, setMaxStars] = useState(5);
  const [disabled, setDisabled] = useState(false);

  const isReadOnly = mode === 'readonly';
  const isNoRating = mode === 'norating';
  const isControlled = mode === 'controlled';
  const isUncontrolled = mode === 'uncontrolled';

  const C = COLOR_MAP[color] || 'Default';

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (maxStars !== 5) parts.push('max={' + maxStars + '}');
    if (precision !== 1) parts.push('precision={' + precision + '}');
    if (isControlled) {
      parts.push('value={' + ratingValue + '}');
      parts.push('onChange={(val) => setValue(val)}');
    }
    if (isUncontrolled) parts.push('defaultValue={3}');
    if (isReadOnly) { parts.push('value={' + ratingValue + '}'); parts.push('readOnly'); }
    if (isNoRating) parts.push('value={null}');
    if (disabled) parts.push('disabled');
    return '<Rating\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Rating</H2>
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

              {/* Main preview */}
              <Rating
                key={'r-' + color + '-' + size + '-' + mode + '-' + precision + '-' + maxStars}
                color={color}
                size={size}
                max={maxStars}
                precision={precision}
                readOnly={isReadOnly}
                disabled={disabled}
                {...(isControlled ? { value: ratingValue, onChange: setRatingValue } : {})}
                {...(isUncontrolled ? { defaultValue: 3 } : {})}
                {...(isReadOnly ? { value: ratingValue } : {})}
                {...(isNoRating ? { value: null } : {})}
              />

              {/* Current value display */}
              <Caption style={{ color: 'var(--Text-Quiet)' }}>
                {isNoRating ? 'value: null' : isControlled || isReadOnly ? 'value: ' + ratingValue : 'uncontrolled (internal state)'}
              </Caption>

              {/* All sizes preview */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>All sizes</Caption>
                {['small', 'medium', 'large'].map((s) => (
                  <Rating key={s} color={color} size={s} value={3} readOnly max={maxStars} />
                ))}
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Mode */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MODE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {[['controlled', 'Controlled'], ['uncontrolled', 'Uncontrolled'], ['readonly', 'Read Only'], ['norating', 'No Rating']].map(([val, lbl]) => (
                  <ControlButton key={val} label={lbl} selected={mode === val} onClick={() => setMode(val)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {mode === 'controlled' ? 'Value managed externally. Click to change.' :
                 mode === 'uncontrolled' ? 'Internal state. Starts at defaultValue.' :
                 mode === 'readonly' ? 'Display only. No interaction.' :
                 'No value set. Shows all empty stars.'}
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
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Filled: var(--Buttons-{C}-Button). Hover: var(--Buttons-{C}-Hover).
              </Caption>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '20px icons.' : size === 'medium' ? '28px icons (default).' : '36px icons.'}
              </Caption>
            </Box>

            {/* Precision */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PRECISION</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Full star" selected={precision === 1} onClick={() => setPrecision(1)} />
                <ControlButton label="Half star" selected={precision === 0.5} onClick={() => setPrecision(0.5)} />
              </Stack>
            </Box>

            {/* Max stars */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MAX STARS</OverlineSmall>
              <NumberStepper label="Stars" value={maxStars} onChange={setMaxStars} min={3} max={10} />
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box>
                  <Label>Disabled</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>50% opacity, no interaction.</Caption>
                </Box>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(mode)} · {C} · {cap(size)} · {precision === 0.5 ? 'Half' : 'Full'} precision · {maxStars} stars
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Interactive:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="radiogroup" with role="radio" aria-checked per star. aria-label="N star(s)".'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Read only / disabled:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="img" aria-label="Rating: N of M stars" — no focusable elements.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>No rating:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Shows "(No rating)" label. aria-label reflects empty state.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>ArrowRight/Up increases, ArrowLeft/Down decreases. Click same star to clear.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible) on each star button.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Filled star:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'var(--Buttons-' + C + '-Button)'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Hover star:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'var(--Buttons-' + C + '-Hover)'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Empty star:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Text-Quiet)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Sizes:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Small 20px, Medium 28px, Large 36px.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clear on re-click:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Clicking the current value clears to null. Allows "no rating" state.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Half precision:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Split click zones on each star — left half = X.5, right half = X.0. Hover preview shows result.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Color usage:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Default (gold/neutral) for general. Success for positive feedback. Warning/Error for urgency.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default RatingShowcase;
