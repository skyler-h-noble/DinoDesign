// src/components/AddOns/BentoGridShowcase.js
//
// The Bento Grid page: a signpost to the studio add-on, like Charts and the
// Hero Generator. A bento is a one-off layout rather than a component, so it
// is generated — in the studio, on the user's own tokens and layout grid — and
// built in Figma by the plugin, not shipped from this library.
import React from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { H4, Body } from '../Typography';
import { Link } from '../Link/Link';
import { VStack } from '../Stack/Stack';
import { DOCS_ORIGIN } from '../../docs/docsLink';

export const BENTO_APP_URL = `${DOCS_ORIGIN}/add-ons/bento`;

function Section({ title, children }) {
  return (
    <VStack spacing={1} style={{ maxWidth: 760 }}>
      <H4>{title}</H4>
      {children}
    </VStack>
  );
}

function Points({ items }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 0.75 }}>
      {items.map(([lead, text]) => (
        <Box component="li" key={lead}>
          <Body><strong>{lead}</strong> {text}</Body>
        </Box>
      ))}
    </Box>
  );
}

export function BentoGridShowcase() {
  return (
    <Box>
      <ShowcaseHeader title="Bento Grid" />
      <VStack spacing={4} style={{ marginTop: 16 }}>
        <VStack spacing={2} style={{ maxWidth: 760 }}>
          <Body>
            Feature tiles on your layout grid &mdash; text, stats and images in different sizes, each on its own
            surface &mdash; reflowing from 12 columns on desktop to 8 on a tablet and 4 on a phone. It is made in the
            Bento Grid add-on in the studio, which gives you the code and a matching Figma design.
          </Body>
          <Body>
            <Link href={BENTO_APP_URL} target="_blank" rel="noopener">Open the Bento Grid in the studio</Link>
          </Body>
        </VStack>

        <Section title="On your layout grid">
          <Points items={[
            ['Your columns, gutters and margins.', 'The grid is your system’s own --Columns, --Gutter and --Margin for each device, so it lines up with everything else on the page.'],
            ['Designed once.', 'You set each tile’s desktop width (3, 4, 6, 8 or 12 of 12 columns) and 1 or 2 rows. Tablet and phone follow by rule — wide tiles take the row, small ones pair up — and any tile can be set by hand.'],
          ]} />
        </Section>

        <Section title="Accessible by construction">
          <Points items={[
            ['Every tile is a surface.', 'Each tile wears a theme and a surface level, so its title, text, eyebrow and link are that surface’s own paired colors — the ones your system already tuned for contrast.'],
          ]} />
        </Section>

        <Section title="In code and in Figma">
          <Points items={[
            ['Code', '— a CSS grid on your tokens, switching spans by data-device, with screen-width fallbacks for older systems.'],
            ['Figma', '— in the Omni Design plugin, Add-ons › Bento Grid: one frame on your layout grid, Cards or flush Boxes, each tile on its own surface. Change the frame’s device type, size or page layout and the tiles reflow on their own; Copy spec brings Figma edits back to the studio.'],
          ]} />
        </Section>

        <Body>
          <Link href={BENTO_APP_URL} target="_blank" rel="noopener">Make a bento in the studio</Link>
        </Body>
      </VStack>
    </Box>
  );
}
