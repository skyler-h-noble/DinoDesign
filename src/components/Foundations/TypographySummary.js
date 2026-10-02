// src/components/Foundations/TypographySummary.js
//
// What the Typography page's Summary shows beyond the prose.
//
// Two of the FOUNDATIONS topics live HERE rather than on their own pages —
// "Static and dynamic typography" and "The Alt Display" — because both are
// about this component. A reader asking how type works should not have to find
// a separate Foundations entry to learn that half of it comes from Apple's
// table rather than the brand's scale.
import React from 'react';
import { Box } from '@mui/material';
import { H4, H5, Body, BodySmall, Caption, Typography,
         HEADER_COLORS, TEXT_COLORS, TYPOGRAPHY_STYLES,
         STYLE_TOKENS, STYLE_DEFAULT_COLOR } from '../Typography';
import { VStack, HStack } from '../Stack/Stack';
import { FoundationTopic } from './FoundationTopic';
import { HowToSlot } from './HowToSlot';
import { RoleSwatches, StyleTable } from './TokenRoles';
import { FOUNDATIONS } from '../../docs/foundations';

const topic = (title) => FOUNDATIONS.find(t => t.title === title);

/* The three Alt Display modes, shown together.
   Figma's Alt-Display collection resolves Color-Stop-1 and -2 differently per
   mode, so all three are the same two-stop gradient and only `gradient` has
   ends that differ. Side by side is the only way that reads as one mechanism
   rather than three treatments. */
const ALT_MODES = [
  { mode: 'default',  note: 'both stops → --Header. Solid, and the fallback when a brand sets no alt color.' },
  { mode: 'colored',  note: 'both stops → --Alt-Display-Color. Solid, in the brand’s alt color.' },
  { mode: 'gradient', note: 'stops → --Alt-Color-Gradient-Stop-1 / -2. The only mode whose ends differ.' },
];

export function TypographySummary() {
  return (
    <VStack gap="var(--Sizing-6)">
      <FoundationTopic topic={topic('Static and dynamic typography')} />

      <VStack gap="var(--Sizing-3)">
        <FoundationTopic topic={topic('The Alt Display')} />
        <HowToSlot
          title="The Alt-Display dropdown in Figma's right-hand panel, showing Default, Colored and Gradient"
          shows="The paint style is already a two-stop gradient with both stops bound — it renders SOLID because the Alt-Display collection sits on Default, where both stops resolve to Header. Set the frame's mode to Gradient and the same style becomes a gradient."
        />
        <VStack gap="var(--Sizing-2)">
          <H5>The three modes</H5>
          {ALT_MODES.map(({ mode, note }) => (
            <VStack key={mode} gap="var(--Sizing-Half)">
              <Typography textStyle="alt-display-small" altMode={mode}>Alt Display</Typography>
              <Caption color="quiet">
                <strong>{mode}</strong> — {note}
              </Caption>
            </VStack>
          ))}
        </VStack>
      </VStack>

      {/* Color roles, as swatches rather than a list of names — the same way
          Button answers "what can I pass to color". */}
      <VStack gap="var(--Sizing-3)">
        <VStack gap="var(--Sizing-Half)">
          <H4>Color</H4>
          <Body>
            Display and H1–H3 take <strong>--Header-*</strong>; everything else takes
            <strong> --Text-*</strong>. The header role is a display one: it carries the
            page’s larger type, where a distinct tone reads as hierarchy. At H4 and
            below the type is body-sized and usually sits inline with body copy, so a
            second tone reads as an inconsistency rather than a level.
          </Body>
          <BodySmall color="quiet">
            Headers are held to 3:1 and body text to 4.5:1, which is why they are
            separate roles rather than one token used twice.
          </BodySmall>
        </VStack>

        <RoleSwatches
          title="Header roles"
          note="Display and H1–H3. Pass as color=…"
          roles={HEADER_COLORS}
          tokenFor={(r) => r === 'default' ? '--Header' : `--Header-${r[0].toUpperCase()}${r.slice(1)}`}
        />
        <RoleSwatches
          title="Text roles"
          note="H4–H6, body, labels, captions — everything else."
          roles={TEXT_COLORS}
          tokenFor={(r) => r === 'default' ? '--Text'
            : r === 'quiet' ? '--Text-Quiet'
            : r === 'eyebrow' ? '--Eyebrow'
            : `--Text-${r[0].toUpperCase()}${r.slice(1)}`}
        />
      </VStack>

      {/* Every style with the variables it reads, generated from the component's
          own config so it cannot drift from the implementation. */}
      <VStack gap="var(--Sizing-2)">
        <VStack gap="var(--Sizing-Half)">
          <H4>Every style, and the variables it reads</H4>
          <BodySmall color="quiet">
            To change a style, set its variables in the design system rather than
            overriding the component — the token names below are exactly what the
            generator publishes. To change a color, pass <code>color</code> and
            pick from the roles above; never <code>style=&#123;&#123; color &#125;&#125;</code>,
            which bypasses the role and its contrast requirement.
          </BodySmall>
        </VStack>
        <StyleTable
          styles={TYPOGRAPHY_STYLES}
          tokensFor={(n) => STYLE_TOKENS[n] || []}
          defaultColorFor={(n) => STYLE_DEFAULT_COLOR[n]}
          render={(n) => <Typography textStyle={n}>{n}</Typography>}
        />
      </VStack>
    </VStack>
  );
}

export default TypographySummary;
