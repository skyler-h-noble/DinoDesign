// src/components/Breadcrumbs/BreadcrumbsShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
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
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

/* ── Main Showcase ── */
export function BreadcrumbsShowcase() {
  const [size, setSize]           = useState('medium');
  const [separator, setSeparator] = useState('/');
  const [condense, setCondense]   = useState(false);
  const [bgTheme, setBgTheme]     = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (separator !== '/') parts.push('separator="' + separator + '"');
    if (condense) parts.push('condense maxItems={3}');
    return (
      '<Breadcrumbs' + (parts.length ? ' ' + parts.join(' ') : '') + '>\n' +
      '  <BreadcrumbItem href="/">Home</BreadcrumbItem>\n' +
      '  <BreadcrumbItem href="/products">Products</BreadcrumbItem>\n' +
      '  <BreadcrumbItem href="/products/shoes">Shoes</BreadcrumbItem>\n' +
      '  <BreadcrumbItem>Running Shoes</BreadcrumbItem>\n' +
      '</Breadcrumbs>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Breadcrumbs</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Breadcrumbs size={size} separator={separator} condense={condense} maxItems={3}>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Products</BreadcrumbItem>
              <BreadcrumbItem href="#">Shoes</BreadcrumbItem>
              <BreadcrumbItem>Running Shoes</BreadcrumbItem>
            </Breadcrumbs>
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

                  {/* Size */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Separator */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SEPARATOR</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['/', '›', '→', '·', '|'].map((sep) => (
                        <ControlButton key={sep} label={sep} selected={separator === sep} onClick={() => setSeparator(sep)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Condense</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Collapse middle items into ellipsis</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={condense} onChange={(e) => setCondense(e.target.checked)}
                      size="small" aria-label="Condense" />
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
                          { label: 'Nav',       value: '<nav aria-label="Breadcrumb">' },
                          { label: 'List',      value: '<ol> with <li> for each crumb' },
                          { label: 'Current',   value: 'aria-current="page" on the last item' },
                          { label: 'Links',     value: 'BreadcrumbItem renders <a> when href is provided' },
                          { label: 'Ellipsis',  value: 'Expandable button with aria-label="Show full breadcrumb trail"' },
                          { label: 'Separator', value: 'aria-hidden="true" — decorative only' },
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

export default BreadcrumbsShowcase;
