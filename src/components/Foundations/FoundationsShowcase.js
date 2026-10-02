// src/components/Foundations/FoundationsShowcase.js
//
// One page per entry in FOUNDATIONS, selected by `topic`.
//
// A page each rather than one long scroll, because these are reference facts
// people are sent TO — "read the spacing rules" should be a link, not a link
// plus an instruction to scroll. It also lets the nav carry the vocabulary:
// Platforms, Surfaces, Spacing, Elevation are the words the system uses, and a
// sidebar that says them teaches more than a single "Foundations" entry.
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { FoundationTopic } from './FoundationTopic';
import { FOUNDATION_DEMOS } from './FoundationDemos';
import { FOUNDATIONS } from '../../docs/foundations';

/** Nav id -> the topic's title in FOUNDATIONS. Ids are stable; titles are prose. */
export const FOUNDATION_TOPICS = [
  { id: 'foundation-platforms',  title: 'Platforms, not breakpoints' },
  { id: 'foundation-surfaces',   title: 'Surfaces' },
  { id: 'foundation-typography', title: 'Static and dynamic typography' },
  { id: 'foundation-spacing',    title: 'Sizing' },
  { id: 'foundation-compsize',   title: 'Component size' },
  { id: 'foundation-elevation',  title: 'Elevation' },
  { id: 'foundation-altdisplay', title: 'The Alt Display' },
  { id: 'foundation-static',     title: 'Static colours' },
  { id: 'foundation-states',     title: 'States are generated, not chosen' },
];

export function FoundationsShowcase({ topic: topicId }) {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');

  const entry = FOUNDATION_TOPICS.find(t => t.id === topicId) || FOUNDATION_TOPICS[0];
  const topic = FOUNDATIONS.find(t => t.title === entry.title);

  return (
    <Box sx={{ pb: 8 }}>
      {/* No Figma link: these are system-wide rules rather than a component, so
          there is no node to open. ShowcaseHeader omits the link when
          figmaUrlFor returns nothing, which is the case for any name not in
          the map. */}
      <ShowcaseHeader title={entry.title} component={null} />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme}
          surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      {/* The pickers are not decoration here. Half of these topics are ABOUT
          surfaces and states, and reading them on the surface they describe is
          the point — the trap panel, the code chips and the table rules all
          re-resolve. */}
      <Box
        {...(bgTheme ? { 'data-theme': bgTheme } : {})}
        data-surface={bgSurface}
        sx={{ mt: 3, p: 3, backgroundColor: 'var(--Background)', color: 'var(--Text)',
              borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))' }}
      >
        <FoundationTopic topic={topic} />
        {(() => {
          const Demo = FOUNDATION_DEMOS[entry.title];
          return Demo ? <Box sx={{ mt: 4 }}><Demo /></Box> : null;
        })()}
      </Box>
    </Box>
  );
}

export default FoundationsShowcase;
