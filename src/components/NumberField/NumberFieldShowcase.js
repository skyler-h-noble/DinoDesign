// src/components/NumberField/NumberFieldShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { NumberField } from './NumberField';
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
export function NumberFieldShowcase() {
  const [variant, setVariant]       = useState('outlined');
  const [style, setStyle]           = useState('outline');
  const [color, setColor]           = useState('default');
  const [size, setSize]             = useState('medium');
  const [labelPosition, setLabelPosition] = useState('top');
  const [showLabel, setShowLabel]   = useState(true);
  const [disabled, setDisabled]     = useState(false);
  const [fullWidth, setFullWidth]   = useState(false);
  const [bgTheme, setBgTheme]       = useState(null);
  const [bgSurface, setBgSurface]   = useState('Surface');

  const generateCode = () => {
    const parts = ['variant="' + variant + '"'];
    if (style !== 'outline') parts.push('style="' + style + '"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (showLabel) parts.push('label="Quantity"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    parts.push('min={0}');
    parts.push('max={100}');
    if (disabled) parts.push('disabled');
    if (fullWidth && variant === 'outlined') parts.push('fullWidth');
    parts.push('value={value}');
    parts.push('onChange={setValue}');
    return '<NumberField\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Number Field</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: variant === 'outlined' ? 300 : 'auto' }}>
              <NumberField
                variant={variant}
                style={style}
                color={color}
                size={size}
                label={showLabel ? 'Quantity' : undefined}
                labelPosition={labelPosition}
                min={0}
                max={100}
                disabled={disabled}
                fullWidth={fullWidth && variant === 'outlined'}
              />
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

                  {/* Variant */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VARIANT</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['outlined', 'spinner'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Style */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['outline', 'light'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={style === s} onClick={() => setStyle(s)} />
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

                  {/* Label */}
                  {variant === 'outlined' && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
                      <Stack direction="row" spacing={1}>
                        {['top', 'floating', 'none'].map((lp) => (
                          <ControlButton key={lp} label={lp === 'none' ? 'None' : cap(lp)} selected={labelPosition === lp}
                            onClick={() => setLabelPosition(lp)} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Show Label</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Text label above field</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)}
                      size="small" aria-label="Show label" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive state</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                  {variant === 'outlined' && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Full Width</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretch to container</Caption>
                      </Box>
                      <Switch variant="default-outline" checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}
                        size="small" aria-label="Full width" />
                    </Box>
                  )}

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
                          { label: 'Role',      value: 'role="spinbutton" with aria-valuenow, aria-valuemin, aria-valuemax' },
                          { label: 'Label',     value: 'aria-label from label prop. Always provide a label.' },
                          { label: 'Keyboard',  value: 'ArrowUp/Down increment/decrement. Direct text entry supported.' },
                          { label: 'Steppers',  value: 'aria-label="Increase" / "Decrease" on stepper buttons' },
                          { label: 'Focus',     value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px' },
                          { label: 'Disabled',  value: 'HTML disabled. Steppers also disabled at min/max bounds.' },
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

export default NumberFieldShowcase;
