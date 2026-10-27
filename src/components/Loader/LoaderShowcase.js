// src/components/Loader/LoaderShowcase.js
import React, { useState } from 'react';
import { A11yScopeNote } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Loader, LOADER_TYPES } from './Loader';
import { Switch } from '../Switch/Switch';
import { Input as TextInput } from '../Input/Input';
import { Button } from '../Button/Button';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';

const SIZES = ['small', 'medium', 'large'];
const PALETTES = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export function LoaderShowcase() {
  const [type, setType] = useState('orbit');
  const [multicolor, setMulticolor] = useState(true);
  const [size, setSize] = useState('large');
  const [color, setColor] = useState('primary');
  const [message, setMessage] = useState('Loading...');
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const isSpinner = type === 'spinner';

  const generateCode = () => {
    const parts = [];
    if (type !== 'spinner') parts.push(`type="${type}"`);
    if (multicolor && !isSpinner) parts.push('multicolor');
    else if (color !== 'primary') parts.push(`color="${color}"`);
    if (size !== 'medium') parts.push(`size="${size}"`);
    if (message !== 'Loading...') parts.push(`message="${message}"`);
    return parts.length ? '<Loader\n  ' + parts.join('\n  ') + '\n/>' : '<Loader />';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Loader" component="Loader" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        Says the page is working when there is nothing yet to show. Six styles; all but the spinner come in one colour or three.
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
            <DocSummary component="Loader" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                    <Loader type={type} multicolor={multicolor} size={size} color={color} message={message} />
                  </Box>
                </PreviewSurface>
                <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
              </Grid>

              <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TYPE</EyebrowSmall>
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {LOADER_TYPES.map((t) => (
                          <Button key={t} size="small" selected={type === t} variant={type === t ? 'default' : 'default-outline'} onClick={() => setType(t)}>{t}</Button>
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOUR</EyebrowSmall>
                      <Switch checked={multicolor} disabled={isSpinner} onChange={(e) => setMulticolor(e.target.checked)}
                        label={isSpinner ? 'Multicolor (not for the spinner)' : 'Multicolor — Primary / Secondary / Tertiary'} />
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {PALETTES.map((p) => (
                          <Button key={p} size="small" disabled={multicolor && !isSpinner} selected={color === p}
                            variant={color === p ? 'default' : 'default-outline'} onClick={() => setColor(p)}>{p}</Button>
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</EyebrowSmall>
                      <Stack direction="row" spacing={1}>
                        {SIZES.map((s) => (
                          <Button key={s} size="small" selected={size === s} variant={size === s ? 'default' : 'default-outline'} onClick={() => setSize(s)}>{s}</Button>
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MESSAGE</EyebrowSmall>
                      <TextInput value={message} onChange={(e) => setMessage(e.target.value)} fullWidth aria-label="Loader message" />
                    </Box>
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
                  { label: 'Role', value: 'role="progressbar", named "Loading" (aria-label to rename it)' },
                  { label: 'Pieces', value: 'aria-hidden — the dots, rings and bars are decoration' },
                  { label: 'Contrast', value: 'Buttons › Border tones — 3:1 against every surface, light and dark (1.4.11)' },
                  { label: 'Motion', value: 'Under prefers-reduced-motion it keeps moving, three times slower — a still loader reads as frozen' },
                  { label: 'Message', value: message ? `Visible text: "${message}"` : 'No visible message — the name still says Loading' },
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
            <DocChanges component="Loader" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default LoaderShowcase;
