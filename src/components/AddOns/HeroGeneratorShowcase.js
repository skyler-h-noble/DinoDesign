// src/components/AddOns/HeroGeneratorShowcase.js
//
// The Hero Generator page: a signpost to the studio add-on, the way the
// Charts page is. A hero is a one-off composition rather than a component,
// so it is generated — in the studio, on the user's own tokens — and built
// in Figma by the plugin, not shipped from this library.
import React from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { H4, Body } from '../Typography';
import { Link } from '../Link/Link';
import { VStack } from '../Stack/Stack';
import { DOCS_ORIGIN } from '../../docs/docsLink';

export const HERO_APP_URL = `${DOCS_ORIGIN}/add-ons/hero`;

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

export function HeroGeneratorShowcase() {
  return (
    <Box>
      <ShowcaseHeader title="Hero Generator" />
      <VStack spacing={4} style={{ marginTop: 16 }}>
        <VStack spacing={2} style={{ maxWidth: 760 }}>
          <Body>
            A hero in your design system &mdash; an eyebrow, a headline and a line of body copy over a photo or a
            gradient &mdash; with the contrast <strong>solved</strong>, not just checked. It is made in the Hero
            Generator add-on in the studio, which gives you the code and a matching Figma design.
          </Body>
          <Body>
            <Link href={HERO_APP_URL} target="_blank" rel="noopener">Open the Hero Generator in the studio</Link>
          </Body>
        </VStack>

        <Section title="Over an image">
          <Points items={[
            ['The photo is scanned under the text.', 'The studio reads the pixels the words will actually sit on, as the photo is cropped to the hero.'],
            ['The overlay is the lightest that works.', 'It finds the lowest overlay opacity that lifts every one of those pixels to the contrast your type needs — 4.5:1 for body text, 3:1 when everything is large — so the photo shows as much as it can.'],
            ['Light or dark text, chosen for you.', 'On Auto it tries both and keeps the one that needs the lighter overlay. The overlay can be solid or strongest at the text and fading away from it.'],
          ]} />
        </Section>

        <Section title="Over a gradient">
          <Points items={[
            ['Your own tones.', 'Every stop is one of your Primary, Secondary, Tertiary or Neutral tones — a token, never a mixed color.'],
            ['One text color for the whole fill.', 'Text cannot change color partway along a gradient, so the first stop sets it (tones 1–5 take white, 6–12 near-black) and the others can only use tones on the same side. An unreadable gradient cannot be built.'],
            ['Checked along the whole ramp.', 'The weakest point is found by sampling across the gradient, not just at its stops.'],
          ]} />
        </Section>

        <Section title="In your brand, in code and in Figma">
          <Points items={[
            ['Code', '— HTML and CSS on your tokens: your type styles for the headline, body and eyebrow, your BW text colors, your tones. Full width, at full-screen height, a ratio (21:9, 16:9, 3:1, 4:3) or a fixed height.'],
            ['Figma', '— in the Omni Design plugin, Add-ons › Hero Generator. Paste the spec; for a photo, select a frame with the photo as its fill and use Render in selected frame. It is built on your file’s color variables and text styles.'],
          ]} />
        </Section>

        <Body>
          <Link href={HERO_APP_URL} target="_blank" rel="noopener">Make a hero in the studio</Link>
        </Body>
      </VStack>
    </Box>
  );
}

export default HeroGeneratorShowcase;
