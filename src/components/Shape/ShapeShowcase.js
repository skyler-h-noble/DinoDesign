// src/components/Shape/ShapeShowcase.js
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
import { Shape } from './Shape';
import { SHAPE_NAMES, SHAPE_GROUPS } from './shapes';

/* A stand-in photo: image CONTENT, so its colors are its own. */
const SAMPLE_PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" preserveAspectRatio="xMidYMid slice">'
  + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc7d8"/><stop offset=".55" stop-color="#cfe2dc"/></linearGradient></defs>'
  + '<rect width="96" height="96" fill="url(#g)"/><circle cx="68" cy="28" r="10" fill="#f6d58a"/>'
  + '<path d="M0 62 L30 40 L52 58 L70 46 L96 64 V96 H0Z" fill="#5e8f7c"/><path d="M0 78 Q40 66 96 80 V96 H0Z" fill="#2f5a4c"/></svg>');

const GROUP_LABEL = {
  radius: 'Radius — follow the brand', round: 'Round', polygon: 'Soft polygons',
  cookie: 'Cookies, suns and flowers — these morph', burst: 'Bursts', pixel: 'Pixel', cut: 'Cut',
};
const COLORS = ['image', 'primary', 'secondary', 'tertiary', 'neutral', 'warning'];
const VARIANTS = ['solid', 'light', 'dark'];

export function ShapeShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const [shape, setShape] = useState('cookie-9');
  const [color, setColor] = useState('image');
  const [variant, setVariant] = useState('solid');

  const themed = color !== 'image';
  const code = '<Shape shape="' + shape + '"'
    + (themed ? ' color="' + color + '"' + (variant !== 'solid' ? ' variant="' + variant + '"' : '') : '')
    + ' width={120}>\n  ' + (themed ? 'NEW' : '<img src="…" alt="…" />') + '\n</Shape>';
  const groups = Object.keys(GROUP_LABEL).map((g) => [g, SHAPE_NAMES.filter((n) => SHAPE_GROUPS[n] === g)]);

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Shape" component="Shape" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        A box cut to one of the system&rsquo;s shapes — for image frames, accents and the occasional sticker.
        The Figma Shape component is built from the same formulas.
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
            <DocSummary component="Shape" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                    {themed ? (
                      <Shape shape={shape} color={color} variant={variant} width={120}>
                        <Caption component="span" style={{ fontWeight: 700 }}>NEW</Caption>
                      </Shape>
                    ) : (
                      <Shape shape={shape} width={120}><img src={SAMPLE_PHOTO} alt="Hills under a pale sky" /></Shape>
                    )}
                  </Box>
                </PreviewSurface>
                <CodeBlock code={code} language="JSX" wrap sx={{ mt: 2 }} />
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)' }}>FILL</EyebrowSmall>
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {COLORS.map((c) => (
                      <Button key={c} size="small" selected={color === c} variant={color === c ? 'default' : 'default-outline'} onClick={() => setColor(c)}>{c}</Button>
                    ))}
                  </Stack>
                  {themed && (
                    <>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', marginTop: 8 }}>VARIANT</EyebrowSmall>
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {VARIANTS.map((v) => (
                          <Button key={v} size="small" selected={variant === v} variant={variant === v ? 'default' : 'default-outline'} onClick={() => setVariant(v)}>{v}</Button>
                        ))}
                      </Stack>
                    </>
                  )}
                </Box>
              </Grid>

              {/* Every shape, grouped — pick one to try it. */}
              <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {groups.map(([g, names]) => (
                    <Box key={g}>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>{GROUP_LABEL[g]}</EyebrowSmall>
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {names.map((n) => (
                          <Button key={n} size="small" selected={shape === n} variant={shape === n ? 'default' : 'default-outline'}
                                  onClick={() => setShape(n)}>{n}</Button>
                        ))}
                      </Stack>
                    </Box>
                  ))}
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
                  { label: 'Meaning', value: 'None. A shape is never the only thing that says "selected" or "error".' },
                  { label: 'Decorative', value: 'decorative → aria-hidden, for accents that carry nothing.' },
                  { label: 'Images', value: 'An image inside keeps its own alt text.' },
                  { label: 'Focus', value: 'Nothing focusable inside: the mask clips focus rings. Wrap the Shape in the Link or Button.' },
                  { label: 'Text', value: 'Kept inside the shape’s safe area, so a label never runs past a burst’s spikes.' },
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
            <DocChanges component="Shape" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default ShapeShowcase;
