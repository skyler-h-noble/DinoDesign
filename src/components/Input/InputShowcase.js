// src/components/Input/InputShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Input } from './Input';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

const STYLES = ['outline', 'light'];
const VALIDATIONS = ['none', 'info', 'success', 'warning', 'error'];

/* ── Helpers ── */
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
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Buttons-' + C + '-Button)',
        border: selected ? '2px solid var(--Text)' : '2px solid transparent',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && (
        <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />
      )}
    </Box>
  );
}

function TextInput({ value, onChange, placeholder, label: inputLabel }) {
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
        }}
      />
    </Box>
  );
}

/* ── Main Showcase ── */
export function InputShowcase() {
  const [style, setStyle]               = useState('outline');
  const [color, setColor]               = useState('default');
  const [size, setSize]                 = useState('medium');
  const [labelPosition, setLabelPosition] = useState('standard');
  const [validation, setValidation]     = useState('none');
  const [validationMsg, setValidationMsg] = useState('This field is required.');
  const [inputLabel, setInputLabel]     = useState('Email');
  const [placeholder, setPlaceholder]   = useState('Enter your email');
  const [helperText, setHelperText]     = useState('');
  const [disabled, setDisabled]         = useState(false);
  const [fullWidth, setFullWidth]       = useState(true);
  const [multiline, setMultiline]       = useState(false);
  const [bgTheme, setBgTheme]           = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const effectiveColor = color === 'default' ? 'primary' : color;
  const variant = effectiveColor + '-' + style;

  const generateCode = () => {
    const parts = ['variant="' + variant + '"'];
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (inputLabel) parts.push('label="' + inputLabel + '"');
    if (labelPosition !== 'standard') parts.push('labelPosition="' + labelPosition + '"');
    if (placeholder) parts.push('placeholder="' + placeholder + '"');
    if (validation !== 'none') {
      parts.push('validation="' + validation + '"');
      if (validationMsg) parts.push('validationMessage="' + validationMsg + '"');
    }
    if (helperText) parts.push('helperText="' + helperText + '"');
    if (disabled) parts.push('disabled');
    if (fullWidth) parts.push('fullWidth');
    if (multiline) parts.push('multiline rows={3}');
    return '<Input\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Input</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Input
                variant={variant}
                size={size}
                label={inputLabel}
                labelPosition={labelPosition}
                placeholder={placeholder}
                helperText={validation === 'none' ? helperText : undefined}
                validation={validation !== 'none' ? validation : undefined}
                validationMessage={validation !== 'none' ? validationMsg : undefined}
                disabled={disabled}
                fullWidth={fullWidth}
                multiline={multiline}
                rows={multiline ? 3 : undefined}
              />
            </Box>
          </PreviewSurface>

          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{
                fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
                maxWidth: '100%', display: 'block',
              }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
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

                  {/* Background */}
                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Style */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {STYLES.map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={style === s} onClick={() => setStyle(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack spacing={1.5}>
                      {COLOR_GROUPS.map((group) => (
                        <Box key={group.label}>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                            {group.colors.map((c) => (
                              <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                            ))}
                          </Stack>
                        </Box>
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
                  </Box>

                  {/* Label Position */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['standard', 'floating'].map((lp) => (
                        <ControlButton key={lp} label={cap(lp)} selected={labelPosition === lp} onClick={() => setLabelPosition(lp)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Validation */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VALIDATION</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {VALIDATIONS.map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={validation === v} onClick={() => setValidation(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Text inputs */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TEXT</OverlineSmall>
                    <Stack spacing={1.5}>
                      <TextInput label="Label" value={inputLabel} onChange={setInputLabel} placeholder="Email" />
                      <TextInput label="Placeholder" value={placeholder} onChange={setPlaceholder} placeholder="Enter your email" />
                      {validation !== 'none' && (
                        <TextInput label="Validation Message" value={validationMsg} onChange={setValidationMsg} placeholder="This field is required." />
                      )}
                      {validation === 'none' && (
                        <TextInput label="Helper Text" value={helperText} onChange={setHelperText} placeholder="Optional helper text" />
                      )}
                    </Stack>
                  </Box>

                  {/* Toggles */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Disabled</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Non-interactive state</Caption>
                    </Box>
                    <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)}
                      size="small" aria-label="Disabled" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Full Width</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Stretch to container width</Caption>
                    </Box>
                    <Switch checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)}
                      size="small" aria-label="Full width" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Multiline</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Textarea with multiple rows</Caption>
                    </Box>
                    <Switch checked={multiline} onChange={(e) => setMultiline(e.target.checked)}
                      size="small" aria-label="Multiline" />
                  </Box>

                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Label',       value: 'Always provide label or aria-label for screen readers (WCAG 1.3.1)' },
                          { label: 'Validation',  value: 'aria-invalid="true" when validation is error. Icon + message provide visual cue.' },
                          { label: 'Helper text',  value: 'Linked via aria-describedby to the input element.' },
                          { label: 'Focus',        value: 'outline: 2px solid var(--Focus-Visible); outline-offset: 2px' },
                          { label: 'Disabled',     value: 'HTML disabled attribute. opacity: 0.6, cursor: not-allowed.' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
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

export default InputShowcase;
