// src/components/Gradient/GradientShowcase.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { Gradient } from './Gradient';
import {
  FAMILIES,
  FAMILY_PREFIX,
  ALL_TONES,
  getZone,
  getAllowedTones,
  getAllowedTonesForFamily,
  getTextColor,
  validateZone,
  getColorVar,
  buildLinearCSS,
  buildRadialCSS,
  buildMeshCSS,
  getPreset,
} from './gradientUtils';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Select } from '../Select/Select';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const VARIANTS = ['linear', 'radial', 'mesh', 'meshCard'];
const VARIANT_LABELS = { linear: 'Linear', radial: 'Radial', mesh: 'Mesh', meshCard: 'Mesh + Card' };

const GRADIENT_COLORS = ['primary', 'secondary', 'tertiary', 'black', 'white'];
const GRADIENT_FAMILIES = ['primary', 'secondary', 'tertiary', 'neutral', 'black', 'white'];
// Black/White linear: only BW + Neutral
const BW_LINEAR_FAMILIES = ['black', 'white', 'neutral'];
// Black/White mesh: brand colors + BW + neutral
const BW_MESH_FAMILIES = ['black', 'white', 'primary', 'secondary', 'tertiary', 'neutral'];
const CARD_VARIANT_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'light', label: 'Light' },
  { value: 'default', label: 'Default' },
];
const CARD_COLOR_OPTIONS = ['default', 'primary', 'secondary', 'tertiary', 'neutral'].map(
  (c) => ({ value: c, label: cap(c) })
);

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

/* ── Tone Swatch Picker ── */
// A swatch button that opens a dropdown popover showing all available
// families and their allowed tones. Matches the Figma mockup.

function ToneSwatchPicker({ family, tone, zone, isMeshCard, families, onChange }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position popover below trigger
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4 + window.scrollY, left: rect.left + window.scrollX });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (popoverRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  const popover = open ? ReactDOM.createPortal(
    <Box ref={popoverRef} sx={{
      position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999,
      minWidth: 320, maxHeight: 360, overflowY: 'auto',
      backgroundColor: 'var(--Container)', border: '1px solid var(--Border)',
      borderRadius: 'var(--Style-Border-Radius)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', p: 2,
    }}>
      {families.map((f) => {
        const tones = isMeshCard ? ALL_TONES : getAllowedTonesForFamily(zone, f);
        return (
          <Box key={f} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
            <Caption style={{ color: 'var(--Text-Quiet)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {cap(f)}
            </Caption>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
              {tones.map((t) => {
                const isSelected = family === f && tone === t;
                return (
                  <Box key={t} component="button"
                    onClick={() => { onChange(f, t); setOpen(false); }}
                    aria-label={cap(f) + ' tone ' + t}
                    title={cap(f) + ' ' + t}
                    sx={{
                      width: 28, height: 28, borderRadius: '4px', flexShrink: 0,
                      backgroundColor: getColorVar(f, t),
                      border: isSelected ? '2px solid var(--Text)' : '2px solid transparent',
                      outline: isSelected ? '2px solid var(--Focus-Visible)' : 'none',
                      outlineOffset: '1px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 0.1s ease',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}>
                    {isSelected && (
                      <CheckIcon sx={{ fontSize: 14, color: getZone(t, f) === 'dark' ? '#fff' : '#000' }} />
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Box>,
    document.body
  ) : null;

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box ref={triggerRef} component="button" onClick={() => setOpen(!open)}
        aria-label={cap(family) + ' tone ' + tone}
        sx={{
          display: 'flex', alignItems: 'center', gap: 0.5,
          padding: '4px 8px 4px 4px',
          border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
          backgroundColor: 'var(--Background)', cursor: 'pointer',
          '&:hover': { borderColor: 'var(--Buttons-Primary-Border)' },
        }}>
        <Box sx={{
          width: 28, height: 28, borderRadius: '4px', flexShrink: 0,
          backgroundColor: getColorVar(family, tone),
        }} />
        <Box sx={{
          fontSize: '10px', color: 'var(--Text-Quiet)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
        }}>▼</Box>
      </Box>
      {popover}
    </Box>
  );
}

/* ── Gradient Swatch Button ── */
// Shows a mini gradient preview for each color preset.

function GradientSwatchButton({ colorName, variant, selected, onClick }) {
  // Build a mini gradient from the preset for this color + variant
  const v = variant === 'meshCard' ? 'meshCard' : variant === 'mesh' ? 'mesh' : variant === 'radial' ? 'radial' : 'linear';
  const preset = getPreset(colorName, v);
  const bg = (v === 'mesh' || v === 'meshCard')
    ? buildMeshCSS(preset)
    : v === 'radial'
      ? buildRadialCSS(preset, { x: 50, y: 50 })
      : buildLinearCSS(preset, 135);

  return (
    <Box component="button" onClick={onClick}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
      }}>
      <Caption style={{
        color: selected ? 'var(--Text)' : 'var(--Text-Quiet)',
        fontWeight: selected ? 600 : 400,
      }}>{cap(colorName)}</Caption>
      <Box sx={{
        width: 56, height: 56,
        borderRadius: 'var(--Style-Border-Radius)',
        background: bg,
        border: selected ? '2px solid var(--Text)' : '1px solid var(--Border)',
        outline: selected ? '2px solid var(--Focus-Visible)' : 'none',
        outlineOffset: '1px',
        transition: 'transform 0.1s ease',
        '&:hover': { transform: 'scale(1.08)' },
      }} />
    </Box>
  );
}

/* ── Compact numeric input ── */
const numInputSx = {
  width: 44, padding: '3px 4px', fontSize: '12px', fontFamily: 'inherit',
  border: '1px solid var(--Border)', borderRadius: '4px', textAlign: 'center',
  backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
  '&:focus': { borderColor: 'var(--Focus-Visible)' },
};

/* ── Angle Dial ── */

function AngleDial({ angle, onChange }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const R = 50;
  const cx = 60, cy = 60;
  const rad = (angle - 90) * (Math.PI / 180);
  const hx = cx + R * Math.cos(rad);
  const hy = cy + R * Math.sin(rad);

  const computeAngle = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left - cx;
    const my = e.clientY - rect.top - cy;
    let deg = Math.atan2(my, mx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    onChange(Math.round(deg) % 360);
  }, [onChange]);

  const onPointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    computeAngle(e);
  };
  const onPointerMove = (e) => { if (dragging.current) computeAngle(e); };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <svg ref={svgRef} width={120} height={120} style={{ cursor: 'pointer', flexShrink: 0 }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--Border)" strokeWidth={2} />
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="var(--Text)" strokeWidth={2} />
      <circle cx={hx} cy={hy} r={7} fill="var(--Buttons-Primary-Button)" stroke="var(--Text)" strokeWidth={2} style={{ cursor: 'grab' }} />
    </svg>
  );
}

/* ── Blob Drag Overlay ── */

function BlobOverlay({ blobs, onBlobMove }) {
  const containerRef = useRef(null);
  const dragIdx = useRef(null);

  const onPointerDown = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    dragIdx.current = idx;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (dragIdx.current === null) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    onBlobMove(dragIdx.current, Math.round(x), Math.round(y));
  };

  const onPointerUp = () => { dragIdx.current = null; };

  return (
    <Box ref={containerRef} sx={{
      position: 'absolute', inset: 0, zIndex: 2,
    }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
      {blobs.map((blob, i) => (
        <Box key={i}
          onPointerDown={(e) => onPointerDown(e, i)}
          sx={{
            position: 'absolute',
            left: blob.x + '%', top: blob.y + '%',
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: '50%',
            backgroundColor: getColorVar(blob.family, blob.tone),
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            cursor: 'grab',
            zIndex: 3,
            '&:hover': { transform: 'translate(-50%, -50%) scale(1.3)' },
          }}
        />
      ))}
    </Box>
  );
}

/* ── Stop / Blob Row ── */

function StopRow({ stop, index, zone, isMeshCard, families, onUpdate, onDelete, canDelete }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: '1px solid var(--Border)' }}>
      <ToneSwatchPicker family={stop.family} tone={stop.tone} zone={zone}
        isMeshCard={isMeshCard} families={families}
        onChange={(f, t) => onUpdate(index, { ...stop, family: f, tone: t })} />
      {stop.position !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <Box component="input" type="number" min={0} max={100} value={stop.position}
            onChange={(e) => onUpdate(index, { ...stop, position: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
            sx={numInputSx} />
          <Caption style={{ color: 'var(--Text-Quiet)' }}>%</Caption>
          <Box component="input" type="range" min={0} max={100} value={stop.position}
            onChange={(e) => onUpdate(index, { ...stop, position: parseInt(e.target.value) })}
            sx={{ width: 60, accentColor: 'var(--Buttons-Primary-Button)' }} />
        </Box>
      )}
      <Button iconOnly variant="ghost" size="small" onClick={() => onDelete(index)}
        disabled={!canDelete} aria-label="Remove stop"
        sx={{ opacity: canDelete ? 1 : 0.3 }}>
        <Icon size="small"><DeleteOutlineIcon /></Icon>
      </Button>
    </Box>
  );
}

function BlobRow({ blob, index, zone, isMeshCard, families, onUpdate, onDelete, canDelete }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: '1px solid var(--Border)' }}>
      <ToneSwatchPicker family={blob.family} tone={blob.tone} zone={zone}
        isMeshCard={isMeshCard} families={families}
        onChange={(f, t) => onUpdate(index, { ...blob, family: f, tone: t })} />
      {['x', 'y', 'spread'].map((key) => (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Caption style={{ color: 'var(--Text-Quiet)', fontSize: '11px' }}>{key === 'spread' ? 'S' : key.toUpperCase()}</Caption>
          <Box component="input" type="number" min={key === 'spread' ? 10 : 0} max={100}
            value={blob[key]}
            onChange={(e) => onUpdate(index, { ...blob, [key]: Math.max(key === 'spread' ? 10 : 0, Math.min(100, parseInt(e.target.value) || 0)) })}
            sx={numInputSx} />
        </Box>
      ))}
      <Button iconOnly variant="ghost" size="small" onClick={() => onDelete(index)}
        disabled={!canDelete} aria-label="Remove blob"
        sx={{ opacity: canDelete ? 1 : 0.3, ml: 'auto' }}>
        <Icon size="small"><DeleteOutlineIcon /></Icon>
      </Button>
    </Box>
  );
}

/* ── Code Output ── */

function CodeBlock({ code }) {
  return (
    <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
        <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
        <CopyButton code={code} />
      </Box>
      <Box sx={{ p: 2, overflow: 'hidden' }}>
        <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', display: 'block' }}>
          {code}
        </Box>
      </Box>
    </Box>
  );
}

/* ── Main Showcase ── */

export function GradientShowcase() {
  const [variant, setVariant] = useState('linear');
  const [color, setColor] = useState('primary');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState(() => getPreset('primary', 'linear'));
  const [blobs, setBlobs] = useState(() => getPreset('primary', 'mesh'));
  const [meshCardBlobs, setMeshCardBlobs] = useState(() => getPreset('primary', 'meshCard'));
  const [radialStops, setRadialStops] = useState(() => getPreset('primary', 'radial'));
  const [radialPos, setRadialPos] = useState({ x: 50, y: 50 });
  const [cardVariant, setCardVariant] = useState('solid');
  const [cardColor, setCardColor] = useState('default');

  // When color changes, reset to that color's preset
  const handleColorChange = (newColor) => {
    setColor(newColor);
    setStops(getPreset(newColor, 'linear'));
    setRadialStops(getPreset(newColor, 'radial'));
    setBlobs(getPreset(newColor, 'mesh'));
    setMeshCardBlobs(getPreset(newColor, 'meshCard'));
  };

  const isMeshCard = variant === 'meshCard';
  const isMesh = variant === 'mesh';
  const isLinear = variant === 'linear';
  const isRadial = variant === 'radial';
  const isStopBased = isLinear || isRadial;

  const activeBlobs = isMeshCard ? meshCardBlobs : blobs;
  const setActiveBlobs = isMeshCard ? setMeshCardBlobs : setBlobs;

  // Zone: determined by first stop/blob. meshCard = all tones allowed.
  const activeStops = isRadial ? radialStops : stops;
  const setActiveStops = isRadial ? setRadialStops : setStops;
  const heroItem = isStopBased ? activeStops[0] : activeBlobs[0];
  const heroTone = heroItem?.tone || 8;
  const heroFamily = heroItem?.family || 'primary';
  const zone = getZone(heroTone, heroFamily);

  // Family options depend on color + variant
  const isBW = color === 'black' || color === 'white';
  const activeFamilies = isBW && isStopBased ? BW_LINEAR_FAMILIES
    : isBW ? BW_MESH_FAMILIES
    : GRADIENT_FAMILIES;

  // ── Stop handlers ──
  const updateStop = (idx, updated) => {
    const next = [...activeStops];
    next[idx] = updated;
    setActiveStops(next);
  };
  const deleteStop = (idx) => {
    if (activeStops.length <= 2) return;
    setActiveStops(activeStops.filter((_, i) => i !== idx));
  };
  const addStop = () => {
    const last = activeStops[activeStops.length - 1];
    const prev = activeStops[activeStops.length - 2] || last;
    const pos = Math.min(100, Math.round((last.position + prev.position) / 2 + 10));
    const family = last.family;
    const tones = getAllowedTonesForFamily(zone, family);
    const midTone = tones[Math.floor(tones.length / 2)];
    setActiveStops([...activeStops, { family, tone: midTone, position: Math.min(pos, 100) }]);
  };

  // ── Blob handlers ──
  const updateBlob = (idx, updated) => {
    const next = [...activeBlobs];
    next[idx] = updated;
    setActiveBlobs(next);
  };
  const deleteBlob = (idx) => {
    if (activeBlobs.length <= 2) return;
    setActiveBlobs(activeBlobs.filter((_, i) => i !== idx));
  };
  const addBlob = () => {
    const family = activeBlobs[activeBlobs.length - 1]?.family || 'primary';
    const tones = isMeshCard ? ALL_TONES : getAllowedTonesForFamily(zone, family);
    const midTone = tones[Math.floor(tones.length / 2)];
    setActiveBlobs([...activeBlobs, { family, tone: midTone, x: 50, y: 50, spread: 40 }]);
  };
  const moveBlob = (idx, x, y) => {
    const next = [...activeBlobs];
    next[idx] = { ...next[idx], x, y };
    setActiveBlobs(next);
  };

  // ── Code generation ──
  const generateCode = () => {
    if (isStopBased) {
      const stopsStr = activeStops.map((s) =>
        '  { family: \'' + s.family + '\', tone: ' + s.tone + ', position: ' + s.position + ' }'
      ).join(',\n');
      if (isRadial) {
        return '<Gradient\n  variant="radial"\n  position={{ x: ' + radialPos.x + ', y: ' + radialPos.y + ' }}\n  stops={[\n' + stopsStr + '\n  ]}\n>\n  {/* content */}\n</Gradient>';
      }
      return '<Gradient\n  variant="linear"\n  angle={' + angle + '}\n  stops={[\n' + stopsStr + '\n  ]}\n>\n  {/* content */}\n</Gradient>';
    }
    const items = activeBlobs;
    const blobStr = items.map((b) =>
      '  { family: \'' + b.family + '\', tone: ' + b.tone + ', x: ' + b.x + ', y: ' + b.y + ', spread: ' + b.spread + ' }'
    ).join(',\n');
    const v = isMeshCard ? 'meshCard' : 'mesh';
    let code = '<Gradient\n  variant="' + v + '"\n  blobs={[\n' + blobStr + '\n  ]}';
    if (isMeshCard) {
      code += '\n  cardProps={{ variant: \'' + cardVariant + '\', color: \'' + cardColor + '\' }}';
    }
    code += '\n>\n  {/* content */}\n</Gradient>';
    return code;
  };

  // ── Preview content ──
  const previewContent = isMeshCard ? (
    <Box sx={{ textAlign: 'center' }}>
      <H5>Card Title</H5>
      <BodySmall>Content inside the card.</BodySmall>
    </Box>
  ) : (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <H5 style={{ color: 'inherit' }}>Gradient Surface</H5>
      <BodySmall style={{ color: 'inherit', opacity: 0.85 }}>Content placed directly on the gradient.</BodySmall>
    </Box>
  );

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Gradient</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <Box sx={{ position: 'relative', borderRadius: 'var(--Card-Radius)', overflow: 'hidden' }}>
            {isMeshCard ? (
              <Gradient variant="meshCard" blobs={meshCardBlobs}
                cardProps={{ variant: cardVariant, color: cardColor }}
                minHeight={300}>
                {previewContent}
              </Gradient>
            ) : isMesh ? (
              <Box sx={{ position: 'relative' }}>
                <Gradient variant="mesh" blobs={blobs} minHeight={300}>
                  {previewContent}
                </Gradient>
                <BlobOverlay blobs={blobs} onBlobMove={moveBlob} />
              </Box>
            ) : isRadial ? (
              <Gradient variant="radial" position={radialPos} stops={radialStops} minHeight={300}>
                {previewContent}
              </Gradient>
            ) : (
              <Gradient variant="linear" angle={angle} stops={stops} minHeight={300}>
                {previewContent}
              </Gradient>
            )}
          </Box>

          <CodeBlock code={generateCode()} />
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

                  {/* Variant */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>VARIANT</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {VARIANTS.map((v) => (
                        <ControlButton key={v} label={VARIANT_LABELS[v]} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color selector — gradient swatches */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                    <Stack direction="row" spacing={1.5}>
                      {GRADIENT_COLORS.map((c) => (
                        <GradientSwatchButton key={c} colorName={c} variant={variant}
                          selected={color === c} onClick={() => handleColorChange(c)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* ── LINEAR: Angle control ── */}
                  {isLinear && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ANGLE</OverlineSmall>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AngleDial angle={angle} onChange={setAngle} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box component="input" type="number" min={0} max={360} value={angle}
                            onChange={(e) => setAngle(Math.max(0, Math.min(360, parseInt(e.target.value) || 0)))}
                            sx={{
                              width: 60, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
                              border: '1px solid var(--Border)', borderRadius: '4px',
                              backgroundColor: 'var(--Background)', color: 'var(--Text)',
                            }}
                          />
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>degrees</Caption>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* ── RADIAL: Center position ── */}
                  {isRadial && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CENTER POSITION</OverlineSmall>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>X</Caption>
                          <Box component="input" type="number" min={0} max={100} value={radialPos.x}
                            onChange={(e) => setRadialPos({ ...radialPos, x: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            sx={numInputSx} />
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>%</Caption>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>Y</Caption>
                          <Box component="input" type="number" min={0} max={100} value={radialPos.y}
                            onChange={(e) => setRadialPos({ ...radialPos, y: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            sx={numInputSx} />
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>%</Caption>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* ── STOP LIST (shared by linear + radial) ── */}
                  {isStopBased && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                        COLOR STOPS ({activeStops.length})
                      </OverlineSmall>
                      {activeStops.map((stop, i) => (
                        <StopRow key={i} stop={stop} index={i} zone={zone} isMeshCard={isMeshCard} families={activeFamilies}
                          onUpdate={updateStop} onDelete={deleteStop} canDelete={activeStops.length > 2} />
                      ))}
                      <Button variant="default-outline" size="small" startIcon={<Icon size="small"><AddIcon /></Icon>}
                        onClick={addStop} sx={{ mt: 1 }}>
                        Add Stop
                      </Button>
                    </Box>
                  )}

                  {/* ── MESH CONTROLS ── */}
                  {(isMesh || isMeshCard) && (
                    <>
                      <Box sx={{ mt: 3 }}>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                          BLOBS ({activeBlobs.length}){isMesh && ' — drag on preview to reposition'}
                        </OverlineSmall>
                        {activeBlobs.map((blob, i) => (
                          <BlobRow key={i} blob={blob} index={i} zone={zone} isMeshCard={isMeshCard} families={activeFamilies}
                            onUpdate={updateBlob} onDelete={deleteBlob} canDelete={activeBlobs.length > 2} />
                        ))}
                        <Button variant="default-outline" size="small" startIcon={<Icon size="small"><AddIcon /></Icon>}
                          onClick={addBlob} sx={{ mt: 1 }}>
                          Add Blob
                        </Button>
                      </Box>

                      {/* MeshCard card controls */}
                      {isMeshCard && (
                        <Box sx={{ mt: 3 }}>
                          <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CARD</OverlineSmall>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Variant</Caption>
                                <Select options={CARD_VARIANT_OPTIONS} value={cardVariant} onChange={setCardVariant}
                                  labelPosition="none" size="small" fullWidth />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Color</Caption>
                                <Select options={CARD_COLOR_OPTIONS} value={cardColor} onChange={setCardColor}
                                  labelPosition="none" size="small" fullWidth />
                              </Box>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </TabPanel>

              {/* ── Accessibility ── */}
              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>

                    {isMeshCard ? (
                      <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                        <H5>Content is inside a Card</H5>
                        <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>NO GRADIENT CONTRAST REQUIRED</OverlineSmall>
                        <BodySmall style={{ color: 'var(--Text-Quiet)' }}>
                          All 12 tones are available because content lives inside a Card component
                          with its own themed background. The Card ensures text contrast independently.
                        </BodySmall>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                          <H5>Accessibility zone</H5>
                          <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>WCAG 1.4.3 — 4.5:1 TEXT CONTRAST</OverlineSmall>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{
                              px: 2, py: 1, borderRadius: '4px', fontSize: '13px', fontWeight: 700,
                              backgroundColor: zone === 'dark' ? '#1a1a2e' : '#f0f0f0',
                              color: zone === 'dark' ? '#fff' : '#111',
                              border: '1px solid var(--Border)',
                            }}>
                              {zone === 'dark' ? 'Dark zone (tones 1-5)' : 'Light zone (tones 6-12)'}
                            </Box>
                            <Box sx={{
                              px: 2, py: 1, borderRadius: '4px', fontSize: '13px',
                              backgroundColor: zone === 'dark' ? '#fff' : '#111',
                              color: zone === 'dark' ? '#111' : '#fff',
                              border: '1px solid var(--Border)',
                            }}>
                              Text: {zone === 'dark' ? 'Light (white)' : 'Dark (near-black)'}
                            </Box>
                          </Box>
                          <BodySmall style={{ color: 'var(--Text-Quiet)' }}>
                            All {isStopBased ? 'stops' : 'blobs'} must use tones in the {zone} zone
                            so a single text color maintains readable contrast across the entire gradient surface.
                          </BodySmall>
                        </Box>

                        <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                          <H5>Tone validation</H5>
                          <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                            {isStopBased ? 'STOPS' : 'BLOBS'} IN ZONE
                          </OverlineSmall>
                          {(isStopBased ? activeStops : blobs).map((item, i) => {
                            const inZone = getZone(item.tone, item.family) === zone;
                            return (
                              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid var(--Border)' }}>
                                <BodySmall>{cap(item.family)} tone {item.tone}</BodySmall>
                                <Box sx={{
                                  px: 1, py: 0.25, borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                                  backgroundColor: inZone ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
                                  color: inZone ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
                                }}>
                                  {inZone ? '✓ Pass' : '✗ Fail'}
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </>
                    )}
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

export default GradientShowcase;
