// src/components/Tabs/TabsShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
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
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const STANDARD_COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const SOLID_COLORS = ['primary', 'secondary', 'tertiary', 'white', 'black', 'info', 'success', 'warning', 'error'];
const LIGHT_COLORS = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];
const DARK_COLORS = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  white: 'White', black: 'Black',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const DARK_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
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
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>{ratio}:1</Box>
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

function ColorSwatchButton({ color, selected, onClick, variant }) {
  const C = cap(color);
  const themeMap = variant === 'dark' ? DARK_THEME_MAP : variant === 'light' ? LIGHT_THEME_MAP : SOLID_THEME_MAP;
  const dataTheme = themeMap[color] || undefined;
  const dataSurface = color === 'default' ? undefined : variant === 'dark' ? 'Surface-Dimmest' : 'Surface';
  return (
    <Box
      component="button"
      data-theme={dataTheme}
      data-surface={dataSurface}
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: color === 'default' ? 'var(--Buttons-Default-Button)' : 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}
    >
      {selected && <CheckIcon sx={{ fontSize: 16, color: color === 'default' ? 'var(--Buttons-Default-Text)' : 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

export function TabsShowcase() {
  const [variant, setVariant] = useState('standard');
  const [color, setColor] = useState('default');
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
  const [bgTheme, setBgTheme] = useState(null);
  const [contrastData, setContrastData] = useState({});

  const isStandard = variant === 'standard';

  const availableColors = variant === 'solid' ? SOLID_COLORS
    : variant === 'light' ? LIGHT_COLORS
    : variant === 'dark' ? DARK_COLORS
    : STANDARD_COLORS;

  const handleVariantChange = (v) => {
    setVariant(v);
    const colors = v === 'solid' ? SOLID_COLORS : v === 'light' ? LIGHT_COLORS : v === 'dark' ? DARK_COLORS : STANDARD_COLORS;
    if (!colors.includes(color)) setColor(colors[0]);
  };

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    if (variant === 'dark') return DARK_THEME_MAP[color] || '';
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

  const generateCode = () => {
    const tParts = [];
    if (variant !== 'standard') tParts.push('variant="' + variant + '"');
    if (color !== 'default') tParts.push('color="' + color + '"');
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

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* -- LEFT: Preview + Code -- */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
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
          </PreviewSurface>

          {/* Code */}
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* -- RIGHT: Tabs -- */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>

            <Tabs defaultValue={0} variant="standard" color="default">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* Playground */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} />
                  </Box>

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {['standard', 'solid', 'light', 'dark'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => handleVariantChange(s)} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {isStandard
                        ? 'Indicator: var(--Buttons-' + cap(color) + '-Border).'
                        : variant === 'light'
                          ? 'Light themed tabs.'
                          : variant === 'dark'
                            ? 'Dark themed tabs.'
                            : 'Solid themed tabs.'}
                    </Caption>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {availableColors.map((c) => (
                        <ColorSwatchButton key={c} color={c} variant={variant} selected={color === c} onClick={setColor} />
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

                  {/* Tab count */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TABS ({tabCount})</OverlineSmall>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button iconOnly variant="default-outline" size="small"
                        onClick={() => setTabCount(Math.max(2, tabCount - 1))}
                        disabled={tabCount <= 2}
                        aria-label="Remove tab">-</Button>
                      <Box sx={{ fontWeight: 700, fontSize: '16px', minWidth: 28, textAlign: 'center' }}>{tabCount}</Box>
                      <Button iconOnly variant="default-outline" size="small"
                        onClick={() => setTabCount(Math.min(12, tabCount + 1))}
                        disabled={tabCount >= 12}
                        aria-label="Add tab">+</Button>
                      <Caption style={{ color: 'var(--Text-Quiet)' }}>2-12 tabs</Caption>
                    </Stack>
                  </Box>

                  {/* Tab label inputs */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      {iconOnly ? 'TAB ICONS' : 'TAB LABELS'}
                    </OverlineSmall>
                    <Stack spacing={1} sx={{ maxHeight: 180, overflowY: 'auto', pr: 1 }}>
                      {tabLabels.map((label, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 18, textAlign: 'center', fontWeight: 600 }}>{i + 1}</Caption>
                          {!iconOnly && (
                            <Box
                              component="input" type="text" value={label}
                              onChange={(e) => handleLabelChange(i, e.target.value)}
                              placeholder="Tab label"
                              sx={{
                                flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
                                border: '1px solid var(--Border)', borderRadius: '4px',
                                backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                                '&:focus': { borderColor: 'var(--Focus-Visible)' },
                              }}
                            />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
                    <Stack spacing={0}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Label>Scrollable</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Overflow tabs scroll with arrows.</Caption>
                        </Box>
                        <Switch checked={scrollable} onChange={(e) => setScrollable(e.target.checked)} size="small" aria-label="Scrollable" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Label>Start Decorator</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Icon before tab label.</Caption>
                        </Box>
                        <Switch checked={startDeco} onChange={(e) => setStartDeco(e.target.checked)} size="small" aria-label="Start decorator" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Label>End Decorator</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Icon after tab label.</Caption>
                        </Box>
                        <Switch checked={endDeco} onChange={(e) => setEndDeco(e.target.checked)} size="small" aria-label="End decorator" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Label>Icon Only</Label>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show only icon, hide label.</Caption>
                        </Box>
                        <Switch checked={iconOnly} onChange={(e) => { setIconOnly(e.target.checked); if (e.target.checked && !startDeco) setStartDeco(true); }} size="small" aria-label="Icon only" />
                      </Box>
                    </Stack>
                  </Box>

                </Box>
              </TabPanel>

              {/* Accessibility */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {variant} / {color} / {size} / {orientation}
                    {!isStandard && getThemeName() ? ' — data-theme="' + getThemeName() + '"' : ''}
                    {!isStandard ? ' data-surface="' + (variant === 'dark' ? 'Surface-Dimmest' : 'Surface') + '"' : ''}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Readability (WCAG 1.4.3 — 4.5:1)</H5>
                      <A11yRow label="Selected: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                        note="Selected tab text (fontWeight 600)" />
                      <A11yRow label="Unselected: var(--Text-Quiet) vs. var(--Background)"
                        ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                        note="Unselected tab text (fontWeight 400)" />
                      <A11yRow label="Indicator vs. var(--Background)"
                        ratio={isStandard
                          ? getContrast(contrastData.indicatorColor, contrastData.background)
                          : getContrast(contrastData.text, contrastData.background)}
                        threshold={3.0}
                        note={isStandard
                          ? 'var(--Buttons-' + cap(color) + '-Border) (WCAG 1.4.11, 3:1)'
                          : 'var(--Text) within themed context (WCAG 1.4.11, 3:1)'} />
                    </Box>

                    {/* ARIA */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>TabList:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<div role="tablist" aria-orientation="' + orientation + '">'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Tab:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<button role="tab" aria-selected={true|false} aria-controls={panelId}>'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>TabPanel:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<div role="tabpanel" aria-labelledby={tabId}>'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            {orientation === 'horizontal'
                              ? 'ArrowRight/ArrowLeft cycle tabs (wraps). Home/End jump to first/last.'
                              : 'ArrowDown/ArrowUp cycle tabs (wraps). Home/End jump to first/last.'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Focus:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            outline: 3px solid var(--Focus-Visible), outlineOffset: -3px (inset)
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Icon-only tabs:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Label text hidden visually. Add aria-label to each Tab for screen reader access.
                          </Caption>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Size Reference */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Size Reference</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Small', note: '13px text, 16px icon, 32px min-height, 3px indicator' },
                          { label: 'Medium', note: '14px text, 18px icon, 40px min-height, 3px indicator' },
                          { label: 'Large', note: '16px text, 20px icon, 48px min-height, 3px indicator' },
                        ].map(({ label, note }, i, arr) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                            <BodySmall>{label}{size === label.toLowerCase() ? ' ← current' : ''}</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>{note}</Caption>
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

export default TabsShowcase;
