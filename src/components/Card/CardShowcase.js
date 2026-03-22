// src/components/Card/CardShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Card, CardContent, CardOverflow, CardActions } from './Card';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

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

export function CardShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [clickable, setClickable] = useState(false);
  const [selected, setSelected] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };
  const getBorderToken = () => {
    if (!isDefault) return 'var(--Border)';
    return clickable ? 'var(--Border)' : 'var(--Border-Variant)';
  };

  const generateCode = () => {
    const parts = ['variant="' + variant + '"'];
    if (!isDefault) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (orientation !== 'vertical') parts.push('orientation="horizontal"');
    if (clickable) parts.push('clickable');
    if (selected) parts.push('selected');
    return '<Card ' + parts.join(' ') + '>\n  <CardContent>\n    <H5>Card Title</H5>\n    <Body>Card description goes here.</Body>\n  </CardContent>\n  <CardActions>\n    <button>Action</button>\n  </CardActions>\n</Card>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.surface = getCssVar('--Surface');
    data.background = getCssVar('--Background');
    data.container = getCssVar('--Container');
    data.border = getCssVar('--Border');
    data.borderVariant = getCssVar('--Border-Variant');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Card</H2>
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
              minHeight: 320, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%', maxWidth: orientation === 'horizontal' ? 480 : 320 }}>
                <Card
                  variant={variant}
                  color={color}
                  size={size}
                  orientation={orientation}
                  clickable={clickable}
                  selected={selected}
                  onClick={clickable ? () => {} : undefined}
                >
                  {orientation === 'horizontal' && (
                    <CardOverflow>
                      <Box sx={{ width: 140, minHeight: 120, backgroundColor: 'var(--Surface-Dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ fontSize: '32px', opacity: 0.4 }}>📷</Box>
                      </Box>
                    </CardOverflow>
                  )}
                  {orientation === 'vertical' && (
                    <CardOverflow>
                      <Box sx={{ width: '100%', height: 120, backgroundColor: 'var(--Surface-Dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ fontSize: '32px', opacity: 0.4 }}>📷</Box>
                      </Box>
                    </CardOverflow>
                  )}
                  <CardContent>
                    <Box sx={{ fontWeight: 700, fontSize: size === 'large' ? '18px' : size === 'small' ? '14px' : '16px' }}>Card Title</Box>
                    <Box sx={{ color: 'var(--Text-Quiet)', fontSize: 'inherit' }}>
                      A brief description of the card content with supporting details.
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Box component="button" sx={{
                      px: 2, py: 0.5, fontSize: '13px', fontFamily: 'inherit', fontWeight: 600,
                      border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                      backgroundColor: 'transparent', color: 'var(--Text)', cursor: 'pointer',
                      '&:hover': { backgroundColor: 'var(--Surface-Dim)' },
                    }}>Action</Box>
                    <MuiIconButton size="small" sx={{ color: 'var(--Text-Quiet)', ml: 'auto' }}>
                      <FavoriteIcon fontSize="small" />
                    </MuiIconButton>
                  </CardActions>
                </Card>
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
              <Stack direction="row" spacing={1}>
                {['default', 'solid', 'light'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isDefault
                  ? 'No theme — inherits from parent context.'
                  : cap(variant) + ' — themed card with scoped color tokens.'}
              </Caption>
            </Box>

            {/* Color */}
            {!isDefault && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Padding scales with size: small var(--Sizing-1), medium var(--Sizing-2), large var(--Sizing-3).
              </Caption>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['vertical', 'horizontal'].map((o) => (
                  <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {orientation === 'vertical'
                  ? 'flex-direction: column. Image stacks above content.'
                  : 'flex-direction: row. Image sits beside content.'}
              </Caption>
            </Box>

            {/* Clickable */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>Clickable</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                  {isDefault
                    ? 'Adds hover/focus. Upgrades border from var(--Border-Variant) \u2192 var(--Border).'
                    : 'Adds hover shadow, active scale, 3px inset focus ring.'}
                </Caption>
              </Box>
              <Switch checked={clickable} onChange={(e) => { setClickable(e.target.checked); if (!e.target.checked) setSelected(false); }} size="small" />
            </Box>

            {/* Selected — only shown when clickable is on */}
            {clickable && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                pl: 2, borderLeft: '2px solid var(--Buttons-Primary-Border)' }}>
                <Box>
                  <Label>Selected</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                    Applies var(--Buttons-Primary-Border) ring. Sets aria-pressed="true".
                  </Caption>
                </Box>
                <Switch checked={selected} onChange={(e) => setSelected(e.target.checked)} size="small" />
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
            Based on current settings: {variant} / {size} / {orientation}
            {clickable ? ' / clickable' : ''}
            {selected ? ' / selected' : ''}
            {!isDefault ? ' \u2014 data-theme="' + getThemeName() + '"' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Readability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Card text must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              {isDefault ? (
                <>
                  <A11yRow label="var(--Text) vs. var(--Background)"
                    ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                    note="Primary text on default card" />
                  <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                    ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                    note="Secondary text on default card" />
                </>
              ) : (
                <A11yRow label="var(--Text) vs. var(--Surface)"
                  ratio={getContrast(contrastData.text, contrastData.surface)} threshold={4.5}
                  note={'Text within data-theme="' + getThemeName() + '"'} />
              )}
            </Box>

            {/* Container Boundary */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Container Boundary</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Card must be distinguishable from page (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label="Border vs. page var(--Background)"
                ratio={getContrast(isDefault && !clickable ? contrastData.borderVariant : contrastData.border, contrastData.background)} threshold={3.0}
                note={'Border token: ' + getBorderToken()} />
            </Box>

            {/* Interactive States */}
            {clickable && (
              <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>Interactive States</H5>
                <BodySmall color="quiet" style={{ marginBottom: 16 }}>Clickable card must have visible hover and focus (WCAG 1.4.11)</BodySmall>
                <A11yRow label="Focus: var(--Focus-Visible) vs. card background"
                  ratio={getContrast(contrastData.focusVisible, isDefault ? contrastData.background : contrastData.surface)} threshold={3.0}
                  note="3px inset focus ring" />
                {selected && (
                  <A11yRow label="Selected ring: var(--Buttons-Primary-Border) vs. card background"
                    ratio={getContrast(getCssVar('--Buttons-Primary-Border'), isDefault ? contrastData.background : contrastData.surface)} threshold={3.0}
                    note="border-color + 0 0 0 2px box-shadow — must meet 3:1 (WCAG 1.4.11)" />
                )}
              </Box>
            )}

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>data-surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    data-surface="Container" on all cards
                  </Caption>
                </Box>
                {!isDefault && (
                  <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>data-theme:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                      data-theme="{getThemeName()}"
                    </Caption>
                  </Box>
                )}
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clickable card:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    role="button", tabIndex=0. Enter and Space activate. Hover adds shadow, active scales to 0.995. Default variant upgrades border from var(--Border-Variant) to var(--Border) for stronger affordance.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected card:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-pressed="true". Border and box-shadow use var(--Buttons-Primary-Border). Hover state is locked to the selection ring to prevent visual conflict.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    outline: 3px solid var(--Focus-Visible), outlineOffset: -3px (inset)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>CardOverflow:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Bleeds content to card edges via negative margins matching var(--Card-Padding). Adapts to horizontal or vertical orientation.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>CardCover:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Absolutely positioned behind CardContent (z-index: 0). Images use object-fit: cover. Content layered above must maintain contrast.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Sizes */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Card-Padding) padding, 8px gap, 13px text.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Card-Padding) padding, 12px gap, 14px text.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>var(--Card-Padding) padding, 16px gap, 16px text.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default CardShowcase;