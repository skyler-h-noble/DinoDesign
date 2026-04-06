// src/components/Select/SelectShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { Select } from './Select';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
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

const SAMPLE_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
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
export function SelectShowcase() {
  const [variant, setVariant]           = useState('outline');
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [labelPosition, setLabelPosition] = useState('top');
  const [selectLabel, setSelectLabel]   = useState('Fruit');
  const [showDividers, setShowDividers] = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [fullWidth, setFullWidth]       = useState(true);
  const [startDeco, setStartDeco]       = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface]       = useState('Surface');

  const generateCode = () => {
    const parts = [];
    if (variant !== 'outline') parts.push('variant="' + variant + '"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (selectLabel) parts.push('label="' + selectLabel + '"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    if (showDividers) parts.push('showDividers');
    if (disabled) parts.push('disabled');
    if (fullWidth) parts.push('fullWidth');
    if (startDeco) parts.push('startDecoration={<SearchIcon />}');
    parts.push('options={options}');
    parts.push('value={value}');
    parts.push('onChange={setValue}');
    return '<Select\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Select</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <Select
                variant={variant}
                color={color}
                size={size}
                label={selectLabel}
                labelPosition={labelPosition}
                options={SAMPLE_OPTIONS}
                value={selectedValue}
                onChange={setSelectedValue}
                showDividers={showDividers}
                disabled={disabled}
                fullWidth={fullWidth}
                startDecoration={startDeco ? <Icon size="small"><SearchIcon /></Icon> : undefined}
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

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['outline', 'light'].map((v) => (
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

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Label Position */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['top', 'floating', 'none'].map((lp) => (
                        <ControlButton key={lp} label={lp === 'none' ? 'None' : cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Start Icon</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Search icon before value</Caption>
                    </Box>
                    <Switch checked={startDeco} onChange={(e) => setStartDeco(e.target.checked)}
                      size="small" aria-label="Start icon" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Dividers</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Lines between options</Caption>
                    </Box>
                    <Switch checked={showDividers} onChange={(e) => setShowDividers(e.target.checked)}
                      size="small" aria-label="Show dividers" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive state</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Full Width</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretch to container width</Caption>
                    </Box>
                    <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}
                      size="small" aria-label="Full width" />
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
                        {[
                          { label: 'Trigger',    value: 'role="combobox" aria-expanded="true|false" aria-haspopup="listbox"' },
                          { label: 'Dropdown',   value: 'role="listbox" aria-label="..."' },
                          { label: 'Options',    value: 'role="option" aria-selected="true|false"' },
                          { label: 'Label',      value: 'aria-label from label prop. Always provide a label.' },
                          { label: 'Keyboard',   value: 'Enter/Space opens. Escape closes. Arrow keys when open.' },
                          { label: 'Focus',      value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px (on outer shell)' },
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

export default SelectShowcase;
