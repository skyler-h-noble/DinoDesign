// src/components/Avatar/AvatarShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, AvatarGroup } from './Avatar';
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

const CONTENT_TYPES = ['initials', 'fallback', 'image'];

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
export function AvatarShowcase() {
  const [color, setColor]             = useState('default');
  const [size, setSize]               = useState('medium');
  const [contentType, setContentType] = useState('initials');
  const [clickable, setClickable]     = useState(false);
  const [showGroup, setShowGroup]     = useState(false);
  const [bgTheme, setBgTheme]         = useState(null);
  const [bgSurface, setBgSurface]     = useState('Surface');

  const getAvatarProps = () => {
    const p = { color, size, clickable };
    if (contentType === 'initials') p.initials = 'LN';
    if (contentType === 'image') p.src = 'https://i.pravatar.cc/150?img=3';
    if (contentType === 'image') p.alt = 'User avatar';
    return p;
  };

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (contentType === 'initials') parts.push('initials="LN"');
    if (contentType === 'image') parts.push('src="..." alt="User avatar"');
    if (clickable) parts.push('clickable onClick={handleClick}');

    if (showGroup) {
      return '<AvatarGroup max={3}>\n  <Avatar ' + parts.join(' ') + ' />\n  <Avatar initials="AB" />\n  <Avatar initials="CD" />\n  <Avatar initials="EF" />\n</AvatarGroup>';
    }
    return '<Avatar ' + parts.join(' ') + ' />';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Avatar</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            {showGroup ? (
              <AvatarGroup max={3} size={size}>
                <Avatar {...getAvatarProps()} />
                <Avatar color={color} size={size} initials="AB" />
                <Avatar color={color} size={size} initials="CD" />
                <Avatar color={color} size={size} initials="EF" />
              </AvatarGroup>
            ) : (
              <Avatar {...getAvatarProps()} />
            )}
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

                  {/* Content */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {CONTENT_TYPES.map((ct) => (
                        <ControlButton key={ct} label={cap(ct)} selected={contentType === ct} onClick={() => setContentType(ct)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Clickable</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Interactive with hover/focus states</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={clickable} onChange={(e) => setClickable(e.target.checked)}
                      size="small" aria-label="Clickable" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Group</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show as AvatarGroup with overflow</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showGroup} onChange={(e) => setShowGroup(e.target.checked)}
                      size="small" aria-label="Show group" />
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
                          { label: 'Role',      value: 'role="img" (static) or role="button" (clickable)' },
                          { label: 'Label',     value: 'aria-label from alt, initials, or "Avatar"' },
                          { label: 'Image',     value: 'alt text on <img>. Falls back to initials or icon on error.' },
                          { label: 'Clickable', value: 'Rendered as <button>. Focus ring: 3px solid var(--Focus-Visible).' },
                          { label: 'Group',     value: 'role="group" aria-label="Avatar group, N avatars"' },
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

export default AvatarShowcase;
