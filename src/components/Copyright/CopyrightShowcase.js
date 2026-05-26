// src/components/Copyright/CopyrightShowcase.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Copyright } from './Copyright';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { NumberField } from '../NumberField/NumberField';
import { H2, H3, Body, BodySmall, Caption, OverlineSmall } from '../Typography';
import { ContrastCheck } from '../_a11y/ContrastCheck';

const COLORS = [
  { value: 'default',      label: 'Default' },
  { value: 'primary',      label: 'Primary' },
  { value: 'primary-dark', label: 'Primary Dark' },
  { value: 'white',        label: 'White' },
  { value: 'black',        label: 'Black' },
];

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

export function CopyrightShowcase() {
  const [companyName, setCompanyName] = useState('DinoDesign');
  const [year, setYear] = useState(new Date().getFullYear());
  const [rights, setRights] = useState('All rights reserved');
  const [customText, setCustomText] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('default');
  const previewRef = useRef(null);
  const [copyRef, setCopyRef] = useState(null);

  useEffect(() => {
    if (!previewRef.current) return;
    setCopyRef({ current: previewRef.current.querySelector('.dino-copyright') });
  }, [color, useCustom, companyName, year, rights, customText]);

  return (
    <Box>
      <H2 style={{ marginBottom: 12 }}>Copyright</H2>
      <Body color="quiet" style={{ marginBottom: 24, maxWidth: 720 }}>
        Standalone copyright strip used at the bottom of pages. Defaults to{' '}
        <code>© {'{year}'} {'{companyName}'}. {'{rights}'}.</code> Pass{' '}
        <code>children</code> to override the entire text.
      </Body>

      {/* ─── Live preview ─── */}
      <Box ref={previewRef} sx={{ borderRadius: 1, overflow: 'hidden', mb: 4 }}>
        {useCustom ? (
          <Copyright color={color}>{customText || 'Type a custom message →'}</Copyright>
        ) : (
          <Copyright
            color={color}
            companyName={companyName}
            year={Number(year) || new Date().getFullYear()}
            rights={rights}
          />
        )}
      </Box>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
          <Tab>Playground</Tab>
          <Tab>Accessibility</Tab>
        </TabList>

        {/* Playground */}
        <TabPanel value={0}>
          <Stack spacing={3} sx={{ p: 3, maxWidth: 560 }}>
            {/* Mode */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                TEXT MODE
              </OverlineSmall>
              <Stack direction="row" spacing={1}>
                <ControlButton label="Auto-generated" selected={!useCustom} onClick={() => setUseCustom(false)} />
                <ControlButton label="Custom" selected={useCustom} onClick={() => setUseCustom(true)} />
              </Stack>
            </Box>

            {/* Auto fields */}
            {!useCustom && (
              <>
                <Input
                  label="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="DinoDesign"
                  size="medium"
                />
                <NumberField
                  label="Year"
                  value={Number(year)}
                  onChange={(v) => setYear(v)}
                  min={1900}
                  max={2100}
                />
                <Input
                  label="Rights text"
                  value={rights}
                  onChange={(e) => setRights(e.target.value)}
                  placeholder="All rights reserved"
                  size="medium"
                />
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Leave Rights blank to omit "All rights reserved." entirely.
                </Caption>
              </>
            )}

            {/* Custom text */}
            {useCustom && (
              <>
                <Input
                  label="Custom text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="© 2026 DinoDesign · MIT License · Built with love"
                  size="medium"
                  multiline
                />
                <Caption style={{ color: 'var(--Text-Quiet)' }}>
                  Pass any string (or React node) as children to fully override the auto text.
                </Caption>
              </>
            )}

            {/* Color */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                COLOR
              </OverlineSmall>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {COLORS.map((c) => (
                  <ControlButton
                    key={c.value}
                    label={c.label}
                    selected={color === c.value}
                    onClick={() => setColor(c.value)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Matches the Footer color presets so the two stack cleanly.
              </Caption>
            </Box>
          </Stack>
        </TabPanel>

        {/* Accessibility */}
        <TabPanel value={1}>
          <Stack spacing={2} sx={{ p: 3, maxWidth: 560 }}>
            <Caption style={{ color: 'var(--Text-Quiet)' }}>
              Live WCAG 2.1 contrast against the painted background. AA needs
              4.5:1 for normal text; AAA needs 7:1.
            </Caption>
            {copyRef && (
              <ContrastCheck
                targetRef={copyRef}
                label="Copyright strip"
                deps={[color, useCustom, companyName, year, rights, customText]}
              />
            )}
          </Stack>
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default CopyrightShowcase;
