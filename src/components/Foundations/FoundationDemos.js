// src/components/Foundations/FoundationDemos.js
//
// Live demos for the foundation topics that have something to show.
//
// Keyed by topic title rather than passed in, so a topic without a demo simply
// renders its prose and nothing has to know which is which.
import React from 'react';
import { Box } from '@mui/material';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack, HStack } from '../Stack/Stack';
import { VideoSlot } from './VideoSlot';

/* Elevation is a CONTAINER LEVEL plus a shadow, not a shadow alone.
   The tone carries most of it, and the direction FLIPS with the mode — a
   raised thing moves AWAY from the surface it sits on, which is darker in
   light mode and lighter in dark. Measured on the Default theme:

     Container-Lowest    light #f5f5f5   dark #181818
     Container           light #f3f3f3   dark #1c1c1c
     Container-Highest   light #f1f1f1   dark #1f1f1f

   This demo used data-surface="Surface-Brightest" with a box-shadow and
   nothing else. In dark mode Surface-Brightest is #d4d4d4 — a light grey —
   so every sample rendered as a pale panel on a dark page and the ramp ran
   the wrong way. Using the container levels makes it correct in both modes
   without branching on the mode at all, which is the point of the levels. */
const ELEVATIONS = [
  { level: 0, surface: 'Container-Lowest',  use: 'Flat. A Button at rest, and anything that earns its shadow on hover.' },
  { level: 1, surface: 'Container-Low',     use: 'Button on hover; Handle and Accordion at rest; Card and Bottom Sheet at rest.' },
  { level: 2, surface: 'Container',         use: 'Card and Bottom Sheet on hover; AppBar, Toolbar and Menu at rest.' },
  { level: 3, surface: 'Container-High',    use: 'AppBar on hover; FAB at rest.' },
  { level: 4, surface: 'Container-High',    use: 'FAB on hover.' },
  { level: 5, surface: 'Container-Highest', use: 'Dialog and Modal. The top of the stack — `elevated` on one does nothing.' },
];

export function ElevationDemo() {
  return (
    <VStack gap="var(--Sizing-2)">
      <H5>The levels</H5>
      <BodySmall color="quiet">
        Each sample sets its container level AND its shadow. The tone does most of the
        work and reverses with the mode — higher moves away from the surface, so darker
        in light and lighter in dark.
      </BodySmall>
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {ELEVATIONS.map(({ level, surface, use }) => (
          <VStack key={level} gap="var(--Sizing-1)" style={{ width: 150 }}>
            <Box data-surface={surface} sx={{
              height: 72, borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
              backgroundColor: 'var(--Background)', color: 'var(--Text)',
              boxShadow: level === 0 ? 'none' : `var(--Effect-Level-${level})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Caption>Level {level}</Caption>
            </Box>
            <Caption color="quiet" style={{ display: 'block', lineHeight: 1.4 }}>{surface}</Caption>
            <Caption color="quiet" style={{ display: 'block', lineHeight: 1.4 }}>{use}</Caption>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}

/* Ten surfaces, each painted by setting the attribute — not by reading the
   token and applying it, which would prove nothing. The "used by" column is
   OBSERVED: it lists the components in this library that actually set the
   level, rather than guidance invented for the page. Where it is empty, the
   level is published and nothing in the library uses it yet. */
const SURFACES = [
  ['Surface',           'Accordion · Alert · Card · Footer · Menu · Sheet · Table · Tabs · Tooltip'],
  ['Surface-Dim',       'Autocomplete · BottomNavigation · Drawer · NumberField · Rail · TreeView'],
  ['Surface-Dimmest',   'AppBar · Chip · CodeBlock · Footer · Sheet · Tabs · Toolbar'],
  ['Surface-Bright',    'Input'],
  ['Surface-Brightest', 'Button surfaces · Card · Modal · Select · Snackbar · Section · Tooltip'],
];
const CONTAINERS = [
  ['Container',           'Card · NumberField · SearchField · TransferList'],
  ['Container-Low',       '—'],
  ['Container-Lowest',    '—'],
  ['Container-High',      'Modal'],
  ['Container-Highest',   'Paper'],
];

function SurfaceRow({ name, usedBy }) {
  return (
    <HStack gap="var(--Sizing-2)" style={{ alignItems: 'center' }} enforceMinGap={false}>
      <Box data-surface={name} sx={{
        width: 104, height: 56, flexShrink: 0,
        borderRadius: 'var(--Style-Border-Radius, 4px)',
        backgroundColor: 'var(--Background)', color: 'var(--Text)',
        border: '1px solid var(--Border-Variant)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption>Aa</Caption>
      </Box>
      {/* A plain Box, not a VStack.
          OmniStack raises its gap to --min-stack-gap when a child is "small",
          and Caption is on that list — so a 2px gap silently became 8px, the
          text block grew taller than the 56px swatch beside it, and the name
          floated above the swatch while its description sat below. It read as
          each description belonging to the NEXT row.
          The smart gap is right for a stack of controls and wrong for two
          lines of a label, so this opts out by not being a stack. */}
      {/* The leading is set on the WRAPPER.
          Typography writes lineHeight into its own sx, so a `style` prop on the
          component does not reliably win — which is why setting it there left
          the two lines as far apart as before, the name floating above the
          swatch and its description below. `& > *` reaches the rendered element
          and does. */}
      <Box sx={{ minWidth: 0, '& > *': { display: 'block', lineHeight: 1.45 } }}>
        <Caption style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{name}</Caption>
        <Caption color="quiet">{usedBy}</Caption>
      </Box>
    </HStack>
  );
}

export function SurfacesDemo() {
  return (
    <VStack gap="var(--Sizing-3)">
      <VideoSlot
        title="Setting a theme and a surface on a frame in Figma"
        shows="Both are variable modes, so they are set on the FRAME and everything inside follows. The failure this prevents is reaching for a FILL instead — which paints the box and leaves the text, borders and states on the parent's tone."
      />
      <VStack gap="var(--Sizing-1)">
        <H5>The ten levels</H5>
        <BodySmall color="quiet">
          Each swatch sets <code>data-surface</code> and paints <code>--Background</code> —
          the mechanism itself, not a copy of its value. The “used by” line is OBSERVED:
          it lists the components in this library that actually set the level, rather than
          guidance written for this page. Two container levels are published and unused.
        </BodySmall>
      </VStack>
      <VStack gap="var(--Sizing-2)">
        <EyebrowSmall>Surface — the page and the things sitting directly on it</EyebrowSmall>
        {SURFACES.map(([n, u]) => <SurfaceRow key={n} name={n} usedBy={u} />)}
      </VStack>
      <VStack gap="var(--Sizing-2)">
        <EyebrowSmall>Container — the things sitting ON a surface</EyebrowSmall>
        {CONTAINERS.map(([n, u]) => <SurfaceRow key={n} name={n} usedBy={u} />)}
      </VStack>
    </VStack>
  );
}

/* States, shown as the colours each one resolves to.
   A pseudo-class cannot be forced from JavaScript, so hovering every sample
   would need fake classes that drift from the real rules. Painting the TOKEN
   is both honest and more useful: these are the values the states resolve to
   on the surface you have selected, which is the thing you would otherwise
   have to open devtools to read. The Button is live, so its own hover and
   press are real — try it. */
const STATE_TOKENS = [
  { group: 'Background', rows: [
    ['--Background', 'the resting surface'],
    ['--Hover',      'overlay on hover — a tone picked to move AWAY from the text on it'],
    ['--Pressed',    'overlay while held'],
  ]},
  { group: 'Text', rows: [
    ['--Text',       'body copy, held to 4.5:1'],
    ['--Text-Quiet', 'secondary copy, still 4.5:1'],
    ['--Eyebrow',    'a ROTATION off the surface palette, not a muted --Text'],
  ]},
  { group: 'Headers', rows: [
    ['--Header',     'Display and H1–H3, held to 3:1'],
  ]},
  { group: 'Focus', rows: [
    ['--Focus-Visible', 'the ring, 3:1 against the background behind it'],
  ]},
  { group: 'Icons', rows: [
    ['--Icons-Default', 'the resting glyph'],
    ['--Icons-Primary', 'a branded glyph'],
  ]},
];

export function StatesDemo() {
  return (
    <VStack gap="var(--Sizing-3)">
      <VideoSlot
        title="Switching light and dark in Figma"
        shows="A mode on the Modes collection. The theme does NOT change with it — dark mode is the same theme read from the dark sheet, which is the part most often got wrong."
      />
      <VStack gap="var(--Sizing-1)">
        <H5>What each state resolves to</H5>
        <BodySmall color="quiet">
          On the theme and surface selected above. Hover and pressed are overlays rather
          than replacements, so they read as a tint of the surface beneath them.
        </BodySmall>
      </VStack>

      {STATE_TOKENS.map(({ group, rows }) => (
        <VStack key={group} gap="var(--Sizing-1)">
          <EyebrowSmall>{group}</EyebrowSmall>
          {rows.map(([token, note]) => (
            <HStack key={token} gap="var(--Sizing-2)" style={{ alignItems: 'center' }}>
              <Box sx={{
                width: 72, height: 36, flexShrink: 0,
                borderRadius: 'var(--Style-Border-Radius, 4px)',
                backgroundColor: `var(${token})`,
                border: '1px solid var(--Border-Variant)',
              }} />
              <VStack gap="2px">
                <Caption style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{token}</Caption>
                <Caption color="quiet">{note}</Caption>
              </VStack>
            </HStack>
          ))}
        </VStack>
      ))}

      <VStack gap="var(--Sizing-1)">
        <EyebrowSmall>Buttons — live, so hover and press are the real rules</EyebrowSmall>
        <BodySmall color="quiet">
          Every clickable thing needs all four states. They come from curated per-surface
          tables tuned to WCAG, so they are accessible by construction — a hover tone is
          picked to move away from the text sitting on it, not by stepping a tone index.
        </BodySmall>
      </VStack>
    </VStack>
  );
}

/* The ramps, shown on the page that explains the restriction.
   Deliberately NOT on the Colors page: there they would read as a palette to
   pick from, which is the thing this topic exists to warn against. Here they
   sit directly under "for graphics and SVGs — never for a background", so the
   picture and the rule arrive together.

   Four palettes rather than all nine. Primary, Secondary, Tertiary and Neutral
   are the ones a brand sets; the state palettes are fixed and showing them
   would pad the page without adding a decision. */
const RAMP_PALETTES = ['Primary', 'Secondary', 'Tertiary', 'Neutral'];

export function StaticColorsDemo() {
  return (
    <VStack gap="var(--Sizing-2)">
      <H5>The ramps</H5>
      <BodySmall color="quiet">
        Twelve tones per palette. Fixed colours: the same whatever surface they sit on
        and whichever mode is active — which is what makes them right for illustration
        and wrong for a background.
      </BodySmall>
      {RAMP_PALETTES.map((palette) => (
        <Box key={palette}>
          <Caption style={{ display: 'block', marginBottom: 4 }}>{palette}</Caption>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <Box key={n} sx={{ flex: '0 0 auto', width: 48, textAlign: 'center' }}>
                <Box sx={{
                  height: 40,
                  backgroundColor: `var(--${palette}-Color-${n})`,
                  border: '1px solid var(--Border-Variant)',
                }} />
                <Caption color="quiet" style={{ fontSize: 10 }}>{n}</Caption>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </VStack>
  );
}

/* Changing the size in Figma, shown rather than described.
   It is a MODE on a frame, not a property on the component, and that is the
   part prose keeps failing to convey — people look for a Size dropdown on the
   instance, find none, and conclude the component has one size. Ten seconds of
   video answers it; three paragraphs do not.

   H.264 in an .mp4 container, which every current browser plays. The .mov it
   was recorded as is reliably played only by Safari.

   398KB for ten seconds at 2178x1534. A straight rewrap of the original came
   out at 2.8MB — same frames, same container cost — so this is re-encoded
   instead. Seven times smaller for a screen recording of flat UI, which
   compresses extremely well because almost nothing moves between frames.

   No autoplay and no loop: this sits inside a reference page people read, and
   motion starting on its own pulls the eye off the text beside it. `preload`
   is metadata only, so the 2.8MB is fetched when someone presses play rather
   than on every visit to the page. */
export function ComponentSizeDemo() {
  return (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-1)">
        <H5>Changing it in Figma</H5>
        <BodySmall color="quiet">
          Component size is a variable MODE, so you set it on the FRAME and everything
          inside follows. There is no size control on the instance itself — which is the
          usual reason people think a component has only one size.
        </BodySmall>
      </VStack>

      <VideoSlot src="/videos/component-size.mp4" />

      <VStack gap="var(--Sizing-1)">
        <EyebrowSmall>The steps</EyebrowSmall>
        {[
          'Select the FRAME holding the components — not an individual instance.',
          'In the right-hand panel, open the layer’s variable modes.',
          'Set Component-Size to small, medium or large.',
          'Everything inside re-reads the collection at once: heights, radii, icons, gaps, padding, focus rings and type.',
        ].map((step, i) => (
          <HStack key={i} gap="var(--Sizing-1)" style={{ alignItems: 'flex-start' }} enforceMinGap={false}>
            <Caption color="quiet" style={{ minWidth: 16 }}>{i + 1}.</Caption>
            <BodySmall>{step}</BodySmall>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

/** Topic title -> demo. A topic with no entry renders prose only. */
export const FOUNDATION_DEMOS = {
  'Elevation': ElevationDemo,
  'Surfaces': SurfacesDemo,
  'Component size': ComponentSizeDemo,
  'Static colors': StaticColorsDemo,
  'States are generated, not chosen': StatesDemo,
};
