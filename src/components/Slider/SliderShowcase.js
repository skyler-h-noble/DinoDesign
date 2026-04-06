// src/components/Slider/SliderShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Slider } from './Slider';
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
export function SliderShowcase() {
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [value, setValue]               = useState(50);
  const [rangeValue, setRangeValue]     = useState([25, 75]);
  const [isRange, setIsRange]           = useState(false);
  const [valueLabelDisplay, setValueLabelDisplay] = useState('off');
  const [orientation, setOrientation]   = useState('horizontal');
  const [track, setTrack]               = useState('normal');
  const [marks, setMarks]               = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [showLabel, setShowLabel]       = useState(true);
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface]       = useState('Surface');

  const effectiveColor = color === 'default' ? 'default' : color;

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('variant="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (showLabel) parts.push('label="Volume"');
    if (isRange) parts.push('value={[25, 75]}');
    else parts.push('value={50}');
    if (valueLabelDisplay !== 'off') parts.push('valueLabelDisplay="' + valueLabelDisplay + '"');
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (track !== 'normal') parts.push('track="' + track + '"');
    if (marks) parts.push('marks');
    if (disabled) parts.push('disabled');
    parts.push('onChange={handleChange}');
    return '<Slider\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Slider</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}
            sx={orientation === 'vertical' ? { minHeight: 300 } : {}}>
            <Box sx={{
              width: orientation === 'vertical' ? 'auto' : '100%',
              maxWidth: orientation === 'vertical' ? 'auto' : 400,
              height: orientation === 'vertical' ? 250 : 'auto',
              px: orientation === 'vertical' ? 4 : 0,
            }}>
              <Slider
                variant={effectiveColor}
                size={size}
                label={showLabel ? 'Volume' : undefined}
                value={isRange ? rangeValue : value}
                onChange={(_, v) => isRange ? setRangeValue(v) : setValue(v)}
                valueLabelDisplay={valueLabelDisplay}
                orientation={orientation}
                track={track}
                marks={marks}
                disabled={disabled}
                aria-label={!showLabel ? 'Volume' : undefined}
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

                  {/* Orientation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['horizontal', 'vertical'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Value Label */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VALUE LABEL</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['off', 'on', 'auto'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={valueLabelDisplay === v} onClick={() => setValueLabelDisplay(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Track */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TRACK</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Normal" selected={track === 'normal'} onClick={() => setTrack('normal')} />
                      <ControlButton label="Inverted" selected={track === 'inverted'} onClick={() => setTrack('inverted')} />
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Range</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Two-thumb range slider</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={isRange} onChange={(e) => setIsRange(e.target.checked)}
                      size="small" aria-label="Range" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Marks</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show tick marks</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={marks} onChange={(e) => setMarks(e.target.checked)}
                      size="small" aria-label="Marks" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Show Label</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Text label above slider</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)}
                      size="small" aria-label="Show label" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive state</Caption>
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
                          { label: 'Role',        value: 'role="slider" (native input range)' },
                          { label: 'Value',       value: 'aria-valuenow, aria-valuemin, aria-valuemax' },
                          { label: 'Label',       value: 'aria-label or label prop. Always provide one.' },
                          { label: 'Range',       value: 'Two thumbs with independent aria-valuenow' },
                          { label: 'Focus',       value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px on thumb' },
                          { label: 'Keyboard',    value: 'Arrow keys adjust value. Home/End jump to min/max.' },
                          { label: 'Touch target', value: 'Thumb is always 24x24px minimum (WCAG 2.5.5)' },
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

export default SliderShowcase;
