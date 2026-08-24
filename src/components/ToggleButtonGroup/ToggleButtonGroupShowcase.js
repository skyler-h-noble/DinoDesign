// src/components/ToggleButtonGroup/ToggleButtonGroupShowcase.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Stack, Grid,
  Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import { ToggleButtonGroup, ToggleButton } from './ToggleButtonGroup';
import { Select } from '../Select/Select';
import { BackgroundPicker } from '../BackgroundPicker';
import { PreviewSurface } from '../PreviewSurface';
// The showcase's own chrome is built from the library, not from MUI — the
// design system should be dogfooding its Tabs and Button here.
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import {
  H3, H4, H5, Body, BodySmall, Caption, Label, EyebrowSmall
} from '../Typography';

// --- Contrast Calculator -----------------------------------------------------

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
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

// The button tokens only exist under [data-theme]/[data-surface], so reading
// them off documentElement returns "" and every ratio renders as "--". Read
// them off the preview surface instead, the way ButtonShowcase does.
function getCssVarFrom(el, varName) {
  if (!el) return null;
  return getComputedStyle(el).getPropertyValue(varName).trim() || null;
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
// black-white's tokens are --Buttons-BlackWhite-*, not the capitalised prop.
const seg = (c) => (c === 'black-white' ? 'BlackWhite' : cap(c));
const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme',   colors: ['primary', 'secondary', 'tertiary', 'neutral', 'black-white'] },
  { label: 'State',   colors: ['info', 'success', 'warning', 'error'] },
];
const STYLES = ['fill', 'outline', 'ghost'];
// What sits inside a segment. Only `swatch` needs component support; the rest
// are just different children.
const CONTENT_TYPES = ['text', 'icon', 'letter', 'number', 'swatch'];
const SWATCH_COLORS = [
  'var(--Primary-Color-7)', 'var(--Secondary-Color-7)', 'var(--Tertiary-Color-7)',
  'var(--Info-Color-7)', 'var(--Success-Color-7)', 'var(--Warning-Color-7)',
];

// --- Contrast Badge ----------------------------------------------------------

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

// --- Accessibility Row -------------------------------------------------------

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)',
    }}>
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
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Copy failed:', err); }
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

// --- Color Swatch Button -----------------------------------------------------

function ColorSwatchButton({ color, selected, onClick }) {
  const C = seg(color);
  return (
    <Tooltip title={C} arrow>
      <Box
        onClick={() => onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '1px solid var(--Border)',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          cursor: 'pointer',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

// --- Control Button ----------------------------------------------------------

function ControlButton({ label, selected, onClick }) {
  return (
    <Button selected={selected} variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function ToggleButtonGroupShowcase() {

  // Playground state
  // Kept: the contrast panel below reports against a colour ramp.
  const [color, setColor] = useState('default');
  const [size, setSize] = useState('medium');
  const [isDisabled, setIsDisabled] = useState(false);
  const [exclusive, setExclusive] = useState(true);
  const [orientation, setOrientation] = useState('horizontal');
  // A segmented control is 2-4 segments in practice, so the count is a knob
  // rather than a fixed three. The tables below are sliced to `segments`.
  const [segments, setSegments] = useState(3);
  const [style, setStyle] = useState('fill');
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');
  const [contentType, setContentType] = useState('icon');
  const [alignment, setAlignment] = useState('left');
  const [formats, setFormats] = useState([]);
  const [contrastData, setContrastData] = useState({});
  const surfaceRef = useRef(null);

  const EXCLUSIVE_SEGMENTS = [
    { value: 'left',    label: 'Left',    Icon: FormatAlignLeftIcon,    jsx: 'FormatAlignLeftIcon' },
    { value: 'center',  label: 'Center',  Icon: FormatAlignCenterIcon,  jsx: 'FormatAlignCenterIcon' },
    { value: 'right',   label: 'Right',   Icon: FormatAlignRightIcon,   jsx: 'FormatAlignRightIcon' },
    { value: 'justify', label: 'Justify', Icon: FormatAlignJustifyIcon, jsx: 'FormatAlignJustifyIcon' },
    { value: 'indent',  label: 'Indent',  Icon: FormatIndentIncreaseIcon, jsx: 'FormatIndentIncreaseIcon' },
    { value: 'outdent', label: 'Outdent', Icon: FormatIndentDecreaseIcon, jsx: 'FormatIndentDecreaseIcon' },
  ];
  const MULTIPLE_SEGMENTS = [
    { value: 'bold',      label: 'Bold',      Icon: FormatBoldIcon,       jsx: 'FormatBoldIcon' },
    { value: 'italic',    label: 'Italic',    Icon: FormatItalicIcon,     jsx: 'FormatItalicIcon' },
    { value: 'underline', label: 'Underline', Icon: FormatUnderlinedIcon, jsx: 'FormatUnderlinedIcon' },
    { value: 'strike',    label: 'Strike',    Icon: StrikethroughSIcon,   jsx: 'StrikethroughSIcon' },
    { value: 'sub',       label: 'Subscript', Icon: SubscriptIcon,        jsx: 'SubscriptIcon' },
    { value: 'sup',       label: 'Superscript', Icon: SuperscriptIcon,    jsx: 'SuperscriptIcon' },
  ];
  const activeSegments = (exclusive ? EXCLUSIVE_SEGMENTS : MULTIPLE_SEGMENTS).slice(0, segments);


  // fill is the bare colour name; outline and ghost suffix it.
  const getVariant = () => (style === 'fill' ? color : color + '-' + style);

  // The label a segment shows, per content type.
  const segLabel = (seg, i) => {
    if (contentType === 'letter') return String.fromCharCode(65 + i);
    if (contentType === 'number') return String(i + 1);
    if (contentType === 'text') return seg.label;
    return null; // icon / swatch render no text
  };

  // Exclusive handler
  const handleAlignment = (e, newAlignment) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  // Multi-select handler
  const handleFormats = (e, newFormats) => {
    setFormats(newFormats);
  };

  // Code snippet
  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (!exclusive) parts.push('exclusive={false}');
    if (orientation === 'vertical') parts.push('orientation="vertical"');
    if (isDisabled) parts.push('disabled');
    parts.push('aria-label="text formatting"');

    const btns = activeSegments
      .map((seg, i) => {
        const inner = contentType === 'icon' ? '<' + seg.jsx + ' />' : (segLabel(seg, i) || '');
        const sw = contentType === 'swatch'
          ? ' swatch="' + SWATCH_COLORS[i % SWATCH_COLORS.length] + '"'
          : '';
        return '<ToggleButton value="' + seg.value + '"' + sw + '>' + inner + '</ToggleButton>';
      })
      .join('\n  ');

    return '<ToggleButtonGroup ' + parts.join(' ') + '>\n  ' + btns + '\n</ToggleButtonGroup>';
  };

  // Contrast data
  useEffect(() => {
    // Defer one frame so styles are recalculated after a theme/surface change.
    const raf = requestAnimationFrame(() => {
      const el = surfaceRef.current;
      if (!el) return;
      const v = (name) => getCssVarFrom(el, name);
      const C = seg(color);

      setContrastData({
        buttonBg: null, // transparent
        text: v('--Quiet'),
        border: v('--Buttons-' + C + '-Border'),
        selectedBg: v('--Buttons-' + C + '-Button'),
        selectedText: v('--Buttons-' + C + '-Text'),
        hover: v('--Buttons-' + C + '-Hover'),
        background: v('--Background'),
        focusVisible: v('--Focus-Visible'),
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [color, bgTheme, bgSurface]);

  return (
    <Box sx={{ width: '100%' }}>
      <H3 style={{ marginBottom: 8 }}>ToggleButtonGroup</H3>
      <Body color="quiet" style={{ marginBottom: 8 }}>
        Segmented control for choosing between two, three or four mutually
        exclusive options — or several at once.
      </Body>
      <Box sx={{ mt: 1, mb: 3 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      <Tabs>
        <TabList>
          <Tab>Playground</Tab>
          <Tab>Accessibility</Tab>
        </TabList>

      {/* PLAYGROUND TAB */}
      <TabPanel value={0}>
        <Grid container sx={{ minHeight: 400 }}>
          {/* LEFT: Preview + Code */}
          <Grid item sx={{
            width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
          }}>
            {/* Preview */}
            <PreviewSurface
              ref={surfaceRef}
              theme={bgTheme}
              surface={bgSurface}
              sx={{
                p: 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 200,
                borderBottom: '1px solid var(--Border)',
              }}
            >
              {exclusive ? (
                <ToggleButtonGroup
                  variant={getVariant()}
                  size={size}
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  disabled={isDisabled}
                  orientation={orientation}
                  aria-label="text alignment"
                >
                  {activeSegments.map((seg, i) => {
                    const text = segLabel(seg, i);
                    return (
                      <ToggleButton
                        key={seg.value}
                        value={seg.value}
                        aria-label={seg.label}
                        {...(contentType === 'swatch' ? { swatch: SWATCH_COLORS[i % SWATCH_COLORS.length] } : {})}
                      >
                        {contentType === 'icon' ? <seg.Icon /> : text}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  variant={getVariant()}
                  size={size}
                  value={formats}
                  onChange={handleFormats}
                  disabled={isDisabled}
                  orientation={orientation}
                  aria-label="text formatting"
                >
                  {activeSegments.map((seg, i) => {
                    const text = segLabel(seg, i);
                    return (
                      <ToggleButton
                        key={seg.value}
                        value={seg.value}
                        aria-label={seg.label}
                        {...(contentType === 'swatch' ? { swatch: SWATCH_COLORS[i % SWATCH_COLORS.length] } : {})}
                      >
                        {contentType === 'icon' ? <seg.Icon /> : text}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              )}
            </PreviewSurface>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, borderBottom: '1px solid #333',
              }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                  {generateCode()}
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
            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</EyebrowSmall>
              <Stack direction="row" spacing={1}>
                {STYLES.map((st) => (
                  <ControlButton key={st} label={cap(st)} selected={style === st} onClick={() => setStyle(st)} />
                ))}
              </Stack>
            </Box>

            {/* Colour — Default, Theme, State */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</EyebrowSmall>
              {COLOR_GROUPS.map((grp) => (
                <Box key={grp.label} sx={{ mb: 1.5 }}>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>{grp.label}</Caption>
                  <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                    {grp.colors.map((c) => (
                      <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* Content type */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT TYPE</EyebrowSmall>
              <Select
                options={CONTENT_TYPES.map((ct) => ({
                  value: ct,
                  label: ct === 'icon' ? 'Icon-Only' : cap(ct),
                }))}
                value={contentType}
                onChange={setContentType}
                labelPosition="none"
                size="small"
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {contentType === 'icon'   ? 'Icon only — each segment needs an aria-label.' :
                 contentType === 'letter' ? 'Single letter per segment.' :
                 contentType === 'number' ? 'Single digit per segment.' :
                 contentType === 'swatch' ? 'Colour chip per segment, sized from --*-Input-Swatch-Radius.' :
                 'Text label, with optional start and end decorators.'}
              </Caption>
            </Box>

            {/* Segment count */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SEGMENTS</EyebrowSmall>
              <Stack direction="row" spacing={1}>
                {[2, 3, 4, 5, 6].map((count) => (
                  <ControlButton key={count} label={String(count)} selected={segments === count}
                    onClick={() => setSegments(count)} />
                ))}
              </Stack>
            </Box>

            {/* Selection mode */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SELECTION</EyebrowSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Exclusive" selected={exclusive} onClick={() => setExclusive(true)} />
                <ControlButton label="Multiple" selected={!exclusive} onClick={() => setExclusive(false)} />
              </Stack>
            </Box>

            {/* Orientation */}
            <Box sx={{ mt: 3 }}>
              <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ORIENTATION</EyebrowSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Horizontal" selected={orientation === 'horizontal'} onClick={() => setOrientation('horizontal')} />
                <ControlButton label="Vertical" selected={orientation === 'vertical'} onClick={() => setOrientation('vertical')} />
              </Stack>
            </Box>

            {/* Disabled */}
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<MuiCheckbox checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />}
                label={<BodySmall>Disabled</BodySmall>}
              />
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ACCESSIBILITY TAB */}
      <TabPanel value={1}>
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {getVariant()} · {size} · {segments} segments · {contentType}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text contrast — default state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Contrast — Default State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Button text must have ≥ 4.5:1 contrast against its background (WCAG 1.4.3 AA)
              </BodySmall>
              <A11yRow
                label="Text vs. Background"
                ratio={getContrast(contrastData.text, contrastData.buttonBg || contrastData.background)}
                threshold={4.5}
                note="Text vs page background (transparent button bg)"
              />
            </Box>

            {/* Text contrast — selected state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Contrast — Selected State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Selected button text must have ≥ 4.5:1 contrast against selected background (WCAG 1.4.3 AA)
              </BodySmall>
              <A11yRow
                label="Selected Text vs. Selected Background"
                ratio={getContrast(contrastData.selectedText, contrastData.selectedBg)}
                threshold={4.5}
                note={'var(--Buttons-' + seg(color) + '-Text) vs var(--Buttons-' + seg(color) + '-Button)'}
              />
            </Box>

            {/* Border contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Border Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Border must have ≥ 3:1 contrast against page background (WCAG 1.4.11)
              </BodySmall>
              <A11yRow
                label="Border vs. Background"
                ratio={getContrast(contrastData.border, contrastData.background)}
                threshold={3.1}
                note={'var(--Buttons-' + seg(color) + '-Border) vs var(--Background)'}
              />
            </Box>

            {/* Focus Visible */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Focus-Visible Indicator</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Focus ring must be visible to keyboard users
              </BodySmall>
              <A11yRow
                label="Focus-Visible outline vs. Background"
                ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                threshold={3.1}
                note="var(--Focus-Visible) vs var(--Background), 2px solid, -2px offset (inset)"
              />
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Keyboard Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Group label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ToggleButtonGroup aria-label="text alignment" />'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Button values:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<ToggleButton value="left" /> — each button needs a unique value'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Tab to focus group, Space/Enter to toggle, aria-pressed managed by MUI
                  </Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </TabPanel>
      </Tabs>
    </Box>
  );
}
