// src/components/AppBar/AppBarShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { AppBar, DesktopAppBar, MobileAppBar } from './AppBar';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const BAR_COLORS = ['default', 'primary', 'primary-light', 'primary-medium', 'primary-dark', 'white', 'black'];
const THEME_MAP = {
  'default':        'App-Bar',
  'primary':        'Primary',
  'primary-light':  'Primary-Light',
  'primary-medium': 'Primary-Medium',
  'primary-dark':   'Primary-Dark',
  'white':          'Neutral',
  'black':          'Neutral-Dark',
};

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
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// Swatch for bar colors — uses the theme map
function BarColorSwatch({ color, selected, onClick }) {
  const dataTheme = THEME_MAP[color] || 'App-Bar';
  return (
    <Box component="button" data-theme={dataTheme} data-surface="Surface-Bright"
      onClick={() => onClick(color)} aria-label={'Select ' + color} aria-pressed={selected} title={color}
      sx={{
        width: 'var(--Button-Height, 36px)', height: 'var(--Button-Height, 36px)', borderRadius: '4px',
        backgroundColor: 'var(--Background)',
        border: selected ? '2px solid var(--Text)' : '2px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Text)', pointerEvents: 'none' }} />}
    </Box>
  );
}

export function AppBarShowcase() {
  const [mode, setMode]                   = useState('desktop');
  const [barColor, setBarColor]           = useState('default');
  const [loginType, setLoginType]         = useState('login');
  const [menuType, setMenuType]           = useState('hamburger');
  const [brandType, setBrandType]         = useState('name');
  const [searchPosition, setSearchPosition] = useState('right');
  const [mobileVariant, setMobileVariant] = useState('search');
  const [bgTheme, setBgTheme]             = useState(null);
  const [contrastData, setContrastData]   = useState({});

  const isDesktop = mode === 'desktop';
  const dataTheme = THEME_MAP[barColor] || 'App-Bar';

  const generateCode = () => {
    if (isDesktop) {
      const props = [];
      if (barColor !== 'default')      props.push('barColor="' + barColor + '"');
      if (loginType !== 'login')        props.push('loginType="' + loginType + '"');
      if (menuType !== 'hamburger')     props.push('menuType="' + menuType + '"');
      if (brandType !== 'name')         props.push('brandType="' + brandType + '"');
      if (searchPosition !== 'right')   props.push('searchPosition="' + searchPosition + '"');
      const propsStr = props.length ? '\n  ' + props.join('\n  ') + '\n' : '';
      return '<AppBar mode="desktop"' + (propsStr ? propsStr : ' ') + 'companyName="My App" />';
    } else {
      const props = ['mode="mobile"', 'mobileVariant="' + mobileVariant + '"'];
      if (barColor !== 'default') props.push('barColor="' + barColor + '"');
      return '<AppBar\n  ' + props.join('\n  ') + '\n  title="Page Title"\n/>';
    }
  };

  useEffect(() => {
    const data = {};
    data.text         = getCssVar('--Text');
    data.textQuiet    = getCssVar('--Text-Quiet');
    data.background   = getCssVar('--Background');
    data.border       = getCssVar('--Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    data.hover        = getCssVar('--Hover');
    data.active       = getCssVar('--Active');
    setContrastData(data);
  }, [barColor, mode]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>App Bar</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          {/* Preview */}
          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: isDesktop ? '100%' : 420, overflow: 'hidden' }}>
              {isDesktop ? (
                <DesktopAppBar
                  barColor={barColor}
                  loginType={loginType}
                  menuType={menuType}
                  brandType={brandType}
                  searchPosition={searchPosition}
                  companyName="My App"
                  navLinks={['Home', 'Products', 'About']}
                />
              ) : (
                <MobileAppBar
                  barColor={barColor}
                  mobileVariant={mobileVariant}
                  companyName="My App"
                  title="Page Title"
                  subtitle="Subtitle text"
                />
              )}
            </Box>
          </PreviewSurface>

          {/* JSX Code */}
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block' }}>
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

              {/* Playground */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker value={bgTheme} onChange={setBgTheme} />
                  </Box>

                  {/* Mode */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MODE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['desktop', 'mobile'].map((m) => (
                        <ControlButton key={m} label={cap(m)} selected={mode === m} onClick={() => setMode(m)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Bar Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BAR COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {BAR_COLORS.map((c) => (
                        <BarColorSwatch key={c} color={c} selected={barColor === c} onClick={setBarColor} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 6, display: 'block' }}>
                      {dataTheme ? 'data-theme="' + dataTheme + '"' : ''}
                    </Caption>
                  </Box>

                  {/* Desktop-only controls */}
                  {isDesktop && (
                    <>
                      {/* Menu Type */}
                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MENU TYPE</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['hamburger', 'expanded'].map((m) => (
                            <ControlButton key={m} label={cap(m)} selected={menuType === m} onClick={() => setMenuType(m)} />
                          ))}
                        </Stack>
                        <Caption style={{ color: 'var(--Text-Quiet)', marginTop: 4, display: 'block' }}>
                          Expanded auto-falls back to hamburger when nav &gt; 3 links
                        </Caption>
                      </Box>

                      {/* Brand Type */}
                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BRAND</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['name', 'logo'].map((b) => (
                            <ControlButton key={b} label={cap(b)} selected={brandType === b} onClick={() => setBrandType(b)} />
                          ))}
                        </Stack>
                      </Box>

                      {/* Search Position */}
                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SEARCH POSITION</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['left', 'right'].map((p) => (
                            <ControlButton key={p} label={cap(p)} selected={searchPosition === p} onClick={() => setSearchPosition(p)} />
                          ))}
                        </Stack>
                      </Box>

                      {/* Login Type */}
                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LOGIN TYPE</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['login', 'avatar'].map((l) => (
                            <ControlButton key={l} label={cap(l)} selected={loginType === l} onClick={() => setLoginType(l)} />
                          ))}
                        </Stack>
                      </Box>
                    </>
                  )}

                  {/* Mobile-only controls */}
                  {!isDesktop && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MOBILE VARIANT</OverlineSmall>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {['search', 'small', 'medium', 'large'].map((v) => (
                          <ControlButton key={v} label={cap(v)} selected={mobileVariant === v} onClick={() => setMobileVariant(v)} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                </Box>
              </TabPanel>

              {/* Accessibility */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {mode} / {barColor} {!isDesktop ? '/ ' + mobileVariant : ''} — data-theme="{dataTheme}" data-surface="Surface-Bright"
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Text Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Text Contrast (WCAG 1.4.3 — 4.5:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        All text and icons must have 4.5:1 contrast against the AppBar background.
                      </BodySmall>
                      <A11yRow
                        label="Resting: var(--Text) vs. var(--Background)"
                        ratio={getContrast(contrastData.text, contrastData.background)}
                        threshold={4.5}
                        note={'data-theme="' + dataTheme + '" data-surface="Surface-Bright"'}
                      />
                      <A11yRow
                        label="On hover: var(--Text) vs. var(--Hover)"
                        ratio={getContrast(contrastData.text, contrastData.hover)}
                        threshold={4.5}
                        note="Icon buttons use var(--Hover) on hover"
                      />
                      <A11yRow
                        label="On active: var(--Text) vs. var(--Active)"
                        ratio={getContrast(contrastData.text, contrastData.active)}
                        threshold={4.5}
                        note="Icon buttons use var(--Active) on press"
                      />
                    </Box>

                    {/* Focus Indicator */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus Indicator (WCAG 2.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        3px focus ring on all interactive elements — does not overlap adjacent elements.
                      </BodySmall>
                      <A11yRow
                        label="var(--Focus-Visible) vs. var(--Background)"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                        threshold={3.0}
                        note="outline: 3px solid var(--Focus-Visible); outline-offset: 1px"
                      />
                    </Box>

                    {/* Touch Target */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Touch Target Area (WCAG 2.5.5)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Icon buttons are 40×40px. AppBar height is 64px desktop, 64px mobile.
                      </BodySmall>
                      {[
                        { label: 'Icon button', size: 40, note: 'width: 40px, height: 40px' },
                        { label: 'AppBar (desktop)', size: 64, note: 'height: 64px' },
                        { label: 'AppBar (mobile)', size: 64, note: 'height: 64px' },
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
                              <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                backgroundColor: passDesktop ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
                                color: passDesktop ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
                                Desktop {passDesktop ? '✓' : '✗'}
                              </Box>
                              <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                backgroundColor: passIOS ? 'var(--Tags-Success-BG)' : 'var(--Tags-Warning-BG)',
                                color: passIOS ? 'var(--Tags-Success-Text)' : 'var(--Tags-Warning-Text)' }}>
                                iOS {passIOS ? '✓' : '~'}
                              </Box>
                              <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                backgroundColor: passAndroid ? 'var(--Tags-Success-BG)' : 'var(--Tags-Warning-BG)',
                                color: passAndroid ? 'var(--Tags-Success-Text)' : 'var(--Tags-Warning-Text)' }}>
                                Android {passAndroid ? '✓' : '~'}
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* ARIA */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Landmark:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<header role="banner">'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Navigation (expanded menu):</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'<nav aria-label="Main navigation">'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Theme attribute:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                            {'data-theme="' + dataTheme + '" data-surface="Surface-Bright"'}
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Icon buttons:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            All icon buttons have aria-label. Focus visible on keyboard navigation.
                          </Caption>
                        </Box>
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Keyboard:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Tab navigates all interactive elements. Enter/Space activates buttons.
                          </Caption>
                        </Box>
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

export default AppBarShowcase;