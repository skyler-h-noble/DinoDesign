// src/components/Divider/DividerShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Divider } from './Divider';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { TextInput } from '../TextInput/TextInput';
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

const H_ALIGNS = ['left', 'center', 'right'];
const V_ALIGNS = ['top', 'center', 'bottom'];
const SIZE_LABELS = { small: '1px', medium: '2px', large: '4px' };

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
  const isDefault = color === 'default';
  const C = isDefault ? null : cap(color);
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + (isDefault ? 'default' : C)}
      aria-pressed={selected}
      title={isDefault ? 'Default' : C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: isDefault ? 'var(--Border-Variant)' : 'var(--Buttons-' + C + '-Button)',
        border: selected ? '2px solid var(--Text)' : '2px solid transparent',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && (
        <CheckIcon sx={{ fontSize: 16, color: isDefault ? 'var(--Text)' : 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />
      )}
    </Box>
  );
}

/* ── Main Showcase ── */
export function DividerShowcase() {
  const [color, setColor]                 = useState('default');
  const [orientation, setOrientation]     = useState('horizontal');
  const [size, setSize]                   = useState('small');
  const [hasIndicator, setHasIndicator]   = useState(false);
  const [indicatorText, setIndicatorText] = useState('OR');
  const [indicatorStyle, setIndicatorStyle] = useState('outline');
  const [textAlign, setTextAlign]         = useState('center');
  const [bgTheme, setBgTheme]             = useState(null);
  const [bgSurface, setBgSurface]         = useState('Surface');

  const isVertical = orientation === 'vertical';
  const alignOptions = isVertical ? V_ALIGNS : H_ALIGNS;

  const handleOrientationChange = (o) => {
    setOrientation(o);
    setTextAlign('center');
  };

  const dividerProps = () => {
    const p = { color, orientation, size };
    if (hasIndicator) {
      p.indicatorText = indicatorText || 'OR';
      p.indicatorStyle = indicatorStyle;
      p.textAlign = textAlign;
    }
    return p;
  };

  const generateCode = () => {
    const p = dividerProps();
    const parts = [];
    if (p.color !== 'default') parts.push('color="' + p.color + '"');
    if (p.orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (p.size !== 'small') parts.push('size="' + p.size + '"');
    if (p.indicatorText) {
      parts.push('indicatorText="' + p.indicatorText + '"');
      parts.push('indicatorStyle="' + p.indicatorStyle + '"');
      if (p.textAlign !== 'center') parts.push('textAlign="' + p.textAlign + '"');
    }
    return '<Divider' + (parts.length ? ' ' + parts.join(' ') : '') + ' />';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <H2>Divider</H2>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{
              width: '100%', minHeight: 160,
              display: 'flex',
              alignItems: isVertical ? 'stretch' : 'center',
              justifyContent: 'center',
              flexDirection: isVertical ? 'row' : 'column',
              gap: 3, px: 2,
              ...(isVertical ? { height: 200 } : {}),
            }}>
              {isVertical ? (
                <>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BodySmall style={{ color: 'var(--Text-Quiet)' }}>Left content</BodySmall>
                  </Box>
                  <Divider {...dividerProps()} />
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BodySmall style={{ color: 'var(--Text-Quiet)' }}>Right content</BodySmall>
                  </Box>
                </>
              ) : (
                <>
                  <BodySmall style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>Content above</BodySmall>
                  <Divider {...dividerProps()} />
                  <BodySmall style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>Content below</BodySmall>
                </>
              )}
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

                  {/* Orientation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['horizontal', 'vertical'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => handleOrientationChange(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s) + ' (' + SIZE_LABELS[s] + ')'} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Indicator toggle */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Visual Indicator</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show text label on the divider</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={hasIndicator}
                      onChange={(e) => setHasIndicator(e.target.checked)}
                      size="small" aria-label="Visual indicator" />
                  </Box>

                  {hasIndicator && (
                    <>
                      <Box sx={{ mt: 3 }}>
                        <TextInput label="Indicator Text" value={indicatorText}
                          onChange={(e) => setIndicatorText(e.target.value)} size="small" />
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>INDICATOR STYLE</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['outline', 'light'].map((s) => (
                            <ControlButton key={s} label={cap(s)} selected={indicatorStyle === s} onClick={() => setIndicatorStyle(s)} />
                          ))}
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                          {isVertical ? 'ALIGNMENT' : 'TEXT ALIGN'}
                        </OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {alignOptions.map((a) => (
                            <ControlButton key={a} label={cap(a)} selected={textAlign === a} onClick={() => setTextAlign(a)} />
                          ))}
                        </Stack>
                      </Box>
                    </>
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
                          { label: 'Role',        value: 'role="separator"' },
                          { label: 'Orientation', value: 'aria-orientation="' + orientation + '"' },
                          { label: 'Contrast',    value: 'WCAG 1.4.11 — line should be ≥ 3:1 vs background' },
                          { label: 'Indicator',   value: hasIndicator ? 'Text inside separator should meet 4.5:1' : 'No indicator in use' },
                          { label: 'Usage',       value: 'Decorative dividers communicate a thematic break to assistive tech' },
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

export default DividerShowcase;
