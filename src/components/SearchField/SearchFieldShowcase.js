// src/components/SearchField/SearchFieldShowcase.js
import React, { useState } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { SearchField } from './SearchField';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

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
function CheckboxControl({ label, checked, onChange, caption }) {
  return (
    <Box sx={{ py: 0.5 }}>
      <FormControlLabel
        control={<MuiCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} size="small"
          sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }} />}
        label={<Label>{label}</Label>} sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </Box>
  );
}

export function SearchFieldShowcase() {
  const [mainTab, setMainTab] = useState(0);

  const [size, setSize] = useState('medium');
  const [placeholder, setPlaceholder] = useState('Search\u2026');
  const [showClear, setShowClear] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // Controlled demo value
  const [demoValue, setDemoValue] = useState('');

  const generateCode = () => {
    const parts = [];
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (placeholder !== 'Search\u2026') parts.push('placeholder="' + placeholder + '"');
    if (!showClear) parts.push('showClearButton={false}');
    if (disabled) parts.push('disabled');
    parts.push('onChange={(value) => console.log(value)}');
    parts.push('onSubmit={(value) => console.log("Submit:", value)}');
    const p = parts.length ? '\n  ' + parts.join('\n  ') + '\n' : '';
    return '<SearchField' + p + '/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Search Field</H2>
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
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 4 }}>

              {/* Main preview */}
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <SearchField
                  key={'sf-' + size + '-' + showClear + '-' + disabled}
                  size={size}
                  placeholder={placeholder}
                  showClearButton={showClear}
                  disabled={disabled}
                  value={demoValue}
                  onChange={setDemoValue}
                  sx={{ width: '100%' }}
                />
              </Box>

              <Caption style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>
                {cap(size)} · {disabled ? 'Disabled' : demoValue ? 'Filled: "' + demoValue + '"' : 'Click to focus'}
                {showClear ? ' · Clear button' : ''}
              </Caption>

              {/* All sizes */}
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>All sizes</Caption>
                <Stack spacing={2}>
                  {['small', 'medium', 'large'].map((s) => (
                    <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Caption style={{ color: 'var(--Text-Quiet)', width: 56, flexShrink: 0 }}>{cap(s)}</Caption>
                      <SearchField size={s} placeholder={'Search ' + s + '\u2026'} sx={{ flex: 1 }} />
                    </Box>
                  ))}
                </Stack>
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

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '36px height, 13px font.' : size === 'medium' ? '40px height, 14px font (default).' : '48px height, 15px font.'}
              </Caption>
            </Box>

            {/* Placeholder */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PLACEHOLDER</OverlineSmall>
              <TextInput value={placeholder} onChange={setPlaceholder} placeholder="Search\u2026" sx={{ width: '100%' }} />
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0}>
                <CheckboxControl label="Clear Button" checked={showClear} onChange={setShowClear}
                  caption="Show X button when field has a value." />
                <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled}
                  caption="Prevents interaction, 50% opacity." />
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
            {cap(size)}{disabled ? ' · Disabled' : ''}{showClear ? ' · Clear button' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Structure</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Border parent:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Outer Box: border 1px solid var(--Border), pill border-radius. Focus: border-color var(--Focus-Visible).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Surface container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Inner Box: data-surface="Container-Lowest", bg var(--Background).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Input:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    role="searchbox", aria-label="Search".
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Idle state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Icon + placeholder: var(--Text-Quiet)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focused / filled:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Icon + text: var(--Text)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Border:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Idle: var(--Border) · Focused: var(--Focus-Visible)
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    data-surface="Container-Lowest" · bg: var(--Background)
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Keyboard</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Enter:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Fires onSubmit with current value.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Escape:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Clears input when field has a value.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Clear button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>aria-label="Clear search". Returns focus to input after clearing.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Placeholder:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use descriptive text like "Search products…" not just "Search".</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Clear button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Always show when field has value. Saves user from selecting all + delete.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>In AppBar:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>SearchField inherits the AppBar's data-theme context automatically via CSS variable scoping.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default SearchFieldShowcase;
