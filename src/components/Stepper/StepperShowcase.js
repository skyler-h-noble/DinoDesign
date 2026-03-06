// src/components/Stepper/StepperShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stepper, Step } from './Stepper';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const DEFAULT_LABELS = ['Order placed', 'Processing', 'Shipped', 'Delivered', 'Reviewed', 'Completed'];
const ICON_OPTIONS = [
  <ShoppingCartIcon sx={{ fontSize: 'inherit' }} />,
  <PaymentIcon sx={{ fontSize: 'inherit' }} />,
  <LocalShippingIcon sx={{ fontSize: 'inherit' }} />,
  <AssignmentTurnedInIcon sx={{ fontSize: 'inherit' }} />,
  <StarIcon sx={{ fontSize: 'inherit' }} />,
  <SettingsIcon sx={{ fontSize: 'inherit' }} />,
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

export function StepperShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('horizontal');
  const [activeStep, setActiveStep] = useState(1);
  const [stepCount, setStepCount] = useState(3);
  const [clickable, setClickable] = useState(false);
  const [useIcons, setUseIcons] = useState(false);
  const [dashedIncomplete, setDashedIncomplete] = useState(false);
  const [stepLabels, setStepLabels] = useState(DEFAULT_LABELS.slice(0, 3));
  const [contrastData, setContrastData] = useState({});

  const C = COLOR_LABEL_MAP[color] || 'Primary';

  // Sync labels with step count
  useEffect(() => {
    setStepLabels((prev) => {
      const next = [...prev];
      while (next.length < stepCount) next.push(DEFAULT_LABELS[next.length] || 'Step ' + (next.length + 1));
      return next.slice(0, stepCount);
    });
    if (activeStep >= stepCount) setActiveStep(Math.max(0, stepCount - 1));
  }, [stepCount]);

  const handleLabelChange = (idx, val) => {
    setStepLabels((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const generateCode = () => {
    const parts = [];
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    parts.push('color="' + color + '"');
    parts.push('activeStep={' + activeStep + '}');
    if (clickable) parts.push('clickable onStepClick={(i) => setActiveStep(i)}');
    if (dashedIncomplete) parts.push('dashedIncomplete');
    const propsStr = parts.join(' ');
    const steps = stepLabels.map((l, i) => {
      const iconStr = useIcons ? ' icon={<Icon />}' : '';
      return '  <Step label="' + l + '"' + iconStr + ' />';
    }).join('\n');
    return '<Stepper ' + propsStr + '>\n' + steps + '\n</Stepper>';
  };

  useEffect(() => {
    const data = {};
    data.btnBg = getCssVar('--Buttons-' + C + '-Button');
    data.btnText = getCssVar('--Buttons-' + C + '-Text');
    data.btnHover = getCssVar('--Buttons-' + C + '-Hover');
    data.btnBorder = getCssVar('--Buttons-' + C + '-Border');
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.background = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Stepper</H2>
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
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%', maxWidth: orientation === 'vertical' ? 280 : 520 }}>
                <Stepper
                  orientation={orientation}
                  size={size}
                  color={color}
                  activeStep={activeStep}
                  clickable={clickable}
                  onStepClick={clickable ? (i) => setActiveStep(i) : undefined}
                  dashedIncomplete={dashedIncomplete}
                >
                  {stepLabels.map((label, i) => (
                    <Step
                      key={i}
                      label={label}
                      icon={useIcons ? ICON_OPTIONS[i] : undefined}
                    />
                  ))}
                </Stepper>
              </Box>
              {/* Active step controls */}
              <Box sx={{ mt: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>Active step:</Caption>
                <MuiIconButton size="small" onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep <= 0}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 28, height: 28 }}>
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
                <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 20, textAlign: 'center' }}>{activeStep + 1}</Box>
                <MuiIconButton size="small" onClick={() => setActiveStep(Math.min(stepCount - 1, activeStep + 1))}
                  disabled={activeStep >= stepCount - 1}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 28, height: 28 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
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

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Selected: var(--Buttons-{C}-Button/Text/Hover/Active). Border: var(--Buttons-{C}-Border).
              </Caption>
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
                {size === 'small'
                  ? '24×24 indicator. Uses ::after pseudo-element for 24×24 minimum touch target.'
                  : size === 'medium'
                    ? '32×32 indicator. 14px label text.'
                    : '40×40 indicator. 16px label text.'}
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['horizontal', 'vertical'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                ))}
              </Stack>
            </Box>

            {/* Step count */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STEPS ({stepCount})</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="center">
                <MuiIconButton size="small" onClick={() => setStepCount(Math.max(2, stepCount - 1))}
                  disabled={stepCount <= 2}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 32, height: 32 }}>
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
                <Box sx={{ fontWeight: 700, fontSize: '16px', minWidth: 28, textAlign: 'center' }}>{stepCount}</Box>
                <MuiIconButton size="small" onClick={() => setStepCount(Math.min(6, stepCount + 1))}
                  disabled={stepCount >= 6}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 32, height: 32 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>3–6 steps</Caption>
              </Stack>
            </Box>

            {/* Step labels/icons */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                {useIcons ? 'STEP ICONS & LABELS' : 'STEP LABELS'}
              </OverlineSmall>
              <Stack spacing={1}>
                {stepLabels.map((label, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: 'var(--Text-Quiet)', flexShrink: 0 }}>
                      {useIcons ? ICON_OPTIONS[i] : (i + 1)}
                    </Box>
                    <Box
                      component="input"
                      type="text"
                      value={label}
                      onChange={(e) => handleLabelChange(i, e.target.value)}
                      sx={{
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        border: '1px solid var(--Border)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--Background)',
                        color: 'var(--Text)',
                        outline: 'none',
                        '&:focus': { borderColor: 'var(--Focus-Visible)' },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ADVANCED</OverlineSmall>
              <Stack spacing={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Clickable (Buttons)</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Steps become buttons with hover/active/focus states.</Caption>
                  </Box>
                  <Switch checked={clickable} onChange={(e) => setClickable(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Use Icons</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Replace step numbers with icons.</Caption>
                  </Box>
                  <Switch checked={useIcons} onChange={(e) => setUseIcons(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Dashed Incomplete</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Incomplete connector paths rendered as dashed lines.</Caption>
                  </Box>
                  <Switch checked={dashedIncomplete} onChange={(e) => setDashedIncomplete(e.target.checked)} size="small" />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {color} / {size} / {orientation}
            {clickable ? ' / clickable' : ''}
            {dashedIncomplete ? ' / dashed-incomplete' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Indicator Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Step Indicator Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Selected step indicators must have readable text (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label={'var(--Buttons-' + C + '-Text) vs. var(--Buttons-' + C + '-Button)'}
                ratio={getContrast(contrastData.btnText, contrastData.btnBg)} threshold={4.5}
                note="Selected/completed indicator text on filled background" />
              <A11yRow label={'var(--Text) vs. transparent (page bg)'}
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Unselected indicator number on transparent background" />
              <A11yRow label={'var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                ratio={getContrast(contrastData.btnBorder, contrastData.background)} threshold={3.0}
                note="Indicator border visibility (WCAG 1.4.11, 3:1)" />
            </Box>

            {/* Interactive States */}
            {clickable && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Interactive States (Clickable)</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Clickable step buttons must have visible state changes</BodySmall>
                <A11yRow label={'Hover: var(--Buttons-' + C + '-Hover) vs. var(--Buttons-' + C + '-Text)'}
                  ratio={getContrast(contrastData.btnHover, contrastData.btnText)} threshold={4.5}
                  note="Selected step hover state" />
                <A11yRow label="Focus: var(--Focus-Visible) vs. var(--Background)"
                  ratio={getContrast(contrastData.focusVisible, contrastData.background)} threshold={3.0}
                  note="3px solid focus ring, outlineOffset: 2px" />
              </Box>
            )}

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ol role="list" aria-label="Progress">'} — ordered list communicates sequential steps.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Active step:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-current="step" on the active step indicator. Screen readers announce the current position.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clickable steps:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When clickable, indicators render as {'<button>'} with aria-label="Go to step N". Enter and Space activate. Non-clickable indicators are {'<div>'} elements.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    outline: 3px solid var(--Focus-Visible), outlineOffset: 2px
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Touch target (small size):</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Small indicators are visually 24px but ::after pseudo-element ensures a 24×24px minimum touch target (WCAG 2.5.8). Medium and large are 32px and 40px natively.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Connectors:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Decorative only — aria-hidden="true". Completed connectors fill with var(--Buttons-{'{C}'}-Button). Incomplete connectors use var(--Border), optionally dashed.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Color tokens:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Selected/completed: bg var(--Buttons-{'{C}'}-Button), text var(--Buttons-{'{C}'}-Text), border var(--Buttons-{'{C}'}-Border).{'\n'}
                    Unselected: bg transparent, text var(--Text), hover var(--Hover), active var(--Active).
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
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>24×24 indicator, 11px indicator text, 13px label. ::after ensures 24×24 touch target.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>32×32 indicator, 13px indicator text, 14px label.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>40×40 indicator, 16px indicator text, 16px label.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default StepperShowcase;
