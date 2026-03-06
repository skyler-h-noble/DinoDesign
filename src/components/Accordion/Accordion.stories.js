// src/components/Accordion/Accordion.stories.js
import React, { useState } from 'react';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import { Box, Stack } from '@mui/material';

export default { title: 'Surfaces/Accordion', component: AccordionGroup };

const ITEMS = [
  { title: 'Getting Started', content: 'Follow the installation guide to set up the design system in your project.' },
  { title: 'Customization', content: 'Use design tokens to customize colors, typography, and spacing across themes.' },
  { title: 'Accessibility', content: 'All components meet WCAG 2.2 AA standards with built-in keyboard navigation.' },
];

const renderItems = (props = {}) =>
  ITEMS.map((item, i) => (
    <Accordion key={i} {...props} defaultExpanded={i === 0}>
      <AccordionSummary>{item.title}</AccordionSummary>
      <AccordionDetails>{item.content}</AccordionDetails>
    </Accordion>
  ));

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <AccordionGroup>{renderItems()}</AccordionGroup>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Default / Solid / Light)',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 500 }}>
      {['default', 'solid', 'light'].map((v) => (
        <Box key={v}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</Box>
          <AccordionGroup variant={v} color="primary">{renderItems()}</AccordionGroup>
        </Box>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 500 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <AccordionGroup key={c} variant="solid" color={c}>
          <Accordion defaultExpanded>
            <AccordionSummary>{c.charAt(0).toUpperCase() + c.slice(1)}</AccordionSummary>
            <AccordionDetails>Content in {c} solid accordion.</AccordionDetails>
          </Accordion>
        </AccordionGroup>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 500 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <AccordionGroup key={c} variant="light" color={c}>
          <Accordion defaultExpanded>
            <AccordionSummary>{c.charAt(0).toUpperCase() + c.slice(1)}</AccordionSummary>
            <AccordionDetails>Content in {c} light accordion.</AccordionDetails>
          </Accordion>
        </AccordionGroup>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 500 }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <AccordionGroup variant="solid" color="primary" size={s}>{renderItems()}</AccordionGroup>
        </Box>
      ))}
    </Stack>
  ),
};

export const Controlled = {
  name: 'Controlled Expansion',
  render: () => {
    const [expanded, setExpanded] = useState(0);
    return (
      <Box sx={{ p: 4, maxWidth: 500 }}>
        <AccordionGroup variant="light" color="info">
          {ITEMS.map((item, i) => (
            <Accordion key={i} expanded={expanded === i} onChange={(isOpen) => setExpanded(isOpen ? i : -1)}>
              <AccordionSummary>{item.title}</AccordionSummary>
              <AccordionDetails>{item.content}</AccordionDetails>
            </Accordion>
          ))}
        </AccordionGroup>
      </Box>
    );
  },
};

export const Disabled = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <AccordionGroup variant="solid" color="neutral">
        <Accordion defaultExpanded>
          <AccordionSummary>Enabled</AccordionSummary>
          <AccordionDetails>This one works normally.</AccordionDetails>
        </Accordion>
        <Accordion disabled>
          <AccordionSummary>Disabled</AccordionSummary>
          <AccordionDetails>This content is hidden.</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Also Enabled</AccordionSummary>
          <AccordionDetails>Works fine too.</AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Box>
  ),
};

export const NoDividers = {
  name: 'Disable Dividers',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <AccordionGroup variant="light" color="primary" disableDivider>{renderItems()}</AccordionGroup>
    </Box>
  ),
};

export const DefaultClosedVsOpen = {
  name: 'Default — Closed (Quiet) vs Open (Text)',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <AccordionGroup variant="default">
        <Accordion defaultExpanded>
          <AccordionSummary>Open — var(--Text)</AccordionSummary>
          <AccordionDetails>This header uses var(--Text) because it is expanded.</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Closed — var(--Text-Quiet)</AccordionSummary>
          <AccordionDetails>Content here.</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Also Closed — var(--Text-Quiet)</AccordionSummary>
          <AccordionDetails>More content.</AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Box>
  ),
};
