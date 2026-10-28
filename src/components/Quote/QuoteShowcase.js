// src/components/Quote/QuoteShowcase.js
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
import { Switch } from '../Switch/Switch';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';
import { Quote } from './Quote';

export function QuoteShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const [size, setSize] = useState('medium');
  const [align, setAlign] = useState('start');
  const [mark, setMark] = useState(true);
  const [person, setPerson] = useState(true);

  const parts = [];
  if (size !== 'medium') parts.push(`size="${size}"`);
  if (align !== 'start') parts.push(`align="${align}"`);
  if (!mark) parts.push('mark={false}');
  parts.push('cite="Priya Shah"', 'detail="Studio Lead, Northwind"');
  if (person) parts.push('avatarInitials="PS"');
  const code = '<Quote\n  ' + parts.join('\n  ') + '\n>\n  Set up in an afternoon, and it has not needed us since.\n</Quote>';

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
      <ShowcaseHeader title="Quote" component="Quote" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">A pull quote or a testimonial: the words, who said them, and what they are.</BodySmall>

      <Box sx={{ mt: 2, backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
        <Tabs defaultValue={0} variant="standard">
          <TabList>
            <Tab>Summary</Tab>
            <Tab>Playground</Tab>
            <Tab>Accessibility</Tab>
            <Tab>Change Log</Tab>
          </TabList>

          <TabPanel value={0}>
            <DocSummary component="Quote" theme={bgTheme} surface={bgSurface} />
          </TabPanel>

          <TabPanel value={1}>
            <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
                <PreviewSurface theme={bgTheme} surface={bgSurface}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
                    <Quote size={size} align={align} mark={mark} cite="Priya Shah" detail="Studio Lead, Northwind"
                           avatarInitials={person ? 'PS' : undefined}>
                      Set up in an afternoon, and it has not needed us since.
                    </Quote>
                  </Box>
                </PreviewSurface>
                <CodeBlock code={code} language="JSX" wrap sx={{ mt: 2 }} />
              </Grid>
              <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {choice('SIZE', ['small', 'medium', 'large'], size, setSize)}
                    {choice('ALIGN', ['start', 'center'], align, setAlign)}
                    <Switch checked={mark} onChange={(e) => setMark(e.target.checked)} label="Quotation mark" />
                    <Switch checked={person} onChange={(e) => setPerson(e.target.checked)} label="Avatar" />
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
                  { label: 'Structure', value: '<figure> — the words in <blockquote>, the attribution in <figcaption>. That pairing says whose words these are.' },
                  { label: 'Heading outline', value: 'The words wear the header face but render as <p>, so they add no heading to the page.' },
                  { label: 'Mark', value: 'The quotation mark is aria-hidden — the blockquote already says "quote".' },
                  { label: 'Avatar', value: 'alt="" — the name beside it already says who.' },
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
            <DocChanges component="Quote" />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default QuoteShowcase;
