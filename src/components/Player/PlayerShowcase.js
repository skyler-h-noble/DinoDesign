// src/components/Player/PlayerShowcase.js
//
// Figma's Player page is a sketch, not a component set: a 400px row holding
// 554px of placeholder content. So this page says so, rather than implying a
// parity that does not exist.
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs';
import { Player } from './Player';
import { CodeBlock } from '../CodeBlock';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral',
                'info', 'success', 'warning', 'error'];
const SIZES = ['small', 'medium', 'large'];

function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" type="button" onClick={onClick} sx={{
      px: 1.5, py: 0.75, cursor: 'pointer',
      borderRadius: 'var(--Button-Radius, 6px)',
      border: '1px solid ' + (selected ? 'var(--Buttons-Primary-Button)' : 'var(--Border)'),
      backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
      color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
      font: 'inherit', fontSize: 13,
    }}>{label}</Box>
  );
}

export function PlayerShowcase() {
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('medium');
  const [showTime, setShowTime] = useState(true);
  const [withMeta, setWithMeta] = useState(true);
  const [withSkip, setWithSkip] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(42);

  const generateCode = () => {
    const parts = [];
    if (variant !== 'default') parts.push(`variant="${variant}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (!showTime) parts.push('showTime={false}');
    if (disabled) parts.push('disabled');
    if (withMeta) {
      parts.push('title="Weather Report"', 'subtitle="The Mercury Lamps"',
                 'avatarInitials="ML"');
    }
    parts.push('duration={195}', 'position={position}', 'onSeek={setPosition}',
               'playing={playing}', 'onPlayPause={setPlaying}');
    if (withSkip) parts.push('onPrevious={prev}', 'onNext={next}');
    return '<Player\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Player" component="Player" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme}
                          surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Playground</Tab>
          <Tab>Accessibility</Tab>
          <Tab>Change Log</Tab>
        </TabList>

        <TabPanel value={0}>
          <DocSummary component="Player" theme={bgTheme} surface={bgSurface} />
        </TabPanel>

        <TabPanel value={1}>
          <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
              <Box data-theme={bgTheme || undefined} data-surface={bgSurface} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 160, padding: 4, borderRadius: 'var(--Card-Radius, 8px)',
                backgroundColor: 'var(--Background)', color: 'var(--Text)',
                border: '1px solid var(--Border-Variant)',
              }}>
                {/* A width to live in: the bar is `width: 100%` and a centring
                    flex parent would otherwise shrink it to its content, which
                    is the bug the lead-example slot had three times. */}
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                  <Player
                    variant={variant} size={size} showTime={showTime} disabled={disabled}
                    title={withMeta ? 'Weather Report' : undefined}
                    subtitle={withMeta ? 'The Mercury Lamps' : undefined}
                    avatarInitials={withMeta ? 'ML' : undefined}
                    duration={195} position={pos} onSeek={setPos}
                    playing={playing} onPlayPause={setPlaying}
                    onPrevious={withSkip ? () => setPos(0) : undefined}
                    onNext={withSkip ? () => setPos(0) : undefined}
                  />
                </Box>
              </Box>
              <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
            </Grid>

            <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
              <Box sx={{ p: 3 }}>
                {[['PALETTE', COLORS, variant, setVariant],
                  ['SIZE', SIZES, size, setSize],
                ].map(([label, options, current, set]) => (
                  <Box key={label} sx={{ mt: label === 'PALETTE' ? 0 : 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      {label}
                    </EyebrowSmall>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                      {options.map((o) => (
                        <ControlButton key={o} label={o} selected={current === o}
                                       onClick={() => set(o)} />
                      ))}
                    </Stack>
                  </Box>
                ))}

                {[['TRACK INFO', withMeta, setWithMeta, 'with', 'without'],
                  ['SKIP BUTTONS', withSkip, setWithSkip, 'shown', 'hidden'],
                  ['TIME', showTime, setShowTime, 'shown', 'hidden'],
                  ['AVAILABILITY', !disabled, (v) => setDisabled(!v), 'enabled', 'disabled'],
                ].map(([label, on, set, yes, no]) => (
                  <Box key={label} sx={{ mt: 3 }}>
                    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                      {label}
                    </EyebrowSmall>
                    <Stack direction="row" spacing={1}>
                      <ControlButton label={yes} selected={on} onClick={() => set(true)} />
                      <ControlButton label={no} selected={!on} onClick={() => set(false)} />
                    </Stack>
                  </Box>
                ))}

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    FIGMA
                  </EyebrowSmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                    The Player page is a sketch rather than a component set — a 400px
                    row holding 554px of placeholder content. This is built to the
                    shape it points at, out of the components that sketch reached
                    for, rather than matched to it variant by variant.
                  </Caption>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={2}>
          <A11yScopeNote />
          <Box sx={{ p: 3 }}>
            <Stack spacing={2} sx={{ maxWidth: 760 }}>
              <BodySmall>
                The bar is one <code>role="group"</code> with a name, so it is
                announced as a player rather than as three loose controls that happen
                to sit together.
              </BodySmall>
              <BodySmall>
                The play button is named for what pressing it <em>does</em> — "Play"
                while paused, "Pause" while playing. A button named for the current
                state tells you where you are and not what you get.
              </BodySmall>
              <BodySmall>
                The scrubber reports <code>aria-valuetext</code> as "0:42 of 3:15".
                Without it a screen reader reads "42" and leaves the listener to work
                out what that is a number of.
              </BodySmall>
              <BodySmall>
                Elapsed and total are set in <code>tabular-nums</code>, so the track
                does not shuffle sideways every time a digit changes — the thing that
                makes a running clock look broken.
              </BodySmall>
              <BodySmall>
                Skip buttons are rendered only when they have a handler. A dead
                control that looks live is worse than one that is absent, and only
                the caller knows whether there is a previous track.
              </BodySmall>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={3}>
          <DocChanges component="Player" />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default PlayerShowcase;
