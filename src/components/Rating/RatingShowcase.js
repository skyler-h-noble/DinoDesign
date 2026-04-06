// src/components/Rating/RatingShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Rating } from './Rating';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

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

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Buttons-' + C + '-Button)',
        border: selected ? '2px solid var(--Text)' : '2px solid transparent',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && (
        <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />
      )}
    </Box>
  );
}

/* ── Main Showcase ── */
export function RatingShowcase() {
  const [color, setColor]         = useState('default');
  const [size, setSize]           = useState('medium');
  const [value, setValue]         = useState(3);
  const [maxStars, setMaxStars]   = useState(5);
  const [precision, setPrecision] = useState(1);
  const [readOnly, setReadOnly]   = useState(false);
  const [disabled, setDisabled]   = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (maxStars !== 5) parts.push('max={' + maxStars + '}');
    if (precision !== 1) parts.push('precision={' + precision + '}');
    if (readOnly) parts.push('readOnly');
    if (disabled) parts.push('disabled');
    parts.push('value={value}');
    parts.push('onChange={setValue}');
    return '<Rating\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Rating</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Rating
              color={color}
              size={size}
              value={value}
              onChange={setValue}
              max={maxStars}
              precision={precision}
              readOnly={readOnly}
              disabled={disabled}
            />
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
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Color */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack spacing={1.5}>
                      {COLOR_GROUPS.map((group) => (
                        <Box key={group.label}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                            {group.colors.map((c) => (
                              <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                            ))}
                          </Stack>
                        </Box>
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
                  </Box>

                  {/* Precision */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PRECISION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Full" selected={precision === 1} onClick={() => setPrecision(1)} />
                      <ControlButton label="Half" selected={precision === 0.5} onClick={() => setPrecision(0.5)} />
                    </Stack>
                  </Box>

                  {/* Max Stars */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MAX STARS</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {[3, 4, 5, 7, 10].map((m) => (
                        <ControlButton key={m} label={String(m)} selected={maxStars === m} onClick={() => { setMaxStars(m); if (value > m) setValue(m); }} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Read Only</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Display only, no interaction</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)}
                      size="small" aria-label="Read only" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive, dimmed</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role',      value: 'role="radiogroup" (interactive) or role="img" (readOnly)' },
                          { label: 'Stars',     value: 'role="radio" aria-checked aria-label="N stars" on each star' },
                          { label: 'Label',     value: 'aria-label="Rating: N of M stars" on container' },
                          { label: 'Keyboard',  value: 'Arrow keys change value. Tab focuses the group.' },
                          { label: 'Focus',     value: 'outline: 2px solid var(--Focus-Visible) on individual stars' },
                          { label: 'Half star',  value: 'Split click zones — left half = 0.5 increment' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
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

export default RatingShowcase;
