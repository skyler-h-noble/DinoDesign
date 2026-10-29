// src/components/Sheet/SheetShowcase.js
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@omni-design/icons/ContentCopy';
import CheckIcon from '@omni-design/icons/Check';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import {
  H3, H5, Body, BodySmall, Caption, Label, EyebrowSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');


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


/* ── Main Showcase ── */
export function SheetShowcase() {
  const [surfaceLevel, setSurfaceLevel] = useState('Container');
  const [hideBackdrop, setHideBackdrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [bgTheme, setBgTheme]     = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = ['open={open}', 'onClose={() => setOpen(false)}'];
    if (surfaceLevel !== 'Container') parts.push('surface="' + surfaceLevel + '"');
    if (hideBackdrop) parts.push('hideBackdrop');
    return (
      '<Sheet ' + parts.join(' ') + '>\n' +
      '  <H5>Sheet Title</H5>\n' +
      '  <Body>Content goes here.</Body>\n' +
      '</Sheet>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Sheet" component="Sheet" />
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
                <DocSummary component="Sheet" theme={bgTheme} surface={bgSurface} />
              </TabPanel>
<TabPanel value={1}>
        <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
<Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Button onClick={() => setOpen(true)}>Open sheet</Button>
              <Sheet open={open} onClose={() => setOpen(false)} surface={surfaceLevel} hideBackdrop={hideBackdrop} aria-label="Sheet Title">
                <H5>Sheet Title</H5>
                <Body color="quiet">A bottom sheet: it rises from the bottom of the screen.</Body>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Sheet>
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


                  {/* Surface */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SURFACE</EyebrowSmall>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {['Container', 'Surface', 'Surface-Bright', 'Surface-Dim'].map((v) => (
                        <ControlButton key={v} label={v} selected={surfaceLevel === v} onClick={() => setSurfaceLevel(v)} />
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>No scrim</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>hideBackdrop</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={hideBackdrop} onChange={(e) => setHideBackdrop(e.target.checked)}
                      size="small" aria-label="No scrim" />
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
                      <H5>Structure</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role',      value: 'role="dialog" aria-modal="true" — name it with aria-label or aria-labelledby' },
                          { label: 'Keyboard',  value: 'Escape closes; Tab is trapped inside; focus returns to the opener' },
                          { label: 'Surface',   value: 'data-surface="Container" (the theme is inherited)' },
                          { label: 'Elevation', value: 'Level 1 — the Elevations/Level-1 style' },
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
                <DocChanges component="Sheet" />
              </TabPanel>
      </Tabs>

    </Box>
  );
}

export default SheetShowcase;
