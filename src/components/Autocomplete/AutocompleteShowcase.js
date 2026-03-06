// src/components/Autocomplete/AutocompleteShowcase.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Autocomplete } from './Autocomplete';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const DEFAULT_OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Brazil', value: 'br' },
  { label: 'India', value: 'in' },
  { label: 'Mexico', value: 'mx' },
];

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

export function AutocompleteShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [acValue, setAcValue] = useState(null);

  const [selectionStyle, setSelectionStyle] = useState('default');
  const [labelPosition, setLabelPosition] = useState('top');
  const [size, setSize] = useState('medium');
  const [asyncMode, setAsyncMode] = useState(false);
  const [freeSolo, setFreeSolo] = useState(false);
  const [clearableFlag, setClearableFlag] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [labelText, setLabelText] = useState('Country');
  const [helperText, setHelperText] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Type to search');

  // Async simulation
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);

  const handleAsyncInput = useCallback((val) => {
    if (!asyncMode) return;
    if (!val) { setAsyncOptions([]); return; }
    setAsyncLoading(true);
    // Simulate network delay
    const timeout = setTimeout(() => {
      const results = DEFAULT_OPTIONS.filter((o) =>
        o.label.toLowerCase().includes(val.toLowerCase())
      );
      setAsyncOptions(results);
      setAsyncLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [asyncMode]);

  const options = asyncMode ? asyncOptions : DEFAULT_OPTIONS;

  const generateCode = () => {
    const parts = [];
    if (selectionStyle !== 'default') parts.push('style="' + selectionStyle + '"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    if (labelPosition !== 'none') parts.push('label="' + labelText + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (helperText) parts.push('helperText="' + helperText + '"');
    if (placeholderText !== 'Type to search') parts.push('placeholder="' + placeholderText + '"');
    if (asyncMode) parts.push('loading={isLoading}');
    if (freeSolo) parts.push('freeSolo');
    if (!clearableFlag) parts.push('clearable={false}');
    if (isDisabled) parts.push('disabled');
    parts.push('options={countries}');
    parts.push('onChange={(val) => setValue(val)}');
    return '<Autocomplete\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Autocomplete</H2>
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
              minHeight: 350, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              <Box sx={{ width: '100%', maxWidth: 320 }}>
                <Autocomplete
                  key={'ac-' + selectionStyle + '-' + labelPosition + '-' + size + '-' + asyncMode + '-' + freeSolo + '-' + clearableFlag}
                  options={options}
                  value={acValue}
                  onChange={setAcValue}
                  onInputChange={asyncMode ? handleAsyncInput : undefined}
                  label={labelPosition !== 'none' ? labelText : undefined}
                  labelPosition={labelPosition}
                  placeholder={placeholderText}
                  helperText={helperText || undefined}
                  size={size}
                  style={selectionStyle}
                  loading={asyncLoading}
                  freeSolo={freeSolo}
                  clearable={clearableFlag}
                  disabled={isDisabled}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 220 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['default', 'light', 'solid'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={selectionStyle === s} onClick={() => setSelectionStyle(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {selectionStyle === 'default' ? 'Border outline on selected option.' :
                 selectionStyle === 'light' ? 'Light background fill on selected.' :
                 'Solid background fill on selected.'}
              </Caption>
            </Box>

            {/* Label */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['top', 'floating', 'none'].map((lp) => (
                  <ControlButton key={lp} label={cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
                ))}
              </Stack>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            {/* Flags */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>FLAGS</OverlineSmall>
              <Stack spacing={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Async Loading</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Simulates 800ms network delay. Options load as you type.</Caption>
                  </Box>
                  <Switch checked={asyncMode} onChange={(e) => { setAsyncMode(e.target.checked); setAsyncOptions([]); }} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Free Solo</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>User input not bound to provided options.</Caption>
                  </Box>
                  <Switch checked={freeSolo} onChange={(e) => setFreeSolo(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Clearable</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show X button to clear value.</Caption>
                  </Box>
                  <Switch checked={clearableFlag} onChange={(e) => setClearableFlag(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Disabled</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Component is disabled.</Caption>
                  </Box>
                  <Switch checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />
                </Box>
              </Stack>
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <Box component="button" type="button" onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, width: '100%',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: 600,
                  color: 'var(--Text)', p: 0, mb: advancedOpen ? 2 : 0,
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                <Box component="span" sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</Box>
                Advanced Settings
              </Box>
              {advancedOpen && (
                <Stack spacing={2}>
                  {labelPosition !== 'none' && (
                    <TextInput label="Label Text" value={labelText} onChange={setLabelText} placeholder="Country" />
                  )}
                  <TextInput label="Placeholder" value={placeholderText} onChange={setPlaceholderText} placeholder="Type to search" />
                  <TextInput label="Helper Text" value={helperText} onChange={setHelperText} placeholder="Optional helper text" />
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(selectionStyle)} · {cap(labelPosition)} label · {cap(size)}
            {asyncMode ? ' · Async' : ''}{freeSolo ? ' · Free solo' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Input:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="combobox" aria-expanded aria-haspopup="listbox" aria-autocomplete="list"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dropdown:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="listbox" with role="option" aria-selected children.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    ArrowDown/Up navigate options. Enter selects highlighted. Escape closes. Type to filter.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Input border: var(--Buttons-Default-Border) on focus. Clear/chevron: var(--Focus-Visible).
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>data-surface="Container-Lowest"</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Border idle / active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'inherit → var(--Buttons-Default-Border)'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Default selected:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>border: var(--Buttons-Default-Border), text: var(--Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Light selected:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Light-Button), text: var(--Buttons-Default-Light-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Solid selected:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Button), text: var(--Buttons-Default-Text)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Async:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Show loading spinner during fetch. Display loadingText. Options appear when data arrives.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Free solo:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Allows arbitrary text input beyond the option list. Good for tags, custom entries.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Floating label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Taller height to accommodate label. Same pattern as Select and NumberField.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default AutocompleteShowcase;
