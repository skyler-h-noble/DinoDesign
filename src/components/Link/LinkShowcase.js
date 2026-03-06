// src/components/Link/LinkShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Link, LINK_STYLES, LINK_COLORS } from './Link';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const STYLE_LABELS = {
  body: 'Body', 'body-small': 'Body Small', 'body-large': 'Body Large',
  'body-semibold': 'Body Semibold', 'body-bold': 'Body Bold',
  button: 'Button', label: 'Label', caption: 'Caption',
};
const COLOR_LABELS = { primary: 'Primary', standard: 'Standard', quiet: 'Quiet' };
const COLOR_TOKENS = {
  primary: 'var(--Link)',
  standard: 'var(--Text)',
  quiet: 'var(--Text-Quiet)',
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

export function LinkShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [textStyle, setTextStyle] = useState('body');
  const [color, setColor] = useState('primary');
  const [disabled, setDisabled] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const generateCode = () => {
    const parts = ['href="#"'];
    if (textStyle !== 'body') parts.push('textStyle="' + textStyle + '"');
    if (color !== 'primary') parts.push('color="' + color + '"');
    if (disabled) parts.push('disabled');
    return '<Link ' + parts.join(' ') + '>Link text</Link>';
  };

  useEffect(() => {
    const data = {};
    data.link = getCssVar('--Link');
    data.linkHover = getCssVar('--Link-Hover');
    data.linkVisited = getCssVar('--Link-Visited');
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.background = getCssVar('--Background');
    setContrastData(data);
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Link</H2>
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
              minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ maxWidth: 480, textAlign: 'center' }}>
                <Body style={{ color: 'var(--Text)' }}>
                  This paragraph contains an inline{' '}
                  <Link href="#" textStyle={textStyle} color={color} disabled={disabled}>
                    link element
                  </Link>
                  {' '}that demonstrates the current settings.
                </Body>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Link href="#" textStyle={textStyle} color={color} disabled={disabled}>
                  Standalone link with longer text
                </Link>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Color: {COLOR_LABELS[color]} ({COLOR_TOKENS[color]})
                </Caption>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Always underlined
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

            {/* Style — Body group */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE — BODY</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {['body', 'body-small', 'body-large', 'body-semibold', 'body-bold'].map((s) => (
                  <ControlButton key={s} label={STYLE_LABELS[s]} selected={textStyle === s} onClick={() => setTextStyle(s)} />
                ))}
              </Stack>
            </Box>

            {/* Style — Utility group */}
            <Box sx={{ mt: 2 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE — UTILITY</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['button', 'label', 'caption'].map((s) => (
                  <ControlButton key={s} label={STYLE_LABELS[s]} selected={textStyle === s} onClick={() => setTextStyle(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Headers (H1–H6), Display, and Overline styles are not available for links.
              </Caption>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {LINK_COLORS.map((c) => (
                  <ControlButton key={c} label={COLOR_LABELS[c]} selected={color === c} onClick={() => setColor(c)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {COLOR_LABELS[color]}: {COLOR_TOKENS[color]}. Hover: var(--Link-Hover). Visited: var(--Link-Visited).
              </Caption>
            </Box>

            {/* Disabled */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Label>Disabled</Label>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>opacity: 0.5, pointer-events: none, aria-disabled="true"</Caption>
              </Box>
              <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
            </Box>

            {/* Inline usage example */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>INLINE USAGE</OverlineSmall>
              <Body>
                Links are inline elements designed to sit within{' '}
                <Link href="#" textStyle="body" color="primary">running text</Link>
                {' '}and inherit their surrounding typography when the style matches.
              </Body>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {STYLE_LABELS[textStyle]} / {COLOR_LABELS[color]}
            {disabled ? ' / disabled' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Link Color Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Link Color Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Link text must be readable against page background (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="var(--Link) vs. var(--Background)"
                ratio={getContrast(contrastData.link, contrastData.background)} threshold={4.5}
                note="Primary link color against page background" />
              <A11yRow label="var(--Link-Hover) vs. var(--Background)"
                ratio={getContrast(contrastData.linkHover, contrastData.background)} threshold={4.5}
                note="Hover state color" />
              <A11yRow label="var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Standard link color (blends with body text)" />
              <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Quiet link color" />
            </Box>

            {/* Link Distinguishability */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Link Distinguishability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Links must be visually distinct from surrounding text (WCAG 1.4.1)</BodySmall>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Underline:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Always present. text-decoration: underline with 3px offset and 1px thickness (2px on hover/active). Links are never shown without underline to ensure non-color identification.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Color distinction from body text:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Primary color uses var(--Link) which is distinct from var(--Text). Standard and Quiet colors match body text but rely on the persistent underline for identification (WCAG 1.4.1 compliant).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Hover feedback:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Color shifts to var(--Link-Hover) and underline thickens from 1px to 2px, providing two visual cues.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Element:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<a href="...">'} — always a native anchor for correct semantics and browser behavior.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>External links:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When target="_blank", rel="noopener noreferrer" is automatically added for security. Consider adding an external link icon for sighted users.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    outline: 3px solid var(--Focus-Visible), outlineOffset: 2px, borderRadius: 2px
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Disabled:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-disabled="true", tabIndex=-1, pointer-events: none, opacity: 0.5. href is removed to prevent navigation.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Link text:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Avoid generic text like "click here" or "read more". Link text should describe the destination. Screen readers can list all links on a page — descriptive text helps navigation.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Restricted styles:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Headers (H1–H6), Display (DisplayLarge, DisplaySmall), and Overline styles are excluded. Links are inline text elements and should not adopt heading or decorative typography.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Style Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Available Styles</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>All allowed typography styles rendered as links</BodySmall>
              <Stack spacing={1.5}>
                {LINK_STYLES.map((s) => (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Box sx={{ width: 120, flexShrink: 0 }}>
                      <Caption style={{ color: 'var(--Text-Quiet)' }}>{STYLE_LABELS[s]}</Caption>
                    </Box>
                    <Link href="#" textStyle={s}>Example link text</Link>
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

export default LinkShowcase;
