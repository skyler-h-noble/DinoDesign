// src/components/Card/CardShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import { Card, CardContent, CardOverflow, CardActions } from './Card';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
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
const DARK_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

// ── Contrast helpers ──────────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
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
    <Button iconOnly variant="ghost" size="small" onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'} title={copied ? 'Copied!' : 'Copy code'}
      sx={{ color: copied ? '#4ade80' : '#9ca3af' }}>
      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
    </Button>
  );
}

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const dataTheme = variant === 'light'
    ? LIGHT_THEME_MAP[color]
    : variant === 'dark'
      ? DARK_THEME_MAP[color]
      : SOLID_THEME_MAP[color];
  const dataSurface = variant === 'dark' ? 'Surface-Dimmest' : 'Surface';

  return (
    <Box
      component="button"
      data-theme={dataTheme}
      data-surface={dataSurface}
      onClick={() => onClick(color)}
      aria-label={'Select ' + cap(color)}
      aria-pressed={selected}
      title={cap(color)}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}
    >
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// ── Indented checkbox row (used for Selected and Elevated under Clickable) ───

function IndentedCheckRow({ label, caption, checked, onChange }) {
  return (
    <Box sx={{
      mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      pl: 2, borderLeft: '2px solid var(--Buttons-Primary-Border)',
    }}>
      <Box>
        <Label>{label}</Label>
        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{caption}</Caption>
      </Box>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        size="small"
        aria-label={label}
      />
    </Box>
  );
}

// ── Main showcase ─────────────────────────────────────────────────────────────

export function CardShowcase() {
  const [variant, setVariant]         = useState('default');
  const [color, setColor]             = useState('primary');
  const [size, setSize]               = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [clickable, setClickable]     = useState(false);
  const [selected, setSelected]       = useState(false);
  const [elevated, setElevated]       = useState(false);
  const [bgTheme, setBgTheme]         = useState(null);
  const [bgSurface, setBgSurface]     = useState('Surface');
  const [contrastData, setContrastData] = useState({});

  const isDefault = variant === 'default';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    if (variant === 'dark')  return DARK_THEME_MAP[color]  || '';
    return '';
  };

  const getBorderToken = () => {
    if (elevated) return 'var(--Buttons-Default-Border) [2px]';
    if (clickable || selected) return 'var(--Buttons-Default-Border)';
    return 'var(--Border-Variant)';
  };

  const generateCode = () => {
    const parts = ['variant="' + variant + '"'];
    if (!isDefault) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (orientation !== 'vertical') parts.push('orientation="horizontal"');
    if (clickable) parts.push('clickable');
    if (selected) parts.push('selected');
    if (elevated) parts.push('elevated');
    return (
      '<Card ' + parts.join(' ') + '>\n' +
      '  <CardContent>\n' +
      '    <H5>Card Title</H5>\n' +
      '    <Body>Card description goes here.</Body>\n' +
      '  </CardContent>\n' +
      '  <CardActions>\n' +
      '    <Button variant="default" size="small">Action</Button>\n' +
      '  </CardActions>\n' +
      '</Card>'
    );
  };

  useEffect(() => {
    const data = {};
    data.text          = getCssVar('--Text');
    data.textQuiet     = getCssVar('--Text-Quiet');
    data.surface       = getCssVar('--Surface');
    data.background    = getCssVar('--Background');
    data.border        = getCssVar('--Border');
    data.borderVariant = getCssVar('--Border-Variant');
    data.focusVisible  = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Card</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: orientation === 'horizontal' ? 480 : 320 }}>
              <Card
                variant={variant}
                color={color}
                size={size}
                orientation={orientation}
                clickable={clickable}
                selected={selected}
                elevated={elevated}
                onClick={clickable ? () => {} : undefined}
              >
                {orientation === 'horizontal' && (
                  <CardOverflow>
                    <Box sx={{
                      width: 140, minHeight: 120,
                      backgroundColor: 'var(--Surface-Dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Box sx={{ fontSize: '32px', opacity: 0.4 }}>📷</Box>
                    </Box>
                  </CardOverflow>
                )}
                {orientation === 'vertical' && (
                  <CardOverflow>
                    <Box sx={{
                      width: '100%', height: 120,
                      backgroundColor: 'var(--Surface-Dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Box sx={{ fontSize: '32px', opacity: 0.4 }}>📷</Box>
                    </Box>
                  </CardOverflow>
                )}
                <CardContent>
                  <H5>Card Title</H5>
                  <Body style={{ color: 'var(--Text-Quiet)' }}>
                    A brief description of the card content with supporting details.
                  </Body>
                </CardContent>
                <CardActions>
                  <Button variant="default" size="small">Action</Button>
                  <Button iconOnly variant="ghost" size="small" aria-label="Save to favourites"
                    sx={{ ml: 'auto' }}>
                    <FavoriteIcon fontSize="small" />
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </PreviewSurface>

          {/* JSX Code */}
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{
                fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block',
              }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>

            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker
                      theme={bgTheme}
                      onThemeChange={setBgTheme}
                      surface={bgSurface}
                      onSurfaceChange={setBgSurface}
                    />
                  </Box>

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['default', 'solid', 'light', 'dark'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {isDefault
                        ? 'No theme — inherits from parent context.'
                        : variant === 'dark'
                          ? 'Dark — data-theme="{Color}" · data-surface="Surface-Dimmest".'
                          : cap(variant) + ' — themed card with scoped color tokens.'}
                    </Caption>
                  </Box>

                  {/* Color */}
                  {!isDefault && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {COLORS.map((c) => (
                          <ColorSwatchButton key={c} color={c} variant={variant} selected={color === c} onClick={setColor} />
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
                      Padding: var(--Card-Padding). Gap and font-size scale with size.
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

                  {/* States */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STATES</OverlineSmall>

                    {/* Clickable */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Clickable</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          {isDefault
                            ? 'Upgrades border from var(--Border-Variant) → var(--Buttons-Default-Border).'
                            : 'Adds hover shadow, active scale, focus ring.'}
                        </Caption>
                      </Box>
                      <Checkbox
                        checked={clickable}
                        onChange={(e) => {
                          setClickable(e.target.checked);
                          if (!e.target.checked) setSelected(false);
                        }}
                        size="small"
                        aria-label="Clickable"
                      />
                    </Box>

                    {/* Selected — only shown when clickable */}
                    {clickable && (
                      <IndentedCheckRow
                        label="Selected"
                        caption='Applies var(--Buttons-Primary-Border) ring. Sets aria-pressed="true".'
                        checked={selected}
                        onChange={setSelected}
                      />
                    )}

                    {/* Elevated */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Elevated</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Adds card-elevated class. Border becomes 2px solid var(--Buttons-Default-Border).
                        </Caption>
                      </Box>
                      <Checkbox
                        checked={elevated}
                        onChange={(e) => setElevated(e.target.checked)}
                        size="small"
                        aria-label="Elevated"
                      />
                    </Box>
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {size} / {orientation}
                    {clickable ? ' / clickable' : ''}
                    {selected ? ' / selected' : ''}
                    {elevated ? ' / elevated' : ''}
                    {!isDefault ? ' — data-theme="' + getThemeName() + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Readability */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Readability (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Card text must be readable against the card background.
                      </BodySmall>
                      {isDefault ? (
                        <>
                          <A11yRow
                            label="var(--Text) vs. var(--Background)"
                            ratio={getContrast(contrastData.text, contrastData.background)}
                            threshold={4.5}
                            note="Primary text on default card"
                          />
                          <A11yRow
                            label="var(--Text-Quiet) vs. var(--Background)"
                            ratio={getContrast(contrastData.textQuiet, contrastData.background)}
                            threshold={4.5}
                            note="Secondary text on default card"
                          />
                        </>
                      ) : (
                        <A11yRow
                          label="var(--Text) vs. var(--Surface)"
                          ratio={getContrast(contrastData.text, contrastData.surface)}
                          threshold={4.5}
                          note={'Text within data-theme="' + getThemeName() + '"'}
                        />
                      )}
                    </Box>

                    {/* Container Boundary */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Container Boundary (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Card must be distinguishable from the page background.
                      </BodySmall>
                      <A11yRow
                        label="Border vs. var(--Background)"
                        ratio={getContrast(
                          (elevated || clickable || selected)
                            ? getCssVar('--Buttons-Default-Border')
                            : contrastData.borderVariant,
                          contrastData.background,
                        )}
                        threshold={3.0}
                        note={'Border token: ' + getBorderToken()}
                      />
                    </Box>

                    {/* Interactive States */}
                    {clickable && (
                      <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                        <H5>Interactive States (WCAG 1.4.11 — 3:1)</H5>
                        <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                          Focus ring and selection indicator must contrast 3:1 against card background.
                        </BodySmall>
                        <A11yRow
                          label="Focus: var(--Focus-Visible) vs. card background"
                          ratio={getContrast(contrastData.focusVisible, isDefault ? contrastData.background : contrastData.surface)}
                          threshold={3.0}
                          note="outline: 3px solid var(--Focus-Visible); outline-offset: 3px; border-radius: calc(var(--Card-Radius) + 3px)"
                        />
                        {selected && (
                          <A11yRow
                            label="Selected ring: var(--Buttons-Primary-Border) vs. card background"
                            ratio={getContrast(getCssVar('--Buttons-Primary-Border'), isDefault ? contrastData.background : contrastData.surface)}
                            threshold={3.0}
                            note="border-color + box-shadow: 0 0 0 2px var(--Buttons-Primary-Border)"
                          />
                        )}
                      </Box>
                    )}

                    {/* ARIA and Semantics */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Surface attribute:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            data-surface="Container" on all cards
                          </Caption>
                        </Box>
                        {!isDefault && (
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Theme attribute:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                              {'data-theme="' + getThemeName() + '"'}
                            </Caption>
                          </Box>
                        )}
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Clickable card:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            role="button", tabIndex=0. Enter and Space activate. Hover adds shadow, active scales to 0.995.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Selected card:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            aria-pressed="true". Ring: var(--Buttons-Primary-Border). Hover locked to selection ring.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Elevated card:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            Adds class card-elevated. Border: 2px solid var(--Buttons-Default-Border). Independent of clickable/selected.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Focus indicator:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            outline: 3px solid var(--Focus-Visible); outline-offset: 3px; border-radius: calc(var(--Card-Radius) + 3px)
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>CardOverflow:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Bleeds content to card edges via negative margins matching var(--Card-Padding). Adapts to orientation.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>CardCover:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Absolutely positioned behind CardContent (z-index: 0). Images use object-fit: cover. Overlaid content must maintain contrast.
                          </Caption>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Size Reference */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Size Reference</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Small',  gap: '8px',  fontSize: '13px' },
                          { label: 'Medium', gap: '12px', fontSize: '14px' },
                          { label: 'Large',  gap: '16px', fontSize: '16px' },
                        ].map(({ label, gap, fontSize }, i, arr) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                            <BodySmall>
                              {label}{size === label.toLowerCase() ? ' ← current' : ''}
                            </BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>
                              var(--Card-Padding) padding · {gap} gap · {fontSize} text
                            </Caption>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                  </Stack>
                </Box>
              </TabPanel>
            </Tabs>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CardShowcase;