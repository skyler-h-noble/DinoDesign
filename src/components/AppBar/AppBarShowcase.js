// src/components/AppBar/AppBarShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { AppBar } from './AppBar';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const ICON_MAP = {
  Notifications: <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  Favorite: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  Share: <ShareIcon sx={{ fontSize: 'inherit' }} />,
  Bookmark: <BookmarkIcon sx={{ fontSize: 'inherit' }} />,
  Add: <AddIcon sx={{ fontSize: 'inherit' }} />,
  Mail: <MailIcon sx={{ fontSize: 'inherit' }} />,
  Person: <PersonIcon sx={{ fontSize: 'inherit' }} />,
  Home: <HomeIcon sx={{ fontSize: 'inherit' }} />,
  Search: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Check: <CheckIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const BAR_COLORS = [
  { value: 'default', label: 'Default', desc: 'data-theme="App-Bar"' },
  { value: 'primary', label: 'Primary', desc: 'data-theme="Primary"' },
  { value: 'primary-light', label: 'Primary Light', desc: 'data-theme="Primary-Light"' },
  { value: 'primary-medium', label: 'Primary Medium', desc: 'data-theme="Primary-Medium"' },
  { value: 'primary-dark', label: 'Primary Dark', desc: 'data-theme="Primary-Dark"' },
  { value: 'white', label: 'White', desc: 'data-theme="Neutral"' },
  { value: 'black', label: 'Black', desc: 'data-theme="Neutral-Dark"' },
];

const DEFAULT_NAV_LINKS = ['Home', 'Products', 'About'];

/* --- Helpers --- */
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
function ControlButton({ label, selected, onClick, disabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={disabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: disabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
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
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
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
function CheckboxControl({ label, checked, onChange, caption, disabled }) {
  return (
    <Box sx={{ py: 0.5, opacity: disabled ? 0.4 : 1 }}>
      <FormControlLabel
        control={<MuiCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} size="small" disabled={disabled}
          sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} />}
        label={<Label>{label}</Label>} sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </Box>
  );
}

export function AppBarShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [mode, setMode] = useState('desktop');
  const [barColor, setBarColor] = useState('default');

  // Desktop
  const [loginType, setLoginType] = useState('login');
  const [menuType, setMenuType] = useState('hamburger');
  const [brandType, setBrandType] = useState('name');
  const [searchPos, setSearchPos] = useState('right');
  const [companyName, setCompanyName] = useState('Company');
  const [showRightBtns, setShowRightBtns] = useState(false);
  const [rightBtnCount, setRightBtnCount] = useState(2);
  const [rightBtnIcons, setRightBtnIcons] = useState(['Notifications', 'Settings', 'Favorite', 'Share']);

  // Nav links (for expanded menu)
  const [navLinkCount, setNavLinkCount] = useState(3);
  const [navLinkLabels, setNavLinkLabels] = useState(['Home', 'Products', 'About', 'Contact', 'Blog', 'Help']);

  // Mobile
  const [mobileVariant, setMobileVariant] = useState('search');
  const [mobileTitle, setMobileTitle] = useState('Page Title');
  const [mobileSubtitle, setMobileSubtitle] = useState('Subtitle text');
  const [mobileActionIcon, setMobileActionIcon] = useState('Check');

  const canExpanded = navLinkCount <= 3;

  // Force hamburger when nav links > 3
  useEffect(() => {
    if (navLinkCount > 3 && menuType === 'expanded') {
      setMenuType('hamburger');
    }
  }, [navLinkCount, menuType]);

  const updateRightBtnIcon = (i, val) => {
    setRightBtnIcons((prev) => { const n = [...prev]; n[i] = val; return n; });
  };
  const updateNavLabel = (i, val) => {
    setNavLinkLabels((prev) => { const n = [...prev]; n[i] = val; return n; });
  };

  const rightButtons = rightBtnIcons.slice(0, rightBtnCount).map((name) => ({
    icon: ICON_MAP[name] || ICON_MAP.Notifications, label: name,
  }));
  const navLinks = navLinkLabels.slice(0, navLinkCount);

  const barColorObj = BAR_COLORS.find((c) => c.value === barColor) || BAR_COLORS[0];

  const generateCode = () => {
    const lines = [];
    lines.push('<AppBar');
    lines.push('  mode="' + mode + '"');
    if (barColor !== 'white') lines.push('  barColor="' + barColor + '"');
    if (mode === 'desktop') {
      if (loginType !== 'login') lines.push('  loginType="' + loginType + '"');
      if (menuType !== 'hamburger') lines.push('  menuType="' + menuType + '"');
      if (brandType !== 'name') lines.push('  brandType="' + brandType + '"');
      if (searchPos !== 'right') lines.push('  searchPosition="' + searchPos + '"');
      if (companyName !== 'Company') lines.push('  companyName="' + companyName + '"');
      if (showRightBtns) lines.push('  showRightButtons');
    } else {
      lines.push('  mobileVariant="' + mobileVariant + '"');
      if (mobileVariant !== 'search') {
        lines.push('  title="' + mobileTitle + '"');
        lines.push('  subtitle="' + mobileSubtitle + '"');
      }
    }
    lines.push('/>');
    return lines.join('\n');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>App Bar</H2>
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
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              {mode === 'desktop' ? (
                <Box sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <AppBar
                    mode="desktop"
                    barColor={barColor}
                    loginType={loginType}
                    menuType={menuType}
                    brandType={brandType}
                    searchPosition={searchPos}
                    companyName={companyName}
                    navLinks={navLinks}
                    showRightButtons={showRightBtns}
                    rightButtons={rightButtons}
                  />
                </Box>
              ) : (
                <Box sx={{ width: '100%', maxWidth: 420, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <AppBar
                    mode="mobile"
                    mobileVariant={mobileVariant}
                    barColor={barColor}
                    title={mobileTitle}
                    subtitle={mobileSubtitle}
                    companyName={companyName}
                    actionIcon={ICON_MAP[mobileActionIcon] || ICON_MAP.Check}
                  />
                </Box>
              )}

              <Caption style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>
                {cap(mode)} · {barColorObj.label}
                {mode === 'mobile' ? ' · ' + cap(mobileVariant) : ''}
              </Caption>
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

            {/* Mode */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MODE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Desktop" selected={mode === 'desktop'} onClick={() => setMode('desktop')} />
                <ControlButton label="Mobile" selected={mode === 'mobile'} onClick={() => setMode('mobile')} />
              </Stack>
            </Box>

            {/* Bar Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BAR COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {BAR_COLORS.map((c) => (
                  <ControlButton key={c.value} label={c.label} selected={barColor === c.value} onClick={() => setBarColor(c.value)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {barColorObj.desc} · data-surface="Surface-Bright" · bg: var(--Background) · text: var(--Text)
              </Caption>
            </Box>

            {/* === DESKTOP === */}
            {mode === 'desktop' && (
              <>
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BRANDING</OverlineSmall>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    <ControlButton label="Company Name" selected={brandType === 'name'} onClick={() => setBrandType('name')} />
                    <ControlButton label="Logo" selected={brandType === 'logo'} onClick={() => setBrandType('logo')} />
                  </Stack>
                  {brandType === 'name' && (
                    <Box sx={{ mt: 1.5 }}>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Company Name</Caption>
                      <TextInput value={companyName} onChange={setCompanyName} placeholder="Company" sx={{ width: '100%' }} />
                    </Box>
                  )}
                </Box>

                {/* Menu */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MENU</OverlineSmall>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    <ControlButton label="Hamburger" selected={menuType === 'hamburger'} onClick={() => setMenuType('hamburger')} />
                    <ControlButton label="Expanded" selected={menuType === 'expanded' && canExpanded}
                      onClick={() => { if (canExpanded) setMenuType('expanded'); }}
                      disabled={!canExpanded} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    {!canExpanded
                      ? 'Expanded menu is only available with 3 or fewer nav links. Reduce link count to enable.'
                      : menuType === 'hamburger' ? 'Left hamburger icon for sidebar navigation.' : 'Horizontal nav links inline in the bar.'}
                  </Caption>
                </Box>

                {/* Nav Links */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>NAV LINKS</OverlineSmall>
                  <NumberStepper label="Count" value={navLinkCount} onChange={setNavLinkCount} min={1} max={6} />
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {navLinkLabels.slice(0, navLinkCount).map((lbl, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                        <TextInput value={lbl} onChange={(val) => updateNavLabel(i, val)} placeholder={'Link ' + (i + 1)} />
                      </Box>
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    Used by expanded menu. Hamburger mode stores these for the drawer.
                  </Caption>
                </Box>

                {/* Search */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SEARCH</OverlineSmall>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    <ControlButton label="Left" selected={searchPos === 'left'} onClick={() => setSearchPos('left')} />
                    <ControlButton label="Right" selected={searchPos === 'right'} onClick={() => setSearchPos('right')} />
                    <ControlButton label="None" selected={searchPos === 'none'} onClick={() => setSearchPos('none')} />
                  </Stack>
                </Box>

                {/* Login */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LOGIN</OverlineSmall>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    <ControlButton label="Login Button" selected={loginType === 'login'} onClick={() => setLoginType('login')} />
                    <ControlButton label="Avatar" selected={loginType === 'avatar'} onClick={() => setLoginType('avatar')} />
                  </Stack>
                </Box>

                {/* Right buttons */}
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>RIGHT BUTTON GROUP</OverlineSmall>
                  <CheckboxControl label="Show Right Buttons" checked={showRightBtns} onChange={setShowRightBtns}
                    caption="Icon buttons between search and login." />
                  {showRightBtns && (
                    <Box sx={{ mt: 1.5 }}>
                      <NumberStepper label="Count" value={rightBtnCount} onChange={setRightBtnCount} min={1} max={4} />
                      <Stack spacing={1} sx={{ mt: 1.5 }}>
                        {rightBtnIcons.slice(0, rightBtnCount).map((iconName, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                            <SelectInput value={iconName} onChange={(val) => updateRightBtnIcon(i, val)} options={ICON_NAMES} label={'Button ' + (i + 1)} />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              </>
            )}

            {/* === MOBILE === */}
            {mode === 'mobile' && (
              <>
                <Box sx={{ mt: 3 }}>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MOBILE VARIANT</OverlineSmall>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    {['search', 'small', 'medium', 'large'].map((v) => (
                      <ControlButton key={v} label={cap(v)} selected={mobileVariant === v} onClick={() => setMobileVariant(v)} />
                    ))}
                  </Stack>
                </Box>

                {mobileVariant !== 'search' && (
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
                    <Stack spacing={1.5}>
                      <Box>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Title</Caption>
                        <TextInput value={mobileTitle} onChange={setMobileTitle} placeholder="Page Title" sx={{ width: '100%' }} />
                      </Box>
                      <Box>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Subtitle</Caption>
                        <TextInput value={mobileSubtitle} onChange={setMobileSubtitle} placeholder="Subtitle" sx={{ width: '100%' }} />
                      </Box>
                      <Box>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Action Icon</Caption>
                        <SelectInput value={mobileActionIcon} onChange={setMobileActionIcon} options={ICON_NAMES} label="Action icon" />
                      </Box>
                    </Stack>
                  </Box>
                )}

                {mobileVariant === 'search' && (
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Search Placeholder</Caption>
                    <TextInput value={companyName} onChange={setCompanyName} placeholder="Company" sx={{ width: '100%' }} />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(mode)} · {barColorObj.label}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Landmark:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'<header role="banner">'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'<nav aria-label="Main navigation"> — expanded menu only.'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Search:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'<input aria-label="Search">'}</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Icon buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>All have aria-label. Focus: 3px solid var(--Focus-Visible).</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Bar Color Reference</H5>
              <Stack spacing={0}>
                {BAR_COLORS.map((c, i) => (
                  <Box key={c.value} sx={{ py: 1.5, borderBottom: i < BAR_COLORS.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                    <BodySmall>{c.label}</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{c.desc}</Caption>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Expanded menu:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Only available with 3 or fewer nav links to prevent crowding.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Mobile variants:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Search (64px), Small (64px), Medium (flexible), Large (flexible).</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Right button group:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>1–4 icon buttons. Each must have an aria-label.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default AppBarShowcase;
