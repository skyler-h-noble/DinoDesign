// src/components/Footer/FooterShowcase.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Footer } from './Footer';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { Button } from '../Button/Button';
import { SwitchInput } from '../Switch';
import { H2, H3, Body, BodySmall, Caption, OverlineSmall } from '../Typography';
import { ContrastCheck } from '../_a11y/ContrastCheck';

const SAMPLE_ADDRESS = {
  company: 'DinoDesign',
  lines: ['123 Market Street', 'San Francisco, CA 94103'],
  email: 'hello@dinodesign.dev',
  phone: '+1 (555) 010-0000',
};

const SAMPLE_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Add-ons', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
];

const SAMPLE_SOCIAL = [
  { icon: <TwitterIcon fontSize="small" />, url: 'https://twitter.com', label: 'Twitter' },
  { icon: <GitHubIcon fontSize="small" />, url: 'https://github.com', label: 'GitHub' },
  { icon: <LinkedInIcon fontSize="small" />, url: 'https://linkedin.com', label: 'LinkedIn' },
];

const COLORS = [
  { value: 'default',      label: 'Default' },
  { value: 'primary',      label: 'Primary' },
  { value: 'primary-dark', label: 'Primary Dark' },
  { value: 'white',        label: 'White' },
  { value: 'black',        label: 'Black' },
];

function ControlButton({ label, selected, onClick }) {
  return (
    <Button selected={selected} variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

export function FooterShowcase() {
  const [columnCount, setColumnCount] = useState(4);
  const [showSocial, setShowSocial] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [color, setColor] = useState('default');
  const previewRef = useRef(null);
  const [bodyRef, setBodyRef] = useState(null);
  const [copyRef, setCopyRef] = useState(null);

  // Footer renders <footer> with a <div> body inside + the Copyright strip
  // at the end. We grab refs to the actual painted elements so ContrastCheck
  // reads their computed colors.
  useEffect(() => {
    if (!previewRef.current) return;
    setBodyRef({ current: previewRef.current.querySelector('.dino-footer') });
    setCopyRef({ current: previewRef.current.querySelector('.dino-copyright') });
  }, [color, columnCount, showSocial, showSubscribe]);

  // The first column is always the address. `columns` adds 1..3 more, so
  // total columnCount = 1 + columns.length. Clamp slice accordingly.
  const extras = SAMPLE_COLUMNS.slice(0, Math.max(0, columnCount - 1));
  const liveSocial = showSocial ? SAMPLE_SOCIAL : [];
  const liveSubscribe = showSubscribe
    ? {
        title: 'Stay in the loop',
        description: 'Monthly updates on new components and tips.',
        onSubscribe: async (email) => console.log('subscribed:', email),
      }
    : undefined;

  return (
    <Box>
      <H2 style={{ marginBottom: 12 }}>Footer</H2>
      <Body color="quiet" style={{ marginBottom: 24, maxWidth: 720 }}>
        Configurable 1–4 column footer. The first column is always the
        company address / contact. Optional <code>socialLinks</code> and{' '}
        <code>subscribe</code> sit above the auto-generated copyright strip.
      </Body>

      {/* ─── Live preview ─── */}
      <Box ref={previewRef} sx={{ borderRadius: 1, overflow: 'hidden', mb: 4 }}>
        <Footer
          color={color}
          address={SAMPLE_ADDRESS}
          columns={extras}
          socialLinks={liveSocial}
          subscribe={liveSubscribe}
          copyrightName="DinoDesign"
        />
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
            {/* Column count */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                COLUMNS
              </OverlineSmall>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4].map((n) => (
                  <ControlButton
                    key={n}
                    label={String(n)}
                    selected={columnCount === n}
                    onClick={() => setColumnCount(n)}
                  />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                First column is always the address / contact. Up to 3 more link columns.
              </Caption>
            </Box>

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
                "Default" hardcodes Primary tone 2 (auto-derived in a future iteration).
              </Caption>
            </Box>

            {/* Social toggle */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                SOCIAL LINKS
              </OverlineSmall>
              <SwitchInput
                label="Show social media row"
                checked={showSocial}
                onChange={(e) => setShowSocial(e.target.checked)}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                When on, the Footer renders the <code>socialLinks</code> row (icons linking out).
                In your app, supply the icon + url pairs from your data store.
              </Caption>
            </Box>

            {/* Subscribe toggle */}
            <Box>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                SUBSCRIBE
              </OverlineSmall>
              <SwitchInput
                label="Show email subscribe form"
                checked={showSubscribe}
                onChange={(e) => setShowSubscribe(e.target.checked)}
              />
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                When on, the Footer renders an email subscribe form. Hook it up via{' '}
                <code>subscribe.onSubscribe(email)</code>.
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
            {bodyRef && (
              <ContrastCheck
                targetRef={bodyRef}
                label="Footer body"
                deps={[color, columnCount, showSocial, showSubscribe]}
              />
            )}
            {copyRef && (
              <ContrastCheck
                targetRef={copyRef}
                label="Copyright strip"
                deps={[color, columnCount, showSocial, showSubscribe]}
              />
            )}
          </Stack>
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default FooterShowcase;
