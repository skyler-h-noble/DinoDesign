// src/components/Tooltip/TooltipShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip as MuiTooltipBase, IconButton as MuiIconButton,
  Switch, Button as MuiButton, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from './Tooltip';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const PLACEMENTS = [
  'top-start', 'top', 'top-end',
  'left-start', 'left', 'left-end',
  'right-start', 'right', 'right-end',
  'bottom-start', 'bottom', 'bottom-end',
];

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
    <MuiTooltipBase title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton size="small" onClick={handleCopy}
        sx={{ color: copied ? '#4ade80' : '#9ca3af', '&:hover': { backgroundColor: '#333', color: '#e5e7eb' } }}>
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </MuiTooltipBase>
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <MuiTooltipBase title={C} arrow>
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
    </MuiTooltipBase>
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

function PlacementGrid({ placement, onSelect }) {
  const grid = [
    [null, 'top-start', 'top', 'top-end', null],
    ['left-start', null, null, null, 'right-start'],
    ['left', null, null, null, 'right'],
    ['left-end', null, null, null, 'right-end'],
    [null, 'bottom-start', 'bottom', 'bottom-end', null],
  ];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5, maxWidth: 320 }}>
      {grid.flat().map((p, i) =>
        p ? (
          <Box key={p} component="button" onClick={() => onSelect(p)}
            sx={{ px: 0.5, py: 0.5, fontSize: '10px', fontFamily: 'inherit', fontWeight: 500,
              border: placement === p ? '2px solid var(--Buttons-Primary-Button)' : '1px solid var(--Border)',
              borderRadius: '4px', cursor: 'pointer',
              backgroundColor: placement === p ? 'var(--Buttons-Primary-Button)' : 'transparent',
              color: placement === p ? 'var(--Buttons-Primary-Text)' : 'var(--Text-Quiet)',
              whiteSpace: 'nowrap', textAlign: 'center',
              '&:hover': { backgroundColor: placement === p ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
              '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' } }}>
            {p.replace('-', '\n')}
          </Box>
        ) : <Box key={'empty-' + i} />
      )}
    </Box>
  );
}

export function TooltipShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [placement, setPlacement] = useState('bottom');
  const [showArrow, setShowArrow] = useState(false);
  const [openMode, setOpenMode] = useState('uncontrolled');
  const [contrastData, setContrastData] = useState({});

  const isOutline = variant === 'outline';
  const C = cap(color);

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const resolveOpen = () => {
    if (openMode === 'true') return true;
    if (openMode === 'false') return false;
    return undefined;
  };

  const generateCode = () => {
    const parts = [];
    parts.push('variant="' + variant + '"');
    parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (placement !== 'bottom') parts.push('placement="' + placement + '"');
    if (showArrow) parts.push('arrow');
    if (openMode === 'true') parts.push('open={true}');
    if (openMode === 'false') parts.push('open={false}');
    return '<Tooltip title="Tooltip text" ' + parts.join(' ') + '>\n  <Button>Hover me</Button>\n</Tooltip>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.surface = getCssVar('--Surface');
    data.background = getCssVar('--Background');
    data.border = getCssVar('--Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    if (isOutline) {
      data.tooltipBg = getCssVar('--Background');
      data.tooltipText = getCssVar('--Text');
      data.tooltipBorder = getCssVar('--Buttons-' + C + '-Border');
    } else {
      data.tooltipBg = getCssVar('--Surface');
      data.tooltipText = getCssVar('--Text');
      data.tooltipBorder = null;
    }
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Tooltip</H2>
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
              <Box sx={{ py: 8 }}>
                <Tooltip
                  title="Informative tooltip text"
                  variant={variant}
                  color={color}
                  size={size}
                  placement={placement}
                  arrow={showArrow}
                  open={resolveOpen()}
                >
                  <MuiButton
                    variant="contained"
                    sx={{
                      backgroundColor: 'var(--Buttons-' + C + '-Button)',
                      color: 'var(--Buttons-' + C + '-Text)',
                      textTransform: 'none',
                      fontFamily: 'inherit',
                      fontWeight: 500,
                      borderRadius: 'var(--Style-Border-Radius)',
                      '&:hover': { backgroundColor: 'var(--Buttons-' + C + '-Hover)' },
                    }}
                  >
                    Hover me
                  </MuiButton>
                </Tooltip>
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
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {['solid', 'light', 'outline'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isOutline
                  ? 'No theme \u2014 border from var(--Buttons-' + C + '-Border), bg from var(--Background)'
                  : 'data-theme="' + getThemeName() + '" \u2014 all tokens resolve from theme'}
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
            </Box>

            {/* Placement */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PLACEMENT</OverlineSmall>
              <PlacementGrid placement={placement} onSelect={setPlacement} />
            </Box>

            {/* Arrow */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>Arrow</Label>
              <Switch checked={showArrow} onChange={(e) => setShowArrow(e.target.checked)} size="small" />
            </Box>

            {/* Open */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPEN</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['uncontrolled', 'true', 'false'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={openMode === o} onClick={() => setOpenMode(o)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {openMode === 'uncontrolled'
                  ? 'Shows on hover/focus, hides on leave/blur (default behavior).'
                  : openMode === 'true'
                    ? 'Tooltip is always visible. Useful for demos or onboarding.'
                    : 'Tooltip is always hidden. Controlled externally.'}
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
            Based on current settings: {variant} / {color} / {size} / {placement}
            {showArrow ? ' / arrow' : ''} / open={openMode}
            {!isOutline ? ' \u2014 data-theme="' + getThemeName() + '"' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Readability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Tooltip text must be readable against tooltip background (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="Tooltip text vs. tooltip background"
                ratio={getContrast(contrastData.tooltipText, contrastData.tooltipBg)} threshold={4.5}
                note={isOutline
                  ? 'var(--Text) vs var(--Background)'
                  : 'var(--Text) vs var(--Surface) within data-theme="' + getThemeName() + '"'} />
            </Box>

            {/* Tooltip Visibility */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Tooltip Visibility</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Tooltip must be distinguishable from page background (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label="Tooltip background vs. page background"
                ratio={getContrast(contrastData.tooltipBg, contrastData.background)} threshold={3.0}
                note={isOutline
                  ? 'var(--Background) vs page \u2014 border provides distinction'
                  : 'var(--Surface) [themed] vs page var(--Background)'} />
              {isOutline && (
                <A11yRow label="Tooltip border vs. page background"
                  ratio={getContrast(contrastData.tooltipBorder, contrastData.background)} threshold={3.0}
                  note={'var(--Buttons-' + C + '-Border) vs var(--Background)'} />
              )}
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Tooltip role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="tooltip" (applied by MUI Tooltip)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Trigger association:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-describedby links the trigger element to the tooltip popup via auto-generated ID (WAI-ARIA Tooltip pattern).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>describeChild prop:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When false (default), tooltip labels the child (aria-labelledby). When true, tooltip describes the child (aria-describedby). Use describeChild when the child already has a visible label.
                  </Caption>
                </Box>
                {!isOutline && (
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
                    Tooltip appears on focus of trigger element. Escape key dismisses the tooltip (WCAG 1.4.13 Content on Hover or Focus).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Hover behavior:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Tooltip is dismissable (Escape), hoverable (pointer can move to tooltip without it closing), and persistent (remains visible while trigger is focused). Meets WCAG 1.4.13 requirements.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Timing:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    enterDelay: 100ms (avoids accidental triggers). leaveDelay: 0ms. Both configurable via props.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size and Readability</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>12px text, 4px/8px padding. Max width 200px. Compact labels.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>13px text, 6px/12px padding. Max width 280px. Default density.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>14px text, 8px/16px padding. Max width 360px. Rich descriptions.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default TooltipShowcase;