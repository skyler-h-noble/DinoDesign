// src/components/IconBadge/IconBadgeShowcase.js
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
import { IconBadge } from './IconBadge';
import { ICON_SHAPES } from '../Shape/shapes';
import { shapeOptions } from '../Shape/shapeOptions';
import { Select } from '../Select/Select';
import HomeIcon from '@mui/icons-material/Home';

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const VARIANTS = ['solid', 'light', 'dark'];
const SIZES = ['small', 'medium', 'large'];

export function IconBadgeShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const [color, setColor] = useState('primary');
  const [variant, setVariant] = useState('solid');
  const [size, setSize] = useState('medium');
  const [shape, setShape] = useState('tile');

  const generateCode = () => {
    const parts = [];
    if (color !== 'primary') parts.push(`color="${color}"`);
    if (variant !== 'solid') parts.push(`variant="${variant}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (shape !== 'tile') parts.push(`shape="${shape}"`);
    return '<IconBadge' + (parts.length ? ' ' + parts.join(' ') : '') + '>\n  <HomeIcon />\n</IconBadge>';
  };

  const choice = (label, values, value, set) => (
    <Box>
      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>{label}</EyebrowSmall>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {values.map((v) => (
          <Button key={v} size="small" selected={value === v} variant={value === v ? 'default' : 'default-outline'}
                  onClick={() => set(v)}>{v}</Button>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Icon Badge" component="IconBadge" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        An icon on a themed tile — or on one of the system&rsquo;s shapes. Three sizes, from Figma&rsquo;s Component-Size modes.
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
            <DocSummary component="IconBadge" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 3 }}>
                    {SIZES.map((s) => (
                      <Box key={s} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <IconBadge color={color} variant={variant} size={s} shape={shape === 'tile' ? undefined : shape}>
                          <HomeIcon />
                        </IconBadge>
                        <Caption color={s === size ? 'standard' : 'quiet'}>{s}</Caption>
                      </Box>
                    ))}
                  </Box>
                </PreviewSurface>
                <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
              </Grid>

              <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Select label="Shape" fullWidth value={shape} onChange={setShape}
                            options={shapeOptions(ICON_SHAPES.filter((s) => s !== 'rounded'), { extra: [{ value: 'tile', label: 'tile — the drawn 8px tile' }] })} />
                    {choice('COLOR', COLORS, color, setColor)}
                    {choice('VARIANT', VARIANTS, variant, setVariant)}
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
                  { label: 'Role', value: 'None — a badge is decoration beside the text it illustrates. The icon inside is aria-hidden (the lib’s Icon default).' },
                  { label: 'When it stands alone', value: 'Give the icon an aria-label naming what it MEANS ("Secure"), not the glyph ("lock").' },
                  { label: 'Contrast', value: 'Solid: Icons/On-Icon on Icons/Icon, the pair Switch uses — 3:1 non-text contrast by construction.' },
                  { label: 'Shape', value: shape === 'tile' ? 'The drawn 8px tile.' : `"${shape}" — an icon-safe shape: the 24px glyph sits inside it at every size.` },
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
            <DocChanges component="IconBadge" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default IconBadgeShowcase;
