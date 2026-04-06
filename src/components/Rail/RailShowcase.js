// src/components/Rail/RailShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { Rail } from './Rail';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const SAMPLE_ITEMS = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <FavoriteIcon />, label: 'Favorites', badge: 3 },
  { icon: <PersonIcon />, label: 'Profile' },
  { icon: <SettingsIcon />, label: 'Settings' },
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
export function RailShowcase() {
  const [expandable, setExpandable]       = useState(true);
  const [expandedWidth, setExpandedWidth] = useState('partial');
  const [showFab, setShowFab]             = useState(false);
  const [bgTheme, setBgTheme]             = useState(null);
  const [bgSurface, setBgSurface]         = useState('Surface');

  const generateCode = () => {
    const parts = ['items={items}'];
    if (expandable) {
      parts.push('expandable');
      if (expandedWidth !== 'partial') parts.push('expandedWidth="full"');
    }
    if (showFab) parts.push('fabAction={{ icon: <AddIcon />, label: "Create", onClick: handleCreate }}');
    parts.push('value={activeIndex}');
    parts.push('onChange={setActiveIndex}');
    return '<Rail\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Rail</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface} sx={{ minHeight: 400, alignItems: 'stretch', p: 0 }}>
            <Rail
              items={SAMPLE_ITEMS}
              expandable={expandable}
              expandedWidth={expandedWidth}
              fabAction={showFab ? { icon: <AddIcon />, label: 'Create', onClick: () => {} } : undefined}
            />
            <Box sx={{ flex: 1, p: 3 }}>
              <BodySmall style={{ color: 'var(--Quiet)' }}>Main content area</BodySmall>
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

                  {/* Expanded Width */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>EXPANDED WIDTH</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['partial', 'full'].map((w) => (
                        <ControlButton key={w} label={cap(w)} selected={expandedWidth === w} onClick={() => setExpandedWidth(w)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Expandable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Toggle between collapsed and expanded</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={expandable} onChange={(e) => setExpandable(e.target.checked)}
                      size="small" aria-label="Expandable" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>FAB Action</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show create button at top</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showFab} onChange={(e) => setShowFab(e.target.checked)}
                      size="small" aria-label="FAB action" />
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
                          { label: 'Nav',       value: '<nav role="navigation" aria-label="Navigation rail">' },
                          { label: 'Items',     value: 'role="tab" aria-selected on each item' },
                          { label: 'TabList',   value: 'role="tablist" aria-orientation="vertical"' },
                          { label: 'Toggle',    value: 'aria-label="Expand/Collapse menu"' },
                          { label: 'Focus',     value: 'outline: 3px solid var(--Focus-Visible); outline-offset: -3px' },
                          { label: 'Badge',     value: 'Visual only — announced via aria-label on parent item' },
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

export default RailShowcase;
