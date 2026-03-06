// src/components/Slider/SliderShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  TextField, Switch, Divider, Tooltip, IconButton as MuiIconButton,
  Accordion, AccordionSummary, AccordionDetails,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Slider } from './Slider';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

// --- Contrast Calculator -----------------------------------------------------

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
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

// --- Contrast Badge ----------------------------------------------------------

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700,
      }}>
        {ratio}:1
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

// --- Accessibility Row -------------------------------------------------------

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)',
    }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}

// --- Copy Button -------------------------------------------------------------

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Copy failed:', err); }
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

// --- Color Swatch Button -----------------------------------------------------

function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box
        onClick={() => !isDisabled && onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px',
          opacity: isDisabled ? 0.25 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'transform 0.1s ease',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {},
        }}
      >
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

// --- Control Button ----------------------------------------------------------

function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px', fontFamily: 'inherit', fontWeight: 500,
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
      }}
    >
      {label}
    </Box>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function SliderShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [valueLabelDisplay, setValueLabelDisplay] = useState('off');
  const [disabled, setDisabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);
  const [rangeValue, setRangeValue] = useState([25, 75]);
  const [contrastData, setContrastData] = useState({});

  // Advanced settings
  const [orientation, setOrientation] = useState('horizontal');
  const [isRange, setIsRange] = useState(false);
  const [track, setTrack] = useState('normal');

  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
  const styles = ['solid', 'light'];

  // Map style + color to variant string
  const getVariant = () => {
    if (style === 'solid') return color;
    return color + '-' + style;
  };

  // Build slider props for preview
  const getSliderProps = () => ({
    variant: getVariant(),
    size,
    value: isRange ? rangeValue : sliderValue,
    onChange: (e, v) => isRange ? setRangeValue(v) : setSliderValue(v),
    valueLabelDisplay,
    orientation,
    track: track === 'inverted' ? 'inverted' : 'normal',
    disabled,
    'aria-label': isRange ? undefined : 'Slider demo',
    ...(isRange && { 'aria-label': undefined }),
    ...(isRange && { getAriaLabel: (i) => i === 0 ? 'Min value' : 'Max value' }),
  });

  // Generate code string
  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (isRange) {
      parts.push('value={[' + rangeValue.join(', ') + ']}');
    } else {
      parts.push('value={' + sliderValue + '}');
    }
    if (valueLabelDisplay !== 'off') parts.push('valueLabelDisplay="' + valueLabelDisplay + '"');
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (track !== 'normal') parts.push('track="inverted"');
    if (disabled) parts.push('disabled');
    if (isRange) {
      parts.push('getAriaLabel={(i) => i === 0 ? "Min" : "Max"}');
    } else {
      parts.push('aria-label="..."');
    }
    return '<Slider\n  ' + parts.join('\n  ') + '\n/>';
  };

  // Calculate contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};
    const bg = getCssVar('--Background');
    const focusVisible = getCssVar('--Focus-Visible');

    if (style === 'solid') {
      data.thumb = getCssVar('--Buttons-' + C + '-Button');
      data.thumbBorder = getCssVar('--Buttons-' + C + '-Border');
      data.track = getCssVar('--Buttons-' + C + '-Button');
      data.trackBorder = getCssVar('--Buttons-' + C + '-Border');
    } else if (style === 'light') {
      data.thumb = getCssVar('--Buttons-' + C + '-Button');
      data.thumbBorder = getCssVar('--Buttons-' + C + '-Border');
      data.track = getCssVar('--Buttons-' + C + '-Button');
      data.trackBorder = getCssVar('--Buttons-' + C + '-Border');
    }
    data.rail = getCssVar('--Border-Variant');
    data.valueLabel = getCssVar('--Buttons-' + C + '-Text');
    data.valueLabelText = getCssVar('--Buttons-' + C + '-Button');
    data.background = bg;
    data.focusVisible = focusVisible;
    setContrastData(data);
  }, [style, color]);

  const sizeDetails = {
    small:  { visualSize: '12px', touchTarget: '24px', note: '24px touch target, 12px visual dot' },
    medium: { visualSize: '16px', touchTarget: '24px', note: '24px touch target, 16px visual dot' },
    large:  { visualSize: '20px', touchTarget: '24px', note: '24px touch target, 20px visual dot' },
  };

  const isVertical = orientation === 'vertical';

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Slider</H2>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{
          mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } },
        }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
      {mainTab === 0 && (
        <Grid container spacing={0} sx={{ minHeight: 600, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

          {/* LEFT: Preview */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'var(--Background)',
            borderRight: '1px solid var(--Border)', minHeight: 200, minWidth: 0, overflow: 'hidden',
          }}>
            <Box sx={{
              mb: 3,
              width: isVertical ? 'auto' : '100%',
              maxWidth: isVertical ? 'auto' : 360,
              height: isVertical ? 200 : 'auto',
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
            }}>
              <Slider {...getSliderProps()} />
            </Box>

            {/* Value display */}
            <Caption style={{ color: 'var(--Text-Quiet)', marginBottom: 16 }}>
              {isRange
                ? 'Value: [' + rangeValue.join(', ') + ']'
                : 'Value: ' + sliderValue
              }
            </Caption>

            {/* Code output */}
            <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: 'var(--Style-Border-Radius)', overflow: 'hidden', minHeight: 60 }}>
                <Box sx={{ px: 2, py: 0.75, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Caption style={{ color: '#6b7280', fontFamily: 'monospace' }}>JSX</Caption>
                  <CopyButton code={generateCode()} />
                </Box>
                <Box sx={{ p: 2, overflow: 'auto' }}>
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                    {generateCode()}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Controls */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto',
          }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {styles.map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={style === s}
                    onClick={() => setStyle(s)} />
                ))}
              </Stack>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {colors.map((c) => (
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
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Value Label Display */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL DISPLAY</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['off', 'on', 'auto'].map((v) => (
                  <ControlButton key={v} label={cap(v)} selected={valueLabelDisplay === v} onClick={() => setValueLabelDisplay(v)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {valueLabelDisplay === 'off' && 'Value label hidden'}
                {valueLabelDisplay === 'on' && 'Value label always visible'}
                {valueLabelDisplay === 'auto' && 'Value label appears on hover/focus'}
              </Caption>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* Disabled */}
            <Stack spacing={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Label>Disabled</Label>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
            </Stack>

            {/* Advanced Settings */}
            <Accordion
              disableGutters elevation={0}
              sx={{
                mt: 2,
                backgroundColor: 'transparent',
                border: '1px solid var(--Border)',
                borderRadius: 'var(--Style-Border-Radius) !important',
                '&::before': { display: 'none' },
                '& .MuiAccordionSummary-root': { minHeight: 44 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--Text-Quiet)' }} />}>
                <BodySmall style={{ fontWeight: 600, color: 'var(--Text)' }}>Advanced Settings</BodySmall>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {/* Orientation */}
                <Box sx={{ mb: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
                  <Stack direction="row" spacing={1}>
                    {['horizontal', 'vertical'].map((o) => (
                      <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                    ))}
                  </Stack>
                </Box>

                {/* Range Slider */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={isRange}
                        onChange={(e) => setIsRange(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<BodySmall>Range Slider (two thumbs)</BodySmall>}
                    sx={{ marginLeft: 0 }}
                  />
                </Box>

                {/* Track */}
                <Box>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TRACK</OverlineSmall>
                  <Stack direction="row" spacing={1}>
                    {['normal', 'inverted'].map((t) => (
                      <ControlButton key={t} label={t === 'normal' ? 'Standard' : 'Inverted'} selected={track === t} onClick={() => setTrack(t)} />
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    {track === 'normal' ? 'Track fills from min to current value' : 'Track fills from current value to max'}
                  </Caption>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      )}

      {/* ACCESSIBILITY TAB */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} · {color} · {size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Handle contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Handle Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The handle background or border must have ≥ 3:1 contrast against the page background, rail, and track (WCAG 1.4.11). Passes if either meets the threshold.
              </BodySmall>
              {(() => {
                const bgVsBg    = getContrast(contrastData.thumb, contrastData.background);
                const brVsBg    = getContrast(contrastData.thumbBorder, contrastData.background);
                const bgVsRail  = getContrast(contrastData.thumb, contrastData.rail);
                const brVsRail  = getContrast(contrastData.thumbBorder, contrastData.rail);
                const bgVsTrack = getContrast(contrastData.thumb, contrastData.track);
                const brVsTrack = getContrast(contrastData.thumbBorder, contrastData.track);

                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };

                return (
                  <>
                    <A11yRow
                      label="Handle vs. Background"
                      ratio={bestOf(bgVsBg, brVsBg)}
                      threshold={3.1}
                      note={'BG ' + (bgVsBg || '--') + ':1 · Border ' + (brVsBg || '--') + ':1 — best of the two'}
                    />
                    <A11yRow
                      label="Handle vs. Rail"
                      ratio={bestOf(bgVsRail, brVsRail)}
                      threshold={3.1}
                      note={'BG ' + (bgVsRail || '--') + ':1 · Border ' + (brVsRail || '--') + ':1 — best of the two'}
                    />
                    <A11yRow
                      label="Handle vs. Track"
                      ratio={bestOf(bgVsTrack, brVsTrack)}
                      threshold={3.1}
                      note={'BG ' + (bgVsTrack || '--') + ':1 · Border ' + (brVsTrack || '--') + ':1 — best of the two'}
                    />
                  </>
                );
              })()}
            </Box>

            {/* Track contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Track Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The track background or border must have ≥ 3:1 contrast against the page background (WCAG 1.4.11). Passes if either meets the threshold.
              </BodySmall>
              {(() => {
                const trackVsBg = getContrast(contrastData.track, contrastData.background);
                const trackBrVsBg = getContrast(contrastData.trackBorder, contrastData.background);
                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };
                return (
                  <A11yRow
                    label="Track vs. Background"
                    ratio={bestOf(trackVsBg, trackBrVsBg)}
                    threshold={3.1}
                    note={'BG ' + (trackVsBg || '--') + ':1 · Border ' + (trackBrVsBg || '--') + ':1 — best of the two'}
                  />
                );
              })()}
            </Box>

            {/* Value Label contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Value Label Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The label text must have ≥ 4.5:1 contrast against the label background (WCAG 1.4.3 AA text)
              </BodySmall>
              <A11yRow
                label="Label Text vs. Label Background"
                ratio={getContrast(contrastData.valueLabelText, contrastData.valueLabel)}
                threshold={4.5}
                note={'var(--Buttons-' + cap(color) + '-Button) vs var(--Buttons-' + cap(color) + '-Text)'}
              />
            </Box>

            {/* Focus Visible */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Focus-Visible Indicator</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Focus ring must be visible to keyboard users
              </BodySmall>
              <A11yRow
                label="Focus-Visible outline vs. Background"
                ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                threshold={3.1}
                note="var(--Focus-Visible) vs var(--Background) must be >= 3:1 WCAG AA, 2px solid, 2px offset"
              />
            </Box>

            {/* Touch Target */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Handle Target Area</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Handle must be ≥ 24×24px (WCAG 2.5.8). The thumb element is always 24×24px transparent; the visual dot in ::before is purely decorative.
              </BodySmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Handle touch target</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>24×24px for all sizes — visual dot is {sizeDetails[size]?.visualSize}</Caption>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', backgroundColor: 'var(--Tags-Success-BG)', color: 'var(--Tags-Success-Text)', fontSize: '11px', fontWeight: 700 }}>
                  24px Pass
                </Box>
              </Box>
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Label Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Single slider:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-label="[descriptive text]" or aria-labelledby="[id]" required
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Range slider:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'getAriaLabel={(index) => index === 0 ? "Min" : "Max"} — labels each thumb'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>With visible label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<Slider label="Volume" /> — renders label above slider'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Value label display:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    off = hidden, on = always visible, auto = shows on hover/focus. Value is announced by screen readers regardless.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Arrow keys: ±step, Home/End: min/max, Page Up/Down: ±10%
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Disabled state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-disabled="true" — opacity 0.6, pointer-events none
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

export default SliderShowcase;
