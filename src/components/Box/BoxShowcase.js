// src/components/Box/BoxShowcase.js
import React, { useState } from 'react';
import { Grid, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from './Box';
import { Button } from '../Button/Button';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, EyebrowSmall,
} from '../Typography';

const SURFACES = [
  'Surface', 'Surface-Dim', 'Surface-Bright',
  'Container', 'Container-Low', 'Container-Lowest', 'Container-High',
];

const THEMES = [
  'Default',
  'Primary', 'Primary-Light',
  'Secondary', 'Secondary-Light',
  'Tertiary', 'Tertiary-Light',
  'Neutral', 'Neutral-Light',
  'Info-Light', 'Success-Light', 'Warning-Light', 'Error-Light',
];

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
    <Button selected={selected} variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

export function BoxShowcase() {
  const [theme, setTheme]         = useState('');
  const [surface, setSurface]     = useState('');
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (theme) parts.push('theme="' + theme + '"');
    if (surface) parts.push('surface="' + surface + '"');
    const head = parts.length ? ' ' + parts.join(' ') : '';
    return (
      '<Box' + head + '>\n' +
      '  {/* anything */}\n' +
      '</Box>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Box</H2>
      <Body color="quiet" style={{ marginTop: 8, marginBottom: 24, maxWidth: 720 }}>
        Bare layout primitive — a slot that participates in the design-system
        cascade (<code>data-theme</code> / <code>data-surface</code>) without
        carrying any chrome. Reach for <code>&lt;Ratio&gt;</code> or
        <code> &lt;Card&gt;</code> when you need padding, borders, or shadow.
      </Body>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Box theme={theme || undefined} surface={surface || undefined}>
                <Box sx={{
                  padding: 3,
                  backgroundColor: 'var(--Background)',
                  color: 'var(--Text)',
                  borderRadius: 'var(--Style-Border-Radius)',
                  border: '1px dashed var(--Border-Variant)',
                }}>
                  <H5>Box content</H5>
                  <Body style={{ color: 'var(--Text-Quiet)', marginTop: 6 }}>
                    Anything dropped inside resolves tokens against the
                    Box's theme / surface, if you set them.
                  </Body>
                </Box>
              </Box>
            </Box>
          </PreviewSurface>

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
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, alignSelf: 'flex-start', minWidth: 0, overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>When to use</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Theme override */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      THEME (optional)
                    </EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      <ControlButton label="None" selected={!theme} onClick={() => setTheme('')} />
                      {THEMES.map((t) => (
                        <ControlButton key={t} label={t} selected={theme === t} onClick={() => setTheme(t)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Surface override */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      SURFACE (optional)
                    </EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      <ControlButton label="None" selected={!surface} onClick={() => setSurface('')} />
                      {SURFACES.map((s) => (
                        <ControlButton key={s} label={s} selected={surface === s} onClick={() => setSurface(s)} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      Both props are pass-throughs to <code>data-theme</code>{' '}
                      and <code>data-surface</code>. Leave empty to inherit
                      from the parent zone.
                    </Caption>
                  </Box>

                </Box>
              </TabPanel>

              {/* ── When to use ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <BodySmall style={{ fontWeight: 700 }}>Reach for Box when…</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        you need a wrapper to scope a theme / surface zone, or
                        you want a typed JSX root without painting any visual
                        styling.
                      </Caption>
                    </Box>
                    <Box>
                      <BodySmall style={{ fontWeight: 700 }}>Use Ratio when…</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        the container needs a fixed proportion (image, video,
                        embed, hero tile) — it carries the same theme / color
                        shell Box used to.
                      </Caption>
                    </Box>
                    <Box>
                      <BodySmall style={{ fontWeight: 700 }}>Use Card when…</BodySmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        the container has a title, body, and actions — Card
                        handles the standard 2-layer chrome plus header /
                        footer slots.
                      </Caption>
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

export default BoxShowcase;
