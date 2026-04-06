// src/components/SpeedDial/SpeedDialShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { SpeedDial } from './SpeedDial';
import { Icon } from '../Icon/Icon';
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

const SAMPLE_ACTIONS = [
  { name: 'Edit', icon: <Icon size="small" sx={{ color: 'inherit' }}><EditIcon /></Icon> },
  { name: 'Share', icon: <Icon size="small" sx={{ color: 'inherit' }}><ShareIcon /></Icon> },
  { name: 'Delete', icon: <Icon size="small" sx={{ color: 'inherit' }}><DeleteIcon /></Icon> },
  { name: 'Favorite', icon: <Icon size="small" sx={{ color: 'inherit' }}><FavoriteIcon /></Icon> },
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
export function SpeedDialShowcase() {
  const [variant, setVariant]         = useState('solid');
  const [color, setColor]             = useState('default');
  const [direction, setDirection]     = useState('up');
  const [showTooltips, setShowTooltips] = useState(true);
  const [bgTheme, setBgTheme]         = useState(null);
  const [bgSurface, setBgSurface]     = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (variant !== 'solid') parts.push('variant="' + variant + '"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (direction !== 'up') parts.push('direction="' + direction + '"');
    if (!showTooltips) parts.push('showTooltips={false}');
    parts.push('actions={actions}');
    parts.push('ariaLabel="Quick actions"');
    return '<SpeedDial\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Speed Dial</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface} sx={{ minHeight: 300, alignItems: 'flex-end', justifyContent: 'center' }}>
            <SpeedDial
              variant={variant}
              color={color}
              direction={direction}
              showTooltips={showTooltips}
              actions={SAMPLE_ACTIONS}
              ariaLabel="Quick actions"
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

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['solid', 'outline'].map((v) => (
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

                  {/* Direction */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DIRECTION</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['up', 'down', 'left', 'right'].map((d) => (
                        <ControlButton key={d} label={cap(d)} selected={direction === d} onClick={() => setDirection(d)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Tooltips</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show labels beside actions</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showTooltips} onChange={(e) => setShowTooltips(e.target.checked)}
                      size="small" aria-label="Show tooltips" />
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
                          { label: 'FAB',       value: 'aria-expanded, aria-haspopup="menu", aria-label' },
                          { label: 'Actions',   value: 'role="menu" container, role="menuitem" on each action' },
                          { label: 'Labels',    value: 'aria-label on each action from name prop' },
                          { label: 'Keyboard',  value: 'Escape closes. Click outside closes.' },
                          { label: 'Focus',     value: 'outline: 3px solid var(--Focus-Visible); outline-offset: 2px' },
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

export default SpeedDialShowcase;
