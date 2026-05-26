// src/components/CurvedText/CurvedTextShowcase.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { CurvedText } from './CurvedText';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Slider } from '../Slider/Slider';
import { SwitchInput } from '../Switch';
import { H2, H3, Body, BodySmall, Caption, OverlineSmall } from '../Typography';
import { ContrastCheck } from '../_a11y/ContrastCheck';
import { BEVEL_PRESET_NAMES, BEVEL_THEMES } from '../_bevelPresets';

const TEXT_STYLES = [
  { value: 'display-large', label: 'Display Large' },
  { value: 'display-small', label: 'Display Small' },
];

const COLORS = [
  { value: 'text',      label: 'Text',      css: 'var(--Text)' },
  { value: 'primary',   label: 'Primary',   css: 'var(--Text-Primary)' },
  { value: 'secondary', label: 'Secondary', css: 'var(--Text-Secondary)' },
  { value: 'tertiary',  label: 'Tertiary',  css: 'var(--Text-Tertiary)' },
];

// Themes the bevel can pull from. Each maps to the matching --Buttons-{Theme}-*
// Highlight / Lowlight / Button tokens so the bevel inherits the brand palette.
// Sourced from the shared bevel catalog so BevelText + CurvedText stay aligned.
const BEVEL_THEME_OPTIONS = BEVEL_THEMES.map((t) => ({ value: t, label: t }));

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function defaultCurve(direction) {
  return { arc: 140, radius: 340, direction };
}

export function CurvedTextShowcase() {
  const [text, setText] = useState('Your Brand. Perfected.');
  const [textStyle, setTextStyle] = useState('display-large');
  const [colorKey, setColorKey] = useState('primary');
  const [curves, setCurves] = useState([defaultCurve('up')]);
  const [rotation, setRotation] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(8);
  const [fontWeight, setFontWeight] = useState(700);
  const [bevel, setBevel] = useState(false);
  const [bevelTheme, setBevelTheme] = useState('Primary');
  const [bevelPreset, setBevelPreset] = useState('Classic');
  const previewRef = useRef(null);
  const [textRef, setTextRef] = useState(null);

  // Refresh contrast ref when colors / curves change.
  useEffect(() => {
    if (!previewRef.current) return;
    setTextRef({ current: previewRef.current.querySelector('text') });
  }, [colorKey, textStyle, curves, rotation, letterSpacing, fontWeight, bevel, bevelTheme, bevelPreset]);

  const color = COLORS.find((c) => c.value === colorKey)?.css || COLORS[0].css;

  function setCurveCount(n) {
    setCurves((prev) => {
      if (n === prev.length) return prev;
      if (n > prev.length) {
        // Append alternating-direction curves seeded from the last entry.
        const next = [...prev];
        while (next.length < n) {
          const last = next[next.length - 1];
          next.push({
            arc: last.arc,
            radius: last.radius,
            direction: last.direction === 'up' ? 'down' : 'up',
          });
        }
        return next;
      }
      return prev.slice(0, n);
    });
  }

  function updateCurve(i, patch) {
    setCurves((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  // Measures where the text starts and ends on the SVG path and rotates the
  // SVG by the inverse of the start→end slope, so the visual reading line
  // sits horizontally regardless of how the wave bumps the text up and down.
  function autoLevel() {
    const svg = previewRef.current?.querySelector('svg');
    if (!svg) return;
    const path = svg.querySelector('path');
    const textEl = svg.querySelector('text');
    if (!path || !textEl) return;
    const pathLen = path.getTotalLength();
    if (!pathLen) return;
    // Some browsers return 0 for getComputedTextLength on first paint —
    // fall back to a rough estimate from char count if so.
    let textLen = 0;
    try { textLen = textEl.getComputedTextLength?.() || 0; } catch (e) { /* ignore */ }
    if (!textLen) textLen = Math.min(pathLen, text.length * 18);
    const startDist = Math.max(0, (pathLen - textLen) / 2);
    const endDist = Math.min(pathLen, startDist + textLen);
    const a = path.getPointAtLength(startDist);
    const b = path.getPointAtLength(endDist);
    const angleDeg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    // Clamp to slider range so the slider thumb stays in sync.
    const next = Math.max(-45, Math.min(45, Math.round(-angleDeg)));
    setRotation(next);
  }

  return (
    <Box>
      <H2 style={{ marginBottom: 12 }}>Curved Display Text</H2>
      <Body color="quiet" style={{ marginBottom: 24, maxWidth: 720 }}>
        Decorative text laid along an SVG arc. Chain multiple arcs to build a
        wave — each curve gets its own radius, arc sweep, and direction. Uses
        your design system's decorative font + text tokens.
      </Body>

      <Box
        sx={{
          display: 'grid',
          // Two columns whenever the showcase pane is at least ~720px wide;
          // single column below that. Min-column 360 keeps either side
          // readable when they share the row. `alignItems: start` (the CSS
          // Grid value — NOT `flex-start`) stops grid items from stretching
          // to the tallest item's height — without it the preview Box gets
          // pulled down to match the controls column, leaving the SVG
          // floating in a wall of empty space.
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Live preview ─── */}
        <Box sx={{ minWidth: 0 }}>
          <Box
            ref={previewRef}
            data-surface="Container"
            sx={{
              background: 'var(--Background)',
              borderRadius: 2,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              position: 'sticky',
              top: 16,
            }}
          >
            <CurvedText
              text={text}
              curves={curves}
              textStyle={textStyle}
              rotation={rotation}
              letterSpacing={letterSpacing}
              fontWeight={fontWeight}
              bevel={bevel}
              bevelTheme={bevelTheme}
              bevelPreset={bevel ? bevelPreset : undefined}
              color={color}
            />
          </Box>
        </Box>

        {/* ─── RIGHT: Tabs ─── */}
        <Box sx={{ minWidth: 0, alignSelf: 'flex-start' }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
            <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
          <Tab>Playground</Tab>
          <Tab>Accessibility</Tab>
        </TabList>

        {/* Playground */}
        <TabPanel value={0}>
          <Stack spacing={3} sx={{ p: 3, maxWidth: 720 }}>
            <Input
              label="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your headline…"
              size="medium"
            />

            {/* Curve count */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                CURVES
              </OverlineSmall>
              <Stack direction="row" spacing={1}>
                {[1, 2].map((n) => (
                  <ControlButton
                    key={n}
                    label={String(n)}
                    selected={curves.length === n}
                    onClick={() => setCurveCount(n)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                One curve is an arch. Two curves chain end-to-end for a wave.
              </Caption>
            </Box>

            {/* Per-curve controls */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                PER-CURVE SETTINGS
              </OverlineSmall>
              <Stack spacing={2}>
                {curves.map((curve, i) => (
                  <Box
                    key={i}
                    data-surface="Container"
                    style={{
                      background: 'var(--Background)',
                      border: '1px solid var(--Border)',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                      <Caption style={{ fontWeight: 700 }}>Curve {i + 1}</Caption>
                      <div style={{ flex: 1 }} />
                      <Stack direction="row" spacing={1}>
                        <ControlButton
                          label="⌢ Up"
                          selected={curve.direction === 'up'}
                          onClick={() => updateCurve(i, { direction: 'up' })}
                        />
                        <ControlButton
                          label="⌣ Down"
                          selected={curve.direction === 'down'}
                          onClick={() => updateCurve(i, { direction: 'down' })}
                        />
                      </Stack>
                    </Stack>
                    <Stack spacing={1}>
                      <div>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Radius
                          <span style={{ float: 'right' }}>{curve.radius}px</span>
                        </Caption>
                        <Slider
                          min={100}
                          max={600}
                          step={10}
                          value={curve.radius}
                          onChange={(_, v) => updateCurve(i, { radius: v })}
                        />
                      </div>
                      <div>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Arc sweep
                          <span style={{ float: 'right' }}>{curve.arc}°</span>
                        </Caption>
                        <Slider
                          min={40}
                          max={280}
                          step={5}
                          value={curve.arc}
                          onChange={(_, v) => updateCurve(i, { arc: v })}
                        />
                      </div>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Typography */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                TYPOGRAPHY
              </OverlineSmall>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {TEXT_STYLES.map((s) => (
                  <ControlButton
                    key={s.value}
                    label={s.label}
                    selected={textStyle === s.value}
                    onClick={() => setTextStyle(s.value)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Uses the lib's DisplayLarge / DisplaySmall tokens (font-family,
                size, weight, letter-spacing).
              </Caption>
            </Box>

            {/* Letter spacing */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                LETTER SPACING
                <span style={{ float: 'right' }}>{letterSpacing}px</span>
              </OverlineSmall>
              <Slider
                min={-4}
                max={40}
                step={1}
                value={letterSpacing}
                onChange={(_, v) => setLetterSpacing(v)}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Adjusts the gap between characters along the wave.
              </Caption>
            </Box>

            {/* Font weight */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                FONT WEIGHT
                <span style={{ float: 'right' }}>{fontWeight}</span>
              </OverlineSmall>
              <Slider
                min={100}
                max={900}
                step={100}
                value={fontWeight}
                onChange={(_, v) => setFontWeight(v)}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Heavier weights read better at decorative sizes. Available
                weights depend on the loaded display font.
              </Caption>
            </Box>

            {/* Bevel */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                BEVEL
              </OverlineSmall>
              <SwitchInput
                label="3D bevel effect"
                checked={bevel}
                onChange={(e) => setBevel(e.target.checked)}
              />
              {bevel && (
                <Box sx={{ mt: 1.5 }}>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6 }}>
                    Preset
                  </Caption>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, mb: 1.5 }}>
                    {BEVEL_PRESET_NAMES.map((name) => (
                      <ControlButton
                        key={name}
                        label={name}
                        selected={bevelPreset === name}
                        onClick={() => setBevelPreset(name)}
                      />
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6 }}>
                    Bevel theme
                  </Caption>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                    {BEVEL_THEME_OPTIONS.map((t) => (
                      <ControlButton
                        key={t.value}
                        label={t.label}
                        selected={bevelTheme === t.value}
                        onClick={() => setBevelTheme(t.value)}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Bevel layers use <code>--Buttons-{'{Theme}'}-Button</code> for
                the fill, with <code>Highlight</code> + <code>Lowlight</code>
                tokens for the bright/shadow stripes. CurvedText honors a
                preset's <em>depth</em> only — angle, softness, and drop-shadow
                fields are stacked-rendering limitations and are ignored here
                (the full filter pipeline lives in <code>&lt;BevelText&gt;</code>).
                Shadow-only presets render no effect. Auto-hides below 19px so
                the 3:1 bevel contrast doesn't compromise small-text legibility.
              </Caption>
            </Box>

            {/* Rotation */}
            <Box>
              <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', flex: 1 }}>
                  ROTATION
                  <span style={{ float: 'right', marginRight: 12 }}>{rotation}°</span>
                </OverlineSmall>
                <Button variant="default-outline" size="small" onClick={autoLevel}>
                  Auto-level
                </Button>
              </Stack>
              <Slider
                min={-45}
                max={45}
                step={1}
                value={rotation}
                onChange={(_, v) => setRotation(v)}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Tilts the whole text block around its center. "Auto-level"
                rotates so the text's start and end sit on the same horizontal
                line — useful when a multi-curve wave makes the reading line
                slant.
              </Caption>
            </Box>

            {/* Color */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                COLOR
              </OverlineSmall>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {COLORS.map((c) => (
                  <ControlButton
                    key={c.value}
                    label={c.label}
                    selected={colorKey === c.value}
                    onClick={() => setColorKey(c.value)}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        {/* Accessibility */}
        <TabPanel value={1}>
          <Stack spacing={2} sx={{ p: 3, maxWidth: 560 }}>
            <Caption style={{ color: 'var(--Text-Quiet)' }}>
              Live WCAG 2.1 contrast against the painted background. Decorative
              display text counts as large text — AA needs 3:1, AAA needs 4.5:1
              — but DinoDesign defaults to 4.5:1 across the board.
            </Caption>
            {textRef && (
              <ContrastCheck
                targetRef={textRef}
                label="Curved text"
                deps={[colorKey, textStyle, JSON.stringify(curves), rotation, letterSpacing]}
              />
            )}
            <BodySmall color="quiet">
              The SVG sets <code>role="img"</code> and{' '}
              <code>aria-label</code> to the rendered text so screen readers
              announce it as a labeled image, not a stream of individual
              glyphs.
            </BodySmall>
          </Stack>
        </TabPanel>
            </Tabs>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CurvedTextShowcase;
