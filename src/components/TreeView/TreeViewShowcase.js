// src/components/TreeView/TreeViewShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { DynoTreeView, DEFAULT_ITEMS } from './TreeView';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const DEFAULT_JSON = JSON.stringify(DEFAULT_ITEMS, null, 2);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLuminance(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function getContrast(h1, h2) {
  if (!h1 || !h2 || !h1.startsWith('#') || !h2.startsWith('#')) return null;
  const l1 = getLuminance(h1);
  const l2 = getLuminance(h2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
function getCssVar(v) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || null;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
      }}>{ratio}:1</Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { console.error(e); }
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
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function ColorSwatch({ color, variant, selected, onClick }) {
  const themeMap = variant === 'solid' ? SOLID_THEME_MAP : LIGHT_THEME_MAP;
  const dataTheme = themeMap[color];
  const surface = 'Surface-Dim';
  return (
    <Box
      component="button"
      data-theme={dataTheme}
      data-surface={surface}
      onClick={() => onClick(color)}
      aria-label={'Select ' + color}
      aria-pressed={selected}
      title={color}
      sx={{
        width: 36, height: 36, borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}
    >
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

// ─── JSON Editor ─────────────────────────────────────────────────────────────

function JsonEditor({ value, onChange }) {
  const [text, setText] = useState(value);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setText(DEFAULT_JSON);
    setError(null);
    onChange(DEFAULT_ITEMS);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <OverlineSmall style={{ color: 'var(--Text-Quiet)' }}>TREE DATA (JSON)</OverlineSmall>
        <Button variant="ghost" size="small" onClick={handleReset}>Reset</Button>
      </Box>
      <Box
        component="textarea"
        value={text}
        onChange={handleChange}
        spellCheck={false}
        rows={12}
        sx={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '11px',
          backgroundColor: '#1e1e1e',
          color: error ? '#f87171' : '#e5e7eb',
          border: '1px solid ' + (error ? '#f87171' : '#333'),
          borderRadius: '6px',
          padding: '10px',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1.5,
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
        }}
      />
      {error && (
        <Caption style={{ color: '#f87171', display: 'block', marginTop: 4 }}>
          JSON error: {error}
        </Caption>
      )}
      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
        Each node: {'{ "id": "string", "label": "string", "disabled"?: boolean, "children"?: [...] }'}
      </Caption>
    </Box>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function TreeViewShowcase() {
  const [variant, setVariant]                   = useState('default');
  const [color, setColor]                       = useState('primary');
  const [density, setDensity]                   = useState('default');
  const [selectionMode, setSelectionMode]       = useState('single');
  const [checkboxSelection, setCheckboxSel]     = useState(false);
  const [disableSelection, setDisableSel]       = useState(false);
  const [disabledFocusable, setDisabledFocus]   = useState(false);
  const [treeItems, setTreeItems]               = useState(DEFAULT_ITEMS);
  const [bgTheme, setBgTheme]                   = useState(null);
  const [contrastData, setContrastData]         = useState({});

  const isDefault = variant === 'default';
  const isSolid   = variant === 'solid';
  const isLight   = variant === 'light';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : undefined;

  useEffect(() => {
    setContrastData({
      text:         getCssVar('--Text'),
      textQuiet:    getCssVar('--Text-Quiet'),
      background:   getCssVar('--Background'),
      border:       getCssVar('--Border'),
      focusVisible: getCssVar('--Focus-Visible'),
      hover:        getCssVar('--Hover'),
      selected:     getCssVar('--Buttons-Default-Light-Button'),
      selectedText: getCssVar('--Buttons-Default-Light-Text'),
    });
  }, [variant, color]);

  const generateCode = () => {
    const lines = ['<DynoTreeView'];
    if (variant !== 'default') lines.push('  variant="' + variant + '"');
    if (variant !== 'default') lines.push('  color="' + color + '"');
    if (density !== 'default') lines.push('  density="' + density + '"');
    if (selectionMode !== 'single') lines.push('  selectionMode="' + selectionMode + '"');
    if (checkboxSelection) lines.push('  checkboxSelection');
    if (disableSelection)  lines.push('  disableSelection');
    if (disabledFocusable) lines.push('  disabledItemsFocusable');
    lines.push('  items={treeData}');
    lines.push('/>');
    return lines.join('\n');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Tree View</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <DynoTreeView
                variant={variant}
                color={color}
                density={density}
                selectionMode={selectionMode}
                checkboxSelection={checkboxSelection}
                disableSelection={disableSelection}
                disabledItemsFocusable={disabledFocusable}
                items={treeItems}
                defaultExpandedItems={['1', '1-1', '2']}
              />
            </Box>
          </PreviewSurface>

          {/* JSX Code */}
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Box component="code" sx={{
                fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'block',
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
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                  {/* Background */}
                  <BackgroundPicker value={bgTheme} onChange={setBgTheme} />

                  {/* Variant */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VARIANT</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['default', 'solid', 'light'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color (solid + light only) */}
                  {!isDefault && (
                    <Box>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {COLORS.map((c) => (
                          <ColorSwatch key={c} color={c} variant={variant} selected={color === c} onClick={setColor} />
                        ))}
                      </Stack>
                      <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 6, display: 'block' }}>
                        {dataTheme ? 'data-theme="' + dataTheme + '" data-surface="Surface-Dim"' : ''}
                      </Caption>
                    </Box>
                  )}

                  {/* Density */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DENSITY</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Compact (24px)" selected={density === 'compact'} onClick={() => setDensity('compact')} />
                      <ControlButton label="Default (32px)" selected={density === 'default'} onClick={() => setDensity('default')} />
                    </Stack>
                  </Box>

                  {/* Selection mode */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION MODE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['single', 'multi'].map((m) => (
                        <ControlButton key={m} label={cap(m)} selected={selectionMode === m} onClick={() => setSelectionMode(m)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <BodySmall>Checkbox selection</BodySmall>
                        <Switch
                          checked={checkboxSelection}
                          onChange={(e) => setCheckboxSel(e.target.checked)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <BodySmall>Disable selection</BodySmall>
                        <Switch
                          checked={disableSelection}
                          onChange={(e) => setDisableSel(e.target.checked)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <BodySmall>Disabled items focusable</BodySmall>
                        <Switch
                          checked={disabledFocusable}
                          onChange={(e) => setDisabledFocus(e.target.checked)}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Box>

                  {/* JSON Data Editor */}
                  <JsonEditor
                    value={DEFAULT_JSON}
                    onChange={setTreeItems}
                  />

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant}{!isDefault ? ' / ' + color : ''} — {dataTheme ? 'data-theme="' + dataTheme + '"' : 'no data-theme'} data-surface="Surface-Dim"
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Item labels and icons must have 4.5:1 contrast against their background.
                      </BodySmall>
                      <A11yRow
                        label="Item label: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)}
                        threshold={4.5}
                        note={'data-surface="Surface-Dim"'}
                      />
                      <A11yRow
                        label="Quiet text: var(--Text-Quiet) vs. var(--Background)"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)}
                        threshold={4.5}
                        note="Expand/collapse icons use var(--Text-Quiet)"
                      />
                      <A11yRow
                        label="Selected: var(--Buttons-Default-Light-Text) vs. selected bg"
                        ratio={getContrast(contrastData.selectedText, contrastData.selected)}
                        threshold={4.5}
                        note="Selected item uses Buttons-Default-Light tokens"
                      />
                    </Box>

                    {/* Focus indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        2px focus ring using var(--Focus-Visible) with inset offset on each item.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 2px solid var(--Focus-Visible); outline-offset: -2px"
                      />
                    </Box>

                    {/* Touch targets */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Minimum item height of 24px (compact) or 32px (default). WCAG recommends 44px for mobile.
                      </BodySmall>
                      {[
                        { label: 'Compact density', size: 24, note: 'minHeight: 24px — meets desktop minimum' },
                        { label: 'Default density', size: 32, note: 'minHeight: 32px — recommended for desktop' },
                      ].map(({ label, size, note }) => {
                        const passDesktop = size >= 24;
                        const passIOS     = size >= 44;
                        const passAndroid = size >= 48;
                        return (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall style={{ color: 'var(--Text)' }}>{label} — {size}px</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {[['Desktop', passDesktop, 'Success'], ['iOS', passIOS, 'Warning'], ['Android', passAndroid, 'Warning']].map(([platform, passes]) => (
                                <Box key={platform} sx={{
                                  px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                  backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Warning-BG)',
                                  color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Warning-Text)',
                                }}>
                                  {platform} {passes ? '✓' : '~'}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* ARIA */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role', value: 'role="tree" on root, role="treeitem" on each node' },
                          { label: 'Expansion', value: 'aria-expanded="true/false" on parent items' },
                          { label: 'Selection', value: 'aria-selected on selected items' },
                          { label: 'Disabled', value: 'aria-disabled="true" on disabled items' },
                          { label: 'Keyboard', value: 'Arrow keys navigate, Enter/Space selects, * expands all' },
                          { label: 'Theme', value: (dataTheme ? 'data-theme="' + dataTheme + '"' : 'no data-theme') + ' data-surface="Surface-Dim"' },
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

export default TreeViewShowcase;
