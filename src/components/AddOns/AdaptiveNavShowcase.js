// src/components/AddOns/AdaptiveNavShowcase.js
//
// The Adaptive Nav page: a signpost to the studio add-on, like Charts, the
// Hero Generator and the Bento Grid. A nav is a one-off arrangement of the
// library's components rather than a component of its own, so it is generated
// — in the studio, on the user's own tokens and breakpoints — and built in
// Figma by the plugin, not shipped from this library.
import React from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { H4, Body } from '../Typography';
import { Link } from '../Link/Link';
import { VStack } from '../Stack/Stack';
import { DOCS_ORIGIN } from '../../docs/docsLink';

export const ADAPTIVE_NAV_APP_URL = `${DOCS_ORIGIN}/add-ons/nav`;

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

export function AdaptiveNavShowcase() {
  return (
    <Box>
      <ShowcaseHeader title="Adaptive Nav" />
      <VStack spacing={4} style={{ marginTop: 16 }}>
        <VStack spacing={2} style={{ maxWidth: 760 }}>
          <Body>
            Your app&rsquo;s navigation at every width, as one component &mdash; an app bar with tabs or a menu
            button, a rail, a hero with sticky tabs, and on a phone a top bar, a bottom bar or a toolbar. It is made
            in the Adaptive Nav add-on in the studio, which gives you the code and a matching Figma design.
          </Body>
          <Body>
            <Link href={ADAPTIVE_NAV_APP_URL} target="_blank" rel="noopener">Open the Adaptive Nav in the studio</Link>
          </Body>
        </VStack>

        <Section title="One nav, every width">
          <Points items={[
            ['Your breakpoints.', 'You choose what shows at each one — tabs or the menu button, the rail, search, actions, the avatar — and where the phone nav takes over. Below 600 it is always the phone arrangement; a tablet can choose the bottom bar too.'],
            ['Built from this library.', 'The parts are the components on these pages — Tabs, Button, Avatar, Rail, BottomNavigation, SearchField, MenuItem — at your Component-Size, so the nav is the same height and type as everything around it.'],
            ['Behaviour included.', 'The menu button opens a drawer of the tabs, the account menu opens from the avatar, a hero condenses into a sticky strip as it scrolls away, and signed-in and signed-out show different actions.'],
          ]} />
        </Section>

        <Section title="Accessible by construction">
          <Points items={[
            ['Named controls.', 'Icon-only buttons carry their action as their name (Open navigation, Your account); the account menu closes on Escape and on a click outside.'],
            ['The page stays clear.', 'Pinned bars leave the flow, so the page is padded by exactly what they take — in tokens, per arrangement — and nothing hides under the bar.'],
          ]} />
        </Section>

        <Section title="In code and in Figma">
          <Points items={[
            ['Code', '— one React file: wrap your page in it. Which parts show at each width is CSS from your breakpoint table; scroll, sign-in and the menu are state on the root.'],
            ['Figma', '— in the Omni Design plugin, Add-ons › Adaptive Nav: one component holding the desktop and phone navs. Which parts show is written into Devices-Type, so changing a frame’s device switches the nav, the way a Bento reflows.'],
          ]} />
        </Section>

        <Body>
          <Link href={ADAPTIVE_NAV_APP_URL} target="_blank" rel="noopener">Design a nav in the studio</Link>
        </Body>
      </VStack>
    </Box>
  );
}
