// src/components/Ratio/RatioShowcase.js
import React, { useState } from 'react';
import { Grid, Stack } from '@mui/material';
import { Box } from '../Box/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Ratio, RATIO_NAMES } from './Ratio';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { H3, H5, Body, BodySmall, Caption, Label, EyebrowSmall } from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default',  colors: ['default'] },
  { label: 'Theme',    colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
];

const VARIANTS = ['default', 'solid', 'light', 'dark'];
const PADDINGS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

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

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const C = cap(color);
  const themeMap = { solid: C, light: C + '-Light', dark: C, default: undefined };
  const surfaceMap = { solid: 'Surface', light: 'Surface', dark: 'Surface-Dimmest', default: 'Surface' };
  return (
    <Box
      component="button"
      data-theme={themeMap[variant]}
      data-surface={surfaceMap[variant]}
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

export function RatioShowcase() {
  const [ratio, setRatio]         = useState('1:1');
  const [variant, setVariant]     = useState('solid');
  const [color, setColor]         = useState('primary');
  const [padding, setPadding]     = useState('none');
  const [elevated, setElevated]   = useState(false);
  const [clickable, setClickable] = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = ['ratio="' + ratio + '"'];
    if (variant !== 'default') parts.push('variant="' + variant + '"');
    if (color !== 'default')   parts.push('color="' + color + '"');
    if (padding !== 'none')    parts.push('padding="' + padding + '"');
    if (elevated)              parts.push('elevated');
    if (clickable)             parts.push('clickable onClick={handleClick}');
    return '<Ratio ' + parts.join(' ') + '>\n' +
           '  {/* your content */}\n' +
           '</Ratio>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H3>Ratio</H3>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <Ratio
                ratio={ratio}
                variant={variant}
                color={color}
                padding={padding}
                elevated={elevated}
                clickable={clickable}
              />
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
                <Tab>Reference</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Variant */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VARIANT</EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {VARIANTS.map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
                    <Stack spacing={1.5}>
                      {COLOR_GROUPS.map((group) => (
                        <Box key={group.label}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                            {group.colors.map((c) => (
                              <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} variant={variant === 'default' ? 'solid' : variant} />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Padding */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PADDING</EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {PADDINGS.map((p) => (
                        <ControlButton key={p} label={p === 'none' ? 'None' : p.toUpperCase()} selected={padding === p} onClick={() => setPadding(p)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Ratio picker */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>RATIO</EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {RATIO_NAMES.map((r) => (
                        <ControlButton key={r} label={r} selected={ratio === r} onClick={() => setRatio(r)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Elevated</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Bumps the shadow up one level</Caption>
                    </Box>
                    <Switch checked={elevated} onChange={(e) => setElevated(e.target.checked)} size="small" aria-label="Elevated" />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Clickable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Adds hover, press, and focus-visible</Caption>
                    </Box>
                    <Switch checked={clickable} onChange={(e) => setClickable(e.target.checked)} size="small" aria-label="Clickable" />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Reference ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Common use cases</H5>
                      <Stack spacing={0}>
                        {[
                          { label: '1:1',               value: 'Square thumbnails, avatars, product tiles' },
                          { label: '16:9',              value: 'Video, hero images, modern displays' },
                          { label: '4:3',               value: 'Classic photo, presentation slides' },
                          { label: '3:2',               value: 'DSLR photography, print frames' },
                          { label: '21:9',              value: 'Cinematic ultrawide' },
                          { label: '9:16 / 4:5 / 5:7',  value: 'Portrait social media (Stories, Reels, prints)' },
                          { label: '16:10',             value: 'Laptop / monitor displays' },
                          { label: 'Golden-Horizontal', value: 'φ : 1 — design framing for cards, hero blocks' },
                          { label: 'Golden-Vertical',   value: '1 : φ — vertical posters, sidebars' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>{value}</Caption>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    <Body color="quiet">
                      Built on native CSS <code>aspect-ratio</code>. The
                      themed shell mirrors Box — pick a variant + color to
                      paint the frame, or keep <code>variant="default"</code>
                      for a borderless ratio container.
                    </Body>
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

export default RatioShowcase;
