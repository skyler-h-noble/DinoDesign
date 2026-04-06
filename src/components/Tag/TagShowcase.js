// src/components/Tag/TagShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Tag, TAG_COLORS, TAG_COLOR_TOKEN_MAP } from './Tag';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// Color swatch — uses the actual --Tag-{Color}-BG as swatch fill
function ColorSwatchButton({ color, selected, onClick }) {
  const C = TAG_COLOR_TOKEN_MAP[color] || cap(color);
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height, 36px)',
        height: 'var(--Button-Height, 36px)',
        borderRadius: '4px',
        backgroundColor: 'var(--Tag-' + C + '-BG)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s ease',
        '&:hover': { transform: 'scale(1.1)' },
      }}
    >
      {selected && (
        <CheckIcon sx={{ fontSize: 16, color: 'var(--Tag-' + C + '-Text)', pointerEvents: 'none' }} />
      )}
    </Box>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function TagShowcase() {
  const [color, setColor]               = useState('primary');
  const [labelText, setLabelText]       = useState('New');
  const [allCaps, setAllCaps]           = useState(false);
  const [bgTheme, setBgTheme]           = useState(null);
  const [contrastData, setContrastData] = useState({});

  const C = TAG_COLOR_TOKEN_MAP[color] || 'Primary';

  const generateCode = () => {
    const props = [];
    if (color !== 'primary') props.push('color="' + color + '"');
    if (allCaps)             props.push('allCaps');
    const propsStr = props.length ? ' ' + props.join(' ') : '';
    return '<Tag' + propsStr + '>' + labelText + '</Tag>';
  };

  useEffect(() => {
    setContrastData({
      tagText: getCssVar('--Tag-' + C + '-Text'),
      tagBg:   getCssVar('--Tag-' + C + '-BG'),
      pageBg:  getCssVar('--Background'),
    });
  }, [color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Tag</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>

              {/* Single tag preview */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Tag color={color} allCaps={allCaps}>{labelText}</Tag>
              </Box>

              {/* All colors at a glance */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {TAG_COLORS.map((c) => (
                  <Tag key={c} color={c} allCaps={allCaps}>
                    {TAG_COLOR_TOKEN_MAP[c]}
                  </Tag>
                ))}
              </Box>

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
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                overflowWrap: 'break-word', maxWidth: '100%', display: 'block',
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
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} />
                  </Box>

                  {/* Color swatches */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {TAG_COLORS.map((c) => (
                        <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 6, display: 'block' }}>
                      bg: var(--Tag-{C}-BG) · text: var(--Tag-{C}-Text)
                    </Caption>
                  </Box>

                  {/* Text input */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL TEXT</OverlineSmall>
                    <Box
                      component="input"
                      type="text"
                      value={labelText}
                      onChange={(e) => setLabelText(e.target.value)}
                      placeholder="Tag label…"
                      sx={{
                        width: '100%',
                        height: '40px',
                        px: '12px',
                        backgroundColor: 'var(--Background)',
                        border: '1px solid var(--Border)',
                        borderRadius: 'var(--Style-Border-Radius)',
                        color: 'var(--Text)',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:focus': { borderColor: 'var(--Buttons-Default-Border)' },
                        '&::placeholder': { color: 'var(--Text-Quiet)' },
                      }}
                    />
                  </Box>

                  {/* All caps toggle */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <BodySmall>All caps</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                        text-transform: uppercase
                      </Caption>
                    </Box>
                    <Switch
                      checked={allCaps}
                      onChange={(e) => setAllCaps(e.target.checked)}
                      size="small"
                      aria-label="All caps"
                    />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    color=&quot;{color}&quot; — var(--Tag-{C}-BG) / var(--Tag-{C}-Text)
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Tag text must have 4.5:1 contrast against the tag background.
                        Tags are 24px tall — text is considered small text.
                      </BodySmall>
                      <A11yRow
                        label={'var(--Tag-' + C + '-Text) vs. var(--Tag-' + C + '-BG)'}
                        ratio={getContrast(contrastData.tagText, contrastData.tagBg)}
                        threshold={4.5}
                        note={'Tag text on tag background for ' + color + ' color'}
                      />
                      <A11yRow
                        label={'var(--Tag-' + C + '-BG) vs. var(--Background)'}
                        ratio={getContrast(contrastData.tagBg, contrastData.pageBg)}
                        threshold={3.0}
                        note="Tag background against page background (non-text contrast, WCAG 1.4.11)"
                      />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target (WCAG 2.5.8)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Tags are non-interactive display elements — they do not require
                        a touch target. If used inside a clickable parent (e.g. a card or row),
                        the parent element must meet touch target requirements.
                      </BodySmall>
                      <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                        <BodySmall style={{ color: 'var(--Text)' }}>Tag height — 24px</BodySmall>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Non-interactive. No touch target requirement on the Tag itself.
                        </Caption>
                      </Box>
                    </Box>

                    {/* Semantics */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Element',       value: '<span> — inline, non-interactive' },
                          { label: 'Role',          value: 'None — presentational label' },
                          { label: 'Screen reader', value: 'Text content is read as inline text' },
                          { label: 'Color alone',   value: 'Never rely on color alone — always include text label' },
                          { label: 'All caps',      value: 'Uses text-transform: uppercase — screen readers read the original casing' },
                          { label: 'WCAG 1.4.1',    value: 'Text content ensures color-blind accessibility' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* All colors */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>All Colors</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Visual overview of all tag colors in the current theme.
                      </BodySmall>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {TAG_COLORS.map((c) => (
                          <Tag key={c} color={c} allCaps={allCaps}>
                            {TAG_COLOR_TOKEN_MAP[c]}
                          </Tag>
                        ))}
                      </Box>
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

export default TagShowcase;