// src/components/Fab/FabShowcase.js
import React, { useState, useRef } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Fab } from './Fab';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { A11yRow, A11yCheckRow, useMeasuredTokens, getContrast } from '../a11yPanel';
import {
  H3, H5, BodySmall, Caption, Label, EyebrowSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
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
    <Button selected={selected} variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
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
        border: selected ? '2px solid var(--Text)' : '1px solid var(--Border)',
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

  /* No remap. This used to read `color === 'default' ? 'tertiary' : color`,
     which put the intended default colour in the GALLERY instead of the
     component — so the showcase looked right and anyone importing Fab got
     something else. Fab now defaults to tertiary itself. */
  const effectiveColor = color;

  /* The surface the Accessibility tab MEASURES. Mounted here rather than inside
     a tab panel: the panel only renders when its tab is open, so measuring from
     there would read nothing until someone clicked Accessibility, and the first
     render would always be blank. */
  const surfaceRef = useRef(null);

  const SIZE_PX = { small: 32, medium: 48, large: 56 };
  const a11y = useMeasuredTokens(surfaceRef, (v) => {
    const C = color.charAt(0).toUpperCase() + color.slice(1).replace(/-([a-z])/g, (m, c) => c.toUpperCase());
    return {
      background: v('--Background'),
      focusVisible: v('--Focus-Visible'),
      fabBg: v('--Buttons-' + C + '-Button'),
      fabIcon: v('--Buttons-' + C + '-Text'),
      fabBorder: v('--Buttons-' + C + '-Border'),
      hover: v('--Buttons-' + C + '-Hover'),
      pressed: v('--Buttons-' + C + '-Pressed'),
    };
  }, [color, bgTheme, bgSurface]);

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
      <ShowcaseHeader title="Floating Action Button" component="Fab" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      {/* Invisible, zero-height, but carrying the chosen theme and surface so
          getComputedStyle resolves the same tokens the preview paints with. */}
      <Box ref={surfaceRef}
        {...(bgTheme ? { 'data-theme': bgTheme } : {})}
        data-surface={bgSurface}
        sx={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      />

      {/* Layout A: the tab bar spans the page, so Summary, Accessibility and
          Change Log get the full width to read. The preview/controls split
          lives INSIDE Playground, the only tab that needs it. */}
      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
                <Tab>Summary</Tab>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
                <Tab>Change Log</Tab>
              </TabList>
<TabPanel value={0}>
                <DocSummary component="Fab" theme={bgTheme} surface={bgSurface} />
              </TabPanel>
<TabPanel value={1}>
        <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
<Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
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

          <CodeBlock
            code={generateCode()}
            language="JSX"
            wrap
            sx={{ mt: 2 }}
          />
        </Grid>
          <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                  </Box>

                  {/* Color */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
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
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
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
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</EyebrowSmall>

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
              </Grid>
        </Grid>
      </TabPanel>
<TabPanel value={2}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    {/* Measured live against the theme and surface chosen above,
                        not described in prose. Everything here reads the tokens
                        the preview actually resolves, so changing the surface
                        changes these numbers. */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Contrast — {color} on {bgSurface}{bgTheme ? ' / ' + bgTheme : ''}</H5>
                      <Stack spacing={0}>
                        <A11yRow
                          label="FAB fill vs. page background"
                          note="Non-text contrast, 3:1 — the FAB has to be findable against what it floats over."
                          ratio={getContrast(a11y.fabBg, a11y.background)} threshold={3.0} />
                        <A11yRow
                          label="Icon vs. FAB fill — resting"
                          note="The glyph carries the meaning, so it is held to text contrast."
                          ratio={getContrast(a11y.fabIcon, a11y.fabBg)} threshold={4.5} />
                        <A11yRow
                          label="Icon vs. FAB fill — hover"
                          ratio={getContrast(a11y.fabIcon, a11y.hover, a11y.fabBg)} threshold={4.5} />
                        <A11yRow
                          label="Icon vs. FAB fill — pressed"
                          ratio={getContrast(a11y.fabIcon, a11y.pressed, a11y.fabBg)} threshold={4.5} />
                        <A11yRow
                          label="Focus ring vs. page background"
                          note="3:1. The ring sits outside the FAB, so it is measured against what is behind it, not against the fill."
                          ratio={getContrast(a11y.focusVisible, a11y.background)} threshold={3.0} />
                        <A11yCheckRow
                          label="Target size"
                          note="WCAG 2.5.8 asks 24x24 CSS px minimum; 44x44 is the AAA / platform figure."
                          pass={SIZE_PX[size] >= 44}
                          detail={SIZE_PX[size] + 'px'} />
                      </Stack>
                    </Box>

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
<TabPanel value={3}>
                <DocChanges component="Fab" />
              </TabPanel>
      </Tabs>

    </Box>
  );
}

export default FabShowcase;
