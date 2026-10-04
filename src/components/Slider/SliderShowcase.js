// src/components/Slider/SliderShowcase.js
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Slider } from './Slider';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import {
  H3, H5, BodySmall, Caption, Label, EyebrowSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
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
    <Button selected={selected} variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
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
        border: selected ? '2px solid var(--Text)' : '1px solid var(--Border)',
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
/* Marks have no counterpart in Figma — its Slider set has Type and Orientation
   and no mark element — so this is the demo choosing a sensible scale rather
   than mirroring a spec. Quarter points, labelled, which is what the control is
   for. */
const DEMO_MARKS = [
  { value: 0, label: '0' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
];

export function SliderShowcase() {
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [value, setValue]               = useState(50);
  const [rangeValue, setRangeValue]     = useState([25, 75]);
  const [isRange, setIsRange]           = useState(false);
  const [valueLabelDisplay, setValueLabelDisplay] = useState('off');
  const [orientation, setOrientation]   = useState('horizontal');
  const [fill, setFill]                 = useState('standard');
  const [marks, setMarks]               = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [showLabel, setShowLabel]       = useState(true);
  const [bgTheme, setBgTheme]           = useState('Default');
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
    if (fill !== 'standard') parts.push('fill="' + fill + '"');
    if (marks) parts.push('marks');
    if (disabled) parts.push('disabled');
    parts.push('onChange={handleChange}');
    return '<Slider\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Slider" component="Slider" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      {/* Layout A: the tab bar spans the page, so Summary, Accessibility and
          Change Log get the full width to read. The preview/controls split
          lives INSIDE Playground, the only tab that needs it. */}
      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
                <Tab>Summary</Tab>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
                <Tab>Change Log</Tab>
              </TabList>
<TabPanel value={0}>
                <DocSummary component="Slider" theme={bgTheme} surface={bgSurface} />
              </TabPanel>
<TabPanel value={1}>
        <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
                fill={fill}
                /* An ARRAY, not `true`. MUI reads `marks={true}` as "a tick at
                   every step", and the step here is 1 over 0–100 — 101 ticks
                   about 3px apart, which renders as a hatched band rather than
                   a scale. The demo was showing the control misused.

                   Five labelled marks is what a scale actually looks like, and
                   it also demonstrates the form worth copying: the array is the
                   only way to put LABELS on the ticks, which `true` cannot do
                   at any density. */
                marks={marks ? DEMO_MARKS : false}
                disabled={disabled}
                aria-label={!showLabel ? 'Volume' : undefined}
              />
            </Box>
          </PreviewSurface>

          <CodeBlock
            code={generateCode()}
            language="JSX"
            wrap
            sx={{ mt: 2 }}
          />
        </Grid>
          <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>


                  {/* Color */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
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
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Orientation */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</EyebrowSmall>
                    <Stack direction="row" spacing={1}>
                      {['horizontal', 'vertical'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Value Label */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VALUE LABEL</EyebrowSmall>
                    <Stack direction="row" spacing={1}>
                      {['off', 'on', 'auto'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={valueLabelDisplay === v} onClick={() => setValueLabelDisplay(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Track */}
                  <Box sx={{ mt: 3 }}>
                    {/* Named by what it DOES, and by what Figma calls the result.
                        "Normal / Inverted" is MUI's vocabulary and says nothing
                        about which end fills — the one thing this control is
                        for. Figma's Slider has a single Type axis whose four
                        values are exactly this toggle crossed with Range:

                          single + normal    single
                          single + inverted  single-inverted
                          range  + normal    double
                          range  + inverted  double-inverted

                        So the four Figma Types already existed in code and were
                        simply unreachable by name. The label now changes with
                        Range so it describes the slider in front of you.

                        The Type values were renamed in Figma to match these
                        props exactly, so the mapping is now one word to one
                        word and there is nothing left to get backwards. It was
                        worth getting wrong once: the previous names described
                        the RESULT — single-end-fill, double-outside-fill — and
                        "single-end-fill" reads like the thumb ends the fill,
                        which is the opposite of what it drew. Only the x
                        positions distinguished the two readings, because both
                        produce a working slider with a plausible fill. */}
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      FILL
                    </EyebrowSmall>
                    {/* One pair of labels for both cases. They used to read
                        Between/Outside for a range and From start/From end for
                        a single, which named four things for a prop that has
                        two values — and neither pair matched Figma or MUI. */}
                    <Stack direction="row" spacing={1}>
                      <ControlButton
                        label="Standard"
                        selected={fill === 'standard'} onClick={() => setFill('standard')} />
                      <ControlButton
                        label="Inverted"
                        selected={fill === 'inverted'} onClick={() => setFill('inverted')} />
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Range</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                        Two-thumb range slider · Figma Type:{' '}
                        {isRange
                          ? (fill === 'inverted' ? 'double-inverted' : 'double')
                          : (fill === 'inverted' ? 'single-inverted' : 'single')}
                      </Caption>
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
              </Grid>
        </Grid>
      </TabPanel>
<TabPanel value={2}>
                <A11yScopeNote />
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
<TabPanel value={3}>
                <DocChanges component="Slider" />
              </TabPanel>
      </Tabs>

    </Box>
  );
}

export default SliderShowcase;
