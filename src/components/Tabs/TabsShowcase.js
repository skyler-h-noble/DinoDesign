// src/components/Tabs/TabsShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs as MuiTabs, Tab as MuiTab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InsightsIcon from '@mui/icons-material/Insights';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const ICON_SET = [
  <HomeIcon sx={{ fontSize: 'inherit' }} />,
  <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  <PersonIcon sx={{ fontSize: 'inherit' }} />,
  <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  <SearchIcon sx={{ fontSize: 'inherit' }} />,
  <StarIcon sx={{ fontSize: 'inherit' }} />,
  <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
  <ShoppingCartIcon sx={{ fontSize: 'inherit' }} />,
  <EmailIcon sx={{ fontSize: 'inherit' }} />,
  <ChatIcon sx={{ fontSize: 'inherit' }} />,
  <CalendarTodayIcon sx={{ fontSize: 'inherit' }} />,
  <InsightsIcon sx={{ fontSize: 'inherit' }} />,
];
const ICON_NAMES = [
  'Home', 'Settings', 'Person', 'Favorite', 'Search', 'Star',
  'Notifications', 'Cart', 'Email', 'Chat', 'Calendar', 'Insights',
];

const DEFAULT_LABELS = [
  'Home', 'Settings', 'Profile', 'Favorites', 'Search', 'Starred',
  'Notifications', 'Cart', 'Mail', 'Chat', 'Calendar', 'Analytics',
];

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function getContrast(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return null;
  const l1 = getLuminance(hex1); const l2 = getLuminance(hex2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700 }}>{ratio}:1</Box>
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
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}
function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}

export function TabsShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('standard');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('horizontal');
  const [tabCount, setTabCount] = useState(3);
  const [activeTab, setActiveTab] = useState(0);
  const [iconOnly, setIconOnly] = useState(false);
  const [startDeco, setStartDeco] = useState(false);
  const [endDeco, setEndDeco] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [tabLabels, setTabLabels] = useState(DEFAULT_LABELS.slice(0, 3));
  const [tabIcons, setTabIcons] = useState([0, 1, 2]);
  const [contrastData, setContrastData] = useState({});

  const isStandard = variant === 'standard';
  const hasDecorator = startDeco || endDeco;

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  useEffect(() => {
    setTabLabels((prev) => {
      const next = [...prev];
      while (next.length < tabCount) next.push(DEFAULT_LABELS[next.length] || 'Tab ' + (next.length + 1));
      return next.slice(0, tabCount);
    });
    setTabIcons((prev) => {
      const next = [...prev];
      while (next.length < tabCount) next.push(next.length % ICON_SET.length);
      return next.slice(0, tabCount);
    });
    if (activeTab >= tabCount) setActiveTab(Math.max(0, tabCount - 1));
  }, [tabCount]);

  const handleLabelChange = (idx, val) => {
    setTabLabels((prev) => { const n = [...prev]; n[idx] = val; return n; });
  };
  const handleIconChange = (idx, iconIdx) => {
    setTabIcons((prev) => { const n = [...prev]; n[idx] = iconIdx; return n; });
  };

  const generateCode = () => {
    const tParts = [];
    if (variant !== 'standard') tParts.push('variant="' + variant + '"');
    if (color !== 'primary') tParts.push('color="' + color + '"');
    if (size !== 'medium') tParts.push('size="' + size + '"');
    if (orientation !== 'horizontal') tParts.push('orientation="vertical"');
    if (scrollable) tParts.push('scrollable');
    tParts.push('defaultValue={0}');
    const tProps = tParts.join(' ');
    const tabs = tabLabels.map((l, i) => {
      const parts = [];
      const iconName = ICON_NAMES[tabIcons[i] || 0] + 'Icon';
      if (startDeco) parts.push('startDecorator={<' + iconName + ' />}');
      if (endDeco) parts.push('endDecorator={<' + ICON_NAMES[(tabIcons[i] + 3) % ICON_NAMES.length] + 'Icon />}');
      if (iconOnly) parts.push('iconOnly');
      const p = parts.length ? ' ' + parts.join(' ') : '';
      return '    <Tab' + p + '>' + l + '</Tab>';
    }).join('\n');
    const panels = tabLabels.map((l, i) =>
      '  <TabPanel value={' + i + '}>Content of ' + l + '</TabPanel>'
    ).join('\n');
    return '<Tabs ' + tProps + '>\n  <TabList>\n' + tabs + '\n  </TabList>\n' + panels + '\n</Tabs>';
  };

  useEffect(() => {
    const C = cap(color);
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.background = getCssVar('--Background');
    data.hover = getCssVar('--Hover');
    data.active = getCssVar('--Active');
    data.focusVisible = getCssVar('--Focus-Visible');
    data.border = getCssVar('--Border');
    data.indicatorColor = getCssVar('--Buttons-' + C + '-Border');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Tabs</H2>
      <MuiTabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <MuiTab label="Playground" />
        <MuiTab label="Accessibility" />
      </MuiTabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start',
              minHeight: 320, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ width: '100%', maxWidth: orientation === 'vertical' ? 500 : '100%' }}>
                <Tabs
                  variant={variant}
                  color={color}
                  size={size}
                  orientation={orientation}
                  scrollable={scrollable}
                  value={activeTab}
                  onChange={setActiveTab}
                >
                  <TabList>
                    {tabLabels.map((label, i) => (
                      <Tab
                        key={i}
                        startDecorator={startDeco ? ICON_SET[tabIcons[i] || 0] : undefined}
                        endDecorator={endDeco ? ICON_SET[(tabIcons[i] + 3) % ICON_SET.length] : undefined}
                        iconOnly={iconOnly}
                      >
                        {label}
                      </Tab>
                    ))}
                  </TabList>
                  {tabLabels.map((label, i) => (
                    <TabPanel key={i} value={i}>
                      <BodySmall>Content of <strong>{label}</strong> tab.</BodySmall>
                    </TabPanel>
                  ))}
                </Tabs>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  {'data-surface="Surface" data-theme="' + (isStandard ? 'Default' : getThemeName()) + '"'}
                </Caption>
                {isStandard && <Caption style={{ color: 'var(--Text-Quiet)' }}>Indicator: var(--Buttons-{cap(color)}-Border)</Caption>}
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

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['standard', 'solid', 'light'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isStandard
                  ? 'data-theme="Default" — indicator colored via var(--Buttons-{Color}-Border).'
                  : 'data-theme="' + getThemeName() + '" on Tabs wrapper.'}
              </Caption>
            </Box>

            {/* Color — always visible, all variants get colors */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isStandard
                  ? 'Indicator: var(--Buttons-{Color}-Border). data-theme="Default".'
                  : 'data-theme="' + getThemeName() + '" on Tabs wrapper.'}
              </Caption>
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

            {/* Tab count */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TABS ({tabCount})</OverlineSmall>
              <Stack direction="row" spacing={1} alignItems="center">
                <MuiIconButton size="small" onClick={() => setTabCount(Math.max(2, tabCount - 1))}
                  disabled={tabCount <= 2}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 32, height: 32 }}>
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
                <Box sx={{ fontWeight: 700, fontSize: '16px', minWidth: 28, textAlign: 'center' }}>{tabCount}</Box>
                <MuiIconButton size="small" onClick={() => setTabCount(Math.min(12, tabCount + 1))}
                  disabled={tabCount >= 12}
                  sx={{ color: 'var(--Text)', border: '1px solid var(--Border)', borderRadius: '4px', width: 32, height: 32 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </MuiIconButton>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>2–12 tabs</Caption>
              </Stack>
            </Box>

            {/* Tab inputs — adapts based on decorator/iconOnly state */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                {iconOnly ? 'TAB ICONS' : hasDecorator ? 'TAB LABELS & ICONS' : 'TAB LABELS'}
              </OverlineSmall>
              <Stack spacing={1} sx={{ maxHeight: 220, overflowY: 'auto', pr: 1 }}>
                {tabLabels.map((label, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 18, textAlign: 'center', fontWeight: 600 }}>{i + 1}</Caption>

                    {/* Icon picker — shown when has decorator or icon only */}
                    {(hasDecorator || iconOnly) && (
                      <Box
                        component="select"
                        value={tabIcons[i] || 0}
                        onChange={(e) => handleIconChange(i, parseInt(e.target.value, 10))}
                        sx={{
                          width: iconOnly ? '100%' : 100,
                          flexShrink: 0,
                          padding: '4px 6px', fontSize: '13px', fontFamily: 'inherit',
                          border: '1px solid var(--Border)', borderRadius: '4px',
                          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                          cursor: 'pointer',
                          '&:focus': { borderColor: 'var(--Focus-Visible)' },
                        }}
                      >
                        {ICON_NAMES.map((name, idx) => (
                          <option key={idx} value={idx}>{name}</option>
                        ))}
                      </Box>
                    )}

                    {/* Text input — shown when NOT icon only */}
                    {!iconOnly && (
                      <Box
                        component="input"
                        type="text"
                        value={label}
                        onChange={(e) => handleLabelChange(i, e.target.value)}
                        placeholder="Tab label"
                        sx={{
                          flex: 1,
                          padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
                          border: '1px solid var(--Border)', borderRadius: '4px',
                          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                          '&:focus': { borderColor: 'var(--Focus-Visible)' },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {iconOnly
                  ? 'Icon only — each tab shows a single icon.'
                  : hasDecorator
                    ? 'Pick an icon and edit label text for each tab.'
                    : 'Edit label text for each tab.'}
              </Caption>
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ADVANCED</OverlineSmall>
              <Stack spacing={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Scrollable</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Overflow tabs scroll with arrow buttons.</Caption>
                  </Box>
                  <Switch checked={scrollable} onChange={(e) => setScrollable(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Start Decorator</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Add icon before tab label.</Caption>
                  </Box>
                  <Switch checked={startDeco} onChange={(e) => setStartDeco(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>End Decorator</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Add icon after tab label.</Caption>
                  </Box>
                  <Switch checked={endDeco} onChange={(e) => setEndDeco(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Icon Only</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show only start decorator icon, hide label text.</Caption>
                  </Box>
                  <Switch checked={iconOnly} onChange={(e) => { setIconOnly(e.target.checked); if (e.target.checked && !startDeco) setStartDeco(true); }} size="small" />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {'Based on current settings: ' + variant + ' / ' + color + ' / ' + size + ' / ' + orientation + '. '}
            {'Tabs wrapper: data-surface="Surface" data-theme="' + (isStandard ? 'Default' : getThemeName()) + '"'}
            {isStandard ? '. Indicator: var(--Buttons-' + cap(color) + '-Border)' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Tab text must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="Selected: var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Selected tab text (fontWeight 600)" />
              <A11yRow label="Unselected: var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Unselected tab text (fontWeight 400)" />
              <A11yRow label={'Indicator vs. var(--Background)'}
                ratio={isStandard
                  ? getContrast(contrastData.indicatorColor, contrastData.background)
                  : getContrast(contrastData.text, contrastData.background)}
                threshold={3.0}
                note={isStandard
                  ? 'Standard indicator: var(--Buttons-' + cap(color) + '-Border) (WCAG 1.4.11, 3:1)'
                  : 'Solid/Light indicator: var(--Text) within themed context (WCAG 1.4.11, 3:1)'} />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>TabList:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="tablist" aria-orientation="' + orientation + '">'} — groups tab triggers with orientation for arrow key direction.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Tab:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button role="tab" aria-selected={true|false} aria-controls={panelId}>'} — selected tab has tabIndex=0, all others tabIndex=-1 (roving tabindex).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>TabPanel:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="tabpanel" aria-labelledby={tabId}>'} — linked to its tab via id/aria-controls/aria-labelledby pair.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {orientation === 'horizontal'
                      ? 'ArrowRight/ArrowLeft cycle between tabs (wraps). Home/End jump to first/last tab.'
                      : 'ArrowDown/ArrowUp cycle between tabs (wraps). Home/End jump to first/last tab.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Disabled tabs:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-disabled="true", tabIndex=-1, opacity: 0.5, cursor: not-allowed. Skipped during arrow key navigation.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus indicator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    outline: 3px solid var(--Focus-Visible), outlineOffset: -3px (inset)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Icon-only tabs:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    When iconOnly is enabled, tab label text is hidden visually. For production use, add aria-label to each icon-only Tab for screen reader access.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>13px text, 16px icon, 6px/10px padding, 32px min-height, 3px indicator.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>14px text, 18px icon, 8px/14px padding, 40px min-height, 3px indicator.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>16px text, 20px icon, 10px/18px padding, 48px min-height, 3px indicator.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default TabsShowcase;
