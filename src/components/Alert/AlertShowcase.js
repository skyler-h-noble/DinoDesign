// src/components/Alert/AlertShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import UpdateIcon from '@mui/icons-material/Update';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { Alert } from './Alert';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const ICON_MAP = {
  Info: <InfoIcon sx={{ fontSize: 'inherit' }} />,
  Success: <CheckCircleIcon sx={{ fontSize: 'inherit' }} />,
  Warning: <WarningIcon sx={{ fontSize: 'inherit' }} />,
  Error: <ErrorIcon sx={{ fontSize: 'inherit' }} />,
  Notification: <NotificationsIcon sx={{ fontSize: 'inherit' }} />,
  Star: <StarIcon sx={{ fontSize: 'inherit' }} />,
  Security: <SecurityIcon sx={{ fontSize: 'inherit' }} />,
  Update: <UpdateIcon sx={{ fontSize: 'inherit' }} />,
  Close: <CloseIcon sx={{ fontSize: 'inherit' }} />,
  Arrow: <ArrowForwardIcon sx={{ fontSize: 'inherit' }} />,
  Delete: <DeleteIcon sx={{ fontSize: 'inherit' }} />,
  Settings: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
};
const ICON_NAMES = Object.keys(ICON_MAP);

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
  const l1 = getLuminance(hex1); const l2 = getLuminance(hex2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
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
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700 }}>{ratio}:1</Box>
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
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
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
function SelectInput({ value, onChange, options, label, sx: sxOverride }) {
  return (
    <Box
      component="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      sx={{
        padding: '4px 6px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        cursor: 'pointer', '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    >
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </Box>
  );
}
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box
      component="input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}

export function AlertShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('outline');
  const [color, setColor] = useState('info');
  const [size, setSize] = useState('medium');
  const [message, setMessage] = useState('This is an alert — check it out!');

  // Start decorator
  const [startType, setStartType] = useState('icon'); // none | icon | avatar
  const [startIcon, setStartIcon] = useState('Info');
  const [startIconColor, setStartIconColor] = useState('info');

  // End decorator
  const [endType, setEndType] = useState('none'); // none | icon | link | button
  const [endIcon, setEndIcon] = useState('Close');
  const [endIconColor, setEndIconColor] = useState('neutral');
  const [endText, setEndText] = useState('Dismiss');
  const [endBtnColor, setEndBtnColor] = useState('primary');

  const [contrastData, setContrastData] = useState({});

  const isStandard = variant === 'standard';
  const C = COLOR_LABEL_MAP[color] || 'Primary';

  // Build start decorator
  const buildStartDecorator = () => {
    if (startType === 'none') return undefined;
    if (startType === 'avatar') {
      const SC = cap(startIconColor);
      return (
        <Box className="alert-avatar" sx={{
          width: 28, height: 28, borderRadius: '50%',
          backgroundColor: 'var(--Buttons-' + SC + '-Button)',
          color: 'var(--Buttons-' + SC + '-Text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 700, flexShrink: 0,
        }}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </Box>
      );
    }
    // icon
    const SC = cap(startIconColor);
    const icon = ICON_MAP[startIcon] || ICON_MAP.Info;
    return (
      <Box sx={{ color: 'var(--Buttons-' + SC + '-Border)', display: 'inline-flex', fontSize: 'inherit' }}>
        {icon}
      </Box>
    );
  };

  // Build end decorator
  const buildEndDecorator = () => {
    if (endType === 'none') return undefined;
    if (endType === 'icon') {
      const EC = cap(endIconColor);
      const icon = ICON_MAP[endIcon] || ICON_MAP.Close;
      return (
        <Box
          component="button"
          aria-label={endIcon}
          sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '4px',
            border: 'none', backgroundColor: 'transparent',
            color: 'var(--Buttons-' + EC + '-Border)',
            cursor: 'pointer', fontSize: '18px', flexShrink: 0,
            '&:hover': { backgroundColor: 'var(--Hover)' },
            '&:active': { backgroundColor: 'var(--Active)' },
            '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
          }}
        >
          {icon}
        </Box>
      );
    }
    if (endType === 'link') {
      const EC = cap(endBtnColor);
      return (
        <Box
          component="a"
          href="#"
          onClick={(e) => e.preventDefault()}
          sx={{
            color: 'var(--Buttons-' + EC + '-Border)',
            fontSize: '13px', fontWeight: 600, textDecoration: 'underline',
            cursor: 'pointer', whiteSpace: 'nowrap',
            '&:hover': { textDecoration: 'none' },
            '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
          }}
        >
          {endText || 'Learn more'}
        </Box>
      );
    }
    // button
    const EC = cap(endBtnColor);
    return (
      <Box
        component="button"
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 12px', fontSize: '13px', fontWeight: 600,
          fontFamily: 'inherit', borderRadius: '4px', cursor: 'pointer',
          border: 'none', whiteSpace: 'nowrap',
          backgroundColor: 'var(--Buttons-' + EC + '-Button)',
          color: 'var(--Buttons-' + EC + '-Text)',
          '&:hover': { backgroundColor: 'var(--Buttons-' + EC + '-Hover)' },
          '&:active': { backgroundColor: 'var(--Buttons-' + EC + '-Active)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}
      >
        {endText || 'Action'}
      </Box>
    );
  };

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const generateCode = () => {
    const parts = [];
    if (variant !== 'standard') parts.push('variant="' + variant + '"');
    if (!isStandard && color !== 'primary') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (startType !== 'none') parts.push('startDecorator={<' + startIcon + 'Icon />}');
    if (endType === 'icon') parts.push('endDecorator={<IconButton><' + endIcon + 'Icon /></IconButton>}');
    else if (endType === 'link') parts.push('endDecorator={<Link>' + (endText || 'Learn more') + '</Link>}');
    else if (endType === 'button') parts.push('endDecorator={<Button>' + (endText || 'Action') + '</Button>}');
    const p = parts.length ? '\n  ' + parts.join('\n  ') + '\n' : '';
    return '<Alert' + p + '>\n  ' + message + '\n</Alert>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.background = getCssVar('--Background');
    data.border = getCssVar('--Border');
    data.colorBorder = getCssVar('--Buttons-' + C + '-Border');
    setContrastData(data);
  }, [variant, color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Alert</H2>
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
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              <Alert
                variant={variant}
                color={color}
                size={size}
                startDecorator={buildStartDecorator()}
                endDecorator={buildEndDecorator()}
              >
                {message}
              </Alert>

              {/* All variants side by side */}
              <Box>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>All variants — {cap(color)}</Caption>
                <Stack spacing={1.5}>
                  {['standard', 'outline', 'light', 'solid'].map((v) => (
                    <Box key={v}>
                      <Caption style={{ color: 'var(--Text-Quiet)', fontSize: '10px', display: 'block', marginBottom: 2 }}>{cap(v)}</Caption>
                      <Alert variant={v} color={color} size="small" startDecorator={buildStartDecorator()}>
                        {cap(v)} alert message
                      </Alert>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {isStandard && <Caption style={{ color: 'var(--Text-Quiet)' }}>No border, no data-theme.</Caption>}
                {variant === 'outline' && <Caption style={{ color: 'var(--Text-Quiet)' }}>Border: var(--Buttons-{C}-Border)</Caption>}
                {(variant === 'light' || variant === 'solid') && (
                  <>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Outer border: var(--Border)</Caption>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>Inner: data-theme="{getThemeName()}" data-surface="Surface"</Caption>
                  </>
                )}
              </Box>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 180 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['standard', 'outline', 'light', 'solid'].map((v) => (
                  <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isStandard && 'No border or background — plain text.'}
                {variant === 'outline' && 'Colored border, no background fill.'}
                {variant === 'light' && 'Outer var(--Border) + inner data-theme="{Color}-Light".'}
                {variant === 'solid' && 'Outer var(--Border) + inner data-theme="{Color}".'}
              </Caption>
            </Box>

            {/* Color */}
            {!isStandard && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '13px text, 8px/12px padding.' : size === 'medium' ? '14px text, 12px/16px padding.' : '16px text, 14px/20px padding.'}
              </Caption>
            </Box>

            {/* Message */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MESSAGE</OverlineSmall>
              <TextInput value={message} onChange={setMessage} placeholder="Alert message text" />
            </Box>

            {/* Start Decorator */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>START DECORATOR</OverlineSmall>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  {['none', 'icon', 'avatar'].map((t) => (
                    <ControlButton key={t} label={cap(t)} selected={startType === t} onClick={() => setStartType(t)} />
                  ))}
                </Stack>
                {startType !== 'none' && (
                  <Stack spacing={1}>
                    {startType === 'icon' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 40 }}>Icon</Caption>
                        <SelectInput value={startIcon} onChange={setStartIcon} options={ICON_NAMES} label="Start icon" />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 40 }}>Color</Caption>
                      <Stack direction="row" sx={{ gap: 0.5 }}>
                        {COLORS.map((c) => {
                          const CC = cap(c);
                          return (
                            <Tooltip key={c} title={CC} arrow>
                              <Box onClick={() => setStartIconColor(c)} role="button" aria-label={'Icon color ' + CC}
                                sx={{ width: 22, height: 22, borderRadius: '3px', cursor: 'pointer',
                                  backgroundColor: 'var(--Buttons-' + CC + '-Button)',
                                  border: startIconColor === c ? '2px solid var(--Text)' : '2px solid transparent',
                                  '&:hover': { transform: 'scale(1.15)' }, transition: 'transform 0.1s' }} />
                            </Tooltip>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* End Decorator */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>END DECORATOR</OverlineSmall>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {['none', 'icon', 'link', 'button'].map((t) => (
                    <ControlButton key={t} label={cap(t)} selected={endType === t} onClick={() => setEndType(t)} />
                  ))}
                </Stack>
                {endType !== 'none' && (
                  <Stack spacing={1}>
                    {endType === 'icon' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 40 }}>Icon</Caption>
                        <SelectInput value={endIcon} onChange={setEndIcon} options={ICON_NAMES} label="End icon" />
                      </Box>
                    )}
                    {(endType === 'link' || endType === 'button') && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 40 }}>Text</Caption>
                        <TextInput value={endText} onChange={setEndText} placeholder={endType === 'link' ? 'Link text' : 'Button text'} />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 40 }}>Color</Caption>
                      <Stack direction="row" sx={{ gap: 0.5 }}>
                        {COLORS.map((c) => {
                          const CC = cap(c);
                          const sel = endType === 'icon' ? endIconColor : endBtnColor;
                          const setSel = endType === 'icon' ? setEndIconColor : setEndBtnColor;
                          return (
                            <Tooltip key={c} title={CC} arrow>
                              <Box onClick={() => setSel(c)} role="button" aria-label={'End color ' + CC}
                                sx={{ width: 22, height: 22, borderRadius: '3px', cursor: 'pointer',
                                  backgroundColor: 'var(--Buttons-' + CC + '-Button)',
                                  border: sel === c ? '2px solid var(--Text)' : '2px solid transparent',
                                  '&:hover': { transform: 'scale(1.15)' }, transition: 'transform 0.1s' }} />
                            </Tooltip>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>
                )}
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
            Based on current settings: {variant} / {color} / {size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Visual Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Visual Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Text and borders must be visually distinct</BodySmall>
              <A11yRow label="Text: var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Alert message text readability (WCAG 1.4.3, 4.5:1)" />
              {variant === 'outline' && (
                <A11yRow label={'Border: var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                  ratio={getContrast(contrastData.colorBorder, contrastData.background)} threshold={3.0}
                  note="Outline border visibility (WCAG 1.4.11, 3:1)" />
              )}
              {(variant === 'light' || variant === 'solid') && (
                <A11yRow label="Outer border: var(--Border) vs. var(--Background)"
                  ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                  note="Container border — uses page-level --Border outside themed area (WCAG 1.4.11, 3:1)" />
              )}
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Alert role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="alert">'} — screen readers announce content when it appears without interrupting current task (implicit aria-live="assertive" + aria-atomic="true").
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Structure:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {(variant === 'light' || variant === 'solid')
                      ? 'Outer wrapper (role="alert", border: var(--Border)) → inner div (data-theme="' + getThemeName() + '", data-surface="Surface") → content slots.'
                      : 'Single container (role="alert") → content slots.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Start decorator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Icon or avatar. Decorative — not announced separately. Use aria-label on the Alert if the icon conveys meaning (e.g. "Error alert").
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>End decorator:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Icon button (aria-label required), link (standard link semantics), or button (visible label). All have focus-visible indicators: 3px solid var(--Focus-Visible).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Not a dialog:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Alerts are passive — they do not trap focus or require a response. For interrupting messages requiring user action, use a Modal (role="alertdialog").
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>13px text, 18px icon, 8px/12px padding, 8px gap.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>14px text, 20px icon, 12px/16px padding, 10px gap.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>16px text, 22px icon, 14px/20px padding, 12px gap.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default AlertShowcase;
