// src/components/Icon/IconShowcase.js
import React, { useState, useEffect } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@omni-design/icons/ContentCopy';
import CheckIcon from '@omni-design/icons/Check';
import FavoriteIcon from '@omni-design/icons/Favorite';
// Filled
import HomeIcon from '@omni-design/icons/Home';
import DeleteIcon from '@omni-design/icons/Delete';
import SettingsIcon from '@omni-design/icons/Settings';
import SearchIcon from '@omni-design/icons/Search';
import StarIcon from '@omni-design/icons/Star';
import PersonIcon from '@omni-design/icons/Person';
import NotificationsIcon from '@omni-design/icons/Notifications';
import VisibilityIcon from '@omni-design/icons/Visibility';
import ShoppingCartIcon from '@omni-design/icons/ShoppingCart';
import LockIcon from '@omni-design/icons/Lock';
import InfoIcon from '@omni-design/icons/Info';
// Outlined
import HomeOutlinedIcon from '@omni-design/icons/HomeOutlined';
import FavoriteOutlinedIcon from '@omni-design/icons/FavoriteBorderOutlined';
import DeleteOutlinedIcon from '@omni-design/icons/DeleteOutlined';
import SettingsOutlinedIcon from '@omni-design/icons/SettingsOutlined';
import StarOutlinedIcon from '@omni-design/icons/StarOutline';
import PersonOutlinedIcon from '@omni-design/icons/PersonOutlined';
import NotificationsOutlinedIcon from '@omni-design/icons/NotificationsOutlined';
import VisibilityOutlinedIcon from '@omni-design/icons/VisibilityOutlined';
import ShoppingCartOutlinedIcon from '@omni-design/icons/ShoppingCartOutlined';
import LockOutlinedIcon from '@omni-design/icons/LockOutlined';
import InfoOutlinedIcon from '@omni-design/icons/InfoOutlined';
// Rounded
import HomeRoundedIcon from '@omni-design/icons/HomeRounded';
import FavoriteRoundedIcon from '@omni-design/icons/FavoriteRounded';
import DeleteRoundedIcon from '@omni-design/icons/DeleteRounded';
import SettingsRoundedIcon from '@omni-design/icons/SettingsRounded';
import SearchRoundedIcon from '@omni-design/icons/SearchRounded';
import StarRoundedIcon from '@omni-design/icons/StarRounded';
import PersonRoundedIcon from '@omni-design/icons/PersonRounded';
import NotificationsRoundedIcon from '@omni-design/icons/NotificationsRounded';
import VisibilityRoundedIcon from '@omni-design/icons/VisibilityRounded';
import ShoppingCartRoundedIcon from '@omni-design/icons/ShoppingCartRounded';
import LockRoundedIcon from '@omni-design/icons/LockRounded';
import InfoRoundedIcon from '@omni-design/icons/InfoRounded';
// TwoTone
import HomeTwoToneIcon from '@omni-design/icons/HomeTwoTone';
import FavoriteTwoToneIcon from '@omni-design/icons/FavoriteTwoTone';
import DeleteTwoToneIcon from '@omni-design/icons/DeleteTwoTone';
import SettingsTwoToneIcon from '@omni-design/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@omni-design/icons/SearchTwoTone';
import StarTwoToneIcon from '@omni-design/icons/StarTwoTone';
import PersonTwoToneIcon from '@omni-design/icons/PersonTwoTone';
import NotificationsTwoToneIcon from '@omni-design/icons/NotificationsTwoTone';
import VisibilityTwoToneIcon from '@omni-design/icons/VisibilityTwoTone';
import ShoppingCartTwoToneIcon from '@omni-design/icons/ShoppingCartTwoTone';
import LockTwoToneIcon from '@omni-design/icons/LockTwoTone';
import InfoTwoToneIcon from '@omni-design/icons/InfoTwoTone';
// Sharp
import HomeSharpIcon from '@omni-design/icons/HomeSharp';
import FavoriteSharpIcon from '@omni-design/icons/FavoriteSharp';
import DeleteSharpIcon from '@omni-design/icons/DeleteSharp';
import SettingsSharpIcon from '@omni-design/icons/SettingsSharp';
import SearchSharpIcon from '@omni-design/icons/SearchSharp';
import StarSharpIcon from '@omni-design/icons/StarSharp';
import PersonSharpIcon from '@omni-design/icons/PersonSharp';
import NotificationsSharpIcon from '@omni-design/icons/NotificationsSharp';
import VisibilitySharpIcon from '@omni-design/icons/VisibilitySharp';
import ShoppingCartSharpIcon from '@omni-design/icons/ShoppingCartSharp';
import LockSharpIcon from '@omni-design/icons/LockSharp';
import InfoSharpIcon from '@omni-design/icons/InfoSharp';

import { Icon } from './Icon';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { NumberField } from '../NumberField/NumberField';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { H3, H5, BodySmall, Caption, Label, EyebrowSmall } from '../Typography';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { getContrast, getCssVar } from '../contrast';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLOR_LABEL_MAP = {
  default: 'Default', quiet: 'Quiet', primary: 'Primary', secondary: 'Secondary',
  tertiary: 'Tertiary', neutral: 'Neutral', info: 'Info', success: 'Success',
  warning: 'Warning', error: 'Error',
};
const COLOR_GROUPS = [
  { label: 'Default',  colors: ['default'] },
  { label: 'Theme',    colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
];
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
  return <Button selected={selected} variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>{label}</Button>;
}

export function IconShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
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
    : ({ xs: '12px', small: '16px', medium: '24px', large: '36px' }[size] || '24px');
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
    return "import " + importName + " from '@omni-design/icons/" + selectedIcon + (suffix||"") + "';\n\n<Icon" + p + ">\n  <" + importName + " />\n</Icon>";
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
      <ShowcaseHeader title="Icon" component="Icon" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
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
                <DocSummary component="Icon" theme={bgTheme} surface={bgSurface} />
              </TabPanel>
<TabPanel value={1}>
        <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
          <CodeBlock
            code={generateCode()}
            language="JSX"
            wrap
            sx={{ mt: 2 }}
          />
        </Grid>
          <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>

                  {/* Icon name */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ICON</EyebrowSmall>
                    {/* The library's TextInput, not a browser input. */}
                    <Input size="small" fullWidth value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                      placeholder="e.g. Home, Favorite, Delete"
                      aria-label="Icon name" />
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
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {STYLES.map((s) => <ControlButton key={s} label={STYLE_LABELS[s]} selected={style===s} onClick={() => setStyle(s)} />)}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
                    <Stack spacing={1.5}>
                      {COLOR_GROUPS.map((group) => (
                        <Box key={group.label}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>
                            {group.label}
                          </Caption>
                          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                            {group.colors.map((c) => {
                              const CC = COLOR_LABEL_MAP[c];
                              const isSel = color === c;
                              return (
                                <Box key={c} component="button" onClick={() => setColor(c)}
                                  aria-label={'Select ' + cap(c)} aria-pressed={isSel} title={cap(c)}
                                  sx={{
                                    width: 'var(--Button-Height)', height: 'var(--Button-Height)',
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--Icons-' + CC + ')',
                                    border: isSel ? '2px solid var(--Text)' : '1px solid var(--Border)',
                                    outline: isSel ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
                                    outlineOffset: '1px',
                                    cursor: 'pointer', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'transform 0.1s ease',
                                    '&:hover': { transform: 'scale(1.1)' },
                                  }}>
                                  {isSel && (
                                    <CheckIcon sx={{ fontSize: 16, color: 'var(--Background)', pointerEvents: 'none' }} />
                                  )}
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['small','medium','large','custom'].map((s) => <ControlButton key={s} label={cap(s)} selected={size===s} onClick={() => setSize(s)} />)}
                    </Stack>
                    {size === 'custom' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                        {/* The library's NumberField, not a browser input. */}
                        <NumberField size="small" min={1} value={customSize}
                          onChange={(v) => setCustomSize(String(v))}
                          aria-label="Custom font size in pixels"
                          sx={{ width: 96 }} />
                        <Caption style={{ color: 'var(--Text-Quiet)' }}>px</Caption>
                      </Box>
                    )}
                  </Box>

                  {/* aria-label */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ARIA LABEL</EyebrowSmall>
                    {/* The library's TextInput, not a browser input. */}
                    <Input size="small" fullWidth value={ariaLabel}
                      onChange={(e) => setAriaLabel(e.target.value)}
                      placeholder={'Leave empty for decorative (aria-hidden)'}
                      aria-label="Icon aria-label" />
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
              </Grid>
        </Grid>
      </TabPanel>
<TabPanel value={2}>
                <A11yScopeNote />
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
<TabPanel value={3}>
                <DocChanges component="Icon" />
              </TabPanel>
      </Tabs>

    </Box>
  );
}

export default IconShowcase;