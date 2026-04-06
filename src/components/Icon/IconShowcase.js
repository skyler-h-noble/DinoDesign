// src/components/Icon/IconShowcase.js
import React, { useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
// Filled
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
// Outlined
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Rounded
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// TwoTone
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
// Sharp
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';

import { Icon } from './Icon';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { H2, H5, BodySmall, Caption, Label, OverlineSmall } from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLORS = ['default', 'quiet', 'primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_LABEL_MAP = {
  default: 'Default', quiet: 'Quiet', primary: 'Primary', secondary: 'Secondary',
  neutral: 'Neutral', info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const STYLES = ['filled', 'outlined', 'rounded', 'twotone', 'sharp'];
const STYLE_LABELS = { filled: 'Filled', outlined: 'Outlined', rounded: 'Rounded', twotone: 'Two Tone', sharp: 'Sharp' };
const ICON_NAMES = ['Home', 'Favorite', 'Delete', 'Settings', 'Search', 'Star', 'Person', 'Notifications', 'Visibility', 'ShoppingCart', 'Lock', 'Info'];
const ICON_REGISTRY = {
  Home:          { filled: HomeIcon,          outlined: HomeOutlinedIcon,          rounded: HomeRoundedIcon,          twotone: HomeTwoToneIcon,          sharp: HomeSharpIcon },
  Favorite:      { filled: FavoriteIcon,      outlined: FavoriteOutlinedIcon,      rounded: FavoriteRoundedIcon,      twotone: FavoriteTwoToneIcon,      sharp: FavoriteSharpIcon },
  Delete:        { filled: DeleteIcon,        outlined: DeleteOutlinedIcon,        rounded: DeleteRoundedIcon,        twotone: DeleteTwoToneIcon,        sharp: DeleteSharpIcon },
  Settings:      { filled: SettingsIcon,      outlined: SettingsOutlinedIcon,      rounded: SettingsRoundedIcon,      twotone: SettingsTwoToneIcon,      sharp: SettingsSharpIcon },
  Search:        { filled: SearchIcon,        outlined: SearchIcon,                rounded: SearchRoundedIcon,        twotone: SearchTwoToneIcon,        sharp: SearchSharpIcon },
  Star:          { filled: StarIcon,          outlined: StarOutlinedIcon,          rounded: StarRoundedIcon,          twotone: StarTwoToneIcon,          sharp: StarSharpIcon },
  Person:        { filled: PersonIcon,        outlined: PersonOutlinedIcon,        rounded: PersonRoundedIcon,        twotone: PersonTwoToneIcon,        sharp: PersonSharpIcon },
  Notifications: { filled: NotificationsIcon, outlined: NotificationsOutlinedIcon, rounded: NotificationsRoundedIcon, twotone: NotificationsTwoToneIcon,  sharp: NotificationsSharpIcon },
  Visibility:    { filled: VisibilityIcon,    outlined: VisibilityOutlinedIcon,    rounded: VisibilityRoundedIcon,    twotone: VisibilityTwoToneIcon,    sharp: VisibilitySharpIcon },
  ShoppingCart:  { filled: ShoppingCartIcon,  outlined: ShoppingCartOutlinedIcon,  rounded: ShoppingCartRoundedIcon,  twotone: ShoppingCartTwoToneIcon,  sharp: ShoppingCartSharpIcon },
  Lock:          { filled: LockIcon,          outlined: LockOutlinedIcon,          rounded: LockRoundedIcon,          twotone: LockTwoToneIcon,          sharp: LockSharpIcon },
  Info:          { filled: InfoIcon,          outlined: InfoOutlinedIcon,          rounded: InfoRoundedIcon,          twotone: InfoTwoToneIcon,          sharp: InfoSharpIcon },
};

function getIconComponent(name, style) { return ICON_REGISTRY[name]?.[style] || ICON_REGISTRY[name]?.filled || HomeIcon; }
function getIconSuffix(style) { return { outlined: 'Outlined', rounded: 'Rounded', twotone: 'TwoTone', sharp: 'Sharp' }[style] || ''; }

function getLuminance(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0,2),16)/255, g = parseInt(c.substring(2,4),16)/255, b = parseInt(c.substring(4,6),16)/255;
  const t = (v) => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  return 0.2126*t(r) + 0.7152*t(g) + 0.0722*t(b);
}
function getContrast(hex1, hex2) {
  if (!hex1||!hex2||!hex1.startsWith('#')||!hex2.startsWith('#')) return null;
  const l1=getLuminance(hex1), l2=getLuminance(hex2);
  return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2);
}
function getCssVar(v) { return typeof window==='undefined' ? null : getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>{ratio}:1</Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>{passes ? 'Pass' : 'Fail'}</Caption>
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
      aria-label={copied ? 'Copied' : 'Copy code'} sx={{ color: copied ? '#4ade80' : '#9ca3af' }}>
      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
    </Button>
  );
}
function ControlButton({ label, selected, onClick }) {
  return <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>{label}</Button>;
}

export function IconShowcase() {
  const [style, setStyle]           = useState('filled');
  const [color, setColor]           = useState('default');
  const [size, setSize]             = useState('medium');
  const [customSize, setCustomSize] = useState('40');
  const [disabled, setDisabled]     = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Home');
  const [ariaLabel, setAriaLabel]   = useState('');
  const [contrastData, setContrastData] = useState({});

  const C = COLOR_LABEL_MAP[color] || 'Default';
  const isTwoTone = style === 'twotone';
  const resolvedFontSize = size === 'custom'
    ? (parseInt(customSize, 10) || 40) + 'px'
    : ({ small: '20px', medium: '24px', large: '36px' }[size] || '24px');
  const IconComp = getIconComponent(selectedIcon, style);
  const suffix = getIconSuffix(style);
  const importName = selectedIcon + suffix + 'Icon';

  // Whether the current icon is decorative (no aria-label) or meaningful
  const isMeaningful = ariaLabel.trim().length > 0;

  const generateCode = () => {
    const parts = [];
    if (color !== 'default')  parts.push('color="' + color + '"');
    if (size === 'custom')    { parts.push('size="custom"'); parts.push('fontSize={' + (parseInt(customSize,10)||40) + '}'); }
    else if (size !== 'medium') parts.push('size="' + size + '"');
    if (isTwoTone)            parts.push('twoTone');
    if (disabled)             parts.push('disabled');
    if (isMeaningful)         parts.push('aria-label="' + ariaLabel.trim() + '"');
    const p = parts.length ? ' ' + parts.join(' ') : '';
    return "import " + importName + " from '@mui/icons-material/" + selectedIcon + (suffix||"") + "';\n\n<Icon" + p + ">\n  <" + importName + " />\n</Icon>";
  };

  // Decorative code example using the current icon
  const decorativeExample = '<Icon>\n  <' + importName + ' />\n</Icon>\n{/* aria-hidden="true" by default */}';

  // Meaningful code example using the current icon + aria-label input (or a placeholder)
  const meaningfulLabel = isMeaningful ? ariaLabel.trim() : selectedIcon + ' icon';
  const meaningfulExample = '<Icon aria-label="' + meaningfulLabel + '">\n  <' + importName + ' />\n</Icon>\n{/* role="img" added automatically */}';

  useEffect(() => {
    setContrastData({
      background:  getCssVar('--Background'),
      iconColor:   getCssVar('--Icons-' + C),
      iconVariant: getCssVar('--Icons-Variant-' + C),
    });
  }, [color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Icon</H2>
      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 200, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 2 }}>
            <Icon
              color={color}
              size={size}
              fontSize={size === 'custom' ? parseInt(customSize, 10) || 40 : undefined}
              disabled={disabled}
              twoTone={isTwoTone}
              aria-label={isMeaningful ? ariaLabel.trim() : undefined}
            >
              <IconComp />
            </Icon>
          </Box>
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Icon name */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON</OverlineSmall>
                    <Box component="input" type="text" value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                      placeholder="e.g. Home, Favorite, Delete"
                      sx={{
                        width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                        border: '1px solid var(--Border)', borderRadius: '4px',
                        backgroundColor: 'var(--Background)', color: 'var(--Text)',
                        boxSizing: 'border-box',
                        '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px', borderColor: 'var(--Focus-Visible)' },
                      }} />
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      Enter a MUI icon name.{' '}
                      <Box component="a" href="https://mui.com/material-ui/material-icons/"
                        target="_blank" rel="noopener noreferrer"
                        sx={{ color: 'var(--Text-Primary)', textDecoration: 'underline', '&:hover': { color: 'var(--Header-Primary)' } }}>
                        Browse MUI Icons ↗
                      </Box>
                    </Caption>
                  </Box>

                  {/* Style */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {STYLES.map((s) => <ControlButton key={s} label={STYLE_LABELS[s]} selected={style===s} onClick={() => setStyle(s)} />)}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {COLORS.map((c) => {
                        const CC = COLOR_LABEL_MAP[c];
                        const isSel = color === c;
                        return (
                          <Box key={c} component="button" onClick={() => setColor(c)}
                            aria-label={'Select ' + cap(c)} aria-pressed={isSel} title={cap(c)}
                            sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
                              cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--Icons-' + CC + ')', backgroundColor: 'var(--Background)',
                              border: isSel ? '2px solid var(--Text)' : '2px solid var(--Border)',
                              outline: isSel ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
                              outlineOffset: '1px', transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.1)' } }}>
                            <IconComp sx={{ fontSize: 18 }} />
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['small','medium','large','custom'].map((s) => <ControlButton key={s} label={cap(s)} selected={size===s} onClick={() => setSize(s)} />)}
                    </Stack>
                    {size === 'custom' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                        <Box component="input" type="number" value={customSize} onChange={(e) => setCustomSize(e.target.value)}
                          aria-label="Custom font size in pixels"
                          sx={{ width: 72, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
                            border: '1px solid var(--Border)', borderRadius: '4px',
                            backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                            '&:focus': { borderColor: 'var(--Focus-Visible)' } }} />
                        <Caption style={{ color: 'var(--Text-Quiet)' }}>px</Caption>
                      </Box>
                    )}
                  </Box>

                  {/* aria-label */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ARIA LABEL</OverlineSmall>
                    <Box component="input" type="text" value={ariaLabel}
                      onChange={(e) => setAriaLabel(e.target.value)}
                      placeholder={'Leave empty for decorative (aria-hidden)'}
                      sx={{
                        width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                        border: '1px solid var(--Border)', borderRadius: '4px',
                        backgroundColor: 'var(--Background)', color: 'var(--Text)',
                        boxSizing: 'border-box',
                        '&:focus': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px', borderColor: 'var(--Focus-Visible)' },
                      }} />
                    <Caption style={{ color: isMeaningful ? 'var(--Tags-Success-Text)' : 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {isMeaningful
                        ? '✓ Meaningful — role="img" aria-label="' + ariaLabel.trim() + '"'
                        : 'Decorative — aria-hidden="true" (invisible to screen readers)'}
                    </Caption>
                  </Box>

                  {/* Disabled */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Reduces opacity to 0.38</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" aria-label="Toggle disabled" />
                  </Box>
                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {STYLE_LABELS[style]} / {cap(color)} / {size === 'custom' ? customSize + 'px' : size}
                    {isMeaningful ? ' / meaningful' : ' / decorative'}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* Contrast */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Icon Contrast (WCAG 1.4.11 — 3:1)</H5>
                      <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                        Non-text elements must contrast 3:1 against the page background.
                      </BodySmall>
                      <A11yRow
                        label={'var(--Icons-' + C + ') vs. var(--Background)'}
                        ratio={getContrast(contrastData.iconColor, contrastData.background)}
                        threshold={3.0}
                        note={importName + ' at ' + resolvedFontSize + ' in ' + cap(color) + ' color'}
                      />
                      {isTwoTone && (
                        <A11yRow
                          label={'var(--Icons-Variant-' + C + ') vs. var(--Background)'}
                          ratio={getContrast(contrastData.iconVariant, contrastData.background)}
                          threshold={3.0}
                          note="Two-tone secondary fill — must also meet 3:1"
                        />
                      )}
                    </Box>

                    {/* ARIA — dynamic, based on playground state */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>

                        {/* Current state */}
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)', backgroundColor: isMeaningful ? 'var(--Tags-Success-BG, rgba(0,200,0,0.05))' : 'transparent', px: 1, borderRadius: '4px' }}>
                          <BodySmall style={{ fontWeight: 600 }}>
                            Current icon — {isMeaningful ? 'meaningful ✓' : 'decorative'}
                          </BodySmall>
                          <Box component="pre" sx={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                            {isMeaningful ? meaningfulExample : decorativeExample}
                          </Box>
                        </Box>

                        {/* Decorative explanation */}
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Decorative (no aria-label):</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            aria-hidden="true" is applied automatically. The icon is invisible to screen readers.
                            Use this when the icon is purely visual — e.g. a decorative bullet or inline illustration.
                          </Caption>
                          <Box component="pre" sx={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                            {decorativeExample}
                          </Box>
                        </Box>

                        {/* Meaningful explanation */}
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Meaningful (with aria-label):</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            role="img" is added automatically. The label is announced by screen readers.
                            Use this when the icon conveys information that is not present in surrounding text.
                          </Caption>
                          <Box component="pre" sx={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--Text-Quiet)', mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                            {meaningfulExample}
                          </Box>
                        </Box>

                        {/* Disabled */}
                        <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <BodySmall>Disabled state{disabled ? ' ← current' : ''}:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            Opacity 0.38 — visual cue only. To disable an action, disable the wrapping interactive element (button, link), not the icon itself.
                          </Caption>
                        </Box>

                        {/* Two-tone */}
                        {isTwoTone && (
                          <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>Two-tone{isTwoTone ? ' ← current' : ''}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)' }}>
                              Secondary fill uses var(--Icons-Variant-{C}). Both the primary and secondary fills must meet 3:1 contrast independently.
                            </Caption>
                          </Box>
                        )}

                        {/* Size note */}
                        <Box sx={{ py: 1.5 }}>
                          <BodySmall>Touch target — {resolvedFontSize} icon{size === 'small' ? ' ⚠' : ' ✓'}:</BodySmall>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>
                            {size === 'small'
                              ? 'Small icons (20px) need a 24px minimum target area around them (WCAG 2.5.5). Wrap in a button with padding.'
                              : 'Icon is ' + resolvedFontSize + ' — meets 24px minimum. Ensure the wrapping interactive element also meets 24×24px.'}
                          </Caption>
                        </Box>

                      </Stack>
                    </Box>

                    {/* Size reference */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Size Reference</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Small',  s: 'small',  px: '20px', note: 'Inline text, compact UI' },
                          { label: 'Medium', s: 'medium', px: '24px', note: 'Standard UI — default' },
                          { label: 'Large',  s: 'large',  px: '36px', note: 'Emphasis, empty states, hero areas' },
                          { label: 'Custom', s: 'custom', px: 'any',  note: 'Ensure 24×24px minimum touch target (WCAG 2.5.5)' },
                        ].map(({ label, s, px, note }, i, arr) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: i < arr.length-1 ? '1px solid var(--Border)' : 'none',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <BodySmall>{label} — {px}</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)' }}>{note}</Caption>
                            </Box>
                            {size === s && (
                              <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                backgroundColor: 'var(--Tags-Success-BG)', color: 'var(--Tags-Success-Text)' }}>current</Box>
                            )}
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

export default IconShowcase;