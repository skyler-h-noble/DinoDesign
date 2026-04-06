// src/components/Box/BoxShowcase.js
import React, { useState } from 'react';
import { Box as MuiBox, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from './Box';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

const PADDINGS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

/* ── Helpers ── */
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

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const C = cap(color);
  const themeMap = { solid: C, light: C + '-Light', dark: C };
  const surfaceMap = { solid: 'Surface', light: 'Surface', dark: 'Surface-Dimmest' };
  return (
    <MuiBox
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
    </MuiBox>
  );
}

/* ── Main Showcase ── */
export function BoxShowcase() {
  const [variant, setVariant]     = useState('solid');
  const [color, setColor]         = useState('primary');
  const [padding, setPadding]     = useState('md');
  const [elevated, setElevated]   = useState(false);
  const [clickable, setClickable] = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');


  const generateCode = () => {
    const parts = ['variant="' + variant + '"'];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (padding !== 'md') parts.push('padding="' + padding + '"');
    if (elevated) parts.push('elevated');
    if (clickable) parts.push('clickable onClick={handleClick}');
    return (
      '<Box ' + parts.join(' ') + '>\n' +
      '  <H5>Box Title</H5>\n' +
      '  <Body>Content goes here.</Body>\n' +
      '</Box>'
    );
  };

  return (
    <MuiBox sx={{ pb: 8 }}>
      <H2>Box</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <MuiBox sx={{ width: '100%', maxWidth: 400 }}>
              <Box
                variant={variant}
                color={color}
                padding={padding}
                elevated={elevated}
                clickable={clickable}
                onClick={clickable ? () => {} : undefined}
              >
                <H5>Box Title</H5>
                <Body style={{ color: 'var(--Quiet)' }}>
                  A themed container with configurable variant, color, padding, and elevation.
                </Body>
              </Box>
            </MuiBox>
          </PreviewSurface>

          <MuiBox sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </MuiBox>
            <MuiBox sx={{ p: 2, overflow: 'hidden' }}>
              <MuiBox component="code" sx={{
                fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block',
              }}>
                {generateCode()}
              </MuiBox>
            </MuiBox>
          </MuiBox>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <MuiBox sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>

            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <MuiBox sx={{ p: 3 }}>

                  {/* Background */}
                  <MuiBox sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </MuiBox>

                  {/* Style */}
                  <MuiBox>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['solid', 'light', 'dark'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </MuiBox>

                  {/* Color */}
                  <MuiBox sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack spacing={1.5}>
                        {COLOR_GROUPS.map((group) => (
                          <MuiBox key={group.label}>
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                            <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                              {group.colors.map((c) => (
                                <ColorSwatchButton key={c} color={c} variant={variant} selected={color === c} onClick={setColor} />
                              ))}
                            </Stack>
                          </MuiBox>
                        ))}
                      </Stack>
                    </MuiBox>

                  {/* Padding */}
                  <MuiBox sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PADDING</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {PADDINGS.map((p) => (
                        <ControlButton key={p} label={cap(p)} selected={padding === p} onClick={() => setPadding(p)} />
                      ))}
                    </Stack>
                  </MuiBox>

                  {/* Toggles */}
                  <MuiBox sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MuiBox>
                      <Label>Elevated</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Higher shadow level</Caption>
                    </MuiBox>
                    <Switch variant="default-outline" checked={elevated} onChange={(e) => setElevated(e.target.checked)}
                      size="small" aria-label="Elevated" />
                  </MuiBox>

                  <MuiBox sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MuiBox>
                      <Label>Clickable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Hover/active/focus states</Caption>
                    </MuiBox>
                    <Switch variant="default-outline" checked={clickable} onChange={(e) => setClickable(e.target.checked)}
                      size="small" aria-label="Clickable" />
                  </MuiBox>

                </MuiBox>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <MuiBox sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    <MuiBox sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Structure and ARIA</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Two-layer',   value: 'Outer shell (border + shadow) + inner content (data-theme + data-surface)' },
                          { label: 'Clickable',   value: 'role="button", tabIndex=0. Enter/Space activate.' },
                          { label: 'Focus',        value: 'outline: 3px solid var(--Focus-Visible); outline-offset: 3px' },
                          { label: 'Elevation',    value: 'Effect-Level-2 rest, Level-3 hover. Elevated: Level-3 rest, Level-4 hover.' },
                        ].map(({ label, value }) => (
                          <MuiBox key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                          </MuiBox>
                        ))}
                      </Stack>
                    </MuiBox>

                  </Stack>
                </MuiBox>
              </TabPanel>
            </Tabs>
          </MuiBox>
        </Grid>
      </Grid>
    </MuiBox>
  );
}

export default BoxShowcase;
