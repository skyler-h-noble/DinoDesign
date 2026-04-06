// src/components/Drawer/DrawerShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Drawer, DrawerHeader, DrawerContent, DrawerClose } from './Drawer';
import { DynoTreeView } from '../TreeView/TreeView';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products', children: [
    { id: 'featured', label: 'Featured' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'sale', label: 'On Sale' },
  ]},
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
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

/* ── Main Showcase ── */
export function DrawerShowcase() {
  const [open, setOpen]         = useState(false);
  const [size, setSize]         = useState('medium');
  const [anchor, setAnchor]     = useState('left');
  const [bgTheme, setBgTheme]   = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = ['open={open}', 'onClose={handleClose}'];
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (anchor !== 'left') parts.push('anchor="' + anchor + '"');
    return (
      '<Drawer ' + parts.join(' ') + '>\n' +
      '  <DrawerHeader>\n' +
      '    <H5>Navigation</H5>\n' +
      '    <DrawerClose onClick={handleClose} />\n' +
      '  </DrawerHeader>\n' +
      '  <DrawerContent>\n' +
      '    <DynoTreeView items={navItems} />\n' +
      '  </DrawerContent>\n' +
      '</Drawer>'
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Drawer</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Button variant="default" onClick={() => setOpen(true)}>
              Open Drawer
            </Button>
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

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            size={size}
            anchor={anchor}
          >
            <DrawerHeader>
              <H5>Navigation</H5>
              <DrawerClose onClick={() => setOpen(false)} />
            </DrawerHeader>
            <DrawerContent>
              <DynoTreeView
                items={NAV_ITEMS}
                variant="solid"
                color="default"
                defaultExpandedItems={['products']}
                sx={{ border: 'none', borderRadius: 0 }}
              />
            </DrawerContent>
          </Drawer>
        </Grid>

        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
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

                  {/* Anchor */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ANCHOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['left', 'right', 'top', 'bottom'].map((a) => (
                        <ControlButton key={a} label={cap(a)} selected={anchor === a} onClick={() => setAnchor(a)} />
                      ))}
                    </Stack>
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
                          { label: 'Role',      value: 'role="dialog" aria-modal="true"' },
                          { label: 'Focus',     value: 'Focus trapped inside drawer. Returns to trigger on close.' },
                          { label: 'Keyboard',  value: 'Escape closes. Tab cycles focusable elements.' },
                          { label: 'Backdrop',  value: 'Click closes. Body scroll locked while open.' },
                          { label: 'Close',     value: 'Button with aria-label="Close drawer"' },
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

export default DrawerShowcase;
