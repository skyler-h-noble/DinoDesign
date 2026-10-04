// src/components/ToggleButtonGroup/ToggleButtonGroupShowcase.js
//
// Listed again after being delisted as a retired duplicate. The delisting note
// said it "is ButtonGroup built a second time" — true of the rendering, false
// of the concept, and Figma says so too: the two have separate pages, and the
// one carrying the Status axis is this one.
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs';
import { ToggleButtonGroup } from './ToggleButtonGroup';
import { Button } from '../Button';
import { CodeBlock } from '../CodeBlock';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral',
                'info', 'success', 'warning', 'error'];
const SIZES = ['small', 'medium', 'large'];
const SHAPES = ['outlined', 'light', 'ghost'];
const FITS = ['hug', 'fill', 'equal'];

function ControlButton({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '6px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
      borderRadius: 'var(--Button-Radius, 6px)', border: '1px solid var(--Border)',
      background: selected ? 'var(--Buttons-Default-Button)' : 'transparent',
      color: selected ? 'var(--Buttons-Default-Text)' : 'var(--Text)',
    }}>{label}</button>
  );
}

export function ToggleButtonGroupShowcase() {
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const [color, setColor] = useState('default');
  const [size, setSize] = useState('medium');
  const [variant, setVariant] = useState('outlined');
  const [fit, setFit] = useState('hug');
  const [orientation, setOrientation] = useState('horizontal');
  const [separated, setSeparated] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [allowEmpty, setAllowEmpty] = useState(false);

  const [single, setSingle] = useState('left');
  const [many, setMany] = useState(['left']);

  const value = multiple ? many : single;
  const onChange = multiple ? setMany : setSingle;

  const generateCode = () => {
    const parts = [];
    if (color !== 'default') parts.push(`color="${color}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (variant !== 'outlined') parts.push(`variant="${variant}"`);
    if (fit !== 'hug') parts.push(`fit="${fit}"`);
    if (orientation !== 'horizontal') parts.push('orientation="vertical"');
    if (separated) parts.push('separated');
    if (multiple) parts.push('multiple');
    if (allowEmpty) parts.push('allowEmpty');
    parts.push('value={value}', 'onChange={setValue}');
    return '<ToggleButtonGroup\n  ' + parts.join('\n  ') + '\n>\n'
      + '  <Button value="left">Left</Button>\n'
      + '  <Button value="center">Center</Button>\n'
      + '  <Button value="right">Right</Button>\n'
      + '</ToggleButtonGroup>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Toggle Button Group" component="ToggleButtonGroup" />
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
          <DocSummary component="ToggleButtonGroup" theme={bgTheme} surface={bgSurface} />
        </TabPanel>

        <TabPanel value={1}>
          <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
              <Box data-theme={bgTheme || undefined} data-surface={bgSurface} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 200, padding: 4, borderRadius: 'var(--Card-Radius, 8px)',
                backgroundColor: 'var(--Background)', color: 'var(--Text)',
                border: '1px solid var(--Border-Variant)',
              }}>
                <ToggleButtonGroup
                  color={color} size={size} variant={variant} fit={fit}
                  orientation={orientation} separated={separated}
                  multiple={multiple} allowEmpty={allowEmpty}
                  value={value} onChange={onChange} aria-label="Alignment"
                >
                  <Button value="left">Left</Button>
                  <Button value="center">Center</Button>
                  <Button value="right">Right</Button>
                </ToggleButtonGroup>
              </Box>
              <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
            </Grid>

            <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
              <Box sx={{ p: 3 }}>
                {[['COLOR', COLORS, color, setColor],
                  ['SIZE', SIZES, size, setSize],
                  ['SHAPE', SHAPES, variant, setVariant],
                  ['FIT', FITS, fit, setFit],
                  ['ORIENTATION', ['horizontal', 'vertical'], orientation, setOrientation],
                ].map(([label, options, current, set]) => (
                  <Box key={label} sx={{ mt: label === 'COLOR' ? 0 : 3 }}>
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

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    STYLE
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1}>
                    <ControlButton label="joined" selected={!separated}
                                   onClick={() => setSeparated(false)} />
                    <ControlButton label="separated" selected={separated}
                                   onClick={() => setSeparated(true)} />
                  </Stack>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    SELECTION
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1}>
                    <ControlButton label="one" selected={!multiple}
                                   onClick={() => setMultiple(false)} />
                    <ControlButton label="many" selected={multiple}
                                   onClick={() => setMultiple(true)} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    Single select has never been able to empty — clicking the selected
                    segment re-selects it.
                  </Caption>
                </Box>

                <Box sx={{ mt: 3, opacity: multiple ? 1 : 0.5 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    ALLOW EMPTY
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1}>
                    <ControlButton label="false — a toggle group" selected={!allowEmpty}
                                   onClick={() => multiple && setAllowEmpty(false)} />
                    <ControlButton label="true — clearable" selected={allowEmpty}
                                   onClick={() => multiple && setAllowEmpty(true)} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    {multiple
                      ? 'With false, the last selected segment cannot be turned off.'
                      : 'Only meaningful with many.'}
                  </Caption>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={2}>
          <A11yScopeNote />
          <Box sx={{ p: 3, pt: 0 }}>
            <Stack spacing={3}>
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  SEMANTICS
                </EyebrowSmall>
                <BodySmall>
                  Single select uses radiogroup semantics — arrow keys move between
                  options and one tab stop covers the whole control. Multiple select is a
                  group of buttons each carrying `aria-pressed`.
                </BodySmall>
              </Box>
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  NOT COLOR ALONE
                </EyebrowSmall>
                <BodySmall>
                  The selected segment gains a fill AND `aria-pressed`, and its label
                  moves from the palette`s Quiet to its Text. Three signals, so the
                  selection survives both a screen reader and a monochrome display.
                </BodySmall>
              </Box>
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  THE FLOOR OF ONE
                </EyebrowSmall>
                <BodySmall>
                  A refused click — turning off the last selected segment — fires no
                  onChange and moves no focus. The control simply does not change, which
                  is what a screen reader then reports: nothing happened, because
                  nothing could.
                </BodySmall>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={3}>
          <DocChanges component="ToggleButtonGroup" />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default ToggleButtonGroupShowcase;
