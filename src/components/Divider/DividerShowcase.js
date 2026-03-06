// src/components/Divider/DividerShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, TextField, Divider as MuiDivider,
  Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Divider } from './Divider';
import {
  H2, H4, H5, Body, BodySmall, BodyBold, Caption, Label, OverlineSmall
} from '../Typography';

// --- Contrast helpers --------------------------------------------------------

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
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}

function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const ALL_COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// Alignment options change based on orientation
const H_ALIGNS = ['left', 'center', 'right'];
const V_ALIGNS = ['top', 'center', 'bottom'];

// --- Shared UI components ----------------------------------------------------

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
      }}>{ratio}:1</Box>
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
  const isDefault = color === 'default';
  const C = isDefault ? null : cap(color);
  return (
    <Tooltip title={isDefault ? 'Default' : C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + (isDefault ? 'default' : C)} aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: isDefault ? 'var(--Border-Variant)' : 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
          '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: isDefault ? 'var(--Text)' : 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box component="button" onClick={() => !isDisabled && onClick()}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        opacity: isDisabled ? 0.4 : 1, padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': !isDisabled ? { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' } : {},
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
      }}>
      {label}
    </Box>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function DividerShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [color, setColor] = useState('default');
  const [orientation, setOrientation] = useState('horizontal');
  const [size, setSize] = useState('small');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [indicatorText, setIndicatorText] = useState('OR');
  const [indicatorStyle, setIndicatorStyle] = useState('outline');
  const [textAlign, setTextAlign] = useState('center');
  const [contrastData, setContrastData] = useState({});

  const isVertical = orientation === 'vertical';
  const alignOptions = isVertical ? V_ALIGNS : H_ALIGNS;

  // Reset textAlign to 'center' when switching orientation
  // (avoids stale 'left'/'top' carrying over)
  const handleOrientationChange = (o) => {
    setOrientation(o);
    setTextAlign('center');
  };

  const getDividerProps = () => {
    const p = { color, orientation, size };
    if (hasIndicator) {
      p.indicatorText = indicatorText || 'OR';
      p.indicatorStyle = indicatorStyle;
      p.textAlign = textAlign;
    }
    return p;
  };

  const generateCode = () => {
    const p = getDividerProps();
    const parts = [];
    if (p.color !== 'default') parts.push('color="' + p.color + '"');
    if (p.orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (p.size !== 'small') parts.push('size="' + p.size + '"');
    if (p.indicatorText) {
      parts.push('indicatorText="' + p.indicatorText + '"');
      parts.push('indicatorStyle="' + p.indicatorStyle + '"');
      if (p.textAlign !== 'center') parts.push('textAlign="' + p.textAlign + '"');
    }
    return '<Divider' + (parts.length ? ' ' + parts.join(' ') : '') + ' />';
  };

  useEffect(() => {
    const data = {};
    const C = color !== 'default' ? cap(color) : null;
    data.lineColor = color === 'default' ? getCssVar('--Border-Variant') : getCssVar('--Buttons-' + C + '-Border');
    data.background = getCssVar('--Background');
    const effectiveC = C || 'Primary';
    if (hasIndicator) {
      if (indicatorStyle === 'light') {
        data.indicatorBg = getCssVar('--Buttons-' + effectiveC + '-Button');
        data.indicatorText = getCssVar('--Buttons-' + effectiveC + '-Text');
        data.indicatorBorder = getCssVar('--Buttons-' + effectiveC + '-Border');
      } else {
        data.indicatorBg = getCssVar('--Background');
        data.indicatorText = getCssVar('--Text');
        data.indicatorBorder = getCssVar('--Buttons-' + effectiveC + '-Border');
      }
    }
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [color, indicatorStyle, hasIndicator]);

  const sizeLabels = { small: '1px', medium: '2px', large: '4px' };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Divider</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{
          mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } },
        }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* == PLAYGROUND == */}
      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* LEFT: Preview + Code */}
          <Grid item sx={{
            width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
          }}>
            {/* Preview */}
            <Box sx={{
              p: 4,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)',
              borderBottom: '1px solid var(--Border)',
            }}>
              <Box sx={{
                width: '100%', minHeight: 120,
                display: 'flex', alignItems: isVertical ? 'stretch' : 'center',
                justifyContent: 'center', flexDirection: isVertical ? 'row' : 'column', gap: 3, px: 4,
                ...(isVertical ? { height: 200 } : {}),
              }}>
                {isVertical ? (
                  <>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BodySmall style={{ color: 'var(--Text-Quiet)' }}>Left content</BodySmall>
                    </Box>
                    <Divider {...getDividerProps()} />
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BodySmall style={{ color: 'var(--Text-Quiet)' }}>Right content</BodySmall>
                    </Box>
                  </>
                ) : (
                  <>
                    <BodySmall style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>Content above</BodySmall>
                    <Divider {...getDividerProps()} />
                    <BodySmall style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>Content below</BodySmall>
                  </>
                )}
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, borderBottom: '1px solid #333',
              }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                  {generateCode()}
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

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {ALL_COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {color === 'default' ? 'Default: var(--Border-Variant)' : cap(color) + ': var(--Buttons-' + cap(color) + '-Border)'}
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['horizontal', 'vertical'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={orientation === o}
                    onClick={() => handleOrientationChange(o)} />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s) + ' (' + sizeLabels[s] + ')'} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            <MuiDivider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* Advanced toggle */}
            <Box component="button" onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', border: 'none',
                backgroundColor: 'transparent', color: 'var(--Text)', padding: 0, fontFamily: 'inherit', fontSize: '14px', fontWeight: 600 }}>
              {showAdvanced ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              Advanced Settings
            </Box>

            {showAdvanced && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Label>Visual Indicator</Label>
                  <Switch checked={hasIndicator} onChange={(e) => setHasIndicator(e.target.checked)} size="small" />
                </Box>

                {hasIndicator && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <TextField label="Indicator Text" value={indicatorText} onChange={(e) => setIndicatorText(e.target.value)} size="small" fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': { color: 'var(--Text)', '& fieldset': { borderColor: 'var(--Border)' },
                            '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' }, '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' } },
                          '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', '&.Mui-focused': { color: 'var(--Text)' } },
                        }} />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>INDICATOR STYLE</OverlineSmall>
                      <Stack direction="row" spacing={1}>
                        {['outline', 'light'].map((s) => (
                          <ControlButton key={s} label={cap(s)} selected={indicatorStyle === s} onClick={() => setIndicatorStyle(s)} />
                        ))}
                      </Stack>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                        {indicatorStyle === 'outline' ? 'Outline: transparent bg, base text color, colored border' : 'Light: colored bg and text with colored border'}
                      </Caption>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                        {isVertical ? 'ALIGNMENT' : 'TEXT ALIGN'}
                      </OverlineSmall>
                      <Stack direction="row" spacing={1}>
                        {alignOptions.map((a) => (
                          <ControlButton key={a} label={cap(a)} selected={textAlign === a} onClick={() => setTextAlign(a)} />
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {color} / {orientation} / {size}{hasIndicator ? ' / indicator (' + indicatorStyle + ')' : ''}
          </BodySmall>
          <Stack spacing={4}>
            {/* Line visibility */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Line Visibility</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Divider line should be distinguishable from page background (WCAG 1.4.11 Non-text Contrast)
              </BodySmall>
              <A11yRow label="Divider line vs. Background"
                ratio={getContrast(contrastData.lineColor, contrastData.background)} threshold={3.0}
                note={color === 'default' ? 'var(--Border-Variant) vs var(--Background)' : 'var(--Buttons-' + cap(color) + '-Border) vs var(--Background)'} />
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'var(--Tags-Info-BG)', borderRadius: 1 }}>
                <Caption style={{ color: 'var(--Tags-Info-Text)' }}>
                  Decorative dividers that carry no semantic meaning may not require strict contrast compliance, but maintaining visible contrast improves usability for all users.
                </Caption>
              </Box>
            </Box>

            {/* ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>role="separator"</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Orientation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>aria-orientation="{orientation}"</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Usage note:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Dividers use role="separator" to communicate a thematic break to assistive technology. Screen readers announce the separator between content sections.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Indicator contrast */}
            {hasIndicator && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Indicator Text Readability</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Indicator text must maintain readable contrast against its background</BodySmall>
                <A11yRow label="Indicator text vs. indicator background"
                  ratio={getContrast(contrastData.indicatorText, contrastData.indicatorBg)} threshold={4.5}
                  note={indicatorStyle === 'outline'
                    ? 'var(--Text) vs var(--Background)'
                    : 'var(--Buttons-' + cap(color === 'default' ? 'primary' : color) + '-Text) vs var(--Buttons-' + cap(color === 'default' ? 'primary' : color) + '-Button)'} />
                <A11yRow label="Indicator border vs. page background"
                  ratio={getContrast(contrastData.indicatorBorder, contrastData.background)} threshold={3.0}
                  note="Indicator pill border must be visible against the page" />
              </Box>
            )}

            {/* Size note */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size and Visibility</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small (1px)</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Default. Subtle separation. May need higher contrast color on low-DPI displays.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium (2px)</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>More prominent. Good default for colored dividers.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large (4px)</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>High visual weight. Use sparingly for major section breaks.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default DividerShowcase;