// src/components/BevelText/BevelTextShowcase.js
import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { BevelText } from './BevelText';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Slider } from '../Slider/Slider';
import { SwitchInput } from '../Switch';
import { H2, Body, BodySmall, Caption, OverlineSmall } from '../Typography';
import {
  BEVEL_PRESETS,
  BEVEL_PRESET_NAMES,
  BEVEL_THEMES,
  resolveBevelConfig,
} from '../_bevelPresets';

const PRESET_OPTIONS = [
  ...BEVEL_PRESET_NAMES.map((name) => ({
    value: name,
    label: name,
    description: BEVEL_PRESETS[name].description,
  })),
  { value: 'custom', label: 'Custom', description: 'Tune every knob' },
];

const BG_OPTIONS = [
  { value: 'light', label: 'Light', css: 'var(--Surface)' },
  { value: 'warm',  label: 'Warm',  css: 'var(--Surface-Dim)' },
  { value: 'dark',  label: 'Dark',  css: 'var(--Container-High)' },
];

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function PresetCard({ option, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        flex: '1 1 140px',
        minWidth: 130,
        cursor: 'pointer',
        border: '1.5px solid',
        borderColor: active ? 'var(--Buttons-Primary-Border)' : 'var(--Border)',
        background: active ? 'rgb(var(--Buttons-Primary-Highlight) / 0.18)' : 'var(--Background)',
        borderRadius: 'var(--Style-Border-Radius)',
        p: 1.5,
        transition: 'border-color 0.15s, background 0.15s',
        textAlign: 'center',
        '&:hover': {
          borderColor: active ? 'var(--Buttons-Primary-Border)' : 'var(--Buttons-Primary-Border)',
        },
        '&:focus-visible': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: 2,
        },
      }}
    >
      <Caption style={{ fontWeight: 600, color: 'var(--Text)' }}>{option.label}</Caption>
      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 2 }}>
        {option.description}
      </Caption>
    </Box>
  );
}

export function BevelTextShowcase() {
  const [text, setText] = useState('DinoDesign');
  const [theme, setTheme] = useState('Primary');
  const [preset, setPreset] = useState('Classic');
  const [bg, setBg] = useState('light');

  // Custom-mode knobs — seeded from Classic so the user can start tweaking
  // without first defining every field.
  const [angle, setAngle] = useState(135);
  const [depth, setDepth] = useState(5);
  const [softness, setSoftness] = useState(1);
  const [bevelOn, setBevelOn] = useState(true);
  const [shadowOn, setShadowOn] = useState(true);
  const [shadowDistance, setShadowDistance] = useState(6);
  const [shadowBlur, setShadowBlur] = useState(8);
  const [shadowOpacity, setShadowOpacity] = useState(60);

  const [fontSize, setFontSize] = useState(96);
  const [fontWeight, setFontWeight] = useState(900);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const isCustom = preset === 'custom';
  const customObj = isCustom
    ? {
        angle,
        depth,
        softness,
        bevel: bevelOn,
        shadow: shadowOn,
        shadowDistance,
        shadowBlur,
        shadowOpacity: shadowOpacity / 100,
      }
    : undefined;

  // When switching to a named preset, seed the custom-mode controls from that
  // preset so users can start from a known good config when they flip to Custom.
  function selectPreset(name) {
    setPreset(name);
    if (name !== 'custom') {
      const cfg = resolveBevelConfig(name);
      setAngle(cfg.angle);
      setDepth(cfg.depth ?? 5);
      setSoftness(cfg.softness ?? 1);
      setBevelOn(cfg.bevel);
      setShadowOn(cfg.shadow);
      setShadowDistance(cfg.shadowDistance ?? 6);
      setShadowBlur(cfg.shadowBlur ?? 8);
      setShadowOpacity(Math.round((cfg.shadowOpacity ?? 0.6) * 100));
    }
  }

  const bgCss = BG_OPTIONS.find((b) => b.value === bg)?.css || BG_OPTIONS[0].css;

  return (
    <Box>
      <H2 style={{ marginBottom: 12 }}>Bevel Display Text</H2>
      <Body color="quiet" style={{ marginBottom: 24, maxWidth: 720 }}>
        Straight-line display text with an SVG inset-bevel and optional drop
        shadow. Colors are locked to the active button-palette tokens
        (Button / Highlight / Lowlight) so the same preset reads correctly
        under any theme.
      </Body>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Preview ─── */}
        <Box sx={{ minWidth: 0 }}>
          <Box
            data-surface="Container"
            sx={{
              background: bgCss,
              borderRadius: 2,
              p: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 240,
              overflow: 'auto',
              position: 'sticky',
              top: 16,
              transition: 'background 0.2s',
            }}
          >
            <BevelText
              text={text}
              theme={theme}
              preset={preset}
              custom={customObj}
              fontSize={fontSize}
              fontWeight={fontWeight}
              letterSpacing={letterSpacing}
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

                  {/* Theme */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      THEME
                    </OverlineSmall>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                      {BEVEL_THEMES.map((t) => (
                        <ControlButton
                          key={t}
                          label={t}
                          selected={theme === t}
                          onClick={() => setTheme(t)}
                        />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      Resolves to <code>--Buttons-{'{Theme}'}-Button</code>{' '}
                      (fill), <code>-Highlight</code> (light edge), and{' '}
                      <code>-Lowlight</code> (shadow edge).
                    </Caption>
                  </Box>

                  {/* Presets */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      PRESETS
                    </OverlineSmall>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {PRESET_OPTIONS.map((opt) => (
                        <PresetCard
                          key={opt.value}
                          option={opt}
                          active={preset === opt.value}
                          onClick={() => selectPreset(opt.value)}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Custom controls */}
                  {isCustom && (
                    <Box
                      sx={{
                        border: '1px solid var(--Border)',
                        borderRadius: 'var(--Style-Border-Radius)',
                        p: 2,
                      }}
                    >
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                        CUSTOM
                      </OverlineSmall>

                      <Stack spacing={2}>
                        <div>
                          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                            Light angle
                            <span style={{ float: 'right' }}>{angle}°</span>
                          </Caption>
                          <Slider min={0} max={360} step={5} value={angle} onChange={(_, v) => setAngle(v)} />
                        </div>

                        {/* Inset bevel */}
                        <Box sx={{ border: '1px solid var(--Border-Variant)', borderRadius: 1, p: 1.5 }}>
                          <SwitchInput
                            label="Inset bevel"
                            checked={bevelOn}
                            onChange={(e) => setBevelOn(e.target.checked)}
                          />
                          {bevelOn && (
                            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                              <div>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Depth
                                  <span style={{ float: 'right' }}>{depth}px</span>
                                </Caption>
                                <Slider min={1} max={16} step={1} value={depth} onChange={(_, v) => setDepth(v)} />
                              </div>
                              <div>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Softness
                                  <span style={{ float: 'right' }}>{softness}px</span>
                                </Caption>
                                <Slider min={0} max={6} step={0.5} value={softness} onChange={(_, v) => setSoftness(v)} />
                              </div>
                            </Stack>
                          )}
                        </Box>

                        {/* Drop shadow */}
                        <Box sx={{ border: '1px solid var(--Border-Variant)', borderRadius: 1, p: 1.5 }}>
                          <SwitchInput
                            label="Drop shadow"
                            checked={shadowOn}
                            onChange={(e) => setShadowOn(e.target.checked)}
                          />
                          {shadowOn && (
                            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                              <div>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Distance
                                  <span style={{ float: 'right' }}>{shadowDistance}px</span>
                                </Caption>
                                <Slider min={1} max={24} step={1} value={shadowDistance} onChange={(_, v) => setShadowDistance(v)} />
                              </div>
                              <div>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Blur
                                  <span style={{ float: 'right' }}>{shadowBlur}px</span>
                                </Caption>
                                <Slider min={0} max={24} step={1} value={shadowBlur} onChange={(_, v) => setShadowBlur(v)} />
                              </div>
                              <div>
                                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                                  Opacity
                                  <span style={{ float: 'right' }}>{shadowOpacity}%</span>
                                </Caption>
                                <Slider min={10} max={100} step={5} value={shadowOpacity} onChange={(_, v) => setShadowOpacity(v)} />
                              </div>
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  {/* Typography */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      TYPOGRAPHY
                    </OverlineSmall>
                    <Stack spacing={2}>
                      <div>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Font size
                          <span style={{ float: 'right' }}>{fontSize}px</span>
                        </Caption>
                        <Slider min={32} max={160} step={4} value={fontSize} onChange={(_, v) => setFontSize(v)} />
                      </div>
                      <div>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Font weight
                          <span style={{ float: 'right' }}>{fontWeight}</span>
                        </Caption>
                        <Slider min={400} max={900} step={100} value={fontWeight} onChange={(_, v) => setFontWeight(v)} />
                      </div>
                      <div>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                          Letter spacing
                          <span style={{ float: 'right' }}>{letterSpacing}px</span>
                        </Caption>
                        <Slider min={-2} max={20} step={1} value={letterSpacing} onChange={(_, v) => setLetterSpacing(v)} />
                      </div>
                    </Stack>
                  </Box>

                  {/* Preview background */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      PREVIEW BACKGROUND
                    </OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {BG_OPTIONS.map((b) => (
                        <ControlButton
                          key={b.value}
                          label={b.label}
                          selected={bg === b.value}
                          onClick={() => setBg(b.value)}
                        />
                      ))}
                    </Stack>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      Showcase-only — doesn't affect the emitted code.
                    </Caption>
                  </Box>
                </Stack>
              </TabPanel>

              {/* Accessibility */}
              <TabPanel value={1}>
                <Stack spacing={2} sx={{ p: 3, maxWidth: 560 }}>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    BevelText uses the same Highlight / Lowlight token pair as
                    button bevels, which target the WCAG 2.1 large-text minimum
                    (3:1). Bevel text is decorative display — the SVG sets{' '}
                    <code>role="img"</code> and <code>aria-label</code> to the
                    rendered string so screen readers announce it as a labeled
                    image, not a stream of glyphs.
                  </Caption>
                  <BodySmall color="quiet">
                    Keep the rendered glyph height above ~24px when the bevel
                    is on — at smaller sizes the highlight / lowlight stripes
                    optically reduce the legible stroke width and the 3:1
                    contrast no longer feels comfortable.
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

export default BevelTextShowcase;
