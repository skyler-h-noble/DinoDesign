// src/components/TransferList/TransferListShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { TransferList } from './TransferList';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const DEFAULT_LEFT = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
const DEFAULT_RIGHT = ['Item 5', 'Item 6'];

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

export function TransferListShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [mode, setMode] = useState('basic');
  const [isDisabled, setIsDisabled] = useState(false);
  const [leftTitle, setLeftTitle] = useState('Available');
  const [rightTitle, setRightTitle] = useState('Chosen');

  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Item management
  const [leftCount, setLeftCount] = useState(4);
  const [rightCount, setRightCount] = useState(2);
  const [leftLabels, setLeftLabels] = useState(DEFAULT_LEFT.map((l) => l));
  const [rightLabels, setRightLabels] = useState(DEFAULT_RIGHT.map((l) => l));

  // Live items (what the TransferList actually renders)
  const [liveLeft, setLiveLeft] = useState(DEFAULT_LEFT);
  const [liveRight, setLiveRight] = useState(DEFAULT_RIGHT);

  // Sync labels when count changes
  useEffect(() => {
    setLeftLabels((prev) => {
      const next = [];
      for (let i = 0; i < leftCount; i++) next.push(prev[i] || 'Item ' + (i + 1));
      return next;
    });
  }, [leftCount]);

  useEffect(() => {
    setRightLabels((prev) => {
      const next = [];
      for (let i = 0; i < rightCount; i++) next.push(prev[i] || 'Item ' + (leftCount + i + 1));
      return next;
    });
  }, [rightCount, leftCount]);

  const updateLeftLabel = (i, val) => {
    setLeftLabels((prev) => { const n = [...prev]; n[i] = val; return n; });
  };
  const updateRightLabel = (i, val) => {
    setRightLabels((prev) => { const n = [...prev]; n[i] = val; return n; });
  };

  // Reset live items from advanced settings
  const applyItems = () => {
    setLiveLeft(leftLabels.slice(0, leftCount));
    setLiveRight(rightLabels.slice(0, rightCount));
  };

  // Auto-apply on first render and when mode changes
  useEffect(() => { applyItems(); }, [mode]);

  const handleChange = ({ left, right }) => {
    setLiveLeft(left);
    setLiveRight(right);
  };

  const generateCode = () => {
    const parts = [];
    if (mode !== 'basic') parts.push('mode="' + mode + '"');
    parts.push('leftTitle="' + leftTitle + '"');
    parts.push('rightTitle="' + rightTitle + '"');
    parts.push('defaultLeftItems={["' + liveLeft.join('", "') + '"]}');
    parts.push('defaultRightItems={["' + liveRight.join('", "') + '"]}');
    if (isDisabled) parts.push('disabled');
    return '<TransferList\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Transfer List</H2>
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
              minHeight: 400, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              <TransferList
                key={'tl-' + mode + '-' + liveLeft.join(',') + '-' + liveRight.join(',')}
                mode={mode}
                leftTitle={leftTitle}
                rightTitle={rightTitle}
                defaultLeftItems={liveLeft}
                defaultRightItems={liveRight}
                onChange={handleChange}
                disabled={isDisabled}
                sx={{ width: '100%' }}
              />
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

            {/* Mode */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MODE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Basic" selected={mode === 'basic'} onClick={() => setMode('basic')} />
                <ControlButton label="Enhanced" selected={mode === 'enhanced'} onClick={() => setMode('enhanced')} />
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {mode === 'basic'
                  ? 'Checkbox selection with single-item move buttons.'
                  : 'Adds select-all header, item counts, and move-all buttons.'}
              </Caption>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Label>Disabled</Label>
                <Switch checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />
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
                <Stack spacing={2.5}>
                  {/* Titles */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>PANEL TITLES</OverlineSmall>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', width: 40, flexShrink: 0 }}>Left</Caption>
                        <TextInput value={leftTitle} onChange={setLeftTitle} placeholder="Available" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', width: 40, flexShrink: 0 }}>Right</Caption>
                        <TextInput value={rightTitle} onChange={setRightTitle} placeholder="Chosen" />
                      </Box>
                    </Stack>
                  </Box>

                  {/* Left items */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LEFT ITEMS</OverlineSmall>
                    <NumberStepper label="Count" value={leftCount} onChange={setLeftCount} min={0} max={10} />
                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                      {leftLabels.slice(0, leftCount).map((lbl, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                          <TextInput value={lbl} onChange={(val) => updateLeftLabel(i, val)} placeholder={'Item ' + (i + 1)} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Right items */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>RIGHT ITEMS</OverlineSmall>
                    <NumberStepper label="Count" value={rightCount} onChange={setRightCount} min={0} max={10} />
                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                      {rightLabels.slice(0, rightCount).map((lbl, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</Caption>
                          <TextInput value={lbl} onChange={(val) => updateRightLabel(i, val)} placeholder={'Item ' + (leftCount + i + 1)} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Apply button */}
                  <Box component="button" type="button" onClick={applyItems}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      px: 2, py: 1,
                      backgroundColor: 'var(--Buttons-Primary-Button)',
                      color: 'var(--Buttons-Primary-Text)',
                      border: '1px solid var(--Buttons-Primary-Border)',
                      borderRadius: 'var(--Style-Border-Radius)',
                      fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
                      '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                    }}
                  >
                    Apply Items
                  </Box>
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
            {cap(mode)} transfer list
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Container:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'role="group" aria-label="Transfer list"'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Checkboxes:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Uses own Checkbox component. Each item toggles independently. Enhanced mode adds select-all with indeterminate state.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Lists:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Uses own List + ListItem components. Click row or checkbox to select.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Move buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {mode === 'enhanced'
                      ? 'Four buttons: Move all right (>>), Move selected right (>), Move selected left (<), Move all left (<<). Each has aria-label.'
                      : 'Two buttons: Move selected right (>) and Move selected left (<). Each has aria-label.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Focus:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>2px solid var(--Focus-Visible) on all interactive elements.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Panel:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Background) · border: var(--Border)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Header:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Surface-Dim)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Selected row:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Surface-Dim)</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Move buttons:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>bg: var(--Buttons-Default-Light-Button) · border: var(--Buttons-Default-Border) · text: var(--Buttons-Default-Light-Text)</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Move hover / active:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>var(--Buttons-Default-Hover) / var(--Buttons-Default-Active)</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Components Used</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Checkbox:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Own Checkbox component (size="small"). Individual item + select-all (enhanced).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>List / ListItem:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Own List component (size="small"). Checkbox as startDecorator.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Best practice:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Use enhanced mode for large lists (10+ items). Basic is fine for small sets.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default TransferListShowcase;
