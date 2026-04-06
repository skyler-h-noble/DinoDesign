// src/components/Typography/TypographyShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Typography, TYPOGRAPHY_STYLES, HEADER_COLORS, TEXT_COLORS } from './Typography';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from './Typography';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';

// ─── Constants ────────────────────────────────────────────────────────────────

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const STYLE_LABELS = {
  'display-large': 'Display Large',
  'display-small': 'Display Small',
  h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4', h5: 'H5', h6: 'H6',
  'subtitle':         'Subtitle',
  'subtitle-large':   'Subtitle Large',
  'body-small':          'Body Small',
  'body-small-semibold': 'Body Small Semibold',
  'body-small-bold':     'Body Small Bold',
  'body':                'Body Medium',
  'body-semibold':       'Body Medium Semibold',
  'body-bold':           'Body Medium Bold',
  'body-large':          'Body Large',
  'body-large-semibold': 'Body Large Semibold',
  'body-large-bold':     'Body Large Bold',
  'label':        'Label',
  'label-small':  'Label Small',
  'label-large':  'Label Large',
  'caption':      'Caption',
  'caption-bold': 'Caption Bold',
  'legal':        'Legal',
  'legal-semibold': 'Legal Semibold',
  'overline':       'Overline Medium',
  'overline-small': 'Overline Small',
  'overline-large': 'Overline Large',
  'button':              'Button Standard',
  'button-small':        'Button Small',
  'button-extra-small':  'Button Extra Small',
  'number-large':  'Number Large',
  'number-medium': 'Number Medium',
  'number-small':  'Number Small',
};

const STYLE_GROUPS = {
  Display:       ['display-large', 'display-small'],
  Headings:      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  Subtitle:      ['subtitle', 'subtitle-large'],
  'Body Small':  ['body-small', 'body-small-semibold', 'body-small-bold'],
  'Body Medium': ['body', 'body-semibold', 'body-bold'],
  'Body Large':  ['body-large', 'body-large-semibold', 'body-large-bold'],
  Label:         ['label', 'label-small', 'label-large'],
  Caption:       ['caption', 'caption-bold'],
  Legal:         ['legal', 'legal-semibold'],
  Overline:      ['overline-small', 'overline', 'overline-large'],
  Button:        ['button-extra-small', 'button-small', 'button'],
  Number:        ['number-large', 'number-medium', 'number-small'],
};

const HEADING_STYLES = new Set(['display-large', 'display-small', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle', 'subtitle-large']);

// Header color → data-theme for swatch buttons
const HEADER_SWATCH_THEME = {
  default:   null,
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info-Medium',
  success:   'Success-Medium',
  warning:   'Warning-Medium',
  error:     'Error-Medium',
};

// Text color → data-theme for swatch buttons
const TEXT_SWATCH_THEME = {
  default:   null,
  quiet:     null,
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info-Medium',
  success:   'Success-Medium',
  warning:   'Warning-Medium',
  error:     'Error-Medium',
};

// Header color → CSS token
const HEADER_TOKEN_MAP = {
  default:   'var(--Header)',
  primary:   'var(--Header-Primary)',
  secondary: 'var(--Header-Secondary)',
  tertiary:  'var(--Header-Tertiary)',
  neutral:   'var(--Header-Neutral)',
  info:      'var(--Header-Info)',
  success:   'var(--Header-Success)',
  warning:   'var(--Header-Warning)',
  error:     'var(--Header-Error)',
};

// Text color → CSS token
const TEXT_TOKEN_MAP = {
  default:   'var(--Text)',
  quiet:     'var(--Quiet)',
  primary:   'var(--Text-Primary)',
  secondary: 'var(--Text-Secondary)',
  tertiary:  'var(--Text-Tertiary)',
  neutral:   'var(--Text-Neutral)',
  info:      'var(--Text-Info)',
  success:   'var(--Text-Success)',
  warning:   'var(--Text-Warning)',
  error:     'var(--Text-Error)',
};

const STYLE_CONFIG = {
  h1: { defaultColor: 'header', defaultWidth: 'fill' },
  h2: { defaultColor: 'header', defaultWidth: 'fill' },
  h3: { defaultColor: 'header', defaultWidth: 'fill' },
  h4: { defaultColor: 'header', defaultWidth: 'fill' },
  h5: { defaultColor: 'header', defaultWidth: 'fill' },
  h6: { defaultColor: 'header', defaultWidth: 'fill' },
  'display-large':       { defaultColor: 'header',   defaultWidth: 'fill' },
  'display-small':       { defaultColor: 'header',   defaultWidth: 'fill' },
  'subtitle':            { defaultColor: 'header',   defaultWidth: 'fill' },
  'subtitle-large':      { defaultColor: 'header',   defaultWidth: 'fill' },
  'body':                { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-semibold':       { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-bold':           { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-small':          { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-small-semibold': { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-small-bold':     { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-large':          { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-large-semibold': { defaultColor: 'standard', defaultWidth: 'fill' },
  'body-large-bold':     { defaultColor: 'standard', defaultWidth: 'fill' },
  'label':               { defaultColor: 'standard', defaultWidth: 'hug' },
  'label-small':         { defaultColor: 'standard', defaultWidth: 'hug' },
  'label-large':         { defaultColor: 'standard', defaultWidth: 'hug' },
  'caption':             { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'caption-bold':        { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'legal':               { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'legal-semibold':      { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'overline-small':      { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'overline':            { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'overline-large':      { defaultColor: 'quiet',    defaultWidth: 'hug' },
  'button-extra-small':  { defaultColor: 'standard', defaultWidth: 'hug' },
  'button-small':        { defaultColor: 'standard', defaultWidth: 'hug' },
  'button':              { defaultColor: 'standard', defaultWidth: 'hug' },
  'number-large':        { defaultColor: 'standard', defaultWidth: 'hug' },
  'number-medium':       { defaultColor: 'standard', defaultWidth: 'hug' },
  'number-small':        { defaultColor: 'standard', defaultWidth: 'hug' },
};

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {ratio}:1
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)' }}>
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

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function TypographyShowcase() {
  const [textStyle, setTextStyle] = useState('body');
  const [color, setColor]         = useState('');
  const [width, setWidth]         = useState('');
  const [sampleText, setSampleText] = useState(SAMPLE_TEXT);
  const [noWrap, setNoWrap]       = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');
  const [contrastData, setContrastData] = useState({});

  const isHeading = HEADING_STYLES.has(textStyle);
  const currentConfig = STYLE_CONFIG[textStyle] || STYLE_CONFIG.body;
  const resolvedColor = color || (isHeading ? 'default' : currentConfig.defaultColor === 'standard' ? 'default' : currentConfig.defaultColor);
  const resolvedWidth = width || currentConfig.defaultWidth;
  const availableColors = isHeading ? HEADER_COLORS : TEXT_COLORS;
  const tokenMap = isHeading ? HEADER_TOKEN_MAP : TEXT_TOKEN_MAP;

  const generateCode = () => {
    const parts = ['textStyle="' + textStyle + '"'];
    if (color) parts.push('color="' + color + '"');
    if (width) parts.push('width="' + width + '"');
    if (noWrap) parts.push('noWrap');
    const preview = sampleText.length > 50 ? sampleText.substring(0, 50) + '...' : sampleText;
    return '<Typography ' + parts.join(' ') + '>\n  ' + preview + '\n</Typography>';
  };

  useEffect(() => {
    const data = {};
    data.background = getCssVar('--Background');
    // Header colors
    HEADER_COLORS.forEach(c => {
      const varName = c === 'default' ? '--Header' : '--Header-' + cap(c);
      data['header_' + c] = getCssVar(varName);
    });
    // Text colors
    TEXT_COLORS.forEach(c => {
      const varName = c === 'default' ? '--Text' : c === 'quiet' ? '--Text-Quiet' : '--Text-' + cap(c);
      data['text_' + c] = getCssVar(varName);
    });
    setContrastData(data);
  }, []);

  // Get current text color value for accessibility check
  const getCurrentColorValue = () => {
    const key = color || resolvedColor;
    if (isHeading) return contrastData['header_' + key];
    return contrastData['text_' + key];
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Typography</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview */}
          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <Typography
                textStyle={textStyle}
                color={color || undefined}
                width={width || undefined}
                noWrap={noWrap}
              >
                {sampleText}
              </Typography>
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
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
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

                  {/* Color */}
                  <Box sx={{ mt: 0, mb: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      {isHeading ? 'HEADER COLOR' : 'TEXT COLOR'}
                    </OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {availableColors.map((c) => {
                        const isSel = color === c || (color === '' && c === 'default');
                        // Resolve the actual color token for this swatch background
                        const swatchBg = isHeading
                          ? (c === 'default' ? 'var(--Header)' : 'var(--Header-' + cap(c) + ')')
                          : (c === 'default' ? 'var(--Text)' : c === 'quiet' ? 'var(--Quiet)' : 'var(--Text-' + cap(c) + ')');
                        return (
                          <Box key={c} component="button"
                            onClick={() => setColor(c === 'default' ? '' : c)}
                            aria-label={'Select ' + cap(c)} aria-pressed={isSel} title={cap(c)}
                            sx={{
                              width: 'var(--Button-Height)', height: 'var(--Button-Height)',
                              borderRadius: '4px',
                              backgroundColor: swatchBg,
                              border: isSel ? '2px solid var(--Text)' : '2px solid var(--Border)',
                              outline: isSel ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
                              outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
                            }}>
                            {isSel && <CheckIcon sx={{ fontSize: 16, color: 'var(--Background)', pointerEvents: 'none' }} />}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Style groups */}
                  {Object.entries(STYLE_GROUPS).map(([group, styles]) => (
                    <Box key={group} sx={{ mt: group === 'Headings' ? 2 : 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                        {'STYLE — ' + group.toUpperCase()}
                      </OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {styles.map((s) => (
                          <ControlButton key={s} label={STYLE_LABELS[s]} selected={textStyle === s}
                            onClick={() => { setTextStyle(s); setColor(''); setWidth(''); }} />
                        ))}
                      </Stack>
                    </Box>
                  ))}

                  {/* Width */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>WIDTH</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['default', 'hug', 'fill'].map((w) => (
                        <ControlButton key={w} label={cap(w)} selected={width === (w === 'default' ? '' : w)}
                          onClick={() => setWidth(w === 'default' ? '' : w)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Sample text */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SAMPLE TEXT</OverlineSmall>
                    <Input
                      variant="primary-outline"
                      size="small"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Box>

                  {/* noWrap */}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>noWrap</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Truncate with ellipsis on overflow</Caption>
                    </Box>
                    <Checkbox
                      checked={noWrap}
                      onChange={(e) => setNoWrap(e.target.checked)}
                      size="small"
                      aria-label="Toggle noWrap"
                    />
                  </Box>
                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {STYLE_LABELS[textStyle]} / {cap(resolvedColor)} / {cap(resolvedWidth)}
                    {noWrap ? ' / noWrap' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Current color contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Selected color vs page background.
                      </BodySmall>
                      <A11yRow
                        label={(tokenMap[resolvedColor] || tokenMap.default) + ' vs. var(--Background)'}
                        ratio={getContrast(getCurrentColorValue(), contrastData.background)}
                        threshold={4.5}
                        note={STYLE_LABELS[textStyle] + ' — ' + cap(resolvedColor) + ' color'} />
                    </Box>

                    {/* Semantics */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Semantic elements:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            H1–H6 → &lt;h1&gt;–&lt;h6&gt; · Body → &lt;p&gt; · Label → &lt;label&gt; · Button, Caption, Overline → &lt;span&gt;
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Heading hierarchy:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Use headings in order — don't skip levels. One H1 per page. Screen readers use heading levels for navigation.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Cognitive accessibility:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            All line-heights use var(--Cognitive-Multiplier, 1) for adaptive spacing. Increasing this improves readability for dyslexia or cognitive differences.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>noWrap truncation:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Content is clipped with ellipsis but remains accessible to screen readers. Add a title attribute or tooltip for sighted users.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>component override:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            The component prop renders any style with any HTML element — e.g. H2 style as &lt;h3&gt; when visual and semantic hierarchy differ.
                          </Caption>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Type scale reference */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Type Scale Reference</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>All styles with current design tokens</BodySmall>
                      <Stack spacing={2}>
                        {Object.entries(STYLE_GROUPS).map(([group, styles]) => (
                          <Box key={group}>
                            <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                              {group.toUpperCase()}
                            </OverlineSmall>
                            {styles.map((s) => (
                              <Box key={s} sx={{ py: 1, borderBottom: '1px solid var(--Border)', display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                <Box sx={{ width: 100, flexShrink: 0 }}>
                                  <Caption style={{ color: 'var(--Text-Quiet)' }}>{STYLE_LABELS[s]}</Caption>
                                </Box>
                                <Typography textStyle={s}>{SAMPLE_TEXT.substring(0, 36)}</Typography>
                              </Box>
                            ))}
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

export default TypographyShowcase;