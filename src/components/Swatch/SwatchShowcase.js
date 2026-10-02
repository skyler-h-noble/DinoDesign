// src/components/Swatch/SwatchShowcase.js
import React, { useState } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Swatch } from './Swatch';
import { Switch } from '../Switch/Switch';
import { Input as TextInput } from '../Input/Input';
import { Button } from '../Button/Button';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { H3, H5, BodySmall, Caption, EyebrowSmall } from '../Typography';

const SIZES = ['small', 'medium', 'large'];
const SAMPLE = ['#c9a08a', '#2e8b8b', '#4a7bf7', '#d4941a'];

export function SwatchShowcase() {
  const [color, setColor]       = useState('#c9a08a');
  const [label, setLabel]       = useState('color');
  const [size, setSize]         = useState('medium');
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [clickable, setClickable] = useState(true);
  const [radio, setRadio]       = useState(false);
  const [bgTheme, setBgTheme]   = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');

  const generateCode = () => {
    const parts = [`color="${color}"`];
    if (label) parts.push(`label="${label}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (selected) parts.push('selected');
    if (disabled) parts.push('disabled');
    if (radio) parts.push('radio');
    if (clickable) parts.push('onClick={handlePick}');
    return '<Swatch\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Swatch" component="Swatch" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        A colour chip, optionally labelled, optionally clickable.
      </BodySmall>
      <Box sx={{ mt: 1 }}>
      </Box>

      <Box sx={{ mt: 2, backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
        <Tabs defaultValue={0} variant="standard" color="primary">
          <TabList>
            <Tab>Summary</Tab>
            <Tab>Playground</Tab>
            <Tab>Accessibility</Tab>
            <Tab>Change Log</Tab>
          </TabList>

          <TabPanel value={0}>
            <DocSummary component="Swatch" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                    <Swatch
                      color={color}
                      label={label || undefined}
                      size={size}
                      radio={radio}
                      selected={selected}
                      disabled={disabled}
                      onClick={clickable ? () => setSelected(s => !s) : undefined}
                    />
                  </Box>
                </PreviewSurface>
                <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
              </Grid>

              <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOUR</EyebrowSmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                        Arbitrary data from a picker — not a palette choice, which is why Swatch is not a Button.
                      </Caption>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {SAMPLE.map(c => (
                          <Swatch key={c} color={c} size="small" selected={color === c} onClick={() => setColor(c)} />
                        ))}
                      </Stack>
                    </Box>

                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
                      <Stack direction="row" spacing={1}>
                        {SIZES.map(s => (
                          <Button key={s} size="small" variant={size === s ? 'primary' : 'primary-outline'} onClick={() => setSize(s)}>
                            {s}
                          </Button>
                        ))}
                      </Stack>
                    </Box>

                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LABEL</EyebrowSmall>
                      <TextInput value={label} onChange={(e) => setLabel(e.target.value)} fullWidth aria-label="Swatch label" />
                    </Box>

                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</EyebrowSmall>
                      <Stack spacing={1}>
                        <Switch checked={radio} onChange={(e) => setRadio(e.target.checked)} label="Radio (Style axis)" />
                        <Switch checked={clickable} onChange={(e) => setClickable(e.target.checked)} label="Clickable" />
                        <Switch checked={selected} onChange={(e) => setSelected(e.target.checked)} label="Selected" />
                        <Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} label="Disabled" />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={2}>
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                  <H5>ARIA and Semantics</H5>
                  <Stack spacing={0}>
                    {[
                      { label: 'Element', value: clickable ? '<button type="button">' : '<div> — nothing to press' },
                      { label: 'Name', value: label ? `From the visible label: "${label}"` : `No label, so the colour value: "${color}"` },
                      { label: 'Selected', value: clickable ? `aria-pressed="${selected}"` : 'Not announced — a non-clickable swatch has no pressed state' },
                      { label: 'Radio', value: radio ? 'Presentational only — aria-hidden and out of the tab order, so the swatch is one control, not two' : 'Not shown' },
                      { label: 'Colour alone', value: 'A colour is not a name. A swatch with no label needs one from the caller (WCAG 1.4.1)' },
                      { label: 'Focus', value: clickable ? '2px --Focus-Visible ring, 3px outside the chip' : 'Not focusable' },
                      { label: 'Contrast', value: 'The chip carries a --Border edge so a pale colour stays visible on a pale surface (1.4.11)' },
                    ].map(({ label: l, value }) => (
                      <Box key={l} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                        <BodySmall>{l}:</BodySmall>
                        <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value={3}>
            <DocChanges component="Swatch" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default SwatchShowcase;
