// src/components/Fab/FabShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Fab } from './Fab';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

const COLOR_MAP = {
  default: 'Tertiary', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};


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
  const C = COLOR_MAP[color] || 'Primary';
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + cap(color)}
      aria-pressed={selected}
      title={cap(color)}
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

function TextInput({ value, onChange, placeholder, label: inputLabel }) {
  return (
    <Box>
      {inputLabel && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>{inputLabel}</Caption>}
      <Box component="input" type="text" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        sx={{
          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
          border: '1px solid var(--Border)', borderRadius: '4px',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
        }}
      />
    </Box>
  );
}

/* ── Main Showcase ── */
export function FabShowcase() {
  const [color, setColor] = useState('default');
  const [size, setSize] = useState('medium');
  const [iconName, setIconName] = useState('Add');
  const [extended, setExtended] = useState(false);
  const [extendedLabel, setExtendedLabel] = useState('Create');
  const [animate, setAnimate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const effectiveColor = color === 'default' ? 'tertiary' : color;
  const getIconEl = () => {
    const IconComp = MuiIcons[iconName] || MuiIcons['Add'];
    return <Icon size="medium"><IconComp /></Icon>;
  };

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    parts.push('icon={<' + iconName + 'Icon />}');
    if (extended) {
      parts.push('extended');
      parts.push('label="' + extendedLabel + '"');
    }
    if (animate) parts.push('animate');
    if (disabled) parts.push('disabled');
    parts.push('ariaLabel="' + (extended ? extendedLabel : iconName) + '"');
    return '<Fab\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Floating Action Button</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Fab
              color={effectiveColor}
              size={size}
              icon={getIconEl()}
              extended={extended}
              label={extendedLabel}
              animate={animate}
              disabled={disabled}
              ariaLabel={extended ? extendedLabel : iconName}
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
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
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

                  {/* Icon */}
                  <Box sx={{ mt: 3 }}>
                    <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                      <a href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--Hotlink)' }}>Material icon</a> name (e.g. Add, Edit, Favorite, Share)
                    </Caption>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Extended</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Pill shape with icon + text label</Caption>
                      </Box>
                      <Switch checked={extended} onChange={(e) => setExtended(e.target.checked)} size="small" aria-label="Extended" />
                    </Box>

                    {extended && (
                      <Box sx={{ mt: 1.5 }}>
                        <TextInput label="Label Text" value={extendedLabel} onChange={setExtendedLabel} placeholder="Create" />
                      </Box>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Animation</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Pulse ring effect to draw attention</Caption>
                      </Box>
                      <Switch checked={animate} onChange={(e) => setAnimate(e.target.checked)} size="small" aria-label="Animation" />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Disabled</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive state</Caption>
                      </Box>
                      <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" aria-label="Disabled" />
                    </Box>
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
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Role:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<button role="button" aria-label="...">'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Label:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            {extended
                              ? 'Extended: visible label provides accessible name.'
                              : 'Icon-only: aria-label is required.'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Focus:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>3px solid var(--Focus-Visible) with 2px offset.</Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Disabled:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>HTML disabled attribute. 50% opacity, removed from tab order.</Caption>
                        </Box>
                      </Stack>
                    </Box>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Best Practices</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>One per screen:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>FABs represent the primary action. Use at most one per view.</Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Extended for clarity:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>Use extended variant when the icon alone may be ambiguous.</Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Animation:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>Use sparingly. Respect prefers-reduced-motion.</Caption>
                        </Box>
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

export default FabShowcase;
