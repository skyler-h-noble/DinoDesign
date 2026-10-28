// src/components/ShapeButton/ShapeButtonShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { BackgroundPicker } from '../BackgroundPicker';
import { PreviewSurface } from '../PreviewSurface';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';
import { ShapeButton } from './ShapeButton';
import { Input as TextInput } from '../Input/Input';
import { Switch } from '../Switch/Switch';
import { MORPHABLE_SHAPES } from '../Shape/shapes';
import { shapeOptions } from '../Shape/shapeOptions';
import { Select } from '../Select/Select';
import FavoriteIcon from '@mui/icons-material/Favorite';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral'];
/* A stand-in photo: image CONTENT, so its colors are its own. */
const SAMPLE_PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" preserveAspectRatio="xMidYMid slice">'
  + '<rect width="96" height="96" fill="#cfe2dc"/><circle cx="48" cy="38" r="18" fill="#5e8f7c"/><path d="M14 96 Q48 54 82 96Z" fill="#2f5a4c"/></svg>');
const SIZES = ['small', 'medium', 'large'];
const TRIGGERS = ['selected', 'hover', 'press'];

export function ShapeButtonShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const [shape, setShape] = useState('circle');
  const [morphTo, setMorphTo] = useState('cookie-9');
  const [morphOn, setMorphOn] = useState('selected');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('large');
  const [selected, setSelected] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [label, setLabel] = useState('Favourites');
  const [image, setImage] = useState(false);


  const parts = [`shape="${shape}"`];
  if (showLabel) parts.push(`label="${label}"`);
  if (image) parts.push('imageSrc="/me.jpg"');
  if (morphTo !== 'none') parts.push(`morphTo="${morphTo}"`, `morphOn="${morphOn}"`);
  if (morphOn === 'selected' && morphTo !== 'none') parts.push('selected={on}', 'onClick={() => setOn(!on)}');
  if (color !== 'primary') parts.push(`color="${color}"`);
  if (size !== 'medium') parts.push(`size="${size}"`);
  if (!showLabel) parts.push('aria-label="Add to favourites"');
  const code = '<ShapeButton\n  ' + parts.join('\n  ') + '\n>\n  <FavoriteIcon />\n</ShapeButton>';

  const choice = (label, values, value, set) => (
    <Box>
      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>{label}</EyebrowSmall>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {values.map((v) => (
          <Button key={v} size="small" selected={value === v} variant={value === v ? 'default' : 'default-outline'} onClick={() => set(v)}>{v}</Button>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Shape Button" component="ShapeButton" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        An icon button on one of the system&rsquo;s shapes, which can morph into another on hover, press or while selected.
        The studio&rsquo;s Morph Button add-on builds the pair and the code for you.
      </BodySmall>

      <Box sx={{ mt: 2, backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
        <Tabs defaultValue={0} variant="standard">
          <TabList>
            <Tab>Summary</Tab>
            <Tab>Playground</Tab>
            <Tab>Accessibility</Tab>
            <Tab>Change Log</Tab>
          </TabList>

          <TabPanel value={0}>
            <DocSummary component="ShapeButton" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '50%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <ShapeButton shape={shape} morphTo={morphTo === 'none' ? undefined : morphTo} morphOn={morphOn}
                                 selected={selected} onClick={() => setSelected((v) => !v)}
                                 label={showLabel ? label : undefined}
                                 imageSrc={image ? SAMPLE_PHOTO : undefined}
                                 color={color} size={size} aria-label={showLabel ? undefined : 'Add to favourites'}>
                      {image ? null : <FavoriteIcon />}
                    </ShapeButton>
                    <Caption color="quiet">
                      {morphTo === 'none' ? 'No morph' : morphOn === 'selected' ? 'Click to toggle selected' : morphOn === 'hover' ? 'Hover it' : 'Press and hold'}
                    </Caption>
                  </Box>
                </PreviewSurface>
                <CodeBlock code={code} language="JSX" wrap sx={{ mt: 2 }} />
              </Grid>
              <Grid item sx={{ width: { xs: '100%', md: '50%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Switch checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} label="Label under the shape" />
                    {showLabel && (
                      <TextInput label="Label" fullWidth value={label} onChange={(e) => setLabel(e.target.value)} />
                    )}
                    <Select label="Shape" fullWidth value={shape} onChange={setShape} options={shapeOptions(MORPHABLE_SHAPES)} />
                    <Select label="Morphs to" fullWidth value={morphTo} onChange={setMorphTo}
                            options={shapeOptions(MORPHABLE_SHAPES, { extra: [{ value: 'none', label: 'none — no morph' }] })} />
                    <Switch checked={image} onChange={(e) => setImage(e.target.checked)} label="Image instead of the icon" />
                    {morphTo !== 'none' && choice('WHEN', TRIGGERS, morphOn, setMorphOn)}
                    {choice('COLOR', COLORS, color, setColor)}
                    {choice('SIZE', SIZES, size, setSize)}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={2}>
            <A11yScopeNote />
            <Box sx={{ p: 3 }}>
              <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                <H5>ARIA and Semantics</H5>
                {[
                  { label: 'Name', value: 'aria-label naming the ACTION ("Add to favourites") — it has no visible text. It warns without one.' },
                  { label: 'Toggle', value: 'morphOn="selected" makes it a toggle: aria-pressed follows `selected`, so the state is announced, not only drawn.' },
                  { label: 'Meaning', value: 'The morph is never the only sign of state — aria-pressed carries it, and the icon can change too.' },
                  { label: 'Focus', value: 'A 2px Focus-Visible ring around the button, outside the shape — the shape is drawn, not masked, so nothing clips it.' },
                  { label: 'Motion', value: 'The morph is a transition; under prefers-reduced-motion it snaps.' },
                ].map(({ label: l, value }) => (
                  <Box key={l} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                    <BodySmall>{l}:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                  </Box>
                ))}
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={3}>
            <DocChanges component="ShapeButton" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default ShapeButtonShowcase;
