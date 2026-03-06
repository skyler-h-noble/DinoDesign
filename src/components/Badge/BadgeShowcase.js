// src/components/Badge/BadgeShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, TextField,
  Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge } from './Badge';
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
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

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

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box
        onClick={() => onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          cursor: 'pointer',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          '&:hover': { transform: 'scale(1.1)' },
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

export function BadgeShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [badgeContent, setBadgeContent] = useState('5');
  const [isDot, setIsDot] = useState(false);
  const [showZero, setShowZero] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const styles = ['solid', 'outline', 'light'];

  // Map style + color to variant string
  const getVariant = () => {
    if (style === 'solid') return color;
    return color + '-' + style;
  };

  // Parse badge content — number or string
  const getParsedContent = () => {
    if (isDot) return undefined;
    const num = parseInt(badgeContent, 10);
    if (!isNaN(num) && String(num) === badgeContent.trim()) return num;
    return badgeContent || undefined;
  };

  // Code snippet
  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (isDot) {
      parts.push('dot');
    } else {
      const parsed = getParsedContent();
      if (typeof parsed === 'number') parts.push('badgeContent={' + parsed + '}');
      else if (parsed) parts.push('badgeContent="' + parsed + '"');
    }
    if (showZero) parts.push('showZero');
    return '<Badge ' + parts.join(' ') + '>\n  <MailIcon />\n</Badge>';
  };

  // Contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};

    if (style === 'solid') {
      data.badgeBg = getCssVar('--Buttons-' + C + '-Button');
      data.badgeText = getCssVar('--Buttons-' + C + '-Text');
      data.badgeBorder = null;
    } else if (style === 'outline') {
      data.badgeBg = getCssVar('--Background');
      data.badgeText = getCssVar('--Text');
      data.badgeBorder = getCssVar('--Buttons-' + C + '-Border');
    } else if (style === 'light') {
      data.badgeBg = getCssVar('--Buttons-' + C + '-Button');
      data.badgeText = getCssVar('--Buttons-' + C + '-Text');
      data.badgeBorder = getCssVar('--Buttons-' + C + '-Border');
    }

    data.background = getCssVar('--Background');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [style, color]);

  const sizeDetails = {
    small:  { badge: '16px', dot: '8px', font: '10px' },
    medium: { badge: '20px', dot: '10px', font: '12px' },
    large:  { badge: '24px', dot: '12px', font: '14px' },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <H2 style={{ marginBottom: 8 }}>Badge</H2>
      <Body color="quiet" style={{ marginBottom: 24 }}>
        Small label attached to an element showing status or count.
        Solid, outline, and light variants across all 8 colors.
      </Body>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ borderBottom: '1px solid var(--Border)', mb: 0 }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
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
              <Stack direction="row" spacing={6} alignItems="center">
                <Badge
                  variant={getVariant()}
                  size={size}
                  badgeContent={getParsedContent()}
                  dot={isDot}
                  showZero={showZero}
                >
                  <MailIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
                </Badge>
                <Badge
                  variant={getVariant()}
                  size={size}
                  badgeContent={getParsedContent()}
                  dot={isDot}
                  showZero={showZero}
                >
                  <NotificationsIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
                </Badge>
                <Badge
                  variant={getVariant()}
                  size={size}
                  badgeContent={getParsedContent()}
                  dot={isDot}
                  showZero={showZero}
                >
                  <ShoppingCartIcon sx={{ fontSize: 32, color: 'var(--Text-Quiet)' }} />
                </Badge>
              </Stack>
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
                Badge {sizeDetails[size]?.badge} · Dot {sizeDetails[size]?.dot} · Font {sizeDetails[size]?.font}
              </Caption>
            </Box>

            {/* Badge Content */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BADGE CONTENT</OverlineSmall>
              <TextField
                size="small"
                value={badgeContent}
                onChange={(e) => setBadgeContent(e.target.value)}
                placeholder="Number or text"
                disabled={isDot}
                sx={{
                  width: '160px',
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    backgroundColor: 'var(--Background)',
                    '& fieldset': { borderColor: 'var(--Border)' },
                    '&:hover fieldset': { borderColor: 'var(--Border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'var(--Text)',
                    padding: '6px 12px',
                  },
                }}
              />
            </Box>

            {/* Dot + Show Zero */}
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<MuiCheckbox checked={isDot} onChange={(e) => setIsDot(e.target.checked)} size="small" />}
                label={<BodySmall>Dot (no content)</BodySmall>}
              />
              <FormControlLabel
                control={<MuiCheckbox checked={showZero} onChange={(e) => setShowZero(e.target.checked)} size="small" />}
                label={<BodySmall>Show zero</BodySmall>}
              />
            </Box>
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
            {/* Text contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Badge Text Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Badge text must have ≥ 4.5:1 contrast against badge background (WCAG 1.4.3 AA)
              </BodySmall>
              <A11yRow
                label="Badge Text vs. Badge Background"
                ratio={getContrast(contrastData.badgeText, contrastData.badgeBg)}
                threshold={4.5}
                note={style === 'solid'
                  ? 'var(--Buttons-{C}-Text) vs var(--Buttons-{C}-Button)'
                  : style === 'outline'
                    ? 'var(--Text) vs var(--Background)'
                    : 'var(--Buttons-{C}-Text) vs var(--Buttons-{C}-Button)'
                }
              />
            </Box>

            {/* Badge vs page background */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Badge Visibility</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Badge background (or border) must have ≥ 3:1 contrast against page background (WCAG 1.4.11)
              </BodySmall>
              {(() => {
                const bgVsBg = getContrast(contrastData.badgeBg, contrastData.background);
                const borderVsBg = contrastData.badgeBorder
                  ? getContrast(contrastData.badgeBorder, contrastData.background)
                  : null;
                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };
                return (
                  <A11yRow
                    label="Badge vs. Page Background"
                    ratio={bestOf(bgVsBg, borderVsBg)}
                    threshold={3.1}
                    note={style === 'outline'
                      ? 'Border ' + (borderVsBg || '--') + ':1 — outline relies on border contrast'
                      : 'BG ' + (bgVsBg || '--') + ':1'}
                  />
                );
              })()}
            </Box>

            {/* Size info */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Badge Sizing</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Badge dimensions per size setting
              </BodySmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Badge height ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {sizeDetails[size]?.badge} height · {sizeDetails[size]?.font} font · pill shape
                  </Caption>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Dot size ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {sizeDetails[size]?.dot} diameter circle
                  </Caption>
                </Box>
              </Box>
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Screenreader support:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    MUI Badge renders badge content in a visually-hidden span for assistive technology.
                    Numeric content is announced (e.g. "5 notifications").
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Dot variant:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Dot badges are purely decorative. Ensure the parent element conveys status to assistive tech via aria-label or similar.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Max overflow:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When content exceeds max (default 99), displays "99+" visually but announces the actual number to screenreaders.
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
