// src/components/Rail/RailShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import { Rail } from './Rail';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const ICON_MAP = {
  Home: <HomeIcon sx={{ fontSize: 'inherit' }} />,
  Inbox: <InboxIcon sx={{ fontSize: 'inherit' }} />,
  Send: <SendIcon sx={{ fontSize: 'inherit' }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  Delete: <DeleteIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  Person: <PersonIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Search: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  Edit: <EditIcon sx={{ fontSize: 'inherit' }} />,
  Notifications: <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
  Bookmark: <BookmarkIcon sx={{ fontSize: 'inherit' }} />,
  Add: <AddIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const DEFAULT_MAIN = [
  { icon: 'Home', label: 'Home' },
  { icon: 'Inbox', label: 'Inbox' },
  { icon: 'Send', label: 'Outbox' },
  { icon: 'Favorite', label: 'Favorites' },
];
const DEFAULT_SUB = [
  { icon: 'Settings', label: 'Settings' },
  { icon: 'Person', label: 'Profile' },
  { icon: 'Delete', label: 'Trash' },
];

/* ─── Helpers ─── */
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Copy failed:', err); }
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton size="small" onClick={handleCopy}
        sx={{ color: copied ? '#4ade80' : '#9ca3af', '&:hover': { backgroundColor: '#333', color: '#e5e7eb' } }}>
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </Tooltip>
  );
}
function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={isDisabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: isDisabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: isDisabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box component="input" type="text" value={value}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0, '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}
function SelectInput({ value, onChange, options, label }) {
  return (
    <Box component="select" value={value}
      onChange={(e) => onChange(e.target.value)} aria-label={label}
      sx={{
        padding: '4px 6px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        cursor: 'pointer', '&:focus': { borderColor: 'var(--Focus-Visible)' },
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </Box>
  );
}
function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 90 }}>{label}</Caption>
      <button type="button" onClick={() => { if (value > min) onChange(value - 1); }} disabled={value <= min}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value <= min ? 0.4 : 1, fontFamily: 'inherit' }}>−</button>
      <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 24, textAlign: 'center' }}>{value}</Box>
      <button type="button" onClick={() => { if (value < max) onChange(value + 1); }} disabled={value >= max}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value >= max ? 0.4 : 1, fontFamily: 'inherit' }}>+</button>
    </Box>
  );
}

export function RailShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [activeNav, setActiveNav] = useState(0);

  const [expandable, setExpandable] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState('partial');
  const [hasFab, setHasFab] = useState(true);
  const [hasSubSection, setHasSubSection] = useState(false);

  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Main section items
  const [mainCount, setMainCount] = useState(4);
  const [mainConfigs, setMainConfigs] = useState(DEFAULT_MAIN.map((i) => ({ ...i })));

  // Sub section items
  const [subCount, setSubCount] = useState(3);
  const [subConfigs, setSubConfigs] = useState(DEFAULT_SUB.map((i) => ({ ...i })));

  // Sync configs on count change
  useEffect(() => {
    setMainConfigs((prev) => {
      const next = [];
      for (let i = 0; i < mainCount; i++) {
        next.push(prev[i] || { icon: ICON_NAMES[i % ICON_NAMES.length], label: ICON_NAMES[i % ICON_NAMES.length] });
      }
      return next;
    });
  }, [mainCount]);

  useEffect(() => {
    setSubConfigs((prev) => {
      const next = [];
      const defaults = ['Settings', 'Person', 'Delete', 'Star', 'Bookmark', 'Notifications'];
      for (let i = 0; i < subCount; i++) {
        next.push(prev[i] || { icon: defaults[i] || ICON_NAMES[i % ICON_NAMES.length], label: defaults[i] || 'Item' });
      }
      return next;
    });
  }, [subCount]);

  const updateMain = (i, field, val) => {
    setMainConfigs((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
  };
  const updateSub = (i, field, val) => {
    setSubConfigs((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });
  };

  // Build items/sections for Rail
  const mainItems = mainConfigs.slice(0, mainCount).map((cfg) => ({
    icon: ICON_MAP[cfg.icon] || ICON_MAP.Home,
    label: cfg.label,
  }));
  const subItems = subConfigs.slice(0, subCount).map((cfg) => ({
    icon: ICON_MAP[cfg.icon] || ICON_MAP.Settings,
    label: cfg.label,
  }));

  const sections = hasSubSection
    ? [{ items: mainItems }, { items: subItems }]
    : null;

  const fabAction = hasFab
    ? { icon: ICON_MAP.Edit, label: 'Compose', onClick: () => {} }
    : undefined;

  const generateCode = () => {
    const lines = ['<Rail'];
    if (expandable) lines.push('  expandable');
    if (expandable) lines.push('  expandedWidth="' + expandedWidth + '"');
    if (hasSubSection) {
      lines.push('  sections={[');
      lines.push('    { items: [/* main items */] },');
      lines.push('    { items: [/* sub items */] },');
      lines.push('  ]}');
    } else {
      lines.push('  items={[/* ' + mainCount + ' items */]}');
    }
    if (hasFab) lines.push('  fabAction={{ icon: <EditIcon />, label: "Compose" }}');
    lines.push('/>');
    return lines.join('\n');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Navigation Rail</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 400, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              <Box sx={{ height: 480, border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                overflow: 'hidden', display: 'flex' }}>
                <Rail
                  key={'rail-' + expandable + '-' + expandedWidth + '-' + hasSubSection + '-' + mainCount + '-' + subCount + '-' + hasFab}
                  items={!hasSubSection ? mainItems : undefined}
                  sections={sections}
                  value={activeNav}
                  onChange={setActiveNav}
                  expandable={expandable}
                  expandedWidth={expandedWidth}
                  fabAction={fabAction}
                />
                {/* Content area placeholder */}
                <Box sx={{ flex: 1, minWidth: 200, p: 3, backgroundColor: 'var(--Surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Content area</Caption>
                </Box>
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Expandable */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box>
                  <Label>Expandable</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Toggle between collapsed and expanded. Shows hamburger/close icon.</Caption>
                </Box>
                <Switch checked={expandable} onChange={(e) => setExpandable(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* Expanded width (only when expandable) */}
            {expandable && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>EXPANDED WIDTH</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  <ControlButton label="Partial (240px)" selected={expandedWidth === 'partial'} onClick={() => setExpandedWidth('partial')} />
                  <ControlButton label="Full (320px)" selected={expandedWidth === 'full'} onClick={() => setExpandedWidth('full')} />
                </Stack>
              </Box>
            )}

            {/* FAB action */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box>
                  <Label>FAB Action</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Top highlight button (e.g. Compose, Add timer).</Caption>
                </Box>
                <Switch checked={hasFab} onChange={(e) => setHasFab(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* Sub section toggle */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box>
                  <Label>Sub Section</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Adds a divider and secondary group of nav items.</Caption>
                </Box>
                <Switch checked={hasSubSection} onChange={(e) => setHasSubSection(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* ─── Advanced Settings ─── */}
            <Box sx={{ mt: 3 }}>
              <Box component="button" type="button" onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, width: '100%',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: 600,
                  color: 'var(--Text)', p: 0, mb: advancedOpen ? 2 : 0,
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}>
                <Box component="span" sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</Box>
                Advanced Settings
              </Box>

              {advancedOpen && (
                <Stack spacing={3}>
                  {/* Main section items */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MAIN ITEMS</OverlineSmall>
                    <NumberStepper label="Count" value={mainCount} onChange={setMainCount} min={2} max={8} />
                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                      {mainConfigs.slice(0, mainCount).map((cfg, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                          <SelectInput value={cfg.icon} onChange={(val) => updateMain(i, 'icon', val)} options={ICON_NAMES} label={'Main item ' + (i + 1) + ' icon'} />
                          <TextInput value={cfg.label} onChange={(val) => updateMain(i, 'label', val)} placeholder="Label" />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Sub section items (when enabled) */}
                  {hasSubSection && (
                    <Box>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SUB SECTION ITEMS</OverlineSmall>
                      <NumberStepper label="Count" value={subCount} onChange={setSubCount} min={1} max={6} />
                      <Stack spacing={1} sx={{ mt: 1.5 }}>
                        {subConfigs.slice(0, subCount).map((cfg, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                            <SelectInput value={cfg.icon} onChange={(val) => updateSub(i, 'icon', val)} options={ICON_NAMES} label={'Sub item ' + (i + 1) + ' icon'} />
                            <TextInput value={cfg.label} onChange={(val) => updateSub(i, 'label', val)} placeholder="Label" />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ── ACCESSIBILITY ── */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {expandable ? 'Expandable (' + expandedWidth + ')' : 'Fixed'}{hasSubSection ? ' · With sub section' : ''}{hasFab ? ' · FAB action' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Landmark:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<nav role="navigation" aria-label="Navigation rail">'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Tab list:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    role="tablist" aria-orientation="vertical"
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Items:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    role="tab", aria-selected, aria-label per item.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Toggle button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {expandable ? 'aria-label="Collapse menu" / "Expand menu". Hamburger icon → Close icon.' : 'Not present (fixed rail).'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    3px solid var(--Focus-Visible), -3px inset offset.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    data-theme="Default" · data-surface="Surface-Dim" · bg: var(--Background)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected item:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    bg: var(--Buttons-Default-Button) · icon/text: var(--Buttons-Default-Text)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Unselected item:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    icon/text: var(--Text-Quiet) · hover: var(--Hover) · active: var(--Active)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>FAB action:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    bg: var(--Buttons-Primary-Light-Button) · text: var(--Buttons-Primary-Light-Text)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Divider:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Border)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Item count:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3–7 primary destinations recommended.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Collapsed labels:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Keep short (1 word). Truncated with ellipsis if too long.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Sections:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use dividers to separate primary from secondary navigation.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Expand toggle:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Hamburger icon collapses, close icon when expanded. Width animates with 0.25s ease.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default RailShowcase;
