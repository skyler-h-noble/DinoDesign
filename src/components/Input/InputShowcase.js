// src/components/Input/InputShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  TextField, Switch, Divider, Tooltip, IconButton as MuiIconButton,
  Collapse, Checkbox as MuiCheckbox, FormControlLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Input } from './Input';
import {
  H2, H4, H5, Body, BodySmall, BodyBold, Caption, Label, OverlineSmall
} from '../Typography';

// --- Contrast helpers --------------------------------------------------------

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
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05))).toFixed(2);
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
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700,
      }}>
        {ratio}:1
      </Box>
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

// --- Copy Button -------------------------------------------------------------

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

// --- Shared controls ---------------------------------------------------------

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease',
          '&:hover': { transform: 'scale(1.1)' },
        }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

function ControlButton({ label, selected, onClick, sx: sxOverride }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px', fontFamily: 'inherit', fontWeight: 500,
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        ...sxOverride,
      }}>
      {label}
    </Box>
  );
}

// Styled text field for playground controls
function PlaygroundTextField({ label, value, onChange, placeholder, ...rest }) {
  return (
    <TextField
      label={label} value={value} onChange={onChange} placeholder={placeholder}
      size="small" fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': { borderColor: 'var(--Border)' },
          '&:hover fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--Buttons-Primary-Border)' },
        },
        '& .MuiInputLabel-root': { color: 'var(--Text-Quiet)', '&.Mui-focused': { color: 'var(--Text)' } },
      }}
      {...rest}
    />
  );
}

// --- Main Showcase -----------------------------------------------------------

export function InputShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [labelText, setLabelText] = useState('Email address');
  const [disabled, setDisabled] = useState(false);
  const [contrastData, setContrastData] = useState({});

  // Advanced settings
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [labelPosition, setLabelPosition] = useState('standard');
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('you@example.com');
  const [showHelperText, setShowHelperText] = useState(false);
  const [helperText, setHelperText] = useState('We will never share your email.');
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('This field is required.');
  const [validationType, setValidationType] = useState('error');

  const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

  const getVariant = () => {
    return color + '-outline';
  };

  const getInputProps = () => ({
    variant: getVariant(),
    size,
    label: labelText || undefined,
    labelPosition,
    placeholder: (showPlaceholder && labelPosition !== 'floating') ? placeholderText : undefined,
    helperText: showHelperText && !showValidation ? helperText : undefined,
    validation: showValidation ? validationType : undefined,
    validationMessage: showValidation ? validationMessage : undefined,
    disabled,
    fullWidth: true,
  });

  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (labelText) parts.push('label="' + labelText + '"');
    if (labelPosition !== 'standard') parts.push('labelPosition="' + labelPosition + '"');
    if (showPlaceholder && placeholderText && labelPosition !== 'floating') parts.push('placeholder="' + placeholderText + '"');
    if (showHelperText && helperText && !showValidation) parts.push('helperText="' + helperText + '"');
    if (showValidation) {
      parts.push('validation="' + validationType + '"');
      if (validationMessage) parts.push('validationMessage="' + validationMessage + '"');
    }
    if (disabled) parts.push('disabled');
    return '<Input ' + parts.join('\n  ') + '\n/>';
  };

  // Contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};
    const bg = getCssVar('--Background');
    data.background = bg;
    data.focusVisible = getCssVar('--Focus-Visible');
    data.border = getCssVar('--Buttons-' + C + '-Border');
    data.inputBg = bg;
    data.inputText = getCssVar('--Text');
    data.placeholder = getCssVar('--Quiet');
    data.label = getCssVar('--Text');
    data.helperText = getCssVar('--Quiet');
    data.successText = getCssVar('--Text-Success');
    data.successIcon = getCssVar('--Icons-Success');
    data.errorText = getCssVar('--Text-Error');
    data.errorIcon = getCssVar('--Icons-Error');
    data.warningText = getCssVar('--Text-Warning');
    data.warningIcon = getCssVar('--Icons-Warning');
    data.hotlink = getCssVar('--Hotlink');
    data.quiet = getCssVar('--Quiet');
    setContrastData(data);
  }, [color]);

  const sizeDetails = {
    small:  { height: '32px', note: '32px height meets WCAG 2.2 AA target size' },
    medium: { height: 'var(--Button-Height)', note: 'Default design system height' },
    large:  { height: '56px', note: '56px height exceeds WCAG 2.2 AA' },
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Input</H2>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{
          mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } },
        }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
      {mainTab === 0 && (
        <Grid container spacing={0} sx={{ minHeight: 600, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

          {/* LEFT: Preview */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'var(--Background)',
            borderRight: '1px solid var(--Border)', minHeight: 200, minWidth: 0, overflow: 'hidden',
          }}>
            <Box sx={{ mb: 3, width: '100%', maxWidth: 360, minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Input {...getInputProps()} />
            </Box>

            {/* Code output */}
            <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: 'var(--Style-Border-Radius)', overflow: 'hidden', minHeight: 60 }}>
                <Box sx={{ px: 2, py: 0.75, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Caption style={{ color: '#6b7280', fontFamily: 'monospace' }}>JSX</Caption>
                  <CopyButton code={generateCode()} />
                </Box>
                <Box sx={{ p: 2, overflow: 'auto' }}>
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                    {generateCode()}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Controls */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto',
          }}>
            <H4>Playground</H4>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {colors.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
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
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Label */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
              <PlaygroundTextField
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder="Enter label text"
              />
            </Box>

            {/* Disabled toggle */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>Disabled</Label>
              <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
            </Box>

            <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

            {/* --- Advanced Settings --- */}
            <Box
              onClick={() => setAdvancedOpen(!advancedOpen)}
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', py: 1, userSelect: 'none',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <H5 style={{ margin: 0 }}>Advanced Settings</H5>
              {advancedOpen ? (
                <ExpandLessIcon sx={{ color: 'var(--Text-Quiet)' }} />
              ) : (
                <ExpandMoreIcon sx={{ color: 'var(--Text-Quiet)' }} />
              )}
            </Box>

            <Collapse in={advancedOpen}>
              <Stack spacing={2} sx={{ pt: 1 }}>

                {/* Label Position */}
                <Box>
                  <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL POSITION</OverlineSmall>
                  <Stack direction="row" spacing={1}>
                    {['standard', 'floating'].map((pos) => (
                      <ControlButton key={pos} label={cap(pos)} selected={labelPosition === pos} onClick={() => { setLabelPosition(pos); if (pos === 'floating') setShowPlaceholder(false); }} />
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 4 }}>
                    {labelPosition === 'standard'
                      ? 'Label displayed above the input field'
                      : 'Label floats inside the input, shrinks on focus/filled'}
                  </Caption>
                </Box>

                <Divider sx={{ borderColor: 'var(--Border)' }} />

                {/* Placeholder */}
                <Box sx={{ opacity: labelPosition === 'floating' ? 0.5 : 1 }}>
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={showPlaceholder}
                        onChange={(e) => setShowPlaceholder(e.target.checked)}
                        size="small"
                        disabled={labelPosition === 'floating'}
                      />
                    }
                    label={<BodySmall>Placeholder{labelPosition === 'floating' ? ' (disabled for floating label)' : ''}</BodySmall>}
                    sx={{ marginLeft: 0 }}
                  />
                  {showPlaceholder && (
                    <Box sx={{ mt: 1 }}>
                      <PlaygroundTextField
                        value={placeholderText}
                        onChange={(e) => setPlaceholderText(e.target.value)}
                        placeholder="Enter placeholder text"
                      />
                    </Box>
                  )}
                </Box>

                {/* Helper Text */}
                <Box>
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={showHelperText}
                        onChange={(e) => setShowHelperText(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<BodySmall>Helper Text</BodySmall>}
                    sx={{ marginLeft: 0 }}
                  />
                  {showHelperText && (
                    <Box sx={{ mt: 1 }}>
                      <PlaygroundTextField
                        value={helperText}
                        onChange={(e) => setHelperText(e.target.value)}
                        placeholder="Enter helper text"
                      />
                    </Box>
                  )}
                </Box>

                <Divider sx={{ borderColor: 'var(--Border)' }} />

                {/* Validation */}
                <Box>
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={showValidation}
                        onChange={(e) => setShowValidation(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<BodySmall>Validation</BodySmall>}
                    sx={{ marginLeft: 0 }}
                  />
                  {showValidation && (
                    <Stack spacing={2} sx={{ mt: 1, pl: 1 }}>
                      <PlaygroundTextField
                        label="Validation Message"
                        value={validationMessage}
                        onChange={(e) => setValidationMessage(e.target.value)}
                        placeholder="Enter validation message"
                      />
                      <Box>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VALIDATION TYPE</OverlineSmall>
                        <Stack direction="row" spacing={1}>
                          {['info', 'success', 'warning', 'error'].map((vt) => (
                            <ControlButton
                              key={vt}
                              label={cap(vt)}
                              selected={validationType === vt}
                              onClick={() => setValidationType(vt)}
                              sx={{
                                borderColor: 'var(--Buttons-' + cap(vt) + '-Button)',
                                backgroundColor: validationType === vt ? 'var(--Buttons-' + cap(vt) + '-Button)' : 'transparent',
                                color: validationType === vt ? 'var(--Buttons-' + cap(vt) + '-Text)' : 'var(--Text)',
                                '&:hover': {
                                  backgroundColor: validationType === vt
                                    ? 'var(--Buttons-' + cap(vt) + '-Hover)'
                                    : 'var(--Surface-Dim)',
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Collapse>
          </Grid>
        </Grid>
      )}

      {/* ACCESSIBILITY TAB */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: outline · {color} · {size} · {labelPosition}
          </BodySmall>

          <Stack spacing={4}>
            {/* Border contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Input Border Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The input border must be distinguishable from the page background
              </BodySmall>
              <A11yRow
                label="Border vs. Background"
                ratio={getContrast(contrastData.border, contrastData.background)}
                threshold={3.1}
                note="var(--Buttons-{Color}-Border) vs var(--Background) must be >= 3:1 WCAG AA non-text contrast"
              />
            </Box>

            {/* Text contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                All text inside and around the input must be readable against the background
              </BodySmall>
              <A11yRow
                label="Input Text vs. Background"
                ratio={getContrast(contrastData.inputText, contrastData.background)}
                threshold={4.5}
                note="var(--Text) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Placeholder vs. Background"
                ratio={getContrast(contrastData.placeholder, contrastData.background)}
                threshold={4.5}
                note="var(--Quiet) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Label vs. Background"
                ratio={getContrast(contrastData.label, contrastData.background)}
                threshold={4.5}
                note="var(--Text) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Helper Text vs. Background"
                ratio={getContrast(contrastData.helperText, contrastData.background)}
                threshold={4.5}
                note="var(--Quiet) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
            </Box>

            {/* Floating label contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Floating Label Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Floating label must be readable at rest and when focused
              </BodySmall>
              <A11yRow
                label="Floating Label (rest) vs. Background"
                ratio={getContrast(contrastData.quiet, contrastData.background)}
                threshold={4.5}
                note="var(--Quiet) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Floating Label (focused) vs. Background"
                ratio={getContrast(contrastData.hotlink, contrastData.background)}
                threshold={4.5}
                note="var(--Hotlink) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
            </Box>

            {/* Validation contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Validation State Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Validation messages and icons must be readable against the background
              </BodySmall>
              <A11yRow
                label="Success Text vs. Background"
                ratio={getContrast(contrastData.successText, contrastData.background)}
                threshold={4.5}
                note="var(--Text-Success) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Success Icon vs. Background"
                ratio={getContrast(contrastData.successIcon, contrastData.background)}
                threshold={3.1}
                note="var(--Icons-Success) vs var(--Background) must be >= 3:1 WCAG AA non-text"
              />
              <A11yRow
                label="Error Text vs. Background"
                ratio={getContrast(contrastData.errorText, contrastData.background)}
                threshold={4.5}
                note="var(--Text-Error) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Error Icon vs. Background"
                ratio={getContrast(contrastData.errorIcon, contrastData.background)}
                threshold={3.1}
                note="var(--Icons-Error) vs var(--Background) must be >= 3:1 WCAG AA non-text"
              />
              <A11yRow
                label="Warning Text vs. Background"
                ratio={getContrast(contrastData.warningText, contrastData.background)}
                threshold={4.5}
                note="var(--Text-Warning) vs var(--Background) must be >= 4.5:1 WCAG AA"
              />
              <A11yRow
                label="Warning Icon vs. Background"
                ratio={getContrast(contrastData.warningIcon, contrastData.background)}
                threshold={3.1}
                note="var(--Icons-Warning) vs var(--Background) must be >= 3:1 WCAG AA non-text"
              />
            </Box>

            {/* Focus */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Focus-Visible Indicator</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Focus ring must be visible to keyboard users
              </BodySmall>
              <A11yRow
                label="Focus-Visible outline vs. Background"
                ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                threshold={3.1}
                note="var(--Focus-Visible) vs var(--Background), 2px solid, 2px offset"
              />
            </Box>

            {/* Target size */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Touch / Click Target</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Minimum 24x24px for WCAG 2.2 AA
              </BodySmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Input height ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>{sizeDetails[size]?.note}</Caption>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', backgroundColor: 'var(--Tags-Success-BG)', color: 'var(--Tags-Success-Text)', fontSize: '11px', fontWeight: 700 }}>
                  {sizeDetails[size]?.height} Pass
                </Box>
              </Box>
            </Box>

            {/* Label & ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Label & ARIA Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Standard label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Label rendered above input, associated via htmlFor
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Floating label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Label stays inside the input, shrinks on focus/filled
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Without label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-label="[descriptive text]" required
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Helper text:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Linked via aria-describedby automatically by MUI
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Validation state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-invalid="true" for error, icon + colored border + message
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Disabled state:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-disabled="true", opacity 0.6, pointer-events none
                  </Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default InputShowcase;