// src/components/Avatar/AvatarShowcase.js
import React, { useState, useRef } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, AvatarGroup } from './Avatar';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

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
function TextInput({ value, onChange, placeholder, label: inputLabel, sx: sxOverride }) {
  return (
    <Box>
      {inputLabel && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>{inputLabel}</Caption>}
      <Box component="input" type="text" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        sx={{
          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
          border: '1px solid var(--Border)', borderRadius: '4px',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
          ...sxOverride,
        }}
      />
    </Box>
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = COLOR_MAP[color] || 'Default';
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 32, height: 32, borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)' }} />}
      </Box>
    </Tooltip>
  );
}

export function AvatarShowcase() {
  const [mainTab, setMainTab] = useState(0);

  const [content, setContent] = useState('initials');
  const [initials, setInitials] = useState('AB');
  const [imageSrc, setImageSrc] = useState('');
  const [color, setColor] = useState('default');
  const [size, setSize] = useState('medium');
  const [clickable, setClickable] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const C = COLOR_MAP[color] || 'Default';

  const generateCode = () => {
    const parts = [];
    if (content === 'image' && imageSrc) parts.push('src="[image-url]"');
    if (content === 'initials') parts.push('initials="' + initials + '"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (clickable) parts.push('clickable onClick={handleClick}');
    return '<Avatar ' + parts.join(' ') + ' />';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Avatar</H2>
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

              <Avatar
                key={'av-' + content + '-' + color + '-' + size + '-' + clickable + '-' + imageSrc}
                src={content === 'image' ? imageSrc || undefined : undefined}
                initials={content === 'initials' ? initials : undefined}
                color={color}
                size={size}
                clickable={clickable}
                onClick={clickable ? () => {} : undefined}
              />
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

            {/* Content */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Initials" selected={content === 'initials'} onClick={() => setContent('initials')} />
                <ControlButton label="Image" selected={content === 'image'} onClick={() => setContent('image')} />
                <ControlButton label="Fallback" selected={content === 'fallback'} onClick={() => setContent('fallback')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {content === 'initials' ? 'Up to 2 characters displayed.' :
                 content === 'image' ? 'Upload a photo. Falls back to icon if image fails.' :
                 'No image or initials — shows person icon.'}
              </Caption>
            </Box>

            {/* Initials input */}
            {content === 'initials' && (
              <Box sx={{ mt: 2 }}>
                <TextInput label="Initials" value={initials} onChange={(v) => setInitials(v.slice(0, 2))} placeholder="AB" />
              </Box>
            )}

            {/* Image upload */}
            {content === 'image' && (
              <Box sx={{ mt: 2 }}>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6 }}>Upload Image</Caption>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="button" type="button"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', px: 2, py: 0.75,
                      backgroundColor: 'var(--Buttons-Default-Light-Button)',
                      border: '1px solid var(--Buttons-Default-Border)',
                      color: 'var(--Buttons-Default-Light-Text)',
                      borderRadius: 'var(--Style-Border-Radius)',
                      fontSize: '13px', fontFamily: 'inherit', fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'var(--Buttons-Default-Hover)' },
                      '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                    }}
                  >
                    Choose File
                  </Box>
                  {imageSrc && (
                    <Box
                      component="button" type="button"
                      onClick={clearImage}
                      sx={{
                        display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.75,
                        backgroundColor: 'transparent',
                        border: '1px solid var(--Border)',
                        color: 'var(--Text-Quiet)',
                        borderRadius: 'var(--Style-Border-Radius)',
                        fontSize: '12px', fontFamily: 'inherit',
                        cursor: 'pointer',
                        '&:hover': { color: 'var(--Text)' },
                      }}
                    >
                      Clear
                    </Box>
                  )}
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {imageSrc && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>Image loaded.</Caption>}
                {!imageSrc && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>No image — will show fallback icon.</Caption>}
              </Box>
            )}

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {'bg: var(--Buttons-{C}-Border), text: var(--Buttons-{C}-Text).'}
              </Caption>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '32px.' : size === 'medium' ? '40px (default).' : '56px.'}
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box>
                  <Label>Clickable</Label>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Adds border, hover, active, focus states.</Caption>
                </Box>
                <Switch checked={clickable} onChange={(e) => setClickable(e.target.checked)} size="small" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(content)} · {C} · {cap(size)}{clickable ? ' · Clickable' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Non-clickable:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="img" aria-label="[initials or alt text]"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clickable:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button role="button" aria-label="[name]"> — focusable, interactive.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Image:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {'<img> with alt text. onError fallback to person icon.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Initials:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-hidden="true" on the text span. aria-label on the container provides accessible name.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>3px solid var(--Focus-Visible), 2px offset. Clickable only.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Background:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'var(--Buttons-{C}-Border)'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Text / Icon:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'var(--Buttons-{C}-Text)'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clickable border:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Buttons-Default-Border)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Hover / Active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Buttons-Default-Hover) / var(--Buttons-Default-Active)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Sizes:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Small 32px, Medium 40px, Large 56px.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Content Fallback</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Priority:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Image (src) → Initials → Person icon fallback.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Image error:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>If image fails to load, automatically falls back to person icon.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>AvatarGroup:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Stacks with negative margin overlap. Shows "+N" overflow avatar when exceeding max.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default AvatarShowcase;
