// src/components/Toolbar/ToolbarShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AddIcon from '@mui/icons-material/Add';
import { Toolbar } from './Toolbar';
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
  { icon: <FormatBoldIcon />, label: 'Bold' },
  { icon: <FormatItalicIcon />, label: 'Italic' },
  { icon: <FormatUnderlinedIcon />, label: 'Underline' },
  { icon: <FormatAlignLeftIcon />, label: 'Align left' },
  { icon: <FormatAlignCenterIcon />, label: 'Align center' },
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
export function ToolbarShowcase() {
  const [type, setType]               = useState('floating');
  const [color, setColor]             = useState('default');
  const [orientation, setOrientation] = useState('horizontal');
  const [showFab, setShowFab]         = useState(false);
  const [bgTheme, setBgTheme]         = useState(null);
  const [bgSurface, setBgSurface]     = useState('Surface');

  const generateCode = () => {
    const parts = ['items={items}'];
    if (type !== 'floating') parts.push('type="contextual"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (showFab) parts.push('fab={{ icon: <AddIcon />, label: "Create", onClick: handleCreate }}');
    parts.push('value={selected}');
    parts.push('onChange={setSelected}');
    return '<Toolbar\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Toolbar</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface} sx={{ minHeight: 200 }}>
            <Toolbar
              items={SAMPLE_ITEMS}
              type={type}
              color={color}
              orientation={orientation}
              fab={showFab && type === 'floating' ? { icon: <AddIcon />, label: 'Create', onClick: () => {} } : undefined}
            />
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

                  {/* Type */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TYPE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['floating', 'contextual'].map((t) => (
                        <ControlButton key={t} label={cap(t)} selected={type === t} onClick={() => setType(t)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['default', 'primary', 'primary-light', 'white', 'black'].map((c) => (
                        <ControlButton key={c} label={cap(c)} selected={color === c} onClick={() => setColor(c)} />
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
                  {type === 'floating' && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>FAB Button</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Add FAB to the right of toolbar</Caption>
                      </Box>
                      <Switch variant="default-outline" checked={showFab} onChange={(e) => setShowFab(e.target.checked)}
                        size="small" aria-label="FAB button" />
                    </Box>
                  )}
                </Box>
              </TabPanel>

              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role',        value: 'role="toolbar" aria-orientation aria-label' },
                          { label: 'Items',       value: 'role="radio" aria-checked on each icon button' },
                          { label: 'Selection',   value: 'Toggle — click selected again to deselect' },
                          { label: 'Focus',       value: 'Uses Button component focus styles' },
                          { label: 'Floating',    value: 'borderRadius 56px, padding 16px, Effect-Level-2 shadow' },
                          { label: 'Contextual',  value: 'Standard border-radius, padding 8px, no shadow' },
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

export default ToolbarShowcase;
