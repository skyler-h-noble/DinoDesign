// src/components/Button/ButtonShowcase.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as MuiIcons from '@mui/icons-material';
import { Button } from './Button';
import { Icon } from '../Icon/Icon';
import { Avatar } from '../Avatar/Avatar';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';
import { Select } from '../Select/Select';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { getContrast, getCssVar, getCssVarFrom } from '../contrast';
import {
  H3, H5, BodySmall, Caption, Label, EyebrowSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
];
const STYLES = ['solid', 'outline', 'ghost'];
const CONTENT_TYPES = ['text', 'number', 'letter', 'icon', 'swatch'];

/* ── Contrast helpers ── */

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? '✓' : '✗'} {ratio}:1 {passes ? 'Pass' : 'Fail'}
      </Box>
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

// `pass` is three-valued on purpose. null means the ratio could not be
// measured — a token that did not resolve, or a colour format the parser does
// not read — and that is NOT a failure. Rendering it as one invents
// accessibility bugs that aren't there, which is worse than reporting nothing,
// because someone then goes looking for a contrast problem that does not exist.
function PassFailBadge({ pass, detail }) {
  const unmeasured = pass === null || pass === undefined;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        backgroundColor: unmeasured ? 'var(--Container-High)' : (pass ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)'),
        color: unmeasured ? 'var(--Text-Quiet)' : (pass ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)'),
      }}>
        {unmeasured ? 'Not measured' : `${pass ? '✓' : '✗'} ${detail ? detail + ' ' : ''}${pass ? 'Pass' : 'Fail'}`}
      </Box>
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

function ControlButton({ label, selected, onClick, disabled: isDisabled }) {
  return (
    <Button
      selected={selected} variant={selected ? 'default' : 'default-outline'}
      size="small"
      onClick={onClick}
      disabled={isDisabled}
      sx={{ flexShrink: 0 }}
    >
      {label}
    </Button>
  );
}

function ColorSwatchButton({ color, selected, disabled: isDisabled, onClick, isOutlineMode }) {
  const C = cap(color);
  return (
    <Box
      component="button"
      onClick={() => !isDisabled && onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: isOutlineMode ? 'transparent' : 'var(--Buttons-' + C + '-Button)',
        border: isOutlineMode
          ? (selected ? '2px solid var(--Text)' : '2px solid var(--Buttons-' + C + '-Border)')
          : (selected ? '2px solid var(--Text)' : '1px solid var(--Border)'),
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: isDisabled ? 'not-allowed' : 'pointer', flexShrink: 0,
        opacity: isDisabled ? 0.25 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease',
        '&:hover': !isDisabled ? { transform: 'scale(1.1)' } : {},
      }}>
      {selected && (
        <CheckIcon sx={{
          fontSize: 16,
          color: isOutlineMode ? 'var(--Buttons-' + C + '-Border)' : 'var(--Buttons-' + C + '-Text)',
          pointerEvents: 'none',
        }} />
      )}
    </Box>
  );
}

// Thin wrapper around the design-system Input so call sites in this showcase
// stay terse — same (value, onChange-as-string, placeholder, label) signature.
function TextInput({ value, onChange, placeholder, label }) {
  return (
    <Input
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="primary-outline"
      size="small"
      fullWidth
    />
  );
}

/* ── Main Showcase ── */
export function ButtonShowcase() {
  const [style, setStyle]               = useState('solid');
  const [color, setColor]               = useState('default');
  const [contentType, setContentType]   = useState('text');
  const [size, setSize]                 = useState('medium');
  const [startSlot, setStartSlot]       = useState('icon');     // 'none' | 'icon' | 'avatar'
  const [endSlot, setEndSlot]           = useState('none');     // 'none' | 'icon' | 'avatar'
  const [startAvatarType, setStartAvatarType] = useState('letters'); // 'letters' | 'icon' | 'image'
  const [endAvatarType,   setEndAvatarType]   = useState('letters');
  const [avatarLetters, setAvatarLetters]     = useState('AB');
  const [avatarImageUrl, setAvatarImageUrl]   = useState('https://i.pravatar.cc/300?u=dinodesign');
  const [buttonText, setButtonText]     = useState('Button');
  const [iconName, setIconName]         = useState('Add');
  const [elevated, setElevated]         = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fullWidth, setFullWidth]       = useState(false);
  const [swatchColor, setSwatchColor]   = useState('#505b45');
  const [badge, setBadge]               = useState(false);
  const [badgeContent, setBadgeContent] = useState('3');
  const [contrastData, setContrastData] = useState({});
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');
  const surfaceRef = useRef(null);

  // Update swatch color from primary brand token if available
  useEffect(() => {
    const primary = getCssVar('--Primary-Color-5');
    if (primary && primary.startsWith('#')) setSwatchColor(primary);
  }, []);

  const isGhost = style === 'ghost';
  const effectiveColor = isGhost ? 'primary' : color;
  const noColorPicker = isGhost;

  const sizeDetails = {
    small:  { totalHeight: '32px',              note: '' },
    medium: { totalHeight: 'var(--Button-Height)', note: 'Default design system height.' },
    large:  { totalHeight: '64px',              note: '64px — touch-friendly.' },
  };

  const getVariant = () => {
    if (style === 'solid')   return effectiveColor;
    if (style === 'outline') return effectiveColor + '-outline';
    if (style === 'ghost')   return 'ghost';
    return effectiveColor;
  };

  const getIconComponent = () => {
    const IconComp = MuiIcons[iconName] || MuiIcons['Add'];
    return <Icon><IconComp /></Icon>;
  };

  const getAvatarComponent = (type) => {
    if (type === 'image') {
      return <Avatar src={avatarImageUrl} alt="Avatar" color="default" />;
    }
    if (type === 'icon') {
      // Fixed User (Person) icon — no input needed
      return <Avatar color="default" icon={<MuiIcons.Person />} />;
    }
    // letters (default)
    const letters = (avatarLetters || 'A').slice(0, 2).toUpperCase();
    return <Avatar initials={letters} color="default" />;
  };

  const renderSlot = (slot, avatarType) => {
    if (slot === 'icon')   return getIconComponent();
    if (slot === 'avatar') return getAvatarComponent(avatarType);
    return undefined;
  };

  const getButtonProps = () => {
    const p = { variant: getVariant(), size, elevated, disabled, fullWidth };
    if (badge) {
      p.badge = true;
      // Try to coerce to a number so Badge's `max` cap kicks in for counts;
      // fall back to the raw string for status text ("New", "!").
      const asNum = Number(badgeContent);
      p.badgeContent = badgeContent !== '' && !Number.isNaN(asNum) ? asNum : badgeContent;
    }
    if (contentType === 'icon') {
      p.iconOnly = true;
      p.children = getIconComponent();
      return p;
    }
    if (contentType === 'avatar') {
      p.avatar = true;
      p.children = buttonText
        ? buttonText.charAt(0).toUpperCase()
        : <MuiIcons.Person sx={{ fontSize: 'inherit' }} />;
      return p;
    }
    if (contentType === 'swatch') {
      p.swatch = true;
      if (swatchColor) p.swatchColor = swatchColor;
      return p;
    }
    if (contentType === 'letter' || contentType === 'number') {
      p.letterNumber = true;
      p.children = buttonText || (contentType === 'letter' ? 'A' : '1');
      return p;
    }
    p.children = loading ? 'Loading...' : (buttonText || 'Button');
    const start = renderSlot(startSlot, startAvatarType);
    const end   = renderSlot(endSlot,   endAvatarType);
    if (start) p.startDecorator = start;
    if (end)   p.endDecorator   = end;
    return p;
  };

  const slotJsx = (slot, avatarType) => {
    if (slot === 'icon') return '<Icon><' + iconName + 'Icon /></Icon>';
    if (slot === 'avatar') {
      if (avatarType === 'image') return '<Avatar src="' + avatarImageUrl + '" />';
      if (avatarType === 'icon')  return '<Avatar icon={<PersonIcon />} />';
      const letters = (avatarLetters || 'A').slice(0, 2).toUpperCase();
      return '<Avatar initials="' + letters + '" />';
    }
    return null;
  };

  const generateCode = () => {
    const p = getButtonProps();
    const parts = ['variant="' + p.variant + '"', 'size="' + p.size + '"'];
    if (p.iconOnly)    parts.push('iconOnly');
    if (p.letterNumber) parts.push('letterNumber');
    if (p.avatar)      parts.push('avatar');
    if (p.swatch)      { parts.push('swatch'); if (p.swatchColor) parts.push('swatchColor="' + p.swatchColor + '"'); }
    if (p.elevated)    parts.push('elevated');
    if (p.disabled)    parts.push('disabled');
    if (p.fullWidth)   parts.push('fullWidth');
    if (p.badge) {
      parts.push('badge');
      const c = p.badgeContent;
      if (c !== undefined && c !== '') {
        parts.push(typeof c === 'number' ? 'badgeContent={' + c + '}' : 'badgeContent="' + c + '"');
      }
    }
    if (p.startDecorator) parts.push('startDecorator={' + slotJsx(startSlot, startAvatarType) + '}');
    if (p.endDecorator)   parts.push('endDecorator={' + slotJsx(endSlot,   endAvatarType)   + '}');
    const children = typeof p.children === 'string' ? p.children : '';
    return '<Button ' + parts.join(' ') + '>' + children + '</Button>';
  };

  useEffect(() => {
    // Defer one frame so the browser has recalculated styles after data-theme/data-surface change.
    const raf = requestAnimationFrame(() => {
      const el = surfaceRef.current;
      if (!el) return;
      const v = (name) => getCssVarFrom(el, name);
      const C = cap(effectiveColor);
      const data = {};

      data.background   = v('--Background');
      data.focusVisible = v('--Focus-Visible');

      if (style === 'solid') {
        data.buttonBg     = v('--Buttons-' + C + '-Button');
        data.buttonText   = v('--Buttons-' + C + '-Text');
        data.buttonBorder = v('--Buttons-' + C + '-Border');
        data.hover        = v('--Buttons-' + C + '-Hover');
        data.active       = v('--Buttons-' + C + '-Pressed');
        // Hover/active are overlays on the button fill
        data.hoverBase    = data.buttonBg;
        data.activeBase   = data.buttonBg;
      } else if (style === 'outline') {
        data.buttonBg     = null; // transparent — use background for contrast
        data.buttonText   = v('--Text');
        data.buttonBorder = v('--Buttons-' + C + '-Border');
        data.hover        = v('--Buttons-' + C + '-Hover');
        data.active       = v('--Buttons-' + C + '-Pressed');
        // Hover/active overlays sit on the page background
        data.hoverBase    = data.background;
        data.activeBase   = data.background;
      } else if (style === 'ghost') {
        data.buttonBg     = null; // transparent
        data.buttonText   = v('--Hotlink');
        data.buttonBorder = null; // transparent
        data.hover        = v('--Hover');
        data.active       = v('--Pressed');
        data.hoverBase    = data.background;
        data.activeBase   = data.background;
      }
      setContrastData(data);
    });
    return () => cancelAnimationFrame(raf);
  }, [style, effectiveColor, bgTheme, bgSurface]);

  return (
    <Box sx={{ pb: 8 }}>
      <H3>Buttons</H3>
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface ref={surfaceRef} theme={bgTheme} surface={bgSurface}>
            <Button {...getButtonProps()} />
          </PreviewSurface>

          <CodeBlock
            code={generateCode()}
            language="JSX"
            wrap
            sx={{ mt: 2 }}
          />
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, alignSelf: 'flex-start', minWidth: 0, overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>

            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              {/* ── Playground ── */}
              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  {/* Style */}
                  <Box>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</EyebrowSmall>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                      {STYLES.map((s) => {
                        const ghostDisabled = s === 'ghost' && (contentType === 'avatar' || contentType === 'swatch');
                        return (
                          <ControlButton key={s} label={cap(s)} selected={style === s} disabled={ghostDisabled}
                            onClick={() => { setStyle(s); if (s === 'ghost') setColor('default'); }} />
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
                    <Stack spacing={1.5}>
                      {COLOR_GROUPS.map((group) => (
                        <Box key={group.label}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                            {group.colors.map((c) => (
                              <ColorSwatchButton key={c} color={c} selected={color === c}
                                disabled={noColorPicker} onClick={setColor} isOutlineMode={style === 'outline'} />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Content type */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT TYPE</EyebrowSmall>
                    <Select
                      options={CONTENT_TYPES.map((ct) => ({ value: ct, label: cap(ct) }))}
                      value={contentType}
                      onChange={(ct) => {
                        setContentType(ct);
                        if (ct === 'number') setButtonText('1');
                        else if (ct === 'letter') setButtonText('A');
                        else if (ct === 'text') setButtonText('Button');
                        if ((ct === 'avatar' || ct === 'swatch') && style === 'ghost') setStyle('solid');
                        if (['icon', 'letter', 'number', 'avatar', 'swatch'].includes(ct)) setFullWidth(false);
                      }}
                      labelPosition="none"
                      size="small"
                    />
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {contentType === 'icon'    ? 'Icon only — requires aria-label.' :
                       contentType === 'avatar'  ? 'Circular with initial letter.' :
                       contentType === 'letter' || contentType === 'number' ? 'Single character in square button.' :
                       contentType === 'swatch'  ? '' :
                       'Text label with optional icon.'}
                    </Caption>
                  </Box>

                  {/* Swatch color input */}
                  {contentType === 'swatch' && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput
                        label="Swatch Color (hex)"
                        value={swatchColor}
                        onChange={setSwatchColor}
                        placeholder="#ae8443"
                      />
                    </Box>
                  )}

                  {/* Button text input */}
                  {['text', 'letter', 'number', 'avatar'].includes(contentType) && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput
                        label={contentType === 'text' ? 'Button Text' : contentType === 'avatar' ? 'Initial' : cap(contentType)}
                        value={buttonText}
                        onChange={setButtonText}
                        placeholder={contentType === 'text' ? 'Button' : contentType === 'letter' ? 'A' : '1'}
                      />
                    </Box>
                  )}

                  {/* Start decorative slot (text only) */}
                  {contentType === 'text' && (
                    <Box sx={{ mt: 3 }}>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START DECORATIVE SLOT</EyebrowSmall>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                        {[['none', 'None'], ['icon', 'Icon'], ['avatar', 'Avatar']].map(([val, lbl]) => (
                          <ControlButton key={val} label={lbl} selected={startSlot === val} onClick={() => setStartSlot(val)} />
                        ))}
                      </Stack>

                      {startSlot === 'icon' && (
                        <Box sx={{ mt: 2 }}>
                          <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                            <a href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--Hotlink)' }}>Material icon</a> name (e.g. Add, Edit, Delete, Save, Send, Star)
                          </Caption>
                        </Box>
                      )}

                      {startSlot === 'avatar' && (
                        <Box sx={{ mt: 2 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Avatar Content</Caption>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            {[['letters', 'Letters'], ['icon', 'Icon'], ['image', 'Image']].map(([val, lbl]) => (
                              <ControlButton key={val} label={lbl} selected={startAvatarType === val} onClick={() => setStartAvatarType(val)} />
                            ))}
                          </Stack>
                          {startAvatarType === 'letters' && (
                            <Box sx={{ mt: 2 }}>
                              <TextInput label="Letters (max 2)" value={avatarLetters}
                                onChange={(v) => setAvatarLetters(v.slice(0, 2))} placeholder="AB" />
                            </Box>
                          )}
                          {startAvatarType === 'image' && (
                            <Box sx={{ mt: 2 }}>
                              <TextInput label="Image URL" value={avatarImageUrl}
                                onChange={setAvatarImageUrl} placeholder="https://example.com/avatar.jpg" />
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                                Defaults to a sample image. Replace with your own URL or asset path in code.
                              </Caption>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* End decorative slot (text only) */}
                  {contentType === 'text' && (
                    <Box sx={{ mt: 3 }}>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>END DECORATIVE SLOT</EyebrowSmall>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                        {[['none', 'None'], ['icon', 'Icon'], ['avatar', 'Avatar']].map(([val, lbl]) => (
                          <ControlButton key={val} label={lbl} selected={endSlot === val} onClick={() => setEndSlot(val)} />
                        ))}
                      </Stack>

                      {endSlot === 'icon' && (
                        <Box sx={{ mt: 2 }}>
                          <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                            <a href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--Hotlink)' }}>Material icon</a> name (e.g. Add, Edit, Delete, Save, Send, Star)
                          </Caption>
                        </Box>
                      )}

                      {endSlot === 'avatar' && (
                        <Box sx={{ mt: 2 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Avatar Content</Caption>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            {[['letters', 'Letters'], ['icon', 'Icon'], ['image', 'Image']].map(([val, lbl]) => (
                              <ControlButton key={val} label={lbl} selected={endAvatarType === val} onClick={() => setEndAvatarType(val)} />
                            ))}
                          </Stack>
                          {endAvatarType === 'letters' && (
                            <Box sx={{ mt: 2 }}>
                              <TextInput label="Letters (max 2)" value={avatarLetters}
                                onChange={(v) => setAvatarLetters(v.slice(0, 2))} placeholder="AB" />
                            </Box>
                          )}
                          {endAvatarType === 'image' && (
                            <Box sx={{ mt: 2 }}>
                              <TextInput label="Image URL" value={avatarImageUrl}
                                onChange={setAvatarImageUrl} placeholder="https://example.com/avatar.jpg" />
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                                Defaults to a sample image. Replace with your own URL or asset path in code.
                              </Caption>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Icon name for icon-only buttons */}
                  {contentType === 'icon' && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput label="Icon Name" value={iconName} onChange={setIconName} placeholder="Add" />
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        <a href="https://mui.com/material-ui/material-icons/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--Hotlink)' }}>Material icon</a> name (e.g. Add, Edit, Delete, Save, Send, Star)
                      </Caption>
                    </Box>
                  )}

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {sizeDetails[size]?.note}
                    </Caption>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: isGhost ? 0.4 : 1 }}>
                    <Box>
                      <Label>Elevated</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Higher shadow levels (Level 2/3)</Caption>
                    </Box>
                    <Switch checked={elevated} onChange={(e) => setElevated(e.target.checked)}
                      size="small" aria-label="Elevated" disabled={isGhost} />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Button is non-interactive</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Loading</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Shows loading state</Caption>
                    </Box>
                    <Switch checked={loading} onChange={(e) => setLoading(e.target.checked)}
                      size="small" aria-label="Loading" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: ['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType) ? 0.4 : 1 }}>
                    <Box>
                      <Label>Full Width</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretches to container width</Caption>
                    </Box>
                    <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}
                      size="small" aria-label="Full width"
                      disabled={['icon', 'letter', 'number', 'avatar', 'swatch'].includes(contentType)} />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Badge</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                        Count or status pill anchored to the button corner
                      </Caption>
                    </Box>
                    <Switch checked={badge} onChange={(e) => setBadge(e.target.checked)}
                      size="small" aria-label="Badge" />
                  </Box>

                  {badge && (
                    <Box sx={{ mt: 2 }}>
                      <TextInput
                        label="Badge Content"
                        value={badgeContent}
                        onChange={setBadgeContent}
                        placeholder="3"
                      />
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                        Numbers ({'>'}99 shows "99+"); short strings render as a pill.
                      </Caption>
                    </Box>
                  )}

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <BodySmall color="quiet" style={{ marginBottom: 24 }}>
                    {cap(style)} / {cap(effectiveColor)} / {cap(size)} / {cap(contentType)}
                  </BodySmall>

                  <Stack spacing={3}>

                    {/* ── 1. Border / fill vs. page ── */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Button vs. page</H5>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>WCAG 1.4.11 — 3:1</EyebrowSmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                        The button must be visually distinguishable from its background.
                      </Caption>
                      {(() => {
                        const bg = contrastData.background;
                        const fillRatio = contrastData.buttonBg ? getContrast(contrastData.buttonBg, bg) : null;
                        const borderRatio = contrastData.buttonBorder ? getContrast(contrastData.buttonBorder, bg) : null;
                        const textRatio = contrastData.buttonText ? getContrast(contrastData.buttonText, bg) : null;
                        // Ghost: no fill or border, use text (hotlink) for the check
                        if (style === 'ghost') {
                          // null when unmeasured, so the badge says so rather than failing.
                          const pass = textRatio ? parseFloat(textRatio) >= 3.0 : null;
                          return (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                              <Box sx={{ flex: 1 }}>
                                <BodySmall>Text (hotlink) vs. background</BodySmall>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Ghost has no fill or border — uses text color for affordance
                                </Caption>
                              </Box>
                              <PassFailBadge pass={pass} detail={textRatio ? textRatio + ':1' : null} />
                            </Box>
                          );
                        }
                        // Solid / Outline: pass if EITHER fill or border meets 3:1
                        const fillPass = fillRatio ? parseFloat(fillRatio) >= 3.0 : null;
                        const borderPass = borderRatio ? parseFloat(borderRatio) >= 3.0 : null;
                        // Neither could be measured -> unknown, not failing.
                        const overallPass = (fillRatio || borderRatio)
                          ? (fillPass === true || borderPass === true)
                          : null;
                        return (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box sx={{ flex: 1 }}>
                              <BodySmall>Button fill or border vs. background</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                {style === 'solid'
                                  ? 'Fill ' + (fillRatio || '--') + ':1' + (fillPass ? ' ✓' : ' ✗') + '  ·  Border ' + (borderRatio || '--') + ':1' + (borderPass ? ' ✓' : ' ✗')
                                  : 'Border ' + (borderRatio || '--') + ':1' + (borderPass ? ' ✓' : ' ✗') + ' (transparent fill)'}
                              </Caption>
                            </Box>
                            <PassFailBadge pass={overallPass} detail={null} />
                          </Box>
                        );
                      })()}
                    </Box>

                    {/* ── 2. Text / content on button ── */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>
                        {['icon', 'avatar', 'swatch'].includes(contentType)
                          ? 'Content on button'
                          : 'Text on button'}
                      </H5>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                        {['icon', 'avatar', 'swatch'].includes(contentType)
                          ? 'WCAG 1.4.11 — 3:1'
                          : 'WCAG 1.4.3 — 4.5:1'}
                      </EyebrowSmall>
                      {(() => {
                        const isNonText = ['icon', 'avatar', 'swatch'].includes(contentType);
                        const threshold = isNonText ? 3.0 : 4.5;
                        const wcag = isNonText ? '3:1 non-text' : '4.5:1';
                        const effectiveBg = contrastData.buttonBg || contrastData.background;
                        return (
                          <>
                            <A11yRow label="Resting" ratio={getContrast(contrastData.buttonText, effectiveBg)}
                              threshold={threshold} note={wcag + ' minimum'} />
                            <A11yRow label="Hover" ratio={getContrast(contrastData.buttonText, contrastData.hover, contrastData.hoverBase)}
                              threshold={threshold} note={'Maintained on hover'} />
                            <A11yRow label="Active" ratio={getContrast(contrastData.buttonText, contrastData.active, contrastData.activeBase)}
                              threshold={threshold} note={'Maintained on active'} />
                          </>
                        );
                      })()}
                    </Box>

                    {/* ── 3. Focus ring ── */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Focus ring</H5>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>WCAG 2.4.11 — 3:1</EyebrowSmall>
                      <A11yRow label="Focus ring vs. background"
                        ratio={getContrast(contrastData.focusVisible, contrastData.background)} threshold={3.0}
                        note="2px solid var(--Focus-Visible), offset 2px" />
                    </Box>

                    {/* ── 4. Min target area ── */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Min target area</H5>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>WCAG 2.5.8 — 24 x 24</EyebrowSmall>
                      {(() => {
                        const heights = { small: 32, medium: 40, large: 64 };
                        const h = heights[size] || 40;
                        const pass = h >= 24;
                        return (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <Box>
                              <BodySmall>{cap(size)} — {h}px</BodySmall>
                              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                {h >= 48 ? 'Meets all platform guidelines' : h >= 44 ? 'Meets iOS (44px); Android recommends 48px' : h >= 24 ? 'Meets WCAG 24px minimum; iOS recommends 44px, Android 48px' : 'Below 24px WCAG minimum'}
                              </Caption>
                            </Box>
                            <PassFailBadge pass={pass} detail={h + 'px'} />
                          </Box>
                        );
                      })()}
                    </Box>

                    {/* ── 5. Icon / label advisory ── */}
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>Screen reader labels</H5>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>WCAG 4.1.2 — 1 NAME PER CONTROL</EyebrowSmall>
                      {['icon', 'avatar', 'swatch'].includes(contentType) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <Box>
                            <BodySmall>aria-label required on {'<Button>'}</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                              No visible text — add aria-label describing the action. Child icon must have aria-hidden="true".
                            </Caption>
                          </Box>
                          <PassFailBadge pass={true} />
                        </Box>
                      ) : contentType === 'text' && (startSlot !== 'none' || endSlot !== 'none') ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <Box>
                            <BodySmall>Button has text + decorator</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                              Button text is the accessible name. Icons must have aria-hidden="true" and avatars are decorative.
                            </Caption>
                          </Box>
                          <PassFailBadge pass={true} />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                          <Box>
                            <BodySmall>Button text is the accessible name</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                              No additional labels needed.
                            </Caption>
                          </Box>
                          <PassFailBadge pass={true} />
                        </Box>
                      )}
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

export default ButtonShowcase;