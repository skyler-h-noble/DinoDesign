// src/components/CodeBlock/CodeBlockShowcase.js
//
// CodeBlock had no showcase and no entry in the component gallery, so the one
// component whose whole job is to replace hand-rolled <pre>/<code> panels was
// invisible to anyone browsing the library — which is how four such panels
// ended up in the studio alone.
//
// The dark region is NOT a hardcoded color: the wrapper declares
// data-theme="Neutral" + data-surface="Surface-Dimmest", so it follows the
// brand's own neutrals and stays legible in both modes. The background picker
// below changes the surface AROUND the block to show that it holds up anywhere.
import React, { useState } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { CodeBlock } from './CodeBlock';
import { Switch } from '../Switch/Switch';
import { Input as TextInput } from '../Input/Input';
import { Button } from '../Button/Button';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import { H3, H5, BodySmall, Caption, EyebrowSmall } from '../Typography';

/* `language` is a HEADER LABEL, not a parser — nothing is highlighted by it, so
   any string works. These are the four the system actually uses. */
const LANGUAGES = ['bash', 'JSX', 'CSS', 'URL'];

const SAMPLES = {
  bash: 'npm install @omni-design/components',
  JSX: '<Button variant="primary" onClick={handleSave}>\n  Save\n</Button>',
  CSS: '[data-theme="Primary"] {\n  --Background: var(--Primary-Color-11);\n}',
  URL: 'https://example.com/api/tokens/d1bd0ba4-4906-4801-93c3-49db251f10d2',
};

export function CodeBlockShowcase() {
  const [language, setLanguage] = useState('bash');
  const [code, setCode] = useState(SAMPLES.bash);
  const [showHeader, setShowHeader] = useState(true);
  const [showCopy, setShowCopy] = useState(true);
  const [wrap, setWrap] = useState(false);
  const [capped, setCapped] = useState(false);
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');

  const pickLanguage = (l) => {
    setLanguage(l);
    // Only replace the sample when the box still holds an untouched one, so a
    // typed snippet is not thrown away by changing the label.
    if (Object.values(SAMPLES).includes(code)) setCode(SAMPLES[l]);
  };

  const generateCode = () => {
    const parts = ['code={code}'];
    if (language !== 'JSX') parts.push('language="' + language + '"');
    if (!showHeader) parts.push('showHeader={false}');
    if (!showCopy) parts.push('showCopy={false}');
    if (wrap) parts.push('wrap');
    if (capped) parts.push('maxHeight={120}');
    return '<CodeBlock\n  ' + parts.join('\n  ') + '\n/>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="CodeBlock" component="CodeBlock" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall style={{ color: 'var(--Text-Quiet)' }}>
        Any block of code, a shell command, or a copyable URL. It brings its own copy button,
        confirmation and timer, so the surrounding component should not keep a `copied` flag.
      </BodySmall>
      <Box sx={{ mt: 1 }}>
      </Box>

      {/* Layout A: the tab bar spans the page, so Summary, Accessibility and
          Change Log get the full width to read. The preview/controls split
          lives INSIDE Playground, the only tab that needs it. */}
      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
                <Tab>Summary</Tab>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
                <Tab>Change Log</Tab>
              </TabList>
<TabPanel value={0}>
                <DocSummary component="CodeBlock" theme={bgTheme} surface={bgSurface} />
              </TabPanel>
<TabPanel value={1}>
        <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
<Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>
          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Box sx={{ width: '100%', p: 2 }}>
              <CodeBlock
                code={code}
                language={language}
                showHeader={showHeader}
                showCopy={showCopy}
                wrap={wrap}
                maxHeight={capped ? 120 : undefined}
              />
            </Box>
          </PreviewSurface>

          <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
        </Grid>
          <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LANGUAGE</EyebrowSmall>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                        The header label. Nothing is highlighted from it.
                      </Caption>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                        {LANGUAGES.map((l) => (
                          <Button
                            key={l}
                            size="small"
                            variant={language === l ? 'primary' : 'primary-outline'}
                            onClick={() => pickLanguage(l)}
                          >
                            {l}
                          </Button>
                        ))}
                      </Stack>
                    </Box>

                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CODE</EyebrowSmall>
                      <TextInput
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        aria-label="Code shown in the block"
                      />
                    </Box>

                    <Box>
                      <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</EyebrowSmall>
                      <Stack spacing={1}>
                        <Switch checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} label="Show header" />
                        <Switch checked={showCopy} onChange={(e) => setShowCopy(e.target.checked)} label="Show copy button" />
                        <Switch checked={wrap} onChange={(e) => setWrap(e.target.checked)} label="Wrap long lines" />
                        <Switch checked={capped} onChange={(e) => setCapped(e.target.checked)} label="Cap height (120px)" />
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
                          { label: 'Copy button', value: showCopy ? 'IconButton with aria-label="Copy code", becoming "Copied" on success' : 'Not rendered' },
                          { label: 'Naming', value: 'The icon is the whole control, so it is named rather than labelled visibly' },
                          { label: 'Contrast', value: 'Text on the block meets 4.5:1 — it reads --Text inside a Neutral / Surface-Dimmest zone' },
                          { label: 'Color', value: 'Never a hardcoded #1e1e1e. The dark region follows the brand neutrals in both modes' },
                          { label: 'Scrolling', value: capped ? 'Capped at 120px — the region scrolls and is keyboard reachable' : 'Uncapped, so nothing scrolls' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </TabPanel>
<TabPanel value={3}>
                <DocChanges component="CodeBlock" />
              </TabPanel>
      </Tabs>

    </Box>
  );
}

export default CodeBlockShowcase;
