// src/components/TreeView/TreeViewShowcase.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import { DynoTreeView, DEFAULT_ITEMS } from './TreeView';
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
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

// ─── Sample data with icons ───────────────────────────────────────────────────

const ICON_DOT = (color) => (
  <Box sx={{
    width: 8, height: 8, borderRadius: '50%',
    backgroundColor: color, flexShrink: 0,
  }} />
);

const ITEMS_WITH_ICONS = [
  {
    id: '1',
    label: 'Documents',
    icon: <FolderIcon />,
    badge: ICON_DOT('var(--Warning-Text, orange)'),
    children: [
      {
        id: '1-1',
        label: 'Company',
        icon: <FolderOpenIcon />,
        badge: ICON_DOT('var(--Warning-Text, orange)'),
        children: [
          { id: '1-1-1', label: 'Invoice',          icon: <PictureAsPdfIcon /> },
          { id: '1-1-2', label: 'Meeting notes',    icon: <InsertDriveFileIcon /> },
          { id: '1-1-3', label: 'Tasks list',       icon: <InsertDriveFileIcon /> },
          { id: '1-1-4', label: 'Equipment',        icon: <PictureAsPdfIcon /> },
          { id: '1-1-5', label: 'Video conference', icon: <VideoLibraryIcon /> },
        ],
      },
      { id: '1-2', label: 'Personal',    icon: <FolderIcon /> },
      { id: '1-3', label: 'Group photo', icon: <ImageIcon /> },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    icon: <BookmarkIcon />,
    children: [
      { id: '2-1', label: 'Favourites', icon: <InsertDriveFileIcon /> },
    ],
  },
  { id: '3', label: 'History', icon: <FolderIcon /> },
  { id: '4', label: 'Trash',   icon: <DeleteIcon />,  disabled: true },
];

const DEFAULT_JSON = JSON.stringify(DEFAULT_ITEMS, null, 2);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  const l1 = getLuminance(h1), l2 = getLuminance(h2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}

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
        rows={10}
        sx={{
          width: '100%',
          fontFamily: 'monospace', fontSize: '11px',
          backgroundColor: '#1e1e1e',
          color: error ? '#f87171' : '#e5e7eb',
          border: '1px solid ' + (error ? '#f87171' : '#333'),
          borderRadius: '6px', padding: '10px',
          resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5,
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
        }}
      />
      {error && (
        <Caption style={{ color: '#f87171', display: 'block', marginTop: 4 }}>
          JSON error: {error}
        </Caption>
      )}
    </Box>
  );
}

// ─── Main Showcase ───────────────────────────────────────────────────────────

export function TreeViewShowcase() {
  const [variant, setVariant] = useState('default');
  const [color, setColor]                   = useState('primary');
  const [density, setDensity]               = useState('default');
  const [animation, setAnimation]           = useState('slide');
  const [selectionMode, setSelectionMode]   = useState('single');
  const [checkboxSel, setCheckboxSel]       = useState(false);
  const [disableSel, setDisableSel]         = useState(false);
  const [showIcons, setShowIcons]           = useState(false);
  const [jsonItems, setJsonItems]           = useState(DEFAULT_ITEMS);
  const [bgTheme, setBgTheme]               = useState(null);
  const [contrastData, setContrastData]     = useState({});

  const previewRef = useRef(null);

  const colorToken = cap(color);
  const activeItems = showIcons ? ITEMS_WITH_ICONS : jsonItems;

  const getElVar = useCallback((el, varName) => {
    if (!el) return null;
    return getComputedStyle(el).getPropertyValue(varName).trim() || null;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = previewRef.current;
      setContrastData({
        text:         getElVar(el, '--Text'),
        textQuiet:    getElVar(el, '--Text-Quiet'),
        background:   getElVar(el, '--Background'),
        border:       getElVar(el, '--Border'),
        focusVisible: getElVar(el, '--Focus-Visible'),
        activeBtn:    getElVar(el, '--Buttons-' + colorToken + '-Button'),
        activeBorder: getElVar(el, '--Buttons-' + colorToken + '-Border'),
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [color, bgTheme, getElVar, colorToken]);

  const generateCode = () => {
    const lines = ['<DynoTreeView'];
    if (color !== 'default') lines.push('  color="' + color + '"');
    if (variant !== 'default') lines.push('  variant="' + variant + '"');
    if (density !== 'default')       lines.push('  density="' + density + '"');
    if (animation !== 'slide')       lines.push('  animation="' + animation + '"');
    if (selectionMode !== 'single')  lines.push('  selectionMode="' + selectionMode + '"');
    if (checkboxSel)                 lines.push('  checkboxSelection');
    if (disableSel)                  lines.push('  disableSelection');
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

          <PreviewSurface ref={previewRef} theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <DynoTreeView
                color={color}
                variant={variant}
                density={density}
                animation={animation}
                selectionMode={selectionMode}
                checkboxSelection={checkboxSel}
                disableSelection={disableSel}
                items={activeItems}
                defaultExpandedItems={['1', '1-1', '2']}
              />
            </Box>
          </PreviewSurface>

          {/* Code block */}
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
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} />
                  </Box>

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Default" selected={variant === 'default'} onClick={() => setVariant('default')} />
                      <ControlButton label="Solid"   selected={variant === 'solid'}   onClick={() => setVariant('solid')} />
                      <ControlButton label="Light"   selected={variant === 'light'}   onClick={() => setVariant('light')} />
                    </Stack>
                  </Box>

                  {/* Color — hidden for default variant */}
                  {variant !== 'default' && (
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
                  )}

                  {/* Density */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DENSITY</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Compact" selected={density === 'compact'} onClick={() => setDensity('compact')} />
                      <ControlButton label="Default" selected={density === 'default'} onClick={() => setDensity('default')} />
                    </Stack>
                  </Box>

                  {/* Animation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ANIMATION</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['none', 'slide', 'spring'].map((a) => (
                        <ControlButton key={a} label={cap(a)} selected={animation === a} onClick={() => setAnimation(a)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Selection mode */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION MODE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label="Single" selected={selectionMode === 'single'} onClick={() => setSelectionMode('single')} />
                      <ControlButton label="Multi"  selected={selectionMode === 'multi'}  onClick={() => setSelectionMode('multi')} />
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Show Icons</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Load sample data with icons and badges</Caption>
                      </Box>
                      <Switch checked={showIcons} onChange={(e) => setShowIcons(e.target.checked)} size="small" aria-label="Show icons" />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Checkbox Selection</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show checkboxes for each item</Caption>
                      </Box>
                      <Switch checked={checkboxSel} onChange={(e) => setCheckboxSel(e.target.checked)} size="small" aria-label="Checkbox selection" />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Label>Disable Selection</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Items are not selectable</Caption>
                      </Box>
                      <Switch checked={disableSel} onChange={(e) => setDisableSel(e.target.checked)} size="small" aria-label="Disable selection" />
                    </Box>
                  </Box>

                  {/* JSON editor — only shown when icons are off */}
                  {!showIcons && (
                    <Box sx={{ mt: 3 }}>
                      <JsonEditor value={DEFAULT_JSON} onChange={setJsonItems} />
                    </Box>
                  )}

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <A11yRow
                        label="Resting: var(--Text-Quiet) vs. background"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)}
                        threshold={4.5}
                        note="Unselected items use Text-Quiet"
                      />
                      <A11yRow
                        label="Hover: var(--Text) vs. background"
                        ratio={getContrast(contrastData.text, contrastData.background)}
                        threshold={4.5}
                        note="Hovered items use var(--Text)"
                      />
                      <A11yRow
                        label={'Active (solid): var(--Text) vs. var(--Buttons-' + colorToken + '-Button)'}
                        ratio={getContrast(contrastData.text, contrastData.activeBtn)}
                        threshold={4.5}
                        note="Selected item with solid fill"
                      />
                    </Box>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <A11yRow
                        label="var(--Focus-Visible) vs. background"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 2px solid var(--Focus-Visible); outline-offset: -2px"
                      />
                    </Box>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role',       value: 'role="tree" on root, role="treeitem" on each node' },
                          { label: 'Expansion',  value: 'aria-expanded="true/false" on parent items' },
                          { label: 'Selection',  value: 'aria-selected on selected items' },
                          { label: 'Disabled',   value: 'aria-disabled="true" on disabled items' },
                          { label: 'Icons',      value: 'Icon elements are aria-hidden — label carries the accessible name' },
                          { label: 'Keyboard',   value: 'Arrow keys navigate, Enter/Space selects, * expands all siblings' },
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
