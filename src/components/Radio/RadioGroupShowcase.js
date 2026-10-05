// src/components/Radio/RadioGroupShowcase.js
//
// RadioGroup had no page. It is documented as the thing to reach for by
// Checkbox, Select and SwitchInput — three components sending readers to a
// page that did not exist — and the nav entry that looked like its own,
// labelled "Radio Group", opened Radio instead. So the component with the
// accessibility story (a fieldset, a legend, arrow-key movement) was the one
// with nowhere to tell it.
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs';
import { RadioGroup } from './Radio';
import { CodeBlock } from '../CodeBlock';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral',
                'info', 'success', 'warning', 'error'];
const SIZES = ['small', 'medium', 'large'];
const PLACEMENTS = ['end', 'start', 'top', 'bottom'];

/* A real question with real answers. Placeholder options turn a group into a
   picture of three circles; the component's whole job is to make one choice
   legible, and that cannot be shown with "Option One". */
const OPTIONS = [
  { value: 'std', label: 'Standard — 3 to 5 days' },
  { value: 'exp', label: 'Express — next day' },
  { value: 'pick', label: 'Collect in store' },
];

function ControlButton({ label, selected, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        px: 1.5, py: 0.75, cursor: 'pointer',
        borderRadius: 'var(--Button-Radius, 6px)',
        border: '1px solid ' + (selected ? 'var(--Buttons-Primary-Button)' : 'var(--Border)'),
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        font: 'inherit', fontSize: 13,
      }}
    >
      {label}
    </Box>
  );
}

export function RadioGroupShowcase() {
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [orientation, setOrientation] = useState('vertical');
  const [labelPlacement, setLabelPlacement] = useState('end');
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('std');

  const generateCode = () => {
    const parts = [];
    if (color !== 'primary') parts.push(`color="${color}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (orientation !== 'vertical') parts.push('orientation="horizontal"');
    if (labelPlacement !== 'end') parts.push(`labelPlacement="${labelPlacement}"`);
    if (disabled) parts.push('disabled');
    /* `name` is in every generated snippet, never behind a toggle. Without it
       the browser does not know the inputs belong together, and a copied
       snippet that silently allows two checked radios is worse than a longer
       one. */
    parts.push('label="Delivery"', 'name="delivery"',
               'value={value}', 'onChange={(e) => setValue(e.target.value)}');
    return '<RadioGroup\n  ' + parts.join('\n  ') + '\n  options={[\n'
      + OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
      + '\n  ]}\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Radio Group" component="RadioGroup" />
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
          <DocSummary component="RadioGroup" theme={bgTheme} surface={bgSurface} />
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
                <RadioGroup
                  label="Delivery"
                  name="playground"
                  color={color}
                  size={size}
                  orientation={orientation}
                  labelPlacement={labelPlacement}
                  disabled={disabled}
                  options={OPTIONS}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Box>
              <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
            </Grid>

            <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
              <Box sx={{ p: 3 }}>
                {[['COLOR', COLORS, color, setColor],
                  ['SIZE', SIZES, size, setSize],
                  ['ORIENTATION', ['vertical', 'horizontal'], orientation, setOrientation],
                  ['LABEL PLACEMENT', PLACEMENTS, labelPlacement, setLabelPlacement],
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
                    AVAILABILITY
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1}>
                    <ControlButton label="enabled" selected={!disabled}
                                   onClick={() => setDisabled(false)} />
                    <ControlButton label="disabled" selected={disabled}
                                   onClick={() => setDisabled(true)} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    This disables the whole group. One option at a time is disabled
                    through its own entry in <code>options</code>.
                  </Caption>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    FIGMA
                  </EyebrowSmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                    The Radio Group set has one axis, <code>orientation</code>. Color
                    and size come from the Radio inside it, and the Radio set pins
                    <code> Theme=Primary</code> — which is why this defaults to
                    primary rather than default.
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
                The group renders as a <code>&lt;fieldset&gt;</code> and its{' '}
                <code>label</code> as the <code>&lt;legend&gt;</code>. That pairing is
                what makes the options read as one question rather than as several
                unrelated controls, and it is the main reason to use real radios here
                instead of styled buttons.
              </BodySmall>
              <BodySmall>
                Arrow keys move between options; Tab leaves the group entirely. A group
                is one stop in the tab order, which is native behaviour and not
                something the component adds.
              </BodySmall>
              <BodySmall>
                Without a visible <code>label</code>, pass <code>aria-label</code> or{' '}
                <code>aria-labelledby</code>. A group of options with no name is a list
                of answers to a question nobody asked.
              </BodySmall>
              <BodySmall>
                Each option's target is the 24px frame around the dot —{' '}
                <code>--Sizing-3</code> — so it clears WCAG 2.5.8 even at{' '}
                <code>size="small"</code>, where the dot itself is 16px.
              </BodySmall>
              <BodySmall>
                Pass <code>name</code> inside a real form. Without it the browser treats
                each radio as its own group and more than one can end up checked —
                which looks like a styling bug and is not one.
              </BodySmall>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={3}>
          <DocChanges component="RadioGroup" />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default RadioGroupShowcase;
