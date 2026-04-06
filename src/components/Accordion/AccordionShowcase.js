// src/components/Accordion/AccordionShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Slider } from '../Slider/Slider';
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
export function AccordionShowcase() {
  const [variant, setVariant]     = useState('solid');
  const [color, setColor]         = useState('default');
  const [size, setSize]           = useState('medium');
  const [spacing, setSpacing]     = useState(0);
  const [disabled, setDisabled]   = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const gp = ['variant="' + variant + '"'];
    if (color !== 'default') gp.push('color="' + color + '"');
    if (size !== 'medium') gp.push('size="' + size + '"');
    if (spacing > 0) gp.push('spacing={' + spacing + '}');
    return (
      '<AccordionGroup ' + gp.join(' ') + '>\n' +
      '  <Accordion' + (disabled ? ' disabled' : '') + '>\n' +
      '    <AccordionSummary>Section One</AccordionSummary>\n' +
      '    <AccordionDetails>\n' +
      '      <Body>Content for section one.</Body>\n' +
      '    </AccordionDetails>\n' +
      '  </Accordion>\n' +
      '  <Accordion>\n' +
      '    <AccordionSummary>Section Two</AccordionSummary>\n' +
      '    <AccordionDetails>\n' +
      '      <Body>Content for section two.</Body>\n' +
      '    </AccordionDetails>\n' +
      '  </Accordion>\n' +
      '</AccordionGroup>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Accordion</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <AccordionGroup
                key={variant + '-' + color + '-' + spacing}
                variant={variant}
                color={color}
                size={size}
                spacing={spacing}
              >
                <Accordion defaultExpanded disabled={disabled}>
                  <AccordionSummary>Getting Started</AccordionSummary>
                  <AccordionDetails>
                    <Body style={{ color: 'var(--Quiet)' }}>
                      Welcome to the design system. This section covers the basics of setting up your project.
                    </Body>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>Configuration</AccordionSummary>
                  <AccordionDetails>
                    <Body style={{ color: 'var(--Quiet)' }}>
                      Configure your theme tokens, color palette, and typography settings.
                    </Body>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>Advanced Usage</AccordionSummary>
                  <AccordionDetails>
                    <Body style={{ color: 'var(--Quiet)' }}>
                      Learn about custom theming, dark mode, and creating themed zones.
                    </Body>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
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
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
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

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['solid', 'light', 'dark'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
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

                  {/* Spacing */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SPACING</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {[
                        { value: 0,   label: 'Connected' },
                        { value: 0.5, label: 'Half' },
                        { value: 1,   label: '1' },
                        { value: 1.5, label: '1.5' },
                        { value: 2,   label: '2' },
                      ].map((s) => (
                        <ControlButton key={s.value} label={s.label} selected={spacing === s.value} onClick={() => setSpacing(s.value)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled (first item)</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>First accordion is non-interactive</Caption>
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
                          { label: 'Summary',   value: 'role="button" aria-expanded="true|false" aria-controls="{id}-content"' },
                          { label: 'Details',   value: 'role="region" aria-labelledby="{id}-header"' },
                          { label: 'Keyboard',  value: 'Enter/Space toggle. Tab navigates between summaries.' },
                          { label: 'Focus',     value: 'outline: 3px solid var(--Focus-Visible); outline-offset: -3px' },
                          { label: 'Disabled',  value: 'tabIndex=-1, cursor: not-allowed, opacity: 0.5' },
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

export default AccordionShowcase;
