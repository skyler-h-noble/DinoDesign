// src/components/NumberField/NumberFieldShowcase.js
import React, { useState } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { NumberField } from './NumberField';
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

export function NumberFieldShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [numValue, setNumValue] = useState(5);

  const [variant, setVariant] = useState('outlined');
  const [spinnerSize, setSpinnerSize] = useState('standard');
  const [labelPosition, setLabelPosition] = useState('top');
  const [disabled, setDisabled] = useState(false);

  // Validation
  const [hasValidation, setHasValidation] = useState(false);
  const [validationType, setValidationType] = useState('error');
  const [validationMsg, setValidationMsg] = useState('Please enter a valid number.');

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [labelText, setLabelText] = useState('Quantity');
  const [minVal, setMinVal] = useState('0');
  const [maxVal, setMaxVal] = useState('100');
  const [stepVal, setStepVal] = useState('1');

  const isOutlined = variant === 'outlined';
  const isSpinner = variant === 'spinner';

  const generateCode = () => {
    const parts = [];
    if (variant !== 'outlined') parts.push('variant="' + variant + '"');
    if (isSpinner && spinnerSize !== 'standard') parts.push('size="' + spinnerSize + '"');
    if (labelPosition !== 'top') parts.push('labelPosition="' + labelPosition + '"');
    if (labelPosition !== 'none') parts.push('label="' + labelText + '"');
    if (minVal) parts.push('min={' + minVal + '}');
    if (maxVal) parts.push('max={' + maxVal + '}');
    if (stepVal !== '1') parts.push('step={' + stepVal + '}');
    if (hasValidation) {
      parts.push('validation="' + validationType + '"');
      parts.push('validationMessage="' + validationMsg + '"');
    }
    if (disabled) parts.push('disabled');
    return '<NumberField\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Number Field</H2>
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

              <Box sx={{ width: '100%', maxWidth: 280 }}>
                <NumberField
                  key={'nf-' + variant + '-' + spinnerSize + '-' + labelPosition + '-' + hasValidation + '-' + validationType}
                  variant={variant}
                  size={isSpinner ? spinnerSize : 'standard'}
                  value={numValue}
                  onChange={setNumValue}
                  label={labelPosition !== 'none' ? labelText : undefined}
                  labelPosition={labelPosition}
                  min={minVal ? parseFloat(minVal) : undefined}
                  max={maxVal ? parseFloat(maxVal) : undefined}
                  step={stepVal ? parseFloat(stepVal) : 1}
                  validation={hasValidation ? validationType : undefined}
                  validationMessage={hasValidation ? validationMsg : undefined}
                  disabled={disabled}
                  fullWidth={isOutlined}
                />
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

            {/* Variant */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VARIANT</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Outlined" selected={variant === 'outlined'} onClick={() => setVariant('outlined')} />
                <ControlButton label="Spinner" selected={variant === 'spinner'} onClick={() => setVariant('spinner')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isOutlined
                  ? 'Text input with up/down steppers. Single size — steppers need 24×24 touch targets.'
                  : 'Minus/plus buttons flanking a centered value.'}
              </Caption>
            </Box>

            {/* Size (spinner only) */}
            {isSpinner && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  <ControlButton label="Standard" selected={spinnerSize === 'standard'} onClick={() => setSpinnerSize('standard')} />
                  <ControlButton label="Small" selected={spinnerSize === 'small'} onClick={() => setSpinnerSize('small')} />
                </Stack>
              </Box>
            )}

            {/* Label */}
            {isOutlined && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {['top', 'floating', 'none'].map((lp) => (
                    <ControlButton key={lp} label={cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Validation */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VALIDATION</OverlineSmall>
              <CheckboxControl label="Show validation" checked={hasValidation} onChange={setHasValidation}
                caption="Adds colored border and helper message." />

              {hasValidation && (
                <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    {['success', 'warning', 'error', 'info'].map((vt) => (
                      <ControlButton key={vt} label={cap(vt)} selected={validationType === vt} onClick={() => setValidationType(vt)} />
                    ))}
                  </Stack>
                  <TextInput label="Message" value={validationMsg} onChange={setValidationMsg} placeholder="Validation message" />
                </Stack>
              )}
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Label>Disabled</Label>
                <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} size="small" />
              </Box>
            </Box>

            {/* Advanced Settings */}
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
                    <TextInput label="Label Text" value={labelText} onChange={setLabelText} placeholder="Quantity" />
                  )}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextInput label="Min" value={minVal} onChange={setMinVal} placeholder="0" sx={{ width: '100%' }} />
                    <TextInput label="Max" value={maxVal} onChange={setMaxVal} placeholder="100" sx={{ width: '100%' }} />
                  </Box>
                  <TextInput label="Step" value={stepVal} onChange={setStepVal} placeholder="1" />
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
            {cap(variant)}{isSpinner ? ' · ' + cap(spinnerSize) : ''} · {cap(labelPosition)} label
            {hasValidation ? ' · ' + cap(validationType) + ' validation' : ''}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Input:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="spinbutton" aria-valuenow aria-valuemin aria-valuemax aria-label'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Steppers:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {isOutlined
                      ? 'Up/Down arrow buttons inside field. aria-label="Increase" / "Decrease". Min 24×24 touch targets.'
                      : 'Minus/Plus buttons flanking value. aria-label="Decrease" / "Increase".'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Keyboard:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>ArrowUp/ArrowDown increment/decrement. Direct text entry supported.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible) on input and stepper buttons.</Caption>
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
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>inherit → var(--Buttons-Default-Border)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Steppers:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Light-Button) · border: var(--Buttons-Default-Border) · text: var(--Buttons-Default-Light-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Stepper hover / active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Buttons-Default-Hover) / var(--Buttons-Default-Active)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Validation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    Border + text: var(--Text-Success), var(--Text-Warning), var(--Text-Error), var(--Text-Info)
                  </Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Outlined:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Single size (56px). Up/down steppers need 24×24 minimum touch target — cannot be smaller.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Spinner:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Standard (40px) or small (32px). Best for quantity selectors, counters.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Floating label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Outlined only. Shrinks on focus/filled. Same pattern as Select floating label.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default NumberFieldShowcase;
