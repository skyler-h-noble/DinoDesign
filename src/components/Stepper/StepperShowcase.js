// src/components/Stepper/StepperShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Stepper, Step } from './Stepper';
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

const STEPS = ['Account', 'Details', 'Review', 'Confirm'];

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
export function StepperShowcase() {
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [orientation, setOrientation]   = useState('horizontal');
  const [activeStep, setActiveStep]     = useState(1);
  const [clickable, setClickable]       = useState(false);
  const [dashed, setDashed]             = useState(false);
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface]       = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    parts.push('activeStep={' + activeStep + '}');
    if (clickable) parts.push('clickable onStepClick={setActiveStep}');
    if (dashed) parts.push('dashedIncomplete');
    return (
      '<Stepper ' + parts.join(' ') + '>\n' +
      STEPS.map((s) => '  <Step label="' + s + '" />').join('\n') + '\n' +
      '</Stepper>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Stepper</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: orientation === 'vertical' ? 300 : '100%' }}>
              <Stepper
                color={color}
                size={size}
                orientation={orientation}
                activeStep={activeStep}
                clickable={clickable}
                onStepClick={clickable ? setActiveStep : undefined}
                dashedIncomplete={dashed}
              >
                {STEPS.map((step) => (
                  <Step key={step} label={step} />
                ))}
              </Stepper>
            </Box>
          </PreviewSurface>

          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Active Step */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ACTIVE STEP</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {STEPS.map((step, i) => (
                        <ControlButton key={i} label={String(i + 1)} selected={activeStep === i} onClick={() => setActiveStep(i)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
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

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Clickable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Steps are interactive buttons</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={clickable} onChange={(e) => setClickable(e.target.checked)}
                      size="small" aria-label="Clickable" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Dashed Incomplete</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Dashed connector for future steps</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={dashed} onChange={(e) => setDashed(e.target.checked)}
                      size="small" aria-label="Dashed incomplete" />
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Container',  value: '<ol role="list" aria-label="Progress">' },
                          { label: 'Steps',      value: '<li> elements with step state classes' },
                          { label: 'Active',     value: 'aria-current="step" on the active indicator' },
                          { label: 'Clickable',  value: 'role="button" aria-label="Go to step N" with tabIndex' },
                          { label: 'Focus',      value: 'outline: 3px solid var(--Focus-Visible); outline-offset: 2px' },
                          { label: 'Connectors', value: 'aria-hidden="true" — decorative only' },
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

export default StepperShowcase;
