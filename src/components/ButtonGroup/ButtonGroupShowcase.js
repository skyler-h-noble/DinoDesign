// src/components/ButtonGroup/ButtonGroupShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { ButtonGroup } from './ButtonGroup';
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

const CONTENT_TYPES = ['text', 'icon'];
const BUTTON_ITEMS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

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
export function ButtonGroupShowcase() {
  const [variant, setVariant]           = useState('outlined');
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [contentType, setContentType]   = useState('text');
  const [iconPosition, setIconPosition] = useState('none');
  const [iconName, setIconName]         = useState('Add');
  const [orientation, setOrientation]   = useState('horizontal');
  const [spacing, setSpacing]           = useState(0);
  const [disabled, setDisabled]         = useState(false);
  const [fullWidth, setFullWidth]       = useState(false);
  const [selectedBtn, setSelectedBtn]   = useState('week');
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const getIconEl = () => {
    const IconComp = MuiIcons[iconName] || MuiIcons['Add'];
    return <Icon size="small"><IconComp /></Icon>;
  };

  const getButtonProps = (item) => {
    const p = { value: item.value };
    if (contentType === 'icon') {
      p.iconOnly = true;
      p.children = getIconEl();
      p['aria-label'] = item.label;
    } else {
      p.children = item.label;
      if (iconPosition === 'left') p.startIcon = getIconEl();
      if (iconPosition === 'right') p.endIcon = getIconEl();
    }
    return p;
  };

  const generateCode = () => {
    const gp = ['variant="' + variant + '"'];
    if (color !== 'default')              gp.push('color="' + color + '"');
    if (size !== 'medium')                gp.push('size="' + size + '"');
    if (orientation !== 'horizontal')     gp.push('orientation="' + orientation + '"');
    if (spacing > 0)                      gp.push('spacing={' + spacing + '}');
    if (disabled)                         gp.push('disabled');
    if (fullWidth)                        gp.push('fullWidth');
    gp.push('value={selected}');
    gp.push('onChange={setSelected}');

    const btnLines = BUTTON_ITEMS.map((item) => {
      if (contentType === 'icon') {
        return '  <Button value="' + item.value + '" iconOnly aria-label="' + item.label + '">{<' + iconName + 'Icon />}</Button>';
      }
      const startTag = iconPosition === 'left' ? ' startIcon={<' + iconName + 'Icon />}' : '';
      const endTag = iconPosition === 'right' ? ' endIcon={<' + iconName + 'Icon />}' : '';
      return '  <Button value="' + item.value + '"' + startTag + endTag + '>' + item.label + '</Button>';
    });

    return '<ButtonGroup ' + gp.join(' ') + '>\n' + btnLines.join('\n') + '\n</ButtonGroup>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Button Group</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <ButtonGroup
                variant={variant}
                color={color}
                size={size}
                orientation={orientation}
                spacing={spacing}
                disabled={disabled}
                fullWidth={fullWidth}
                value={selectedBtn}
                onChange={setSelectedBtn}
                aria-label="Time range selector"
              >
                {BUTTON_ITEMS.map((item) => (
                  <Button key={item.value} {...getButtonProps(item)} />
                ))}
              </ButtonGroup>
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
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                overflowWrap: 'break-word', maxWidth: '100%', display: 'block',
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
                      {['outlined', 'light', 'ghost'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Content Type */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT TYPE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {CONTENT_TYPES.map((ct) => (
                        <ControlButton key={ct} label={cap(ct)} selected={contentType === ct}
                          onClick={() => {
                            setContentType(ct);
                            if (ct === 'icon') setIconPosition('none');
                          }} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Icon Position (text only) */}
                  {contentType === 'text' && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON POSITION</OverlineSmall>
                      <Stack direction="row" spacing={1}>
                        {[['none', 'None'], ['left', 'Left'], ['right', 'Right']].map(([val, lbl]) => (
                          <ControlButton key={val} label={lbl} selected={iconPosition === val}
                            onClick={() => setIconPosition(val)} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Icon Name */}
                  {(contentType === 'icon' || iconPosition !== 'none') && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        <a href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--Hotlink)' }}>Material icon</a> name
                      </Caption>
                    </Box>
                  )}

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

                  {/* Orientation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['horizontal', 'vertical'].map((o) => (
                        <ControlButton key={o} label={cap(o)} selected={orientation === o} onClick={() => setOrientation(o)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Spacing */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      SPACING — {spacing === 0 ? 'Connected' : spacing + ' units'}
                    </OverlineSmall>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="input"
                        type="range"
                        min={0}
                        max={3}
                        step={0.5}
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                        sx={{ flex: 1, accentColor: 'var(--Buttons-Primary-Button)' }}
                      />
                      <Caption style={{ color: 'var(--Text)', minWidth: 24, textAlign: 'right' }}>
                        {spacing}
                      </Caption>
                    </Box>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>All buttons disabled</Caption>
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
                          { label: 'Group container',  value: '<div role="group" aria-label="...">' },
                          { label: 'Each button',      value: '<button aria-pressed="true|false">' },
                          { label: 'Selection',        value: 'aria-pressed="true" on the active button' },
                          { label: 'Disabled',         value: 'disabled attr on all buttons when group is disabled' },
                          { label: 'Keyboard',         value: 'Tab navigates between buttons. Space/Enter activates.' },
                          { label: 'Focus indicator',  value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px' },
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

export default ButtonGroupShowcase;
