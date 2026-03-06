// src/components/Typography/TypographyShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Typography, TYPOGRAPHY_STYLES } from './Typography';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from './Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const STYLE_LABELS = {
  h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4', h5: 'H5', h6: 'H6',
  body: 'Body', 'body-small': 'Body Small', 'body-large': 'Body Large',
  'body-semibold': 'Body Semibold', 'body-bold': 'Body Bold',
  button: 'Button', label: 'Label', caption: 'Caption', overline: 'Overline',
};

const STYLE_GROUPS = {
  Headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  Body: ['body', 'body-small', 'body-large', 'body-semibold', 'body-bold'],
  Utility: ['button', 'label', 'caption', 'overline'],
};

const COLOR_LABELS = { header: 'Header', standard: 'Standard', quiet: 'Quiet' };
const COLOR_TOKENS = { header: 'var(--Header)', standard: 'var(--Text)', quiet: 'var(--Text-Quiet)' };

const HEADER_DEFAULT_STYLES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.';
const SAMPLE_LONG = 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.';

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

export function TypographyShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [textStyle, setTextStyle] = useState('body');
  const [color, setColor] = useState('');
  const [width, setWidth] = useState('');
  const [sampleText, setSampleText] = useState(SAMPLE_TEXT);
  const [noWrap, setNoWrap] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const config = {
    h1: { defaultColor: 'header', defaultWidth: 'fill' },
    h2: { defaultColor: 'header', defaultWidth: 'fill' },
    h3: { defaultColor: 'header', defaultWidth: 'fill' },
    h4: { defaultColor: 'header', defaultWidth: 'fill' },
    h5: { defaultColor: 'header', defaultWidth: 'fill' },
    h6: { defaultColor: 'header', defaultWidth: 'fill' },
    body: { defaultColor: 'standard', defaultWidth: 'fill' },
    'body-small': { defaultColor: 'standard', defaultWidth: 'fill' },
    'body-large': { defaultColor: 'standard', defaultWidth: 'fill' },
    'body-semibold': { defaultColor: 'standard', defaultWidth: 'fill' },
    'body-bold': { defaultColor: 'standard', defaultWidth: 'fill' },
    button: { defaultColor: 'standard', defaultWidth: 'hug' },
    label: { defaultColor: 'standard', defaultWidth: 'hug' },
    caption: { defaultColor: 'quiet', defaultWidth: 'hug' },
    overline: { defaultColor: 'quiet', defaultWidth: 'hug' },
  };
  const currentConfig = config[textStyle] || config.body;
  const resolvedColor = color || currentConfig.defaultColor;
  const resolvedWidth = width || currentConfig.defaultWidth;

  const generateCode = () => {
    const parts = ['textStyle="' + textStyle + '"'];
    if (color) parts.push('color="' + color + '"');
    if (width) parts.push('width="' + width + '"');
    if (noWrap) parts.push('noWrap');
    return '<Typography ' + parts.join(' ') + '>\n  ' + sampleText.substring(0, 50) + (sampleText.length > 50 ? '...' : '') + '\n</Typography>';
  };

  useEffect(() => {
    const data = {};
    data.header = getCssVar('--Header');
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.background = getCssVar('--Background');
    setContrastData(data);
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Typography</H2>
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
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%', maxWidth: 560, overflow: 'hidden' }}>
                <Typography textStyle={textStyle} color={color || undefined} width={width || undefined} noWrap={noWrap}>
                  {sampleText}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Color: {COLOR_LABELS[resolvedColor]} ({COLOR_TOKENS[resolvedColor]})
                </Caption>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Width: {cap(resolvedWidth)}
                </Caption>
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
            {Object.entries(STYLE_GROUPS).map(([group, styles]) => (
              <Box key={group} sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  {group === 'Headings' ? 'STYLE \u2014 HEADINGS' : group === 'Body' ? 'STYLE \u2014 BODY' : 'STYLE \u2014 UTILITY'}
                </OverlineSmall>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {styles.map((s) => (
                    <ControlButton key={s} label={STYLE_LABELS[s]} selected={textStyle === s}
                      onClick={() => { setTextStyle(s); setColor(''); setWidth(''); }} />
                  ))}
                </Stack>
              </Box>
            ))}

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Default" selected={color === ''} onClick={() => setColor('')} />
                {Object.entries(COLOR_LABELS).map(([c, l]) => (
                  <ControlButton key={c} label={l} selected={color === c} onClick={() => setColor(c)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {color
                  ? cap(color) + ': ' + COLOR_TOKENS[color]
                  : 'Default: ' + COLOR_LABELS[currentConfig.defaultColor] + ' (' + COLOR_TOKENS[currentConfig.defaultColor] + ')'
                }
                {!color && HEADER_DEFAULT_STYLES.includes(textStyle) && ' \u2014 Headings auto-use Header color for text >19px bold or >24px'}
              </Caption>
            </Box>

            {/* Width */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>WIDTH</OverlineSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Default" selected={width === ''} onClick={() => setWidth('')} />
                <ControlButton label="Hug" selected={width === 'hug'} onClick={() => setWidth('hug')} />
                <ControlButton label="Fill" selected={width === 'fill'} onClick={() => setWidth('fill')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {width
                  ? cap(width) + ': ' + (width === 'hug' ? 'display: inline, width: auto' : 'display: block, width: 100%')
                  : 'Default: ' + cap(currentConfig.defaultWidth) + ' \u2014 ' + (currentConfig.defaultWidth === 'hug' ? 'inline element' : 'block element')
                }
              </Caption>
            </Box>

            {/* Sample text */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SAMPLE TEXT</OverlineSmall>
              <TextField size="small" multiline minRows={2} maxRows={4} value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                sx={{ width: '100%',
                  '& .MuiInputBase-root': { backgroundColor: 'var(--Background)', color: 'var(--Text)', fontSize: '13px', fontFamily: 'inherit' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--Border)' } }} />
            </Box>

            {/* noWrap */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>noWrap</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Truncate with ellipsis on overflow</Caption>
              </Box>
              <Box component="button" onClick={() => setNoWrap(!noWrap)}
                sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', width: 40, height: 24,
                  border: '2px solid var(--Border)', borderRadius: '12px',
                  backgroundColor: noWrap ? 'var(--Buttons-Primary-Button)' : 'transparent',
                  padding: 0, transition: 'background-color 0.15s ease',
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%',
                  backgroundColor: noWrap ? 'var(--Buttons-Primary-Text)' : 'var(--Text-Quiet)',
                  transform: noWrap ? 'translateX(6px)' : 'translateX(-6px)',
                  transition: 'transform 0.15s ease, background-color 0.15s ease' }} />
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
            Based on current settings: {STYLE_LABELS[textStyle]} / {COLOR_LABELS[resolvedColor]} / {cap(resolvedWidth)}
            {noWrap ? ' / noWrap' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Readability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Text must be readable against page background (WCAG 1.4.3)</BodySmall>
              <A11yRow label="var(--Header) vs. var(--Background)"
                ratio={getContrast(contrastData.header, contrastData.background)} threshold={4.5}
                note="Header color against page background (for headings)" />
              <A11yRow label="var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Standard color against page background (for body text)" />
              <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Quiet color against page background (for secondary text)" />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Semantic elements:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    H1-H6 render as {'<h1>-<h6>'} for document outline. Body renders as {'<p>'}. Label renders as {'<label>'}. Button, Caption, Overline render as {'<span>'}.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Heading hierarchy:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Headings must follow proper order (H1 then H2, not skipping levels). Only one H1 per page. Assistive technologies use heading levels for page navigation.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Cognitive accessibility:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    All line-height values include var(--Cognitive-Multiplier, 1) for adaptive spacing. Increasing this value improves readability for users with dyslexia or cognitive differences.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>noWrap truncation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When noWrap is enabled, content is clipped with ellipsis. The full text remains accessible to screen readers. Consider adding a title attribute or tooltip for sighted users.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Component override:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    The component prop allows rendering any style with any HTML element. For example, an H2 style rendered as {'<h3>'} for correct document outline when visual hierarchy differs from semantic hierarchy.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Type Scale */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Type Scale Reference</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>All styles rendered with current design tokens</BodySmall>
              <Stack spacing={2}>
                {Object.entries(STYLE_GROUPS).map(([group, styles]) => (
                  <Box key={group}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>{group.toUpperCase()}</OverlineSmall>
                    {styles.map((s) => (
                      <Box key={s} sx={{ py: 1, borderBottom: '1px solid var(--Border)', display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <Box sx={{ width: 120, flexShrink: 0 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>{STYLE_LABELS[s]}</Caption>
                        </Box>
                        <Typography textStyle={s}>{SAMPLE_TEXT.substring(0, 40)}</Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default TypographyShowcase;
